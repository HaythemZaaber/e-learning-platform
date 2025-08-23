"use client";

import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Star,
  Bell,
  Settings,
  User,
  Bookmark,
  History,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

import { 
  useStudentProfile, 
  useStudentBookings, 
  useStudentSessions,
  useStudentStats 
} from "@/features/sessions/hooks/useLiveSessions";
import { 
  StudentProfile, 
  BookingRequest, 
  LiveSession, 
  SessionOffering,
  SessionType,
  SessionFormat,
  SessionStatus,
  BookingStatus
} from "@/features/sessions/types/session.types";

import { BrowseSessions } from "./BrowseSessions";
import { MyBookings } from "./MyBookings";
import { UpcomingSessions } from "./UpcomingSessions";
import { LearningHistory } from "./LearningHistory";
import { StudentStats } from "./StudentStats";
import { NotificationCenter } from "../instructor/NotificationCenter";

interface StudentDashboardProps {
  user: any;
  studentProfile?: StudentProfile;
}

export function StudentDashboard({ user, studentProfile }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("browse");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Fetch student data
  const { data: bookings = [], isLoading: bookingsLoading } = useStudentBookings(user?.id || "");
  const { data: sessions = [], isLoading: sessionsLoading } = useStudentSessions(user?.id || "");
  const { data: stats, isLoading: statsLoading } = useStudentStats(user?.id || "");

  const upcomingSessions = sessions.filter(session => 
    session.status === SessionStatus.SCHEDULED || session.status === SessionStatus.CONFIRMED
  );

  const completedSessions = sessions.filter(session => 
    session.status === SessionStatus.COMPLETED
  );

  const pendingBookings = bookings.filter(booking => 
    booking.status === BookingStatus.PENDING
  );

  const isLoading = bookingsLoading || sessionsLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Live Sessions</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Student Dashboard
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{upcomingSessions.length} Upcoming</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{pendingBookings.length} Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{completedSessions.length} Completed</span>
                </div>
              </div>

              {/* Notification Bell */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNotificationOpen(true)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {stats?.unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {stats.unreadNotifications}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "S"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Student Stats Card */}
              <StudentStats stats={stats} />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("browse")}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Browse Sessions
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("bookings")}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    My Bookings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("upcoming")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Upcoming Sessions
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("history")}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Learning History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="browse" className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Browse</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center space-x-2">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Upcoming</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center space-x-2">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="browse" className="space-y-6">
                <BrowseSessions user={user} />
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6">
                <MyBookings user={user} bookings={bookings} />
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-6">
                <UpcomingSessions user={user} sessions={upcomingSessions} />
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <LearningHistory user={user} sessions={completedSessions} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={[]} // TODO: Fetch student notifications
        onMarkAllAsRead={() => {}}
      />
    </div>
  );
}
