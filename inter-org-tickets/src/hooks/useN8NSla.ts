/**
 * useN8NSla
 * SLA data and operations — all routed through n8n.
 * Backed by TanStack Query for caching and deduplication.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { n8nPost, N8N_WEBHOOKS } from "@/lib/n8n";

export interface SLATicket {
  id: string;
  title: string;
  customer: { name: string; avatar: string; tier: "standard" | "premium" | "enterprise" };
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  sla: {
    firstResponseTarget: string;
    firstResponseTime?: string;
    firstResponseStatus: "pending" | "met" | "breached";
    resolutionTarget: string;
    resolutionTime?: string;
    resolutionStatus: "pending" | "met" | "breached";
    percentageRemaining: number;
    timeRemaining: string;
  };
  assignee?: { name: string; avatar: string };
}

export interface SLAMetrics {
  complianceRate: number;
  complianceTrend: number;
  avgResponseMinutes: number;
  avgResponseTrend: number;
  atRiskCount: number;
  breachedCount: number;
}

const SLA_KEY = (tier?: string, status?: string) => ["sla", tier, status] as const;

export function useN8NSla(filterTier?: string, filterStatus?: string) {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: SLA_KEY(filterTier, filterStatus),
    queryFn: ({ signal }) =>
      n8nPost<{ tickets: SLATicket[]; metrics: SLAMetrics }>(
        N8N_WEBHOOKS.SLA_LIST,
        { filterTier, filterStatus },
        signal
      ).then((res) => {
        if (!res.ok || !res.data) throw new Error(res.error ?? "Failed to load SLA data");
        return res.data;
      }),
  });

  if (error instanceof Error) {
    toast({ title: "SLA load error", description: error.message, variant: "destructive" });
  }

  const escalate = useMutation({
    mutationFn: (ticketId: string) => n8nPost(N8N_WEBHOOKS.SLA_ESCALATE, { ticketId }),
    onSuccess: (_, ticketId) => {
      toast({ title: "Ticket escalated", description: `${ticketId} routed to next escalation level via n8n` });
      qc.invalidateQueries({ queryKey: SLA_KEY(filterTier, filterStatus) });
    },
    onError: (err: Error) =>
      toast({ title: "Escalation failed", description: err.message, variant: "destructive" }),
  });

  const assign = useMutation({
    mutationFn: ({ ticketId, agentName }: { ticketId: string; agentName: string }) =>
      n8nPost(N8N_WEBHOOKS.THREAD_UPDATE, { threadId: ticketId, field: "assignee", value: agentName }),
    onSuccess: (_, { ticketId, agentName }) => {
      toast({ title: "Assigned", description: `${ticketId} assigned to ${agentName}` });
      qc.invalidateQueries({ queryKey: SLA_KEY(filterTier, filterStatus) });
    },
    onError: (err: Error) =>
      toast({ title: "Assignment failed", description: err.message, variant: "destructive" }),
  });

  return {
    tickets: data?.tickets ?? [],
    metrics: data?.metrics ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    escalate: (ticketId: string) => escalate.mutate(ticketId),
    assign: (ticketId: string, agentName: string) => assign.mutate({ ticketId, agentName }),
    reload: () => refetch(),
  };
}
