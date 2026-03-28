
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Calendar, CheckCircle2, Clock } from "lucide-react";

interface SLATicket {
  id: string;
  title: string;
  customer: {
    name: string;
    avatar: string;
    tier: "standard" | "premium" | "enterprise";
  };
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
  assignee?: {
    name: string;
    avatar: string;
  };
}

// Helper function to determine SLA badge color
const getSLAStatusBadge = (status: string) => {
  switch (status) {
    case "met":
      return <Badge variant="outline" className="bg-green-50 text-green-600">Met</Badge>;
    case "breached":
      return <Badge variant="outline" className="bg-red-50 text-red-600">Breached</Badge>;
    default:
      return <Badge variant="outline" className="bg-amber-50 text-amber-600">Pending</Badge>;
  }
};

const dummyTickets: SLATicket[] = [
  {
    id: "TK-3001",
    title: "Website downtime during checkout process",
    customer: {
      name: "Acme Corp",
      avatar: "AC",
      tier: "enterprise"
    },
    priority: "critical",
    status: "open",
    createdAt: "2025-05-09T08:30:00Z",
    sla: {
      firstResponseTarget: "30 minutes",
      firstResponseStatus: "pending",
      resolutionTarget: "4 hours",
      resolutionStatus: "pending",
      percentageRemaining: 35,
      timeRemaining: "1h 24min"
    },
    assignee: {
      name: "Sarah Johnson",
      avatar: "SJ"
    }
  },
  {
    id: "TK-3002",
    title: "Data synchronization issue between systems",
    customer: {
      name: "TechFlow Inc",
      avatar: "TF",
      tier: "premium"
    },
    priority: "high",
    status: "in_progress",
    createdAt: "2025-05-09T09:15:00Z",
    sla: {
      firstResponseTarget: "1 hour",
      firstResponseTime: "45 minutes",
      firstResponseStatus: "met",
      resolutionTarget: "8 hours",
      resolutionStatus: "pending",
      percentageRemaining: 62,
      timeRemaining: "4h 58min"
    },
    assignee: {
      name: "Michael Chen",
      avatar: "MC"
    }
  },
  {
    id: "TK-3003",
    title: "User unable to reset password",
    customer: {
      name: "GlobalSoft",
      avatar: "GS",
      tier: "standard"
    },
    priority: "medium",
    status: "in_progress",
    createdAt: "2025-05-09T07:45:00Z",
    sla: {
      firstResponseTarget: "2 hours",
      firstResponseTime: "2h 15min",
      firstResponseStatus: "breached",
      resolutionTarget: "12 hours",
      resolutionStatus: "pending",
      percentageRemaining: 50,
      timeRemaining: "6h 00min"
    },
    assignee: {
      name: "Lisa Wong",
      avatar: "LW"
    }
  },
  {
    id: "TK-3004",
    title: "Invoice generation error for monthly subscription",
    customer: {
      name: "Quantum Dynamics",
      avatar: "QD",
      tier: "premium"
    },
    priority: "medium",
    status: "open",
    createdAt: "2025-05-09T10:30:00Z",
    sla: {
      firstResponseTarget: "1 hour",
      firstResponseStatus: "pending",
      resolutionTarget: "8 hours",
      resolutionStatus: "pending",
      percentageRemaining: 85,
      timeRemaining: "7h 15min"
    }
  },
  {
    id: "TK-3005",
    title: "Mobile app crashes on startup after update",
    customer: {
      name: "NexGen Solutions",
      avatar: "NS",
      tier: "enterprise"
    },
    priority: "high",
    status: "in_progress",
    createdAt: "2025-05-08T16:45:00Z",
    sla: {
      firstResponseTarget: "30 minutes",
      firstResponseTime: "22 minutes",
      firstResponseStatus: "met",
      resolutionTarget: "4 hours",
      resolutionTime: "5h 10min",
      resolutionStatus: "breached",
      percentageRemaining: 0,
      timeRemaining: "0h 00min"
    },
    assignee: {
      name: "John Smith",
      avatar: "JS"
    }
  }
];

const SLAManagementPage = () => {
  const [tickets, setTickets] = useState(dummyTickets);
  const [filterTier, setFilterTier] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const { toast } = useToast();
  
  const handleEscalate = (ticketId: string) => {
    toast({
      title: "Ticket Escalated",
      description: `Ticket ${ticketId} has been escalated to management.`,
    });
  };
  
  const handleAssign = (ticketId: string) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              assignee: {
                name: "Alex Rivera",
                avatar: "AR"
              } 
            }
          : ticket
      )
    );
    
    toast({
      title: "Ticket Assigned",
      description: `Ticket ${ticketId} has been assigned to Alex Rivera.`,
    });
  };
  
  const filteredTickets = tickets.filter(ticket => {
    return (
      (filterTier === undefined || ticket.customer.tier === filterTier) &&
      (filterStatus === undefined || 
        (filterStatus === "at_risk" && ticket.sla.percentageRemaining < 30) ||
        (filterStatus === "breached" && (ticket.sla.firstResponseStatus === "breached" || ticket.sla.resolutionStatus === "breached"))
      )
    );
  });

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Advanced SLA Management</h1>
            <p className="text-gray-500">Monitor and manage service level agreements across all tickets</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="at_risk">At Risk</SelectItem>
                <SelectItem value="breached">Breached</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setFilterTier(undefined);
                setFilterStatus(undefined);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SLA Compliance</p>
                    <h3 className="text-2xl font-bold">92.4%</h3>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600">
                  ↑ 3.2%
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-2 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg. Response Time</p>
                    <h3 className="text-2xl font-bold">42 min</h3>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600">
                  ↓ 5 min
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-full mr-4">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">At Risk</p>
                    <h3 className="text-2xl font-bold">3 tickets</h3>
                  </div>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-600">
                  ↑ 1
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Active SLAs</CardTitle>
            <CardDescription>Monitor and manage service level agreements for all active tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredTickets.length > 0 ? filteredTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Badge variant={ticket.priority === "critical" ? "destructive" : ticket.priority === "high" ? "default" : "outline"}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                      <span className="font-medium text-gray-500">{ticket.id}</span>
                      <h4 className="font-medium">{ticket.title}</h4>
                    </div>
                    <Badge variant="outline" className={`
                      ${ticket.customer.tier === 'enterprise' ? 'bg-purple-50 text-purple-600' : 
                        ticket.customer.tier === 'premium' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}
                    `}>
                      {ticket.customer.tier.charAt(0).toUpperCase() + ticket.customer.tier.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarFallback className="bg-gray-100">{ticket.customer.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{ticket.customer.name}</p>
                          <p className="text-sm text-gray-500">Created {new Date(ticket.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {ticket.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{ticket.assignee.avatar}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">Assigned to <span className="font-medium">{ticket.assignee.name}</span></span>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => handleAssign(ticket.id)}>Assign</Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            First Response
                          </h5>
                          {getSLAStatusBadge(ticket.sla.firstResponseStatus)}
                        </div>
                        
                        <div className="text-sm mb-1">
                          <span className="text-gray-500">Target:</span> {ticket.sla.firstResponseTarget}
                        </div>
                        
                        {ticket.sla.firstResponseTime && (
                          <div className="text-sm mb-1">
                            <span className="text-gray-500">Actual:</span> {ticket.sla.firstResponseTime}
                          </div>
                        )}
                        
                        {ticket.sla.firstResponseStatus === "pending" && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{100 - ticket.sla.percentageRemaining}%</span>
                            </div>
                            <Progress 
                              value={100 - ticket.sla.percentageRemaining} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Resolution Time
                          </h5>
                          {getSLAStatusBadge(ticket.sla.resolutionStatus)}
                        </div>
                        
                        <div className="text-sm mb-1">
                          <span className="text-gray-500">Target:</span> {ticket.sla.resolutionTarget}
                        </div>
                        
                        {ticket.sla.resolutionTime && (
                          <div className="text-sm mb-1">
                            <span className="text-gray-500">Actual:</span> {ticket.sla.resolutionTime}
                          </div>
                        )}
                        
                        {ticket.sla.resolutionStatus === "pending" && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Time Remaining</span>
                              <span>{ticket.sla.timeRemaining}</span>
                            </div>
                            <Progress 
                              value={ticket.sla.percentageRemaining} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {ticket.sla.percentageRemaining < 30 && ticket.sla.resolutionStatus === "pending" && (
                      <div className="mt-4 bg-red-50 p-3 rounded-lg border border-red-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <span className="text-red-600 font-medium">SLA At Risk</span>
                          <span className="text-red-600">Breach in {ticket.sla.timeRemaining}</span>
                        </div>
                        <Button size="sm" variant="outline" className="bg-white" onClick={() => handleEscalate(ticket.id)}>
                          Escalate
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No tickets matching current filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SLAManagementPage;
