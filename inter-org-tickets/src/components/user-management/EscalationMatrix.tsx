
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Clock, Users, Settings, Save } from 'lucide-react';

const severityLevels = [
  { id: 'critical', name: 'Critical', color: 'bg-red-100 text-red-800', priority: 1 },
  { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800', priority: 2 },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800', priority: 3 },
  { id: 'low', name: 'Low', color: 'bg-green-100 text-green-800', priority: 4 },
];

const escalationLevels = [
  { id: 'level1', name: 'Level 1 - Support Agent', role: 'Support Agent', timeLimit: 30 },
  { id: 'level2', name: 'Level 2 - Senior Support', role: 'Senior Support', timeLimit: 60 },
  { id: 'level3', name: 'Level 3 - Technical Lead', role: 'Technical Lead', timeLimit: 120 },
  { id: 'level4', name: 'Level 4 - Developer', role: 'Developer', timeLimit: 240 },
  { id: 'level5', name: 'Level 5 - Engineering Manager', role: 'Engineering Manager', timeLimit: 480 },
];

const defaultEscalationMatrix = {
  critical: ['level4', 'level5'],
  high: ['level2', 'level3', 'level4'],
  medium: ['level1', 'level2', 'level3'],
  low: ['level1', 'level2'],
};

const EscalationMatrix = () => {
  const [escalationMatrix, setEscalationMatrix] = useState(defaultEscalationMatrix);
  const [autoEscalation, setAutoEscalation] = useState(true);

  const handleEscalationChange = (severity: string, level: string, checked: boolean) => {
    setEscalationMatrix(prev => ({
      ...prev,
      [severity]: checked 
        ? [...prev[severity as keyof typeof prev], level]
        : prev[severity as keyof typeof prev].filter(l => l !== level)
    }));
  };

  const isLevelEnabled = (severity: string, level: string) => {
    return escalationMatrix[severity as keyof typeof escalationMatrix]?.includes(level) || false;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Escalation Matrix Configuration
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Configure escalation paths based on issue severity levels
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={autoEscalation}
                  onCheckedChange={setAutoEscalation}
                />
                <span className="text-sm font-medium">Auto Escalation</span>
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header with escalation levels */}
              <div className="grid grid-cols-6 gap-2 mb-4">
                <div className="font-medium text-sm text-gray-700">Severity Level</div>
                {escalationLevels.map((level) => (
                  <div key={level.id} className="text-center">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <div className="font-medium text-xs text-blue-800">{level.role}</div>
                      <div className="text-xs text-blue-600 mt-1 flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        {level.timeLimit}m
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Severity levels and escalation matrix */}
              {severityLevels.map((severity) => (
                <div key={severity.id} className="grid grid-cols-6 gap-2 items-center py-3 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Badge className={`${severity.color} flex items-center gap-1`}>
                      <AlertTriangle className="h-3 w-3" />
                      {severity.name}
                    </Badge>
                  </div>
                  {escalationLevels.map((level) => (
                    <div key={`${severity.id}-${level.id}`} className="flex justify-center">
                      <Checkbox
                        checked={isLevelEnabled(severity.id, level.id)}
                        onCheckedChange={(checked) => 
                          handleEscalationChange(severity.id, level.id, checked === true)
                        }
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Escalation Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Current Configuration:</h4>
              {severityLevels.map((severity) => (
                <div key={severity.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${severity.color} text-xs`}>
                      {severity.name}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {escalationMatrix[severity.id as keyof typeof escalationMatrix]?.length || 0} levels
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Active levels: {escalationMatrix[severity.id as keyof typeof escalationMatrix]
                      ?.map(levelId => escalationLevels.find(l => l.id === levelId)?.role)
                      .join(', ') || 'None'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Limits & SLA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Escalation Timeframes:</h4>
              {escalationLevels.map((level) => (
                <div key={level.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <div className="font-medium text-sm">{level.role}</div>
                    <div className="text-xs text-gray-500">{level.name}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {level.timeLimit} minutes
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm text-yellow-800">
                <strong>Note:</strong> Issues will automatically escalate to the next level if not resolved within the specified time limit.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EscalationMatrix;
