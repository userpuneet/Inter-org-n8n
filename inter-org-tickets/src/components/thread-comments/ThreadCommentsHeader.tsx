
import { FC } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThreadCommentsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ThreadCommentsHeader: FC<ThreadCommentsHeaderProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search comments..."
          className="pl-9 w-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select>
        <SelectTrigger className="w-full sm:w-[140px] flex-shrink-0">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Comments</SelectItem>
          <SelectItem value="solution">Solutions</SelectItem>
          <SelectItem value="question">Questions</SelectItem>
          <SelectItem value="update">Updates</SelectItem>
          <SelectItem value="escalation">Escalations</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThreadCommentsHeader;
