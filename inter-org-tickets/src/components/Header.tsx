import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="h-12 flex items-center gap-2 px-4">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-2 border-b border-gray-100">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="py-2">
              <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer">
                <p className="text-sm font-medium">You were mentioned in ticket #1234</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer">
                <p className="text-sm font-medium">Ticket #1123 was updated</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
              <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer">
                <p className="text-sm font-medium">Priority changed on ticket #998</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
            <div className="p-2 border-t border-gray-100">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
