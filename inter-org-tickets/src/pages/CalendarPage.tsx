
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const dummyEvents = [
  {
    id: "e1",
    title: "Weekly IT Support Meeting",
    date: new Date(2023, 3, 22, 10, 0),
    endDate: new Date(2023, 3, 22, 11, 0),
    type: "meeting",
    priority: "medium",
  },
  {
    id: "e2",
    title: "Security Patch Deployment",
    date: new Date(2023, 3, 23, 14, 0),
    endDate: new Date(2023, 3, 23, 16, 0),
    type: "maintenance",
    priority: "high",
  },
  {
    id: "e3",
    title: "Database Backup",
    date: new Date(2023, 3, 24, 9, 0),
    endDate: new Date(2023, 3, 24, 10, 0),
    type: "maintenance",
    priority: "medium",
  },
  {
    id: "e4",
    title: "Cross-org Planning Session",
    date: new Date(2023, 3, 25, 13, 0),
    endDate: new Date(2023, 3, 25, 15, 0),
    type: "meeting",
    priority: "high",
  },
];

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Calendar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden lg:col-span-2">
            <CardContent className="p-0">
              <div className="bg-primary-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">April 2023</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-primary-700 h-8 w-8">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-primary-700 h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 gap-px mb-3">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                    const isToday = day === 22;
                    const hasEvents = [22, 23, 24, 25].includes(day);
                    
                    return (
                      <div
                        key={day}
                        className={`aspect-square p-1 border ${
                          isToday ? "bg-primary-100 border-primary" : ""
                        } ${day < 15 ? "text-gray-300" : ""}`}
                      >
                        <div className={`text-sm ${isToday ? "font-bold text-primary" : ""}`}>
                          {day}
                        </div>
                        {hasEvents && day >= 15 && (
                          <div className={`w-full mt-1 flex justify-center ${day < 15 ? "opacity-30" : ""}`}>
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Date</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {date?.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Upcoming</h3>
                <div className="space-y-3">
                  {dummyEvents.map((event) => (
                    <div key={event.id} className="p-2 border rounded-md hover:bg-gray-50">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <Badge variant="outline" className={
                          event.priority === "high"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-yellow-50 text-yellow-600 border-yellow-200"
                        }>
                          {event.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {formatTime(event.date)} - {formatTime(event.endDate)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="mt-6">
          <CardContent className="p-4">
            <Tabs defaultValue="day">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Today
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
              
              <TabsContent value="day" className="mt-0">
                <div className="border rounded-md">
                  <div className="flex p-4 border-b bg-gray-50">
                    <div className="w-24 font-medium">Time</div>
                    <div className="flex-1 font-medium">April 22, 2023</div>
                  </div>
                  <div className="divide-y">
                    {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => {
                      const timeString = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                      const event = dummyEvents.find(
                        e => e.date.getHours() === hour && e.date.getDate() === 22
                      );
                      
                      return (
                        <div key={hour} className="flex min-h-16 group hover:bg-gray-50">
                          <div className="w-24 p-2 text-sm text-gray-500">{timeString}</div>
                          <div className="flex-1 p-2">
                            {event && (
                              <div className={`p-2 rounded ${
                                event.priority === "high" ? "bg-red-50 border border-red-200" : "bg-amber-50 border border-amber-200"
                              }`}>
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{event.title}</h4>
                                  <Badge>{event.type}</Badge>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {formatTime(event.date)} - {formatTime(event.endDate)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="week">
                <div className="p-8 text-center text-gray-500">
                  Week view will be available in the next version
                </div>
              </TabsContent>
              
              <TabsContent value="month">
                <div className="p-8 text-center text-gray-500">
                  Month view will be available in the next version
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CalendarPage;
