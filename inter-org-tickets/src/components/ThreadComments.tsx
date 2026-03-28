
import { FC, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ThreadCommentsHeader from "./thread-comments/ThreadCommentsHeader";
import ThreadCommentsList from "./thread-comments/ThreadCommentsList";
import CommentForm from "./thread-comments/CommentForm";
import type { Comment, Reaction } from "@/types/threads";

interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
}

interface ThreadCommentsProps {
  comments: Comment[];
}

const defaultReactions: Reaction[] = [
  { type: 'thumbsUp', count: 0, users: [], hasReacted: false },
  { type: 'thumbsDown', count: 0, users: [], hasReacted: false },
  { type: 'heart', count: 0, users: [], hasReacted: false },
  { type: 'helpful', count: 0, users: [], hasReacted: false },
  { type: 'solution', count: 0, users: [], hasReacted: false },
  { type: 'concern', count: 0, users: [], hasReacted: false },
];

const ThreadComments: FC<ThreadCommentsProps> = ({ comments }) => {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [etaValue, setEtaValue] = useState("");
  const [etaUnit, setEtaUnit] = useState("hours");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ x: 0, y: 0 });
  const [commentCategory, setCommentCategory] = useState<string>("");

  // Group comments by thread (main comments and their replies)
  const organizeComments = (comments: Comment[]) => {
    const commentMap = new Map<string, Comment & { replies: Comment[] }>();
    const rootComments: (Comment & { replies: Comment[] })[] = [];

    // First pass: create comment objects with empty replies arrays
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into threads
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.replyTo) {
        const parentComment = commentMap.get(comment.replyTo);
        if (parentComment) {
          parentComment.replies.push(commentWithReplies);
        } else {
          // If parent not found, treat as root comment
          rootComments.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() || selectedFiles.length > 0 || links.length > 0) {
      toast({ title: "Comment posted", description: "Your reply has been added to the thread." });
      setNewComment("");
      setEtaValue("");
      setSelectedFiles([]);
      setLinks([]);
      setReplyToId(null);
      setCommentCategory("");
    }
  };

  const handleTemplateSelect = (content: string) => {
    setNewComment(content);
  };

  const handleMention = (query: string) => {
    setMentionQuery(query);
    setShowMentions(true);
    // Get cursor position for mention dropdown
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setMentionPosition({ x: rect.left, y: rect.top });
    }
  };

  const handleSelectUser = (user: User) => {
    const mentionText = `@${user.name}`;
    setNewComment(prev => prev.replace(/@\w*$/, mentionText + ' '));
    setShowMentions(false);
  };

  const handleReply = (commentId: string) => {
    setReplyToId(commentId);
    // Focus on the textarea
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  const handleReact = (_commentId: string, reactionType: string) => {
    toast({ title: "Reaction added", description: `You reacted with ${reactionType}.` });
  };

  const handleEdit = (_commentId: string) => {
    toast({ title: "Edit coming soon", description: "Comment editing will be available shortly." });
  };

  const handleDelete = (_commentId: string) => {
    toast({ title: "Delete coming soon", description: "Comment deletion will be available shortly." });
  };

  const handleBookmark = (_commentId: string) => {
    toast({ title: "Bookmarked", description: "Comment saved to your bookmarks." });
  };

  const handleFlag = (_commentId: string) => {
    toast({ title: "Flagged", description: "This comment has been flagged for review." });
  };

  const organizedComments = organizeComments(comments);
  const replyToComment = replyToId ? comments.find(c => c.id === replyToId) : null;

  // Filter comments based on search
  const filteredComments = searchQuery 
    ? organizedComments.filter(comment => 
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : organizedComments;

  return (
    <div className="space-y-3 sm:space-y-6 max-w-full">
      <div className="w-full">
        <ThreadCommentsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div className="w-full overflow-hidden">
        <ThreadCommentsList
          comments={filteredComments}
          defaultReactions={defaultReactions}
          onReply={handleReply}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBookmark={handleBookmark}
          onReact={handleReact}
          onFlag={handleFlag}
        />
      </div>

      <div className="w-full">
        <CommentForm
          newComment={newComment}
          setNewComment={setNewComment}
          isInternal={isInternal}
          setIsInternal={setIsInternal}
          etaValue={etaValue}
          setEtaValue={setEtaValue}
          etaUnit={etaUnit}
          setEtaUnit={setEtaUnit}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          links={links}
          setLinks={setLinks}
          newLink={newLink}
          setNewLink={setNewLink}
          showLinkInput={showLinkInput}
          setShowLinkInput={setShowLinkInput}
          replyToId={replyToId}
          setReplyToId={setReplyToId}
          showMentions={showMentions}
          setShowMentions={setShowMentions}
          mentionQuery={mentionQuery}
          setMentionQuery={setMentionQuery}
          mentionPosition={mentionPosition}
          setMentionPosition={setMentionPosition}
          commentCategory={commentCategory}
          setCommentCategory={setCommentCategory}
          replyToComment={replyToComment}
          onSubmit={handleSubmit}
          onTemplateSelect={handleTemplateSelect}
          onMention={handleMention}
          onSelectUser={handleSelectUser}
        />
      </div>
    </div>
  );
};

export default ThreadComments;
