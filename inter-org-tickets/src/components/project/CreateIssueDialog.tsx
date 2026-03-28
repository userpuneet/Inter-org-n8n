
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';

const createIssueSchema = z.object({
  title: z.string().min(1, 'Title is required').min(5, 'Title must be at least 5 characters'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['Story', 'Task', 'Bug', 'Epic'], {
    required_error: 'Please select an issue type'
  }),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical'], {
    required_error: 'Please select a priority'
  }),
  assignee: z.string().min(1, 'Please assign to someone'),
  storyPoints: z.number().min(1, 'Story points must be at least 1').max(100, 'Story points cannot exceed 100'),
  status: z.enum(['todo', 'inprogress', 'review', 'done']).default('todo'),
  labels: z.array(z.string()).default([])
});

type CreateIssueFormData = z.infer<typeof createIssueSchema>;

interface CreateIssueDialogProps {
  projectKey?: string;
  onIssueCreate?: (issue: any) => void;
  trigger?: React.ReactNode;
}

const CreateIssueDialog = ({ projectKey, onIssueCreate, trigger }: CreateIssueDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  
  const form = useForm<CreateIssueFormData>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'Task',
      priority: 'Medium',
      assignee: '',
      storyPoints: 1,
      status: 'todo',
      labels: []
    }
  });

  const assignees = [
    'John Doe',
    'Jane Smith', 
    'Mike Johnson',
    'Sarah Wilson',
    'Alex Brown'
  ];

  const predefinedLabels = [
    'frontend', 'backend', 'ui', 'ux', 'security', 'performance', 
    'bugfix', 'feature', 'mobile', 'devops', 'testing', 'documentation'
  ];

  const onSubmit = (data: CreateIssueFormData) => {
    const issueId = `${projectKey}-${Math.floor(Math.random() * 1000) + 100}`;
    
    const newIssue = {
      ...data,
      id: issueId,
      avatar: '/placeholder.svg',
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0]
    };
    
    if (onIssueCreate) {
      onIssueCreate(newIssue);
    }
    
    setOpen(false);
    form.reset();
  };

  const addLabel = (label: string) => {
    const currentLabels = form.getValues('labels');
    if (!currentLabels.includes(label)) {
      form.setValue('labels', [...currentLabels, label]);
    }
    setNewLabel('');
  };

  const removeLabel = (labelToRemove: string) => {
    const currentLabels = form.getValues('labels');
    form.setValue('labels', currentLabels.filter(label => label !== labelToRemove));
  };

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Create Issue
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter issue title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the issue..." rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Story">📖 Story</SelectItem>
                        <SelectItem value="Task">✅ Task</SelectItem>
                        <SelectItem value="Bug">🐛 Bug</SelectItem>
                        <SelectItem value="Epic">🚀 Epic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">🟢 Low</SelectItem>
                        <SelectItem value="Medium">🟡 Medium</SelectItem>
                        <SelectItem value="High">🟠 High</SelectItem>
                        <SelectItem value="Critical">🔴 Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assignees.map((assignee) => (
                          <SelectItem key={assignee} value={assignee}>
                            {assignee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storyPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Points *</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 5, 8, 13, 21].map((points) => (
                          <SelectItem key={points} value={points.toString()}>
                            {points}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="labels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Labels</FormLabel>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((label) => (
                        <Badge key={label} variant="secondary" className="flex items-center gap-1">
                          {label}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeLabel(label)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom label"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newLabel.trim()) addLabel(newLabel.trim());
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => newLabel.trim() && addLabel(newLabel.trim())}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {predefinedLabels.map((label) => (
                        <Badge 
                          key={label} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => addLabel(label)}
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Issue'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueDialog;
