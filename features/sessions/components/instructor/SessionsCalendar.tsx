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

import { useLiveSessions, useCreateSession, useUpdateSession, useDeleteSession, useSessionOfferings } from "@/features/sessions/hooks/useLiveSessions";
import { LiveSession, SessionType, SessionFormat, SessionStatus, LiveSessionType, SessionMode } from "@/features/sessions/types/session.types";

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
  const { data: sessions = [], isLoading } = useLiveSessions(user?.id || "");
  const { data: offerings = [], isLoading: offeringsLoading } = useSessionOfferings({ instructorId: user?.id });
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  // Convert sessions to calendar events
  const calendarEvents = useMemo(() => {
    return sessions.map(session => ({
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
  const handleCreateSession = async (formData: any) => {
    try {
      await createSession.mutateAsync({
        instructorId: user?.id || "",
        ...formData,
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Session creation error:", error);
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
      await deleteSession.mutateAsync(deletingSessionId);
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
                    const session = sessions.find(s => s.id === event.id);
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
                            const session = sessions.find(s => s.id === event.id);
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
              </DialogHeader>
              <div className="pr-2">
                <CreateSessionForm 
                  onSubmit={handleCreateSession} 
                  offerings={offerings}
                  offeringsLoading={offeringsLoading}
                  isCreating={createSession.isPending}
                />
              </div>
            </DialogContent>
          </Dialog>
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
                        const session = sessions.find(s => s.id === event.id);
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

      {/* Edit Session Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="pr-2">
              <EditSessionForm
                session={selectedSession}
                onSubmit={(formData) => handleUpdateSession(selectedSession.id, formData)}
                onDelete={() => handleDeleteSession(selectedSession.id)}
                offerings={offerings}
                offeringsLoading={offeringsLoading}
                isUpdating={updateSession.isPending}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

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

// Create Session Form Component
function CreateSessionForm({ 
  onSubmit, 
  offerings, 
  offeringsLoading,
  isCreating
}: { 
  onSubmit: (data: any) => void;
  offerings: any[];
  offeringsLoading: boolean;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sessionType: "CUSTOM" as LiveSessionType,
    sessionFormat: "ONLINE" as SessionFormat,
    sessionMode: "LIVE" as SessionMode,
    startTime: "",
    duration: 60,
    maxParticipants: 1,
    minParticipants: 1,
    pricePerPerson: 0,
    currency: "USD",
    recordingEnabled: false,
    materials: [] as string[],
    location: "",
    meetingLink: "",
    meetingPassword: "",
    // Course-based session fields
    courseId: "",
    lectureId: "",
    // Custom session fields
    topicId: "",
    customTopic: "",
    // Offering ID (required by backend)
    offeringId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that an offering is selected
    if (!formData.offeringId && offerings.length > 0) {
      toast.error("Please select a session offering");
      return;
    }
    
    if (offerings.length === 0) {
      toast.error("No session offerings available. Please create an offering first.");
      return;
    }
    
    // Get the selected offering
    const selectedOffering = offerings.find(o => o.id === formData.offeringId);
    if (!selectedOffering) {
      toast.error("Please select a valid session offering");
      return;
    }

    // Transform form data to match backend DTO structure with offering as template
    const sessionData = {
      // Required fields
      offeringId: formData.offeringId,
      
      // Override offering defaults with form data (if provided)
      title: formData.title || selectedOffering.title,
      description: formData.description || selectedOffering.description,
      sessionType: formData.sessionType || selectedOffering.sessionType,
      sessionFormat: formData.sessionFormat || selectedOffering.sessionFormat,
      sessionMode: formData.sessionMode || "LIVE",
      maxParticipants: formData.maxParticipants || selectedOffering.capacity,
      minParticipants: formData.minParticipants || selectedOffering.minParticipants || 1,
      pricePerPerson: formData.pricePerPerson || selectedOffering.basePrice,
      currency: formData.currency || selectedOffering.currency,
      recordingEnabled: formData.recordingEnabled !== undefined ? formData.recordingEnabled : selectedOffering.recordingEnabled,
      materials: formData.materials || selectedOffering.materials || [],
      
      // Date/time handling
      scheduledStart: new Date(formData.startTime),
      duration: formData.duration || selectedOffering.duration,
      
      // Optional fields based on session type
      courseId: formData.sessionType === "COURSE_BASED" ? formData.courseId : undefined,
      lectureId: formData.sessionType === "COURSE_BASED" ? formData.lectureId : undefined,
      topicId: formData.sessionType === "CUSTOM" ? formData.topicId : undefined,
      customTopic: formData.sessionType === "CUSTOM" ? formData.customTopic : undefined,
      
      // Location and meeting details
      location: formData.sessionFormat !== "ONLINE" ? formData.location : undefined,
      meetingLink: formData.sessionFormat !== "OFFLINE" ? formData.meetingLink : undefined,
      meetingPassword: formData.sessionFormat !== "OFFLINE" ? formData.meetingPassword : undefined,
    };
    
    onSubmit(sessionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-sm font-medium">
          Session Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className={!formData.title ? "border-red-300 focus:border-red-500" : ""}
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={!formData.description ? "border-red-300 focus:border-red-500" : ""}
        />
      </div>

             <div className="grid grid-cols-2 gap-4">
         <div>
           <Label htmlFor="sessionType" className="text-sm font-medium">
             Session Type <span className="text-red-500">*</span>
           </Label>
           <Select
             value={formData.sessionType}
             onValueChange={(value: LiveSessionType) => setFormData({ ...formData, sessionType: value })}
           >
             <SelectTrigger>
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="COURSE_BASED">Course Based</SelectItem>
               <SelectItem value="CUSTOM">Custom</SelectItem>
             </SelectContent>
           </Select>
         </div>

         <div>
           <Label htmlFor="sessionFormat" className="text-sm font-medium">
             Format <span className="text-red-500">*</span>
           </Label>
           <Select
             value={formData.sessionFormat}
             onValueChange={(value: SessionFormat) => setFormData({ ...formData, sessionFormat: value })}
           >
             <SelectTrigger>
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="ONLINE">Online</SelectItem>
               <SelectItem value="OFFLINE">Offline</SelectItem>
               <SelectItem value="HYBRID">Hybrid</SelectItem>
             </SelectContent>
           </Select>
         </div>
       </div>

       {/* Session Offering Selection */}
       <div>
         <Label htmlFor="offeringId" className="text-sm font-medium">
           Session Offering <span className="text-red-500">*</span>
         </Label>
         {offeringsLoading ? (
           <div className="flex items-center space-x-2 mt-2">
             <LoadingSpinner size="sm" />
             <span className="text-sm text-muted-foreground">Loading offerings...</span>
           </div>
         ) : offerings.length === 0 ? (
           <div className="mt-2 p-3 border border-orange-200 bg-orange-50 rounded-md">
             <p className="text-sm text-orange-800">
               No session offerings found. Please create a session offering first.
             </p>
           </div>
         ) : (
           <Select
             value={formData.offeringId}
             onValueChange={(value) => setFormData({ ...formData, offeringId: value })}
           >
             <SelectTrigger>
               <SelectValue placeholder="Select a session offering" />
             </SelectTrigger>
             <SelectContent>
               {offerings.map((offering) => (
                 <SelectItem key={offering.id} value={offering.id}>
                   {offering.title} - ${offering.basePrice}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         )}
       </div>

      {/* Course-based session fields */}
      {formData.sessionType === "COURSE_BASED" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="courseId">Course ID</Label>
            <Input
              id="courseId"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              placeholder="Enter course ID"
            />
          </div>
          <div>
            <Label htmlFor="lectureId">Lecture ID</Label>
            <Input
              id="lectureId"
              value={formData.lectureId}
              onChange={(e) => setFormData({ ...formData, lectureId: e.target.value })}
              placeholder="Enter lecture ID"
            />
          </div>
        </div>
      )}

      {/* Custom session fields */}
      {formData.sessionType === "CUSTOM" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="topicId">Topic ID</Label>
            <Input
              id="topicId"
              value={formData.topicId}
              onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
              placeholder="Enter topic ID"
            />
          </div>
          <div>
            <Label htmlFor="customTopic">Custom Topic</Label>
            <Input
              id="customTopic"
              value={formData.customTopic}
              onChange={(e) => setFormData({ ...formData, customTopic: e.target.value })}
              placeholder="Enter custom topic"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime" className="text-sm font-medium">
            Start Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
            className={!formData.startTime ? "border-red-300 focus:border-red-500" : ""}
          />
        </div>

        <div>
          <Label htmlFor="duration" className="text-sm font-medium">
            Duration (minutes) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            min="15"
            max="480"
            required
            className={!formData.duration ? "border-red-300 focus:border-red-500" : ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="minParticipants" className="text-sm font-medium">
            Min Participants <span className="text-red-500">*</span>
          </Label>
          <Input
            id="minParticipants"
            type="number"
            value={formData.minParticipants}
            onChange={(e) => setFormData({ ...formData, minParticipants: parseInt(e.target.value) })}
            min="1"
            required
            className={!formData.minParticipants ? "border-red-300 focus:border-red-500" : ""}
          />
        </div>
        <div>
          <Label htmlFor="maxParticipants" className="text-sm font-medium">
            Max Participants <span className="text-red-500">*</span>
          </Label>
          <Input
            id="maxParticipants"
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
            min="1"
            required
            className={!formData.maxParticipants ? "border-red-300 focus:border-red-500" : ""}
          />
        </div>
        <div>
          <Label htmlFor="pricePerPerson" className="text-sm font-medium">
            Price per Person ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="pricePerPerson"
            type="number"
            value={formData.pricePerPerson}
            onChange={(e) => setFormData({ ...formData, pricePerPerson: parseFloat(e.target.value) })}
            min="0"
            step="0.01"
            required
            className={!formData.pricePerPerson && formData.pricePerPerson !== 0 ? "border-red-300 focus:border-red-500" : ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="recordingEnabled"
            checked={formData.recordingEnabled}
            onChange={(e) => setFormData({ ...formData, recordingEnabled: e.target.checked })}
          />
          <Label htmlFor="recordingEnabled">Enable Recording</Label>
        </div>
      </div>

      {formData.sessionFormat !== "ONLINE" && (
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Enter physical location"
          />
        </div>
      )}

      {formData.sessionFormat !== "OFFLINE" && (
        <div className="space-y-2">
          <div>
            <Label htmlFor="meetingLink">Meeting Link</Label>
            <Input
              id="meetingLink"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              placeholder="Enter meeting URL"
            />
          </div>
          <div>
            <Label htmlFor="meetingPassword">Meeting Password</Label>
            <Input
              id="meetingPassword"
              value={formData.meetingPassword}
              onChange={(e) => setFormData({ ...formData, meetingPassword: e.target.value })}
              placeholder="Enter meeting password (optional)"
            />
          </div>
        </div>
      )}

             <div className="flex justify-end space-x-2">
         <Button 
           type="submit" 
           disabled={offeringsLoading || offerings.length === 0 || isCreating}
         >
           {isCreating ? (
             <div className="flex items-center gap-2">
               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
               Creating...
             </div>
           ) : offeringsLoading ? (
             "Loading..."
           ) : (
             "Create Session"
           )}
         </Button>
       </div>
    </form>
  );
}

// Edit Session Form Component
function EditSessionForm({ 
  session, 
  onSubmit, 
  onDelete,
  offerings,
  offeringsLoading,
  isUpdating
}: { 
  session: LiveSession; 
  onSubmit: (data: any) => void; 
  onDelete: () => void;
  offerings: any[];
  offeringsLoading: boolean;
  isUpdating: boolean;
}) {
  const [formData, setFormData] = useState({
    title: session.title,
    description: session.description || "",
    sessionType: session.sessionType,
    sessionFormat: session.sessionFormat,
    sessionMode: session.sessionMode || "LIVE",
    startTime: session.scheduledStart ? format(new Date(session.scheduledStart), "yyyy-MM-dd'T'HH:mm") : "",
    duration: session.duration || 60,
    maxParticipants: session.maxParticipants || 1,
    minParticipants: session.minParticipants || 1,
    pricePerPerson: session.pricePerPerson || 0,
    currency: session.currency || "USD",
    recordingEnabled: session.recordingEnabled || false,
    materials: session.materials || [],
    location: session.location || "",
    meetingLink: session.meetingLink || "",
    meetingPassword: session.meetingPassword || "",
    courseId: session.courseId || "",
    lectureId: session.lectureId || "",
    topicId: session.topicId || "",
    customTopic: session.customTopic || "",
    offeringId: session.offeringId || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that an offering is selected
    if (!formData.offeringId && offerings.length > 0) {
      toast.error("Please select a session offering");
      return;
    }
    
    if (offerings.length === 0) {
      toast.error("No session offerings available. Please create an offering first.");
      return;
    }
    
    // Transform form data to match backend DTO structure
    const sessionData = {
      // Required fields
      title: formData.title,
      description: formData.description,
      sessionType: formData.sessionType,
      sessionFormat: formData.sessionFormat,
      sessionMode: formData.sessionMode,
      maxParticipants: formData.maxParticipants,
      minParticipants: formData.minParticipants,
      pricePerPerson: formData.pricePerPerson,
      currency: formData.currency,
      recordingEnabled: formData.recordingEnabled,
      materials: formData.materials,
      
      // Date/time handling
      scheduledStart: new Date(formData.startTime),
      scheduledEnd: new Date(new Date(formData.startTime).getTime() + formData.duration * 60000),
      duration: formData.duration,
      
      // Optional fields based on session type
      courseId: formData.sessionType === "COURSE_BASED" ? formData.courseId : undefined,
      lectureId: formData.sessionType === "COURSE_BASED" ? formData.lectureId : undefined,
      topicId: formData.sessionType === "CUSTOM" ? formData.topicId : undefined,
      customTopic: formData.sessionType === "CUSTOM" ? formData.customTopic : undefined,
      
      // Location and meeting details
      location: formData.sessionFormat !== "ONLINE" ? formData.location : undefined,
      meetingLink: formData.sessionFormat !== "OFFLINE" ? formData.meetingLink : undefined,
      meetingPassword: formData.sessionFormat !== "OFFLINE" ? formData.meetingPassword : undefined,
      
      // Required offering ID
      offeringId: formData.offeringId,
    };
    
    onSubmit(sessionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-title" className="text-sm font-medium">
          Session Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="edit-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className={!formData.title ? "border-red-300 focus:border-red-500" : ""}
        />
      </div>

      <div>
        <Label htmlFor="edit-description" className="text-sm font-medium">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={!formData.description ? "border-red-300 focus:border-red-500" : ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-sessionType" className="text-sm font-medium">
            Session Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.sessionType}
            onValueChange={(value: LiveSessionType) => setFormData({ ...formData, sessionType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COURSE_BASED">Course Based</SelectItem>
              <SelectItem value="CUSTOM">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="edit-sessionFormat" className="text-sm font-medium">
            Format <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.sessionFormat}
            onValueChange={(value: SessionFormat) => setFormData({ ...formData, sessionFormat: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONLINE">Online</SelectItem>
              <SelectItem value="OFFLINE">Offline</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Session Offering Selection */}
      <div>
        <Label htmlFor="edit-offeringId" className="text-sm font-medium">
          Session Offering <span className="text-red-500">*</span>
        </Label>
        {offeringsLoading ? (
          <div className="flex items-center space-x-2 mt-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-muted-foreground">Loading offerings...</span>
          </div>
        ) : offerings.length === 0 ? (
          <div className="mt-2 p-3 border border-orange-200 bg-orange-50 rounded-md">
            <p className="text-sm text-orange-800">
              No session offerings found. Please create a session offering first.
            </p>
          </div>
        ) : (
          <Select
            value={formData.offeringId}
            onValueChange={(value) => setFormData({ ...formData, offeringId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a session offering" />
            </SelectTrigger>
            <SelectContent>
              {offerings.map((offering) => (
                <SelectItem key={offering.id} value={offering.id}>
                  {offering.title} - ${offering.basePrice}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-startTime" className="text-sm font-medium">
            Start Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="edit-startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
            className={!formData.startTime ? "border-red-300 focus:border-red-500" : ""}
          />
        </div>

        <div>
          <Label htmlFor="edit-duration" className="text-sm font-medium">
            Duration (minutes) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="edit-duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            min="15"
            max="480"
            required
            className={!formData.duration ? "border-red-300 focus:border-red-500" : ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="edit-minParticipants" className="text-sm font-medium">
            Min Participants <span className="text-red-500">*</span>
          </Label>
          <Input
            id="edit-minParticipants"
            type="number"
            value={formData.minParticipants}
            onChange={(e) => setFormData({ ...formData, minParticipants: parseInt(e.target.value) })}
            min="1"
            required
            className={!formData.minParticipants ? "border-red-300 focus:border-red-500" : ""}
          />
        </div>
        <div>
          <Label htmlFor="edit-maxParticipants" className="text-sm font-medium">
            Max Participants <span className="text-red-500">*</span>
          </Label>
          <Input
            id="edit-maxParticipants"
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
            min="1"
            required
            className={!formData.maxParticipants ? "border-red-300 focus:border-red-500" : ""}
          />
        </div>
        <div>
          <Label htmlFor="edit-pricePerPerson" className="text-sm font-medium">
            Price per Person ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="edit-pricePerPerson"
            type="number"
            value={formData.pricePerPerson}
            onChange={(e) => setFormData({ ...formData, pricePerPerson: parseFloat(e.target.value) })}
            min="0"
            step="0.01"
            required
            className={!formData.pricePerPerson && formData.pricePerPerson !== 0 ? "border-red-300 focus:border-red-500" : ""}
          />
        </div>
      </div>

      {formData.sessionFormat !== "ONLINE" && (
        <div>
          <Label htmlFor="edit-location">Location</Label>
          <Input
            id="edit-location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
      )}

      {formData.sessionFormat !== "OFFLINE" && (
        <div>
          <Label htmlFor="edit-meetingLink">Meeting Link</Label>
          <Input
            id="edit-meetingLink"
            value={formData.meetingLink}
            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
          />
        </div>
      )}

      <div className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{session.title}"? This action cannot be undone and will remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex space-x-2">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </div>
            ) : (
              "Update Session"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
