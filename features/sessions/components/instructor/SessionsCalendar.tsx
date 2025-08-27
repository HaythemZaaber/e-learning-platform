"use client";

import { useState, useMemo } from "react";
import { Calendar as CalendarIcon, Clock, Users, MapPin, Video, Phone, MessageSquare, Plus, Edit, Trash, Eye, Target, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { format, isSameDay, isToday, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, startOfMonth, endOfMonth, eachWeekOfInterval, addWeeks, subWeeks, startOfMonth as startOfMonthFn, endOfMonth as endOfMonthFn } from "date-fns";

import { useInstructorLiveSessions, useCreateLiveSession, useUpdateLiveSession, useCancelLiveSession, useSessionOfferings, useStartLiveSession, useEndLiveSession, useRescheduleLiveSession } from "@/features/sessions/hooks/useLiveSessions";
import { LiveSession, SessionType, SessionFormat, SessionStatus, LiveSessionType, SessionMode } from "@/features/sessions/types/session.types";
import { CreateSessionModal } from './CreateSessionModal';
import { SessionDetailsModal } from './SessionDetailsModal';

interface SessionsCalendarProps {
  user: any;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: LiveSessionType;
  format: SessionFormat;
  status: SessionStatus;
  students: number;
  maxStudents: number;
  location?: string;
  meetingLink?: string;
}

export function SessionsCalendar({ user }: SessionsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch sessions and offerings
  const { data: sessions = [], isLoading } = useInstructorLiveSessions(user?.id || "");
  const { data: offerings = [], isLoading: offeringsLoading } = useSessionOfferings({ instructorId: user?.id });
  const createSession = useCreateLiveSession();
  const updateSession = useUpdateLiveSession();
  const deleteSession = useCancelLiveSession();
  const startSessionMutation = useStartLiveSession();
  const endSessionMutation = useEndLiveSession();
  const rescheduleSessionMutation = useRescheduleLiveSession();

  // Convert sessions to calendar events
  const calendarEvents = useMemo(() => {
    return sessions.map((session: any) => ({
      id: session.id,
      title: session.title,
      start: session.scheduledStart ? new Date(session.scheduledStart) : new Date(),
      end: session.scheduledEnd ? new Date(session.scheduledEnd) : new Date(),
      type: session.sessionType,
      format: session.sessionFormat,
      status: session.status,
      students: session.currentParticipants || 0,
      maxStudents: session.maxParticipants || 1,
      location: session.location,
      meetingLink: session.meetingLink,
    })) as CalendarEvent[];
  }, [sessions]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    return calendarEvents.filter(event => isSameDay(event.start, selectedDate));
  }, [calendarEvents, selectedDate]);

  // Get events for current week (always show current week, not selected date's week)
  const currentWeekEvents = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today);
    const end = endOfWeek(today);
    return calendarEvents.filter(event => 
      event.start >= start && event.start <= end
    );
  }, [calendarEvents]);

  // Get events for selected date's week (for navigation purposes)
  const weekEvents = useMemo(() => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);
    return calendarEvents.filter(event => 
      event.start >= start && event.start <= end
    );
  }, [calendarEvents, selectedDate]);

  // Get events for current month
  const monthEvents = useMemo(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    return calendarEvents.filter(event => 
      event.start >= start && event.start <= end
    );
  }, [calendarEvents, selectedDate]);

  // Navigation functions
  const goToPrevious = () => {
    switch (view) {
      case "day":
        setSelectedDate(subDays(selectedDate, 1));
        break;
      case "week":
        setSelectedDate(subWeeks(selectedDate, 1));
        break;
      case "month":
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, selectedDate.getDate()));
        break;
    }
  };

  const goToNext = () => {
    switch (view) {
      case "day":
        setSelectedDate(addDays(selectedDate, 1));
        break;
      case "week":
        setSelectedDate(addWeeks(selectedDate, 1));
        break;
      case "month":
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate()));
        break;
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  // Handle session creation
  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
  };

  // Session action handlers
  const handleStartSession = async (sessionId: string) => {
    try {
      await startSessionMutation.mutateAsync({ id: sessionId });
      toast.success('Session started successfully');
    } catch (error) {
      toast.error('Failed to start session');
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      await endSessionMutation.mutateAsync({ id: sessionId });
      toast.success('Session ended successfully');
    } catch (error) {
      toast.error('Failed to end session');
    }
  };

  const handleCancelSession = async (sessionId: string, reason?: string) => {
    try {
      await deleteSession.mutateAsync({ id: sessionId, cancelData: { reason } });
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
      toast.success('Session rescheduled successfully');
    } catch (error) {
      toast.error('Failed to reschedule session');
    }
  };

  // Handle session update
  const handleUpdateSession = async (sessionId: string, formData: any) => {
    try {
      await updateSession.mutateAsync({
        id: sessionId,
        ...formData,
      });
      setIsEditDialogOpen(false);
      setSelectedSession(null);
    } catch (error) {
      console.error("Session update error:", error);
    }
  };

  // Handle session deletion
  const handleDeleteSession = async (sessionId: string) => {
    setDeletingSessionId(sessionId);
  };

  const confirmDeleteSession = async () => {
    if (!deletingSessionId) return;
    
    try {
      await deleteSession.mutateAsync({ id: deletingSessionId, cancelData: { reason: "Deleted by instructor" } });
    } catch (error) {
      console.error("Session deletion error:", error);
    } finally {
      setDeletingSessionId(null);
    }
  };

  const getStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case "SCHEDULED":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">In Progress</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: LiveSessionType) => {
    switch (type) {
      case "COURSE_BASED":
        return <Users className="h-4 w-4" />;
      case "CUSTOM":
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getFormatIcon = (format: SessionFormat) => {
    switch (format) {
      case "ONLINE":
        return <Video className="h-4 w-4" />;
      case "OFFLINE":
        return <MapPin className="h-4 w-4" />;
      case "HYBRID":
        return <Video className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  // Render calendar view based on selected view type
  const renderCalendarView = () => {
    switch (view) {
      case "day":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h3>
            </div>
            <div className="space-y-2">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-all duration-200 bg-white"
                  onClick={() => {
                    const session = sessions.find((s: any) => s.id === event.id);
                    if (session) {
                      setSelectedSession(session);
                      setIsEditDialogOpen(true);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">{event.title}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-gray-600 font-medium">
                          {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(event.type)}
                        <span className="text-xs text-gray-600">
                          {event.students}/{event.maxStudents} students
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getFormatIcon(event.format)}
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {selectedDateEvents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">No sessions scheduled for this day</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case "week":
        const weekStart = startOfWeek(selectedDate);
        const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(selectedDate) });
        
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {format(weekStart, "MMM d")} - {format(endOfWeek(selectedDate), "MMM d, yyyy")}
              </h3>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dayEvents = calendarEvents.filter(event => isSameDay(event.start, day));
                return (
                  <div key={day.toISOString()} className="min-h-[120px] border rounded-lg p-2">
                    <div className={`text-center text-sm font-medium mb-2 ${
                      isToday(day) ? 'bg-blue-100 text-blue-800 rounded px-2 py-1' : ''
                    }`}>
                      {format(day, "EEE")}
                      <div className="text-xs">{format(day, "d")}</div>
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 bg-blue-50 rounded cursor-pointer hover:bg-blue-100"
                          onClick={() => {
                            const session = sessions.find((s: any) => s.id === event.id);
                            if (session) {
                              setSelectedSession(session);
                              setIsEditDialogOpen(true);
                            }
                          }}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-gray-600">{format(event.start, "HH:mm")}</div>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
        case "month":
          default:
            return (
              <div className="space-y-4">
                {/* Custom header with navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      const prevMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
                      setSelectedDate(prevMonth);
                    }}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <h3 className="text-lg font-semibold">
                    {format(selectedDate, "MMMM yyyy")}
                  </h3>
                  
                  <button
                    onClick={() => {
                      const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
                      setSelectedDate(nextMonth);
                    }}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
          
                {/* Custom Calendar Grid */}
                <div className="w-full">
                  <div className="grid grid-cols-7 gap-1">
                    {/* Day headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {(() => {
                      const startOfMonth = startOfMonthFn(selectedDate);
                      const endOfMonth = endOfMonthFn(selectedDate);
                      const startDate = new Date(startOfMonth);
                      startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
                      
                      const days = [];
                      for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
                        const currentDate = new Date(startDate);
                        currentDate.setDate(startDate.getDate() + i);
                        
                        const isCurrentMonth = currentDate.getMonth() === selectedDate.getMonth();
                        const isToday = isSameDay(currentDate, new Date());
                        const isSelected = isSameDay(currentDate, selectedDate);
                        const hasEvent = calendarEvents.some(event => isSameDay(event.start, currentDate));
                        
                        days.push(
                          <button
                            key={i}
                            onClick={() => setSelectedDate(currentDate)}
                            className={`
                              h-12 w-full p-2 text-sm font-medium rounded-md transition-colors
                              ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                              ${isToday ? 'bg-blue-100 text-blue-900 font-bold' : ''}
                              ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-black' : ''}
                              ${hasEvent ? 'bg-green-100 !text-green-800 ' : ''}
                              ${!isCurrentMonth ? 'hover:bg-gray-50' : 'hover:bg-gray-100'}
                            `}
                          >
                            {currentDate.getDate()}
                          </button>
                        );
                      }
                      return days;
                    })()}
                  </div>
                </div>
              </div>
            );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sessions Calendar</h2>
          <p className="text-muted-foreground">
            Manage your live sessions and availability
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={view} onValueChange={(value: any) => setView(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Session
          </Button>
          <CreateSessionModal
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            instructorId={user?.id || ""}
            onSuccess={handleCreateSuccess}
          />
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <Button variant="outline" size="sm" onClick={goToPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <div className="text-lg font-semibold">
            {view === "day" && format(selectedDate, "MMMM d, yyyy")}
            {view === "week" && `${format(startOfWeek(selectedDate), "MMM d")} - ${format(endOfWeek(selectedDate), "MMM d, yyyy")}`}
            {view === "month" && format(selectedDate, "MMMM yyyy")}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={goToNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
  <Card className="shadow-lg h-fit">
    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
      <CardTitle className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-blue-600" />
        Session Calendar
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="w-full">
        {renderCalendarView()}
      </div>
    </CardContent>
  </Card>
</div>

        {/* Events for Selected Date */}
        <div className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  {format(selectedDate, "EEEE, MMMM d")}
                </div>
                {isToday(selectedDate) && (
                  <Badge variant="default" className="bg-green-600">Today</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">No sessions scheduled</p>
                  <p className="text-xs text-muted-foreground mt-1">Click on a date to view sessions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-all duration-200 bg-white"
                      onClick={() => {
                        const session = sessions.find((s: any) => s.id === event.id);
                        if (session) {
                          setSelectedSession(session);
                          setIsEditDialogOpen(true);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-900 mb-2">{event.title}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-gray-600 font-medium">
                              {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(event.type)}
                            <span className="text-xs text-gray-600">
                              {event.students}/{event.maxStudents} students
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getFormatIcon(event.format)}
                            {getStatusBadge(event.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Total Sessions</span>
                  </div>
                  <span className="font-bold text-blue-600 text-lg">{currentWeekEvents.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <span className="font-bold text-green-600 text-lg">
                    {currentWeekEvents.filter(e => e.status === "COMPLETED").length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Upcoming</span>
                  </div>
                  <span className="font-bold text-orange-600 text-lg">
                    {currentWeekEvents.filter(e => e.status === "SCHEDULED").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <SessionDetailsModal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          session={selectedSession}
          onStart={() => handleStartSession(selectedSession.id)}
          onEnd={() => handleEndSession(selectedSession.id)}
          onCancel={() => handleCancelSession(selectedSession.id)}
          onReschedule={handleRescheduleSession}
          onUpdate={handleUpdateSession}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingSessionId} onOpenChange={(open) => !open && setDeletingSessionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this session? This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingSessionId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSession}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}




