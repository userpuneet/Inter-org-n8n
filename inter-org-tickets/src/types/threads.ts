// ─── Thread Types ────────────────────────────────────────────────────────────

export type ThreadStatus = "open" | "in_progress" | "resolved" | "closed";
export type ThreadPriority = "low" | "medium" | "high" | "critical";
export type RelationshipType = "internal" | "client" | "vendor" | "partner";

export interface ThreadPerson {
  name: string;
  email: string;
  organization: string;
}

export interface ThreadETA {
  value: string;
  setBy: string;
  setByOrg: string;
  timestamp: string;
}

export interface Thread {
  id: string;
  title: string;
  organization: string;
  status: ThreadStatus;
  priority: ThreadPriority;
  created: string;
  updated: string;
  responseTime: string;
  assignee: string | null;
  description?: string;
  raiser: ThreadPerson;
  recipient: ThreadPerson;
  relationshipType: RelationshipType;
  eta?: ThreadETA;
}

// ─── Comment Types ────────────────────────────────────────────────────────────

export type CommentCategory = "solution" | "question" | "update" | "escalation";
export type ReactionType = "thumbsUp" | "thumbsDown" | "heart" | "helpful" | "solution" | "concern";

export interface Comment {
  id: string;
  author: string;
  authorOrg: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
  replyTo?: string;
  isEdited?: boolean;
  lastEditTime?: string;
  category?: CommentCategory;
  isBookmarked?: boolean;
  mentions?: string[];
}

export interface Reaction {
  type: ReactionType;
  count: number;
  users: string[];
  hasReacted: boolean;
}

// ─── Timeline Types ────────────────────────────────────────────────────────────

export type TimelineEventType =
  | "created"
  | "updated"
  | "status_changed"
  | "assigned"
  | "comment_added"
  | "eta_set";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  timestamp: string;
  user: string;
  userOrg?: string;
  details: string;
  assignee?: string;
  etaValue?: string;
}
