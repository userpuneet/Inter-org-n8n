
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Alert } from './types';

interface AnomalyTimelineProps {
  alerts: Alert[];
}

const AnomalyTimeline = ({ alerts }: AnomalyTimelineProps) => {
  const generateTimelineData = () => {
    const now = new Date();
    const data = [];
    
    // Generate hourly data for the last 24 hours
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourStart = hour.getTime();
      const hourEnd = hourStart + 60 * 60 * 1000;
      
      const hourAlerts = alerts.filter(alert => {
        const alertTime = new Date(alert.timestamp).getTime();
        return alertTime >= hourStart && alertTime < hourEnd;
      });
      
      const criticalCount = hourAlerts.filter(a => a.severity === 'critical').length;
      const highCount = hourAlerts.filter(a => a.severity === 'high').length;
      const mediumCount = hourAlerts.filter(a => a.severity === 'medium').length;
      const lowCount = hourAlerts.filter(a => a.severity === 'low').length;
      
      data.push({
        time: hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        critical: criticalCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount,
        total: hourAlerts.length
      });
    }
    
    return data;
  };

  const timelineData = generateTimelineData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Anomaly Timeline - Last 24 Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="critical" 
                  stackId="1" 
                  stroke="#dc2626" 
                  fill="#dc2626" 
                  fillOpacity={0.8}
                />
                <Area 
                  type="monotone" 
                  dataKey="high" 
                  stackId="1" 
                  stroke="#ea580c" 
                  fill="#ea580c" 
                  fillOpacity={0.8}
                />
                <Area 
                  type="monotone" 
                  dataKey="medium" 
                  stackId="1" 
                  stroke="#d97706" 
                  fill="#d97706" 
                  fillOpacity={0.8}
                />
                <Area 
                  type="monotone" 
                  dataKey="low" 
                  stackId="1" 
                  stroke="#2563eb" 
                  fill="#2563eb" 
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnomalyTimeline;
