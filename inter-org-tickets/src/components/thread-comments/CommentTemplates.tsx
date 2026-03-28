
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Plus } from "lucide-react";

interface Template {
  id: string;
  name: string;
  content: string;
  category: 'resolution' | 'investigation' | 'escalation' | 'closure' | 'custom';
}

interface CommentTemplatesProps {
  onSelectTemplate: (content: string) => void;
}

const defaultTemplates: Template[] = [
  {
    id: 'investigating',
    name: 'Investigating Issue',
    content: 'Thank you for reporting this issue. I\'m currently investigating and will update you with my findings shortly.\n\n**Next Steps:**\n- [ ] Review logs\n- [ ] Check system status\n- [ ] Test reproduction steps',
    category: 'investigation'
  },
  {
    id: 'need-info',
    name: 'Need More Information',
    content: 'To help resolve this issue, I need some additional information:\n\n**Please provide:**\n- Browser/device information\n- Steps to reproduce\n- Any error messages\n- Screenshots if applicable',
    category: 'investigation'
  },
  {
    id: 'escalating',
    name: 'Escalating to Team',
    content: 'I\'m escalating this issue to our specialized team for further investigation. You can expect an update within **[TIMEFRAME]**.\n\n**Reference ID:** #[TICKET_ID]',
    category: 'escalation'
  },
  {
    id: 'resolved',
    name: 'Issue Resolved',
    content: 'Great news! This issue has been resolved. \n\n**Solution:** [DESCRIBE_SOLUTION]\n\nPlease test and confirm that everything is working as expected. Feel free to reopen if you encounter any further issues.',
    category: 'resolution'
  },
  {
    id: 'workaround',
    name: 'Temporary Workaround',
    content: 'While we work on a permanent fix, here\'s a temporary workaround:\n\n**Steps:**\n1. [STEP_1]\n2. [STEP_2]\n3. [STEP_3]\n\nI\'ll keep you updated on the permanent solution.',
    category: 'resolution'
  },
  {
    id: 'closing',
    name: 'Closing Thread',
    content: 'I\'m closing this thread as it appears to be resolved. If you need any further assistance, please don\'t hesitate to reach out or reopen this thread.',
    category: 'closure'
  }
];

const CommentTemplates: FC<CommentTemplatesProps> = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showTemplates, setShowTemplates] = useState(false);

  const filteredTemplates = selectedCategory === 'all' 
    ? defaultTemplates 
    : defaultTemplates.filter(t => t.category === selectedCategory);

  const categoryColors = {
    investigation: 'bg-blue-100 text-blue-800',
    escalation: 'bg-orange-100 text-orange-800',
    resolution: 'bg-green-100 text-green-800',
    closure: 'bg-gray-100 text-gray-800',
    custom: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowTemplates(!showTemplates)}
        className="h-8"
      >
        <FileText className="h-3 w-3 mr-1" />
        Templates
      </Button>

      {showTemplates && (
        <div className="absolute bottom-full mb-2 left-0 bg-white border rounded-md shadow-lg w-80 max-h-96 overflow-y-auto z-20">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">Comment Templates</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="investigation">Investigation</SelectItem>
                <SelectItem value="escalation">Escalation</SelectItem>
                <SelectItem value="resolution">Resolution</SelectItem>
                <SelectItem value="closure">Closure</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => {
                  onSelectTemplate(template.content);
                  setShowTemplates(false);
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm">{template.name}</div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${categoryColors[template.category]}`}
                  >
                    {template.category}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 line-clamp-2">
                  {template.content.substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentTemplates;
