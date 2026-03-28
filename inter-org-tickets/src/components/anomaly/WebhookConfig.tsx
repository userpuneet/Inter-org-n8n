import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Globe, Key, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WebhookConfig as WebhookConfigType } from './types';

const WebhookConfig = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookConfigType[]>([
    {
      id: '1',
      name: 'Primary Alert Endpoint',
      url: 'https://api.example.com/webhooks/alerts',
      isActive: true,
      events: ['alert.created', 'alert.updated', 'alert.resolved']
    }
  ]);
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '' });

  const addWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast({
        title: "Error",
        description: "Please fill in both name and URL",
        variant: "destructive",
      });
      return;
    }

    const webhook: WebhookConfigType = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      isActive: true,
      events: ['alert.created']
    };

    setWebhooks([...webhooks, webhook]);
    setNewWebhook({ name: '', url: '' });
    
    toast({
      title: "Success",
      description: "Webhook added successfully",
    });
  };

  const removeWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
    toast({
      title: "Success",
      description: "Webhook removed successfully",
    });
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(w => 
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ));
  };

  const testWebhook = async (webhook: WebhookConfigType) => {
    try {
      const testPayload = {
        event: 'webhook.test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'Test webhook from Anomaly Detection Console',
          webhook_id: webhook.id
        }
      };

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(testPayload),
      });

      toast({
        title: "Test Sent",
        description: `Test webhook sent to ${webhook.name}. Check your endpoint to verify receipt.`,
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send test webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Webhook Configuration
          </CardTitle>
          <p className="text-sm text-gray-600">
            Configure webhooks to receive real-time anomaly alerts
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add new webhook */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium">Add New Webhook</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Name</Label>
                <Input
                  id="webhook-name"
                  placeholder="e.g., Slack Alerts"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://hooks.slack.com/services/..."
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={addWebhook} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </div>

          {/* Existing webhooks */}
          <div className="space-y-4">
            <h4 className="font-medium">Configured Webhooks</h4>
            {webhooks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No webhooks configured</p>
            ) : (
              webhooks.map((webhook) => (
                <div key={webhook.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium">{webhook.name}</h5>
                        <Badge variant={webhook.isActive ? "default" : "secondary"}>
                          {webhook.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="h-4 w-4" />
                        <span className="font-mono text-xs">{webhook.url}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(webhook.url)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={webhook.isActive}
                        onCheckedChange={() => toggleWebhook(webhook.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testWebhook(webhook)}
                        disabled={!webhook.isActive}
                      >
                        Test
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWebhook(webhook.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Events</Label>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Webhook payload example */}
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
            <h4 className="font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              Example Webhook Payload
            </h4>
            <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`{
  "event": "alert.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "alert": {
    "id": "alert_123",
    "title": "CPU Usage Spike",
    "description": "CPU usage exceeded 90% threshold",
    "severity": "critical",
    "type": "performance",
    "source": "server-01",
    "status": "active",
    "metadata": {
      "cpu": "92%",
      "memory": "78%"
    }
  }
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookConfig;
