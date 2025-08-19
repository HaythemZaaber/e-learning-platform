"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  TrendingUp,
  Calendar,
  MessageSquare,
  Award,
  Clock,
  Activity,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  Star,
  GraduationCap,
  FileText,
  Bell,
  Settings,
  AlertTriangle,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useApolloClient } from "@apollo/client";
import { GET_INSTRUCTOR_VERIFICATION } from "@/features/becomeInstructor/verification/graphql/instructor-application";

// Mock data - replace with real data from your API
const mockData = {
  stats: {
    totalCourses: 5,
    completedCourses: 2,
    inProgressCourses: 3,
    totalHours: 24,
    averageGrade: 85,
    upcomingSessions: 3,
    unreadMessages: 2,
    pendingAssignments: 2,
  },
  recentCourses: [
    {
      id: 1,
      title: "Advanced JavaScript",
      instructor: "Sarah Johnson",
      progress: 75,
      nextLesson: "Async/Await Patterns",
      lastAccessed: "2 hours ago",
    },
    {
      id: 2,
      title: "React Fundamentals",
      instructor: "Mike Chen",
      progress: 45,
      nextLesson: "State Management",
      lastAccessed: "1 day ago",
    },
    {
      id: 3,
      title: "UI/UX Design",
      instructor: "Emily Davis",
      progress: 90,
      nextLesson: "Final Project",
      lastAccessed: "3 days ago",
    },
  ],
  upcomingSessions: [
    {
      id: 1,
      title: "JavaScript Q&A Session",
      instructor: "Sarah Johnson",
      time: "Today, 2:00 PM",
      duration: "1 hour",
      type: "Live Session",
    },
    {
      id: 2,
      title: "React Code Review",
      instructor: "Mike Chen",
      time: "Tomorrow, 10:00 AM",
      duration: "45 minutes",
      type: "1-on-1",
    },
  ],
  recentAssignments: [
    {
      id: 1,
      title: "Build a Todo App",
      course: "React Fundamentals",
      dueDate: "Tomorrow",
      status: "In Progress",
    },
    {
      id: 2,
      title: "JavaScript Algorithms",
      course: "Advanced JavaScript",
      dueDate: "Next Week",
      status: "Not Started",
    },
  ],
};

export default function StudentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const client = useApolloClient();
  const [applicationStatus, setApplicationStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check application status
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!authLoading && isAuthenticated && user?.id) {
        setLoadingStatus(true);
        try {
          const { data } = await client.query({
            query: GET_INSTRUCTOR_VERIFICATION,
            variables: { userId: user.id },
            fetchPolicy: 'network-only',
          });

          if (data?.getInstructorVerification?.success && data?.getInstructorVerification?.data) {
            setApplicationStatus(data.getInstructorVerification.data);
          }
        } catch (error) {
          console.error('Error checking application status:', error);
        } finally {
          setLoadingStatus(false);
        }
      }
    };

    checkApplicationStatus();
  }, [user?.id, authLoading, isAuthenticated, client]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your learning overview for{" "}
          {currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Application Status Alert */}
      {applicationStatus && applicationStatus.status === 'REQUIRES_MORE_INFO' && applicationStatus.manualReview && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Application Update Required</h4>
                <p className="text-sm mb-2">{applicationStatus.manualReview.decisionReason}</p>
                {applicationStatus.manualReview.conditionalRequirements && applicationStatus.manualReview.conditionalRequirements.length > 0 && (
                  <div className="text-xs">
                    <strong>Required:</strong> {applicationStatus.manualReview.conditionalRequirements.join(', ')}
                  </div>
                )}
              </div>
              <Link href="/become-instructor/verification">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Application
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {mockData.stats.completedCourses} completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.averageGrade}%</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Courses */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Recent Courses
              </CardTitle>
              <Link href="/student/my-courses">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {course.title.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-500">
                        {course.instructor} • {course.lastAccessed}
                      </p>
                      <div className="flex items-center mt-1">
                        <Progress value={course.progress} className="w-20 h-2 mr-2" />
                        <span className="text-xs text-gray-500">{course.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Next: {course.nextLesson}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Upcoming Sessions
              </CardTitle>
              <Link href="/student/schedule">
                <Button variant="ghost" size="sm">
                  View Schedule
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-green-600 font-medium">
                      {session.time.split(',')[1]?.trim().split(' ')[0] || 'TODAY'}
                    </span>
                    <span className="text-sm font-bold text-green-700">
                      {session.time.split(',')[1]?.trim().split(' ')[1] || 'NOW'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{session.title}</h4>
                    <p className="text-sm text-gray-500">
                      {session.instructor} • {session.duration}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {session.type}
                    </Badge>
                  </div>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments and Quick Actions */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Assignments */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-orange-600" />
                Recent Assignments
              </CardTitle>
              <Link href="/student/assignments">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.recentAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-500">{assignment.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Due: {assignment.dueDate}</p>
                    <Badge
                      variant={assignment.status === "In Progress" ? "default" : "secondary"}
                      className="text-xs mt-1"
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/student/application-status">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">Application Status</span>
                </Button>
              </Link>
              <Link href="/student/messages">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                  <span className="text-sm">Messages</span>
                  {mockData.stats.unreadMessages > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {mockData.stats.unreadMessages}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/student/progress">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <span className="text-sm">Progress Report</span>
                </Button>
              </Link>
              <Link href="/student/schedule">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Schedule</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

