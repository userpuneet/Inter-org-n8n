-- Migration: Restrict open RLS policies
-- These policies currently allow any anonymous user to read/write all data.
-- Once Supabase Auth is configured, replace USING (true) with proper user scoping.
--
-- Example for a user-owned table:
--   USING (auth.uid() = owner_id)
--
-- Example for org-scoped data (requires an org_members table):
--   USING (
--     EXISTS (
--       SELECT 1 FROM org_members
--       WHERE org_members.org_id = issues.org_id
--         AND org_members.user_id = auth.uid()
--     )
--   )
--
-- For now we restrict write operations to authenticated users only,
-- preserving read access for initial development while preventing
-- anonymous mutations.

-- Projects: restrict writes to authenticated users
DROP POLICY IF EXISTS "projects_insert_all" ON public.projects;
DROP POLICY IF EXISTS "projects_update_all" ON public.projects;
DROP POLICY IF EXISTS "projects_delete_all" ON public.projects;

CREATE POLICY "projects_insert_auth" ON public.projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "projects_update_auth" ON public.projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "projects_delete_auth" ON public.projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Issues: restrict writes to authenticated users
DROP POLICY IF EXISTS "issues_insert_all" ON public.issues;
DROP POLICY IF EXISTS "issues_update_all" ON public.issues;
DROP POLICY IF EXISTS "issues_delete_all" ON public.issues;

CREATE POLICY "issues_insert_auth" ON public.issues
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "issues_update_auth" ON public.issues
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "issues_delete_auth" ON public.issues
  FOR DELETE USING (auth.role() = 'authenticated');

-- Sprints: restrict writes to authenticated users
DROP POLICY IF EXISTS "sprints_insert_all" ON public.sprints;
DROP POLICY IF EXISTS "sprints_update_all" ON public.sprints;
DROP POLICY IF EXISTS "sprints_delete_all" ON public.sprints;

CREATE POLICY "sprints_insert_auth" ON public.sprints
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "sprints_update_auth" ON public.sprints
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "sprints_delete_auth" ON public.sprints
  FOR DELETE USING (auth.role() = 'authenticated');

-- Timeline events: restrict writes to authenticated users
DROP POLICY IF EXISTS "timeline_events_insert_all" ON public.timeline_events;
DROP POLICY IF EXISTS "timeline_events_update_all" ON public.timeline_events;
DROP POLICY IF EXISTS "timeline_events_delete_all" ON public.timeline_events;

CREATE POLICY "timeline_events_insert_auth" ON public.timeline_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "timeline_events_update_auth" ON public.timeline_events
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "timeline_events_delete_auth" ON public.timeline_events
  FOR DELETE USING (auth.role() = 'authenticated');

-- Issue threads: restrict writes to authenticated users
DROP POLICY IF EXISTS "issue_threads_insert_all" ON public.issue_threads;
DROP POLICY IF EXISTS "issue_threads_update_all" ON public.issue_threads;
DROP POLICY IF EXISTS "issue_threads_delete_all" ON public.issue_threads;

CREATE POLICY "issue_threads_insert_auth" ON public.issue_threads
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "issue_threads_update_auth" ON public.issue_threads
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "issue_threads_delete_auth" ON public.issue_threads
  FOR DELETE USING (auth.role() = 'authenticated');
