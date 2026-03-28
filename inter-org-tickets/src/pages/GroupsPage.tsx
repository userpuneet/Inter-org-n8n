
import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MoreVertical, 
  UserPlus, 
  Settings, 
  MessageSquare,
  Search,
  Plus,
  Mail
} from "lucide-react";

const memberColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-rose-500",
];

interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  organization: string;
}

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  organization: string;
}

const dummyGroups: Group[] = [
  {
    id: "g1",
    name: "IT Support Team",
    description: "Cross-organizational IT support specialists",
    organization: "Acme Corp & TechFlow",
    members: [
      { id: "u1", name: "Sarah Johnson", role: "Team Lead", email: "sarah@acme.com", organization: "Acme Corp" },
      { id: "u2", name: "Michael Chen", role: "Support Engineer", email: "michael@techflow.com", organization: "TechFlow" },
      { id: "u3", name: "Lisa Wong", role: "System Specialist", email: "lisa@acme.com", organization: "Acme Corp" },
    ],
  },
  {
    id: "g2",
    name: "Cloud Infrastructure",
    description: "Infrastructure management across partner organizations",
    organization: "XYZ Inc & GlobalSoft",
    members: [
      { id: "u4", name: "John Smith", role: "Cloud Architect", email: "john@globalsoft.com", organization: "GlobalSoft" },
      { id: "u5", name: "Emily Davis", role: "DevOps Lead", email: "emily@xyz.com", organization: "XYZ Inc" },
    ],
  },
  {
    id: "g3",
    name: "Security Response",
    description: "Joint cybersecurity response team",
    organization: "Multiple Organizations",
    members: [
      { id: "u6", name: "David Wilson", role: "Security Lead", email: "david@acme.com", organization: "Acme Corp" },
      { id: "u7", name: "Ana Rodriguez", role: "Security Analyst", email: "ana@globalsoft.com", organization: "GlobalSoft" },
      { id: "u8", name: "Robert Kim", role: "CISO", email: "robert@techflow.com", organization: "TechFlow" },
    ],
  },
];

const GroupsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const handleInvite = (group: Group) => {
    setSelectedGroup(group);
    setIsInviteDialogOpen(true);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Groups</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search groups..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Group
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dummyGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {group.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleInvite(group)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Members
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Group
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Group Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <Badge variant="secondary" className="bg-primary-100 text-primary-700 border-primary-300">
                    {group.organization}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-1.5" />
                    <span className="text-sm text-gray-500">{group.members.length} members</span>
                  </div>
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 3).map((member, index) => (
                      <Avatar key={member.id} className="border-2 border-white h-8 w-8">
                        <AvatarFallback className={memberColors[index % memberColors.length]}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {group.members.length > 3 && (
                      <Avatar className="border-2 border-white h-8 w-8">
                        <AvatarFallback className="bg-gray-500">
                          +{group.members.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Create a new group to collaborate across organizations
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium col-span-1">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter group name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right text-sm font-medium col-span-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter group description"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Members to {selectedGroup?.name}</DialogTitle>
              <DialogDescription>
                Send invitations to new members by email
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex gap-2 items-center">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                />
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="border rounded-md p-2">
                <div className="text-sm text-gray-500 mb-2">Current members:</div>
                {selectedGroup?.members.map((member) => (
                  <div key={member.id} className="flex justify-between items-center py-1 px-2 rounded-md hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary-400">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{member.organization}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsInviteDialogOpen(false)}>Send Invites</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default GroupsPage;
