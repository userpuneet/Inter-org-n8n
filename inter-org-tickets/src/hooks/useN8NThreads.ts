/**
 * useN8NThreads
 *
 * All thread reads & writes go through n8n webhook workflows.
 * Backed by TanStack Query for caching, deduplication, and optimistic updates.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { n8nPost, N8N_WEBHOOKS } from "@/lib/n8n";
import type { Thread, ThreadStatus, ThreadPriority } from "@/types/threads";

const QUERY_KEY = ["threads"] as const;

export interface UseN8NThreadsReturn {
  threads: Thread[];
  loading: boolean;
  error: string | null;
  updateStatus: (threadId: string, status: ThreadStatus) => void;
  updatePriority: (threadId: string, priority: ThreadPriority) => void;
  updateAssignee: (threadId: string, assignee: string | null) => void;
  addComment: (threadId: string, content: string, isInternal: boolean) => void;
  reload: () => void;
}

export function useN8NThreads(): UseN8NThreadsReturn {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ signal }) =>
      n8nPost<Thread[]>(N8N_WEBHOOKS.THREADS_LIST, { limit: 50, orderBy: "updated_at" }, signal)
        .then((res) => {
          if (!res.ok || !res.data) throw new Error(res.error ?? "Failed to load threads");
          return res.data;
        }),
  });

  const patchThread = (threadId: string, patch: Partial<Thread>) =>
    qc.setQueryData<Thread[]>(QUERY_KEY, (prev) =>
      prev?.map((t) => (t.id === threadId ? { ...t, ...patch } : t))
    );

  const updateField = useMutation({
    mutationFn: (vars: { threadId: string; field: string; value: unknown }) =>
      n8nPost(N8N_WEBHOOKS.THREAD_UPDATE, vars),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: QUERY_KEY });
      const prev = qc.getQueryData<Thread[]>(QUERY_KEY);
      patchThread(vars.threadId, { [vars.field]: vars.value } as Partial<Thread>);
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) qc.setQueryData(QUERY_KEY, ctx.prev);
      toast({ title: "Update failed", variant: "destructive" });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const addComment = useMutation({
    mutationFn: (vars: { threadId: string; content: string; isInternal: boolean }) =>
      n8nPost(N8N_WEBHOOKS.THREAD_COMMENT_ADD, vars),
    onSuccess: (_, vars) => {
      toast({ title: vars.isInternal ? "Internal note added" : "Comment posted" });
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err: Error) =>
      toast({ title: "Comment failed", description: err.message, variant: "destructive" }),
  });

  if (error instanceof Error) {
    toast({ title: "Error loading threads", description: error.message, variant: "destructive" });
  }

  return {
    threads: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    updateStatus: (threadId, status) =>
      updateField.mutate({ threadId, field: "status", value: status }),
    updatePriority: (threadId, priority) =>
      updateField.mutate({ threadId, field: "priority", value: priority }),
    updateAssignee: (threadId, assignee) =>
      updateField.mutate({ threadId, field: "assignee", value: assignee }),
    addComment: (threadId, content, isInternal) =>
      addComment.mutate({ threadId, content, isInternal }),
    reload: () => refetch(),
  };
}
