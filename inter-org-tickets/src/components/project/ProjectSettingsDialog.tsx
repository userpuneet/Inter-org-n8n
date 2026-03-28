
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { Settings, Users, Tags, Workflow } from 'lucide-react';

interface ProjectSettingsDialogProps {
  project?: any;
  trigger?: React.ReactNode;
}

const ProjectSettingsDialog = ({ project, trigger }: ProjectSettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: project?.name || '',
      key: project?.key || '',
      description: project?.description || '',
      type: project?.type || 'Software',
      lead: project?.lead || ''
    }
  });

  const onSubmit = (_data: any) => {
    setOpen(false);
  };

  const teamMembers = [
    { name: 'John Doe', role: 'Project Lead', avatar: '/placeholder.svg' },
    { name: 'Jane Smith', role: 'Developer', avatar: '/placeholder.svg' },
    { name: 'Mike Johnson', role: 'Designer', avatar: '/placeholder.svg' },
    { name: 'Sarah Wilson', role: 'QA Engineer', avatar: '/placeholder.svg' }
  ];

  const workflowStates = [
    { name: 'To Do', color: 'bg-gray-100' },
    { name: 'In Progress', color: 'bg-blue-100' },
    { name: 'In Review', color: 'bg-yellow-100' },
    { name: 'Done', color: 'bg-green-100' }
  ];

  const defaultTrigger = (
    <Button variant="outline" size="icon">
      <Settings className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="labels">Labels</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Project Key</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
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
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Team Members</h3>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Remove</Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="workflow" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Workflow States</h3>
              <Button variant="outline" size="sm">
                <Workflow className="h-4 w-4 mr-2" />
                Add State
              </Button>
            </div>
            <div className="space-y-3">
              {workflowStates.map((state, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${state.color}`} />
                    <span className="font-medium">{state.name}</span>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="labels" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Project Labels</h3>
              <Button variant="outline" size="sm">
                <Tags className="h-4 w-4 mr-2" />
                Add Label
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['frontend', 'backend', 'ui', 'security', 'bugfix', 'feature', 'performance', 'mobile', 'devops'].map((label) => (
                <Badge key={label} variant="outline" className="cursor-pointer">
                  {label}
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSettingsDialog;
