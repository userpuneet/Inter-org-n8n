
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Crown, Code, Bug, Eye, FileText } from 'lucide-react';

const roles = [
  { id: 'project_admin', name: 'Project Admin', icon: <Crown className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
  { id: 'developer', name: 'Developer', icon: <Code className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
  { id: 'tester', name: 'Tester', icon: <Bug className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
  { id: 'reporter', name: 'Reporter', icon: <FileText className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
  { id: 'viewer', name: 'Viewer', icon: <Eye className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' },
];

const permissions = [
  { category: 'Project Management', items: [
    { id: 'manage_project', name: 'Manage Project Settings' },
    { id: 'manage_users', name: 'Manage Project Users' },
    { id: 'manage_components', name: 'Manage Components' },
    { id: 'manage_versions', name: 'Manage Versions' },
  ]},
  { category: 'Issue Management', items: [
    { id: 'create_issues', name: 'Create Issues' },
    { id: 'edit_issues', name: 'Edit Issues' },
    { id: 'delete_issues', name: 'Delete Issues' },
    { id: 'assign_issues', name: 'Assign Issues' },
    { id: 'transition_issues', name: 'Transition Issues' },
  ]},
  { category: 'Comments & Communication', items: [
    { id: 'add_comments', name: 'Add Comments' },
    { id: 'edit_comments', name: 'Edit Comments' },
    { id: 'delete_comments', name: 'Delete Comments' },
    { id: 'mention_users', name: 'Mention Users' },
  ]},
  { category: 'Reporting & Analytics', items: [
    { id: 'view_reports', name: 'View Reports' },
    { id: 'create_reports', name: 'Create Custom Reports' },
    { id: 'export_data', name: 'Export Data' },
    { id: 'view_analytics', name: 'View Analytics' },
  ]},
];

const permissionMatrix = {
  project_admin: ['manage_project', 'manage_users', 'manage_components', 'manage_versions', 'create_issues', 'edit_issues', 'delete_issues', 'assign_issues', 'transition_issues', 'add_comments', 'edit_comments', 'delete_comments', 'mention_users', 'view_reports', 'create_reports', 'export_data', 'view_analytics'],
  developer: ['create_issues', 'edit_issues', 'assign_issues', 'transition_issues', 'add_comments', 'edit_comments', 'mention_users', 'view_reports', 'view_analytics'],
  tester: ['create_issues', 'transition_issues', 'add_comments', 'mention_users', 'view_reports'],
  reporter: ['create_issues', 'add_comments', 'mention_users'],
  viewer: ['view_reports', 'view_analytics'],
};

const PermissionsMatrix = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions Matrix
          </CardTitle>
          <p className="text-sm text-gray-600">
            Overview of permissions across all project roles
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header with roles */}
              <div className="grid grid-cols-6 gap-2 mb-4">
                <div className="font-medium text-sm text-gray-700">Permission</div>
                {roles.map((role) => (
                  <div key={role.id} className="text-center">
                    <Badge className={`${role.color} flex items-center gap-1 justify-center`}>
                      {role.icon}
                      <span className="hidden sm:inline">{role.name}</span>
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Permission categories and items */}
              {permissions.map((category) => (
                <div key={category.category} className="mb-6">
                  <h4 className="font-medium text-sm text-gray-900 mb-3 px-2 py-1 bg-gray-50 rounded">
                    {category.category}
                  </h4>
                  {category.items.map((permission) => (
                    <div key={permission.id} className="grid grid-cols-6 gap-2 items-center py-2 border-b border-gray-100 hover:bg-gray-50">
                      <div className="text-sm text-gray-700 font-medium">
                        {permission.name}
                      </div>
                      {roles.map((role) => (
                        <div key={`${permission.id}-${role.id}`} className="flex justify-center">
                          <Checkbox
                            checked={permissionMatrix[role.id as keyof typeof permissionMatrix]?.includes(permission.id)}
                            className="data-[state=checked]:bg-primary"
                            disabled
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`${role.color} flex items-center gap-1`}>
                    {role.icon}
                    {role.name}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1">
                    {permissionMatrix[role.id as keyof typeof permissionMatrix]?.length || 0} permissions
                  </div>
                  <div className="space-y-1">
                    {permissions.map((category) => {
                      const categoryPermissions = category.items.filter(item => 
                        permissionMatrix[role.id as keyof typeof permissionMatrix]?.includes(item.id)
                      );
                      if (categoryPermissions.length === 0) return null;
                      
                      return (
                        <div key={category.category}>
                          <span className="font-medium text-xs text-gray-500">{category.category}:</span>
                          <span className="text-xs ml-2">{categoryPermissions.length}/{category.items.length}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsMatrix;
