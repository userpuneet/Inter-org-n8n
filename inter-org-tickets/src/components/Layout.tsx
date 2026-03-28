
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <SidebarInset>
          <div className="flex flex-col min-h-screen">
            <div className="flex items-center gap-2 px-2 sm:px-4 py-2 border-b border-gray-200 bg-white sticky top-0 z-10">
              <SidebarTrigger className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Header />
              </div>
            </div>
            <main className="flex-1 p-3 sm:p-6 overflow-auto">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
