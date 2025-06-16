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
} from "lucide-react";

import {
  UserRole,
  NavigationSection,
  RoleInfo,
} from "../types/dashboard.types";

export const ROLE_NAVIGATION: Record<UserRole, NavigationSection> = {
  teacher: {
    main: [
      {
        name: "Overview",
        href: "/instructor/dashboard/overview",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        name: "My Courses",
        href: "/instructor/dashboard/courses",
        icon: BookOpen,
        badge: null,
      },
      {
        name: "Students",
        href: "/instructor/students",
        icon: Users,
        badge: "12",
      },
      {
        name: "Live Sessions",
        href: "/instructor/sessions",
        icon: Video,
        badge: null,
      },
      {
        name: "Content Studio",
        href: "/instructor/content",
        icon: FileText,
        badge: "New",
      },
      {
        name: "Analytics",
        href: "/instructor/analytics",
        icon: TrendingUp,
        badge: null,
      },
      {
        name: "Earnings",
        href: "/instructor/earnings",
        icon: Wallet,
        badge: null,
      },
      {
        name: "Messages",
        href: "/instructor/messages",
        icon: MessageSquare,
        badge: "3",
      },
    ],
    quick: [
      {
        name: "Schedule",
        href: "/instructor/schedule",
        icon: Calendar,
      },
      {
        name: "Reviews",
        href: "/instructor/reviews",
        icon: Star,
      },
      {
        name: "Resources",
        href: "/instructor/resources",
        icon: Bookmark,
      },
    ],
    tools: [
      {
        name: "AI Assistant",
        href: "/instructor/ai-assistant",
        icon: Zap,
        badge: "Beta",
      },
      {
        name: "Course Builder",
        href: "/instructor/course-builder",
        icon: Target,
      },
      {
        name: "Assessment Tools",
        href: "/instructor/assessments",
        icon: Award,
      },
    ],
  },

  student: {
    main: [
      {
        name: "Dashboard",
        href: "/student/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        name: "My Courses",
        href: "/student/courses",
        icon: BookOpen,
        badge: "5",
      },
      {
        name: "Schedule",
        href: "/student/schedule",
        icon: Calendar,
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
    ],
    quick: [
      {
        name: "Favorites",
        href: "/student/favorites",
        icon: Heart,
      },
      {
        name: "Certificates",
        href: "/student/certificates",
        icon: Award,
      },
      {
        name: "Study Groups",
        href: "/student/groups",
        icon: Users,
      },
    ],
    tools: [
      {
        name: "Study Planner",
        href: "/student/planner",
        icon: Target,
        badge: "New",
      },
      {
        name: "AI Tutor",
        href: "/student/ai-tutor",
        icon: Zap,
      },
      {
        name: "Practice Tests",
        href: "/student/practice",
        icon: Shield,
      },
    ],
  },

  parent: {
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

  admin: {
    main: [],
    quick: [],
    tools: [],
  },
};

export const ROLE_INFO: Record<UserRole, RoleInfo> = {
  teacher: {
    title: "Instructor Portal",
    subtitle: "Teaching Dashboard",
    icon: GraduationCap,
    color: "bg-blue-600",
  },
  student: {
    title: "Student Portal",
    subtitle: "Learning Dashboard",
    icon: BookOpen,
    color: "bg-green-600",
  },
  parent: {
    title: "Parent Portal",
    subtitle: "Family Dashboard",
    icon: Heart,
    color: "bg-purple-600",
  },
  admin: {
    title: "Admin Portal",
    subtitle: "Management Dashboard",
    icon: LayoutDashboard,
    color: "bg-gray-600",
  },
};
