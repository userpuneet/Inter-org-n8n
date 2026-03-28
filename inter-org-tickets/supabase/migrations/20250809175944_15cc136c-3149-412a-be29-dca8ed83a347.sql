-- Enable required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Utility: auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_select_all" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_insert_all" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "projects_update_all" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "projects_delete_all" ON public.projects FOR DELETE USING (true);
CREATE TRIGGER projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Statuses (global)
CREATE TABLE IF NOT EXISTS public.statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('todo','inprogress','review','done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "statuses_select_all" ON public.statuses FOR SELECT USING (true);
CREATE POLICY "statuses_insert_all" ON public.statuses FOR INSERT WITH CHECK (true);
CREATE POLICY "statuses_update_all" ON public.statuses FOR UPDATE USING (true);
CREATE POLICY "statuses_delete_all" ON public.statuses FOR DELETE USING (true);
CREATE TRIGGER statuses_updated_at
BEFORE UPDATE ON public.statuses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Project Status ordering/mapping
CREATE TABLE IF NOT EXISTS public.project_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  status_id UUID NOT NULL REFERENCES public.statuses(id) ON DELETE CASCADE,
  column_order INT NOT NULL DEFAULT 0,
  UNIQUE (project_id, status_id)
);
ALTER TABLE public.project_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "project_statuses_select_all" ON public.project_statuses FOR SELECT USING (true);
CREATE POLICY "project_statuses_insert_all" ON public.project_statuses FOR INSERT WITH CHECK (true);
CREATE POLICY "project_statuses_update_all" ON public.project_statuses FOR UPDATE USING (true);
CREATE POLICY "project_statuses_delete_all" ON public.project_statuses FOR DELETE USING (true);

-- Issue Types (global)
CREATE TABLE IF NOT EXISTS public.issue_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.issue_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "issue_types_select_all" ON public.issue_types FOR SELECT USING (true);
CREATE POLICY "issue_types_insert_all" ON public.issue_types FOR INSERT WITH CHECK (true);
CREATE POLICY "issue_types_update_all" ON public.issue_types FOR UPDATE USING (true);
CREATE POLICY "issue_types_delete_all" ON public.issue_types FOR DELETE USING (true);
CREATE TRIGGER issue_types_updated_at
BEFORE UPDATE ON public.issue_types
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sprints
CREATE TABLE IF NOT EXISTS public.sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal TEXT,
  start_date DATE,
  end_date DATE,
  state TEXT NOT NULL DEFAULT 'planned' CHECK (state IN ('planned','active','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sprints_select_all" ON public.sprints FOR SELECT USING (true);
CREATE POLICY "sprints_insert_all" ON public.sprints FOR INSERT WITH CHECK (true);
CREATE POLICY "sprints_update_all" ON public.sprints FOR UPDATE USING (true);
CREATE POLICY "sprints_delete_all" ON public.sprints FOR DELETE USING (true);
CREATE TRIGGER sprints_updated_at
BEFORE UPDATE ON public.sprints
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_sprints_project ON public.sprints(project_id);

-- Issues
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  external_key TEXT, -- e.g., "MOBILE-123" stored/managed at app level
  title TEXT NOT NULL,
  description TEXT,
  type_id UUID REFERENCES public.issue_types(id) ON DELETE SET NULL,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Critical')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  status_id UUID REFERENCES public.statuses(id) ON DELETE SET NULL,
  assignee TEXT,
  reporter TEXT,
  story_points INT,
  labels TEXT[] DEFAULT '{}',
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  epic_id UUID REFERENCES public.issues(id) ON DELETE SET NULL,
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "issues_select_all" ON public.issues FOR SELECT USING (true);
CREATE POLICY "issues_insert_all" ON public.issues FOR INSERT WITH CHECK (true);
CREATE POLICY "issues_update_all" ON public.issues FOR UPDATE USING (true);
CREATE POLICY "issues_delete_all" ON public.issues FOR DELETE USING (true);
CREATE TRIGGER issues_updated_at
BEFORE UPDATE ON public.issues
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_issues_project ON public.issues(project_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status_id);
CREATE INDEX IF NOT EXISTS idx_issues_sprint ON public.issues(sprint_id);
CREATE INDEX IF NOT EXISTS idx_issues_epic ON public.issues(epic_id);
CREATE INDEX IF NOT EXISTS idx_issues_labels ON public.issues USING GIN(labels);

-- Workflow transitions per project
CREATE TABLE IF NOT EXISTS public.workflow_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  from_status_id UUID NOT NULL REFERENCES public.statuses(id) ON DELETE CASCADE,
  to_status_id UUID NOT NULL REFERENCES public.statuses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.workflow_transitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "workflow_transitions_select_all" ON public.workflow_transitions FOR SELECT USING (true);
CREATE POLICY "workflow_transitions_insert_all" ON public.workflow_transitions FOR INSERT WITH CHECK (true);
CREATE POLICY "workflow_transitions_update_all" ON public.workflow_transitions FOR UPDATE USING (true);
CREATE POLICY "workflow_transitions_delete_all" ON public.workflow_transitions FOR DELETE USING (true);
CREATE INDEX IF NOT EXISTS idx_wt_project ON public.workflow_transitions(project_id);

-- Thread to Issue linking (generic)
CREATE TABLE IF NOT EXISTS public.issue_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  thread_source TEXT NOT NULL DEFAULT 'internal', -- e.g., internal, email, slack, forum
  thread_external_id TEXT, -- external system id if any
  thread_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.issue_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "issue_threads_select_all" ON public.issue_threads FOR SELECT USING (true);
CREATE POLICY "issue_threads_insert_all" ON public.issue_threads FOR INSERT WITH CHECK (true);
CREATE POLICY "issue_threads_update_all" ON public.issue_threads FOR UPDATE USING (true);
CREATE POLICY "issue_threads_delete_all" ON public.issue_threads FOR DELETE USING (true);
CREATE INDEX IF NOT EXISTS idx_issue_threads_issue ON public.issue_threads(issue_id);

-- Unified timeline events for projects and issues
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('project','issue')),
  entity_id UUID NOT NULL, -- references projects.id or issues.id depending on entity_type
  event_type TEXT NOT NULL CHECK (event_type IN ('created','updated','status_changed','assigned','comment_added','eta_set','sprint_changed')),
  user_id UUID,
  user_name TEXT,
  details TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "timeline_events_select_all" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "timeline_events_insert_all" ON public.timeline_events FOR INSERT WITH CHECK (true);
CREATE POLICY "timeline_events_update_all" ON public.timeline_events FOR UPDATE USING (true);
CREATE POLICY "timeline_events_delete_all" ON public.timeline_events FOR DELETE USING (true);
CREATE INDEX IF NOT EXISTS idx_timeline_entity ON public.timeline_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_timeline_type ON public.timeline_events(event_type);

-- Seed default statuses
INSERT INTO public.statuses (id, name, category)
VALUES
  (gen_random_uuid(), 'To Do', 'todo'),
  (gen_random_uuid(), 'In Progress', 'inprogress'),
  (gen_random_uuid(), 'In Review', 'review'),
  (gen_random_uuid(), 'Done', 'done')
ON CONFLICT (name) DO NOTHING;

-- Seed default issue types
INSERT INTO public.issue_types (id, name)
VALUES
  (gen_random_uuid(), 'Story'),
  (gen_random_uuid(), 'Task'),
  (gen_random_uuid(), 'Bug'),
  (gen_random_uuid(), 'Epic')
ON CONFLICT (name) DO NOTHING;