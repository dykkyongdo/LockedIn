import { Bell, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { logout } from "@/lib/api";

interface AppHeaderProps {
  user?: {
    name: string;
    avatar?: string;
  };
  onProfileClick?: () => void;
}

export function AppHeader({ user, onProfileClick }: AppHeaderProps) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/seeking");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200 select-none"
            onClick={handleLogoClick}
            title="Go to job seeking"
          >
            {/* Lock Icon with "in" */}
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="relative w-5 h-5">
                {/* Lock shackle (top part) */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 border-2 border-white rounded-full"></div>
                {/* Lock body */}
                <div className="absolute top-1.5 left-0 w-5 h-3 bg-white rounded-sm"></div>
                {/* "in" text inside lock body */}
                <div className="absolute top-1.5 left-0 w-5 h-3 flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold leading-none">in</span>
                </div>
              </div>
            </div>
            
            {/* Text */}
            <h1 className="text-2xl font-bold text-gray-900">
              LockedIn
            </h1>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="h-5 w-5" />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-primary rounded-full border-2 border-background"></span>
          </Button>

          {/* Profile Avatar */}
          <Avatar className="cursor-pointer" onClick={onProfileClick}>
            <AvatarImage src={user?.avatar} alt={user?.name || "Profile"} />
            <AvatarFallback className="bg-gradient-primary text-white font-semibold">
              {user?.name?.charAt(0) || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>

          {/* Overflow menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}