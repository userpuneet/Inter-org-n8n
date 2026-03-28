
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Settings, 
  Shield, 
  Filter,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

const EmailIntegration = () => {
  const [emailToTicketEnabled, setEmailToTicketEnabled] = useState(true);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);
  const [spamFilterEnabled, setSpamFilterEnabled] = useState(true);

  const emailAccounts = [
    {
      id: '1',
      email: 'support@company.com',
      status: 'connected',
      ticketsCreated: 145,
      lastSync: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      email: 'help@company.com',
      status: 'connected',
      ticketsCreated: 89,
      lastSync: '2024-01-15T09:45:00Z'
    }
  ];

  const parsingRules = [
    {
      id: '1',
      name: 'Priority Detection',
      description: 'Automatically set priority based on subject keywords',
      trigger: 'Subject contains "URGENT", "CRITICAL"',
      action: 'Set priority to High',
      enabled: true
    },
    {
      id: '2',
      name: 'Department Routing',
      description: 'Route emails to specific teams based on recipient',
      trigger: 'Email sent to billing@company.com',
      action: 'Assign to Billing team',
      enabled: true
    },
    {
      id: '3',
      name: 'Customer Type Detection',
      description: 'Tag tickets based on sender domain',
      trigger: 'Sender domain is enterprise customer',
      action: 'Add "Enterprise" tag',
      enabled: false
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList>
          <TabsTrigger value="setup">Email Setup</TabsTrigger>
          <TabsTrigger value="parsing">Smart Parsing</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email-to-Ticket Configuration
              </CardTitle>
              <CardDescription>
                Convert incoming emails into support tickets automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-to-ticket" className="text-base font-medium">
                    Enable Email-to-Ticket
                  </Label>
                  <p className="text-sm text-gray-500">
                    Automatically create tickets from incoming emails
                  </p>
                </div>
                <Switch
                  id="email-to-ticket"
                  checked={emailToTicketEnabled}
                  onCheckedChange={setEmailToTicketEnabled}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Connected Email Accounts</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Email Account
                  </Button>
                </div>
                
                {emailAccounts.map((account) => (
                  <div key={account.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">{account.email}</div>
                          <div className="text-sm text-gray-500">
                            {account.ticketsCreated} tickets created
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {account.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last sync: {new Date(account.lastSync).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-medium">Advanced Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-assign" className="text-sm font-medium">
                      Auto-assign to available agents
                    </Label>
                    <p className="text-xs text-gray-500">
                      Automatically assign new tickets to available team members
                    </p>
                  </div>
                  <Switch
                    id="auto-assign"
                    checked={autoAssignEnabled}
                    onCheckedChange={setAutoAssignEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="spam-filter" className="text-sm font-medium">
                      Enable spam filtering
                    </Label>
                    <p className="text-xs text-gray-500">
                      Filter out spam emails before creating tickets
                    </p>
                  </div>
                  <Switch
                    id="spam-filter"
                    checked={spamFilterEnabled}
                    onCheckedChange={setSpamFilterEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parsing" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Smart Email Parsing
                  </CardTitle>
                  <CardDescription>
                    Configure rules to automatically process and categorize incoming emails
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parsingRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium">{rule.name}</h3>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={rule.enabled} />
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{rule.trigger}</Badge>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <Badge variant="outline">{rule.action}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Templates
              </CardTitle>
              <CardDescription>
                Manage automated email responses and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Email Templates</h3>
                <p className="text-gray-500 mb-4">Create and manage email templates for automated responses</p>
                <Button>Create Template</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Email Processing Logs
              </CardTitle>
              <CardDescription>
                Monitor email processing and troubleshoot issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No logs available</h3>
                <p className="text-gray-500">Email processing logs will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailIntegration;
