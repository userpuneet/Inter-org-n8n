
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from "recharts";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Calendar, 
  Download, 
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight,
  Eye
} from "lucide-react";

// Ticket volume data by day
const ticketVolumeData = [
  { date: "05/01", newTickets: 42, resolvedTickets: 38 },
  { date: "05/02", newTickets: 38, resolvedTickets: 40 },
  { date: "05/03", newTickets: 45, resolvedTickets: 39 },
  { date: "05/04", newTickets: 39, resolvedTickets: 42 },
  { date: "05/05", newTickets: 47, resolvedTickets: 45 },
  { date: "05/06", newTickets: 30, resolvedTickets: 39 },
  { date: "05/07", newTickets: 25, resolvedTickets: 30 },
  { date: "05/08", newTickets: 55, resolvedTickets: 40 },
  { date: "05/09", newTickets: 48, resolvedTickets: 43 }
];

// Response time data by team
const responseTimeData = [
  { team: "Technical Support", avgResponseTime: 1.2 },
  { team: "Billing Support", avgResponseTime: 0.8 },
  { team: "Account Management", avgResponseTime: 1.5 },
  { team: "Product Support", avgResponseTime: 2.1 },
  { team: "Integration Team", avgResponseTime: 1.9 }
];

// Resolution time by category
const resolutionTimeData = [
  { category: "Bug Reports", avgResolutionTime: 18 },
  { category: "Feature Requests", avgResolutionTime: 36 },
  { category: "Account Issues", avgResolutionTime: 4 },
  { category: "Billing Questions", avgResolutionTime: 2 },
  { category: "Integration Help", avgResolutionTime: 12 },
  { category: "General Inquiries", avgResolutionTime: 1.5 }
];

// Customer satisfaction data
const satisfactionData = [
  { month: "Jan", score: 87 },
  { month: "Feb", score: 85 },
  { month: "Mar", score: 88 },
  { month: "Apr", score: 90 },
  { month: "May", score: 92 }
];

// Ticket category distribution
const categoryDistributionData = [
  { name: "Bug Reports", value: 120 },
  { name: "Feature Requests", value: 80 },
  { name: "Account Issues", value: 105 },
  { name: "Billing Questions", value: 65 },
  { name: "Integration Help", value: 45 },
  { name: "General Inquiries", value: 95 }
];

// Predictive ticket volume
const predictiveVolumeData = [
  { date: "05/10", actual: null, predicted: 46, lower: 42, upper: 50 },
  { date: "05/11", actual: null, predicted: 50, lower: 45, upper: 55 },
  { date: "05/12", actual: null, predicted: 48, lower: 43, upper: 53 },
  { date: "05/13", actual: null, predicted: 52, lower: 47, upper: 57 },
  { date: "05/14", actual: null, predicted: 42, lower: 38, upper: 46 },
  { date: "05/15", actual: null, predicted: 38, lower: 34, upper: 42 },
  { date: "05/16", actual: null, predicted: 45, lower: 40, upper: 50 }
];

// Customer insights data
const customerSentimentData = [
  { date: "05/01", positive: 65, neutral: 25, negative: 10 },
  { date: "05/02", positive: 62, neutral: 28, negative: 10 },
  { date: "05/03", positive: 58, neutral: 30, negative: 12 },
  { date: "05/04", positive: 63, neutral: 27, negative: 10 },
  { date: "05/05", positive: 70, neutral: 20, negative: 10 },
  { date: "05/06", positive: 72, neutral: 18, negative: 10 },
  { date: "05/07", positive: 68, neutral: 22, negative: 10 }
];

const customerJourneyData = [
  { touchpoint: "Website Visit", satisfaction: 85, volumePercentage: 100 },
  { touchpoint: "Knowledge Base", satisfaction: 80, volumePercentage: 65 },
  { touchpoint: "Chat Support", satisfaction: 78, volumePercentage: 40 },
  { touchpoint: "Ticket Creation", satisfaction: 72, volumePercentage: 35 },
  { touchpoint: "Email Support", satisfaction: 68, volumePercentage: 30 },
  { touchpoint: "Phone Support", satisfaction: 75, volumePercentage: 20 },
  { touchpoint: "Social Media", satisfaction: 70, volumePercentage: 15 }
];

// Color constants
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];
const SENTIMENT_COLORS = {
  positive: '#22C55E',
  neutral: '#94A3B8',
  negative: '#EF4444'
};

const AdvancedAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("last7days");
  const [teamFilter, setTeamFilter] = useState("all");
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Advanced Analytics & Reporting</h1>
            <p className="text-gray-500">Comprehensive insights and predictive analytics for your support operations</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="lastMonth">Last month</SelectItem>
                <SelectItem value="custom">Custom range...</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Executive summary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ticket Volume</p>
                  <h3 className="text-3xl font-bold">369</h3>
                  <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  8%
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg. Response Time</p>
                  <h3 className="text-3xl font-bold">1.4h</h3>
                  <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  12%
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg. Resolution Time</p>
                  <h3 className="text-3xl font-bold">8.2h</h3>
                  <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  5%
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer Satisfaction</p>
                  <h3 className="text-3xl font-bold">92%</h3>
                  <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  2%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Team Performance</TabsTrigger>
            <TabsTrigger value="customer">Customer Analysis</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Ticket Volume Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Volume Trends</CardTitle>
                <CardDescription>Daily comparison of new vs. resolved tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ticketVolumeData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="newTickets" name="New Tickets" stroke="#8884d8" fillOpacity={1} fill="url(#colorNew)" />
                      <Area type="monotone" dataKey="resolvedTickets" name="Resolved Tickets" stroke="#82ca9d" fillOpacity={1} fill="url(#colorResolved)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Response and Resolution Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Average Response Time by Team</CardTitle>
                  <CardDescription>Response times across support teams in hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={responseTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" unit="h" />
                        <YAxis type="category" dataKey="team" width={150} />
                        <Tooltip formatter={(value) => [`${value} hours`, `Avg. Response Time`]} />
                        <Legend />
                        <Bar dataKey="avgResponseTime" name="Avg. Response Time" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Resolution Time by Category</CardTitle>
                  <CardDescription>Resolution times across ticket categories in hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={resolutionTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" unit="h" />
                        <YAxis type="category" dataKey="category" width={150} />
                        <Tooltip formatter={(value) => [`${value} hours`, `Avg. Resolution Time`]} />
                        <Legend />
                        <Bar dataKey="avgResolutionTime" name="Avg. Resolution Time" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Satisfaction and Category Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Satisfaction Trend</CardTitle>
                  <CardDescription>Monthly customer satisfaction scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={satisfactionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis domain={[80, 100]} unit="%" />
                        <Tooltip formatter={(value) => [`${value}%`, `Satisfaction Score`]} />
                        <Legend />
                        <Line type="monotone" dataKey="score" name="Satisfaction Score" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ticket Category Distribution</CardTitle>
                  <CardDescription>Breakdown of tickets by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} tickets`, `Count`]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Performance Dashboard</CardTitle>
                  <CardDescription>Detailed metrics on agent performance</CardDescription>
                </div>
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Support</SelectItem>
                    <SelectItem value="account">Account Management</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Team Member</th>
                        <th className="text-center py-3 px-4">Tickets Resolved</th>
                        <th className="text-center py-3 px-4">Avg. Response Time</th>
                        <th className="text-center py-3 px-4">Customer Satisfaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Sarah Johnson</td>
                        <td className="py-3 px-4 text-center">48</td>
                        <td className="py-3 px-4 text-center">0.5h</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-600">95%</Badge>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Michael Chen</td>
                        <td className="py-3 px-4 text-center">52</td>
                        <td className="py-3 px-4 text-center">0.7h</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-600">91%</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Sentiment Analysis</CardTitle>
                  <CardDescription>Tracking sentiment trends across customer interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={customerSentimentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, ``]} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="positive" 
                          name="Positive" 
                          stackId="1"
                          stroke={SENTIMENT_COLORS.positive} 
                          fill={SENTIMENT_COLORS.positive} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="neutral" 
                          name="Neutral" 
                          stackId="1"
                          stroke={SENTIMENT_COLORS.neutral} 
                          fill={SENTIMENT_COLORS.neutral} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="negative" 
                          name="Negative" 
                          stackId="1"
                          stroke={SENTIMENT_COLORS.negative} 
                          fill={SENTIMENT_COLORS.negative} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Journey Satisfaction</CardTitle>
                  <CardDescription>Satisfaction across different touchpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={customerJourneyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="touchpoint" />
                        <YAxis yAxisId="left" domain={[0, 100]} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="right" dataKey="volumePercentage" name="Volume %" fill="#8884d8" />
                        <Line yAxisId="left" type="monotone" dataKey="satisfaction" name="Satisfaction %" stroke="#ff7300" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer Feedback Word Cloud</CardTitle>
                <CardDescription>Most common terms from customer feedback</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Word cloud visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Ticket Volume</CardTitle>
                <CardDescription>7-day forecast of expected ticket volume with confidence intervals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={[...ticketVolumeData.slice(-2), ...predictiveVolumeData]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip />
                      <Legend />
                      <Area dataKey="upper" name="Upper Bound" stroke="transparent" fill="#8884d8" fillOpacity={0.1} />
                      <Area dataKey="lower" name="Lower Bound" stroke="transparent" fill="#8884d8" fillOpacity={0.1} />
                      <Line type="monotone" dataKey="newTickets" name="Actual" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
                      <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#ff7300" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 5 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdvancedAnalyticsPage;
