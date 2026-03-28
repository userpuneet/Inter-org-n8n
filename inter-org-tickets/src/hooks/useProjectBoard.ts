import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Project = { id: string; key: string; name: string; description?: string | null };
export type Status = { id: string; name: string; category: "todo" | "inprogress" | "review" | "done" };
export type Column = { statusId: string; title: string; category: Status["category"]; order: number };
export type Issue = {
  id: string;
  project_id: string;
  external_key: string | null;
  title: string;
  description: string | null;
  type_id: string | null;
  priority: "Low" | "Medium" | "High" | "Critical";
  severity: "low" | "medium" | "high" | "critical";
  status_id: string | null;
  assignee: string | null;
  reporter: string | null;
  story_points: number | null;
  labels: string[] | null;
  sprint_id: string | null;
  epic_id: string | null;
  due_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Transition = {
  id: string;
  project_id: string;
  from_status_id: string;
  to_status_id: string;
  name: string;
  conditions: Record<string, any>;
};

export function useProjectBoard(projectKey?: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [statusesMap, setStatusesMap] = useState<Record<string, Status>>({});
  const [issues, setIssues] = useState<Issue[]>([]);
  const [transitions, setTransitions] = useState<Transition[]>([]);

  const reload = useCallback(async () => {
    if (!projectKey) return;
    setLoading(true);
    setError(null);
    try {
      // 1) Project by key
      const { data: proj, error: perr } = await supabase
        .from("projects")
        .select("id, key, name, description")
        .eq("key", projectKey)
        .maybeSingle();
      if (perr) throw perr;
      if (!proj) {
        setProject(null);
        setIssues([]);
        setColumns([]);
        setTransitions([]);
        setLoading(false);
        return;
      }
      setProject(proj);

      // 2) Fetch project-specific columns (statuses with order); fallback to global default order
      const [psRes, stRes] = await Promise.all([
        supabase
          .from("project_statuses")
          .select("column_order, statuses:status_id(id, name, category)")
          .eq("project_id", proj.id)
          .order("column_order", { ascending: true }),
        supabase
          .from("statuses")
          .select("id, name, category")
      ]);
      if (psRes.error) throw psRes.error;
      if (stRes.error) throw stRes.error;

      let col: Column[] = [];
      let stMap: Record<string, Status> = {};

      if (psRes.data && psRes.data.length) {
        col = psRes.data.map((r: any, idx: number) => ({
          statusId: r.statuses.id as string,
          title: r.statuses.name as string,
          category: r.statuses.category as Status["category"],
          order: r.column_order ?? idx,
        }));
        stMap = Object.fromEntries(
          psRes.data.map((r: any) => [r.statuses.id, r.statuses as Status])
        );
      } else {
        // Fallback: use all statuses in a default order by category
        const order: Record<Status["category"], number> = {
          todo: 0,
          inprogress: 1,
          review: 2,
          done: 3,
        };
        const all = (stRes.data as Status[]) || [];
        col = all
          .slice()
          .sort((a, b) => order[a.category] - order[b.category])
          .map((s, i) => ({ statusId: s.id, title: s.name, category: s.category, order: i }));
        stMap = Object.fromEntries(all.map((s) => [s.id, s]));
      }

      setColumns(col);
      setStatusesMap(stMap);

      // 3) Issues for project
      const { data: iss, error: ierr } = await supabase
        .from("issues")
        .select("*")
        .eq("project_id", proj.id);
      if (ierr) throw ierr;
      setIssues((iss as Issue[]) || []);

      // 4) Workflow transitions
      const { data: trans, error: terr } = await supabase
        .from("workflow_transitions")
        .select("id, project_id, from_status_id, to_status_id, name, conditions")
        .eq("project_id", proj.id);
      if (terr) throw terr;
      setTransitions((trans as Transition[]) || []);
    } catch (e: any) {
      setError(e.message || "Failed to load board");
    } finally {
      setLoading(false);
    }
  }, [projectKey]);

  useEffect(() => {
    reload();
  }, [reload]);

  const transitionsFrom = useCallback(
    (fromStatusId?: string | null) => {
      if (!fromStatusId) return [] as Transition[];
      return transitions.filter((t) => t.from_status_id === fromStatusId);
    },
    [transitions]
  );

  const moveIssue = useCallback(
    async (issueId: string, toStatusId: string) => {
      const issue = issues.find((i) => i.id === issueId);
      if (!issue || !project) return;
      const { error: uerr } = await supabase
        .from("issues")
        .update({ status_id: toStatusId })
        .eq("id", issueId);
      if (uerr) throw uerr;

      // update local state optimistically
      setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, status_id: toStatusId } : i)));

      // log timeline event
      await supabase.from("timeline_events").insert({
        entity_type: "issue",
        entity_id: issueId,
        event_type: "status_changed",
        user_name: "system",
        details: `Status changed from ${statusesMap[issue.status_id || ""]?.name || "Unknown"} to ${
          statusesMap[toStatusId]?.name || "Unknown"
        }`,
        metadata: { from_status_id: issue.status_id, to_status_id: toStatusId, issue_key: issue.external_key },
      });
    },
    [issues, project, statusesMap]
  );

  const createIssue = useCallback(
    async (payload: {
      title: string;
      description?: string | null;
      priority?: Issue["priority"];
      severity?: Issue["severity"];
      assignee?: string | null;
      story_points?: number | null;
      labels?: string[] | null;
      status_name?: string | null; // optional mapping by name
    }) => {
      if (!project) throw new Error("No project");
      // decide status id: by name if provided, else first column
      const desired = payload.status_name?.toLowerCase();
      const byName = desired
        ? Object.values(statusesMap).find((s) => s.name.toLowerCase() === desired)
        : undefined;
      const status_id = byName?.id || columns[0]?.statusId || null;

      const insertRow = {
        project_id: project.id,
        title: payload.title,
        description: payload.description ?? null,
        priority: payload.priority || "Medium",
        severity: payload.severity || "medium",
        assignee: payload.assignee ?? null,
        story_points: payload.story_points ?? null,
        labels: payload.labels ?? [],
        status_id,
      };

      const { data, error } = await supabase
        .from("issues")
        .insert(insertRow)
        .select("*")
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setIssues((prev) => [data as Issue, ...prev]);
        await supabase.from("timeline_events").insert({
          entity_type: "issue",
          entity_id: (data as Issue).id,
          event_type: "created",
          user_name: "system",
          details: `Issue created: ${payload.title}`,
          metadata: { project_key: project.key },
        });
      }
    },
    [project, columns, statusesMap]
  );

  const linkThread = useCallback(
    async (issueId: string, params: { source?: string; externalId?: string; title?: string }) => {
      const { error } = await supabase.from("issue_threads").insert({
        issue_id: issueId,
        thread_source: params.source || "internal",
        thread_external_id: params.externalId || null,
        thread_title: params.title || null,
      });
      if (error) throw error;
    },
    []
  );

  const columnsById = useMemo(() => Object.fromEntries(columns.map((c) => [c.statusId, c])), [columns]);

  return {
    loading,
    error,
    project,
    columns,
    columnsById,
    statusesMap,
    issues,
    transitions,
    transitionsFrom,
    reload,
    moveIssue,
    createIssue,
    linkThread,
  };
}
