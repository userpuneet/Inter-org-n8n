/**
 * N8NConfigPage
 * Admin panel for configuring and monitoring the n8n backend connection.
 * Shows webhook registry, health status, and environment config guidance.
 */
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkN8NHealth, N8N_WEBHOOKS, N8N_BASE } from "@/lib/n8n";
import { Activity, CheckCircle2, XCircle, Webhook, Settings, RefreshCw, ExternalLink } from "lucide-react";

const N8NConfigPage = () => {
  const [healthy, setHealthy] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    const ok = await checkN8NHealth();
    setHealthy(ok);
    setChecking(false);
  };

  useEffect(() => { checkHealth(); }, []);

  const webhookEntries = Object.entries(N8N_WEBHOOKS);

  // Group webhooks by domain
  const groups: Record<string, [string, string][]> = {};
  webhookEntries.forEach(([key, path]) => {
    const domain = key.split("_")[0];
    if (!groups[domain]) groups[domain] = [];
    groups[domain].push([key, path]);
  });

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-5 w-5 text-gray-600" />
              <h1 className="text-2xl font-bold">n8n Backend Configuration</h1>
            </div>
            <p className="text-gray-500">Configure and monitor the n8n automation backend connection</p>
          </div>
          <Button variant="outline" onClick={checkHealth} disabled={checking}>
            <RefreshCw className={`h-4 w-4 mr-2 ${checking ? "animate-spin" : ""}`} />
            Check Health
          </Button>
        </div>

        {/* Status banner */}
        <div className={`rounded-lg p-4 mb-6 flex items-center gap-3 border ${
          healthy === null ? "bg-gray-50 border-gray-200" :
          healthy ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        }`}>
          {healthy === null ? (
            <Activity className="h-5 w-5 text-gray-400 animate-pulse" />
          ) : healthy ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          <div>
            <p className={`font-medium ${healthy === null ? "text-gray-600" : healthy ? "text-green-700" : "text-red-700"}`}>
              {healthy === null ? "Checking n8n connection…" : healthy ? "n8n is reachable and healthy" : "Cannot reach n8n — check VITE_N8N_BASE_URL"}
            </p>
            <p className="text-sm text-gray-500">Base URL: <code className="bg-gray-100 px-1 rounded">{N8N_BASE}</code></p>
          </div>
          {healthy !== null && (
            <Badge variant={healthy ? "default" : "destructive"} className="ml-auto">
              {healthy ? "Connected" : "Disconnected"}
            </Badge>
          )}
        </div>

        <Tabs defaultValue="webhooks">
          <TabsList className="mb-4">
            <TabsTrigger value="webhooks">Webhook Registry</TabsTrigger>
            <TabsTrigger value="env">Environment Setup</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="webhooks">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                {webhookEntries.length} webhook endpoints registered — all OrgThread backend operations route through these n8n webhooks.
              </p>
              {Object.entries(groups).map(([group, entries]) => (
                <Card key={group}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm uppercase tracking-wide text-gray-500">{group}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      {entries.map(([key, path]) => (
                        <div key={key} className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50 group">
                          <div className="flex items-center gap-3">
                            <Webhook className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                            <code className="text-xs text-gray-600 font-mono">{path}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{key}</Badge>
                            <a
                              href={`${N8N_BASE}${path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="env">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>
                  Set these in your <code>.env.local</code> file (copy from <code>.env.example</code>)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>VITE_N8N_BASE_URL</Label>
                  <Input
                    readOnly
                    value={N8N_BASE}
                    className="font-mono text-sm bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    The base URL of your n8n instance. For local development: <code>http://localhost:5678</code>.
                    For production: <code>https://n8n.yourdomain.com</code>
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>VITE_N8N_API_KEY</Label>
                  <Input
                    readOnly
                    value="••••••••••••••••••••"
                    className="font-mono text-sm bg-gray-50"
                    type="password"
                  />
                  <p className="text-xs text-gray-500">
                    Your n8n API key. Found in n8n → Settings → API → Create API Key.
                    Sent as <code>x-api-key</code> header on every webhook call.
                  </p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700">
                    <strong>Note:</strong> Supabase environment variables (<code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code>) are still required — Supabase is used for auth, realtime subscriptions, and file storage. n8n handles all business logic workflows.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture">
            <Card>
              <CardHeader>
                <CardTitle>Architecture Overview</CardTitle>
                <CardDescription>How OrgThread + n8n + Supabase work together</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-700 mb-2">React Frontend</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• All UI components</li>
                        <li>• Auth state (Supabase Auth)</li>
                        <li>• Realtime subscriptions</li>
                        <li>• n8n webhook calls via hooks</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <h4 className="font-semibold text-indigo-700 mb-2">n8n (Backend Engine)</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• All business logic workflows</li>
                        <li>• AI classification (Claude/GPT)</li>
                        <li>• SLA timers & escalation</li>
                        <li>• Email/SMS/WhatsApp dispatch</li>
                        <li>• External integrations (Slack, Jira…)</li>
                        <li>• Analytics aggregation</li>
                        <li>• Anomaly detection cron</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-700 mb-2">Supabase (Data Layer)</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• PostgreSQL (all tables)</li>
                        <li>• Row-level security (RLS)</li>
                        <li>• Auth + JWT tokens</li>
                        <li>• Realtime pub/sub</li>
                        <li>• File storage</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border rounded-lg text-xs font-mono">
                    User action → React hook → n8nPost(webhook) → n8n workflow → Supabase INSERT/UPDATE → n8n returns result → React state update
                  </div>
                  <p className="text-xs text-gray-400">
                    n8n workflows can also write directly to Supabase via the Postgres node or Supabase node,
                    and trigger other downstream workflows (escalation chains, notification fans, etc.)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default N8NConfigPage;
