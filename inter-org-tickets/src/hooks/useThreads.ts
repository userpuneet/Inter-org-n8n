/**
 * useThreads — re-exports useN8NThreads for backward compatibility.
 * All thread operations now route through n8n webhooks.
 */
export { useN8NThreads as useThreads } from "@/hooks/useN8NThreads";
export type { UseN8NThreadsReturn as UseThreadsReturn } from "@/hooks/useN8NThreads";
