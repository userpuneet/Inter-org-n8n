
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Link } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author: string;
  authorOrg: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

interface TicketCommentsProps {
  comments: Comment[];
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

const TicketComments: FC<TicketCommentsProps> = ({ comments }) => {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [etaValue, setEtaValue] = useState("");
  const [etaUnit, setEtaUnit] = useState("hours");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() || selectedFiles.length > 0 || links.length > 0) {
      toast({ title: "Comment posted", description: "Your comment has been added." });
      setNewComment("");
      setEtaValue("");
      setSelectedFiles([]);
      setLinks([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter(file => file.size <= 25 * 1024 * 1024);
      
      if (validFiles.length !== filesArray.length) {
        toast({
          title: "Some files were skipped",
          description: "Files larger than 25 MB cannot be attached.",
          variant: "destructive",
        });
      }
      
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addLink = () => {
    if (newLink.trim()) {
      setLinks(prev => [...prev, newLink.trim()]);
      setNewLink("");
      setShowLinkInput(false);
    }
  };

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Thread list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            className={`p-4 rounded-lg border ${
              comment.isInternal ? "bg-amber-50 border-amber-100" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="font-medium">{comment.author}</div>
                <Badge className="ml-2 text-xs px-2 py-0.5" variant="outline">
                  {comment.authorOrg}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(comment.timestamp)}
                {comment.isInternal && (
                  <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Internal
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 text-gray-700">{comment.content}</div>
          </div>
        ))}
      </div>

      {/* New thread entry form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Add a reply to the thread..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] pr-2"
          />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => document.getElementById("file-upload")?.click()}
              title="Attach files (max 25MB)"
            >
              <Paperclip className="h-4 w-4" />
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowLinkInput(!showLinkInput)}
              title="Add link"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Selected Files Preview */}
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
                  <SelectGroup>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectGroup>
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
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TicketComments;
