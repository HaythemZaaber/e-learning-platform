"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Video, 
  Plus, 
  Search, 
  Filter,
  Package,
  Settings,
  BarChart3,
  BookOpen,
  UserCheck,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  useInstructorLiveSessions, 
  useSessionStats, 
  useUpcomingSessions,
  useStartLiveSession,
  useEndLiveSession,
  useCancelLiveSession,
  useRescheduleLiveSession,
  useUpdateLiveSession,
  useAddParticipant,
  useRemoveParticipant,
  useUpdateAttendance,
  useSessionParticipants,
  useSessionAttendance
} from '../../hooks/useLiveSessions';
import { SessionStatus, LiveSessionType, SessionFormat } from '../../types/session.types';
import { LiveSessionCard } from './LiveSessionCard';
import { SessionStatsOverview } from './SessionStatsOverview';
import { UpcomingSessionsList } from './UpcomingSessionsList';
import { CreateSessionModal } from './CreateSessionModal';
import { SessionDetailsModal } from './SessionDetailsModal';
import { SessionParticipantsModal } from './SessionParticipantsModal';
import { AttendanceModal } from './AttendanceModal';
import { SessionOfferings } from './SessionOfferings';
import { AvailabilitySetup } from './AvailabilitySetup';
import { SessionsCalendar } from './SessionsCalendar';
import { BookingRequests } from './BookingRequests';
import { InstructorSettings } from './InstructorSettings';
import { NotificationCenter } from './NotificationCenter';
import { SessionAnalytics } from './SessionAnalytics';
import { AIInsightsPanel } from './AIInsightsPanel';
import { QuickActions } from './QuickActions';
import { toast } from 'sonner';

export function InstructorDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'ALL'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isSessionDetailsOpen, setIsSessionDetailsOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // Data fetching hooks
  const { 
    data: sessions, 
    isLoading: sessionsLoading, 
    refetch: refetchSessions 
  } = useInstructorLiveSessions(user?.id || '');
  
  const { data: stats, isLoading: statsLoading } = useSessionStats(user?.id || '');
  const { data: upcomingSessions, isLoading: upcomingLoading } = useUpcomingSessions(user?.id || '');
  
  // Session-specific data
  const { data: participants } = useSessionParticipants(selectedSession?.id || '');
  const { data: attendance } = useSessionAttendance(selectedSession?.id || '');

  // Mutation hooks
  const startSessionMutation = useStartLiveSession();
  const endSessionMutation = useEndLiveSession();
  const cancelSessionMutation = useCancelLiveSession();
  const rescheduleSessionMutation = useRescheduleLiveSession();
  const updateSessionMutation = useUpdateLiveSession();
  const addParticipantMutation = useAddParticipant();
  const removeParticipantMutation = useRemoveParticipant();
  const updateAttendanceMutation = useUpdateAttendance();

  // Filter sessions based on search and status
  const filteredSessions = sessions?.filter((session: any) => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Group sessions by status
  const scheduledSessions = filteredSessions.filter((s: any) => s.status === SessionStatus.SCHEDULED);
  const confirmedSessions = filteredSessions.filter((s: any) => s.status === SessionStatus.CONFIRMED);
  const inProgressSessions = filteredSessions.filter((s: any) => s.status === SessionStatus.IN_PROGRESS);
  const completedSessions = filteredSessions.filter((s: any) => s.status === SessionStatus.COMPLETED);
  const cancelledSessions = filteredSessions.filter((s: any) => s.status === SessionStatus.CANCELLED);

  // Session action handlers
  const handleStartSession = async (sessionId: string) => {
    try {
      await startSessionMutation.mutateAsync({ id: sessionId });
      refetchSessions();
      toast.success('Session started successfully');
    } catch (error) {
      toast.error('Failed to start session');
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      await endSessionMutation.mutateAsync({ id: sessionId });
      refetchSessions();
      toast.success('Session ended successfully');
    } catch (error) {
      toast.error('Failed to end session');
    }
  };

  const handleCancelSession = async (sessionId: string, reason?: string) => {
    try {
      await cancelSessionMutation.mutateAsync({ id: sessionId, cancelData: { reason } });
      refetchSessions();
      toast.success('Session cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel session');
    }
  };

  const handleRescheduleSession = async (sessionId: string, rescheduleData: any) => {
    try {
      await rescheduleSessionMutation.mutateAsync({ 
        id: sessionId, 
        rescheduleData 
      });
      refetchSessions();
      toast.success('Session rescheduled successfully');
    } catch (error) {
      toast.error('Failed to reschedule session');
    }
  };

  const handleUpdateSession = async (sessionId: string, formData: any) => {
    try {
      await updateSessionMutation.mutateAsync({
        id: sessionId,
        ...formData,
      });
      refetchSessions();
      toast.success('Session updated successfully');
    } catch (error) {
      toast.error('Failed to update session');
    }
  };

  const handleAddParticipant = async (sessionId: string, studentId: string) => {
    try {
      await addParticipantMutation.mutateAsync({ 
        sessionId, 
        participantData: { userId: studentId } 
      });
      refetchSessions();
      toast.success('Participant added successfully');
    } catch (error) {
      toast.error('Failed to add participant');
    }
  };

  const handleRemoveParticipant = async (sessionId: string, studentId: string) => {
    try {
      await removeParticipantMutation.mutateAsync({ sessionId, userId: studentId });
      refetchSessions();
      toast.success('Participant removed successfully');
    } catch (error) {
      toast.error('Failed to remove participant');
    }
  };

  const handleUpdateAttendance = async (sessionId: string, studentId: string, attendanceData: any) => {
    try {
      await updateAttendanceMutation.mutateAsync({ sessionId, studentId, ...attendanceData });
      refetchSessions();
      toast.success('Attendance updated successfully');
    } catch (error) {
      toast.error('Failed to update attendance');
    }
  };

  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
    setIsSessionDetailsOpen(true);
  };

  const handleManageParticipants = (session: any) => {
    setSelectedSession(session);
    setIsParticipantsModalOpen(true);
  };

  const handleManageAttendance = (session: any) => {
    setSelectedSession(session);
    setIsAttendanceModalOpen(true);
  };

  const handleEditSession = (session: any) => {
    setSelectedSession(session);
    setIsSessionDetailsOpen(true);
  };

  const handleCreateSuccess = () => {
    refetchSessions();
    setIsCreateModalOpen(false);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Please log in to access the instructor dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your live sessions, offerings, and availability
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Session
        </Button>
      </div>

      {/* Stats Overview */}
      <SessionStatsOverview stats={stats} isLoading={statsLoading} />

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Live Sessions
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Requests
          </TabsTrigger>
          <TabsTrigger value="offerings" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Offerings
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Live Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SessionStatus | 'ALL')}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value={SessionStatus.SCHEDULED}>Scheduled</SelectItem>
                <SelectItem value={SessionStatus.CONFIRMED}>Confirmed</SelectItem>
                <SelectItem value={SessionStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={SessionStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={SessionStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sessions by Status */}
          <div className="space-y-6">
            {/* Scheduled Sessions */}
            {scheduledSessions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Scheduled Sessions ({scheduledSessions.length})
                </h3>
                <div className="grid gap-4">
                                     {scheduledSessions.map((session: any) => (
                     <LiveSessionCard
                       key={session.id}
                       session={session}
                       onSessionClick={() => handleSessionClick(session)}
                       onStart={() => handleStartSession(session.id)}
                       onCancel={() => handleCancelSession(session.id)}
                       onReschedule={(rescheduleData) => 
                         handleRescheduleSession(session.id, rescheduleData)
                       }
                       onManageParticipants={() => handleManageParticipants(session)}
                       onManageAttendance={() => handleManageAttendance(session)}
                       onEdit={() => handleEditSession(session)}
                     />
                   ))}
                </div>
              </div>
            )}

            {/* Confirmed Sessions */}
            {confirmedSessions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Confirmed Sessions ({confirmedSessions.length})
                </h3>
                <div className="grid gap-4">
                                     {confirmedSessions.map((session: any) => (
                     <LiveSessionCard
                       key={session.id}
                       session={session}
                       onSessionClick={() => handleSessionClick(session)}
                       onStart={() => handleStartSession(session.id)}
                       onCancel={() => handleCancelSession(session.id)}
                       onReschedule={(rescheduleData) => 
                         handleRescheduleSession(session.id, rescheduleData)
                       }
                       onManageParticipants={() => handleManageParticipants(session)}
                       onManageAttendance={() => handleManageAttendance(session)}
                       onEdit={() => handleEditSession(session)}
                     />
                   ))}
                </div>
              </div>
            )}

            {/* In Progress Sessions */}
            {inProgressSessions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  In Progress Sessions ({inProgressSessions.length})
                </h3>
                <div className="grid gap-4">
                  {inProgressSessions.map((session: any) => (
                    <LiveSessionCard
                      key={session.id}
                      session={session}
                      onSessionClick={() => handleSessionClick(session)}
                      onEnd={() => handleEndSession(session.id)}
                      onManageParticipants={() => handleManageParticipants(session)}
                      onManageAttendance={() => handleManageAttendance(session)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Sessions */}
            {completedSessions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Completed Sessions ({completedSessions.length})
                </h3>
                <div className="grid gap-4">
                  {completedSessions.map((session: any) => (
                    <LiveSessionCard
                      key={session.id}
                      session={session}
                      onSessionClick={() => handleSessionClick(session)}
                      onManageParticipants={() => handleManageParticipants(session)}
                      onManageAttendance={() => handleManageAttendance(session)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled Sessions */}
            {cancelledSessions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Cancelled Sessions ({cancelledSessions.length})
                </h3>
                <div className="grid gap-4">
                  {cancelledSessions.map((session: any) => (
                    <LiveSessionCard
                      key={session.id}
                      session={session}
                      onSessionClick={() => handleSessionClick(session)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredSessions.length === 0 && !sessionsLoading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <Video className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">No sessions found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== 'ALL' 
                          ? 'Try adjusting your search or filters'
                          : 'Create your first live session to get started'
                        }
                      </p>
                    </div>
                    {!searchTerm && statusFilter === 'ALL' && (
                      <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Session
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <SessionsCalendar user={user} />
        </TabsContent>

        {/* Booking Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <BookingRequests user={user} />
        </TabsContent>

        {/* Offerings Tab */}
        <TabsContent value="offerings" className="space-y-6">
          <SessionOfferings />
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <AvailabilitySetup />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6">
            {/* Quick Actions */}
            <QuickActions user={user} />
            
            {/* Session Analytics */}
            <SessionAnalytics user={user} />
            
            {/* AI Insights */}
            <AIInsightsPanel />
            
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Sessions
                </CardTitle>
                <CardDescription>
                  Your next scheduled sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingSessionsList 
                  sessions={upcomingSessions || []} 
                  onSessionClick={(session: any) => handleSessionClick(session)}
                  isLoading={upcomingLoading}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationCenter 
            isOpen={false}
            onClose={() => {}}
            notifications={[]}
            onMarkAllAsRead={() => {}}
          />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <InstructorSettings user={user} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        instructorId={user.id}
        onSuccess={handleCreateSuccess}
      />

      {selectedSession && (
        <>
          <SessionDetailsModal
            isOpen={isSessionDetailsOpen}
            onClose={() => setIsSessionDetailsOpen(false)}
            session={selectedSession}
            onStart={() => handleStartSession(selectedSession.id)}
            onEnd={() => handleEndSession(selectedSession.id)}
            onCancel={() => handleCancelSession(selectedSession.id)}
            onReschedule={handleRescheduleSession}
            onUpdate={handleUpdateSession}
          />

          <SessionParticipantsModal
            isOpen={isParticipantsModalOpen}
            onClose={() => setIsParticipantsModalOpen(false)}
            session={selectedSession}
            participants={participants || []}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
          />

          <AttendanceModal
            isOpen={isAttendanceModalOpen}
            onClose={() => setIsAttendanceModalOpen(false)}
            session={selectedSession}
            attendance={attendance || []}
            onUpdateAttendance={handleUpdateAttendance}
          />
        </>
      )}
    </div>
  );
}
