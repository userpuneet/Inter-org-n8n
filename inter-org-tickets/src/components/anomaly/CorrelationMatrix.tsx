
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from './types';
import { cn } from '@/lib/utils';

interface CorrelationMatrixProps {
  alerts: Alert[];
}

const CorrelationMatrix = ({ alerts }: CorrelationMatrixProps) => {
  const systems = ['server-01', 'server-02', 'database-cluster', 'auth-service', 'api-gateway', 'load-balancer'];
  
  // Mock correlation data - in a real system this would be calculated based on alert patterns
  const getCorrelationData = () => {
    const correlations: { [key: string]: { [key: string]: number } } = {};
    
    systems.forEach(system1 => {
      correlations[system1] = {};
      systems.forEach(system2 => {
        if (system1 === system2) {
          correlations[system1][system2] = 1;
        } else {
          // Mock correlation values between 0 and 1
          correlations[system1][system2] = Math.random() * 0.8 + 0.1;
        }
      });
    });
    
    return correlations;
  };

  const correlationData = getCorrelationData();

  const getCorrelationColor = (value: number) => {
    if (value === 1) return 'bg-blue-600 text-white';
    if (value > 0.8) return 'bg-red-500 text-white';
    if (value > 0.6) return 'bg-red-400 text-white';
    if (value > 0.4) return 'bg-orange-400 text-white';
    if (value > 0.2) return 'bg-yellow-400 text-gray-800';
    return 'bg-green-300 text-gray-800';
  };

  const getCorrelationLabel = (value: number) => {
    if (value === 1) return 'Self';
    if (value > 0.8) return 'Very High';
    if (value > 0.6) return 'High';
    if (value > 0.4) return 'Medium';
    if (value > 0.2) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Correlation Matrix</CardTitle>
          <p className="text-sm text-gray-600">
            Shows how alerts in different systems correlate with each other
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Column headers */}
              <div className="flex mb-2">
                <div className="w-32 flex-shrink-0"></div>
                {systems.map(system => (
                  <div key={system} className="w-24 h-16 flex items-end justify-center pb-2">
                    <div className="text-xs text-gray-600 transform -rotate-45 origin-bottom">
                      {system}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Matrix rows */}
              {systems.map(system1 => (
                <div key={system1} className="flex items-center mb-1">
                  <div className="w-32 flex-shrink-0 text-sm font-medium text-gray-700 pr-4">
                    {system1}
                  </div>
                  {systems.map(system2 => {
                    const value = correlationData[system1][system2];
                    return (
                      <div
                        key={`${system1}-${system2}`}
                        className={cn(
                          "w-24 h-12 flex flex-col items-center justify-center text-xs font-medium border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all",
                          getCorrelationColor(value)
                        )}
                        title={`Correlation: ${getCorrelationLabel(value)} (${value.toFixed(2)})`}
                      >
                        <div className="font-bold">{value.toFixed(2)}</div>
                        <div className="text-[10px] opacity-80">
                          {getCorrelationLabel(value)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-6 space-y-2">
            <div className="text-sm font-medium text-gray-700">Correlation Strength:</div>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 border border-gray-200"></div>
                <span>Self (1.0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 border border-gray-200"></div>
                <span>Very High (0.8+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 border border-gray-200"></div>
                <span>High (0.6-0.8)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-400 border border-gray-200"></div>
                <span>Medium (0.4-0.6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 border border-gray-200"></div>
                <span>Low (0.2-0.4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-300 border border-gray-200"></div>
                <span>Very Low (0.1-0.2)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrelationMatrix;
