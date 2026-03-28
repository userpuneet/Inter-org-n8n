import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  Lightbulb,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Reaction {
  type: 'thumbsUp' | 'thumbsDown' | 'heart' | 'helpful' | 'solution' | 'concern';
  count: number;
  users: string[];
  hasReacted: boolean;
}

interface CommentReactionsProps {
  commentId: string;
  reactions: Reaction[];
  onReact: (commentId: string, reactionType: string) => void;
}

const reactionIcons = {
  thumbsUp: ThumbsUp,
  thumbsDown: ThumbsDown,
  heart: Heart,
  helpful: Lightbulb,
  solution: CheckCircle,
  concern: AlertCircle,
};

const reactionLabels = {
  thumbsUp: '👍',
  thumbsDown: '👎',
  heart: '❤️',
  helpful: '💡',
  solution: '✅',
  concern: '⚠️',
};

const CommentReactions: FC<CommentReactionsProps> = ({
  commentId,
  reactions,
  onReact
}) => {
  const [showAllReactions, setShowAllReactions] = useState(false);

  const handleReact = (reactionType: string) => {
    onReact(commentId, reactionType);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      {/* Existing reactions */}
      {reactions.filter(r => r.count > 0).map((reaction) => (
        <Button
          key={reaction.type}
          variant={reaction.hasReacted ? "default" : "outline"}
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => handleReact(reaction.type)}
        >
          <span className="mr-1">{reactionLabels[reaction.type]}</span>
          {reaction.count}
        </Button>
      ))}

      {/* Add reaction button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => setShowAllReactions(!showAllReactions)}
        >
          + React
        </Button>
        
        {showAllReactions && (
          <div className="absolute bottom-full mb-1 left-0 bg-white border rounded-md shadow-lg p-2 flex gap-1 z-10">
            {Object.entries(reactionLabels).map(([type, emoji]) => (
              <Button
                key={type}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  handleReact(type);
                  setShowAllReactions(false);
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentReactions;
