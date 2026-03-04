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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Video,
  Plus,
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
  Edit,
  AlertTriangle,
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
  useRescheduleLiveSession,
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
  const rescheduleSessionMutation = useRescheduleLiveSession();

  // Modal state for session configuration
  const [sessionForEdit, setSessionForEdit] = useState<any>(null);
  const [sessionForCancel, setSessionForCancel] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Handle session actions
  const handleSessionAction = async (action: string, sessionId: string, session?: any) => {
    if (action === "edit") {
      setSessionForEdit(session || sessions?.find((s) => s.id === sessionId));
      return;
    }
    if (action === "cancel") {
      setSessionForCancel(session || sessions?.find((s) => s.id === sessionId));
      setCancelReason("");
      return;
    }
    if (action === "details") {
      router.push(`/instructor/sessions/${sessionId}`);
      return;
    }

    setIsLoading(true);
    try {
      switch (action) {
        case "start":
          await startSessionMutation.mutateAsync({ id: sessionId });
          router.push(`/sessions/${sessionId}/video-call?role=instructor`);
          break;

        case "end":
          await endSessionMutation.mutateAsync({ id: sessionId });
          refetchSessions();
          break;

        case "join":
          router.push(`/sessions/${sessionId}/video-call?role=instructor`);
          break;
      }
    } catch (error) {
      console.error("Session action error:", error);
      toast.error("Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!sessionForCancel) return;
    setIsLoading(true);
    try {
      await cancelSessionMutation.mutateAsync({
        id: sessionForCancel.id,
        cancelData: { reason: cancelReason },
      });
      setSessionForCancel(null);
      setCancelReason("");
      refetchSessions();
    } catch (error) {
      toast.error("Failed to cancel session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditConfirm = async (updates: { title?: string; description?: string; scheduledStart?: Date; scheduledEnd?: Date }) => {
    if (!sessionForEdit) return;
    setIsLoading(true);
    try {
      await updateSessionMutation.mutateAsync({
        id: sessionForEdit.id,
        updates,
      });
      setSessionForEdit(null);
      refetchSessions();
    } catch (error) {
      toast.error("Failed to update session");
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
                      onCancel={() => handleSessionAction("cancel", session.id, session)}
                      onEdit={() => handleSessionAction("edit", session.id, session)}
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
                      onCancel={() => handleSessionAction("cancel", session.id, session)}
                      onEdit={() => handleSessionAction("edit", session.id, session)}
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

      {/* Cancel Session Modal */}
      <Dialog open={!!sessionForCancel} onOpenChange={() => setSessionForCancel(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Cancel Session
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel &quot;{sessionForCancel?.title}&quot;? Participants will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Reason (optional)</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Let participants know why..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionForCancel(null)}>
              Keep Session
            </Button>
            <Button variant="destructive" onClick={handleCancelConfirm} disabled={isLoading}>
              {isLoading ? "Cancelling..." : "Cancel Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Session Modal */}
      <Dialog open={!!sessionForEdit} onOpenChange={() => setSessionForEdit(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Session
            </DialogTitle>
            <DialogDescription>
              Update session details. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          {sessionForEdit && (
            <SessionEditForm
              session={sessionForEdit}
              onSave={handleEditConfirm}
              onCancel={() => setSessionForEdit(null)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SessionEditForm({
  session,
  onSave,
  onCancel,
  isLoading,
}: {
  session: any;
  onSave: (updates: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState(session.title || "");
  const [description, setDescription] = useState(session.description || "");
  const [scheduledStart, setScheduledStart] = useState(
    format(new Date(session.scheduledStart), "yyyy-MM-dd'T'HH:mm")
  );
  const [scheduledEnd, setScheduledEnd] = useState(
    session.scheduledEnd
      ? format(new Date(session.scheduledEnd), "yyyy-MM-dd'T'HH:mm")
      : ""
  );

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="edit-title">Title</Label>
        <Input
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Session title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Session description"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-start">Start</Label>
          <Input
            id="edit-start"
            type="datetime-local"
            value={scheduledStart}
            onChange={(e) => setScheduledStart(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-end">End</Label>
          <Input
            id="edit-end"
            type="datetime-local"
            value={scheduledEnd}
            onChange={(e) => setScheduledEnd(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSave({
              title,
              description: description || undefined,
              scheduledStart: new Date(scheduledStart),
              scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : undefined,
            })
          }
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
