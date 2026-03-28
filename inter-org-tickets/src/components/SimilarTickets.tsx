
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SimilarTicketItem {
  id: string;
  title: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  similarity: number; // 0-100 percentage of similarity
  organization?: string;
  priority?: "low" | "medium" | "high" | "critical";
}

interface SimilarTicketsProps {
  currentTicketTitle: string;
  currentTicketId: string;
  similarTickets: SimilarTicketItem[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "open": return "bg-blue-50 text-blue-600 border-blue-200";
    case "in_progress": return "bg-amber-50 text-amber-600 border-amber-200";
    case "resolved": return "bg-green-50 text-green-600 border-green-200";
    case "closed": return "bg-gray-100 text-gray-600 border-gray-300";
    default: return "";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical": return "bg-red-50 text-red-600 border-red-200";
    case "high": return "bg-orange-50 text-orange-600 border-orange-200";
    case "medium": return "bg-yellow-50 text-yellow-600 border-yellow-200";
    case "low": return "bg-green-50 text-green-600 border-green-200";
    default: return "";
  }
};

const SimilarTickets: React.FC<SimilarTicketsProps> = ({ 
  currentTicketTitle, 
  currentTicketId,
  similarTickets 
}) => {
  const navigate = useNavigate();
  
  // Find keywords from the current ticket title
  const keywords = currentTicketTitle
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3) // Only words longer than 3 chars
    .slice(0, 5); // Take up to 5 keywords
  
  const handleTicketClick = (ticketId: string) => {
    navigate(`/threads?id=${ticketId}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-base">Similar Tickets</h3>
      </div>
      
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 text-gray-500">
            <Tag className="h-3.5 w-3.5" />
            <span className="text-xs">Keywords:</span>
          </div>
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50">
              {keyword}
            </Badge>
          ))}
        </div>
      )}
      
      {similarTickets.length > 0 ? (
        <div className="space-y-3">
          {similarTickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className="cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => handleTicketClick(ticket.id)}
            >
              <CardContent className="p-3">
                <div className="flex gap-2 items-start">
                  <Ticket className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{ticket.title}</span>
                      <Badge variant="outline" className={`ml-2 text-xs whitespace-nowrap ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {ticket.organization && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-md">
                          {ticket.organization}
                        </span>
                      )}
                      
                      {ticket.priority && (
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </Badge>
                      )}
                      
                      <div className="ml-auto">
                        <span className="text-xs text-gray-500 font-medium">
                          {ticket.similarity}% match
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-1.5">
                      <span className="text-xs text-gray-500">{ticket.id}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-lg text-gray-500 text-sm">
          No similar tickets found based on keywords.
        </div>
      )}
    </div>
  );
};

export default SimilarTickets;
