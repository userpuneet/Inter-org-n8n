
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar as CalendarIcon, 
  X,
  Filter,
  Save,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface SearchFilters {
  text: string;
  assignee: string[];
  status: string[];
  priority: string[];
  type: string[];
  labels: string[];
  dateCreated: { from?: Date; to?: Date };
  dateUpdated: { from?: Date; to?: Date };
  storyPoints: { min?: number; max?: number };
  customFields: Record<string, any>;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onSaveFilter?: (name: string, filters: SearchFilters) => void;
  savedFilters?: Array<{ name: string; filters: SearchFilters }>;
}

const AdvancedSearch = ({ onSearch, onSaveFilter, savedFilters = [] }: AdvancedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    text: '',
    assignee: [],
    status: [],
    priority: [],
    type: [],
    labels: [],
    dateCreated: {},
    dateUpdated: {},
    storyPoints: {},
    customFields: {}
  });

  const [saveFilterName, setSaveFilterName] = useState('');

  const users = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Alex Brown'];
  const statuses = ['To Do', 'In Progress', 'In Review', 'Done'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const types = ['Epic', 'Story', 'Task', 'Bug'];
  const availableLabels = ['frontend', 'backend', 'ui', 'security', 'performance', 'mobile', 'api'];

  const handleSearch = () => {
    onSearch(filters);
    setIsOpen(false);
  };

  const handleSaveFilter = () => {
    if (saveFilterName && onSaveFilter) {
      onSaveFilter(saveFilterName, filters);
      setSaveFilterName('');
    }
  };

  const clearFilters = () => {
    setFilters({
      text: '',
      assignee: [],
      status: [],
      priority: [],
      type: [],
      labels: [],
      dateCreated: {},
      dateUpdated: {},
      storyPoints: {},
      customFields: {}
    });
  };

  const applySavedFilter = (savedFilter: { name: string; filters: SearchFilters }) => {
    setFilters(savedFilter.filters);
    setIsOpen(false);
    onSearch(savedFilter.filters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search issues..."
            value={filters.text}
            onChange={(e) => setFilters({ ...filters, text: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Filter className="h-4 w-4 mr-2" />
          Advanced
        </Button>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {savedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Saved filters:</span>
          {savedFilters.map((saved, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => applySavedFilter(saved)}
            >
              {saved.name}
            </Badge>
          ))}
        </div>
      )}

      {isOpen && (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Advanced Search</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Assignee</Label>
                  <Select
                    value={filters.assignee[0] || ''}
                    onValueChange={(value) => setFilters({ ...filters, assignee: value ? [value] : [] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user} value={user}>{user}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {statuses.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`status-${status}`}
                          checked={filters.status.includes(status)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({ ...filters, status: [...filters.status, status] });
                            } else {
                              setFilters({ ...filters, status: filters.status.filter(s => s !== status) });
                            }
                          }}
                        />
                        <Label htmlFor={`status-${status}`} className="text-sm">{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Priority</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {priorities.map((priority) => (
                      <div key={priority} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`priority-${priority}`}
                          checked={filters.priority.includes(priority)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({ ...filters, priority: [...filters.priority, priority] });
                            } else {
                              setFilters({ ...filters, priority: filters.priority.filter(p => p !== priority) });
                            }
                          }}
                        />
                        <Label htmlFor={`priority-${priority}`} className="text-sm">{priority}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Issue Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {types.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`}
                          checked={filters.type.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({ ...filters, type: [...filters.type, type] });
                            } else {
                              setFilters({ ...filters, type: filters.type.filter(t => t !== type) });
                            }
                          }}
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Story Points Range</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.storyPoints.min || ''}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        storyPoints: { ...filters.storyPoints, min: e.target.value ? Number(e.target.value) : undefined }
                      })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.storyPoints.max || ''}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        storyPoints: { ...filters.storyPoints, max: e.target.value ? Number(e.target.value) : undefined }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Labels</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableLabels.map((label) => (
                      <Badge
                        key={label}
                        variant={filters.labels.includes(label) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          if (filters.labels.includes(label)) {
                            setFilters({ ...filters, labels: filters.labels.filter(l => l !== label) });
                          } else {
                            setFilters({ ...filters, labels: [...filters.labels, label] });
                          }
                        }}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <Button onClick={handleSearch}>Apply Filters</Button>
              <Button variant="outline" onClick={clearFilters}>Clear All</Button>
              
              {onSaveFilter && (
                <div className="flex items-center gap-2 ml-auto">
                  <Input
                    placeholder="Filter name"
                    value={saveFilterName}
                    onChange={(e) => setSaveFilterName(e.target.value)}
                    className="w-32"
                  />
                  <Button variant="outline" onClick={handleSaveFilter}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;
