import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type TimelineEvent = {
  id: string;
  entity_type: "project" | "issue";
  entity_id: string;
  event_type: string;
  user_name: string | null;
  details: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
};

const formatDate = (iso: string) => new Date(iso).toLocaleString();

export const ProjectTimeline: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("entity_type", "project")
        .eq("entity_id", projectId)
        .order("created_at", { ascending: false })
        .limit(15);
      if (!mounted) return;
      if (error) return;
      setEvents((data as TimelineEvent[]) || []);
    })();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  if (!events.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {events.map((e) => (
            <li key={e.id} className="text-sm">
              <span className="font-medium">{e.event_type.replace("_", " ")}</span>
              {e.details ? <> — <span className="text-muted-foreground">{e.details}</span></> : null}
              <span className="ml-2 text-muted-foreground">{formatDate(e.created_at)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
