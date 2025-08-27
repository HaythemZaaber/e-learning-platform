"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, DollarSign, TrendingUp, Video, BookOpen, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { 
  useStudentLiveSessions, 
  useSessionStats, 
  useUpcomingSessions,
  useBookingRequests,
  useCreateBookingRequest
} from '../../hooks/useLiveSessions';
import { SessionStatus, LiveSessionType, SessionFormat, BookingStatus } from '../../types/session.types';
import { StudentStats } from './StudentStats';
import { UpcomingSessions } from './UpcomingSessions';
import { MyBookings } from './MyBookings';
import { LearningHistory } from './LearningHistory';
import { BrowseSessions } from './BrowseSessions';

interface StudentDashboardProps {
  user: any;
  studentProfile: any;
}

export function StudentDashboard({
  user,
  studentProfile
}: StudentDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced hooks with all backend routes
  const { data: liveSessions, isLoading: sessionsLoading, refetch: refetchSessions } = useStudentLiveSessions(
    user?.id,
    { studentId: user?.id }
  );

  const { data: stats, isLoading: statsLoading } = useSessionStats(undefined, user?.id);
  const { data: upcomingSessions, isLoading: upcomingLoading } = useUpcomingSessions(undefined, user?.id, 7);
  const { data: bookingRequests, isLoading: bookingsLoading } = useBookingRequests({ studentId: user?.id });

  // Booking management
  const createBookingMutation = useCreateBookingRequest();

  // Filter sessions by status
  const scheduledSessions = liveSessions?.filter((s: any) => s.status === SessionStatus.SCHEDULED) || [];
  const inProgressSessions = liveSessions?.filter((s: any) => s.status === SessionStatus.IN_PROGRESS) || [];
  const completedSessions = liveSessions?.filter((s: any) => s.status === SessionStatus.COMPLETED) || [];
  const cancelledSessions = liveSessions?.filter((s: any) => s.status === SessionStatus.CANCELLED) || [];

  // Filter sessions by search query
  const filteredSessions = liveSessions?.filter((session: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      session.title?.toLowerCase().includes(query) ||
      session.description?.toLowerCase().includes(query) ||
      session.instructor?.firstName?.toLowerCase().includes(query) ||
      session.instructor?.lastName?.toLowerCase().includes(query) ||
      session.topic?.toLowerCase().includes(query)
    );
  }) || [];

  const handleBookSession = async (offeringId: string, customRequirements?: string, studentMessage?: string) => {
    try {
      await createBookingMutation.mutateAsync({
        offeringId,
        studentId: user?.id,
        bookingMode: "REQUEST" as any,
        customRequirements,
        studentMessage: studentMessage || customRequirements,
        status: BookingStatus.PENDING,
        priority: 1,
        rescheduleCount: 0,
        offeredPrice: 0,
        currency: "USD",
        paymentStatus: "PENDING" as any,
        alternativeDates: [],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });
      refetchSessions();
      toast.success('Session booking request sent successfully');
    } catch (error) {
      toast.error('Failed to book session');
    }
  };

  const handleJoinSession = (session: any) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    } else {
      toast.error('No meeting link available for this session');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Live Sessions</h1>
          <p className="text-muted-foreground">
            View and manage your live learning sessions
          </p>
        </div>
        <Button onClick={() => window.location.href = '/sessions/browse'} className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Browse Sessions
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search sessions by title, instructor, or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.completedSessions || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalEarnings || 0}</div>
            <p className="text-xs text-muted-foreground">
              ${stats?.pendingPayouts || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.cancelledSessions || 0} cancelled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating || 0}</div>
            <p className="text-xs text-muted-foreground">
              Based on {stats?.totalSessions || 0} sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Statistics</CardTitle>
                <CardDescription>Your learning progress overview</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentStats stats={{
                  totalSessions: stats?.totalSessions || 0,
                  completedSessions: stats?.completedSessions || 0,
                  totalHours: 0, // Will be calculated from session duration
                  averageRating: stats?.averageRating || 0,
                  totalSpent: 0, // Will be calculated from session prices
                  learningStreak: 0, // Will be calculated from attendance
                  favoriteInstructor: undefined,
                  topSubject: undefined,
                  unreadNotifications: 0
                }} />
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingSessions 
                  user={user}
                  sessions={upcomingSessions || []} 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <UpcomingSessions user={user} sessions={scheduledSessions} />
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <UpcomingSessions user={user} sessions={inProgressSessions} />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <LearningHistory user={user} sessions={completedSessions} />
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <UpcomingSessions user={user} sessions={upcomingSessions || []} />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <MyBookings user={user} bookings={bookingRequests || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
