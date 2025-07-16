"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Menu,
  MessageSquareText,
  X,
  Bell,
  Search,
  BookOpen,
  Users,
  Calendar,
  Settings,
  User,
  LogOut,
  ChevronDown,
  GraduationCap,
  Award,
  Heart,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import {
  UserButton,
  useUser,
  useAuth,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  > | null;
  badge?: string;
}

export type UserRole = "visitor" | "student" | "teacher" | "parent" | "admin";

export interface NavbarProps {
  userRole?: UserRole;
  userName?: string;
  userInitials?: string;
  notificationCount?: number;
  onAiAssistantToggle?: () => void;
  isDashboard?: boolean;
}

const Navbar = ({
  userRole = "teacher",
  userName = "",
  userInitials = "",
  notificationCount = 0,
  onAiAssistantToggle = () => {},
  isDashboard = false,
}: NavbarProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  // Get user role from Clerk public metadata (customize as needed)
  const userRoleFromClerk = user?.publicMetadata?.role || "visitor";
  const userNameFromClerk = user?.fullName || "User";
  const userInitialsFromClerk = user?.firstName?.[0] || "U";
  const notificationCountFromClerk = 0; // TODO: Replace with real notification count
  const isDashboardFromProps = false; // TODO: Set based on route if needed

  const isLoggedIn = isSignedIn;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      { label: "Find Teachers", href: "/instructors", icon: Users },
      { label: "Courses", href: "/courses", icon: BookOpen },
    ];

    switch (userRoleFromClerk) {
      case "visitor":
        return [
          ...baseItems,
          { label: "How It Works", href: "/how-it-works", icon: null },
          {
            label: "Become an Instructor",
            href: "/become-instructor",
            icon: GraduationCap,
            badge: "New",
          },
        ];

      case "student":
        return [
          { label: "Dashboard", href: "/student/dashboard", icon: BookOpen },
          { label: "My Learning", href: "/student/courses", icon: Star },
          { label: "Schedule", href: "/student/schedule", icon: Calendar },
          { label: "Find Teachers", href: "/teachers", icon: Users },
        ];

      case "teacher":
        return [
          { label: "Dashboard", href: "/instructor/dashboard", icon: BookOpen },
          { label: "My Students", href: "/instructor/students", icon: Users },
          { label: "Content", href: "/instructor/content", icon: Award },
          { label: "Analytics", href: "/instructor/analytics", icon: Star },
        ];

      case "parent":
        return [
          { label: "Dashboard", href: "/parent/dashboard", icon: BookOpen },
          { label: "My Children", href: "/parent/children", icon: Heart },
          { label: "Find Teachers", href: "/teachers", icon: Users },
          { label: "Schedule", href: "/parent/schedule", icon: Calendar },
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  // Remove custom UserProfileDropdown, use Clerk's UserButton instead

  const SearchBar = () => (
    <div
      className={cn(
        "relative transition-all duration-300",
        isSearchExpanded ? "w-96" : "w-64"
      )}
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search courses, teachers..."
        className="pl-9 pr-4"
        onFocus={() => setIsSearchExpanded(true)}
        onBlur={() => setIsSearchExpanded(false)}
      />
    </div>
  );

  return (
    <motion.nav
      className={cn(
        "w-full z-50 transition-all duration-300 ease-in-out border-b",
        isSticky || isDashboardFromProps
          ? "sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm py-2"
          : "relative bg-background py-3",
        isDashboardFromProps && "bg-background/95"
      )}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sm:w-[90vw] mx-auto px-4 sm:px-0">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                ED
              </div>
              <span className="font-bold text-xl text-foreground">
                EduConnect
              </span>
            </Link>
            {/* Desktop Navigation */}
            {!isDashboardFromProps && (
              <nav className="hidden lg:flex items-center gap-6">
                {navigationItems.map((item) => {
                  if (item.label === "Become an Instructor") {
                    return (
                      <Link key={item.label} href={item.href}>
                        <motion.button
                          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 flex items-center gap-2 text-foreground cursor-pointer">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.label}
                          </span>
                        </motion.button>
                      </Link>
                    );
                  }
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="relative"
                    >
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-sm font-medium hover:scale-105 transition-all duration-300"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                        {item.badge && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            )}
          </motion.div>

          {/* Right Side Actions */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Search Bar - Desktop */}
            {!isDashboardFromProps && isLoggedIn && (
              <div className="hidden md:block">
                <SearchBar />
              </div>
            )}

            {/* AI Assistant */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onAiAssistantToggle}
            >
              <MessageSquareText className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                AI
              </span>
            </Button>

            {/* Notifications */}
            {isLoggedIn && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCountFromClerk > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notificationCountFromClerk > 9
                      ? "9+"
                      : notificationCountFromClerk}
                  </span>
                )}
              </Button>
            )}

            {/* User Profile or Auth Buttons */}
            {isLoaded && isLoggedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Get Started</Button>
                </SignUpButton>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pb-4 border-t"
            >
              <div className="flex flex-col space-y-2 pt-4">
                {/* Mobile Search */}
                {isLoggedIn && (
                  <div className="mb-4">
                    <SearchBar />
                  </div>
                )}
                {/* Mobile Navigation Items */}
                {navigationItems.map((item) => {
                  if (item.label === "Become an Instructor") {
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="w-full"
                      >
                        <motion.button
                          className="w-full relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-blue-300  cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="w-full justify-center relative px-3 py-2 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 flex items-center gap-2 text-foreground ">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.label}
                          </span>
                        </motion.button>
                      </Link>
                    );
                  }
                  return (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="justify-start gap-2"
                      asChild
                    >
                      <Link href={item.href}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </Button>
                  );
                })}
                {/* Mobile Auth Buttons */}
                {!isLoggedIn && (
                  <div className="flex flex-col gap-2 pt-4 border-t">
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="justify-start">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="justify-start">Get Started</Button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
