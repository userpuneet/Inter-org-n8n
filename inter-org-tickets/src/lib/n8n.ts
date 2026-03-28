/**
 * n8n Integration Client
 *
 * All backend operations in OrgThread are routed through n8n webhooks.
 * n8n is the single source of truth for:
 *   - Thread CRUD & status transitions
 *   - SLA timer creation, breach detection & escalation
 *   - AI ticket classification & agent matching
 *   - Workflow DAG execution
 *   - Omnichannel message ingestion & dispatch
 *   - Analytics aggregation
 *   - Anomaly detection
 *   - Notification dispatch (email, Slack, etc.)
 *
 * Environment variables:
 *   VITE_N8N_BASE_URL   — e.g. https://n8n.yourdomain.com  (no trailing slash)
 *   VITE_N8N_API_KEY    — n8n API key for webhook auth (x-api-key header)
 */

const N8N_BASE = (import.meta.env.VITE_N8N_BASE_URL ?? "http://localhost:5678").replace(/\/$/, "");
const N8N_KEY  = import.meta.env.VITE_N8N_API_KEY ?? "";

// ─── Webhook path registry ────────────────────────────────────────────────────
// Every workflow in n8n is exposed via a /webhook/<slug> path.
// Add new slugs here as new n8n workflows are created.

export const N8N_WEBHOOKS = {
  // Threads
  THREADS_LIST:         "/webhook/threads/list",
  THREAD_CREATE:        "/webhook/threads/create",
  THREAD_UPDATE:        "/webhook/threads/update",
  THREAD_COMMENT_ADD:   "/webhook/threads/comment/add",
  THREAD_SIMILAR:       "/webhook/threads/similar",

  // SLA
  SLA_LIST:             "/webhook/sla/list",
  SLA_ESCALATE:         "/webhook/sla/escalate",
  SLA_POLICIES:         "/webhook/sla/policies",

  // AI Routing
  AI_CLASSIFY:          "/webhook/ai/classify",
  AI_ASSIGN:            "/webhook/ai/assign",
  AI_METRICS:           "/webhook/ai/metrics",
  AI_PROCESS_ALL:       "/webhook/ai/process-all",

  // Workflow Studio
  WORKFLOW_LIST:        "/webhook/workflows/list",
  WORKFLOW_SAVE:        "/webhook/workflows/save",
  WORKFLOW_ACTIVATE:    "/webhook/workflows/activate",
  WORKFLOW_DEACTIVATE:  "/webhook/workflows/deactivate",
  WORKFLOW_DELETE:      "/webhook/workflows/delete",
  WORKFLOW_EXECUTE:     "/webhook/workflows/execute",
  WORKFLOW_TEMPLATES:   "/webhook/workflows/templates",

  // Omnichannel
  OMNI_TICKETS_LIST:    "/webhook/omnichannel/tickets",
  OMNI_MESSAGES_LIST:   "/webhook/omnichannel/messages",
  OMNI_SEND_MESSAGE:    "/webhook/omnichannel/send",
  OMNI_CHANNEL_STATUS:  "/webhook/omnichannel/channels",

  // Analytics
  ANALYTICS_OVERVIEW:   "/webhook/analytics/overview",
  ANALYTICS_TEAM:       "/webhook/analytics/team",
  ANALYTICS_SENTIMENT:  "/webhook/analytics/sentiment",
  ANALYTICS_JOURNEY:    "/webhook/analytics/journey",
  ANALYTICS_FORECAST:   "/webhook/analytics/forecast",

  // Anomaly
  ANOMALY_ALERTS:       "/webhook/anomaly/alerts",
  ANOMALY_RESOLVE:      "/webhook/anomaly/resolve",
  ANOMALY_WEBHOOKS:     "/webhook/anomaly/webhooks",

  // Users / Org
  USERS_LIST:           "/webhook/users/list",
  USER_INVITE:          "/webhook/users/invite",
  USER_UPDATE:          "/webhook/users/update",
} as const;

export type N8NWebhook = typeof N8N_WEBHOOKS[keyof typeof N8N_WEBHOOKS];

// ─── Response wrapper ─────────────────────────────────────────────────────────

export interface N8NResponse<T = unknown> {
  ok: boolean;
  data: T | null;
  error: string | null;
  executionId?: string;
}

// ─── Core fetch ──────────────────────────────────────────────────────────────

async function n8nFetch<T = unknown>(
  webhook: string,
  payload: Record<string, unknown> = {},
  method: "POST" | "GET" = "POST",
  signal?: AbortSignal
): Promise<N8NResponse<T>> {
  try {
    const url = `${N8N_BASE}${webhook}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(N8N_KEY ? { "x-api-key": N8N_KEY } : {}),
    };

    const options: RequestInit = {
      method,
      headers,
      signal,
      ...(method === "POST" ? { body: JSON.stringify(payload) } : {}),
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, data: null, error: `n8n ${res.status}: ${text}` };
    }

    const json = await res.json();

    // n8n wraps execution results — unwrap if present
    const data: T = json?.data ?? json;
    const executionId: string | undefined = json?.executionId;

    return { ok: true, data, error: null, executionId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "n8n request failed";
    return { ok: false, data: null, error: message };
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** POST to an n8n webhook with a JSON body */
export async function n8nPost<T = unknown>(
  webhook: string,
  payload: Record<string, unknown> = {},
  signal?: AbortSignal
): Promise<N8NResponse<T>> {
  return n8nFetch<T>(webhook, payload, "POST", signal);
}

/** GET an n8n webhook (query params as payload keys) */
export async function n8nGet<T = unknown>(
  webhook: string,
  params: Record<string, unknown> = {},
  signal?: AbortSignal
): Promise<N8NResponse<T>> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  ).toString();
  const url = qs ? `${webhook}?${qs}` : webhook;
  return n8nFetch<T>(url, {}, "GET", signal);
}

// ─── Health check ─────────────────────────────────────────────────────────────

export async function checkN8NHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${N8N_BASE}/healthz`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export { N8N_BASE };
