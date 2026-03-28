
import { FC, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  Quote, 
  Code,
  AtSign,
  Smile
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onMention?: (query: string) => void;
}

const RichTextEditor: FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your comment...",
  onMention
}) => {
  const [showFormatting, setShowFormatting] = useState(false);

  const insertFormatting = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = 
      value.substring(0, start) + 
      before + selectedText + after + 
      value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle @ mentions
    if (e.key === '@') {
      onMention?.('');
    }
    
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertFormatting('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertFormatting('*', '*');
          break;
      }
    }
  };

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('**', '**')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('*', '*')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('`', '`')}
          title="Code"
        >
          <Code className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('> ', '')}
          title="Quote"
        >
          <Quote className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('- ', '')}
          title="List"
        >
          <List className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('[', '](url)')}
          title="Link"
        >
          <Link className="h-3 w-3" />
        </Button>
        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onMention?.('')}
            title="Mention user"
          >
            <AtSign className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            title="Emoji"
          >
            <Smile className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 min-h-[100px] resize-none focus-visible:ring-0"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default RichTextEditor;
