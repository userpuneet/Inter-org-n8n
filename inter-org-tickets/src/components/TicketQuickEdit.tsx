
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface TicketQuickEditProps {
  id: string;
  currentValue: string;
  type: "status" | "priority" | "assignee";
  onChange: (id: string, value: string) => void;
  options: { value: string; label: string }[];
}

const TicketQuickEdit: React.FC<TicketQuickEditProps> = ({
  id,
  currentValue,
  type,
  onChange,
  options,
}) => {
  const [value, setValue] = useState(currentValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onChange(id, newValue);
  };

  const renderBadge = () => {
    if (type === "status") {
      switch (value) {
        case "open":
          return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Open</Badge>;
        case "in_progress":
          return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">In Progress</Badge>;
        case "resolved":
          return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Resolved</Badge>;
        case "closed":
          return <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">Closed</Badge>;
        default:
          return <Badge variant="outline">{value}</Badge>;
      }
    } else if (type === "priority") {
      switch (value) {
        case "critical":
          return <Badge className="bg-red-500">Critical</Badge>;
        case "high":
          return <Badge className="bg-orange-500">High</Badge>;
        case "medium":
          return <Badge className="bg-yellow-500">Medium</Badge>;
        case "low":
          return <Badge className="bg-green-500">Low</Badge>;
        default:
          return <Badge>{value}</Badge>;
      }
    } else {
      return <span className="text-sm">{value || "Unassigned"}</span>;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "status":
        return "Change Status";
      case "priority":
        return "Change Priority";
      case "assignee":
        return "Change Assignee";
      default:
        return "Change Value";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">{renderBadge()}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{getTitle()}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={handleValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TicketQuickEdit;
