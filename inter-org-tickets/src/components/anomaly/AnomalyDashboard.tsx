
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlertFeed from './AlertFeed';
import AlertClassification from './AlertClassification';
import AnomalyTimeline from './AnomalyTimeline';
import AlertDetails from './AlertDetails';
import CorrelationMatrix from './CorrelationMatrix';
import WebhookConfig from './WebhookConfig';
import AlertFilters from './AlertFilters';
import AlertHeatMap from './AlertHeatMap';
import { Alert } from './types';

const AnomalyDashboard = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    timeRange: '24h',
    status: 'all'
  });

  // Mock data for development
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        title: 'CPU Usage Spike',
        description: 'CPU usage exceeded 90% threshold on server-01',
        severity: 'critical',
        type: 'performance',
        timestamp: new Date().toISOString(),
        status: 'active',
        source: 'server-01',
        metadata: { cpu: '92%', memory: '78%' }
      },
      {
        id: '2',
        title: 'Unusual Login Pattern',
        description: 'Multiple failed login attempts detected',
        severity: 'high',
        type: 'security',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'investigating',
        source: 'auth-service',
        metadata: { attempts: 15, ip: '192.168.1.100' }
      },
      {
        id: '3',
        title: 'Data Quality Issue',
        description: 'Missing data points in customer records',
        severity: 'medium',
        type: 'data-quality',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'resolved',
        source: 'database-cluster',
        metadata: { records: 250, percentage: '2.1%' }
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (filters.severity !== 'all' && alert.severity !== filters.severity) return false;
    if (filters.type !== 'all' && alert.type !== filters.type) return false;
    if (filters.status !== 'all' && alert.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{alerts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.severity === 'critical').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AlertFilters filters={filters} onFiltersChange={setFilters} />
              <AlertFeed 
                alerts={filteredAlerts} 
                onSelectAlert={setSelectedAlert}
                selectedAlert={selectedAlert}
              />
            </div>
            <div className="space-y-6">
              <AlertClassification alerts={alerts} />
              {selectedAlert && (
                <AlertDetails 
                  alert={selectedAlert} 
                  onClose={() => setSelectedAlert(null)}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <AnomalyTimeline alerts={alerts} />
        </TabsContent>

        <TabsContent value="heatmap">
          <AlertHeatMap alerts={alerts} />
        </TabsContent>

        <TabsContent value="correlation">
          <CorrelationMatrix alerts={alerts} />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookConfig />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-600">
                Configuration options and preferences will be available here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnomalyDashboard;
