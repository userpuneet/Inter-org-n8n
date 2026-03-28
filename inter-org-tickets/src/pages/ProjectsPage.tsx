
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  MoreVertical, 
  Users, 
  BarChart3,
  Settings
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import CreateProjectDialog from '@/components/project/CreateProjectDialog';
import ProjectSettingsDialog from '@/components/project/ProjectSettingsDialog';

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([
    {
      id: 1,
      key: 'MOBILE',
      name: 'Mobile App Development',
      description: 'Development of the new mobile application for iOS and Android platforms',
      lead: 'John Doe',
      avatar: '/placeholder.svg',
      issueCount: 45,
      completedIssues: 32,
      lastUpdate: '2024-01-15',
      status: 'Active',
      type: 'Software'
    },
    {
      id: 2,
      key: 'WEB',
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design and functionality',
      lead: 'Jane Smith',
      avatar: '/placeholder.svg',
      issueCount: 28,
      completedIssues: 20,
      lastUpdate: '2024-01-14',
      status: 'Active',
      type: 'Design'
    },
    {
      id: 3,
      key: 'API',
      name: 'REST API Enhancement',
      description: 'Improving and extending the REST API with new endpoints and better security',
      lead: 'Mike Johnson',
      avatar: '/placeholder.svg',
      issueCount: 67,
      completedIssues: 45,
      lastUpdate: '2024-01-13',
      status: 'Active',
      type: 'Software'
    }
  ]);

  const handleProjectCreate = (newProject: any) => {
    setProjects([...projects, newProject]);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-gray-600">Manage your projects and track progress</p>
          </div>
          <CreateProjectDialog onProjectCreate={handleProjectCreate} />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-primary">{project.key}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">{project.type}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <ProjectSettingsDialog 
                          project={project}
                          trigger={
                            <div className="flex items-center cursor-pointer">
                              <Settings className="h-4 w-4 mr-2" />
                              Project Settings
                            </div>
                          }
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Reports
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
                
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={project.avatar} />
                    <AvatarFallback>{project.lead.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">Led by {project.lead}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round((project.completedIssues / project.issueCount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(project.completedIssues / project.issueCount) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{project.issueCount} issues</span>
                    <span>Updated {project.lastUpdate}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/projects/${project.key}/board`}>
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Board
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/projects/${project.key}/issues`}>
                      <Users className="h-4 w-4 mr-1" />
                      Issues
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
