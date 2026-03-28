
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Code2, 
  Store, 
  Mail, 
  GitBranch,
  Search,
  Plus,
  Settings,
  Key,
  Webhook,
  Download,
  ExternalLink
} from 'lucide-react';
import APIManagement from '@/components/integrations/APIManagement';
import MarketplaceApps from '@/components/integrations/MarketplaceApps';
import EmailIntegration from '@/components/integrations/EmailIntegration';
import GitIntegration from '@/components/integrations/GitIntegration';

const IntegrationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integrations & Extensibility</h1>
            <p className="text-gray-600 mt-2">Connect with third-party services and extend functionality</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search integrations..."
                className="pl-9 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </div>

        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              REST API
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Integration
            </TabsTrigger>
            <TabsTrigger value="git" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Git Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api">
            <APIManagement />
          </TabsContent>

          <TabsContent value="marketplace">
            <MarketplaceApps searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="email">
            <EmailIntegration />
          </TabsContent>

          <TabsContent value="git">
            <GitIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default IntegrationsPage;
