
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  if (isMobile) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r bg-white transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          {isOpen ? (
            <h1 className="text-xl font-semibold">
              <span className="campus-gradient-text">Campus</span>
              <span>Sync</span>
            </h1>
          ) : (
            <span className="text-2xl font-bold bg-gradient-primary text-white rounded-md w-10 h-10 flex items-center justify-center">
              CS
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "transition-transform duration-300",
              isOpen ? "rotate-0" : "rotate-180"
            )}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="flex flex-col gap-1 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-item",
                location.pathname === item.path && "active"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-500"
                )}
              />
              {isOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          {isOpen && currentUser ? (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{currentUser.name}</span>
                <span className="text-xs text-gray-500 capitalize">
                  {currentUser.role}
                </span>
              </div>
            </div>
          ) : (
            <Avatar>
              <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
              <AvatarFallback>
                {currentUser?.name.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          )}

          <button
            onClick={logout}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
