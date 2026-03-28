-- Migration: Restrict open SELECT policies to authenticated users only
-- Prior migrations left USING (true) on SELECT for all tables.
-- This migration replaces those with auth.role() = 'authenticated' guards.

DO $$ DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'projects',
    'issues',
    'sprints',
    'issue_threads',
    'timeline_events',
    'statuses',
    'issue_types',
    'project_statuses',
    'workflow_transitions'
  ]) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_select_all" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "%s_select_auth" ON public.%I FOR SELECT USING (auth.role() = ''authenticated'')',
      t, t
    );
  END LOOP;
END $$;
