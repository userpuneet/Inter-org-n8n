import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Search, X, MessageSquare, Archive, Clock, Inbox, Plus, Loader2 } from "lucide-react";
import TicketTimeline from "@/components/TicketTimeline";
import ThreadComments from "@/components/ThreadComments";
import TicketQuickEdit from "@/components/TicketQuickEdit";
import SimilarTickets from "@/components/SimilarTickets";
import OnboardingFlow from "@/components/OnboardingFlow";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useThreads } from "@/hooks/useThreads";
import type { Thread, ThreadStatus, ThreadPriority } from "@/types/threads";

// Types are imported from @/types/threads — no local re-definitions needed.

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
    replyTo: "COM-001"
  },
  {
    id: "COM-003",
    author: "Sarah Johnson",
    authorOrg: "Acme Corp",
    content: "Yes, I can access it now. Thank you for your help!",
    timestamp: "2023-04-22T16:30:00",
    isInternal: false,
    replyTo: "COM-002"
  }
];

const dummyTimeline: TimelineEvent[] = [
  {
    id: "EVT-001",
    type: "created",
    timestamp: "2023-04-22T14:23:00",
    user: "Michael Chen",
    userOrg: "Acme Corp",
    details: "Thread created",
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

const emailToThreadInfo = {
  title: "Automatic thread creation from email",
  description: `
  This system allows for seamless email-to-thread integration:
  
  • When someone emails your support address, a thread is automatically created
  • Their email appears as a thread entry in the thread
  • When you reply in the thread, they receive an email
  • When they reply to that email, their response appears in the thread
  
  This creates a seamless experience where:
  • You work exclusively in this thread system
  • Your customers interact solely via email
  • Communication flows naturally without either party changing their workflow
  `
};

const getInactiveThreads = (threads: Thread[]) => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  return threads.filter(thread => {
    const updatedDate = new Date(thread.updated);
    return updatedDate < threeDaysAgo && thread.status !== 'closed';
  });
};

const getArchivedThreads = (threads: Thread[]) => {
  return threads.filter(thread => thread.status === 'closed');
};

const dummyThreads: Thread[] = [
  {
    id: "THR-1234",
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
    id: "THR-1235",
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
    id: "THR-1236",
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
    id: "THR-1237",
    title: "Database connection timeout",
    organization: "XYZ Inc",
    status: "open",
    priority: "critical",
    created: "2023-04-15T16:40:00",
    updated: "2023-04-16T16:55:00",
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
    id: "THR-1238",
    title: "API rate limit exceeded",
    organization: "Acme Corp",
    status: "closed",
    priority: "high",
    created: "2023-04-10T11:20:00",
    updated: "2023-04-12T13:45:00",
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

const getSimilarThreads = (currentThreadId: string, currentThreadTitle: string) => {
  const otherThreads = dummyThreads.filter(thread => thread.id !== currentThreadId);
  
  const keywords = currentThreadTitle.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (keywords.length === 0) return [];

  return otherThreads
    .map(thread => {
      const title = thread.title.toLowerCase();
      const matchCount = keywords.filter(keyword => title.includes(keyword)).length;
      const similarity = Math.round((matchCount / keywords.length) * 100);
      
      return {
        id: thread.id,
        title: thread.title,
        status: thread.status,
        similarity,
      };
    })
    .filter(thread => thread.similarity > 20)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
};

const ThreadFilterBar = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterDirection,
  setFilterDirection,
  viewFilter,
  setViewFilter,
  inactiveCount,
  archivedCount,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterStatus: string | undefined;
  setFilterStatus: (value: string | undefined) => void;
  filterPriority: string | undefined;
  setFilterPriority: (value: string | undefined) => void;
  filterDirection: string | undefined;
  setFilterDirection: (value: string | undefined) => void;
  viewFilter: string;
  setViewFilter: (value: string) => void;
  inactiveCount: number;
  archivedCount: number;
}) => {
  return (
    <div className="bg-white border rounded-md mb-4">
      <div className="p-4 border-b flex flex-wrap gap-3">
        <div className="flex items-center gap-2 mr-2">
          <Button 
            variant={viewFilter === "all" ? "default" : "outline"}
            onClick={() => setViewFilter("all")}
            className="h-9"
          >
            <Inbox className="h-4 w-4 mr-2" />
            All Threads
          </Button>
          <Button 
            variant={viewFilter === "inactive" ? "default" : "outline"}
            onClick={() => setViewFilter("inactive")}
            className="h-9"
          >
            <Clock className="h-4 w-4 mr-2" />
            Inactive ({inactiveCount})
          </Button>
          <Button 
            variant={viewFilter === "archived" ? "default" : "outline"}
            onClick={() => setViewFilter("archived")}
            className="h-9"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archived ({archivedCount})
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mr-2">
          <Button 
            variant={filterDirection === undefined ? "default" : "outline"}
            onClick={() => setFilterDirection(undefined)}
            className="h-9"
          >
            All
          </Button>
          <Button 
            variant={filterDirection === "raised_by_me" ? "default" : "outline"}
            onClick={() => setFilterDirection("raised_by_me")}
            className="h-9"
          >
            My Threads
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
            setViewFilter("all");
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

const ThreadTable = ({
  threads,
  onThreadClick,
  handleStatusChange,
  handlePriorityChange,
  handleAssigneeChange,
}: {
  threads: Thread[];
  onThreadClick: (thread: Thread) => void;
  handleStatusChange: (threadId: string, newStatus: string) => void;
  handlePriorityChange: (threadId: string, newPriority: string) => void;
  handleAssigneeChange: (threadId: string, newAssignee: string) => void;
}) => {
  return (
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
          {threads.length > 0 ? (
            threads.map((thread) => (
              <TableRow 
                key={thread.id} 
                className="hover:bg-gray-50"
              >
                <TableCell className="font-medium cursor-pointer" onClick={() => onThreadClick(thread)}>
                  {thread.id}
                </TableCell>
                <TableCell className="cursor-pointer" onClick={() => onThreadClick(thread)}>
                  {thread.title}
                </TableCell>
                <TableCell className="cursor-pointer" onClick={() => onThreadClick(thread)}>
                  {thread.organization}
                </TableCell>
                <TableCell>
                  <TicketQuickEdit
                    id={thread.id}
                    currentValue={thread.status}
                    type="status"
                    onChange={handleStatusChange}
                    options={statusOptions}
                  />
                </TableCell>
                <TableCell>
                  <TicketQuickEdit
                    id={thread.id}
                    currentValue={thread.priority}
                    type="priority"
                    onChange={handlePriorityChange}
                    options={priorityOptions}
                  />
                </TableCell>
                <TableCell className="cursor-pointer" onClick={() => onThreadClick(thread)}>
                  {thread.responseTime}
                </TableCell>
                <TableCell className="cursor-pointer" onClick={() => onThreadClick(thread)}>
                  {formatDate(thread.updated)}
                </TableCell>
                <TableCell>
                  <TicketQuickEdit
                    id={thread.id}
                    currentValue={thread.assignee || ""}
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
                No threads found matching your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const ThreadsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterPriority, setFilterPriority] = useState<string | undefined>();
  const [filterDirection, setFilterDirection] = useState<string | undefined>();
  const [viewFilter, setViewFilter] = useState<string>("all");
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showEmailInfo, setShowEmailInfo] = useState(false);

  const { threads, loading, error, updateStatus, updatePriority, updateAssignee } = useThreads();
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const navigate = useNavigate();

  const currentUser = {
    name: "Sarah Johnson",
    email: "sjohnson@techsupport.com",
    organization: "TechSupport Inc"
  };

  const handleStatusChange = (threadId: string, newStatus: string) => {
    updateStatus(threadId, newStatus as ThreadStatus);
  };

  const handlePriorityChange = (threadId: string, newPriority: string) => {
    updatePriority(threadId, newPriority as ThreadPriority);
  };

  const handleAssigneeChange = (threadId: string, newAssignee: string) => {
    updateAssignee(threadId, newAssignee || null);
  };

  const getFilteredThreads = () => {
    let baseThreads = threads;
    
    if (viewFilter === "inactive") {
      baseThreads = getInactiveThreads(threads);
    } else if (viewFilter === "archived") {
      baseThreads = getArchivedThreads(threads);
    }
    
    return baseThreads.filter(thread => {
      const baseFilters = (
        (searchQuery === "" || 
          thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.organization.toLowerCase().includes(searchQuery.toLowerCase())
        ) &&
        (filterStatus === undefined || thread.status === filterStatus) &&
        (filterPriority === undefined || thread.priority === filterPriority)
      );
      
      if (filterDirection === "raised_by_me") {
        return baseFilters && (
          thread.raiser.email === currentUser.email || 
          thread.raiser.organization === currentUser.organization
        );
      } else if (filterDirection === "raised_to_me") {
        return baseFilters && (
          thread.recipient.email === currentUser.email || 
          thread.recipient.organization === currentUser.organization
        );
      }
      
      return baseFilters;
    });
  };

  const getActiveThreadCount = () => {
    return threads.filter(thread => thread.status !== 'closed').length;
  };

  const handleThreadClick = (thread: Thread) => {
    setSelectedThread(thread);
  };

  const handleCloseThread = () => {
    setSelectedThread(null);
  };

  const inactiveCount = getInactiveThreads(threads).length;
  const archivedCount = getArchivedThreads(threads).length;
  const activeThreadCount = getActiveThreadCount();

  return (
    <Layout>
      {showOnboarding && <OnboardingFlow onComplete={completeOnboarding} />}
      
      <div className="animate-fade-in h-full">
        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading threads…
          </div>
        )}
        {!loading && error && (
          <div className="rounded-md bg-red-50 border border-red-200 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}
        {!loading && !selectedThread ? (
          // Single column view when no thread is selected
          <div className="h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold">
                Threads 
                <span className="text-lg font-normal text-gray-500 ml-2">#{activeThreadCount}</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search threads..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => navigate("/create-ticket")} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Thread
                </Button>
              </div>
            </div>

            {showEmailInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <h3 className="font-medium text-blue-800 mb-2">{emailToThreadInfo.title}</h3>
                <p className="text-blue-700 whitespace-pre-line text-sm">{emailToThreadInfo.description}</p>
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

            <ThreadFilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              filterDirection={filterDirection}
              setFilterDirection={setFilterDirection}
              viewFilter={viewFilter}
              setViewFilter={setViewFilter}
              inactiveCount={inactiveCount}
              archivedCount={archivedCount}
            />

            <ThreadTable
              threads={getFilteredThreads()}
              onThreadClick={handleThreadClick}
              handleStatusChange={handleStatusChange}
              handlePriorityChange={handlePriorityChange}
              handleAssigneeChange={handleAssigneeChange}
            />
          </div>
        ) : (
          // Three column view when thread is selected (only shown when not loading)
          !loading && selectedThread && <div className="h-full flex flex-col">
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <h1 className="text-2xl font-bold">
                {selectedThread.id} · {selectedThread.title}
              </h1>
              <Button variant="ghost" size="icon" onClick={handleCloseThread}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Three column layout */}
            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
              {/* Left Column - Thread List (25%) */}
              <div className="col-span-3 border-r pr-4 overflow-auto">
                <h3 className="font-semibold mb-3">All Threads</h3>
                <div className="space-y-2">
                  {threads.slice(0, 10).map((thread) => (
                    <div
                      key={thread.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                        selectedThread?.id === thread.id ? 'bg-blue-50 border-blue-200' : 'bg-white'
                      }`}
                      onClick={() => handleThreadClick(thread)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">{thread.id}</span>
                        {getStatusBadge(thread.status)}
                      </div>
                      <p className="text-sm font-medium truncate">{thread.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{thread.organization}</p>
                      <div className="flex items-center justify-between mt-2">
                        {getPriorityBadge(thread.priority)}
                        <span className="text-xs text-gray-500">{formatDate(thread.updated)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Column - Thread Details (50%) */}
              <div className="col-span-6 overflow-auto">
                <div className="space-y-6">
                  {/* Thread Info */}
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {getRelationshipBadge(selectedThread.relationshipType)}
                      <TicketQuickEdit
                        id={selectedThread.id}
                        currentValue={selectedThread.priority}
                        type="priority"
                        onChange={handlePriorityChange}
                        options={priorityOptions}
                      />
                      <TicketQuickEdit
                        id={selectedThread.id}
                        currentValue={selectedThread.status}
                        type="status"
                        onChange={handleStatusChange}
                        options={statusOptions}
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 mb-4">{selectedThread.description}</p>
                    
                    {selectedThread.eta && (
                      <div className="p-3 bg-indigo-50 rounded-md border border-indigo-100">
                        <div className="flex items-center">
                          <span className="font-medium">ETA: </span>
                          <span className="ml-1">{selectedThread.eta.value}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Set by {selectedThread.eta.setBy} 
                          <Badge variant="outline" className="ml-1 text-xs">
                            {selectedThread.eta.setByOrg}
                          </Badge> 
                          on {formatDate(selectedThread.eta.timestamp)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Comments Section */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Thread
                    </h3>
                    <ThreadComments comments={dummyComments} />
                  </div>
                </div>
              </div>

              {/* Right Column - Timeline & Similar Tickets (25%) */}
              <div className="col-span-3 border-l pl-4 overflow-auto">
                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Timeline</h3>
                    <div className="max-h-[300px] overflow-y-auto">
                      <TicketTimeline timelineEvents={dummyTimeline} />
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <SimilarTickets 
                      currentTicketId={selectedThread.id}
                      currentTicketTitle={selectedThread.title}
                      similarTickets={getSimilarThreads(selectedThread.id, selectedThread.title)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ThreadsPage;
