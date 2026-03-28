
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert } from './types';

interface AlertClassificationProps {
  alerts: Alert[];
}

const AlertClassification = ({ alerts }: AlertClassificationProps) => {
  const getSeverityStats = () => {
    const stats = {
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length,
    };
    return stats;
  };

  const getTypeStats = () => {
    const types = ['performance', 'security', 'data-quality', 'network', 'system'];
    return types.map(type => ({
      type,
      count: alerts.filter(a => a.type === type).length,
      percentage: alerts.length > 0 ? (alerts.filter(a => a.type === type).length / alerts.length) * 100 : 0
    }));
  };

  const severityStats = getSeverityStats();
  const typeStats = getTypeStats();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alert Classification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">By Severity</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-600">Critical</span>
                <span className="text-sm font-medium">{severityStats.critical}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-600">High</span>
                <span className="text-sm font-medium">{severityStats.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-600">Medium</span>
                <span className="text-sm font-medium">{severityStats.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600">Low</span>
                <span className="text-sm font-medium">{severityStats.low}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">By Type</h4>
            <div className="space-y-3">
              {typeStats.map(({ type, count, percentage }) => (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm capitalize">{type.replace('-', ' ')}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertClassification;
