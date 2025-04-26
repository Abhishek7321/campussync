
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sidebarItems } from "@/lib/constants";
import { Menu, X, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNavbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 md:hidden">
      <div className="flex items-center justify-between h-16 px-4 border-b bg-white">
        <Link to="/dashboard" className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">
            <span className="campus-gradient-text">Campus</span>
            <span>Sync</span>
          </h1>
        </Link>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-2">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <h1 className="text-xl font-semibold">
                  <span className="campus-gradient-text">Campus</span>
                  <span>Sync</span>
                </h1>
                <button onClick={() => setIsOpen(false)} className="p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-auto">
                <nav className="flex flex-col gap-1">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "sidebar-item",
                        location.pathname === item.path && "active"
                      )}
                      onClick={handleNavigation}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          location.pathname === item.path
                            ? "text-primary"
                            : "text-gray-500"
                        )}
                      />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="border-t p-4">
                <div className="flex items-center justify-between">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md transition-colors"
                    onClick={handleNavigation}
                  >
                    <Avatar>
                      <AvatarImage
                        src={currentUser?.avatar}
                        alt={currentUser?.name}
                      />
                      <AvatarFallback>
                        {currentUser?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {currentUser?.name || "Guest"}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {currentUser?.role || "Not logged in"}
                      </span>
                    </div>
                  </Link>

                  <div className="flex gap-2">
                    <Link 
                      to="/profile" 
                      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
                      title="Profile"
                      onClick={handleNavigation}
                    >
                      <User className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to log out?")) {
                          logout();
                          setIsOpen(false);
                        }
                      }}
                      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
