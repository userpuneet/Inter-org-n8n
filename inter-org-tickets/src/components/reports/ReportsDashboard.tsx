
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

const ReportsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedProject, setSelectedProject] = useState('all');

  // Sample data
  const issuesByStatus = [
    { name: 'To Do', value: 23, color: '#94a3b8' },
    { name: 'In Progress', value: 15, color: '#3b82f6' },
    { name: 'In Review', value: 8, color: '#f59e0b' },
    { name: 'Done', value: 45, color: '#10b981' }
  ];

  const issuesByType = [
    { name: 'Story', count: 25 },
    { name: 'Bug', count: 18 },
    { name: 'Task', count: 32 },
    { name: 'Epic', count: 6 }
  ];

  const velocityData = [
    { sprint: 'Sprint 1', completed: 23, planned: 25 },
    { sprint: 'Sprint 2', completed: 28, planned: 30 },
    { sprint: 'Sprint 3', completed: 22, planned: 27 },
    { sprint: 'Sprint 4', completed: 31, planned: 28 },
    { sprint: 'Sprint 5', completed: 26, planned: 30 }
  ];

  const burndownData = [
    { day: 'Day 1', remaining: 100, ideal: 100 },
    { day: 'Day 2', remaining: 95, ideal: 90 },
    { day: 'Day 3', remaining: 88, ideal: 80 },
    { day: 'Day 4', remaining: 82, ideal: 70 },
    { day: 'Day 5', remaining: 75, ideal: 60 },
    { day: 'Day 6', remaining: 65, ideal: 50 },
    { day: 'Day 7', remaining: 58, ideal: 40 },
    { day: 'Day 8', remaining: 45, ideal: 30 },
    { day: 'Day 9', remaining: 32, ideal: 20 },
    { day: 'Day 10', remaining: 15, ideal: 10 },
    { day: 'Day 11', remaining: 5, ideal: 0 }
  ];

  const timeTrackingData = [
    { user: 'John Doe', logged: 42, estimated: 40 },
    { user: 'Jane Smith', logged: 38, estimated: 35 },
    { user: 'Mike Johnson', logged: 31, estimated: 30 },
    { user: 'Sarah Wilson', logged: 45, estimated: 40 },
    { user: 'Alex Brown', logged: 28, estimated: 32 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Track project performance and team productivity</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="MOBILE">Mobile App</SelectItem>
              <SelectItem value="WEB">Website Redesign</SelectItem>
              <SelectItem value="API">REST API</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 days</SelectItem>
              <SelectItem value="30days">30 days</SelectItem>
              <SelectItem value="90days">90 days</SelectItem>
              <SelectItem value="1year">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Completed Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Avg. Resolution Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2d</div>
            <p className="text-xs text-red-600">+0.3d from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Team Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26 SP</div>
            <p className="text-xs text-green-600">+2 SP from last sprint</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Overdue Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-orange-600">3 critical priority</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="burndown">Burndown</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Issues by Status</CardTitle>
                <CardDescription>Current distribution of issue statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={issuesByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {issuesByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                  {issuesByStatus.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Issues by Type</CardTitle>
                <CardDescription>Breakdown of different issue types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={issuesByType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="velocity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Velocity</CardTitle>
              <CardDescription>Story points completed vs planned over recent sprints</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="planned" fill="#e5e7eb" name="Planned" />
                  <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="burndown" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Burndown Chart</CardTitle>
              <CardDescription>Remaining work vs ideal burndown line</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={burndownData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="ideal" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.1}
                    name="Ideal"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="remaining" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Actual"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Tracking Analysis</CardTitle>
              <CardDescription>Hours logged vs estimated by team member</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={timeTrackingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="user" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="estimated" fill="#e5e7eb" name="Estimated Hours" />
                  <Bar dataKey="logged" fill="#8b5cf6" name="Logged Hours" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsDashboard;
