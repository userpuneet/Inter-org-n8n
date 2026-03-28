
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart3, 
  MessageSquare, 
  Heart, 
  AlertCircle, 
  Share2, 
  User, 
  Phone, 
  Mail, 
  CalendarIcon
} from "lucide-react";

// Sample data for customer profile
const customerProfiles = [
  {
    id: "cust-001",
    name: "Acme Corporation",
    company: "Acme Corp",
    avatar: "AC",
    email: "contact@acmecorp.com",
    phone: "(415) 555-1212",
    segment: "enterprise",
    healthScore: 87,
    lifetimeValue: 375000,
    joinDate: "2020-05-15",
    recentActivity: [
      {
        date: "2025-05-08T14:30:00Z",
        type: "ticket",
        description: "Submitted ticket #1234 about API performance issue"
      },
      {
        date: "2025-05-05T10:15:00Z",
        type: "meeting",
        description: "Quarterly business review with account manager"
      },
      {
        date: "2025-04-28T16:45:00Z",
        type: "purchase",
        description: "Added 50 new user licenses"
      }
    ],
    sentimentTrend: [
      { month: "Jan", score: 75 },
      { month: "Feb", score: 78 },
      { month: "Mar", score: 72 },
      { month: "Apr", score: 85 },
      { month: "May", score: 87 }
    ],
    topIssues: [
      { issue: "API Performance", count: 5 },
      { issue: "UI Navigation", count: 3 },
      { issue: "Report Accuracy", count: 2 }
    ],
    tags: ["Enterprise", "Financial Services", "API User", "High Value"]
  },
  {
    id: "cust-002",
    name: "TechFlow Inc",
    company: "TechFlow",
    avatar: "TF",
    email: "support@techflow.io",
    phone: "(408) 555-8765",
    segment: "mid-market",
    healthScore: 92,
    lifetimeValue: 120000,
    joinDate: "2021-11-03",
    recentActivity: [
      {
        date: "2025-05-09T09:10:00Z",
        type: "feedback",
        description: "Provided positive feedback on new reporting feature"
      }
    ],
    sentimentTrend: [
      { month: "Jan", score: 82 },
      { month: "Feb", score: 85 },
      { month: "Mar", score: 88 },
      { month: "Apr", score: 90 },
      { month: "May", score: 92 }
    ],
    topIssues: [],
    tags: ["Mid-Market", "Technology", "Growth Account", "Champion"]
  },
  {
    id: "cust-003",
    name: "GlobalSoft",
    company: "GlobalSoft",
    avatar: "GS",
    email: "help@globalsoft.com",
    phone: "(628) 555-9876",
    segment: "enterprise",
    healthScore: 65,
    lifetimeValue: 285000,
    joinDate: "2019-08-22",
    recentActivity: [
      {
        date: "2025-05-07T15:20:00Z",
        type: "ticket",
        description: "Reported critical issue with data sync"
      }
    ],
    sentimentTrend: [
      { month: "Jan", score: 75 },
      { month: "Feb", score: 70 },
      { month: "Mar", score: 68 },
      { month: "Apr", score: 62 },
      { month: "May", score: 65 }
    ],
    topIssues: [
      { issue: "Data Synchronization", count: 7 },
      { issue: "Authentication", count: 5 },
      { issue: "Performance", count: 4 }
    ],
    tags: ["Enterprise", "Manufacturing", "At Risk", "Complex Deployment"]
  }
];

// Customer journey touchpoints
const customerJourneyData = [
  { subject: "First Contact", fullMark: 100, customer: 80, avg: 65 },
  { subject: "Issue Resolution", fullMark: 100, customer: 75, avg: 70 },
  { subject: "Documentation", fullMark: 100, customer: 90, avg: 75 },
  { subject: "Follow-up", fullMark: 100, customer: 85, avg: 60 },
  { subject: "Self-service", fullMark: 100, customer: 70, avg: 60 },
  { subject: "Feature Access", fullMark: 100, customer: 95, avg: 80 }
];

// Sentiment analysis data
const sentimentData = [
  { month: "Jan", positive: 75, neutral: 15, negative: 10 },
  { month: "Feb", positive: 70, neutral: 20, negative: 10 },
  { month: "Mar", positive: 80, neutral: 12, negative: 8 },
  { month: "Apr", positive: 85, neutral: 10, negative: 5 },
  { month: "May", positive: 90, neutral: 7, negative: 3 }
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const SENTIMENT_COLORS = {
  positive: '#22C55E',
  neutral: '#94A3B8',
  negative: '#EF4444'
};

const CustomerInsightsPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(customerProfiles[0]);
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Customer Experience Insights</h1>
            <p className="text-gray-500">Comprehensive view of customer satisfaction and journey analytics</p>
          </div>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="journey">Journey Mapping</TabsTrigger>
            <TabsTrigger value="sentiment">Voice of Customer</TabsTrigger>
            <TabsTrigger value="profiles">Customer Profiles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Key metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Overall Satisfaction</p>
                      <h3 className="text-3xl font-bold">86%</h3>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      2.5%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">NPS Score</p>
                      <h3 className="text-3xl font-bold">+42</h3>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      4
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Customer Effort Score</p>
                      <h3 className="text-3xl font-bold">3.2/5</h3>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      0.3
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Retention Rate</p>
                      <h3 className="text-3xl font-bold">94%</h3>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      1.5%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Customer health score breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Health Distribution</CardTitle>
                <CardDescription>Breakdown of customers by health score segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { range: "90-100", count: 42, segment: "Promoters" },
                        { range: "70-89", count: 28, segment: "Satisfied" },
                        { range: "50-69", count: 15, segment: "At Risk" },
                        { range: "0-49", count: 7, segment: "Detractors" }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Customer Count" fill="#8884d8">
                        <Cell fill="#22C55E" />
                        <Cell fill="#3B82F6" />
                        <Cell fill="#FBBF24" />
                        <Cell fill="#EF4444" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Sentiment analysis trend */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Sentiment Trend</CardTitle>
                <CardDescription>6-month tracking of sentiment across channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: "Dec", positive: 65, neutral: 25, negative: 10 },
                        { month: "Jan", positive: 68, neutral: 22, negative: 10 },
                        { month: "Feb", positive: 70, neutral: 20, negative: 10 },
                        { month: "Mar", positive: 72, neutral: 18, negative: 10 },
                        { month: "Apr", positive: 75, neutral: 17, negative: 8 },
                        { month: "May", positive: 78, neutral: 15, negative: 7 }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="positive" 
                        stackId="1"
                        stroke={SENTIMENT_COLORS.positive} 
                        fill={SENTIMENT_COLORS.positive} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="neutral" 
                        stackId="1"
                        stroke={SENTIMENT_COLORS.neutral} 
                        fill={SENTIMENT_COLORS.neutral} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="negative" 
                        stackId="1"
                        stroke={SENTIMENT_COLORS.negative} 
                        fill={SENTIMENT_COLORS.negative} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="journey" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Journey Touchpoint Analysis</CardTitle>
                <CardDescription>Performance across key customer journey touchpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={customerJourneyData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="touchpoint" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar 
                        name="Current Score" 
                        dataKey="customer" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.6}
                      />
                      <Radar 
                        name="Industry Average" 
                        dataKey="avg" 
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        fillOpacity={0.6} 
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sentiment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Sentiment Analysis</CardTitle>
                <CardDescription>Tracking sentiment trends across customer interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sentimentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="positive" name="Positive" stackId="a" fill={SENTIMENT_COLORS.positive} />
                      <Bar dataKey="neutral" name="Neutral" stackId="a" fill={SENTIMENT_COLORS.neutral} />
                      <Bar dataKey="negative" name="Negative" stackId="a" fill={SENTIMENT_COLORS.negative} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profiles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Customer Profiles</CardTitle>
                    <CardDescription>Select a customer to view details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 p-2">
                    {customerProfiles.map(customer => (
                      <div 
                        key={customer.id}
                        className={`p-2 rounded-md cursor-pointer ${selectedCustomer.id === customer.id ? 'bg-primary-100 border border-primary' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{customer.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{customer.name}</h4>
                            <Badge variant="outline" className={`
                              ${customer.segment === 'enterprise' ? 'bg-purple-50 text-purple-600' : 
                                customer.segment === 'mid-market' ? 'bg-blue-50 text-blue-600' : 
                                'bg-green-50 text-green-600'}
                            `}>
                              {customer.segment === 'enterprise' ? 'Enterprise' : 
                              customer.segment === 'mid-market' ? 'Mid-Market' : 
                              'Small Business'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              customer.healthScore >= 80 ? 'bg-green-500' : 
                              customer.healthScore >= 60 ? 'bg-amber-500' : 
                              'bg-red-500'
                            }`}></div>
                            <span className="text-xs text-gray-500">Health: {customer.healthScore}%</span>
                          </div>
                          <span className="text-xs text-gray-500">${(customer.lifetimeValue / 1000).toFixed(0)}k LTV</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{selectedCustomer.name}</CardTitle>
                        <CardDescription>
                          Customer since {new Date(selectedCustomer.joinDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button size="sm">View Full Profile</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Health Score</p>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-2xl font-bold ${
                            selectedCustomer.healthScore >= 80 ? 'text-green-600' : 
                            selectedCustomer.healthScore >= 60 ? 'text-amber-600' : 
                            'text-red-600'
                          }`}>
                            {selectedCustomer.healthScore}%
                          </h3>
                          {selectedCustomer.sentimentTrend && selectedCustomer.sentimentTrend.length > 1 && (
                            <Badge variant="outline" className={
                              selectedCustomer.sentimentTrend[selectedCustomer.sentimentTrend.length - 1].score > 
                              selectedCustomer.sentimentTrend[selectedCustomer.sentimentTrend.length - 2].score
                                ? "bg-green-50 text-green-600" 
                                : "bg-red-50 text-red-600"
                            }>
                              {selectedCustomer.sentimentTrend[selectedCustomer.sentimentTrend.length - 1].score > 
                                selectedCustomer.sentimentTrend[selectedCustomer.sentimentTrend.length - 2].score
                                ? <ArrowUpRight className="h-3 w-3 mr-1" />
                                : <ArrowDownRight className="h-3 w-3 mr-1" />
                              }
                              {Math.abs(
                                selectedCustomer.sentimentTrend[selectedCustomer.sentimentTrend.length - 1].score - 
                                selectedCustomer.sentimentTrend[selectedCustomer.sentimentTrend.length - 2].score
                              )}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Lifetime Value</p>
                        <h3 className="text-2xl font-bold">${(selectedCustomer.lifetimeValue).toLocaleString()}</h3>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Segment</p>
                        <Badge variant="outline" className={`
                          ${selectedCustomer.segment === 'enterprise' ? 'bg-purple-50 text-purple-600 border-purple-200' : 
                            selectedCustomer.segment === 'mid-market' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                            'bg-green-50 text-green-600 border-green-200'}
                        `}>
                          {selectedCustomer.segment === 'enterprise' ? 'Enterprise' : 
                          selectedCustomer.segment === 'mid-market' ? 'Mid-Market' : 
                          'Small Business'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <h4 className="font-medium mb-3">Contact Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{selectedCustomer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{selectedCustomer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>3 contacts</span>
                          </div>
                        </div>
                        
                        <h4 className="font-medium mt-6 mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCustomer.tags.map((tag, i) => (
                            <Badge key={i} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                        
                        <h4 className="font-medium mt-6 mb-3">Top Issues</h4>
                        <div className="space-y-2">
                          {selectedCustomer.topIssues.map((issue, i) => (
                            <div key={i} className="flex justify-between">
                              <span className="text-sm">{issue.issue}</span>
                              <Badge variant="outline">{issue.count} tickets</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <h4 className="font-medium mb-3">Sentiment Trend</h4>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={selectedCustomer.sentimentTrend}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="month" />
                              <YAxis domain={[50, 100]} />
                              <Tooltip />
                              <Line 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#8884d8" 
                                strokeWidth={2} 
                                dot={{ r: 4 }} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <h4 className="font-medium mt-6 mb-3">Recent Activity</h4>
                        <div className="space-y-3">
                          {selectedCustomer.recentActivity.map((activity, i) => (
                            <div key={i} className="flex gap-3">
                              <div className={`mt-0.5 rounded-full p-1 ${
                                activity.type === 'ticket' ? 'bg-red-100' : 
                                activity.type === 'meeting' ? 'bg-blue-100' : 
                                activity.type === 'purchase' ? 'bg-green-100' :
                                'bg-purple-100'
                              }`}>
                                {activity.type === 'ticket' && <MessageSquare className="h-4 w-4 text-red-600" />}
                                {activity.type === 'meeting' && <CalendarIcon className="h-4 w-4 text-blue-600" />}
                                {activity.type === 'purchase' && <ArrowUpRight className="h-4 w-4 text-green-600" />}
                                {activity.type === 'feedback' && <MessageSquare className="h-4 w-4 text-purple-600" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">{activity.description}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(activity.date).toLocaleString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4 border-t">
                      <Button variant="outline">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button>Create Action Plan</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomerInsightsPage;
