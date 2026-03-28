import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Flag, ArrowRight } from "lucide-react";
import type { Issue, Status, Transition } from "@/hooks/useProjectBoard";

type Props = {
  issue: Issue;
  status?: Status | null;
  onMove?: (toStatusId: string) => void;
  transitions?: Transition[];
};

const getPriorityColor = (priority?: Issue["priority"]) => {
  switch (priority) {
    case "High":
    case "Critical":
      return "text-red-600";
    case "Medium":
      return "text-yellow-600";
    case "Low":
    default:
      return "text-green-600";
  }
};

export const IssueCard: React.FC<Props> = ({ issue, status, transitions = [], onMove }) => {
  const initials = (issue.assignee || "").split(" ").map((n) => n[0]).join("");
  const key = issue.external_key || issue.id.slice(0, 8).toUpperCase();
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-mono">{key}</span>
            {status && <Badge variant="outline" className="text-xs">{status.name}</Badge>}
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Issue actions">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
        <CardTitle className="text-sm font-medium leading-tight">
          {issue.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {issue.labels && issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issue.labels.map((label) => (
              <Badge key={label} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className={`h-3 w-3 ${getPriorityColor(issue.priority)}`} />
            <span className="text-xs text-muted-foreground">{issue.priority}</span>
          </div>
          <div className="flex items-center gap-2">
            {typeof issue.story_points === "number" && (
              <span className="text-xs bg-muted px-2 py-1 rounded">{issue.story_points} SP</span>
            )}
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {!!transitions.length && onMove && (
          <div className="flex flex-wrap gap-2 pt-2">
            {transitions.map((t) => (
              <Button key={t.id} size="sm" variant="secondary" onClick={() => onMove(t.to_status_id)} aria-label={`Move to ${t.name}`}>
                <ArrowRight className="h-3 w-3 mr-1" /> {t.name}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IssueCard;
