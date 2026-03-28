
import { FC } from "react";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  id: string;
  type: "created" | "updated" | "status_changed" | "assigned" | "comment_added" | "eta_set";
  timestamp: string;
  user: string;
  userOrg?: string;
  details: string;
  assignee?: string;
  etaValue?: string;
}

interface TicketTimelineProps {
  timelineEvents: TimelineEvent[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEventIcon = (type: string) => {
  switch (type) {
    case "created":
      return (
        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-green-500" />
        </div>
      );
    case "status_changed":
      return (
        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
        </div>
      );
    case "assigned":
      return (
        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
        </div>
      );
    case "comment_added":
      return (
        <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
        </div>
      );
    case "eta_set":
      return (
        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-indigo-500" />
        </div>
      );
    default:
      return (
        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-gray-500" />
        </div>
      );
  }
};

const TicketTimeline: FC<TicketTimelineProps> = ({ timelineEvents }) => {
  // Sort events by timestamp (newest first)
  const sortedEvents = [...timelineEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="relative space-y-3 py-1 pl-3 max-h-[300px] overflow-y-auto">
      <div className="absolute top-0 bottom-0 left-3 w-px bg-gray-200"></div>
      {sortedEvents.map((event) => (
        <div key={event.id} className="relative pl-8">
          <div className="absolute left-0 top-1">{getEventIcon(event.type)}</div>
          <div className="text-xs">
            <div className="font-medium">
              {event.details}
              {event.type === "assigned" && event.assignee && (
                <span className="font-medium text-purple-600 ml-1">{event.assignee}</span>
              )}
              {event.type === "eta_set" && event.etaValue && (
                <span className="font-medium text-indigo-600 ml-1">{event.etaValue}</span>
              )}
            </div>
            <div className="text-gray-500 flex items-center flex-wrap gap-1">
              <span>{event.user}</span>
              {event.userOrg && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {event.userOrg}
                </Badge>
              )}
              <span className="mx-1">•</span>
              <span>{formatDate(event.timestamp)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketTimeline;
