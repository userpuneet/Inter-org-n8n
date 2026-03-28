import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Clock, CheckCircle2, Wrench, Package, Truck, Phone, User, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FieldTechnician {
  id: string;
  name: string;
  avatar: string;
  status: "available" | "busy" | "offline";
  location: string;
  expertise: string[];
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  assignments: number;
  completionRate: number;
}

interface FieldServiceTicket {
  id: string;
  title: string;
  customer: {
    name: string;
    address: string;
    contact: string;
  };
  status: "pending" | "assigned" | "en_route" | "in_progress" | "completed" | "canceled";
  priority: "low" | "medium" | "high" | "critical";
  scheduledTime?: string;
  estimatedDuration: string;
  requiredParts: {
    name: string;
    status: "in-stock" | "ordered" | "unavailable";
  }[];
  assignedTechnician?: {
    id: string;
    name: string;
    avatar: string;
    eta?: string;
  };
}

interface Inventory {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  threshold: number;
  location: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "ordered";
}

const dummyTechnicians: FieldTechnician[] = [
  {
    id: "tech-001",
    name: "Alex Rivera",
    avatar: "AR",
    status: "available",
    location: "North Region",
    expertise: ["Networking", "Server Hardware", "Security Systems"],
    currentLocation: {
      lat: 37.7749,
      lng: -122.4194,
      address: "1234 Market St, San Francisco, CA"
    },
    assignments: 2,
    completionRate: 96
  },
  {
    id: "tech-002",
    name: "Jamie Wilson",
    avatar: "JW",
    status: "busy",
    location: "Central Region",
    expertise: ["Fiber Optics", "Cabling", "Wireless"],
    currentLocation: {
      lat: 37.7833,
      lng: -122.4167,
      address: "555 Montgomery St, San Francisco, CA"
    },
    assignments: 3,
    completionRate: 92
  },
  {
    id: "tech-003",
    name: "Morgan Zhang",
    avatar: "MZ",
    status: "available",
    location: "South Region",
    expertise: ["HVAC", "Power Systems", "UPS Installation"],
    currentLocation: {
      lat: 37.7695,
      lng: -122.4143,
      address: "789 Folsom St, San Francisco, CA"
    },
    assignments: 1,
    completionRate: 98
  },
  {
    id: "tech-004",
    name: "Taylor Johnson",
    avatar: "TJ",
    status: "offline",
    location: "East Region",
    expertise: ["Workstations", "POS Systems", "Printers"],
    assignments: 0,
    completionRate: 95
  }
];

const dummyTickets: FieldServiceTicket[] = [
  {
    id: "FS-1001",
    title: "Server room cooling system malfunction",
    customer: {
      name: "Acme Financial Corp",
      address: "1234 Market St, San Francisco, CA 94103",
      contact: "(415) 555-1212"
    },
    status: "assigned",
    priority: "critical",
    scheduledTime: "2025-05-09T13:00:00Z",
    estimatedDuration: "3 hours",
    requiredParts: [
      { name: "Temperature sensor", status: "in-stock" },
      { name: "Control board", status: "in-stock" }
    ],
    assignedTechnician: {
      id: "tech-001",
      name: "Alex Rivera",
      avatar: "AR",
      eta: "30 minutes"
    }
  },
  {
    id: "FS-1002",
    title: "Office network connectivity issues",
    customer: {
      name: "TechFlow Inc",
      address: "555 Montgomery St, San Francisco, CA 94111",
      contact: "(415) 555-2323"
    },
    status: "in_progress",
    priority: "high",
    scheduledTime: "2025-05-09T10:30:00Z",
    estimatedDuration: "2 hours",
    requiredParts: [
      { name: "Router", status: "in-stock" },
      { name: "Network switch", status: "in-stock" }
    ],
    assignedTechnician: {
      id: "tech-002",
      name: "Jamie Wilson",
      avatar: "JW"
    }
  },
  {
    id: "FS-1003",
    title: "Backup power system installation",
    customer: {
      name: "GlobalSoft HQ",
      address: "789 Folsom St, San Francisco, CA 94107",
      contact: "(415) 555-5678"
    },
    status: "pending",
    priority: "medium",
    scheduledTime: "2025-05-10T09:00:00Z",
    estimatedDuration: "4 hours",
    requiredParts: [
      { name: "UPS System", status: "ordered" },
      { name: "Battery pack", status: "in-stock" },
      { name: "Power distribution unit", status: "in-stock" }
    ]
  },
  {
    id: "FS-1004",
    title: "Workstation setup for new department",
    customer: {
      name: "NexGen Solutions",
      address: "101 California St, San Francisco, CA 94111",
      contact: "(415) 555-9090"
    },
    status: "pending",
    priority: "low",
    scheduledTime: "2025-05-12T14:00:00Z",
    estimatedDuration: "5 hours",
    requiredParts: [
      { name: "Desktop computers (5)", status: "in-stock" },
      { name: "Monitors (10)", status: "in-stock" },
      { name: "Docking stations", status: "ordered" }
    ]
  },
  {
    id: "FS-1005",
    title: "Security system upgrade",
    customer: {
      name: "Quantum Dynamics",
      address: "135 Main St, San Francisco, CA 94105",
      contact: "(415) 555-1313"
    },
    status: "completed",
    priority: "high",
    scheduledTime: "2025-05-08T11:00:00Z",
    estimatedDuration: "6 hours",
    requiredParts: [
      { name: "Security cameras", status: "in-stock" },
      { name: "Access control panel", status: "in-stock" },
      { name: "Biometric readers", status: "in-stock" }
    ],
    assignedTechnician: {
      id: "tech-003",
      name: "Morgan Zhang",
      avatar: "MZ"
    }
  }
];

const dummyInventory: Inventory[] = [
  {
    id: "inv-001",
    name: "Network Router (Enterprise)",
    category: "Networking",
    stockLevel: 5,
    threshold: 3,
    location: "Main Warehouse - Rack A3",
    status: "in-stock"
  },
  {
    id: "inv-002",
    name: "24-port Network Switch",
    category: "Networking",
    stockLevel: 2,
    threshold: 3,
    location: "Main Warehouse - Rack A4",
    status: "low-stock"
  },
  {
    id: "inv-003",
    name: "Server Rack Cooling Fan",
    category: "Cooling",
    stockLevel: 8,
    threshold: 5,
    location: "Main Warehouse - Rack B2",
    status: "in-stock"
  },
  {
    id: "inv-004",
    name: "UPS Battery Pack",
    category: "Power",
    stockLevel: 0,
    threshold: 2,
    location: "Main Warehouse - Rack C1",
    status: "out-of-stock"
  },
  {
    id: "inv-005",
    name: "Fiber Optic Cable (50m)",
    category: "Cabling",
    stockLevel: 12,
    threshold: 10,
    location: "Secondary Warehouse - Bin 3",
    status: "in-stock"
  }
];

const FieldServicePage = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedTicket, setSelectedTicket] = useState<FieldServiceTicket | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<FieldTechnician | null>(null);
  const { toast } = useToast();

  const handleAssignTechnician = (techId: string, ticketId: string) => {
    toast({
      title: "Technician Assigned",
      description: "Service ticket has been assigned successfully."
    });
    
    // In a real app, this would update the state appropriately
  };
  
  const handleContactTechnician = (techId: string) => {
    toast({
      title: "Calling Technician",
      description: "Connecting your call to the technician."
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mobile Field Service</h1>
            <p className="text-gray-500">Manage on-site technicians, schedules, and equipment</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Find Nearest Tech
            </Button>
            <Button>
              Schedule Service
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="map" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="map">Live Map</TabsTrigger>
            <TabsTrigger value="tickets">Service Tickets</TabsTrigger>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
            <TabsTrigger value="inventory">Parts Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="space-y-4">
            {/* Mock map view */}
            <Card>
              <CardContent className="p-0">
                <div className="h-[500px] bg-gray-100 relative">
                  {/* This would be an actual map in a real implementation */}
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center relative">
                    <img 
                      src="https://placehold.co/1200x500?text=Interactive+Map+View" 
                      alt="Map placeholder" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Markers representing technicians */}
                    <div className="absolute left-[30%] top-[40%]">
                      <div 
                        className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-lg border-2 border-white"
                        onClick={() => setSelectedTechnician(dummyTechnicians[0])}
                      >
                        AR
                      </div>
                    </div>
                    
                    <div className="absolute left-[45%] top-[35%]">
                      <div 
                        className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-lg border-2 border-white"
                        onClick={() => setSelectedTechnician(dummyTechnicians[1])}
                      >
                        JW
                      </div>
                    </div>
                    
                    <div className="absolute left-[60%] top-[60%]">
                      <div 
                        className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-lg border-2 border-white"
                        onClick={() => setSelectedTechnician(dummyTechnicians[2])}
                      >
                        MZ
                      </div>
                    </div>
                    
                    {/* Markers for service locations */}
                    <div className="absolute left-[25%] top-[25%]">
                      <div 
                        className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-lg"
                        onClick={() => setSelectedTicket(dummyTickets[0])}
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="absolute left-[45%] top-[30%]">
                      <div 
                        className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-lg"
                        onClick={() => setSelectedTicket(dummyTickets[1])}
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="absolute left-[65%] top-[55%]">
                      <div 
                        className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-lg"
                        onClick={() => setSelectedTicket(dummyTickets[2])}
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Info panel for selected technician or ticket */}
                  {(selectedTechnician || selectedTicket) && (
                    <div className="absolute top-4 right-4 w-72 bg-white rounded-lg shadow-lg border p-4">
                      {selectedTechnician && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Technician Details</h3>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0" 
                              onClick={() => setSelectedTechnician(null)}
                            >
                              ×
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>{selectedTechnician.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedTechnician.name}</p>
                              <div className="flex items-center gap-1">
                                <Badge 
                                  variant="outline"
                                  className={
                                    selectedTechnician.status === "available" 
                                      ? "bg-green-50 text-green-600 border-green-200" 
                                      : selectedTechnician.status === "busy"
                                      ? "bg-amber-50 text-amber-600 border-amber-200"
                                      : "bg-gray-50 text-gray-600 border-gray-200"
                                  }
                                >
                                  {selectedTechnician.status.charAt(0).toUpperCase() + selectedTechnician.status.slice(1)}
                                </Badge>
                                <span className="text-xs text-gray-500">{selectedTechnician.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <div className="flex items-center gap-1 mb-1">
                              <MapPin className="h-3 w-3 text-gray-500" />
                              <span className="text-gray-600">{selectedTechnician.currentLocation?.address || "Location unknown"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-gray-500" />
                              <span className="text-gray-600">{selectedTechnician.assignments} active assignments</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Expertise</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedTechnician.expertise?.map((skill, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="w-full" onClick={() => handleContactTechnician(selectedTechnician.id)}>
                              <Phone className="h-3 w-3 mr-1" />
                              Contact
                            </Button>
                            {selectedTechnician.status === "available" && (
                              <Button size="sm" className="w-full" variant="outline">
                                Assign
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {selectedTicket && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Service Details</h3>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0" 
                              onClick={() => setSelectedTicket(null)}
                            >
                              ×
                            </Button>
                          </div>
                          
                          <div>
                            <Badge 
                              variant={
                                selectedTicket.priority === "critical" ? "destructive" : 
                                selectedTicket.priority === "high" ? "default" : "outline"
                              }
                            >
                              {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                            </Badge>
                            <h4 className="font-medium mt-1">{selectedTicket.title}</h4>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">{selectedTicket.customer.name}</p>
                            <p className="text-xs text-gray-500">{selectedTicket.customer.address}</p>
                            <p className="text-xs text-gray-500">{selectedTicket.customer.contact}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-500" />
                              <span className="text-gray-600">
                                {selectedTicket.scheduledTime ? new Date(selectedTicket.scheduledTime).toLocaleString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : "Unscheduled"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-500" />
                              <span className="text-gray-600">{selectedTicket.estimatedDuration}</span>
                            </div>
                          </div>
                          
                          {selectedTicket.assignedTechnician ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{selectedTicket.assignedTechnician.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                <span>Assigned to {selectedTicket.assignedTechnician.name}</span>
                                {selectedTicket.assignedTechnician.eta && (
                                  <div className="text-xs text-green-600">ETA: {selectedTicket.assignedTechnician.eta}</div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <Button size="sm" className="w-full">
                              Assign Technician
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Service Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Active</p>
                      <p className="text-xl font-bold">3</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Pending</p>
                      <p className="text-xl font-bold">2</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Completed Today</p>
                      <p className="text-xl font-bold">4</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Critical</p>
                      <p className="text-xl font-bold">1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Technicians On Duty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dummyTechnicians.filter(tech => tech.status !== "offline").map(tech => (
                      <div key={tech.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            tech.status === "available" ? "bg-green-500" : "bg-amber-500"
                          }`}></div>
                          <span>{tech.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{tech.assignments} tasks</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Part Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-amber-50 text-amber-700 rounded-md">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">24-port Network Switch (Low Stock)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded-md">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">UPS Battery Pack (Out of Stock)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tickets" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {dummyTickets.map(ticket => (
                <Card key={ticket.id} className="overflow-hidden">
                  <div className={`h-1 ${
                    ticket.priority === "critical" ? "bg-red-500" :
                    ticket.priority === "high" ? "bg-amber-500" :
                    ticket.priority === "medium" ? "bg-blue-500" :
                    "bg-gray-500"
                  }`}></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline">
                        {ticket.status.replace("_", " ").split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Badge>
                      <Badge 
                        variant={
                          ticket.priority === "critical" ? "destructive" : 
                          ticket.priority === "high" ? "default" : "outline"
                        }
                      >
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium">{ticket.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{ticket.customer.name}</p>
                    <p className="text-xs text-gray-500">{ticket.customer.address}</p>
                    
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{ticket.scheduledTime ? new Date(ticket.scheduledTime).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : "Unscheduled"}</span>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Required Parts</p>
                      <div className="space-y-1">
                        {ticket.requiredParts.map((part, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-xs">{part.name}</span>
                            <Badge 
                              variant="outline" 
                              className={
                                part.status === "in-stock" ? "bg-green-50 text-green-600 border-green-200" :
                                part.status === "ordered" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                "bg-red-50 text-red-600 border-red-200"
                              }
                            >
                              {part.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {ticket.assignedTechnician ? (
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{ticket.assignedTechnician.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{ticket.assignedTechnician.name}</span>
                        </div>
                        
                        {ticket.assignedTechnician.eta && (
                          <span className="text-xs text-green-600">ETA: {ticket.assignedTechnician.eta}</span>
                        )}
                      </div>
                    ) : (
                      <Button size="sm" className="w-full mt-4">
                        Assign Technician
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="technicians">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {dummyTechnicians.map(tech => (
                <Card key={tech.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="text-lg">{tech.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-lg">{tech.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline"
                            className={
                              tech.status === "available" 
                                ? "bg-green-50 text-green-600 border-green-200" 
                                : tech.status === "busy"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : "bg-gray-50 text-gray-600 border-gray-200"
                            }
                          >
                            {tech.status.charAt(0).toUpperCase() + tech.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">{tech.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {tech.currentLocation && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Current Location</p>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{tech.currentLocation.address}</span>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Expertise</p>
                        <div className="flex flex-wrap gap-1">
                          {tech.expertise.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 py-2">
                        <div>
                          <p className="text-xs text-gray-500">Assignments</p>
                          <p className="text-xl font-medium">{tech.assignments}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Completion Rate</p>
                          <p className="text-xl font-medium">{tech.completionRate}%</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                        <Button size="sm" className="flex-1" variant="outline" onClick={() => handleContactTechnician(tech.id)}>
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Parts Inventory</CardTitle>
                <CardDescription>Current inventory levels and locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Item</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-center py-3 px-4">Stock Level</th>
                        <th className="text-center py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Location</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyInventory.map(item => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4">{item.category}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center">
                              <span>{item.stockLevel}</span>
                              <span className="text-xs text-gray-500 ml-1">/ {item.threshold}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge 
                              variant="outline"
                              className={
                                item.status === "in-stock" ? "bg-green-50 text-green-600" :
                                item.status === "low-stock" ? "bg-amber-50 text-amber-600" :
                                "bg-red-50 text-red-600"
                              }
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{item.location}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="outline" size="sm">Order</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">Showing 5 of 24 inventory items</p>
                <Button variant="outline" size="sm">
                  <Truck className="h-4 w-4 mr-2" />
                  Manage Inventory
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FieldServicePage;
