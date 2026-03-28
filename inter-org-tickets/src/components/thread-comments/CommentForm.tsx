
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import RichTextEditor from "./RichTextEditor";
import CommentTemplates from "./CommentTemplates";
import MentionSystem from "./MentionSystem";

interface Comment {
  id: string;
  author: string;
  content: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
}

interface CommentFormProps {
  newComment: string;
  setNewComment: (value: string) => void;
  isInternal: boolean;
  setIsInternal: (value: boolean) => void;
  etaValue: string;
  setEtaValue: (value: string) => void;
  etaUnit: string;
  setEtaUnit: (value: string) => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  links: string[];
  setLinks: (links: string[]) => void;
  newLink: string;
  setNewLink: (value: string) => void;
  showLinkInput: boolean;
  setShowLinkInput: (value: boolean) => void;
  replyToId: string | null;
  setReplyToId: (id: string | null) => void;
  showMentions: boolean;
  setShowMentions: (value: boolean) => void;
  mentionQuery: string;
  setMentionQuery: (value: string) => void;
  mentionPosition: { x: number; y: number };
  setMentionPosition: (position: { x: number; y: number }) => void;
  commentCategory: string;
  setCommentCategory: (value: string) => void;
  replyToComment: Comment | null;
  onSubmit: (e: React.FormEvent) => void;
  onTemplateSelect: (content: string) => void;
  onMention: (query: string) => void;
  onSelectUser: (user: User) => void;
}

const CommentForm: FC<CommentFormProps> = ({
  newComment,
  setNewComment,
  isInternal,
  setIsInternal,
  etaValue,
  setEtaValue,
  etaUnit,
  setEtaUnit,
  selectedFiles,
  setSelectedFiles,
  links,
  setLinks,
  newLink,
  setNewLink,
  showLinkInput,
  setShowLinkInput,
  replyToId,
  setReplyToId,
  showMentions,
  setShowMentions,
  mentionQuery,
  setMentionQuery,
  mentionPosition,
  setMentionPosition,
  commentCategory,
  setCommentCategory,
  replyToComment,
  onSubmit,
  onTemplateSelect,
  onMention,
  onSelectUser
}) => {
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const addLink = () => {
    if (newLink.trim()) {
      setLinks([...links, newLink.trim()]);
      setNewLink("");
      setShowLinkInput(false);
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const cancelReply = () => {
    setReplyToId(null);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4 border-t pt-6">
        {replyToComment && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-medium text-blue-800">
                  Replying to {replyToComment.author}
                </div>
                <div className="text-xs text-blue-600 mt-1 truncate">
                  "{replyToComment.content.substring(0, 100)}..."
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={cancelReply}
                className="h-6 w-6 p-0 text-blue-600"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        <RichTextEditor
          value={newComment}
          onChange={setNewComment}
          placeholder={replyToComment ? "Write your reply..." : "Add a reply to the thread..."}
          onMention={onMention}
        />

        {/* Templates and category selection */}
        <div className="flex items-center gap-3">
          <CommentTemplates onSelectTemplate={onTemplateSelect} />
          <Select value={commentCategory} onValueChange={setCommentCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="question">Question</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="solution">Solution</SelectItem>
              <SelectItem value="escalation">Escalation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* File attachments */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Attachments:</div>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-xs">
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button 
                    type="button" 
                    className="ml-1 text-gray-500 hover:text-red-500"
                    onClick={() => removeFile(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Link Input */}
        {showLinkInput && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Enter URL"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button type="button" onClick={addLink} variant="outline">Add</Button>
          </div>
        )}
        
        {/* Links Preview */}
        {links.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Links:</div>
            <div className="flex flex-wrap gap-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-xs">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[150px]">
                    {link}
                  </a>
                  <button 
                    type="button" 
                    className="ml-1 text-gray-500 hover:text-red-500"
                    onClick={() => removeLink(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* ETA */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Estimated Time to Resolution</label>
          <div className="flex gap-2">
            <div className="w-full sm:w-1/2">
              <Input
                type="number"
                min="1"
                placeholder="ETA Value"
                value={etaValue}
                onChange={(e) => setEtaValue(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <Select value={etaUnit} onValueChange={setEtaUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={() => setIsInternal(!isInternal)}
              className="rounded text-primary"
            />
            <span className="text-sm text-gray-700">Internal note</span>
          </label>
          <Button 
            type="submit" 
            disabled={!newComment.trim() && selectedFiles.length === 0 && links.length === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            {replyToComment ? 'Reply' : 'Send'}
          </Button>
        </div>
      </form>

      {/* Mention system */}
      {showMentions && (
        <MentionSystem
          query={mentionQuery}
          onSelectUser={onSelectUser}
          onClose={() => setShowMentions(false)}
          position={mentionPosition}
        />
      )}
    </>
  );
};

export default CommentForm;
