# OrgThread — n8n Backend Setup

n8n is OrgThread's automation and business logic engine. All backend operations
route through n8n webhook workflows before writing to Supabase.

## Architecture

```
React Frontend  →  n8n Webhooks  →  n8n Workflows  →  Supabase / External APIs
```

- **Supabase** = data storage, auth, realtime
- **n8n** = business logic, AI calls, notifications, SLA enforcement, escalation

## Quick Start

### 1. Install n8n locally

```bash
npx n8n
# or
npm install -g n8n && n8n start
```

n8n will start at http://localhost:5678

### 2. Configure environment variables

```bash
cp .env.example .env.local
# Fill in VITE_N8N_BASE_URL and VITE_N8N_API_KEY
```

### 3. Create webhook workflows in n8n

For each webhook path in `src/lib/n8n.ts → N8N_WEBHOOKS`, create
a corresponding workflow in n8n with a Webhook trigger node.

**Minimum required webhooks to start:**
- `/webhook/threads/list` — query Supabase issues table, return as Thread[]
- `/webhook/threads/create` — insert new thread to Supabase
- `/webhook/threads/update` — update thread field in Supabase

**All other webhooks** can initially return mock data via a Set node
while you build out the full workflows.

### 4. Key n8n Workflows to Build

| Webhook | n8n Workflow Purpose |
|---------|---------------------|
| `/webhook/ai/classify` | Call Claude Haiku → classify ticket → store in Supabase |
| `/webhook/ai/process-all` | Fan-out: classify all new tickets in batch |
| `/webhook/sla/list` | Query sla_timers JOIN threads JOIN sla_policies |
| `/webhook/sla/escalate` | Escalation matrix: update assignee + notify |
| `/webhook/workflows/save` | Persist workflow DAG to Supabase workflows table |
| `/webhook/workflows/execute` | Execute a workflow DAG node by node |
| `/webhook/anomaly/alerts` | Query anomaly_alerts with filters |
| `/webhook/omnichannel/send` | Route to Twilio / Resend / Meta WABA |
| `/webhook/analytics/overview` | Query materialized views, return chart data |

### 5. n8n → Supabase Connection

In n8n: **Credentials → Add → PostgreSQL**

```
Host:     your-project.supabase.co
Port:     5432
Database: postgres
User:     postgres
Password: your-db-password
SSL:      true
```

Or use the **Supabase node** (n8n has a native Supabase integration):
Credentials → Add → Supabase API → paste your URL and service role key.

## Production Deployment

1. Deploy n8n on Railway / Render / your own VPS
2. Enable HTTPS (required for webhook security)
3. Set `VITE_N8N_BASE_URL` to your production n8n URL
4. Rotate your API key and set `VITE_N8N_API_KEY`
5. Set `N8N_BASIC_AUTH_ACTIVE=true` on the n8n server if not using API key auth

## Admin Panel

Visit `/admin/n8n` in the OrgThread UI for:
- Live health check of n8n connection
- Full webhook registry
- Architecture diagram
- Environment variable reference
