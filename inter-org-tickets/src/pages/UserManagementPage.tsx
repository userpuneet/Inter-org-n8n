
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Shield, 
  UserPlus, 
  Search,
  Settings,
  AlertTriangle
} from 'lucide-react';
import UsersList from '@/components/user-management/UsersList';
import UserGroupsManager from '@/components/user-management/UserGroupsManager';
import PermissionsMatrix from '@/components/user-management/PermissionsMatrix';
import EscalationMatrix from '@/components/user-management/EscalationMatrix';

const UserManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage users, permissions, groups, and escalation policies</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-9 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Groups
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Permissions Matrix
            </TabsTrigger>
            <TabsTrigger value="escalation" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Escalation Matrix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersList searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="groups">
            <UserGroupsManager />
          </TabsContent>

          <TabsContent value="permissions">
            <PermissionsMatrix />
          </TabsContent>

          <TabsContent value="escalation">
            <EscalationMatrix />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserManagementPage;
