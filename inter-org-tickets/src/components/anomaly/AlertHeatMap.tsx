
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from './types';
import { cn } from '@/lib/utils';

interface AlertHeatMapProps {
  alerts: Alert[];
}

const AlertHeatMap = ({ alerts }: AlertHeatMapProps) => {
  const sources = ['server-01', 'server-02', 'database-cluster', 'auth-service', 'api-gateway', 'load-balancer'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  
  const getHeatMapData = () => {
    const data: { [key: string]: { [key: number]: number } } = {};
    
    sources.forEach(source => {
      data[source] = {};
      timeSlots.forEach(hour => {
        data[source][hour] = 0;
      });
    });
    
    alerts.forEach(alert => {
      const hour = new Date(alert.timestamp).getHours();
      if (data[alert.source]) {
        data[alert.source][hour] = (data[alert.source][hour] || 0) + 1;
      }
    });
    
    return data;
  };

  const heatMapData = getHeatMapData();
  const maxValue = Math.max(...Object.values(heatMapData).flatMap(source => Object.values(source)));

  const getIntensityColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    const intensity = value / maxValue;
    if (intensity > 0.8) return 'bg-red-500';
    if (intensity > 0.6) return 'bg-red-400';
    if (intensity > 0.4) return 'bg-orange-400';
    if (intensity > 0.2) return 'bg-yellow-400';
    return 'bg-green-300';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Alert Heat Map - Last 24 Hours</CardTitle>
        <p className="text-sm text-gray-600">
          Darker colors indicate higher alert density
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Hour headers */}
            <div className="flex mb-2">
              <div className="w-32 flex-shrink-0"></div>
              {timeSlots.map(hour => (
                <div key={hour} className="w-8 h-8 flex items-center justify-center text-xs text-gray-600">
                  {hour.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
            
            {/* Heat map rows */}
            {sources.map(source => (
              <div key={source} className="flex items-center mb-1">
                <div className="w-32 flex-shrink-0 text-sm font-medium text-gray-700 pr-4">
                  {source}
                </div>
                {timeSlots.map(hour => {
                  const value = heatMapData[source][hour];
                  return (
                    <div
                      key={`${source}-${hour}`}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center text-xs font-medium border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all",
                        getIntensityColor(value),
                        value > 0 ? "text-white" : "text-gray-500"
                      )}
                      title={`${source} at ${hour}:00 - ${value} alerts`}
                    >
                      {value > 0 ? value : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-4">
          <span className="text-sm text-gray-600">Less</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200"></div>
            <div className="w-4 h-4 bg-green-300 border border-gray-200"></div>
            <div className="w-4 h-4 bg-yellow-400 border border-gray-200"></div>
            <div className="w-4 h-4 bg-orange-400 border border-gray-200"></div>
            <div className="w-4 h-4 bg-red-400 border border-gray-200"></div>
            <div className="w-4 h-4 bg-red-500 border border-gray-200"></div>
          </div>
          <span className="text-sm text-gray-600">More</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertHeatMap;
