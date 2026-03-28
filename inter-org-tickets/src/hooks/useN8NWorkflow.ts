/**
 * useN8NWorkflow
 * Workflow Studio — reads & writes workflow definitions through n8n.
 * Backed by TanStack Query.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { n8nPost, N8N_WEBHOOKS } from "@/lib/n8n";

export interface WorkflowStep {
  id: string;
  type: "start" | "end" | "condition" | "action" | "notification" | "assignment" | "approval";
  label: string;
  description?: string;
  status?: string;
  config?: Record<string, unknown>;
  x: number;
  y: number;
}

export interface WorkflowDef {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "inactive";
  category: string;
  steps: WorkflowStep[];
  connections: { from: string; to: string; condition?: string }[];
  triggers: { type: string; config: Record<string, unknown> }[];
  lastModified: string;
  author: { name: string; avatar: string };
  n8nWorkflowId?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: number;
  author: { name: string; avatar: string };
  lastModified: string;
  usage: number;
}

export function useN8NWorkflow() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const workflowsQuery = useQuery({
    queryKey: ["workflows"],
    queryFn: ({ signal }) =>
      n8nPost<WorkflowDef[]>(N8N_WEBHOOKS.WORKFLOW_LIST, {}, signal)
        .then((res) => res.data ?? []),
  });

  const templatesQuery = useQuery({
    queryKey: ["workflow-templates"],
    queryFn: ({ signal }) =>
      n8nPost<WorkflowTemplate[]>(N8N_WEBHOOKS.WORKFLOW_TEMPLATES, {}, signal)
        .then((res) => res.data ?? []),
    staleTime: 300_000,
  });

  const save = useMutation({
    mutationFn: (workflow: Partial<WorkflowDef> & { name: string }) =>
      n8nPost<WorkflowDef>(N8N_WEBHOOKS.WORKFLOW_SAVE, workflow as Record<string, unknown>),
    onSuccess: (res, workflow) => {
      if (res.ok && res.data) {
        qc.setQueryData<WorkflowDef[]>(["workflows"], (prev) => {
          if (!prev) return [res.data!];
          const idx = prev.findIndex((w) => w.id === res.data!.id);
          return idx >= 0 ? prev.map((w, i) => (i === idx ? res.data! : w)) : [...prev, res.data!];
        });
        toast({ title: "Workflow saved", description: `"${workflow.name}" synced to n8n` });
      } else {
        toast({ title: "Save failed", description: res.error ?? "n8n error", variant: "destructive" });
      }
    },
    onError: (err: Error) =>
      toast({ title: "Save failed", description: err.message, variant: "destructive" }),
  });

  const setStatus = useMutation({
    mutationFn: ({ workflowId, action }: { workflowId: string; action: "activate" | "deactivate" | "delete" }) => {
      const webhook = action === "activate"
        ? N8N_WEBHOOKS.WORKFLOW_ACTIVATE
        : action === "deactivate"
          ? N8N_WEBHOOKS.WORKFLOW_DEACTIVATE
          : N8N_WEBHOOKS.WORKFLOW_DELETE;
      return n8nPost(webhook, { workflowId });
    },
    onSuccess: (_, { workflowId, action }) => {
      if (action === "delete") {
        qc.setQueryData<WorkflowDef[]>(["workflows"], (prev) =>
          prev?.filter((w) => w.id !== workflowId)
        );
        toast({ title: "Workflow deleted" });
      } else {
        qc.setQueryData<WorkflowDef[]>(["workflows"], (prev) =>
          prev?.map((w) =>
            w.id === workflowId
              ? { ...w, status: (action === "activate" ? "active" : "inactive") as WorkflowDef["status"] }
              : w
          )
        );
        toast({ title: action === "activate" ? "Workflow activated" : "Workflow deactivated" });
      }
    },
    onError: (err: Error) =>
      toast({ title: "Operation failed", description: err.message, variant: "destructive" }),
  });

  const execute = useMutation({
    mutationFn: ({ workflowId, payload = {} }: { workflowId: string; payload?: Record<string, unknown> }) =>
      n8nPost(N8N_WEBHOOKS.WORKFLOW_EXECUTE, { workflowId, ...payload }),
    onSuccess: (res) => {
      toast({ title: "Workflow triggered", description: `Execution ID: ${res.executionId ?? "—"}` });
    },
    onError: (err: Error) =>
      toast({ title: "Execution failed", description: err.message, variant: "destructive" }),
  });

  return {
    workflows: workflowsQuery.data ?? [],
    templates: templatesQuery.data ?? [],
    loading: workflowsQuery.isLoading,
    saving: save.isPending,
    save: (workflow: Partial<WorkflowDef> & { name: string }) => save.mutateAsync(workflow),
    activate: (workflowId: string) => setStatus.mutate({ workflowId, action: "activate" }),
    deactivate: (workflowId: string) => setStatus.mutate({ workflowId, action: "deactivate" }),
    remove: (workflowId: string) => setStatus.mutate({ workflowId, action: "delete" }),
    execute: (workflowId: string, payload?: Record<string, unknown>) =>
      execute.mutateAsync({ workflowId, payload }),
    reload: () => qc.invalidateQueries({ queryKey: ["workflows"] }),
  };
}
