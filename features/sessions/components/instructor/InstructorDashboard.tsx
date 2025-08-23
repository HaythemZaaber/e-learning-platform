"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Bell, 
  DollarSign, 
  Users, 
  TrendingUp,
  Plus,
  Zap,
  Target,
  Award,
  Star,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

// Import all the dashboard components
import { DashboardOverview } from "./DashboardOverview";
import { AvailabilitySetup } from "./AvailabilitySetup";
import { SessionOfferings } from "./SessionOfferings";
import { SessionsCalendar } from "./SessionsCalendar";
import { BookingRequests } from "./BookingRequests";
import { SessionAnalytics } from "./SessionAnalytics";
import { InstructorSettings } from "./InstructorSettings";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { NotificationCenter } from "./NotificationCenter";
import { QuickActions } from "./QuickActions";

// Import hooks
import { 
  useEnableLiveSessions, 
  useNotifications,
  useMarkAllNotificationsAsRead 
} from "@/features/sessions/hooks/useLiveSessions";

// Import types
import { 
  InstructorProfile, 
  SessionStats, 
  AIInsight,
  SessionNotification 
} from "@/features/sessions/types/session.types";

interface InstructorDashboardProps {
  user: any;
  instructorProfile?: InstructorProfile;
  sessionStats?: SessionStats;
  aiInsights?: AIInsight[];
  isProfileEnabled: boolean;
  isLoading: {
    profile: boolean;
    stats: boolean;
    insights: boolean;
  };
}

export function InstructorDashboard({
  user,
  instructorProfile,
  sessionStats,
  aiInsights,
  isProfileEnabled,
  isLoading,
}: InstructorDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Hooks
  const enableLiveSessions = useEnableLiveSessions();
  // const { data: notifications = [] } = useNotifications(user?.id || "");
  const markAllAsRead = useMarkAllNotificationsAsRead();

  // const unreadNotifications = notifications.filter(n => !n.isRead);

  // Handle enabling live sessions
  const handleEnableLiveSessions = async () => {
    try {
      await enableLiveSessions.mutateAsync(user.id);
      toast.success("Live sessions enabled successfully!");
    } catch (error) {
      toast.error("Failed to enable live sessions");
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync(user.id);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark notifications as read");
    }
  };

  // If live sessions are not enabled, show onboarding
  if (!isProfileEnabled) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Enable Live Sessions</h1>
              <p className="text-muted-foreground text-lg">
                Start offering live teaching sessions to students and grow your income.
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  What you'll get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Earn More</h4>
                      <p className="text-sm text-muted-foreground">
                        Set your own rates and earn from live sessions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Reach Students</h4>
                      <p className="text-sm text-muted-foreground">
                        Connect with students worldwide
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Flexible Schedule</h4>
                      <p className="text-sm text-muted-foreground">
                        Set your own availability and work when you want
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Build Reputation</h4>
                      <p className="text-sm text-muted-foreground">
                        Get reviews and build your teaching profile
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button 
                onClick={handleEnableLiveSessions}
                disabled={enableLiveSessions.isPending}
                size="lg"
                className="w-full"
              >
                {enableLiveSessions.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Enabling...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Enable Live Sessions
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                You can customize your settings after enabling live sessions
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6 justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Live Sessions Dashboard</h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Active
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Notification Bell */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotificationsOpen(true)}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {/* {unreadNotifications.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs animate-pulse"
                >
                  {unreadNotifications.length}
                </Badge>
              )} */}
            </Button>

            {/* Quick Actions */}
            <QuickActions user={user} />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 border-r bg-card p-6 hidden xl:block">
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading.stats ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : sessionStats ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {sessionStats.totalSessions}
                      </div>
                      <div className="text-xs text-blue-800">Total Sessions</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {sessionStats.pendingRequests}
                      </div>
                      <div className="text-xs text-orange-800">Pending Requests</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {sessionStats.upcomingSessions}
                      </div>
                      <div className="text-xs text-green-800">Upcoming</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        ${sessionStats.totalEarnings}
                      </div>
                      <div className="text-xs text-purple-800">Total Earned</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No stats available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Insights Preview */}
            {/* {aiInsights && aiInsights.length > 0 && (
              <AIInsightsPanel insights={aiInsights.slice(0, 2)} compact />
            )} */}

            {/* Recent Notifications */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Notifications</CardTitle>
                  {/* {unreadNotifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      disabled={markAllAsRead.isPending}
                    >
                      Mark all read
                    </Button>
                  )} */}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* {notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-2 rounded-lg ${
                        notification.isRead ? 'bg-muted/50' : 'bg-blue-50'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {notification.type.includes('booking') && (
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        )}
                        {notification.type.includes('session') && (
                          <Play className="h-4 w-4 text-green-600" />
                        )}
                        {notification.type.includes('payment') && (
                          <DollarSign className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))} */}
                  {/* {notifications.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No notifications
                    </div>
                  )} */}
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <div className="px-6 pt-4">
                <TabsList className="grid w-full grid-cols-7 max-w-4xl">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </TabsTrigger>
                  <TabsTrigger value="availability" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Availability
                  </TabsTrigger>
                  <TabsTrigger value="offerings" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Offerings
                  </TabsTrigger>
                  <TabsTrigger value="requests" className="relative flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Requests
                    {sessionStats?.pendingRequests && sessionStats.pendingRequests > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                        {sessionStats.pendingRequests}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="overview" className="h-full p-6 mt-0">
                <DashboardOverview
                  user={user}
                  instructorProfile={instructorProfile}
                  sessionStats={sessionStats}
                  // aiInsights={aiInsights}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="calendar" className="h-full p-6 mt-0">
                <SessionsCalendar user={user} />
              </TabsContent>

              <TabsContent value="availability" className="h-full p-6 mt-0 overflow-y-auto">
                <AvailabilitySetup />
              </TabsContent>

              <TabsContent value="offerings" className="h-full p-6 mt-0 overflow-y-auto">
                <SessionOfferings />
              </TabsContent>

              <TabsContent value="requests" className="h-full p-6 mt-0 overflow-y-auto">
                <BookingRequests user={user} />
              </TabsContent>

              <TabsContent value="analytics" className="h-full p-6 mt-0 overflow-y-auto">
                <SessionAnalytics user={user} />
              </TabsContent>

              <TabsContent value="settings" className="h-full p-6 mt-0 overflow-y-auto">
                <InstructorSettings user={user} instructorProfile={instructorProfile} />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>

      {/* Notification Center Modal */}
      {/* <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
      /> */}
    </div>
  );
}
