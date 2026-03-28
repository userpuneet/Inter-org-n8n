import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useN8NAiRouting } from "@/hooks/useN8NAiRouting";
import { Bot, RefreshCw } from "lucide-react";

const AIRoutingPage = () => {
  const { tickets, metrics, loading, processing, assignTicket, processAll, reload } = useN8NAiRouting();
  const newCount       = tickets.filter(t => t.status === "new").length;
  const processedCount = tickets.filter(t => t.status === "processed").length;
  const assignedCount  = tickets.filter(t => t.status === "assigned").length;

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot className="h-5 w-5 text-blue-600" />
              <h1 className="text-2xl font-bold">AI-Powered Ticket Routing</h1>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 text-xs">Powered by n8n</Badge>
            </div>
            <p className="text-gray-500">Classify and route tickets via the n8n AI workflow engine</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={processAll} disabled={processing || loading}>
              {processing ? "Processing via n8n…" : "Process All New Tickets"}
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>AI Classification Model Performance</CardTitle>
            <CardDescription>Live metrics from n8n — updated after each workflow execution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {loading || !metrics ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)
              ) : (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Classification Accuracy</p>
                    <h3 className="text-3xl font-bold">{metrics.classificationAccuracy}%</h3>
                    <p className={`text-xs ${metrics.classificationTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {metrics.classificationTrend >= 0 ? "↑" : "↓"} {Math.abs(metrics.classificationTrend)}% from last month
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Assignment Precision</p>
                    <h3 className="text-3xl font-bold">{metrics.assignmentPrecision}%</h3>
                    <p className={`text-xs ${metrics.assignmentTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {metrics.assignmentTrend >= 0 ? "↑" : "↓"} {Math.abs(metrics.assignmentTrend)}% from last month
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Processing Time</p>
                    <h3 className="text-3xl font-bold">{metrics.avgProcessingSeconds}s</h3>
                    <p className={`text-xs ${metrics.processingTrend <= 0 ? "text-green-600" : "text-red-600"}`}>
                      {metrics.processingTrend <= 0 ? "↓" : "↑"} {Math.abs(metrics.processingTrend)}s from last month
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Manual Overrides</p>
                    <h3 className="text-3xl font-bold">{metrics.manualOverrideRate}%</h3>
                    <p className={`text-xs ${metrics.overrideTrend <= 0 ? "text-green-600" : "text-red-600"}`}>
                      {metrics.overrideTrend <= 0 ? "↓" : "↑"} {Math.abs(metrics.overrideTrend)}% from last month
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="new">
          <TabsList className="mb-4">
            <TabsTrigger value="new">
              New <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600">{newCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="processed">
              Processed <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-600">{processedCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="assigned">
              Assigned <Badge variant="outline" className="ml-2 bg-green-50 text-green-600">{assignedCount}</Badge>
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}</div>
          ) : (
            <>
              <TabsContent value="new">
                <div className="space-y-4">
                  {tickets.filter(t => t.status === "new").map(ticket => (
                    <Card key={ticket.id} className="overflow-hidden">
                      <div className="border-l-4 border-blue-500">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500">{ticket.id}</span>
                                <CardTitle>{ticket.title}</CardTitle>
                              </div>
                              <CardDescription className="mt-1 line-clamp-2">{ticket.content}</CardDescription>
                            </div>
                            <Badge variant={ticket.priority === "critical" ? "destructive" : ticket.priority === "high" ? "default" : "outline"}>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-700 mb-3">
                              n8n AI Classification Results
                              <span className="ml-2 text-xs font-normal text-blue-400">webhook/ai/classify</span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Category</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="bg-blue-50">{ticket.category}</Badge>
                                  <span className="text-xs text-blue-700">({ticket.confidence}% confidence)</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Suggested Team</p>
                                <p className="font-medium">{ticket.suggestedTeam}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Suggested Agent</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Avatar className="h-6 w-6"><AvatarFallback>{ticket.suggestedAgent.avatar}</AvatarFallback></Avatar>
                                  <span className="font-medium">{ticket.suggestedAgent.name}</span>
                                  <span className="text-xs text-green-600">({ticket.suggestedAgent.successRate}% success)</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Specialty: {ticket.suggestedAgent.specialty}</p>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button size="sm" onClick={() => assignTicket(ticket.id)}>Assign as Recommended</Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                  {newCount === 0 && <div className="text-center py-12 border rounded-lg"><p className="text-gray-500">n8n queue is clear</p></div>}
                </div>
              </TabsContent>

              <TabsContent value="processed">
                <div className="space-y-4">
                  {tickets.filter(t => t.status === "processed").map(ticket => (
                    <Card key={ticket.id} className="overflow-hidden">
                      <div className="border-l-4 border-purple-500">
                        <CardHeader>
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-500">{ticket.id}</span>
                              <CardTitle>{ticket.title}</CardTitle>
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-600">Processed</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-medium text-purple-700 mb-1">Ready for Assignment</h4>
                            <p className="text-sm text-gray-600">Classified by n8n AI workflow. Awaiting assignment.</p>
                            <div className="mt-3 flex justify-end">
                              <Button size="sm" onClick={() => assignTicket(ticket.id)}>Assign Now</Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                  {processedCount === 0 && <div className="text-center py-12 border rounded-lg"><p className="text-gray-500">No processed tickets</p></div>}
                </div>
              </TabsContent>

              <TabsContent value="assigned">
                <div className="space-y-4">
                  {tickets.filter(t => t.status === "assigned").map(ticket => (
                    <Card key={ticket.id} className="overflow-hidden">
                      <div className="border-l-4 border-green-500">
                        <CardHeader>
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-500">{ticket.id}</span>
                              <CardTitle>{ticket.title}</CardTitle>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-600">Assigned</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-700">Assigned via n8n</h4>
                            <div className="flex items-center gap-2 mt-2">
                              <Avatar className="h-6 w-6"><AvatarFallback>{ticket.suggestedAgent.avatar}</AvatarFallback></Avatar>
                              <span>Assigned to <span className="font-medium">{ticket.suggestedAgent.name}</span> · {ticket.suggestedTeam}</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                  {assignedCount === 0 && <div className="text-center py-12 border rounded-lg"><p className="text-gray-500">No assigned tickets yet</p></div>}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default AIRoutingPage;
