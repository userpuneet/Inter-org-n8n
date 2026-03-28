
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "system" | "maintenance" | "feature" | "security" | "other";
  date: string;
  important: boolean;
}

const dummyAnnouncements: Announcement[] = [
  {
    id: "ANN-001",
    title: "Scheduled Maintenance",
    content: "The system will be undergoing scheduled maintenance on Sunday, June 15th from 2:00 AM to 6:00 AM EDT. During this time, the system may be intermittently unavailable. We apologize for any inconvenience this may cause.",
    category: "maintenance",
    date: "2023-06-10T09:00:00",
    important: true,
  },
  {
    id: "ANN-002",
    title: "New Feature: Similar Tickets",
    content: "We've added a new feature that shows you similar tickets when viewing a ticket. This will help you identify related issues and reduce duplicate tickets. Check it out in the ticket details page!",
    category: "feature",
    date: "2023-06-05T14:30:00",
    important: false,
  },
  {
    id: "ANN-003",
    title: "Security Update",
    content: "We've updated our security protocols to enhance data protection. All users are required to reset their passwords within the next 7 days. You will receive an email with instructions.",
    category: "security",
    date: "2023-06-01T11:15:00",
    important: true,
  },
  {
    id: "ANN-004",
    title: "Updated User Interface",
    content: "We've made improvements to the user interface to make it more intuitive and efficient. Navigation has been simplified, and we've added new keyboard shortcuts to improve workflow.",
    category: "feature",
    date: "2023-05-28T16:45:00",
    important: false,
  }
];

const getCategoryBadge = (category: string) => {
  switch (category) {
    case "maintenance":
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Maintenance</Badge>;
    case "feature":
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">New Feature</Badge>;
    case "security":
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Security</Badge>;
    case "system":
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">System</Badge>;
    default:
      return <Badge variant="outline">{category}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const AnnouncementsPage = () => {
  const [filter, setFilter] = useState<string | undefined>(undefined);

  const filteredAnnouncements = filter 
    ? dummyAnnouncements.filter(a => a.category === filter)
    : dummyAnnouncements;

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Bell className="mr-2 h-6 w-6" />
            System Announcements
          </h1>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Badge 
              variant={filter === undefined ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter(undefined)}
            >
              All
            </Badge>
            <Badge 
              variant={filter === "maintenance" ? "default" : "outline"}
              className="cursor-pointer bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
              onClick={() => setFilter("maintenance")}
            >
              Maintenance
            </Badge>
            <Badge 
              variant={filter === "feature" ? "default" : "outline"}
              className="cursor-pointer bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
              onClick={() => setFilter("feature")}
            >
              Features
            </Badge>
            <Badge 
              variant={filter === "security" ? "default" : "outline"}
              className="cursor-pointer bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              onClick={() => setFilter("security")}
            >
              Security
            </Badge>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map(announcement => (
              <Card key={announcement.id} className={announcement.important ? "border-red-200" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {announcement.title}
                        {announcement.important && (
                          <Badge className="ml-2 bg-red-500">Important</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {formatDate(announcement.date)}
                      </CardDescription>
                    </div>
                    {getCategoryBadge(announcement.category)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{announcement.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-8 text-gray-500">
              No announcements found matching your filter.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AnnouncementsPage;
