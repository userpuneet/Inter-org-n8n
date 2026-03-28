
import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, AtSign } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  avatar?: string;
}

interface MentionSystemProps {
  query: string;
  onSelectUser: (user: User) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

const availableUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techsupport.com',
    organization: 'TechSupport Inc'
  },
  {
    id: 'user-2',
    name: 'Michael Chen',
    email: 'michael.chen@acmecorp.com',
    organization: 'Acme Corp'
  },
  {
    id: 'user-3',
    name: 'John Smith',
    email: 'john.smith@techsupport.com',
    organization: 'TechSupport Inc'
  },
  {
    id: 'user-4',
    name: 'Lisa Wong',
    email: 'lisa.wong@techsupport.com',
    organization: 'TechSupport Inc'
  },
  {
    id: 'user-5',
    name: 'David Johnson',
    email: 'david.johnson@globalsoft.com',
    organization: 'GlobalSoft'
  }
];

const MentionSystem: FC<MentionSystemProps> = ({
  query,
  onSelectUser,
  onClose,
  position
}) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const filtered = availableUsers.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredUsers.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredUsers.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredUsers.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredUsers[selectedIndex]) {
            onSelectUser(filteredUsers[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredUsers, selectedIndex, onSelectUser, onClose]);

  if (filteredUsers.length === 0) {
    return null;
  }

  return (
    <div 
      className="absolute bg-white border rounded-md shadow-lg w-72 max-h-48 overflow-y-auto z-30"
      style={{ 
        left: position.x, 
        top: position.y - 200 // Position above the cursor
      }}
    >
      <div className="p-2 border-b bg-gray-50">
        <div className="flex items-center text-sm font-medium text-gray-700">
          <AtSign className="h-3 w-3 mr-1" />
          Mention users
        </div>
      </div>
      {filteredUsers.map((user, index) => (
        <div
          key={user.id}
          className={`p-3 cursor-pointer flex items-center gap-3 hover:bg-gray-50 ${
            index === selectedIndex ? 'bg-blue-50 border-l-2 border-blue-500' : ''
          }`}
          onClick={() => onSelectUser(user)}
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
          <Badge variant="outline" className="text-xs">
            {user.organization}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default MentionSystem;
