
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";

const chartData = [
  { name: "Mon", tickets: 4, resolved: 3 },
  { name: "Tue", tickets: 7, resolved: 5 },
  { name: "Wed", tickets: 5, resolved: 6 },
  { name: "Thu", tickets: 9, resolved: 7 },
  { name: "Fri", tickets: 6, resolved: 5 },
  { name: "Sat", tickets: 3, resolved: 4 },
  { name: "Sun", tickets: 2, resolved: 3 },
];

const priorityData = [
  { name: "Low", value: 15 },
  { name: "Medium", value: 25 },
  { name: "High", value: 18 },
  { name: "Critical", value: 7 },
];

const Dashboard = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Open Tickets</p>
                  <h3 className="text-3xl font-bold">42</h3>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  12%
                </Badge>
              </div>
              <Progress className="h-1 mt-3" value={65} />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Response Time</p>
                  <h3 className="text-3xl font-bold">2.4h</h3>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  8%
                </Badge>
              </div>
              <Progress className="h-1 mt-3" value={45} />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Resolution Time</p>
                  <h3 className="text-3xl font-bold">18h</h3>
                </div>
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  5%
                </Badge>
              </div>
              <Progress className="h-1 mt-3" value={72} />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Satisfaction</p>
                  <h3 className="text-3xl font-bold">92%</h3>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  3%
                </Badge>
              </div>
              <Progress className="h-1 mt-3" value={92} />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ticket Activity</CardTitle>
              <CardDescription>Weekly overview of tickets created vs resolved</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="tickets" 
                      name="New Tickets" 
                      stroke="#6366F1" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resolved" 
                      name="Resolved" 
                      stroke="#22C55E" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Ticket Priority</CardTitle>
              <CardDescription>Distribution by priority level</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest ticket updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-md hover:bg-gray-50">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Ticket #1234 resolved</p>
                    <p className="text-sm text-gray-500">Login issue fixed for Acme Corp</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago by Sarah Johnson</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 rounded-md hover:bg-gray-50">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Response time alert</p>
                    <p className="text-sm text-gray-500">Ticket #2201 awaiting response (4h+)</p>
                    <p className="text-xs text-gray-400 mt-1">3 hours ago • High priority</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 rounded-md hover:bg-gray-50">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Critical issue reported</p>
                    <p className="text-sm text-gray-500">Database connectivity for XYZ Inc</p>
                    <p className="text-xs text-gray-400 mt-1">5 hours ago by Michael Chen</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Organization Performance</CardTitle>
              <CardDescription>Response and resolution metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Acme Corp</span>
                  <span className="text-sm">2.1h avg response</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">XYZ Inc</span>
                  <span className="text-sm">3.7h avg response</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">TechFlow</span>
                  <span className="text-sm">1.3h avg response</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">GlobalSoft</span>
                  <span className="text-sm">2.8h avg response</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
