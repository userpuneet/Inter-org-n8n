/**
 * useN8NUsers
 * User management — reads org members from n8n.
 * Backed by TanStack Query.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { n8nPost, N8N_WEBHOOKS } from "@/lib/n8n";

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  organization: string;
  avatar?: string;
  specialty?: string;
  status: "active" | "invited" | "inactive";
  lastActive?: string;
}

const USERS_KEY = ["users"] as const;

export function useN8NUsers() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: USERS_KEY,
    queryFn: ({ signal }) =>
      n8nPost<OrgUser[]>(N8N_WEBHOOKS.USERS_LIST, {}, signal)
        .then((res) => {
          if (!res.ok || !res.data) throw new Error(res.error ?? "Failed to load users");
          return res.data;
        }),
  });

  const inviteUser = useMutation({
    mutationFn: ({ email, role }: { email: string; role: OrgUser["role"] }) =>
      n8nPost(N8N_WEBHOOKS.USER_INVITE, { email, role }),
    onSuccess: (_, { email }) => {
      toast({ title: "Invitation sent", description: `Invite dispatched to ${email} via n8n` });
      qc.invalidateQueries({ queryKey: USERS_KEY });
    },
    onError: (err: Error) =>
      toast({ title: "Invite failed", description: err.message, variant: "destructive" }),
  });

  const updateUser = useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<OrgUser> }) =>
      n8nPost(N8N_WEBHOOKS.USER_UPDATE, { userId, ...updates }),
    onMutate: async ({ userId, updates }) => {
      await qc.cancelQueries({ queryKey: USERS_KEY });
      const prev = qc.getQueryData<OrgUser[]>(USERS_KEY);
      qc.setQueryData<OrgUser[]>(USERS_KEY, (old) =>
        old?.map((u) => (u.id === userId ? { ...u, ...updates } : u))
      );
      return { prev };
    },
    onError: (err: Error, _, ctx) => {
      if (ctx?.prev) qc.setQueryData(USERS_KEY, ctx.prev);
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
    onSuccess: () => toast({ title: "User updated" }),
  });

  return {
    users: data ?? [],
    loading: isLoading,
    inviteUser: (email: string, role: OrgUser["role"]) => inviteUser.mutate({ email, role }),
    updateUser: (userId: string, updates: Partial<OrgUser>) => updateUser.mutate({ userId, updates }),
    reload: () => refetch(),
  };
}
