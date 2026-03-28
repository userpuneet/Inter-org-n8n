
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  MessageSquare, 
  Calendar, 
  FileText, 
  BarChart3, 
  Mail, 
  Phone, 
  Search, 
  Code, 
  Settings,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  ArrowRight,
  Copy
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  icon: JSX.Element;
  category: string;
  status: "active" | "inactive" | "error" | "pending";
  description: string;
  connectedSince?: string;
  lastSync?: string;
  syncStatus?: string;
  configuration?: Record<string, any>;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed?: string;
  scopes: string[];
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  created: string;
  lastTriggered?: string;
  status: "active" | "inactive" | "error";
}

const integrations: Integration[] = [
  {
    id: "int-001",
    name: "Slack",
    icon: <MessageSquare className="h-6 w-6 text-[#4A154B]" />,
    category: "Communication",
    status: "active",
    description: "Send ticket notifications and updates to Slack channels",
    connectedSince: "2024-12-10T14:30:00Z",
    lastSync: "2025-05-09T10:15:23Z",
    syncStatus: "healthy",
    configuration: {
      workspace: "Acme Corp",
      channels: ["#support", "#alerts", "#general"],
      notifyOn: ["ticket.created", "ticket.updated", "ticket.resolved"]
    }
  },
  {
    id: "int-002",
    name: "Google Calendar",
    icon: <Calendar className="h-6 w-6 text-[#4285F4]" />,
    category: "Scheduling",
    status: "active",
    description: "Sync appointments and service calls to Google Calendar",
    connectedSince: "2025-01-05T09:45:00Z",
    lastSync: "2025-05-09T08:30:15Z",
    syncStatus: "healthy",
    configuration: {
      account: "calendar@acmecorp.com",
      calendars: ["Support Team", "On-Call Rotation"],
      twoWaySync: true
    }
  },
  {
    id: "int-003",
    name: "Salesforce",
    icon: <Database className="h-6 w-6 text-[#00A1E0]" />,
    category: "CRM",
    status: "error",
    description: "Sync customer data and tickets with Salesforce CRM",
    connectedSince: "2024-11-22T11:20:00Z",
    lastSync: "2025-05-08T22:15:45Z",
    syncStatus: "error",
    configuration: {
      instance: "acme.salesforce.com",
      objects: ["Contact", "Account", "Opportunity"],
      syncFrequency: "hourly"
    }
  },
  {
    id: "int-004",
    name: "Google Drive",
    icon: <FileText className="h-6 w-6 text-[#0F9D58]" />,
    category: "Storage",
    status: "inactive",
    description: "Store and access ticket attachments in Google Drive",
    connectedSince: "2025-02-18T15:10:00Z"
  },
  {
    id: "int-005",
    name: "Mailchimp",
    icon: <Mail className="h-6 w-6 text-[#FFE01B]" />,
    category: "Marketing",
    status: "pending",
    description: "Sync contact lists for customer communication campaigns"
  },
  {
    id: "int-006",
    name: "Stripe",
    icon: <BarChart3 className="h-6 w-6 text-[#635BFF]" />,
    category: "Billing",
    status: "active",
    description: "Process payments and manage subscriptions",
    connectedSince: "2024-10-05T13:25:00Z",
    lastSync: "2025-05-09T09:45:30Z",
    syncStatus: "healthy",
    configuration: {
      account: "Acme Corp",
      products: ["Standard Plan", "Enterprise Plan"],
      webhooks: ["invoice.paid", "subscription.created"]
    }
  }
];

const apiKeys: ApiKey[] = [
  {
    id: "key-001",
    name: "Production API Key",
    key: "pk_live_51NzJ2xGhM8NTlfg0F5HbSzNe2vgEIPL9BmMqv6yOoD27tcU2Zl3C4",
    created: "2024-11-10T10:30:00Z",
    lastUsed: "2025-05-09T08:45:00Z",
    scopes: ["read:tickets", "write:tickets", "read:customers"]
  },
  {
    id: "key-002",
    name: "Mobile App Integration",
    key: "pk_live_51NzJ2xGhM8NTlfg0F5HbSzNe2vgju7skg3DGVrtXQacvQj5VG94kt",
    created: "2025-01-22T14:15:00Z",
    lastUsed: "2025-05-09T06:30:00Z",
    scopes: ["read:tickets", "read:customers", "read:analytics"]
  },
  {
    id: "key-003",
    name: "Website Widget",
    key: "pk_live_51NzJ2xGhM8NTlfg0F5HbSzNe2vgxyNHgxMcZ7QggufnPzcX6bGLKM",
    created: "2025-03-15T09:45:00Z",
    lastUsed: "2025-05-08T22:10:00Z",
    scopes: ["write:tickets"]
  }
];

const webhooks: Webhook[] = [
  {
    id: "wh-001",
    name: "Ticket Status Updates",
    url: "https://api.acmecorp.com/webhooks/tickets",
    events: ["ticket.created", "ticket.updated", "ticket.resolved"],
    created: "2025-01-05T11:30:00Z",
    lastTriggered: "2025-05-09T10:15:23Z",
    status: "active"
  },
  {
    id: "wh-002",
    name: "Customer Data Sync",
    url: "https://api.acmecorp.com/webhooks/customers",
    events: ["customer.created", "customer.updated"],
    created: "2025-02-10T14:45:00Z",
    lastTriggered: "2025-05-09T08:20:10Z",
    status: "active"
  },
  {
    id: "wh-003",
    name: "Emergency Alerts",
    url: "https://alerts.acmecorp.com/incoming",
    events: ["ticket.priority_changed", "sla.breached"],
    created: "2025-03-22T09:15:00Z",
    lastTriggered: "2025-05-08T16:40:55Z",
    status: "error"
  }
];

const IntegrationsPage = () => {
  const [activeTab, setActiveTab] = useState("integrations");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const { toast } = useToast();
  
  const filteredIntegrations = integrations.filter(integration => {
    return (
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (categoryFilter === "all" || integration.category === categoryFilter)
    );
  });
  
  const handleIntegrationClick = (integration: Integration) => {
    setSelectedIntegration(integration);
  };
  
  const handleActivateIntegration = () => {
    toast({
      title: "Integration Activated",
      description: "The integration is now active and ready to use."
    });
  };
  
  const handleSyncNow = () => {
    toast({
      title: "Sync Started",
      description: "Syncing data between systems. This may take a few minutes."
    });
  };
  
  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "API Key Copied",
      description: "The API key has been copied to your clipboard."
    });
  };
  
  const handleTestWebhook = (id: string) => {
    toast({
      title: "Test Event Sent",
      description: "A test event has been sent to the webhook endpoint."
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Enterprise Integration Hub</h1>
            <p className="text-gray-500">Connect your support platform with your existing business systems</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="integrations">App Integrations</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="integrations">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left sidebar - integrations list */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Available Integrations</CardTitle>
                    <div className="mt-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="Search integrations..." 
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Communication">Communication</SelectItem>
                        <SelectItem value="Scheduling">Scheduling</SelectItem>
                        <SelectItem value="CRM">CRM</SelectItem>
                        <SelectItem value="Storage">Storage</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Billing">Billing</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent className="space-y-2 p-2">
                    {filteredIntegrations.map(integration => (
                      <div 
                        key={integration.id} 
                        className={`p-3 rounded-md cursor-pointer ${
                          selectedIntegration?.id === integration.id ? 'bg-primary-100 border border-primary' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleIntegrationClick(integration)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                            {integration.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{integration.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{integration.category}</Badge>
                              <Badge 
                                variant={
                                  integration.status === "active" ? "outline" : 
                                  integration.status === "error" ? "destructive" : "secondary"
                                }
                                className={integration.status === "active" ? "bg-green-50 text-green-600 border-green-200" : ""}
                              >
                                {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {filteredIntegrations.length === 0 && (
                      <div className="text-center p-4 text-gray-500">
                        No integrations found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right content - integration details */}
              <div className="lg:col-span-3">
                <Card>
                  {selectedIntegration ? (
                    <>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                            {selectedIntegration.icon}
                          </div>
                          <div>
                            <CardTitle>{selectedIntegration.name}</CardTitle>
                            <CardDescription>{selectedIntegration.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Status summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="border rounded-md p-4">
                            <p className="text-sm text-gray-500">Status</p>
                            <div className="flex items-center gap-2 mt-1">
                              {selectedIntegration.status === "active" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                              {selectedIntegration.status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                              {selectedIntegration.status === "inactive" && <Clock className="h-5 w-5 text-gray-500" />}
                              {selectedIntegration.status === "pending" && <Clock className="h-5 w-5 text-amber-500" />}
                              <span className={`font-medium ${
                                selectedIntegration.status === "active" ? "text-green-600" : 
                                selectedIntegration.status === "error" ? "text-red-600" : 
                                selectedIntegration.status === "inactive" ? "text-gray-600" :
                                "text-amber-600"
                              }`}>
                                {selectedIntegration.status.charAt(0).toUpperCase() + selectedIntegration.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          {selectedIntegration.connectedSince && (
                            <div className="border rounded-md p-4">
                              <p className="text-sm text-gray-500">Connected Since</p>
                              <p className="font-medium mt-1">
                                {new Date(selectedIntegration.connectedSince).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          )}
                          
                          {selectedIntegration.lastSync && (
                            <div className="border rounded-md p-4">
                              <p className="text-sm text-gray-500">Last Synced</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="font-medium">
                                  {new Date(selectedIntegration.lastSync).toLocaleString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                                {selectedIntegration.syncStatus === "healthy" && (
                                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Healthy</Badge>
                                )}
                                {selectedIntegration.syncStatus === "error" && (
                                  <Badge variant="destructive">Error</Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Configuration */}
                        {selectedIntegration.status === "active" && selectedIntegration.configuration && (
                          <div>
                            <h3 className="text-lg font-medium mb-4">Configuration</h3>
                            
                            {selectedIntegration.name === "Slack" && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-gray-500">Workspace</Label>
                                    <p className="font-medium">{selectedIntegration.configuration.workspace}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm text-gray-500">Connected Channels</Label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedIntegration.configuration.channels.map((channel: string) => (
                                      <Badge key={channel} variant="outline">{channel}</Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm text-gray-500">Notification Settings</Label>
                                  <div className="space-y-2 mt-1">
                                    {selectedIntegration.configuration.notifyOn.map((event: string) => (
                                      <div key={event} className="flex items-center justify-between">
                                        <p className="text-sm">{event.replace('.', ' ')}</p>
                                        <Switch defaultChecked />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {selectedIntegration.name === "Google Calendar" && (
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm text-gray-500">Connected Account</Label>
                                  <p className="font-medium">{selectedIntegration.configuration.account}</p>
                                </div>
                                
                                <div>
                                  <Label className="text-sm text-gray-500">Synced Calendars</Label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedIntegration.configuration.calendars.map((calendar: string) => (
                                      <Badge key={calendar} variant="outline">{calendar}</Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm text-gray-500">Two-way Synchronization</Label>
                                  <Switch defaultChecked={selectedIntegration.configuration.twoWaySync} />
                                </div>
                              </div>
                            )}
                            
                            {selectedIntegration.name === "Salesforce" && (
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm text-gray-500">Instance URL</Label>
                                  <p className="font-medium">{selectedIntegration.configuration.instance}</p>
                                </div>
                                
                                <div>
                                  <Label className="text-sm text-gray-500">Synced Objects</Label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedIntegration.configuration.objects.map((object: string) => (
                                      <Badge key={object} variant="outline">{object}</Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm text-gray-500">Sync Frequency</Label>
                                  <Select defaultValue={selectedIntegration.configuration.syncFrequency}>
                                    <SelectTrigger className="w-[180px] mt-1">
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="realtime">Real-time</SelectItem>
                                      <SelectItem value="hourly">Hourly</SelectItem>
                                      <SelectItem value="daily">Daily</SelectItem>
                                      <SelectItem value="weekly">Weekly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                                  <div className="flex gap-2 items-start">
                                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                    <div>
                                      <h4 className="font-medium text-red-700">Connection Error</h4>
                                      <p className="text-sm text-red-600">API connection failed: Authentication token expired. Please reconnect your Salesforce account.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {selectedIntegration.name === "Stripe" && (
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm text-gray-500">Connected Account</Label>
                                  <p className="font-medium">{selectedIntegration.configuration.account}</p>
                                </div>
                                
                                <div>
                                  <Label className="text-sm text-gray-500">Synced Products</Label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedIntegration.configuration.products.map((product: string) => (
                                      <Badge key={product} variant="outline">{product}</Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm text-gray-500">Webhook Events</Label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedIntegration.configuration.webhooks.map((event: string) => (
                                      <Badge key={event} variant="outline">{event}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {selectedIntegration.status === "error" && selectedIntegration.name === "Salesforce" && (
                          <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                            <div className="flex gap-2 items-start">
                              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-red-700">Connection Error</h4>
                                <p className="text-sm text-red-600">API connection failed: Authentication token expired. Please reconnect your Salesforce account.</p>
                                <Button className="mt-2" size="sm">Reconnect</Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {selectedIntegration.status === "inactive" && (
                          <div className="p-4 bg-gray-50 border rounded-lg">
                            <div className="flex gap-2 items-start">
                              <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium">Integration Inactive</h4>
                                <p className="text-sm text-gray-600">This integration is currently disabled. Activate it to start using it with your support system.</p>
                                <Button className="mt-2" size="sm" onClick={handleActivateIntegration}>Activate</Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {selectedIntegration.status === "pending" && (
                          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                            <div className="flex gap-2 items-start">
                              <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-amber-700">Setup Pending</h4>
                                <p className="text-sm text-amber-600">This integration requires additional setup to be completed.</p>
                                <Button className="mt-2" size="sm">Complete Setup</Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                        <div className="flex gap-2">
                          {selectedIntegration.status === "active" && (
                            <Button variant="outline" onClick={handleSyncNow}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync Now
                            </Button>
                          )}
                          {selectedIntegration.status !== "pending" && (
                            <Button variant={selectedIntegration.status === "active" ? "destructive" : "default"}>
                              {selectedIntegration.status === "active" ? "Disconnect" : "Connect"}
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12">
                      <Database className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium mb-2">Select an Integration</h3>
                      <p className="text-gray-500 text-center mb-6">Choose an integration from the list to view details and manage settings</p>
                      <Button>Browse Integration Marketplace</Button>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>API Keys</CardTitle>
                      <CardDescription>Manage access credentials for your API integrations</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New API Key
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiKeys.map(key => (
                      <Card key={key.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-base">{key.name}</CardTitle>
                            <Badge variant="outline">
                              {new Date(key.created).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md font-mono text-sm">
                            <span className="truncate">{key.key.substring(0, 24)}...</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 ml-auto" 
                              onClick={() => handleCopyApiKey(key.key)}
                            >
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Copy API key</span>
                            </Button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {key.scopes.map(scope => (
                              <Badge key={scope} variant="secondary" className="text-xs">
                                {scope}
                              </Badge>
                            ))}
                          </div>
                          
                          {key.lastUsed && (
                            <p className="text-xs text-gray-500 mt-3">
                              Last used {new Date(key.lastUsed).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <Button variant="outline" size="sm">Edit Scopes</Button>
                          <Button variant="destructive" size="sm">Revoke</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>Resources to help you integrate with our platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">API Reference</h4>
                            <p className="text-sm text-gray-500">Detailed endpoint documentation</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          View Documentation
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Code className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Code Samples</h4>
                            <p className="text-sm text-gray-500">Example integrations in various languages</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          Browse Samples
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Developer Community</h4>
                            <p className="text-sm text-gray-500">Get help from other developers</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          Join Community
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Webhooks</CardTitle>
                    <CardDescription>Receive real-time updates when events occur in your account</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Webhook
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhooks.map(webhook => (
                    <Card key={webhook.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{webhook.name}</CardTitle>
                          <Badge 
                            variant={webhook.status === "active" ? "outline" : webhook.status === "error" ? "destructive" : "secondary"}
                            className={webhook.status === "active" ? "bg-green-50 text-green-600 border-green-200" : ""}
                          >
                            {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-500">Endpoint URL</Label>
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md font-mono text-sm mt-1">
                            <span className="truncate">{webhook.url}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 ml-auto" 
                              onClick={() => handleCopyApiKey(webhook.url)}
                            >
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Copy URL</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-500">Subscribed Events</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {webhook.events.map(event => (
                              <Badge key={event} variant="outline">{event}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">
                            Created {new Date(webhook.created).toLocaleDateString()}
                          </span>
                          {webhook.lastTriggered && (
                            <span className="text-gray-500">
                              Last triggered {new Date(webhook.lastTriggered).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                        
                        {webhook.status === "error" && (
                          <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                            <div className="flex gap-2 items-center">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-600">Last request failed with status 500</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="outline" size="sm" onClick={() => handleTestWebhook(webhook.id)}>
                          Send Test Event
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Integration Activity Logs</CardTitle>
                <CardDescription>Track all integration events and data transfers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Integration
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date("2025-05-09T10:15:23Z").toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                              <MessageSquare className="h-4 w-4 text-[#4A154B]" />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">Slack</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm">Notification Sent</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Success</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Ticket #1234 update notification sent to #support
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date("2025-05-09T09:47:12Z").toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-[#4285F4]" />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">Google Calendar</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm">Event Created</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Success</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Created service appointment for customer Acme Corp
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date("2025-05-09T08:30:15Z").toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                              <BarChart3 className="h-4 w-4 text-[#635BFF]" />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">Stripe</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm">Webhook Received</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Success</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Invoice payment successful for TechFlow Inc
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date("2025-05-08T22:15:45Z").toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                              <Database className="h-4 w-4 text-[#00A1E0]" />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">Salesforce</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm">Sync Attempt</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="destructive">Failed</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Authentication token expired
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date("2025-05-08T20:42:33Z").toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                              <Mail className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">API</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm">API Key Used</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Success</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          GET /api/v1/tickets from Mobile App Integration
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">Showing 5 of 382 events</p>
                <Button variant="outline" size="sm">
                  View All Logs
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default IntegrationsPage;
