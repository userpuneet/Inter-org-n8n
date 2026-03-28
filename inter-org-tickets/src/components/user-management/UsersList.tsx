import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useN8NUsers } from "@/hooks/useN8NUsers";
import { RefreshCw, UserPlus, Search } from "lucide-react";

const UsersList = () => {
  const { users, loading, inviteUser, reload } = useN8NUsers();
  const [search, setSearch] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    await inviteUser(inviteEmail.trim(), "member");
    setInviteEmail("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Organization Members</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Sourced from n8n · {users.length} members
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Sync
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Invite bar */}
        <div className="flex gap-2">
          <Input
            placeholder="email@company.com"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleInvite()}
          />
          <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
            <UserPlus className="h-4 w-4 mr-2" /> Invite
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search members…"
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    {user.specialty && <p className="text-xs text-blue-500">{user.specialty}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.status === "active" ? "default" : "outline"} className="text-xs">
                    {user.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">{user.role}</Badge>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                {search ? `No members matching "${search}"` : "No members yet"}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;
