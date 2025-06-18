export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  status: "active" | "inactive" | "suspended";
  performance: "excellent" | "good" | "average" | "needs-improvement";
  source: "course" | "session" | "both";
  progress: number;
  totalCourses: number;
  activeSessions: number;
  certificates: number;
  totalHours: number;
  lastActive: string;
  joinDate: string;
  assignments: {
    submitted: number;
    pending: number;
    overdue: number;
  };
  engagement: {
    level: "high" | "medium" | "low";
    messagesExchanged: number;
    sessionAttendance: number;
    avgRating: number;
  };
  financials: {
    totalSpent: number;
    outstandingPayments: number;
    subscriptionType: string;
  };
  contact: {
    phone: string;
    location: string;
    timezone: string;
  };
  goals: string[];
  notes: string;
}

export interface StudentFilters {
  search: string;
  status: "all" | "active" | "inactive" | "suspended";
  performance: "all" | "excellent" | "good" | "average" | "needs-improvement";
  source: "all" | "course" | "session" | "both";
  engagement: "all" | "high" | "medium" | "low";
}

export interface StudentStats {
  totalStudents: number;
  courseStudents: number;
  sessionStudents: number;
  activeStudents: number;
  newThisMonth: number;
  averageProgress: number;
  topPerformers: number;
  needsAttention: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
}
