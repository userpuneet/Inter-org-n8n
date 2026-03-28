/**
 * useN8NAnomaly
 * Anomaly detection — n8n runs the detection cron and manages alert lifecycle.
 * Backed by TanStack Query — cache keyed by filters.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { n8nPost, N8N_WEBHOOKS } from "@/lib/n8n";
import type { Alert, WebhookConfig } from "@/components/anomaly/types";

const ALERTS_KEY = (filters: object) => ["anomaly-alerts", filters] as const;
const WEBHOOKS_KEY = ["anomaly-webhooks"] as const;

export function useN8NAnomaly(filters: { severity: string; type: string; timeRange: string; status: string }) {
  const { toast } = useToast();
  const qc = useQueryClient();

  const alertsQuery = useQuery({
    queryKey: ALERTS_KEY(filters),
    queryFn: ({ signal }) =>
      n8nPost<Alert[]>(N8N_WEBHOOKS.ANOMALY_ALERTS, filters, signal)
        .then((res) => res.data ?? []),
  });

  const webhooksQuery = useQuery({
    queryKey: WEBHOOKS_KEY,
    queryFn: ({ signal }) =>
      n8nPost<WebhookConfig[]>(N8N_WEBHOOKS.ANOMALY_WEBHOOKS, {}, signal)
        .then((res) => res.data ?? []),
    staleTime: 300_000, // webhook configs rarely change
  });

  const resolveAlert = useMutation({
    mutationFn: ({ alertId, action }: { alertId: string; action: "resolve" | "acknowledge" }) =>
      n8nPost(N8N_WEBHOOKS.ANOMALY_RESOLVE, { alertId, action }),
    onSuccess: (_, { alertId, action }) => {
      const status = action === "resolve" ? "resolved" : "acknowledged";
      qc.setQueryData<Alert[]>(ALERTS_KEY(filters), (prev) =>
        prev?.map((a) => a.id === alertId ? { ...a, status: status as Alert["status"] } : a)
      );
      toast({ title: action === "resolve" ? "Alert resolved" : "Alert acknowledged" });
    },
    onError: (err: Error) =>
      toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  return {
    alerts: alertsQuery.data ?? [],
    webhooks: webhooksQuery.data ?? [],
    loading: alertsQuery.isLoading,
    resolveAlert: (alertId: string) => resolveAlert.mutate({ alertId, action: "resolve" }),
    acknowledgeAlert: (alertId: string) => resolveAlert.mutate({ alertId, action: "acknowledge" }),
    reload: () => qc.invalidateQueries({ queryKey: ALERTS_KEY(filters) }),
  };
}
