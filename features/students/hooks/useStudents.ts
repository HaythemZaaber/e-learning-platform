"use client";

import { useState, useEffect } from "react";
import type {
  Student,
  StudentFilters,
  StudentStats,
} from "../types/student.types";

// Mock enhanced data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar: "/placeholder.svg",
    initials: "SJ",
    status: "active",
    performance: "excellent",
    source: "course",
    progress: 85,
    totalCourses: 3,
    activeSessions: 2,
    certificates: 2,
    totalHours: 45,
    lastActive: "2 hours ago",
    joinDate: "2024-01-15",
    assignments: {
      submitted: 12,
      pending: 2,
      overdue: 0,
    },
    engagement: {
      level: "high",
      messagesExchanged: 34,
      sessionAttendance: 95,
      avgRating: 4.8,
    },
    financials: {
      totalSpent: 450,
      outstandingPayments: 0,
      subscriptionType: "Premium",
    },
    contact: {
      phone: "+1234567890",
      location: "New York, USA",
      timezone: "EST",
    },
    goals: ["Master React Development", "Build Portfolio Project"],
    notes: "Highly motivated student, asks great questions",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    avatar: "/placeholder.svg",
    initials: "MC",
    status: "active",
    performance: "good",
    source: "session",
    progress: 62,
    totalCourses: 1,
    activeSessions: 4,
    certificates: 1,
    totalHours: 28,
    lastActive: "1 day ago",
    joinDate: "2024-02-03",
    assignments: {
      submitted: 8,
      pending: 3,
      overdue: 1,
    },
    engagement: {
      level: "medium",
      messagesExchanged: 18,
      sessionAttendance: 78,
      avgRating: 4.5,
    },
    financials: {
      totalSpent: 320,
      outstandingPayments: 50,
      subscriptionType: "Basic",
    },
    contact: {
      phone: "+1987654321",
      location: "San Francisco, USA",
      timezone: "PST",
    },
    goals: ["Improve JavaScript Skills", "Learn Node.js"],
    notes: "Prefers hands-on learning, struggles with theory",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.w@email.com",
    avatar: "/placeholder.svg",
    initials: "EW",
    status: "inactive",
    performance: "needs-improvement",
    source: "both",
    progress: 23,
    totalCourses: 2,
    activeSessions: 0,
    certificates: 0,
    totalHours: 12,
    lastActive: "2 weeks ago",
    joinDate: "2024-01-28",
    assignments: {
      submitted: 3,
      pending: 5,
      overdue: 3,
    },
    engagement: {
      level: "low",
      messagesExchanged: 5,
      sessionAttendance: 45,
      avgRating: 3.2,
    },
    financials: {
      totalSpent: 180,
      outstandingPayments: 120,
      subscriptionType: "Basic",
    },
    contact: {
      phone: "+1555666777",
      location: "London, UK",
      timezone: "GMT",
    },
    goals: ["Complete First Course", "Improve Time Management"],
    notes: "Needs more support and encouragement",
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    email: "alex.r@email.com",
    avatar: "/placeholder.svg",
    initials: "AR",
    status: "active",
    performance: "good",
    source: "both",
    progress: 78,
    totalCourses: 2,
    activeSessions: 3,
    certificates: 1,
    totalHours: 35,
    lastActive: "4 hours ago",
    joinDate: "2024-01-20",
    assignments: {
      submitted: 10,
      pending: 1,
      overdue: 0,
    },
    engagement: {
      level: "high",
      messagesExchanged: 28,
      sessionAttendance: 88,
      avgRating: 4.6,
    },
    financials: {
      totalSpent: 380,
      outstandingPayments: 0,
      subscriptionType: "Premium",
    },
    contact: {
      phone: "+1777888999",
      location: "Austin, USA",
      timezone: "CST",
    },
    goals: ["Full-Stack Development", "Launch Side Project"],
    notes: "Consistent learner, good problem-solving skills",
  },
  {
    id: "5",
    name: "Lisa Zhang",
    email: "lisa.z@email.com",
    avatar: "/placeholder.svg",
    initials: "LZ",
    status: "active",
    performance: "excellent",
    source: "course",
    progress: 92,
    totalCourses: 4,
    activeSessions: 1,
    certificates: 3,
    totalHours: 58,
    lastActive: "1 hour ago",
    joinDate: "2023-12-05",
    assignments: {
      submitted: 18,
      pending: 1,
      overdue: 0,
    },
    engagement: {
      level: "high",
      messagesExchanged: 42,
      sessionAttendance: 92,
      avgRating: 4.9,
    },
    financials: {
      totalSpent: 680,
      outstandingPayments: 0,
      subscriptionType: "Premium",
    },
    contact: {
      phone: "+1333444555",
      location: "Seattle, USA",
      timezone: "PST",
    },
    goals: ["Senior Developer Role", "Mentor Others"],
    notes: "Outstanding student, helps other learners",
  },
];

const mockStats: StudentStats = {
  totalStudents: 247,
  courseStudents: 189,
  sessionStudents: 58,
  activeStudents: 198,
  newThisMonth: 34,
  averageProgress: 67,
  topPerformers: 23,
  needsAttention: 12,
  totalRevenue: 15420,
  averageRating: 4.7,
  completionRate: 78,
};

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StudentFilters>({
    search: "",
    status: "all",
    performance: "all",
    source: "all",
    engagement: "all",
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStudents = students.filter((student) => {
    const searchMatch =
      student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.email.toLowerCase().includes(filters.search.toLowerCase());
    const statusMatch =
      filters.status === "all" || student.status === filters.status;
    const performanceMatch =
      filters.performance === "all" ||
      student.performance === filters.performance;
    const sourceMatch =
      filters.source === "all" ||
      student.source === filters.source ||
      (filters.source === "course" &&
        (student.source === "course" || student.source === "both")) ||
      (filters.source === "session" &&
        (student.source === "session" || student.source === "both"));
    const engagementMatch =
      filters.engagement === "all" ||
      student.engagement.level === filters.engagement;

    return (
      searchMatch &&
      statusMatch &&
      performanceMatch &&
      sourceMatch &&
      engagementMatch
    );
  });

  const updateFilters = (newFilters: Partial<StudentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    students: filteredStudents,
    allStudents: students,
    stats,
    loading,
    filters,
    updateFilters,
  };
}
