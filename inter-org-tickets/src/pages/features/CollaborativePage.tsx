
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ScreenShare,
  Users,
  MessageSquare,
  Play,
  Pause,
  Video,
  FileText,
  Calendar,
  Plus,
  Clock,
  Check,
  Share2,
  X
} from "lucide-react";

interface CollaborationSession {
  id: string;
  ticketId: string;
  name: string;
  status: "active" | "scheduled" | "completed";
  type: "screen-share" | "co-editing" | "video-call";
  startTime: string;
  endTime?: string;
  participants: {
    name: string;
    avatar: string;
    role: string;
    organization: string;
    status: "joined" | "invited" | "left";
  }[];
  relatedDocuments?: {
    id: string;
    name: string;
    type: "document" | "spreadsheet" | "image" | "code";
    lastModified: string;
  }[];
}

interface CollaborativeDocument {
  id: string;
  name: string;
  type: "document" | "spreadsheet" | "image" | "code";
  createdAt: string;
  lastModified: string;
  creator: {
    name: string;
    avatar: string;
  };
  collaborators: {
    name: string;
    avatar: string;
    status: "active" | "idle" | "offline";
  }[];
  content: string;
}

const dummySessions: CollaborationSession[] = [
  {
    id: "CS-5001",
    ticketId: "TK-1234",
    name: "API Integration Troubleshooting",
    status: "active",
    type: "screen-share",
    startTime: "2025-05-09T10:30:00Z",
    participants: [
      {
        name: "Sarah Johnson",
        avatar: "SJ",
        role: "Support Specialist",
        organization: "Support Team",
        status: "joined"
      },
      {
        name: "Michael Chen",
        avatar: "MC",
        role: "Developer",
        organization: "Acme Corp",
        status: "joined"
      },
      {
        name: "David Park",
        avatar: "DP",
        role: "Integration Expert",
        organization: "Support Team",
        status: "invited"
      }
    ],
    relatedDocuments: [
      {
        id: "DOC-1",
        name: "API Documentation.pdf",
        type: "document",
        lastModified: "2025-05-08T14:25:00Z"
      },
      {
        id: "DOC-2",
        name: "Integration Code.js",
        type: "code",
        lastModified: "2025-05-09T09:15:00Z"
      }
    ]
  },
  {
    id: "CS-5002",
    ticketId: "TK-1235",
    name: "Data Migration Planning",
    status: "scheduled",
    type: "co-editing",
    startTime: "2025-05-10T13:00:00Z",
    participants: [
      {
        name: "Lisa Wong",
        avatar: "LW",
        role: "Project Manager",
        organization: "Support Team",
        status: "joined"
      },
      {
        name: "Robert Kim",
        avatar: "RK",
        role: "Database Admin",
        organization: "GlobalSoft",
        status: "invited"
      }
    ],
    relatedDocuments: [
      {
        id: "DOC-3",
        name: "Migration Plan.xlsx",
        type: "spreadsheet",
        lastModified: "2025-05-08T16:10:00Z"
      }
    ]
  }
];

const dummyDocument: CollaborativeDocument = {
  id: "DOC-2",
  name: "Integration Code.js",
  type: "code",
  createdAt: "2025-05-07T09:00:00Z",
  lastModified: "2025-05-09T09:15:00Z",
  creator: {
    name: "Sarah Johnson",
    avatar: "SJ"
  },
  collaborators: [
    {
      name: "Michael Chen",
      avatar: "MC",
      status: "active"
    },
    {
      name: "David Park",
      avatar: "DP",
      status: "idle"
    }
  ],
  content: `// API Integration Code
const apiKey = "YOUR_API_KEY";

async function fetchData(endpoint) {
  try {
    const response = await fetch(\`https://api.example.com/\${endpoint}\`, {
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(\`API error: \${response.status}\`);
    }
    
    return await response.json();
  } catch (_error) {
    return null;
  }
}

// Issue might be here - Michael
async function processItems(items) {
  const results = [];
  
  for (const item of items) {
    // This is taking too long and causing timeouts
    const details = await fetchData(\`items/\${item.id}/details\`);
    results.push({
      ...item,
      details
    });
  }
  
  return results;
}

// Proposed fix - Sarah
async function processItemsBatch(items) {
  const batchSize = 10;
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const promises = batch.map(item => 
      fetchData(\`items/\${item.id}/details\`)
        .then(details => ({ ...item, details }))
    );
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }
  
  return results;
}

export { fetchData, processItems, processItemsBatch };`
};

const CollaborativePage = () => {
  const [activeSessions, setActiveSessions] = useState(dummySessions);
  const [activeDocument, setActiveDocument] = useState(dummyDocument);
  const [isSharing, setIsSharing] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const { toast } = useToast();
  
  const handleJoinSession = (sessionId: string) => {
    toast({
      title: "Joined Session",
      description: "You have joined the collaboration session"
    });
  };
  
  const handleStartSharing = () => {
    setIsSharing(true);
    toast({
      title: "Screen Sharing Started",
      description: "Your screen is now visible to all participants"
    });
  };
  
  const handleStopSharing = () => {
    setIsSharing(false);
    toast({
      title: "Screen Sharing Stopped",
      description: "Your screen is no longer shared"
    });
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to all participants"
    });
    
    setMessage("");
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Collaborative Resolution Tools</h1>
            <p className="text-gray-500">Work together in real-time to solve complex issues</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Collaboration Session
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <ScreenShare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Screen Sharing</h3>
                  <p className="text-sm text-gray-500">2 active sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Document Co-Editing</h3>
                  <p className="text-sm text-gray-500">5 shared documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Video className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Video Conferencing</h3>
                  <p className="text-sm text-gray-500">1 scheduled call</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Session list */}
          <Card>
            <CardHeader>
              <CardTitle>Collaboration Sessions</CardTitle>
              <CardDescription>Manage your active and upcoming collaboration sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active" onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
                  <TabsTrigger value="scheduled" className="flex-1">Scheduled</TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 space-y-3">
                  {activeSessions
                    .filter(session => {
                      if (activeTab === "active") return session.status === "active";
                      if (activeTab === "scheduled") return session.status === "scheduled";
                      if (activeTab === "completed") return session.status === "completed";
                      return true;
                    })
                    .map(session => (
                      <div key={session.id} className="border rounded-lg p-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{session.name}</h4>
                          <Badge variant={
                            session.status === "active" ? "default" :
                            session.status === "scheduled" ? "outline" :
                            "secondary"
                          }>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 flex gap-2 items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(session.startTime).toLocaleString()}
                            {session.endTime && ` - ${new Date(session.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                          </span>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex -space-x-2">
                            {session.participants.map((participant, index) => (
                              <Avatar key={index} className={`h-8 w-8 border-2 border-white ${participant.status === "joined" ? "" : "opacity-60"}`}>
                                <AvatarFallback>{participant.avatar}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-between">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {session.type === "screen-share" && <ScreenShare className="h-3 w-3" />}
                            {session.type === "co-editing" && <FileText className="h-3 w-3" />}
                            {session.type === "video-call" && <Video className="h-3 w-3" />}
                            <span>
                              {session.type === "screen-share" ? "Screen Sharing" :
                               session.type === "co-editing" ? "Co-Editing" : "Video Call"}
                            </span>
                          </Badge>
                          
                          {session.status === "active" && (
                            <Button size="sm" onClick={() => handleJoinSession(session.id)}>
                              Join
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Middle column - Document co-editing */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Document Co-Editing</CardTitle>
                  <CardDescription>Collaborate on this document in real-time</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">{activeDocument.name}</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Last updated {new Date(activeDocument.lastModified).toLocaleString()}</span>
                  <div className="flex -space-x-2">
                    {activeDocument.collaborators.map((collaborator, index) => (
                      <div key={index} className="relative">
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback>{collaborator.avatar}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
                          collaborator.status === "active" ? "bg-green-500" :
                          collaborator.status === "idle" ? "bg-amber-500" : "bg-gray-500"
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded-t-lg border-b">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-gray-50">JavaScript</Badge>
                    <Badge variant="outline" className="bg-gray-50">API Integration</Badge>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <pre className="p-4 overflow-x-auto text-sm font-mono">
                  {activeDocument.content}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CollaborativePage;
