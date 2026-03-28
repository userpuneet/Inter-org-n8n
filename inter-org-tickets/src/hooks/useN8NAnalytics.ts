/**
 * useN8NAnalytics
 * All analytics data aggregated by n8n workflows.
 * Backed by TanStack Query — results cached by dateRange + teamFilter.
 */
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { n8nPost, N8N_WEBHOOKS } from "@/lib/n8n";

interface DataPoint { [key: string]: string | number | null }

export interface AnalyticsData {
  ticketVolume: DataPoint[];
  responseTime: DataPoint[];
  resolutionTime: DataPoint[];
  satisfaction: DataPoint[];
  categoryDistribution: DataPoint[];
  predictiveForecast: DataPoint[];
  customerSentiment: DataPoint[];
  customerJourney: DataPoint[];
  teamPerformance: DataPoint[];
}

export function useN8NAnalytics(dateRange: string, teamFilter: string) {
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["analytics", dateRange, teamFilter],
    queryFn: ({ signal }) =>
      n8nPost<AnalyticsData>(N8N_WEBHOOKS.ANALYTICS_OVERVIEW, { dateRange, teamFilter }, signal)
        .then((res) => {
          if (!res.ok || !res.data) throw new Error(res.error ?? "Analytics load error");
          return res.data;
        }),
  });

  if (error instanceof Error) {
    toast({ title: "Analytics load error", description: error.message, variant: "destructive" });
  }

  return { data: data ?? null, loading: isLoading, reload: () => refetch() };
}
