
import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare,
  Search,
  Plus,
  Hash,
  Lock,
  Users,
  Clock
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  description: string;
  type: "public" | "private";
  members: number;
  organization: string;
  lastActivity: string;
}

const dummyChannels: Channel[] = [
  {
    id: "c1",
    name: "general",
    description: "General discussion channel for all members",
    type: "public",
    members: 24,
    organization: "All Organizations",
    lastActivity: "2023-04-22T15:30:00",
  },
  {
    id: "c2",
    name: "it-support",
    description: "IT support requests and discussions",
    type: "public",
    members: 18,
    organization: "All Organizations",
    lastActivity: "2023-04-22T16:40:00",
  },
  {
    id: "c3",
    name: "security-alerts",
    description: "Security notifications and discussions",
    type: "private",
    members: 12,
    organization: "Security Teams",
    lastActivity: "2023-04-21T10:15:00",
  },
  {
    id: "c4",
    name: "project-alpha",
    description: "Collaborative channel for Project Alpha",
    type: "private",
    members: 8,
    organization: "Acme Corp & TechFlow",
    lastActivity: "2023-04-22T14:20:00",
  },
];

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
};

const ChannelsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredChannels = dummyChannels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Channels</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search channels..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Channel
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Channels</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
            <TabsTrigger value="joined">Joined</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChannels.map((channel) => (
                <Card key={channel.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      {channel.type === "public" ? (
                        <Hash className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-1">
                      {channel.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className={channel.type === "public" ? 
                        "bg-green-100 text-green-700 border-green-200" :
                        "bg-amber-100 text-amber-700 border-amber-200"
                      }>
                        {channel.type === "public" ? "Public" : "Private"}
                      </Badge>
                      <Badge variant="outline">{channel.organization}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{channel.members} members</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatTimeAgo(channel.lastActivity)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t">
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => {}}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Join Channel
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="public">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChannels
                .filter(channel => channel.type === "public")
                .map((channel) => (
                  <Card key={channel.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="h-4 w-4 text-gray-400" />
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                      </div>
                      <CardDescription className="line-clamp-1">
                        {channel.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                          Public
                        </Badge>
                        <Badge variant="outline">{channel.organization}</Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{channel.members} members</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatTimeAgo(channel.lastActivity)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t">
                      <Button variant="ghost" size="sm" className="w-full" onClick={() => {}}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Join Channel
                      </Button>
                    </CardFooter>
                  </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="private">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChannels
                .filter(channel => channel.type === "private")
                .map((channel) => (
                  <Card key={channel.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className="h-4 w-4 text-gray-400" />
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                      </div>
                      <CardDescription className="line-clamp-1">
                        {channel.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                          Private
                        </Badge>
                        <Badge variant="outline">{channel.organization}</Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{channel.members} members</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatTimeAgo(channel.lastActivity)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t">
                      <Button variant="ghost" size="sm" className="w-full" onClick={() => {}}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Request Access
                      </Button>
                    </CardFooter>
                  </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="joined">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="border border-gray-200 rounded-full p-3 bg-gray-50">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mt-4 mb-2">No channels joined yet</h3>
                <p className="text-gray-500 text-center mb-4">Join existing channels or create a new one to start communicating</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create a Channel
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Channel</DialogTitle>
              <DialogDescription>
                Create a new channel for inter-organizational communication
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded">
                  <Hash className="h-4 w-4 text-gray-500" />
                </div>
                <Input placeholder="channel-name" />
              </div>
              <Textarea placeholder="Enter channel description" className="min-h-[100px]" />
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="private-channel" className="rounded text-primary focus:ring-primary" />
                <label htmlFor="private-channel" className="text-sm font-medium">
                  Make channel private
                </label>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Available Organizations
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="org-acme" defaultChecked className="rounded text-primary focus:ring-primary" />
                    <label htmlFor="org-acme" className="text-sm">
                      Acme Corp
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="org-techflow" defaultChecked className="rounded text-primary focus:ring-primary" />
                    <label htmlFor="org-techflow" className="text-sm">
                      TechFlow
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="org-globalsoft" defaultChecked className="rounded text-primary focus:ring-primary" />
                    <label htmlFor="org-globalsoft" className="text-sm">
                      GlobalSoft
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="org-xyz" defaultChecked className="rounded text-primary focus:ring-primary" />
                    <label htmlFor="org-xyz" className="text-sm">
                      XYZ Inc
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Create Channel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ChannelsPage;
