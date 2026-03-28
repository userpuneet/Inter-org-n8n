import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter,
  Flag,
  MoreVertical,
  Clock
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/Layout';
import { useParams } from 'react-router-dom';
import CreateIssueDialog from '@/components/project/CreateIssueDialog';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import TimeTracker from '@/components/time-tracking/TimeTracker';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const IssuesPage = () => {
  const { projectKey } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [issues, setIssues] = useState([
    {
      id: 'MOBILE-123',
      title: 'Implement user authentication',
      type: 'Story',
      status: 'To Do',
      priority: 'High',
      assignee: 'John Doe',
      avatar: '/placeholder.svg',
      created: '2024-01-10',
      updated: '2024-01-15',
      storyPoints: 8,
      labels: ['backend', 'security']
    },
    {
      id: 'MOBILE-124',
      title: 'Design login screen',
      type: 'Task',
      status: 'In Progress',
      priority: 'Medium',
      assignee: 'Jane Smith',
      avatar: '/placeholder.svg',
      created: '2024-01-11',
      updated: '2024-01-15',
      storyPoints: 3,
      labels: ['frontend', 'ui']
    },
    {
      id: 'MOBILE-125',
      title: 'Fix password validation bug',
      type: 'Bug',
      status: 'In Review',
      priority: 'High',
      assignee: 'Mike Johnson',
      avatar: '/placeholder.svg',
      created: '2024-01-12',
      updated: '2024-01-14',
      storyPoints: 2,
      labels: ['bugfix']
    },
    {
      id: 'MOBILE-126',
      title: 'Setup CI/CD pipeline',
      type: 'Task',
      status: 'Done',
      priority: 'Low',
      assignee: 'Sarah Wilson',
      avatar: '/placeholder.svg',
      created: '2024-01-08',
      updated: '2024-01-13',
      storyPoints: 5,
      labels: ['devops']
    },
    {
      id: 'MOBILE-127',
      title: 'Mobile app performance optimization',
      type: 'Epic',
      status: 'To Do',
      priority: 'Medium',
      assignee: 'Alex Brown',
      avatar: '/placeholder.svg',
      created: '2024-01-09',
      updated: '2024-01-15',
      storyPoints: 13,
      labels: ['performance', 'mobile']
    }
  ]);

  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [savedFilters, setSavedFilters] = useState<Array<{ name: string; filters: any }>>([]);

  const handleIssueCreate = (newIssue: any) => {
    // Convert status from kanban format to display format
    const statusMap: Record<string, string> = {
      'todo': 'To Do',
      'inprogress': 'In Progress',
      'review': 'In Review',
      'done': 'Done'
    };
    
    const formattedIssue = {
      ...newIssue,
      status: statusMap[newIssue.status] || newIssue.status
    };
    
    const newIssues = [...issues, formattedIssue];
    setIssues(newIssues);
    setFilteredIssues(newIssues);
  };

  const handleAdvancedSearch = (filters: any) => {
    let filtered = [...issues];

    // Apply text filter
    if (filters.text) {
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(filters.text.toLowerCase()) ||
        issue.id.toLowerCase().includes(filters.text.toLowerCase())
      );
    }

    // Apply assignee filter
    if (filters.assignee.length > 0) {
      filtered = filtered.filter(issue => filters.assignee.includes(issue.assignee));
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(issue => filters.status.includes(issue.status));
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(issue => filters.priority.includes(issue.priority));
    }

    // Apply type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter(issue => filters.type.includes(issue.type));
    }

    // Apply labels filter
    if (filters.labels.length > 0) {
      filtered = filtered.filter(issue => 
        filters.labels.some((label: string) => issue.labels.includes(label))
      );
    }

    // Apply story points filter
    if (filters.storyPoints.min !== undefined || filters.storyPoints.max !== undefined) {
      filtered = filtered.filter(issue => {
        const points = issue.storyPoints;
        const min = filters.storyPoints.min || 0;
        const max = filters.storyPoints.max || Infinity;
        return points >= min && points <= max;
      });
    }

    setFilteredIssues(filtered);
  };

  const handleSaveFilter = (name: string, filters: any) => {
    setSavedFilters([...savedFilters, { name, filters }]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Story':
        return '📖';
      case 'Task':
        return '✅';
      case 'Bug':
        return '🐛';
      case 'Epic':
        return '🚀';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{projectKey} Issues</h1>
            <p className="text-gray-600">View and manage all project issues</p>
          </div>
          <CreateIssueDialog 
            projectKey={projectKey}
            onIssueCreate={handleIssueCreate}
          />
        </div>

        <AdvancedSearch 
          onSearch={handleAdvancedSearch}
          onSaveFilter={handleSaveFilter}
          savedFilters={savedFilters}
        />

        <Card>
          <CardHeader>
            <CardTitle>Issues ({filteredIssues.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Type</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Story Points</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <span className="text-lg">{getTypeIcon(issue.type)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm font-medium">{issue.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{issue.title}</div>
                        <div className="flex flex-wrap gap-1">
                          {issue.labels.slice(0, 2).map((label) => (
                            <Badge key={label} variant="outline" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                          {issue.labels.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{issue.labels.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Flag className={`h-3 w-3 ${getPriorityColor(issue.priority)}`} />
                        <span className="text-sm">{issue.priority}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={issue.avatar} />
                          <AvatarFallback className="text-xs">
                            {issue.assignee.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{issue.assignee}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {issue.storyPoints}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{issue.updated}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Clock className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <TimeTracker 
                              issueId={issue.id}
                              issueTitle={issue.title}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default IssuesPage;
