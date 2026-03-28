
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import { useParams } from 'react-router-dom';
import CreateIssueDialog from '@/components/project/CreateIssueDialog';
import { useProjectBoard } from '@/hooks/useProjectBoard';
import BoardColumn from '@/components/project/BoardColumn';
import ProjectTimeline from '@/components/project/ProjectTimeline';
const KanbanBoardPage = () => {
  const { projectKey } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, project, columns, issues, transitionsFrom, moveIssue, createIssue, reload } = useProjectBoard(projectKey);

  useEffect(() => {
    if (projectKey) {
      document.title = `${projectKey} Board | Project Management`;
    }
  }, [projectKey]);

  const filteredIssuesByColumn = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return columns.map((c) => ({
      column: c,
      issues: issues.filter((i) =>
        (i.status_id === c.statusId) &&
        (!q || i.title.toLowerCase().includes(q) || (i.external_key || '').toLowerCase().includes(q))
      ),
    }));
  }, [columns, issues, searchTerm]);

  const handleIssueCreate = async (formIssue: any) => {
    await createIssue({
      title: formIssue.title,
      description: formIssue.description,
      priority: (formIssue.priority || 'Medium'),
      assignee: formIssue.assignee || null,
      story_points: typeof formIssue.storyPoints === 'number' ? formIssue.storyPoints : null,
      labels: formIssue.labels || [],
      status_name: formIssue.status || null,
    });
  };
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{projectKey} Board</h1>
            <p className="text-muted-foreground">Kanban board for project management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reload} aria-label="Refresh board">
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <CreateIssueDialog 
              projectKey={projectKey} 
              onIssueCreate={handleIssueCreate}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search issues"
            />
          </div>
        </div>

        {error && (
          <div className="text-destructive">{error}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[600px]">
          {filteredIssuesByColumn.map(({ column, issues }) => (
            <BoardColumn
              key={column.statusId}
              id={column.statusId}
              title={column.title}
              count={issues.length}
              issues={issues}
              transitionsFrom={transitionsFrom}
              onMove={(issueId, to) => moveIssue(issueId, to)}
              triggerCreate={
                <CreateIssueDialog
                  projectKey={project?.key}
                  onIssueCreate={handleIssueCreate}
                  trigger={
                    <Button variant="ghost" className="w-full border-2 border-dashed h-12">
                      <Plus className="h-4 w-4 mr-2" /> Add Issue
                    </Button>
                  }
                />
              }
            />
          ))}
        </div>

        {project?.id && (
          <ProjectTimeline projectId={project.id} />
        )}
      </div>
     </Layout>
   );
 };
 
 export default KanbanBoardPage;
 