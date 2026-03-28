
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Key, 
  Code2, 
  Webhook, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus,
  Settings,
  Activity,
  Shield
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

const APIManagement = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'sk_live_123...abc',
      permissions: ['read:tickets', 'write:tickets', 'read:users'],
      lastUsed: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sk_test_456...def',
      permissions: ['read:tickets', 'read:users'],
      lastUsed: '2024-01-14T15:45:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      status: 'active'
    }
  ]);

  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="logs">API Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys
                  </CardTitle>
                  <CardDescription>
                    Manage API keys for third-party integrations
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate API Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{apiKey.name}</h3>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                          {apiKey.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 font-mono text-sm bg-gray-100 p-2 rounded">
                        {showKeys[apiKey.id] ? apiKey.key : '•'.repeat(20)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500">
                      Last used: {new Date(apiKey.lastUsed).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>
                    Configure webhooks for real-time notifications
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No webhooks configured</h3>
                <p className="text-gray-500 mb-4">Set up webhooks to receive real-time notifications about ticket updates</p>
                <Button>Configure First Webhook</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                API Documentation
              </CardTitle>
              <CardDescription>
                Complete REST API reference and examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Base URL</h3>
                  <code className="bg-gray-100 p-2 rounded block text-sm">
                    https://api.yourapp.com/v1
                  </code>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Authentication</h3>
                  <p className="text-sm text-gray-600 mb-2">Include your API key in the Authorization header:</p>
                  <code className="bg-gray-100 p-2 rounded block text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Common Endpoints</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>GET /tickets</span>
                      <span className="text-gray-500">List all tickets</span>
                    </div>
                    <div className="flex justify-between">
                      <span>POST /tickets</span>
                      <span className="text-gray-500">Create a new ticket</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GET /tickets/:id</span>
                      <span className="text-gray-500">Get ticket details</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PUT /tickets/:id</span>
                      <span className="text-gray-500">Update ticket</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                API Request Logs
              </CardTitle>
              <CardDescription>
                Monitor API usage and debug integration issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No API requests yet</h3>
                <p className="text-gray-500">API request logs will appear here once you start making calls</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIManagement;
