
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Crown, 
  Shield, 
  Eye, 
  Code, 
  Bug, 
  FileText,
  Settings,
  Plus
} from 'lucide-react';

interface ProjectRole {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  permissions: string[];
  userCount: number;
}

const projectRoles: ProjectRole[] = [
  {
    id: 'project_admin',
    name: 'Project Administrator',
    description: 'Full project management access',
    icon: <Crown className="h-5 w-5" />,
    permissions: ['manage_project', 'manage_users', 'manage_settings', 'create_tickets', 'edit_tickets', 'delete_tickets'],
    userCount: 2
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Development and code-related tasks',
    icon: <Code className="h-5 w-5" />,
    permissions: ['create_tickets', 'edit_tickets', 'comment_tickets', 'transition_tickets'],
    userCount: 8
  },
  {
    id: 'tester',
    name: 'Tester',
    description: 'Quality assurance and testing',
    icon: <Bug className="h-5 w-5" />,
    permissions: ['create_tickets', 'comment_tickets', 'transition_tickets'],
    userCount: 4
  },
  {
    id: 'reporter',
    name: 'Reporter',
    description: 'Can report issues and track progress',
    icon: <FileText className="h-5 w-5" />,
    permissions: ['create_tickets', 'comment_tickets'],
    userCount: 12
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to project',
    icon: <Eye className="h-5 w-5" />,
    permissions: ['view_tickets'],
    userCount: 5
  }
];

const availablePermissions = [
  { id: 'manage_project', name: 'Manage Project', category: 'Administration' },
  { id: 'manage_users', name: 'Manage Users', category: 'Administration' },
  { id: 'manage_settings', name: 'Manage Settings', category: 'Administration' },
  { id: 'create_tickets', name: 'Create Tickets', category: 'Tickets' },
  { id: 'edit_tickets', name: 'Edit Tickets', category: 'Tickets' },
  { id: 'delete_tickets', name: 'Delete Tickets', category: 'Tickets' },
  { id: 'comment_tickets', name: 'Comment on Tickets', category: 'Tickets' },
  { id: 'transition_tickets', name: 'Transition Tickets', category: 'Tickets' },
  { id: 'view_tickets', name: 'View Tickets', category: 'Tickets' },
];

const RoleManagement = () => {
  const [selectedRole, setSelectedRole] = useState<ProjectRole | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Project Roles
              </CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Role
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectRoles.map((role) => (
              <div
                key={role.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedRole?.id === role.id ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-primary-600">
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{role.name}</div>
                    <div className="text-sm text-gray-500">{role.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {role.userCount} users
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {role.permissions.length} permissions
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {selectedRole ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedRole.icon}
                {selectedRole.name} Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['Administration', 'Tickets'].map((category) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm text-gray-700 mb-3">{category}</h4>
                    <div className="space-y-2">
                      {availablePermissions
                        .filter(perm => perm.category === category)
                        .map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={selectedRole.permissions.includes(permission.id)}
                              className="data-[state=checked]:bg-primary"
                            />
                            <label 
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.name}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 pt-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Reset</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a role to view and edit permissions</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
