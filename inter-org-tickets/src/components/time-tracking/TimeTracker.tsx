
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

interface TimeEntry {
  id: string;
  issueId: string;
  description: string;
  duration: number; // in seconds
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  date: string;
}

interface TimeTrackerProps {
  issueId: string;
  issueTitle: string;
  onTimeUpdate?: (totalTime: number) => void;
}

const TimeTracker = ({ issueId, issueTitle, onTimeUpdate }: TimeTrackerProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [manualTime, setManualTime] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && currentEntry) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const start = currentEntry.startTime.getTime();
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, currentEntry]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTracking = () => {
    const entry: TimeEntry = {
      id: Date.now().toString(),
      issueId,
      description: '',
      duration: 0,
      startTime: new Date(),
      isActive: true,
      date: format(new Date(), 'yyyy-MM-dd')
    };
    setCurrentEntry(entry);
    setIsTracking(true);
    setElapsedTime(0);
  };

  const pauseTracking = () => {
    if (currentEntry) {
      const duration = Math.floor((new Date().getTime() - currentEntry.startTime.getTime()) / 1000);
      setCurrentEntry({ ...currentEntry, duration });
    }
    setIsTracking(false);
  };

  const stopTracking = () => {
    if (currentEntry) {
      const duration = Math.floor((new Date().getTime() - currentEntry.startTime.getTime()) / 1000);
      const finalEntry: TimeEntry = {
        ...currentEntry,
        duration,
        endTime: new Date(),
        isActive: false
      };
      
      setTimeEntries([...timeEntries, finalEntry]);
      updateTotalTime([...timeEntries, finalEntry]);
    }
    
    setCurrentEntry(null);
    setIsTracking(false);
    setElapsedTime(0);
  };

  const addManualTime = () => {
    if (!manualTime) return;
    
    const [hours, minutes] = manualTime.split(':').map(Number);
    const duration = (hours * 3600) + (minutes * 60);
    
    const entry: TimeEntry = {
      id: Date.now().toString(),
      issueId,
      description: manualDescription || 'Manual time entry',
      duration,
      startTime: new Date(),
      endTime: new Date(),
      isActive: false,
      date: format(new Date(), 'yyyy-MM-dd')
    };
    
    const newEntries = [...timeEntries, entry];
    setTimeEntries(newEntries);
    updateTotalTime(newEntries);
    setManualTime('');
    setManualDescription('');
  };

  const deleteEntry = (entryId: string) => {
    const newEntries = timeEntries.filter(entry => entry.id !== entryId);
    setTimeEntries(newEntries);
    updateTotalTime(newEntries);
  };

  const updateTotalTime = (entries: TimeEntry[]) => {
    const total = entries.reduce((sum, entry) => sum + entry.duration, 0);
    if (onTimeUpdate) {
      onTimeUpdate(total);
    }
  };

  const getTotalTime = () => {
    const total = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return total + (isTracking ? elapsedTime : 0);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Tracking - {issueTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Active Timer */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-2xl font-mono font-bold">
                {formatDuration(isTracking ? elapsedTime : 0)}
              </div>
              {isTracking && (
                <div className="text-sm text-gray-500">
                  Started at {format(currentEntry?.startTime || new Date(), 'HH:mm')}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {!isTracking ? (
                <Button onClick={startTracking}>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={pauseTracking}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button variant="destructive" onClick={stopTracking}>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Manual Time Entry */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Add Manual Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="manual-time">Duration (HH:MM)</Label>
                <Input
                  id="manual-time"
                  placeholder="1:30"
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="manual-description">Description</Label>
                <div className="flex gap-2">
                  <Input
                    id="manual-description"
                    placeholder="What did you work on?"
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                  />
                  <Button onClick={addManualTime}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Total Time */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Total Time Logged:</span>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {formatDuration(getTotalTime())}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Time Entries History */}
      {timeEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Time Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{formatDuration(entry.duration)}</Badge>
                      <span className="text-sm text-gray-500">{entry.date}</span>
                    </div>
                    <p className="text-sm mt-1">{entry.description || 'No description'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimeTracker;
