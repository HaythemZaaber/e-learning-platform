"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  Award,
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  MessageSquare,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Video,
  FileText,
  DollarSign,
  Star,
  Phone,
  MapPin,
  GraduationCap,
  Target,
  TrendingDown,
  Activity,
  Bell,
  Send,
  Grid,
  List,
} from "lucide-react";
import { useStudents } from "../hooks/useStudents";
import type { Student } from "../types/student.types";

export default function StudentManagement() {
  const { students, stats, loading, filters, updateFilters } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPerformanceColor = (performance: string) => {
    const colors = {
      excellent: "bg-green-100 text-green-800",
      good: "bg-blue-100 text-blue-800",
      average: "bg-yellow-100 text-yellow-800",
      "needs-improvement": "bg-red-100 text-red-800",
    };
    return (
      colors[performance as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getSourceIcon = (source: string) => {
    const icons = {
      course: <BookOpen className="h-4 w-4" />,
      session: <Video className="h-4 w-4" />,
      both: <GraduationCap className="h-4 w-4" />,
    };
    return icons[source as keyof typeof icons] || <Users className="h-4 w-4" />;
  };

  const getEngagementColor = (level: string) => {
    const colors = {
      high: "text-green-600",
      medium: "text-yellow-600",
      low: "text-red-600",
    };
    return colors[level as keyof typeof colors] || "text-gray-600";
  };

  const StudentDetailModal = ({
    student,
    isOpen,
    onClose,
  }: {
    student: Student | null;
    isOpen: boolean;
    onClose: () => void;
  }) => {
    if (!student) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{student.name}</h2>
                <p className="text-sm text-muted-foreground">{student.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 mt-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {student.progress}%
                  </div>
                  <div className="text-xs text-muted-foreground">Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {student.totalHours}h
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Hours
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {student.engagement.avgRating}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg Rating
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${student.financials.totalSpent}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Spent
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{student.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {student.contact.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {student.contact.timezone}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Learning Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {student.goals.map((goal, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{goal}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Notes & Observations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {student.notes}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Assignments Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-green-600">
                          {student.assignments.submitted}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Submitted
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-yellow-600">
                          {student.assignments.pending}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Pending
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-red-600">
                          {student.assignments.overdue}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Overdue
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sessions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Session Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Attendance Rate</span>
                        <span className="text-sm font-semibold">
                          {student.engagement.sessionAttendance}%
                        </span>
                      </div>
                      <Progress
                        value={student.engagement.sessionAttendance}
                        className="h-2"
                      />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm">Active Sessions</span>
                        <span className="text-sm font-semibold">
                          {student.activeSessions}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Overall Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">
                            {student.engagement.avgRating}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Certificates Earned</span>
                        <span className="text-sm font-semibold">
                          {student.certificates}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Engagement Level</span>
                        <Badge
                          className={getEngagementColor(
                            student.engagement.level
                          )}
                        >
                          {student.engagement.level}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Financial Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Spent</span>
                        <span className="text-sm font-semibold">
                          ${student.financials.totalSpent}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Outstanding</span>
                        <span
                          className={`text-sm font-semibold ${
                            student.financials.outstandingPayments > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          ${student.financials.outstandingPayments}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Subscription</span>
                        <Badge variant="outline">
                          {student.financials.subscriptionType}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="communication" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Communication History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Messages Exchanged</span>
                        <span className="text-sm font-semibold">
                          {student.engagement.messagesExchanged}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Last Contact</span>
                        <span className="text-sm font-semibold">
                          {student.lastActive}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Schedule Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Student Management
        </h1>
        <p className="text-muted-foreground">
          Comprehensive management of all your students across courses and
          sessions
        </p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {[
          {
            title: "Total Students",
            value: stats?.totalStudents,
            icon: Users,
            desc: "All sources combined",
          },
          {
            title: "Course Students",
            value: stats?.courseStudents,
            icon: BookOpen,
            desc: "Enrolled in courses",
          },
          {
            title: "Session Students",
            value: stats?.sessionStudents,
            icon: Video,
            desc: "Active in sessions",
          },
          {
            title: "Revenue",
            value: `$${stats?.totalRevenue}`,
            icon: DollarSign,
            desc: "Total earnings",
          },
          {
            title: "Avg Rating",
            value: stats?.averageRating,
            icon: Star,
            desc: "Student feedback",
          },
          {
            title: "Need Attention",
            value: stats?.needsAttention,
            icon: AlertTriangle,
            desc: "Require support",
          },
        ].map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name or email..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full lg:w-80"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filters.source}
                onValueChange={(value) =>
                  updateFilters({ source: value as any })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="course">Courses Only</SelectItem>
                  <SelectItem value="session">Sessions Only</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  updateFilters({ status: value as any })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.engagement}
                onValueChange={(value) =>
                  updateFilters({ engagement: value as any })
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Engagement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Engagement</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="ml-2"
              >
                {viewMode === "grid" ? (
                  <>
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </>
                ) : (
                  <>
                    <Grid className="h-4 w-4 mr-2" />
                    Grid View
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {students.map((student) => (
                <Card
                  key={student.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={student.avatar}
                            alt={student.name}
                          />
                          <AvatarFallback>{student.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h5 className="font-semibold">{student.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {getSourceIcon(student.source)}
                            <span className="text-xs text-muted-foreground capitalize">
                              {student.source}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Schedule Call
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Student
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bell className="mr-2 h-4 w-4" />
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                      <Badge
                        className={getPerformanceColor(student.performance)}
                      >
                        {student.performance}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{student.totalCourses} courses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span>{student.activeSessions} sessions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>{student.certificates} certs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{student.totalHours}h total</span>
                      </div>
                    </div>

                    {/* Engagement Indicator */}
                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Engagement</span>
                      <div className="flex items-center gap-2">
                        <Activity
                          className={`h-4 w-4 ${getEngagementColor(
                            student.engagement.level
                          )}`}
                        />
                        <span
                          className={`capitalize font-medium ${getEngagementColor(
                            student.engagement.level
                          )}`}
                        >
                          {student.engagement.level}
                        </span>
                      </div>
                    </div>

                    {/* Financial Status */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Spent</span>
                      <span className="font-medium">
                        ${student.financials.totalSpent}
                      </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Send className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>

                    {/* Alert for students needing attention */}
                    {(student.assignments.overdue > 0 ||
                      student.engagement.level === "low" ||
                      student.financials.outstandingPayments > 0) && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-800">Needs attention</span>
                      </div>
                    )}

                    {/* Last Activity */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>Last active: {student.lastActive}</span>
                      <span>
                        Joined:{" "}
                        {new Date(student.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <Card
                  key={student.id}
                  className="hover:shadow-md transition-shadow cursor-pointer py-4 px-2"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={student.avatar}
                            alt={student.name}
                          />
                          <AvatarFallback>{student.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h5 className="font-semibold">{student.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(student.status)}>
                            {student.status}
                          </Badge>
                          <Badge
                            className={getPerformanceColor(student.performance)}
                          >
                            {student.performance}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" />
                              Schedule Call
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bell className="mr-2 h-4 w-4" />
                              Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Progress
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={student.progress}
                            className="h-2 w-full"
                          />
                          <span className="text-sm font-medium">
                            {student.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Engagement
                        </p>
                        <div className="flex items-center gap-2">
                          <Activity
                            className={`h-4 w-4 ${getEngagementColor(
                              student.engagement.level
                            )}`}
                          />
                          <span
                            className={`text-sm font-medium capitalize ${getEngagementColor(
                              student.engagement.level
                            )}`}
                          >
                            {student.engagement.level}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Courses</p>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {student.totalCourses}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Total Spent
                        </p>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            ${student.financials.totalSpent}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Alert for students needing attention */}
                    {(student.assignments.overdue > 0 ||
                      student.engagement.level === "low" ||
                      student.financials.outstandingPayments > 0) && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm mt-3">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-800">Needs attention</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {students.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No students found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
