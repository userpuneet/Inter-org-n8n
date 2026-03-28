
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').min(3, 'Project name must be at least 3 characters'),
  key: z.string().min(1, 'Project key is required').min(2, 'Project key must be at least 2 characters').max(10, 'Project key must be at most 10 characters').regex(/^[A-Z0-9]+$/, 'Project key must contain only uppercase letters and numbers'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
  type: z.enum(['Software', 'Marketing', 'Design', 'Business'], {
    required_error: 'Please select a project type'
  }),
  template: z.enum(['kanban', 'scrum', 'basic'], {
    required_error: 'Please select a template'
  })
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

interface CreateProjectDialogProps {
  onProjectCreate?: (project: any) => void;
}

const CreateProjectDialog = ({ onProjectCreate }: CreateProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      key: '',
      description: '',
      type: 'Software',
      template: 'kanban'
    }
  });

  const onSubmit = (data: CreateProjectFormData) => {
    const newProject = {
      ...data,
      id: Date.now(),
      lead: 'Current User',
      avatar: '/placeholder.svg',
      issueCount: 0,
      completedIssues: 0,
      lastUpdate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    
    if (onProjectCreate) {
      onProjectCreate(newProject);
    }
    
    setOpen(false);
    form.reset();
  };

  // Auto-generate project key from name
  const handleNameChange = (value: string) => {
    const key = value
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .split(' ')
      .map(word => word.slice(0, 3))
      .join('')
      .slice(0, 10);
    form.setValue('key', key);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter project name" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Key *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., PROJ" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500">
                    A short identifier for your project (2-10 characters, uppercase letters and numbers only)
                  </p>
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
                    <Textarea placeholder="Describe your project..." rows={3} {...field} />
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
                    <FormLabel>Project Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kanban">Kanban</SelectItem>
                        <SelectItem value="scrum">Scrum</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
