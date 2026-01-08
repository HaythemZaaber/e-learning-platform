// features/dashboard/constants/navigation.constants.ts

import {
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Users,
  Wallet,
  Video,
  Settings,
  GraduationCap,
  Bookmark,
  HelpCircle,
  Award,
  Star,
  TrendingUp,
  Bell,
  Target,
  Zap,
  Heart,
  Shield,
  Globe,
  PieChart,
  Clock,
  User,
  Film,
} from "lucide-react";

import {
  UserRole,
  NavigationSection,
  RoleInfo,
} from "../types/dashboard.types";

export const ROLE_NAVIGATION: Record<UserRole, NavigationSection> = {
  [UserRole.INSTRUCTOR]: {
    main: [
      {
        name: "Overview",
        href: "/instructor/dashboard/overview",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        name: "My Teaching",
        href: "/instructor/dashboard/courses",
        icon: BookOpen,
        badge: null,
      },
      {
        name: "My Learning",
        href: "/instructor/dashboard/my-learning",
        icon: GraduationCap,
        badge: "5",
      },
      {
        name: "Students",
        href: "/instructor/dashboard/students",
        icon: Users,
        badge: "12",
      },
      {
        name: "Live Sessions",
        href: "/instructor/dashboard/sessions",
        icon: Video,
        badge: null,
      },
      {
        name: "My Schedule",
        href: "/instructor/dashboard/schedule",
        icon: Calendar,
        badge: null,
      },
      {
        name: "Stories & Reels",
        href: "/instructor/dashboard/content",
        icon: Film,
      },
      {
        name: "Messages",
        href: "/instructor/dashboard/messages",
        icon: MessageSquare,
        badge: "3",
      },
      {
        name: "Analytics",
        href: "/instructor/dashboard/analytics",
        icon: TrendingUp,
        badge: null,
      },
      {
        name: "Earnings",
        href: "/instructor/dashboard/earnings",
        icon: Wallet,
        badge: null,
      },
      {
        name: "Notifications",
        href: "/instructor/notifications",
        icon: Bell,
        badge: null,
      },
    ],
    quick: [
      {
        name: "Browse Courses",
        href: "/instructor/dashboard/courses-browse",
        icon: BookOpen,
      },
      {
        name: "Browse Instructors",
        href: "/instructor/dashboard/instructors-browse",
        icon: Users,
      },
      {
        name: "Learning Resources",
        href: "/instructor/dashboard/learning-resources",
        icon: Bookmark,
      },
      {
        name: "Reviews",
        href: "/instructor/dashboard/reviews",
        icon: Star,
      },
      {
        name: "Profile",
        href: "/instructor/dashboard/profile",
        icon: User,
      },
    ],
  },

  [UserRole.STUDENT]: {
    main: [
      {
        name: "Dashboard",
        href: "/student/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        name: "My Courses",
        href: "/student/my-courses",
        icon: BookOpen,
        badge: "5",
      },
      {
        name: "Application Status",
        href: "/student/application-status",
        icon: GraduationCap,
        badge: "New",
      },
      {
        name: "Schedule",
        href: "/student/schedule",
        icon: Calendar,
        badge: null,
      },
      {
        name: "Sessions",
        href: "/student/sessions",
        icon: Video,
        badge: null,
      },
      {
        name: "Progress",
        href: "/student/progress",
        icon: TrendingUp,
        badge: null,
      },
      {
        name: "Teachers",
        href: "/student/teachers",
        icon: Users,
        badge: null,
      },
      {
        name: "Assignments",
        href: "/student/assignments",
        icon: FileText,
        badge: "2",
      },
      {
        name: "Messages",
        href: "/student/messages",
        icon: MessageSquare,
        badge: "1",
      },
      {
        name: "Notifications",
        href: "/student/notifications",
        icon: Bell,
        badge: null,
      },
    ],
  },

  [UserRole.PARENT]: {
    main: [
      {
        name: "Dashboard",
        href: "/parent/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        name: "My Children",
        href: "/parent/children",
        icon: Heart,
        badge: "2",
      },
      {
        name: "Progress Reports",
        href: "/parent/progress",
        icon: BarChart3,
        badge: null,
      },
      {
        name: "Teachers",
        href: "/parent/teachers",
        icon: Users,
        badge: null,
      },
      {
        name: "Schedule",
        href: "/parent/schedule",
        icon: Calendar,
        badge: null,
      },
      {
        name: "Payments",
        href: "/parent/payments",
        icon: Wallet,
        badge: null,
      },
      {
        name: "Messages",
        href: "/parent/messages",
        icon: MessageSquare,
        badge: "2",
      },
    ],
    quick: [
      {
        name: "Notifications",
        href: "/parent/notifications",
        icon: Bell,
      },
      {
        name: "Safety Center",
        href: "/parent/safety",
        icon: Shield,
      },
      {
        name: "Find Teachers",
        href: "/parent/find-teachers",
        icon: Globe,
      },
    ],
    tools: [
      {
        name: "Parental Controls",
        href: "/parent/controls",
        icon: Settings,
      },
      {
        name: "Learning Analytics",
        href: "/parent/analytics",
        icon: PieChart,
      },
      {
        name: "Communication Hub",
        href: "/parent/communication",
        icon: MessageSquare,
      },
    ],
  },

  [UserRole.ADMIN]: {
    main: [
      {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        name: "Applications",
        href: "/admin/applications",
        icon: FileText,
        badge: "12",
      },
      {
        name: "Users",
        href: "/admin/users",
        icon: Users,
        badge: null,
      },
      {
        name: "Testimonials",
        href: "/admin/testimonials",
        icon: Star,
        badge: null,
      },
      {
        name: "Courses",
        href: "/admin/courses",
        icon: BookOpen,
        badge: null,
      },
      {
        name: "Analytics",
        href: "/admin/analytics",
        icon: TrendingUp,
        badge: null,
      },
      {
        name: "Reports",
        href: "/admin/reports",
        icon: BarChart3,
        badge: null,
      },
      {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
        badge: null,
      },
      {
        name: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        badge: null,
      },
    ],
  },
};

export const ROLE_INFO: Record<UserRole, RoleInfo> = {
  [UserRole.INSTRUCTOR]: {
    title: "Instructor Portal",
    subtitle: "Teaching Dashboard",
    icon: GraduationCap,
    color: "bg-blue-600",
  },
  [UserRole.STUDENT]: {
    title: "Student Portal",
    subtitle: "Learning Dashboard",
    icon: BookOpen,
    color: "bg-green-600",
  },
  [UserRole.PARENT]: {
    title: "Parent Portal",
    subtitle: "Family Dashboard",
    icon: Heart,
    color: "bg-purple-600",
  },
  [UserRole.ADMIN]: {
    title: "Admin Portal",
    subtitle: "Management Dashboard",
    icon: LayoutDashboard,
    color: "bg-gray-600",
  },
};
