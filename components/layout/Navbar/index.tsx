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
  BarChart3,
  Home,
  BookOpenCheck,
  UserCheck,
  PieChart,
  ShoppingCart,
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
import { useRouter, usePathname } from "next/navigation";
import {
  UserButton,
  useUser,
  useAuth,
  SignInButton,
  SignUpButton, 
} from "@clerk/nextjs";
import { useAuthStore, useAuthSelectors, UserRole } from "@/stores/auth.store";
import { useCheckoutItemCount } from "@/stores/payment.store";
import StoreModal from "@/components/shared/StoreModal";
import SearchModal from "@/components/shared/SearchModal";
// import SearchModal from "@/components/shared/SearchModal";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  > | null;
  badge?: string;
  description?: string;
}

export interface NavbarProps {
  notificationCount?: number;
  onAiAssistantToggle?: () => void;
  isDashboard?: boolean;
}

const Navbar = ({
  notificationCount = 0,
  onAiAssistantToggle = () => {},
  isDashboard = false,
}: NavbarProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const { isSignedIn: isClerkSignedIn, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Get auth data from your store
  const { user, isAuthenticated } = useAuthStore();
  const {
    userInitials,
    userFullName,
    userRole,
    isAdmin,
    isInstructor,
    isStudent,
    isParent,
  } = useAuthSelectors();
  
  // Get cart item count
  const cartItemCount = useCheckoutItemCount();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavigationItems = (): NavigationItem[] => {
    // Base items for all users
    const baseItems: NavigationItem[] = [
      {
        label: "Find Instructors",
        href: "/instructors",
        icon: Users,
        description: "Discover qualified teachers",
      },
      {
        label: "Courses",
        href: "/courses",
        icon: BookOpen,
        description: "Browse available courses",
      },
    ];

    // If user is not authenticated, show visitor navigation
    if (!isAuthenticated || !userRole) {
      return [
        ...baseItems,
        {
          label: "How It Works",
          href: "/how-it-works",
          icon: null,
          description: "Learn about our platform",
        },
        {
          label: "Become an Instructor",
          href: "/become-instructor",
          icon: GraduationCap,
          description: "Start teaching today",
        },
      ];
    }

    // Role-based navigation
    switch (userRole) {
      case UserRole.STUDENT:
        return [
          {
            label: "Dashboard",
            href: "/student/dashboard",
            icon: Home,
            description: "Your learning overview",
          },
          {
            label: "My Courses",
            href: "/student/my-courses",
            icon: BookOpenCheck,
            description: "Track your progress",
          },
          {
            label: "Schedule",
            href: "/student/schedule",
            icon: Calendar,
            description: "Manage your classes",
          },
          {
            label: "Find Instructors",
            href: "/instructors",
            icon: Users,
            description: "Discover new teachers",
          },
          {
            label: "Become an Instructor",
            href: "/become-instructor",
            icon: GraduationCap,   
            description: "Start teaching today",
          },
        ];

      case UserRole.INSTRUCTOR:
        return [
          {
            label: "Dashboard",
            href: "/instructor/dashboard",
            icon: Home,
            description: "Teaching overview",
          },
          {
            label: "Students",
            href: "/instructor/students",
            icon: UserCheck,
            description: "Manage your students",
          },
          {
            label: "Content",
            href: "/instructor/content",
            icon: Award,
            description: "Create and manage content",
          },
          {
            label: "Analytics",
            href: "/instructor/analytics",
            icon: PieChart,
            description: "View performance metrics",
          },
          {
            label: "Schedule",
            href: "/instructor/schedule",
            icon: Calendar,
            description: "Manage your availability",
          },
        ];

      case UserRole.PARENT:
        return [
          {
            label: "Dashboard",
            href: "/parent/dashboard",
            icon: Home,
            description: "Family learning overview",
          },
          {
            label: "My Children",
            href: "/parent/children",
            icon: Heart,
            description: "Monitor children's progress",
          },
          {
            label: "Find Instructors",
            href: "/instructors",
            icon: Users,
            description: "Find teachers for your children",
          },
          {
            label: "Schedule",
            href: "/parent/schedule",
            icon: Calendar,
            description: "Family class schedule",
          },
        ];

      case UserRole.ADMIN:
        return [
          {
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: Home,
            description: "Platform overview",
          },
          {
            label: "Users",
            href: "/admin/users",
            icon: Users,
            description: "Manage all users",
          },
          {
            label: "Analytics",
            href: "/admin/analytics",
            icon: BarChart3,
            description: "Platform analytics",
          },
          {
            label: "Settings",
            href: "/admin/settings",
            icon: Settings,
            description: "System configuration",
          },
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  // Check if current path is active
  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname?.startsWith(href);
  };

  // Custom UserProfile with role-based actions
  const UserProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {userInitials}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
            {userInitials}
          </div>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{userFullName}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {userRole?.toLowerCase()}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
        
        href={`/${userRole?.toLowerCase()}/dashboard`}
        className="flex items-center"
      >
        <User className="mr-2 h-4 w-4" />
        Dashboard
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link
            href={`/${userRole?.toLowerCase()}/profile`}
            className="flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/${userRole?.toLowerCase()}/settings`}
            className="flex items-center"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <motion.nav
      className={cn(
        "w-full z-50 transition-all duration-300 ease-in-out border-b text-black",
        isSticky || isDashboard
          ? "sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm py-2"
          : "relative bg-background py-3",
        isDashboard && "bg-background/95"
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
            {!isDashboard && (
              <nav className="hidden lg:flex items-center gap-6">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href);

                  if (item.label === "Become an Instructor") {
                    return (
                      <Link key={item.label} href={item.href}>
                        <motion.button
                          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 flex items-center gap-2 text-foreground cursor-pointer ">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.label}
                            {item.badge && (
                              <Badge variant="secondary" className="ml-1 text-xs bg-yellow-400 text-yellow-900">
                                {item.badge}
                              </Badge>
                            )}
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
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium hover:scale-105 transition-all duration-300 hover:text-white",
                          isActive && "bg-primary/10 text-primary"
                        )}
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
            {/* Search Icon - Desktop */}
            {!isDashboard && isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:text-black hover:bg-primary/10"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* AI Assistant */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:text-black hover:bg-primary/10"
              onClick={onAiAssistantToggle}
            >
              <MessageSquareText className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                AI
              </span>
            </Button>

            {/* Notifications */}
            {isAuthenticated && (
              <Button variant="ghost" size="icon" className="relative hover:text-black hover:bg-primary/10">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </Button>
            )}

            {/* Store/Cart Icon */}
            {isAuthenticated && isStudent && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:text-black hover:bg-primary/10"
                onClick={() => setIsStoreModalOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </Button>
            )}

            {/* User Profile or Auth Buttons */}
            {isLoaded && isAuthenticated ? (
              <UserProfileDropdown />
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
                {isAuthenticated && (
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSearchModalOpen(true);
                      }}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search courses, instructors...
                    </Button>
                  </div>
                )}

                {/* Role Badge */}
                {isAuthenticated && userRole && (
                  <div className="mb-2">
                    <Badge variant="outline" className="capitalize">
                      {userRole.toLowerCase()} Account
                    </Badge>
                  </div>
                )}

                {/* Mobile Navigation Items */}
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href);

                  if (item.label === "Become an Instructor") {
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="w-full"
                      >
                        <motion.button
                          className="w-full relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="w-full justify-center relative px-3 py-2 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 flex items-center gap-2 text-foreground">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.label}
                            {item.badge && (
                              <Badge variant="secondary" className="ml-1 text-xs bg-yellow-400 text-yellow-900">
                                {item.badge}
                              </Badge>
                            )}
                          </span>
                        </motion.button>
                      </Link>
                    );
                  }

                  return (
                    <Button
                      key={item.label}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "justify-start gap-2",
                        isActive && "bg-primary/10 text-primary"
                      )}
                      asChild
                    >
                      <Link href={item.href}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <div className="flex flex-col items-start">
                          <span>{item.label}</span>
                          {item.description && (
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          )}
                        </div>
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
                {!isAuthenticated && (
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

      {/* Store Modal */}
      <StoreModal 
        isOpen={isStoreModalOpen} 
        onClose={() => setIsStoreModalOpen(false)} 
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </motion.nav>
  );
};

export default Navbar;
