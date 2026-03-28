import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Issue } from "@/hooks/useProjectBoard";
import IssueCard from "./IssueCard";

export type BoardColumnProps = {
  id: string; // statusId
  title: string;
  count: number;
  issues: Issue[];
  onMove: (issueId: string, toStatusId: string) => void;
  transitionsFrom: (fromStatusId?: string | null) => any[];
  triggerCreate?: React.ReactNode;
};

const BoardColumn: React.FC<BoardColumnProps> = ({ id, title, count, issues, onMove, transitionsFrom, triggerCreate }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4 bg-muted">
        <h3 className="font-semibold text-lg flex items-center justify-between">
          {title}
          <Badge variant="secondary">{count}</Badge>
        </h3>
      </div>
      <div className="space-y-3">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            transitions={transitionsFrom(issue.status_id)}
            onMove={(to) => onMove(issue.id, to)}
          />
        ))}
        {triggerCreate ?? (
          <Button variant="ghost" className="w-full border-2 border-dashed h-12" disabled>
            <Plus className="h-4 w-4 mr-2" /> Add Issue
          </Button>
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
