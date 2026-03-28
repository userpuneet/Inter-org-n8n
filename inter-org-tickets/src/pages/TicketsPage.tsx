import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Plus, X, MessageSquare } from "lucide-react";
import TicketTimeline from "@/components/TicketTimeline";
import TicketComments from "@/components/TicketComments";
import TicketQuickEdit from "@/components/TicketQuickEdit";
import SimilarTickets from "@/components/SimilarTickets";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";

interface Ticket {
  id: string;
  title: string;
  organization: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  created: string;
  updated: string;
  responseTime: string;
  assignee: string | null;
  description?: string;
  raiser: {
    name: string;
    email: string;
    organization: string;
  };
  recipient: {
    name: string;
    email: string;
    organization: string;
  };
  relationshipType: "internal" | "client" | "vendor" | "partner";
  eta?: {
    value: string;
    setBy: string;
    setByOrg: string;
    timestamp: string;
  };
}

interface Comment {
  id: string;
  author: string;
  authorOrg: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

interface TimelineEvent {
  id: string;
  type: "created" | "updated" | "status_changed" | "assigned" | "comment_added" | "eta_set";
  timestamp: string;
  user: string;
  userOrg?: string;
  details: string;
  assignee?: string;
  etaValue?: string;
}

const dummyComments: Comment[] = [
  {
    id: "COM-001",
    author: "Sarah Johnson",
    authorOrg: "Acme Corp",
    content: "I've checked the cloud storage access logs and can confirm the issue. Working on a fix now.",
    timestamp: "2023-04-22T15:30:00",
    isInternal: false,
  },
  {
    id: "COM-002",
    author: "John Smith",
    authorOrg: "SupportTeam",
    content: "I've identified the issue with the permissions. Let me know if you can access it now.",
    timestamp: "2023-04-22T16:15:00",
    isInternal: false,
  },
  {
    id: "COM-003",
    author: "Sarah Johnson",
    authorOrg: "Acme Corp",
    content: "Yes, I can access it now. Thank you for your help!",
    timestamp: "2023-04-22T16:30:00",
    isInternal: false,
  }
];

const dummyTimeline: TimelineEvent[] = [
  {
    id: "EVT-001",
    type: "created",
    timestamp: "2023-04-22T14:23:00",
    user: "Michael Chen",
    userOrg: "Acme Corp",
    details: "Ticket created",
  },
  {
    id: "EVT-002",
    type: "assigned",
    timestamp: "2023-04-22T14:45:00",
    user: "Lisa Wong",
    userOrg: "SupportTeam",
    details: "Assigned to",
    assignee: "Sarah Johnson",
  },
  {
    id: "EVT-003",
    type: "status_changed",
    timestamp: "2023-04-22T15:15:00",
    user: "Sarah Johnson",
    userOrg: "SupportTeam",
    details: "Status changed from Open to In Progress",
  },
  {
    id: "EVT-004",
    type: "comment_added",
    timestamp: "2023-04-22T15:30:00",
    user: "Sarah Johnson",
    userOrg: "Acme Corp",
    details: "Comment added",
  },
  {
    id: "EVT-005",
    type: "comment_added",
    timestamp: "2023-04-22T16:15:00",
    user: "John Smith",
    userOrg: "SupportTeam",
    details: "Comment added",
  },
  {
    id: "EVT-006",
    type: "comment_added",
    timestamp: "2023-04-22T16:30:00",
    user: "Sarah Johnson",
    userOrg: "Acme Corp",
    details: "Comment added",
  },
  {
    id: "EVT-007",
    type: "eta_set",
    timestamp: "2023-04-22T16:45:00",
    user: "John Smith",
    userOrg: "SupportTeam",
    details: "ETA set to",
    etaValue: "Within 4 hours",
  }
];

const emailToTicketInfo = {
  title: "Automatic ticket creation from email",
  description: `
  This system allows for seamless email-to-ticket integration:
  
  • When someone emails your support address, a ticket is automatically created
  • Their email appears as a thread entry in the ticket
  • When you reply in the ticket, they receive an email
  • When they reply to that email, their response appears in the ticket thread
  
  This creates a seamless experience where:
  • You work exclusively in this ticket system
  • Your customers interact solely via email
  • Communication flows naturally without either party changing their workflow
  `
};

const dummyTickets: Ticket[] = [
  {
    id: "TKT-1234",
    title: "Cannot access cloud storage",
    organization: "Acme Corp",
    status: "open",
    priority: "high",
    created: "2023-04-22T14:23:00",
    updated: "2023-04-22T15:30:00",
    responseTime: "1h 07m",
    assignee: "Sarah Johnson",
    description: "Our team is unable to access the cloud storage system. We've tried multiple browsers and devices with the same result. This is blocking our team from accessing critical project files.",
    raiser: {
      name: "Michael Chen",
      email: "mchen@acmecorp.com",
      organization: "Acme Corp"
    },
    recipient: {
      name: "Support Team",
      email: "support@techsupport.com",
      organization: "TechSupport Inc"
    },
    relationshipType: "client",
    eta: {
      value: "Within 4 hours",
      setBy: "John Smith",
      setByOrg: "SupportTeam",
      timestamp: "2023-04-22T16:45:00"
    }
  },
  {
    id: "TKT-1235",
    title: "Email integration failing",
    organization: "TechFlow",
    status: "in_progress",
    priority: "medium",
    created: "2023-04-22T10:15:00",
    updated: "2023-04-22T12:30:00",
    responseTime: "2h 15m",
    assignee: "Michael Chen",
    description: "The email integration with our CRM system is failing. Emails are not being properly synced or are showing up with significant delay.",
    raiser: {
      name: "Jennifer Lee",
      email: "jlee@techflow.com",
      organization: "TechFlow"
    },
    recipient: {
      name: "Integration Team",
      email: "integrations@techsupport.com",
      organization: "TechSupport Inc"
    },
    relationshipType: "client"
  },
  {
    id: "TKT-1236",
    title: "Cannot reset password",
    organization: "GlobalSoft",
    status: "resolved",
    priority: "low",
    created: "2023-04-21T09:45:00",
    updated: "2023-04-21T11:30:00",
    responseTime: "1h 45m",
    assignee: "John Smith",
    description: "Users are reporting that they cannot reset their passwords using the self-service password reset functionality.",
    raiser: {
      name: "Robert Kim",
      email: "rkim@globalsoft.com",
      organization: "GlobalSoft"
    },
    recipient: {
      name: "Auth Team",
      email: "auth@techsupport.com",
      organization: "TechSupport Inc"
    },
    relationshipType: "client"
  },
  {
    id: "TKT-1237",
    title: "Database connection timeout",
    organization: "XYZ Inc",
    status: "open",
    priority: "critical",
    created: "2023-04-22T16:40:00",
    updated: "2023-04-22T16:55:00",
    responseTime: "15m",
    assignee: null,
    description: "Our application is experiencing database connection timeouts. This is affecting all users and causing service disruption.",
    raiser: {
      name: "Amanda Rodriguez",
      email: "amanda@xyz.com",
      organization: "XYZ Inc"
    },
    recipient: {
      name: "Database Team",
      email: "dba@techsupport.com",
      organization: "TechSupport Inc"
    },
    relationshipType: "vendor"
  },
  {
    id: "TKT-1238",
    title: "API rate limit exceeded",
    organization: "Acme Corp",
    status: "in_progress",
    priority: "high",
    created: "2023-04-22T11:20:00",
    updated: "2023-04-22T13:45:00",
    responseTime: "2h 25m",
    assignee: "Lisa Wong",
    description: "We're consistently hitting the API rate limit which is causing failures in our integration. We need the rate limit increased.",
    raiser: {
      name: "David Johnson",
      email: "djohnson@acmecorp.com",
      organization: "Acme Corp"
    },
    recipient: {
      name: "API Team",
      email: "api@techsupport.com",
      organization: "TechSupport Inc"
    },
    relationshipType: "partner"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Open</Badge>;
    case "in_progress":
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">In Progress</Badge>;
    case "resolved":
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Resolved</Badge>;
    case "closed":
      return <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "critical":
      return <Badge className="bg-red-500">Critical</Badge>;
    case "high":
      return <Badge className="bg-orange-500">High</Badge>;
    case "medium":
      return <Badge className="bg-yellow-500">Medium</Badge>;
    case "low":
      return <Badge className="bg-green-500">Low</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

const getRelationshipBadge = (relationshipType: string) => {
  switch (relationshipType) {
    case "internal":
      return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Internal</Badge>;
    case "client":
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Client</Badge>;
    case "vendor":
      return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Vendor</Badge>;
    case "partner":
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Partner</Badge>;
    default:
      return <Badge variant="outline">{relationshipType}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const priorityOptions = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const assigneeOptions = [
  { value: "Sarah Johnson", label: "Sarah Johnson" },
  { value: "Michael Chen", label: "Michael Chen" },
  { value: "John Smith", label: "John Smith" },
  { value: "Lisa Wong", label: "Lisa Wong" },
  { value: "", label: "Unassigned" },
];

const getSimilarTickets = (currentTicketId: string, currentTicketTitle: string) => {
  const otherTickets = dummyTickets.filter(ticket => ticket.id !== currentTicketId);
  const keywords = currentTicketTitle.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (keywords.length === 0) return [];

  return otherTickets
    .map(ticket => {
      const title = ticket.title.toLowerCase();
      const matchCount = keywords.filter(keyword => title.includes(keyword)).length;
      const similarity = Math.round((matchCount / keywords.length) * 100);

      return {
        id: ticket.id,
        title: ticket.title,
        status: ticket.status,
        similarity,
      };
    })
    .filter(ticket => ticket.similarity > 20)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
};

const TicketsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterPriority, setFilterPriority] = useState<string | undefined>();
  const [filterDirection, setFilterDirection] = useState<string | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showEmailInfo, setShowEmailInfo] = useState(false);
  const [tickets, setTickets] = useState(dummyTickets);

  // Mock current user for filtering purposes
  const currentUser = {
    name: "Sarah Johnson",
    email: "sjohnson@techsupport.com",
    organization: "TechSupport Inc"
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus as "open" | "in_progress" | "resolved" | "closed" } 
          : ticket
      )
    );
  };

  const handlePriorityChange = (ticketId: string, newPriority: string) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, priority: newPriority as "low" | "medium" | "high" | "critical" } 
          : ticket
      )
    );
  };

  const handleAssigneeChange = (ticketId: string, newAssignee: string) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, assignee: newAssignee || null } 
          : ticket
      )
    );
  };

  // Fix: Define filteredTickets variable here
  const filteredTickets = tickets.filter(ticket => {
    // Filter by search query, status, and priority as before
    const baseFilters = (
      (searchQuery === "" || 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.organization.toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (filterStatus === undefined || ticket.status === filterStatus) &&
      (filterPriority === undefined || ticket.priority === filterPriority)
    );
    
    // Add direction filter (raised by me vs. raised to me)
    if (filterDirection === "raised_by_me") {
      return baseFilters && (
        ticket.raiser.email === currentUser.email || 
        ticket.raiser.organization === currentUser.organization
      );
    } else if (filterDirection === "raised_to_me") {
      return baseFilters && (
        ticket.recipient.email === currentUser.email || 
        ticket.recipient.organization === currentUser.organization
      );
    }
    
    return baseFilters;
  });

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Tickets</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10"
                onClick={() => setShowEmailInfo(!showEmailInfo)}
                title="Email Integration Info"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {showEmailInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <h3 className="font-medium text-blue-800 mb-2">{emailToTicketInfo.title}</h3>
            <p className="text-blue-700 whitespace-pre-line text-sm">{emailToTicketInfo.description}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-white" 
              onClick={() => setShowEmailInfo(false)}
            >
              Dismiss
            </Button>
          </div>
        )}

        <div className="bg-white border rounded-md mb-4">
          <div className="p-4 border-b flex flex-wrap gap-3">
            <div className="flex items-center gap-2 mr-2">
              <Button 
                variant={filterDirection === undefined ? "default" : "outline"}
                onClick={() => setFilterDirection(undefined)}
                className="h-9"
              >
                All Tickets
              </Button>
              <Button 
                variant={filterDirection === "raised_by_me" ? "default" : "outline"}
                onClick={() => setFilterDirection("raised_by_me")}
                className="h-9"
              >
                My Tickets
              </Button>
              <Button 
                variant={filterDirection === "raised_to_me" ? "default" : "outline"}
                onClick={() => setFilterDirection("raised_to_me")}
                className="h-9"
              >
                Tickets to Me
              </Button>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button 
              variant="ghost" 
              onClick={() => {
                setFilterStatus(undefined);
                setFilterPriority(undefined);
                setFilterDirection(undefined);
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Assignee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TableRow 
                      key={ticket.id} 
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium cursor-pointer" onClick={() => handleTicketClick(ticket)}>
                        {ticket.id}
                      </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => handleTicketClick(ticket)}>
                        {ticket.title}
                      </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => handleTicketClick(ticket)}>
                        {ticket.organization}
                      </TableCell>
                      <TableCell>
                        <TicketQuickEdit
                          id={ticket.id}
                          currentValue={ticket.status}
                          type="status"
                          onChange={handleStatusChange}
                          options={statusOptions}
                        />
                      </TableCell>
                      <TableCell>
                        <TicketQuickEdit
                          id={ticket.id}
                          currentValue={ticket.priority}
                          type="priority"
                          onChange={handlePriorityChange}
                          options={priorityOptions}
                        />
                      </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => handleTicketClick(ticket)}>
                        {ticket.responseTime}
                      </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => handleTicketClick(ticket)}>
                        {formatDate(ticket.updated)}
                      </TableCell>
                      <TableCell>
                        <TicketQuickEdit
                          id={ticket.id}
                          currentValue={ticket.assignee || ""}
                          type="assignee"
                          onChange={handleAssigneeChange}
                          options={assigneeOptions}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No tickets found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Create a new ticket for tracking and resolution.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium col-span-1">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter ticket title"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="organization" className="text-right text-sm font-medium col-span-1">
                Organization
              </label>
              <Select>
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Organizations</SelectLabel>
                    <SelectItem value="acme">Acme Corp</SelectItem>
                    <SelectItem value="techflow">TechFlow</SelectItem>
                    <SelectItem value="globalsoft">GlobalSoft</SelectItem>
                    <SelectItem value="xyz">XYZ Inc</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="priority" className="text-right text-sm font-medium col-span-1">
                Priority
              </label>
              <Select>
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Priority</SelectLabel>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium col-span-1">
                Description
              </label>
              <div className="col-span-3">
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter a detailed description of the issue"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90vh] h-auto">
          {selectedTicket && (
            <>
              <DrawerHeader className="border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <DrawerTitle className="text-xl flex items-center gap-2">
                      {selectedTicket.id} 
                      <span className="text-gray-500 mx-1">·</span>
                      {selectedTicket.title}
                    </DrawerTitle>
                    <DrawerDescription className="mt-1">
                      {getRelationshipBadge(selectedTicket.relationshipType)}
                      <TicketQuickEdit
                        id={selectedTicket.id}
                        currentValue={selectedTicket.priority}
                        type="priority"
                        onChange={handlePriorityChange}
                        options={priorityOptions}
                      />
                      <TicketQuickEdit
                        id={selectedTicket.id}
                        currentValue={selectedTicket.status}
                        type="status"
                        onChange={handleStatusChange}
                        options={statusOptions}
                      />
                    </DrawerDescription>
                  </div>
                  <DrawerClose className="rounded-full p-1 hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </DrawerClose>
                </div>
              </DrawerHeader>

              <div className="p-4 max-h-[calc(90vh-8rem)] overflow-auto">
                <div className="grid grid-cols-5 gap-6">
                  {/* Left section - 80% width (4/5 columns) */}
                  <div className="col-span-4">
                    {/* Ticket Description */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-700">{selectedTicket.description}</p>
                      
                      {/* Display ETA if available */}
                      {selectedTicket.eta && (
                        <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                          <div className="flex items-center">
                            <span className="font-medium">ETA: </span>
                            <span className="ml-1">{selectedTicket.eta.value}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Set by {selectedTicket.eta.setBy} 
                            <Badge variant="outline" className="ml-1 text-xs">
                              {selectedTicket.eta.setByOrg}
                            </Badge> 
                            on {formatDate(selectedTicket.eta.timestamp)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ticket Thread (formerly Comments) */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Thread
                      </h3>
                      <TicketComments comments={dummyComments} />
                    </div>
                  </div>

                  {/* Right sidebar - 20% width (1/5 columns) */}
                  <div className="col-span-1 space-y-6">
                    {/* Timeline with condensed size */}
                    <div className="border rounded-lg p-3">
                      <h3 className="font-semibold mb-2">Timeline</h3>
                      <div className="max-h-[150px] overflow-y-auto pr-1">
                        <TicketTimeline timelineEvents={dummyTimeline} />
                      </div>
                    </div>
                    
                    {/* Similar Tickets - Expanded section */}
                    <div className="border rounded-lg p-3">
                      <SimilarTickets 
                        currentTicketId={selectedTicket.id}
                        currentTicketTitle={selectedTicket.title}
                        similarTickets={getSimilarTickets(selectedTicket.id, selectedTicket.title)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DrawerFooter className="border-t">
                <div className="flex justify-end w-full">
                  <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                    Close
                  </Button>
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default TicketsPage;
