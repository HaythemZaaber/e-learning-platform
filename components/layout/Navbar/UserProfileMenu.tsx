"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "./ClientNavbar";

// Define profile menu items based on user role
const getProfileMenuItemsByRole = (role: UserRole) => {
  const baseItems = [
    { label: "My Profile", action: () => console.log("Profile clicked") },
    {
      label: "Account Settings",
      action: () => console.log("Settings clicked"),
    },
  ];

  switch (role) {
    case "student":
      return [
        ...baseItems,
        { label: "My Courses", action: () => console.log("Courses clicked") },
        { label: "My Progress", action: () => console.log("Progress clicked") },
      ];
    case "teacher":
      return [
        ...baseItems,
        { label: "My Students", action: () => console.log("Students clicked") },
        { label: "My Courses", action: () => console.log("Courses clicked") },
        {
          label: "Earnings Dashboard",
          action: () => console.log("Earnings clicked"),
        },
      ];
    case "parent":
      return [
        ...baseItems,
        { label: "My Children", action: () => console.log("Children clicked") },
        {
          label: "Payment History",
          action: () => console.log("Payments clicked"),
        },
      ];
    default:
      return baseItems;
  }
};

interface UserProfileMenuProps {
  isLoggedIn: boolean;
  userRole: UserRole;
  userInitials?: string;
  notificationCount?: number;
}

const UserProfileMenu = ({
  isLoggedIn,
  userRole,
  userInitials = "US",
  notificationCount = 0,
}: UserProfileMenuProps) => {
  // Mock functions for auth state
  const handleSignIn = () => console.log("Sign in clicked");
  const handleSignUp = () => console.log("Sign up clicked");
  const handleSignOut = () => console.log("Sign out clicked");

  if (isLoggedIn) {
    const profileMenuItems = getProfileMenuItemsByRole(userRole);

    return (
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="relative cursor-pointer"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </motion.div>

        {/* User Role Indicator - visible only on desktop */}
        <span className="hidden md:inline-flex text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
          {userRole}
        </span>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer transition-transform hover:scale-110">
              <AvatarFallback className="bg-accent text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {profileMenuItems.map((item) => (
              <DropdownMenuItem
                key={item.label}
                onClick={item.action}
                className="cursor-pointer"
              >
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-red-500 hover:text-red-600"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Not logged in - show auth buttons
  return (
    <div className="flex items-center gap-3">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex border-2 border-primary/20 bg-transparent hover:bg-primary/10 hover:border-primary/30 group transition-all duration-300 relative overflow-hidden"
          onClick={handleSignUp}
        >
          <span className="relative z-10 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Sign Up
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          size="sm"
          className="relative bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-lg hover:shadow-primary/30 transition-all duration-300 group overflow-hidden"
          onClick={handleSignIn}
        >
          <span className="relative z-10 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            Sign In
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Button>
      </motion.div>
    </div>
  );
};

export default UserProfileMenu;
