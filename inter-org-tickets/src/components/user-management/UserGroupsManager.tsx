
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Plus,
  Settings,
  Trash2,
  UserPlus,
  Search
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  color: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  permissions: string[];
}

const UserGroupsManager = () => {
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [userGroups] = useState<UserGroup[]>([
    {
      id: '1',
      name: 'Development Team',
      description: 'Core development team members with full development access',
      memberCount: 8,
      color: 'bg-blue-100 text-blue-800',
      members: [
        { id: '1', name: 'John Doe', email: 'john@company.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@company.com' },
        { id: '3', name: 'Mike Johnson', email: 'mike@company.com' }
      ],
      permissions: ['create_issues', 'edit_issues', 'delete_issues', 'manage_components']
    },
    {
      id: '2',
      name: 'QA Team',
      description: 'Quality assurance and testing team',
      memberCount: 4,
      color: 'bg-green-100 text-green-800',
      members: [
        { id: '4', name: 'Sarah Wilson', email: 'sarah@company.com' },
        { id: '5', name: 'Alex Brown', email: 'alex@company.com' }
      ],
      permissions: ['create_issues', 'transition_issues', 'add_comments']
    },
    {
      id: '3',
      name: 'Project Managers',
      description: 'Project management and oversight team',
      memberCount: 3,
      color: 'bg-purple-100 text-purple-800',
      members: [
        { id: '6', name: 'Emma Davis', email: 'emma@company.com' }
      ],
      permissions: ['manage_project', 'manage_users', 'view_reports', 'create_reports']
    },
    {
      id: '4',
      name: 'Stakeholders',
      description: 'Business stakeholders and observers',
      memberCount: 6,
      color: 'bg-orange-100 text-orange-800',
      members: [
        { id: '7', name: 'Robert Taylor', email: 'robert@company.com' }
      ],
      permissions: ['view_reports', 'add_comments']
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Groups</h3>
          <p className="text-sm text-gray-600">Organize users into groups for easier permission management</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Group Name</label>
                <Input placeholder="Enter group name" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Describe the group purpose" className="mt-1" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Create Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {userGroups.map((group) => (
            <Card 
              key={group.id} 
              className={`cursor-pointer transition-all ${
                selectedGroup?.id === group.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedGroup(group)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{group.name}</CardTitle>
                      <Badge className={group.color} variant="secondary">
                        {group.memberCount} members
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Permissions:</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {group.permissions.length} assigned
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          {selectedGroup ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {selectedGroup.name}
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Group Members</h4>
                  <div className="space-y-2">
                    {selectedGroup.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Group Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGroup.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">Save Changes</Button>
                  <Button variant="outline" className="flex-1">Edit Permissions</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a group to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGroupsManager;
