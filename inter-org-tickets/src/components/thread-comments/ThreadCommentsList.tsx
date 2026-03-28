
import { FC } from "react";
import EnhancedComment from "./EnhancedComment";

interface Comment {
  id: string;
  author: string;
  authorOrg: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
  replyTo?: string;
  isEdited?: boolean;
  lastEditTime?: string;
  category?: 'solution' | 'question' | 'update' | 'escalation';
  isBookmarked?: boolean;
  mentions?: string[];
  replies?: Comment[];
}

interface Reaction {
  type: 'thumbsUp' | 'thumbsDown' | 'heart' | 'helpful' | 'solution' | 'concern';
  count: number;
  users: string[];
  hasReacted: boolean;
}

interface ThreadCommentsListProps {
  comments: (Comment & { replies: Comment[] })[];
  defaultReactions: Reaction[];
  onReply: (commentId: string) => void;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onBookmark: (commentId: string) => void;
  onReact: (commentId: string, reactionType: string) => void;
  onFlag: (commentId: string) => void;
}

const ThreadCommentsList: FC<ThreadCommentsListProps> = ({
  comments,
  defaultReactions,
  onReply,
  onEdit,
  onDelete,
  onBookmark,
  onReact,
  onFlag
}) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-3">
          <EnhancedComment
            comment={comment}
            reactions={defaultReactions}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            onBookmark={onBookmark}
            onReact={onReact}
            onFlag={onFlag}
          />

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-2">
              {comment.replies.map((reply) => (
                <EnhancedComment
                  key={reply.id}
                  comment={reply}
                  reactions={defaultReactions}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onBookmark={onBookmark}
                  onReact={onReact}
                  onFlag={onFlag}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ThreadCommentsList;
