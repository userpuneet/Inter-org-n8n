
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  Github, 
  GitCommit, 
  Settings, 
  Link,
  Plus,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const GitIntegration = () => {
  const [autoLinkEnabled, setAutoLinkEnabled] = useState(true);
  const [branchCreationEnabled, setBranchCreationEnabled] = useState(false);

  const repositories = [
    {
      id: '1',
      name: 'frontend-app',
      url: 'https://github.com/company/frontend-app',
      provider: 'GitHub',
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z',
      commits: 1250
    },
    {
      id: '2',
      name: 'backend-api',
      url: 'https://github.com/company/backend-api',
      provider: 'GitHub',
      status: 'connected',
      lastSync: '2024-01-15T09:45:00Z',
      commits: 890
    }
  ];

  const recentCommits = [
    {
      id: '1',
      hash: 'abc123f',
      message: 'Fix user authentication issue - resolves TICKET-456',
      author: 'John Doe',
      timestamp: '2024-01-15T10:30:00Z',
      repository: 'frontend-app',
      ticketId: 'TICKET-456'
    },
    {
      id: '2',
      hash: 'def456a',
      message: 'Add new API endpoint for ticket search',
      author: 'Jane Smith',
      timestamp: '2024-01-15T09:15:00Z',
      repository: 'backend-api',
      ticketId: null
    },
    {
      id: '3',
      hash: 'ghi789b',
      message: 'Update documentation for TICKET-123',
      author: 'Mike Johnson',
      timestamp: '2024-01-14T16:20:00Z',
      repository: 'frontend-app',
      ticketId: 'TICKET-123'
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="repositories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="commits">Commit Linking</TabsTrigger>
          <TabsTrigger value="branches">Branch Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="repositories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    Connected Repositories
                  </CardTitle>
                  <CardDescription>
                    Manage Git repository connections for commit linking and branch creation
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Repository
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repositories.map((repo) => (
                  <div key={repo.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Github className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium">{repo.name}</div>
                          <div className="text-sm text-gray-500">{repo.url}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {repo.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>{repo.commits} commits tracked</span>
                        <Badge variant="outline">{repo.provider}</Badge>
                      </div>
                      <span>Last sync: {new Date(repo.lastSync).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCommit className="h-5 w-5" />
                Commit Linking
              </CardTitle>
              <CardDescription>
                Automatically link commits to tickets using commit message patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-link" className="text-base font-medium">
                    Auto-link commits to tickets
                  </Label>
                  <p className="text-sm text-gray-500">
                    Automatically detect ticket references in commit messages
                  </p>
                </div>
                <Switch
                  id="auto-link"
                  checked={autoLinkEnabled}
                  onCheckedChange={setAutoLinkEnabled}
                />
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Recognition Patterns</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Commits will be automatically linked when they contain these patterns:
                </p>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-gray-100 p-2 rounded">TICKET-123, #123, fixes #123</div>
                  <div className="bg-gray-100 p-2 rounded">resolves TICKET-456, closes #456</div>
                  <div className="bg-gray-100 p-2 rounded">ref TICKET-789, references #789</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Recent Linked Commits</h3>
                {recentCommits.map((commit) => (
                  <div key={commit.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{commit.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          by {commit.author} in {commit.repository}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {commit.ticketId && (
                          <Badge variant="outline" className="text-xs">
                            <Link className="h-3 w-3 mr-1" />
                            {commit.ticketId}
                          </Badge>
                        )}
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {commit.hash}
                        </code>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(commit.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Branch Management
              </CardTitle>
              <CardDescription>
                Automatically create and manage Git branches for tickets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="branch-creation" className="text-base font-medium">
                    Auto-create branches for tickets
                  </Label>
                  <p className="text-sm text-gray-500">
                    Automatically create feature branches when tickets are assigned
                  </p>
                </div>
                <Switch
                  id="branch-creation"
                  checked={branchCreationEnabled}
                  onCheckedChange={setBranchCreationEnabled}
                />
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Branch Naming Convention</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Configure how branch names are generated from ticket information:
                </p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="branch-pattern" className="text-sm">Branch Name Pattern</Label>
                    <Input
                      id="branch-pattern"
                      placeholder="feature/TICKET-{id}-{title-slug}"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Available variables: {'{id}'}, {'{title-slug}'}, {'{assignee}'}, {'{priority}'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium mb-1">Example:</p>
                    <code className="text-sm">feature/TICKET-123-fix-user-login-issue</code>
                  </div>
                </div>
              </div>

              <div className="text-center py-6">
                <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No automatic branches yet</h3>
                <p className="text-gray-500">Enable auto-creation to start generating branches for new tickets</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Git Integration Settings
              </CardTitle>
              <CardDescription>
                Configure global settings for Git integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="default-branch" className="text-sm font-medium">Default Base Branch</Label>
                  <Input
                    id="default-branch"
                    placeholder="main"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Default branch to create feature branches from
                  </p>
                </div>

                <div>
                  <Label htmlFor="webhook-url" className="text-sm font-medium">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://api.yourapp.com/webhooks/git"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Configure this URL in your Git repository settings to receive push notifications
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Webhook Events</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-events" className="text-sm">Push Events</Label>
                      <Switch id="push-events" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pr-events" className="text-sm">Pull Request Events</Label>
                      <Switch id="pr-events" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="branch-events" className="text-sm">Branch Events</Label>
                      <Switch id="branch-events" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GitIntegration;
