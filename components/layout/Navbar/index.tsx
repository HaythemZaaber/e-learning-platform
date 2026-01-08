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
  Bookmark,
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
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import {
  AIChatModal,
  FloatingChatButton,
  MinimizedChat,
} from "@/components/ai-chat/AIChatModal";
import { useAIChatStore } from "@/stores/aiChat.store";

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
  isDashboard?: boolean;
}

const Navbar = ({ notificationCount, isDashboard }: NavbarProps) => {
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

  // AI Chat store
  const {
    isOpen: isAIChatOpen,
    isMinimized: isAIChatMinimized,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
  } = useAIChatStore();

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

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
            href: "/student/sessions",
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
            description: "Teaching & learning overview",
          },
          {
            label: "My Learning",
            href: "/instructor/dashboard/my-learning",
            icon: BookOpen,
            description: "Continue your learning journey",
          },
          {
            label: "Browse Courses",
            href: "/instructor/dashboard/courses-browse",
            icon: BookOpen,
            description: "Discover new courses to learn",
          },
          {
            label: "Browse Instructors",
            href: "/instructor/dashboard/instructors-browse",
            icon: Users,
            description: "Find expert instructors",
          },
          {
            label: "Learning Resources",
            href: "/instructor/dashboard/learning-resources",
            icon: Bookmark,
            description: "Access educational materials",
          },
          {
            label: "My Teaching",
            href: "/instructor/dashboard/courses",
            icon: Award,
            description: "Manage your courses",
          },
          {
            label: "Schedule",
            href: "/instructor/dashboard/schedule",
            icon: Calendar,
            description: "Teaching & learning schedule",
          },
          {
            label: "Analytics",
            href: "/instructor/dashboard/analytics",
            icon: PieChart,
            description: "Performance insights",
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
            href: "/parent/sessions",
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-auto p-0 hover:bg-transparent group"
        >
          <div className="flex items-center gap-2 rounded-full pr-2 pl-1 py-1 hover:bg-accent/50 transition-all duration-200">
            <div className="relative">
              {/* Avatar with gradient border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-semibold shadow-lg ring-2 ring-background group-hover:scale-105 transition-transform duration-200">
                {userInitials}
                {/* Online status indicator */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></span>
              </div>
            </div>
            {/* Desktop only: Show name and chevron */}
            <div className="hidden md:flex items-center gap-1">
              <div className="flex flex-col items-start max-w-[120px]">
                <span className="text-sm font-medium text-foreground truncate">
                  {userFullName?.split(" ")[0] || "User"}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {userRole?.toLowerCase()}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        {/* Enhanced header with gradient */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-lg">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-base font-semibold shadow-lg">
              {userInitials}
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {userFullName}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-xs capitalize bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 mt-1"
              >
                {userRole?.toLowerCase()}
              </Badge>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="p-1">
          <DropdownMenuItem asChild>
            <Link
              href={`/${userRole?.toLowerCase()}/dashboard`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/${userRole?.toLowerCase()}/profile`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium">Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/${userRole?.toLowerCase()}/settings`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="font-medium">Settings</span>
            </Link>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <div className="p-1">
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer"
            onClick={() => signOut()}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-medium">Sign Out</span>
          </DropdownMenuItem>
        </div>
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
            <Link
              href={
                userRole === UserRole.INSTRUCTOR || userRole === UserRole.ADMIN
                  ? "/instructor/dashboard/overview"
                  : "/"
              }
              className="flex items-center gap-2"
            >
              {/* <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                ED
              </div> */}
              <div className="relative flex items-center justify-center">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-7 h-7 text-white animate-pulse" />
                </div>
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
                              <Badge
                                variant="secondary"
                                className="ml-1 text-xs bg-yellow-400 text-yellow-900"
                              >
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
              onClick={openChat}
              title="AI Assistant"
            >
              <MessageSquareText className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-[10px] text-white font-bold">
                AI
              </span>
            </Button>

            {/* Notifications */}
            {isAuthenticated && <NotificationDropdown />}

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
                              <Badge
                                variant="secondary"
                                className="ml-1 text-xs bg-yellow-400 text-yellow-900"
                              >
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
