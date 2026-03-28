
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
  globalRole: GlobalRole;
}

export interface GlobalRole {
  id: string;
  name: 'admin' | 'user' | 'viewer';
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface ProjectRole {
  id: string;
  name: 'project_admin' | 'developer' | 'tester' | 'reporter' | 'viewer';
  projectId: string;
  userId: string;
  permissions: Permission[];
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  members: User[];
  permissions: Permission[];
  createdBy: string;
  createdAt: string;
}

export interface Mention {
  id: string;
  userId: string;
  mentionedBy: string;
  context: string;
  contextId: string;
  type: 'comment' | 'ticket' | 'announcement';
  isRead: boolean;
  createdAt: string;
}
