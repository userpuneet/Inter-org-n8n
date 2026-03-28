
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Download, 
  Star, 
  Users, 
  Shield, 
  ExternalLink,
  Settings,
  Trash2
} from 'lucide-react';

interface App {
  id: string;
  name: string;
  description: string;
  developer: string;
  category: string;
  rating: number;
  downloads: number;
  price: 'free' | 'paid';
  installed: boolean;
  featured: boolean;
}

interface MarketplaceAppsProps {
  searchQuery: string;
}

const MarketplaceApps = ({ searchQuery }: MarketplaceAppsProps) => {
  const [apps] = useState<App[]>([
    {
      id: '1',
      name: 'Slack Integration',
      description: 'Send ticket notifications directly to Slack channels',
      developer: 'Slack Technologies',
      category: 'Communication',
      rating: 4.8,
      downloads: 15420,
      price: 'free',
      installed: true,
      featured: true
    },
    {
      id: '2',
      name: 'Time Tracking Pro',
      description: 'Advanced time tracking with detailed reporting and billing',
      developer: 'TimeTrack Inc',
      category: 'Productivity',
      rating: 4.6,
      downloads: 8930,
      price: 'paid',
      installed: false,
      featured: true
    },
    {
      id: '3',
      name: 'Custom Fields Manager',
      description: 'Create and manage custom fields for tickets with validation',
      developer: 'FieldMaster',
      category: 'Customization',
      rating: 4.4,
      downloads: 5670,
      price: 'free',
      installed: true,
      featured: false
    },
    {
      id: '4',
      name: 'Advanced Analytics',
      description: 'Comprehensive analytics and reporting dashboard',
      developer: 'DataViz Solutions',
      category: 'Analytics',
      rating: 4.7,
      downloads: 12340,
      price: 'paid',
      installed: false,
      featured: true
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Communication', 'Productivity', 'Customization', 'Analytics'];

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Apps</TabsTrigger>
          <TabsTrigger value="installed">Installed Apps</TabsTrigger>
          <TabsTrigger value="develop">Develop Apps</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <Card key={app.id} className="relative">
                {app.featured && (
                  <Badge className="absolute top-2 right-2 bg-orange-500">
                    Featured
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        by {app.developer}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      {renderStars(app.rating)}
                      <span className="text-sm text-gray-600">{app.rating}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {app.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{app.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {app.downloads.toLocaleString()}
                      </div>
                      <Badge variant={app.price === 'free' ? 'default' : 'secondary'}>
                        {app.price === 'free' ? 'Free' : 'Paid'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {app.installed ? (
                      <Button variant="outline" className="flex-1" disabled>
                        <Shield className="h-4 w-4 mr-2" />
                        Installed
                      </Button>
                    ) : (
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Install
                      </Button>
                    )}
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="installed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.filter(app => app.installed).map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <CardDescription>by {app.developer}</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{app.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="develop" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Develop Your Own Apps
              </CardTitle>
              <CardDescription>
                Create custom integrations and extensions for your workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Getting Started</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Use our SDK and APIs to build custom apps that integrate seamlessly with your workflow.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Developer Docs
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download SDK
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">App Templates</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Start with pre-built templates for common integration patterns.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start">
                      Webhook Integration
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Custom Field Plugin
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Notification Service
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Report Generator
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceApps;
