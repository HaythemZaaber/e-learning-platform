import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Video,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  X,
  Edit,
  Eye,
  UserPlus,
  BarChart3,
  ExternalLink,
  RefreshCw,
  SortAsc,
  SortDesc,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Timer,
  Star,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import {
  format,
  isToday,
  isTomorrow,
  isPast,
  isFuture,
  differenceInMinutes,
  parseISO,
} from "date-fns";

// Import existing components
import { LiveSessionCard } from "./LiveSessionCard";
import { DashboardOverview } from "./DashboardOverview";
import { SessionOfferings } from "./SessionOfferings";
import { BookingManagement } from "./BookingManagement";
import { SessionsCalendar } from "./SessionsCalendar";
import { AvailabilitySetup } from "./AvailabilitySetup";
import { SessionAnalytics } from "./SessionAnalytics";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { NotificationCenter } from "./NotificationCenter";
import { InstructorSettings } from "./InstructorSettings";

// Import hooks
import {
  useInstructorLiveSessions,
  useSessionStats,
  useInstructorProfile,
  useAIInsights,
  useStartLiveSession,
  useEndLiveSession,
  useCancelLiveSession,
  useUpdateLiveSession,
} from "../../hooks/useLiveSessions";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  SessionStatus,
  LiveSessionType,
  SessionFormat,
} from "../../types/session.types";

// Valid tab values
const VALID_TABS = [
  "overview",
  "sessions",
  "offerings",
  "bookings",
  "calendar",
  "availability",
  "analytics",
  "settings",
];

// Main dashboard component
export default function InstructorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize tab from URL or default to 'overview'
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Sync tab from URL on mount and when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else {
      // If no valid tab in URL, default to overview
      setActiveTab("overview");
    }
  }, [searchParams]);

  // Update URL when tab changes (user interaction)
  const handleTabChange = (value: string) => {
    if (value === activeTab) return; // Prevent unnecessary updates

    setActiveTab(value);
    // Update URL without page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Fetch data using hooks
  const {
    data: sessions,
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useInstructorLiveSessions(user?.id || "");
  const { data: stats, isLoading: statsLoading } = useSessionStats(user?.id);
  const { data: profile, isLoading: profileLoading } = useInstructorProfile(
    user?.id || ""
  );
  const { data: insights, isLoading: insightsLoading } = useAIInsights(
    user?.id || ""
  );

  // Session action mutations
  const startSessionMutation = useStartLiveSession();
  const endSessionMutation = useEndLiveSession();
  const cancelSessionMutation = useCancelLiveSession();
  const updateSessionMutation = useUpdateLiveSession();

  // Handle session actions
  const handleSessionAction = async (action: string, sessionId: string) => {
    setIsLoading(true);

    try {
      switch (action) {
        case "start":
          // Start session on backend
          const result = await startSessionMutation.mutateAsync({
            id: sessionId,
          });

          // Navigate to video call (assuming success if no error thrown)
          router.push(`/sessions/${sessionId}/video-call`);
          break;

        case "end":
          await endSessionMutation.mutateAsync({ id: sessionId });
          break;

        case "cancel":
          await cancelSessionMutation.mutateAsync({ id: sessionId });
          break;

        case "join":
          // Direct join for already started sessions
          router.push(`/sessions/${sessionId}/video-call`);
          break;
      }
    } catch (error) {
      console.error("Session action error:", error);
      toast.error("Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await refetchSessions();
  };

  // Group sessions by status
  const sessionsByStatus = useMemo(() => {
    if (!sessions)
      return { scheduled: [], inProgress: [], completed: [], cancelled: [] };

    const grouped = {
      scheduled: [] as any[],
      inProgress: [] as any[],
      completed: [] as any[],
      cancelled: [] as any[],
    };

    sessions.forEach((session) => {
      switch (session.status) {
        case SessionStatus.SCHEDULED:
        case SessionStatus.CONFIRMED:
          grouped.scheduled.push(session);
          break;
        case SessionStatus.IN_PROGRESS:
          grouped.inProgress.push(session);
          break;
        case SessionStatus.COMPLETED:
          grouped.completed.push(session);
          break;
        case SessionStatus.CANCELLED:
          grouped.cancelled.push(session);
          break;
      }
    });

    return grouped;
  }, [sessions]);

  const isLoadingData =
    sessionsLoading || statsLoading || profileLoading || insightsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Sessions Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your live teaching sessions and track performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="offerings">Offerings</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <DashboardOverview
            user={user}
            instructorProfile={profile}
            sessionStats={stats}
            aiInsights={insights}
            isLoading={{
              profile: profileLoading,
              stats: statsLoading,
              insights: insightsLoading,
            }}
          />
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <div className="space-y-6">
            {/* Live Sessions */}
            {sessionsByStatus.inProgress.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-500" />
                  Live Sessions ({sessionsByStatus.inProgress.length})
                </h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  {sessionsByStatus.inProgress.map((session) => (
                    <LiveSessionCard
                      key={session.id}
                      session={session}
                      onStart={() => handleSessionAction("start", session.id)}
                      onEnd={() => handleSessionAction("end", session.id)}
                      onCancel={() => handleSessionAction("cancel", session.id)}
                      onEdit={() => handleSessionAction("edit", session.id)}
                      onManageParticipants={() =>
                        handleSessionAction("participants", session.id)
                      }
                      onViewDetails={() =>
                        handleSessionAction("details", session.id)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Sessions */}
            {sessionsByStatus.scheduled.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Sessions ({sessionsByStatus.scheduled.length})
                </h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  {sessionsByStatus.scheduled.map((session) => (
                    <LiveSessionCard
                      key={session.id}
                      session={session}
                      onStart={() => handleSessionAction("start", session.id)}
                      onEnd={() => handleSessionAction("end", session.id)}
                      onCancel={() => handleSessionAction("cancel", session.id)}
                      onEdit={() => handleSessionAction("edit", session.id)}
                      onManageParticipants={() =>
                        handleSessionAction("participants", session.id)
                      }
                      onViewDetails={() =>
                        handleSessionAction("details", session.id)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Sessions */}
            {sessionsByStatus.completed.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Recent Completed Sessions ({sessionsByStatus.completed.length}
                  )
                </h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  {sessionsByStatus.completed.slice(0, 6).map((session) => (
                    <LiveSessionCard
                      key={session.id}
                      session={session}
                      onViewDetails={() =>
                        handleSessionAction("details", session.id)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoadingData &&
              sessionsByStatus.scheduled.length === 0 &&
              sessionsByStatus.inProgress.length === 0 &&
              sessionsByStatus.completed.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No sessions yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first session offering to start accepting
                      bookings
                    </p>
                    <Button onClick={() => handleTabChange("offerings")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Session Offering
                    </Button>
                  </CardContent>
                </Card>
              )}
          </div>
        </TabsContent>

        {/* Offerings Tab */}
        <TabsContent value="offerings" className="space-y-6">
          <SessionOfferings />
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <BookingManagement instructorId={user?.id || ""} />
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <SessionsCalendar user={user} />
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <AvailabilitySetup />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <SessionAnalytics user={user} />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <InstructorSettings user={user} instructorProfile={profile} />
        </TabsContent>
      </Tabs>

      {/* AI Insights Panel */}
      {insights && insights.length > 0 && (
        <AIInsightsPanel insights={insights} />
      )}

      {/* Notification Center - This would typically be a modal or sidebar */}
      {/* <NotificationCenter isOpen={false} onClose={() => {}} notifications={[]} onMarkAllAsRead={() => {}} /> */}
    </div>
  );
}
