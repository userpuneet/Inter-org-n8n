import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useN8NWorkflow } from "@/hooks/useN8NWorkflow";
import {
  ArrowRight, CheckCircle2, CircleDashed, Code, Plus, Save,
  Trash2, Workflow, X, Mail, AlertCircle, User, RefreshCw, Play, Pause
} from "lucide-react";

const getStepTypeColor = (type: string) => {
  switch (type) {
    case "start":       return "bg-green-100 text-green-700 border-green-200";
    case "end":         return "bg-purple-100 text-purple-700 border-purple-200";
    case "condition":   return "bg-amber-100 text-amber-700 border-amber-200";
    case "action":      return "bg-blue-100 text-blue-700 border-blue-200";
    case "notification":return "bg-red-100 text-red-700 border-red-200";
    case "assignment":  return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "approval":    return "bg-orange-100 text-orange-700 border-orange-200";
    default:            return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStepTypeIcon = (type: string) => {
  switch (type) {
    case "start":        return <CircleDashed className="h-4 w-4" />;
    case "end":          return <CheckCircle2 className="h-4 w-4" />;
    case "condition":    return <Code className="h-4 w-4" />;
    case "action":       return <Workflow className="h-4 w-4" />;
    case "notification": return <Mail className="h-4 w-4" />;
    case "assignment":   return <User className="h-4 w-4" />;
    case "approval":     return <CheckCircle2 className="h-4 w-4" />;
    default:             return <CircleDashed className="h-4 w-4" />;
  }
};

const WorkflowStudioPage = () => {
  const navigate = useNavigate();
  const { workflows, templates, loading, saving, save, activate, deactivate, execute, remove, reload } = useN8NWorkflow();
  const [activeTab, setActiveTab] = useState("builder");
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId) ?? workflows[0] ?? null;

  const handleSave = async () => {
    if (!selectedWorkflow) return;
    await save(selectedWorkflow);
  };

  const handleActivate = async () => {
    if (!selectedWorkflow) return;
    await activate(selectedWorkflow.id);
  };

  const handleDeactivate = async () => {
    if (!selectedWorkflow) return;
    await deactivate(selectedWorkflow.id);
  };

  const handleExecute = async () => {
    if (!selectedWorkflow) return;
    await execute(selectedWorkflow.id, { triggeredBy: "manual" });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Workflow className="h-5 w-5 text-indigo-600" />
              <h1 className="text-2xl font-bold">Workflow Studio</h1>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-600 text-xs">Executed by n8n</Badge>
            </div>
            <p className="text-gray-500">Design workflows here — n8n runs and manages all executions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Sync from n8n
            </Button>
            <Button variant="outline" onClick={() => navigate("/workflows/new")}>
              <Plus className="h-4 w-4 mr-2" /> New Workflow
            </Button>
            {selectedWorkflow && (
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />{saving ? "Saving…" : "Save to n8n"}
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Workflow list */}
            <div className="lg:col-span-1 space-y-2">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-3">Your Workflows</h3>
              {workflows.map(wf => (
                <Card
                  key={wf.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${selectedWorkflowId === wf.id || (!selectedWorkflowId && workflows[0]?.id === wf.id) ? "ring-2 ring-indigo-400" : ""}`}
                  onClick={() => setSelectedWorkflowId(wf.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{wf.name}</span>
                      <Badge variant={wf.status === "active" ? "default" : "outline"} className="text-xs">
                        {wf.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{wf.steps.length} steps · {wf.category}</p>
                    {wf.n8nWorkflowId && (
                      <p className="text-xs text-indigo-400 mt-1">n8n: {wf.n8nWorkflowId}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {workflows.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-sm text-gray-400">No workflows yet</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate("/workflows/new")}>
                    Create First
                  </Button>
                </div>
              )}
            </div>

            {/* Workflow detail */}
            <div className="lg:col-span-3">
              {selectedWorkflow ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      <TabsTrigger value="builder">Builder</TabsTrigger>
                      <TabsTrigger value="triggers">Triggers</TabsTrigger>
                      <TabsTrigger value="history">Execution History</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={handleExecute}>
                        <Play className="h-3 w-3 mr-1" /> Run Now
                      </Button>
                      {selectedWorkflow.status === "active" ? (
                        <Button size="sm" variant="outline" onClick={handleDeactivate}>
                          <Pause className="h-3 w-3 mr-1" /> Deactivate
                        </Button>
                      ) : (
                        <Button size="sm" onClick={handleActivate}>
                          <Play className="h-3 w-3 mr-1" /> Activate in n8n
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => remove(selectedWorkflow.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="builder">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              value={selectedWorkflow.name}
                              className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
                              readOnly
                            />
                          </div>
                          <Badge variant={selectedWorkflow.status === "active" ? "default" : "outline"}>
                            {selectedWorkflow.status}
                          </Badge>
                        </div>
                        <CardDescription>{selectedWorkflow.description}</CardDescription>
                        {selectedWorkflow.n8nWorkflowId && (
                          <p className="text-xs text-indigo-500">n8n Workflow ID: {selectedWorkflow.n8nWorkflowId}</p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <div className="flex flex-wrap items-center gap-2">
                            {selectedWorkflow.steps.map((step, idx) => (
                              <div key={step.id} className="flex items-center gap-2">
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStepTypeColor(step.type)}`}>
                                  {getStepTypeIcon(step.type)}
                                  <span>{step.label}</span>
                                </div>
                                {idx < selectedWorkflow.steps.length - 1 && (
                                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-xs text-indigo-600">
                            <strong>n8n execution:</strong> This workflow DAG is synced to n8n.
                            When triggered, n8n executes each node sequentially, handling retries,
                            error branches, and notification dispatch automatically.
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="triggers">
                    <Card>
                      <CardHeader>
                        <CardTitle>Workflow Triggers</CardTitle>
                        <CardDescription>Events that cause n8n to start this workflow</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedWorkflow.triggers.map((trigger, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <div>
                              <p className="font-medium text-sm">{trigger.type}</p>
                              <p className="text-xs text-gray-500">{JSON.stringify(trigger.config)}</p>
                            </div>
                          </div>
                        ))}
                        {selectedWorkflow.triggers.length === 0 && (
                          <p className="text-sm text-gray-500">No triggers configured. This workflow must be triggered manually.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="history">
                    <Card>
                      <CardHeader>
                        <CardTitle>Execution History</CardTitle>
                        <CardDescription>Fetched from n8n execution logs</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">
                          Execution history is available directly in the n8n dashboard.
                          {selectedWorkflow.n8nWorkflowId && (
                            <span className="ml-1 text-indigo-600">
                              Open n8n → Workflows → {selectedWorkflow.n8nWorkflowId}
                            </span>
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Workflow className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Select a workflow to view or edit</p>
                  </div>
                </Card>
              )}

              {/* Templates */}
              {templates.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Templates from n8n</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map(tpl => (
                      <Card key={tpl.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{tpl.name}</span>
                            <Badge variant="outline">{tpl.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{tpl.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-4 w-4"><AvatarFallback className="text-[8px]">{tpl.author.avatar}</AvatarFallback></Avatar>
                              <span>{tpl.author.name}</span>
                            </div>
                            <span>{tpl.steps} steps · {tpl.usage} uses</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WorkflowStudioPage;
