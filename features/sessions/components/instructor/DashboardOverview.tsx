"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar, 
  Clock, 
  Star, 
  MessageSquare,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Target,
  Award,
  Zap,
  ArrowRight,
  Eye,
  CalendarDays,
  Clock3,
  DollarSign as DollarIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { 
  InstructorProfile, 
  SessionStats, 
  AIInsight,
  LiveSession,
  SessionNotification,
  InsightType
} from "@/features/sessions/types/session.types";

interface DashboardOverviewProps {
  user: any;
  instructorProfile?: InstructorProfile;
  sessionStats?: SessionStats;
  aiInsights?: AIInsight[];
  isLoading: {
    profile: boolean;
    stats: boolean;
    insights: boolean;
  };
}

// Mock data for charts
const weeklyData = [
  { day: "Mon", sessions: 4, earnings: 120, bookings: 6 },
  { day: "Tue", sessions: 6, earnings: 180, bookings: 8 },
  { day: "Wed", sessions: 3, earnings: 90, bookings: 4 },
  { day: "Thu", sessions: 7, earnings: 210, bookings: 9 },
  { day: "Fri", sessions: 5, earnings: 150, bookings: 7 },
  { day: "Sat", sessions: 8, earnings: 240, bookings: 10 },
  { day: "Sun", sessions: 2, earnings: 60, bookings: 3 },
];

const sessionTypeData = [
  { name: "Individual", value: 45, color: "#3B82F6" },
  { name: "Group", value: 30, color: "#10B981" },
  { name: "Workshop", value: 15, color: "#F59E0B" },
  { name: "Masterclass", value: 10, color: "#8B5CF6" },
];

const recentSessions = [
  {
    id: "1",
    title: "Advanced JavaScript Concepts",
    student: "Sarah Johnson",
    date: "2024-01-15T10:00:00Z",
    duration: 60,
    status: "completed",
    rating: 5,
    earnings: 75
  },
  {
    id: "2",
    title: "React Hooks Deep Dive",
    student: "Mike Chen",
    date: "2024-01-15T14:00:00Z",
    duration: 90,
    status: "upcoming",
    rating: null,
    earnings: 112.5
  },
  {
    id: "3",
    title: "TypeScript Fundamentals",
    student: "Emma Davis",
    date: "2024-01-14T16:00:00Z",
    duration: 60,
    status: "completed",
    rating: 4,
    earnings: 60
  }
];

export function DashboardOverview({
  user,
  instructorProfile,
  sessionStats,
  aiInsights,
  isLoading,
}: DashboardOverviewProps) {
  const [timeRange, setTimeRange] = useState("week");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "upcoming":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case "upcoming":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading.stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessionStats?.totalSessions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${sessionStats?.totalEarnings || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {instructorProfile?.teachingRating || 0}/5
            </div>
            <p className="text-xs text-muted-foreground">
              {sessionStats?.totalStudents || 0} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessionStats?.pendingRequests || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Weekly Activity</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={timeRange === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("week")}
                >
                  Week
                </Button>
                <Button
                  variant={timeRange === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("month")}
                >
                  Month
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Sessions"
                />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Earnings ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Session Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Session Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sessionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sessionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {aiInsights && aiInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiInsights.slice(0, 3).map((insight, index) => (
                <div
                  key={insight.id}
                  className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {insight.type === InsightType.PERFORMANCE_ANALYSIS && (
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      )}
                      {insight.type === InsightType.DEMAND_PREDICTION && (
                        <Target className="h-5 w-5 text-green-600" />
                      )}
                      {insight.type === InsightType.SCHEDULE_OPTIMIZATION && (
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {insight.description}
                      </p>
                      {insight.action && (
                        <Button size="sm" variant="outline" className="text-xs">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Sessions</CardTitle>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.student}`} />
                    <AvatarFallback>{session.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-muted-foreground">{session.student}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock3 className="h-3 w-3" />
                        {session.duration}min
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarIcon className="h-3 w-3" />
                        ${session.earnings}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {session.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{session.rating}</span>
                    </div>
                  )}
                  {getStatusBadge(session.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Set Availability</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Play className="h-6 w-6" />
              <span className="text-sm">Start Session</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">View Requests</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
