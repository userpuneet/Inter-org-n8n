/**
 * useN8NAiRouting
 * AI classification and agent routing — fully n8n-powered.
 * Backed by TanStack Query; parallel fetches use useQuery with distinct keys.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { n8nPost, N8N_WEBHOOKS } from "@/lib/n8n";

export interface ClassifiedTicket {
  id: string;
  title: string;
  content: string;
  category: string;
  confidence: number;
  suggestedTeam: string;
  suggestedAgent: {
    name: string;
    avatar: string;
    specialty: string;
    successRate: number;
  };
  priority: "low" | "medium" | "high" | "critical";
  status: "new" | "processed" | "assigned";
}

export interface AIMetrics {
  classificationAccuracy: number;
  classificationTrend: number;
  assignmentPrecision: number;
  assignmentTrend: number;
  avgProcessingSeconds: number;
  processingTrend: number;
  manualOverrideRate: number;
  overrideTrend: number;
}

export function useN8NAiRouting() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const ticketsQuery = useQuery({
    queryKey: ["ai-tickets"],
    queryFn: ({ signal }) =>
      n8nPost<ClassifiedTicket[]>(N8N_WEBHOOKS.AI_CLASSIFY, { fetch: true }, signal)
        .then((res) => res.data ?? []),
  });

  const metricsQuery = useQuery({
    queryKey: ["ai-metrics"],
    queryFn: ({ signal }) =>
      n8nPost<AIMetrics>(N8N_WEBHOOKS.AI_METRICS, {}, signal)
        .then((res) => res.data ?? null),
  });

  const assignTicket = useMutation({
    mutationFn: (ticketId: string) => n8nPost(N8N_WEBHOOKS.AI_ASSIGN, { ticketId }),
    onSuccess: (_, ticketId) => {
      qc.setQueryData<ClassifiedTicket[]>(["ai-tickets"], (prev) =>
        prev?.map((t) => t.id === ticketId ? { ...t, status: "assigned" as const } : t)
      );
      toast({ title: "Ticket Assigned", description: "Assignment confirmed via n8n AI routing" });
    },
    onError: (err: Error) =>
      toast({ title: "Assignment failed", description: err.message, variant: "destructive" }),
  });

  const processAll = useMutation({
    mutationFn: () => n8nPost(N8N_WEBHOOKS.AI_PROCESS_ALL, {}),
    onSuccess: () => {
      toast({ title: "Processing complete", description: "All new tickets classified by n8n AI workflow" });
      qc.invalidateQueries({ queryKey: ["ai-tickets"] });
    },
    onError: (err: Error) =>
      toast({ title: "Processing failed", description: err.message, variant: "destructive" }),
  });

  const logOverride = useMutation({
    mutationFn: (vars: { ticketId: string; correctedCategory: string; reason: string }) =>
      n8nPost(N8N_WEBHOOKS.AI_ASSIGN, { ...vars, override: true }),
    onSuccess: () => {
      toast({ title: "Override logged", description: "Feedback sent to n8n training workflow" });
      qc.invalidateQueries({ queryKey: ["ai-tickets"] });
    },
  });

  return {
    tickets: ticketsQuery.data ?? [],
    metrics: metricsQuery.data ?? null,
    loading: ticketsQuery.isLoading || metricsQuery.isLoading,
    processing: processAll.isPending,
    assignTicket: (ticketId: string) => assignTicket.mutate(ticketId),
    processAll: () => processAll.mutate(),
    logOverride: (ticketId: string, correctedCategory: string, reason: string) =>
      logOverride.mutate({ ticketId, correctedCategory, reason }),
    reload: () => {
      qc.invalidateQueries({ queryKey: ["ai-tickets"] });
      qc.invalidateQueries({ queryKey: ["ai-metrics"] });
    },
  };
}
