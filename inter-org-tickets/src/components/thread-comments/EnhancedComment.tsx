
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Reply, 
  MoreHorizontal, 
  Edit, 
  Bookmark, 
  Flag,
  Copy,
  Trash2,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommentReactions from "./CommentReactions";

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
}

interface Reaction {
  type: 'thumbsUp' | 'thumbsDown' | 'heart' | 'helpful' | 'solution' | 'concern';
  count: number;
  users: string[];
  hasReacted: boolean;
}

interface EnhancedCommentProps {
  comment: Comment;
  reactions: Reaction[];
  onReply: (commentId: string) => void;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onBookmark: (commentId: string) => void;
  onReact: (commentId: string, reactionType: string) => void;
  onFlag: (commentId: string) => void;
  isReply?: boolean;
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

const categoryColors = {
  solution: 'bg-green-100 text-green-800 border-green-200',
  question: 'bg-blue-100 text-blue-800 border-blue-200',
  update: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  escalation: 'bg-red-100 text-red-800 border-red-200'
};

const EnhancedComment: FC<EnhancedCommentProps> = ({
  comment,
  reactions,
  onReply,
  onEdit,
  onDelete,
  onBookmark,
  onReact,
  onFlag,
  isReply = false
}) => {
  const [showReactions, setShowReactions] = useState(false);

  const renderContent = (content: string) => {
    // Simple markdown-like rendering for mentions
    return content.replace(/@(\w+)/g, '<span class="bg-blue-100 text-blue-800 px-1 rounded">@$1</span>');
  };

  return (
    <div className={`group ${isReply ? 'ml-8' : ''}`}>
      <div className={`p-4 rounded-lg border ${
        comment.isInternal 
          ? "bg-amber-50 border-amber-100" 
          : "bg-white border-gray-200"
      } ${isReply ? 'border-l-4 border-l-blue-300' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {comment.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <div className="font-medium text-sm">{comment.author}</div>
              <Badge variant="outline" className="text-xs px-1 py-0">
                {comment.authorOrg}
              </Badge>
              {comment.category && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${categoryColors[comment.category]}`}
                >
                  {comment.category}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              {comment.isEdited && (
                <>
                  <Clock className="h-3 w-3" />
                  <span>edited</span>
                  <span>•</span>
                </>
              )}
              {formatDate(comment.timestamp)}
              {comment.isInternal && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 text-xs ml-1">
                  Internal
                </Badge>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onReply(comment.id)}>
                  <Reply className="h-3 w-3 mr-2" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(comment.id)}>
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBookmark(comment.id)}>
                  <Bookmark className={`h-3 w-3 mr-2 ${comment.isBookmarked ? 'fill-current' : ''}`} />
                  {comment.isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(comment.content)}>
                  <Copy className="h-3 w-3 mr-2" />
                  Copy text
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onFlag(comment.id)}>
                  <Flag className="h-3 w-3 mr-2" />
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(comment.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div 
          className="text-gray-700 text-sm mb-3"
          dangerouslySetInnerHTML={{ __html: renderContent(comment.content) }}
        />

        <div className="flex items-center justify-between">
          <CommentReactions
            commentId={comment.id}
            reactions={reactions}
            onReact={onReact}
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(comment.id)}
            className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Reply className="h-3 w-3 mr-1" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedComment;
