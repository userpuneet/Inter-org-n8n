
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Phone, Twitter, Facebook, Instagram, Send } from "lucide-react";

interface ChannelMessage {
  id: string;
  channelType: "email" | "chat" | "sms" | "social" | "call";
  socialPlatform?: "twitter" | "facebook" | "instagram";
  direction: "incoming" | "outgoing";
  content: string;
  timestamp: string;
  sender: {
    name: string;
    avatar?: string;
  };
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  ticketId: string;
}

interface OmnichannelTicket {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
    company?: string;
  };
  subject: string;
  status: "active" | "waiting" | "resolved";
  priority: "low" | "medium" | "high" | "critical";
  channels: {
    email: boolean;
    chat: boolean;
    social: boolean;
    call: boolean;
    sms: boolean;
  };
  lastActivity: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
}

// Helper function to get channel icon
const getChannelIcon = (channelType: string, socialPlatform?: string) => {
  switch (channelType) {
    case "email":
      return <Mail className="h-4 w-4" />;
    case "chat":
      return <MessageSquare className="h-4 w-4" />;
    case "call":
      return <Phone className="h-4 w-4" />;
    case "social":
      if (socialPlatform === "twitter") return <Twitter className="h-4 w-4" />;
      if (socialPlatform === "facebook") return <Facebook className="h-4 w-4" />;
      if (socialPlatform === "instagram") return <Instagram className="h-4 w-4" />;
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

// Sample data
const dummyTickets: OmnichannelTicket[] = [
  {
    id: "OMC-1001",
    customer: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      avatar: "AJ",
      company: "Acme Corp"
    },
    subject: "Login issues after recent update",
    status: "active",
    priority: "high",
    channels: {
      email: true,
      chat: true,
      social: false,
      call: true,
      sms: false
    },
    lastActivity: "2025-05-09T10:15:00Z",
    assignee: {
      name: "Sarah Kim",
      avatar: "SK"
    }
  },
  {
    id: "OMC-1002",
    customer: {
      name: "Maria Rodriguez",
      email: "maria@techflow.com",
      avatar: "MR",
      company: "TechFlow"
    },
    subject: "Billing discrepancy on subscription",
    status: "waiting",
    priority: "medium",
    channels: {
      email: true,
      chat: false,
      social: true,
      call: false,
      sms: false
    },
    lastActivity: "2025-05-09T09:30:00Z"
  },
  {
    id: "OMC-1003",
    customer: {
      name: "James Wilson",
      email: "jwilson@globalsoft.com",
      avatar: "JW",
      company: "GlobalSoft"
    },
    subject: "Feature request: Dark mode support",
    status: "active",
    priority: "low",
    channels: {
      email: true,
      chat: true,
      social: true,
      call: false,
      sms: false
    },
    lastActivity: "2025-05-09T08:45:00Z",
    assignee: {
      name: "Michael Chen",
      avatar: "MC"
    }
  }
];

const dummyMessages: ChannelMessage[] = [
  {
    id: "MSG-001",
    channelType: "email",
    direction: "incoming",
    content: "Hi, I'm experiencing issues logging into the platform after the recent update. I keep getting an 'invalid credentials' error even though I'm sure my password is correct.",
    timestamp: "2025-05-09T08:30:00Z",
    sender: {
      name: "Alex Johnson",
      avatar: "AJ"
    },
    ticketId: "OMC-1001"
  },
  {
    id: "MSG-002",
    channelType: "email",
    direction: "outgoing",
    content: "Hello Alex, I'm sorry to hear you're having trouble logging in. Let me look into this for you. Could you please confirm which browser and device you're using?",
    timestamp: "2025-05-09T09:15:00Z",
    sender: {
      name: "Sarah Kim",
      avatar: "SK"
    },
    ticketId: "OMC-1001"
  },
  {
    id: "MSG-003",
    channelType: "chat",
    direction: "incoming",
    content: "I'm using Chrome on my MacBook Pro. I've tried clearing my cache already.",
    timestamp: "2025-05-09T09:45:00Z",
    sender: {
      name: "Alex Johnson",
      avatar: "AJ"
    },
    ticketId: "OMC-1001"
  }
];

const OmnichannelPage = () => {
  const [selectedTicket, setSelectedTicket] = useState<OmnichannelTicket | null>(dummyTickets[0]);
  const [activeTab, setActiveTab] = useState("all");
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();
  
  const ticketMessages = selectedTicket 
    ? dummyMessages.filter(msg => msg.ticketId === selectedTicket.id)
    : [];

  const handleSendReply = () => {
    if (!replyContent.trim() || !selectedTicket) return;
    
    toast({
      title: "Message sent",
      description: `Your reply has been sent to ${selectedTicket.customer.name}`
    });
    
    setReplyContent("");
  };
  
  const handleAssign = (ticketId: string) => {
    toast({
      title: "Ticket assigned",
      description: "Ticket has been assigned to you"
    });
  };
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Omnichannel Support</h1>
          <p className="text-gray-500">Manage customer conversations across all communication channels</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Ticket list */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Manage all customer conversations in one place</CardDescription>
                
                <Tabs defaultValue="all" className="mt-2" onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                    <TabsTrigger value="email" className="flex-1">Email</TabsTrigger>
                    <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                    <TabsTrigger value="social" className="flex-1">Social</TabsTrigger>
                    <TabsTrigger value="call" className="flex-1">Calls</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {dummyTickets
                    .filter(ticket => {
                      if (activeTab === "all") return true;
                      return ticket.channels[activeTab as keyof typeof ticket.channels];
                    })
                    .map(ticket => (
                      <div 
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors ${
                          selectedTicket?.id === ticket.id ? "border-primary bg-primary-50" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{ticket.customer.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium line-clamp-1">{ticket.customer.name}</h4>
                              <p className="text-sm text-gray-500 line-clamp-1">{ticket.subject}</p>
                            </div>
                          </div>
                          <Badge variant={
                            ticket.priority === "critical" ? "destructive" : 
                            ticket.priority === "high" ? "default" :
                            "outline"
                          }>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex gap-1">
                            {ticket.channels.email && (
                              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Badge>
                            )}
                            {ticket.channels.chat && (
                              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Chat
                              </Badge>
                            )}
                            {ticket.channels.social && (
                              <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                                <Twitter className="h-3 w-3 mr-1" />
                                Social
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.lastActivity).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Conversation view */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {selectedTicket ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{selectedTicket.customer.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle>{selectedTicket.customer.name}</CardTitle>
                            {selectedTicket.customer.company && (
                              <Badge variant="outline" className="ml-1">
                                {selectedTicket.customer.company}
                              </Badge>
                            )}
                          </div>
                          <CardDescription>{selectedTicket.customer.email}</CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Ticket {selectedTicket.id}</span>
                        {!selectedTicket.assignee && (
                          <Button size="sm" onClick={() => handleAssign(selectedTicket.id)}>Assign to me</Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <h3 className="font-medium">{selectedTicket.subject}</h3>
                      <Badge variant={
                        selectedTicket.priority === "critical" ? "destructive" : 
                        selectedTicket.priority === "high" ? "default" :
                        "outline"
                      }>
                        {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {ticketMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.direction === "outgoing" ? "justify-end" : "justify-start"}`}>
                        <div className={`
                          max-w-[80%] rounded-lg p-3 
                          ${message.direction === "outgoing" ? 
                            "bg-primary text-primary-foreground" : 
                            "bg-gray-100"
                          }
                        `}>
                          <div className="flex items-center gap-2 mb-1">
                            {message.direction === "incoming" ? (
                              <>
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs">{message.sender.avatar}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{message.sender.name}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-sm font-medium">{message.sender.name}</span>
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs">{message.sender.avatar}</AvatarFallback>
                                </Avatar>
                              </>
                            )}
                            <Badge variant="outline" className={`
                              text-xs px-2 py-0 h-5
                              ${message.channelType === "email" ? "bg-blue-50 border-blue-200 text-blue-700" : 
                                message.channelType === "chat" ? "bg-green-50 border-green-200 text-green-700" :
                                message.channelType === "social" ? "bg-purple-50 border-purple-200 text-purple-700" :
                                message.channelType === "call" ? "bg-amber-50 border-amber-200 text-amber-700" :
                                "bg-gray-50 border-gray-200 text-gray-700"
                              }
                            `}>
                              <div className="flex items-center gap-1">
                                {getChannelIcon(message.channelType, message.socialPlatform)}
                                <span>
                                  {message.channelType.charAt(0).toUpperCase() + message.channelType.slice(1)}
                                  {message.socialPlatform && ` (${message.socialPlatform})`}
                                </span>
                              </div>
                            </Badge>
                          </div>
                          
                          <p className={`text-sm ${message.direction === "outgoing" ? "text-primary-foreground" : "text-gray-800"}`}>
                            {message.content}
                          </p>
                          
                          <div className="text-right mt-1">
                            <span className={`text-xs ${message.direction === "outgoing" ? "text-primary-foreground/80" : "text-gray-500"}`}>
                              {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2 mb-2">
                      <Button variant="outline" className="flex items-center gap-2" size="sm">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2" size="sm">
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat</span>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2" size="sm">
                        <Phone className="h-4 w-4" />
                        <span>Call</span>
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleSendReply}>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a ticket from the left to view the conversation.</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OmnichannelPage;
