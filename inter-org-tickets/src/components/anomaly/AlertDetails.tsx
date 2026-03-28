
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Clock, User, Tag } from 'lucide-react';
import { Alert } from './types';

interface AlertDetailsProps {
  alert: Alert;
  onClose: () => void;
}

const AlertDetails = ({ alert, onClose }: AlertDetailsProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Alert Details</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">{alert.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={getSeverityColor(alert.severity)}>
              {alert.severity}
            </Badge>
            <Badge variant="outline">
              {alert.type}
            </Badge>
            <Badge variant="outline">
              {alert.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {new Date(alert.timestamp).toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Source: {alert.source}</span>
          </div>
          
          {alert.assignedTo && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Assigned to: {alert.assignedTo}</span>
            </div>
          )}
        </div>

        {Object.keys(alert.metadata).length > 0 && (
          <div className="border-t pt-4">
            <h5 className="font-medium mb-2">Metadata</h5>
            <div className="space-y-2">
              {Object.entries(alert.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{key}:</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <Button className="w-full" size="sm">
            Acknowledge Alert
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            Assign to Team
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            Create Incident
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertDetails;
