
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNavbar } from "./MobileNavbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  showFAB?: boolean;
  onFABClick?: () => void;
}

export function Layout({ 
  children, 
  showFAB = false, 
  onFABClick 
}: LayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/announcements")) return "Announcements";
    if (path.includes("/events")) return "Events";
    if (path.includes("/study-groups")) return "Study Groups";
    if (path.includes("/assignments")) return "Assignments";
    if (path.includes("/messages")) return "Messages";
    return "CampusSync";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNavbar />
      
      <main className={`flex-1 pb-16 ${isMobile ? "pt-16" : "pl-64"}`}>
        <div className="p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6">{getPageTitle()}</h1>
          {children}
        </div>
        
        {showFAB && (
          <Button
            onClick={onFABClick}
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
      </main>
    </div>
  );
}
