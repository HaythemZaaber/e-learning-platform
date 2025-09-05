"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  useStudentBookings, 
  useCancelSessionBooking,
  useMeetingInfo,
  useJoinSession,
  useLeaveSession,
  useRescheduleSession
} from "../../hooks/useSessionBooking";
import { BookingStatus, SessionStatus } from "../../types/session.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  User,
  Users,
  DollarSign,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Video,
  Play,
  StopCircle,
  Eye,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  CalendarDays,
  Clock4,
  UserCheck,
  UserX,
  VideoOff,
  VideoIcon,
  Mic,
  MicOff,
  Share2,
  Settings,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  BookOpen,
  GraduationCap,
  Award,
  Target,
  Zap,
  Shield,
  CreditCard,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Bell,
  BellRing,
  Copy,
  Download,
  FileText,
  Calendar as CalendarIcon,
  Timer,
  Globe,
  Monitor,
  Headphones,
  MessageCircle,
  Bookmark,
  History,
  ArrowUpDown,
} from "lucide-react";
import { format, formatDistanceToNow, isBefore, isAfter, addMinutes, differenceInMinutes, differenceInHours, startOfDay, endOfDay, isToday, isTomorrow, isPast, isFuture } from "date-fns";
import { toast } from "sonner";

interface StudentBookingDashboardProps {
  studentId: string;
}

interface FilterState {
  search: string;
  status: BookingStatus | "ALL";
  dateRange: "ALL" | "TODAY" | "TOMORROW" | "THIS_WEEK" | "THIS_MONTH" | "PAST";
  sortBy: "DATE" | "CREATED" | "PRICE" | "STATUS";
  sortOrder: "ASC" | "DESC";
}

export function StudentBookingDashboard({ studentId }: StudentBookingDashboardProps) {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCompactView, setShowCompactView] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "ALL",
    dateRange: "ALL",
    sortBy: "DATE",
    sortOrder: "DESC"
  });

  // Queries
  const { data: bookings, isLoading, error, refetch, isFetching } = useStudentBookings(studentId);
  const { data: meetingInfo } = useMeetingInfo(selectedBooking?.liveSession?.id || "");

  // Mutations
  const cancelBookingMutation = useCancelSessionBooking();
  const joinSessionMutation = useJoinSession();
  const leaveSessionMutation = useLeaveSession();
  const rescheduleSessionMutation = useRescheduleSession();

  // Auto-refresh every 30 seconds for live sessions
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      const hasLiveSessions = bookings?.some(booking => 
        (booking.status === BookingStatus.ACCEPTED && 
         booking.timeSlot && 
         isSessionStartingSoon(new Date(booking.timeSlot.startTime)))
      );
      
      if (hasLiveSessions) {
        refetch();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, bookings, refetch]);

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    if (!bookings) return [];

    let filtered = bookings.filter(booking => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          booking.offering?.title,
          booking.offering?.instructor?.firstName,
          booking.offering?.instructor?.lastName,
          booking.offering?.fixedTopic,
          booking.customTopic,
          booking.offering?.domain,
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) return false;
      }

      // Status filter
      if (filters.status !== "ALL" && booking.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== "ALL" && booking.timeSlot) {
        const sessionDate = new Date(booking.timeSlot.startTime);
        const now = new Date();
        
        switch (filters.dateRange) {
          case "TODAY":
            if (!isToday(sessionDate)) return false;
            break;
          case "TOMORROW":
            if (!isTomorrow(sessionDate)) return false;
            break;
          case "THIS_WEEK":
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (isBefore(sessionDate, now) || isAfter(sessionDate, weekFromNow)) return false;
            break;
          case "THIS_MONTH":
            const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            if (isBefore(sessionDate, now) || isAfter(sessionDate, monthFromNow)) return false;
            break;
          case "PAST":
            if (!isPast(sessionDate)) return false;
            break;
        }
      }

      return true;
    });

    // Sort bookings
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case "DATE":
          aValue = a.timeSlot ? new Date(a.timeSlot.startTime).getTime() : 0;
          bValue = b.timeSlot ? new Date(b.timeSlot.startTime).getTime() : 0;
          break;
        case "CREATED":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "PRICE":
          aValue = a.finalPrice || a.offeredPrice || 0;
          bValue = b.finalPrice || b.offeredPrice || 0;
          break;
        case "STATUS":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === "ASC") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [bookings, filters]);

  // Group bookings by status for stats
  const bookingStats = useMemo(() => {
    if (!bookings) return {
      total: 0,
      pending: 0,
      accepted: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
      totalSpent: 0,
      upcomingSessions: 0,
      sessionsTaken: 0
    };

    const stats = bookings.reduce((acc, booking) => {
      acc.total++;
      acc[booking.status.toLowerCase() as keyof typeof acc]++;
      
      if (booking.status === BookingStatus.COMPLETED) {
        acc.totalSpent += booking.finalPrice || booking.offeredPrice || 0;
        acc.sessionsTaken++;
      }
      
      if (booking.status === BookingStatus.ACCEPTED && 
          booking.timeSlot && 
          isFuture(new Date(booking.timeSlot.startTime))) {
        acc.upcomingSessions++;
      }
      
      return acc;
    }, {
      total: 0,
      pending: 0,
      accepted: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
      totalSpent: 0,
      upcomingSessions: 0,
      sessionsTaken: 0
    });

    return stats;
  }, [bookings]);

  // Get urgent notifications
  const urgentNotifications = useMemo(() => {
    if (!bookings) return [];
    
    const notifications = [];
    const now = new Date();
    
    bookings.forEach(booking => {
      if (booking.status === BookingStatus.ACCEPTED && booking.timeSlot) {
        const sessionTime = new Date(booking.timeSlot.startTime);
        const minutesUntil = differenceInMinutes(sessionTime, now);
        
        if (minutesUntil > 0 && minutesUntil <= 15) {
          notifications.push({
            type: 'session_starting',
            booking,
            message: `Session starts in ${minutesUntil} minutes`,
            urgent: minutesUntil <= 5
          });
        } else if (minutesUntil < 0 && minutesUntil >= -30) {
          notifications.push({
            type: 'session_overdue',
            booking,
            message: `Session was supposed to start ${Math.abs(minutesUntil)} minutes ago`,
            urgent: true
          });
        }
      }
      
      if (booking.status === BookingStatus.PENDING) {
        const hoursWaiting = differenceInHours(now, new Date(booking.createdAt));
        if (hoursWaiting >= 24) {
          notifications.push({
            type: 'pending_long',
            booking,
            message: `Booking pending for ${hoursWaiting} hours`,
            urgent: hoursWaiting >= 48
          });
        }
      }
    });
    
    return notifications;
  }, [bookings]);

  // Helper functions
  const isSessionStartingSoon = (sessionTime: Date) => {
    const now = new Date();
    const minutesDiff = differenceInMinutes(sessionTime, now);
    return minutesDiff <= 15 && minutesDiff > 0;
  };

  const isSessionOverdue = (sessionTime: Date) => {
    const now = new Date();
    const minutesDiff = differenceInMinutes(sessionTime, now);
    return minutesDiff < 0 && minutesDiff > -60;
  };

  const canJoinSession = (booking: any) => {
    if (!booking.liveSession || booking.status !== BookingStatus.ACCEPTED) return false;
    
    if (booking.liveSession.status === SessionStatus.IN_PROGRESS) return true;
    
    if (booking.liveSession.status === SessionStatus.SCHEDULED && booking.timeSlot) {
      const sessionTime = new Date(booking.timeSlot.startTime);
      const now = new Date();
      const minutesUntil = differenceInMinutes(sessionTime, now);
      return minutesUntil <= 15 && minutesUntil >= -5; // Can join 15 min before to 5 min after
    }
    
    return false;
  };

  const canCancelBooking = (booking: any) => {
    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.ACCEPTED) {
      return false;
    }
    
    if (booking.timeSlot) {
      const sessionTime = new Date(booking.timeSlot.startTime);
      const hoursUntil = differenceInHours(sessionTime, new Date());
      // Can cancel up to 2 hours before session
      return hoursUntil >= 2;
    }
    
    return true;
  };

  const canRescheduleBooking = (booking: any) => {
    return booking.status === BookingStatus.ACCEPTED && 
           booking.rescheduleCount < 2 && // Max 2 reschedules
           booking.timeSlot &&
           differenceInHours(new Date(booking.timeSlot.startTime), new Date()) >= 24; // 24h notice
  };

  const getEffectivePrice = (booking: any) => {
    // Check for price override in availability
    if (booking.timeSlot?.availability?.priceOverride) {
      return booking.timeSlot.availability.priceOverride;
    }
    return booking.finalPrice || booking.offeredPrice || booking.offering?.basePrice || 0;
  };

  const getEffectiveCurrency = (booking: any) => {
    return booking.timeSlot?.availability?.currency || booking.currency || booking.offering?.currency || 'USD';
  };

  // Handle actions
  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleCancelClick = (booking: any) => {
    setSelectedBooking(booking);
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    
    try {
      await cancelBookingMutation.mutateAsync({
        bookingId: selectedBooking.id,
        reason: cancelReason || "Cancelled by student",
        processRefund: true
      });
      
      refetch();
      setIsCancelModalOpen(false);
      setCancelReason("");
      setSelectedBooking(null);
      
      toast.success("Session cancelled successfully", {
        description: "Refund will be processed within 3-5 business days"
      });
    } catch (error: any) {
      toast.error("Failed to cancel session", {
        description: error.message || "Please try again later"
      });
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    try {
      const result = await joinSessionMutation.mutateAsync(sessionId);
      if (result.success && result.meetingLink) {
        window.open(result.meetingLink, '_blank');
        toast.success("Joining session...", {
          description: "Opening meeting link in new tab"
        });
      } else {
        toast.error("Unable to join session", {
          description: result.error || "Please contact support"
        });
      }
    } catch (error: any) {
      toast.error("Failed to join session", {
        description: error.message || "Please try again"
      });
    }
  };

  const handleReschedule = (booking: any) => {
    setSelectedBooking(booking);
    setIsRescheduleModalOpen(true);
  };

  const copyMeetingLink = (booking: any) => {
    if (booking.liveSession?.meetingLink) {
      navigator.clipboard.writeText(booking.liveSession.meetingLink);
      toast.success("Meeting link copied to clipboard");
    }
  };

  // Status badge components
  const getStatusBadge = (status: BookingStatus) => {
    const variants = {
      [BookingStatus.PENDING]: { 
        className: "border-amber-200 bg-amber-50 text-amber-700", 
        icon: Clock, 
        label: "Pending" 
      },
      [BookingStatus.ACCEPTED]: { 
        className: "border-green-200 bg-green-50 text-green-700", 
        icon: CheckCircle, 
        label: "Accepted" 
      },
      [BookingStatus.REJECTED]: { 
        className: "border-red-200 bg-red-50 text-red-700", 
        icon: XCircle, 
        label: "Rejected" 
      },
      [BookingStatus.COMPLETED]: { 
        className: "border-blue-200 bg-blue-50 text-blue-700", 
        icon: Award, 
        label: "Completed" 
      },
      [BookingStatus.CANCELLED]: { 
        className: "border-gray-200 bg-gray-50 text-gray-600", 
        icon: XCircle, 
        label: "Cancelled" 
      },
    };

    const variant = variants[status];
    if (!variant) return <Badge variant="outline">{status}</Badge>;

    const Icon = variant.icon;
    return (
      <Badge variant="outline" className={variant.className}>
        <Icon className="h-3 w-3 mr-1" />
        {variant.label}
      </Badge>
    );
  };

  const getSessionStatusBadge = (status: SessionStatus) => {
    const variants = {
      [SessionStatus.SCHEDULED]: { 
        className: "border-blue-200 bg-blue-50 text-blue-700", 
        icon: Calendar, 
        label: "Scheduled" 
      },
      [SessionStatus.IN_PROGRESS]: { 
        className: "border-green-200 bg-green-50 text-green-700 animate-pulse", 
        icon: Video, 
        label: "Live" 
      },
      [SessionStatus.COMPLETED]: { 
        className: "border-purple-200 bg-purple-50 text-purple-700", 
        icon: CheckCircle, 
        label: "Completed" 
      },
      [SessionStatus.CANCELLED]: { 
        className: "border-red-200 bg-red-50 text-red-700", 
        icon: XCircle, 
        label: "Cancelled" 
      },
    };

    const variant = variants[status];
    if (!variant) return <Badge variant="outline">{status}</Badge>;

    const Icon = variant.icon;
    return (
      <Badge variant="outline" className={variant.className}>
        <Icon className="h-3 w-3 mr-1" />
        {variant.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const variants = {
      PENDING: { className: "border-yellow-200 bg-yellow-50 text-yellow-700", label: "Payment Pending" },
      PAID: { className: "border-green-200 bg-green-50 text-green-700", label: "Paid" },
      FAILED: { className: "border-red-200 bg-red-50 text-red-700", label: "Payment Failed" },
      REFUNDED: { className: "border-gray-200 bg-gray-50 text-gray-600", label: "Refunded" },
    };

    const variant = variants[paymentStatus as keyof typeof variants];
    if (!variant) return null;

    return (
      <Badge variant="outline" className={variant.className}>
        <CreditCard className="h-3 w-3 mr-1" />
        {variant.label}
      </Badge>
    );
  };

  const renderBookingCard = (booking: any) => {
    const sessionTime = booking.timeSlot ? new Date(booking.timeSlot.startTime) : null;
    const endTime = booking.timeSlot ? new Date(booking.timeSlot.endTime) : null;
    const isStartingSoon = sessionTime ? isSessionStartingSoon(sessionTime) : false;
    const isOverdue = sessionTime ? isSessionOverdue(sessionTime) : false;
    const canJoin = canJoinSession(booking);
    const canCancel = canCancelBooking(booking);
    const canReschedule = canRescheduleBooking(booking);
    const effectivePrice = getEffectivePrice(booking);
    const effectiveCurrency = getEffectiveCurrency(booking);

    // Auto-accept logic
    const isAutoAccepted = booking.timeSlot?.availability?.autoAcceptBookings && 
                          booking.status === BookingStatus.ACCEPTED;

    return (
      <Card key={booking.id} className={`hover:shadow-lg transition-all duration-200 ${
        isStartingSoon ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
      } ${
        isOverdue ? 'ring-2 ring-red-200 bg-red-50/30' : ''
      } ${
        booking.liveSession?.status === SessionStatus.IN_PROGRESS ? 'ring-2 ring-green-200 bg-green-50/30' : ''
      }`}>
        <CardContent className="p-6">
          {/* Header with instructor info and status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                {booking.offering?.instructor?.profileImage ? (
                  <img 
                    src={booking.offering.instructor.profileImage} 
                    alt="Instructor" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                {booking.liveSession?.status === SessionStatus.IN_PROGRESS && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">
                  {booking.offering?.instructor?.firstName} {booking.offering?.instructor?.lastName}
                </h4>
                <p className="text-gray-600 font-medium">{booking.offering?.title}</p>
                {booking.offering?.fixedTopic && (
                  <p className="text-sm text-blue-600 font-medium">{booking.offering.fixedTopic}</p>
                )}
                {booking.offering?.domain && (
                  <Badge variant="secondary" className="mt-1">
                    {booking.offering.domain}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {getStatusBadge(booking.status)}
                {isAutoAccepted && (
                  <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                    <Zap className="h-3 w-3 mr-1" />
                    Auto-accepted
                  </Badge>
                )}
              </div>
              {booking.liveSession && (
                <div className="flex items-center gap-2">
                  {getSessionStatusBadge(booking.liveSession.status)}
                </div>
              )}
              {booking.paymentStatus && (
                <div>
                  {getPaymentStatusBadge(booking.paymentStatus)}
                </div>
              )}
            </div>
          </div>

          {/* Critical alerts */}
          {isStartingSoon && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <BellRing className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 font-medium">
                Your session starts in {differenceInMinutes(sessionTime!, new Date())} minutes! 
                {canJoin && (
                  <Button 
                    size="sm" 
                    className="ml-2"
                    onClick={() => handleJoinSession(booking.liveSession.id)}
                  >
                    Join Now
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {isOverdue && booking.status === BookingStatus.ACCEPTED && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 font-medium">
                Your session was scheduled to start {Math.abs(differenceInMinutes(sessionTime!, new Date()))} minutes ago.
                {booking.liveSession?.status === SessionStatus.IN_PROGRESS && (
                  <Button 
                    size="sm" 
                    className="ml-2"
                    onClick={() => handleJoinSession(booking.liveSession.id)}
                  >
                    Join Live Session
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {booking.liveSession?.status === SessionStatus.IN_PROGRESS && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <Video className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 font-medium">
                Session is live now!
                <Button 
                  size="sm" 
                  className="ml-2"
                  onClick={() => handleJoinSession(booking.liveSession.id)}
                >
                  Join Session
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Session information grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium">
                  {sessionTime ? format(sessionTime, "MMM d, yyyy") : "TBD"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-gray-500">Time</p>
                <p className="font-medium">
                  {sessionTime ? format(sessionTime, "h:mm a") : "TBD"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Timer className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-gray-500">Duration</p>
                <p className="font-medium">
                  {booking.offering?.duration || 60} min
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-medium">
                  {effectivePrice} {effectiveCurrency}
                </p>
              </div>
            </div>
          </div>

          {/* Session format and capacity */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Monitor className="h-4 w-4" />
              <span>{booking.offering?.sessionFormat || 'Online'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{booking.offering?.sessionType || 'Individual'}</span>
            </div>
            {booking.offering?.capacity && (
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>Max {booking.offering.capacity} students</span>
              </div>
            )}
            {booking.timeSlot?.currentBookings && (
              <div className="flex items-center gap-1">
                <UserCheck className="h-4 w-4" />
                <span>{booking.timeSlot.currentBookings} booked</span>
              </div>
            )}
          </div>

          {/* Custom topic/requirements */}
          {(booking.customTopic || booking.studentMessage || booking.customRequirements) && (
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              {booking.customTopic && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Custom Topic</p>
                  <p className="text-sm text-gray-800">{booking.customTopic}</p>
                </div>
              )}
              {booking.studentMessage && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Your Message</p>
                  <p className="text-sm text-gray-800">{booking.studentMessage}</p>
                </div>
              )}
              {booking.customRequirements && (
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Special Requirements</p>
                  <p className="text-sm text-gray-800">{booking.customRequirements}</p>
                </div>
              )}
            </div>
          )}

          {/* Instructor response */}
          {booking.instructorResponse && (
            <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded-lg mb-4">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Instructor Response</p>
              <p className="text-sm text-blue-800">{booking.instructorResponse}</p>
            </div>
          )}

          {/* Session features */}
          {booking.offering && (
            <div className="flex flex-wrap gap-2 mb-4">
              {booking.offering.recordingEnabled && (
                <Badge variant="outline" className="text-xs">
                  <VideoIcon className="h-3 w-3 mr-1" />
                  Recording
                </Badge>
              )}
              {booking.offering.whiteboardEnabled && (
                <Badge variant="outline" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  Whiteboard
                </Badge>
              )}
              {booking.offering.screenShareEnabled && (
                <Badge variant="outline" className="text-xs">
                  <Share2 className="h-3 w-3 mr-1" />
                  Screen Share
                </Badge>
              )}
              {booking.offering.chatEnabled && (
                <Badge variant="outline" className="text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chat
                </Badge>
              )}
            </div>
          )}

          {/* Footer with timestamp and actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock4 className="h-3 w-3" />
                <span>Booked {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}</span>
              </div>
              {booking.rescheduleCount > 0 && (
                <div className="flex items-center gap-1">
                  <History className="h-3 w-3" />
                  <span>Rescheduled {booking.rescheduleCount}x</span>
                </div>
              )}
              {booking.expiresAt && isFuture(new Date(booking.expiresAt)) && (
                <div className="flex items-center gap-1">
                  <Timer className="h-3 w-3 text-amber-500" />
                  <span className="text-amber-600">
                    Expires {formatDistanceToNow(new Date(booking.expiresAt), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(booking)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>

              {/* Join session button */}
              {canJoin && (
                <Button
                  size="sm"
                  className={booking.liveSession?.status === SessionStatus.IN_PROGRESS 
                    ? "bg-green-600 hover:bg-green-700" 
                    : ""}
                  onClick={() => handleJoinSession(booking.liveSession.id)}
                  disabled={joinSessionMutation.isPending}
                >
                  {joinSessionMutation.isPending ? (
                    <LoadingSpinner size="sm" className="mr-1" />
                  ) : (
                    <Video className="h-4 w-4 mr-1" />
                  )}
                  {booking.liveSession?.status === SessionStatus.IN_PROGRESS ? "Join Live" : "Join Session"}
                </Button>
              )}

              {/* More actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {booking.liveSession?.meetingLink && (
                    <DropdownMenuItem onClick={() => copyMeetingLink(booking)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Meeting Link
                    </DropdownMenuItem>
                  )}
                  
                  {canReschedule && (
                    <DropdownMenuItem onClick={() => handleReschedule(booking)}>
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Reschedule
                    </DropdownMenuItem>
                  )}
                  
                  {canCancel && (
                    <DropdownMenuItem 
                      onClick={() => handleCancelClick(booking)}
                      className="text-red-600"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Session
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEmptyState = (icon: React.ElementType, title: string, description: string) => (
    <Card>
      <CardContent className="p-12 text-center">
        {React.createElement(icon, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" })}
        <h3 className="text-lg font-medium mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-2 text-gray-600">Loading your sessions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <XCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium mb-2 text-red-900">Failed to load sessions</h3>
          <p className="text-red-600 mb-4">{error.message || "Something went wrong"}</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with notifications */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold">My Sessions</h2>
            {autoRefresh && isFetching && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Updating...
              </div>
            )}
          </div>
          <p className="text-gray-600">Manage your booked sessions and track your progress</p>
          
          {/* Urgent notifications */}
          {urgentNotifications.length > 0 && (
            <div className="mt-4 space-y-2">
              {urgentNotifications.map((notification, index) => (
                <Alert 
                  key={index} 
                  className={notification.urgent 
                    ? "border-red-200 bg-red-50" 
                    : "border-amber-200 bg-amber-50"
                  }
                >
                  <Bell className={`h-4 w-4 ${notification.urgent ? 'text-red-600' : 'text-amber-600'}`} />
                  <AlertDescription className={notification.urgent ? 'text-red-800' : 'text-amber-800'}>
                    <strong>{notification.booking.offering?.title}:</strong> {notification.message}
                    {notification.type === 'session_starting' && canJoinSession(notification.booking) && (
                      <Button 
                        size="sm" 
                        className="ml-2"
                        onClick={() => handleJoinSession(notification.booking.liveSession.id)}
                      >
                        Join Now
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </div>
        
        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{bookingStats.upcomingSessions}</div>
            <div className="text-sm text-blue-700">Upcoming</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{bookingStats.sessionsTaken}</div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">{bookingStats.pending}</div>
            <div className="text-sm text-amber-700">Pending</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">${bookingStats.totalSpent.toFixed(2)}</div>
            <div className="text-sm text-purple-700">Total Spent</div>
          </div>
        </div>
      </div>

      {/* Enhanced filters and controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sessions, instructors, or topics..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Status filter */}
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status ({bookingStats.total})</SelectItem>
                <SelectItem value={BookingStatus.PENDING}>Pending ({bookingStats.pending})</SelectItem>
                <SelectItem value={BookingStatus.ACCEPTED}>Accepted ({bookingStats.accepted})</SelectItem>
                <SelectItem value={BookingStatus.COMPLETED}>Completed ({bookingStats.completed})</SelectItem>
                <SelectItem value={BookingStatus.CANCELLED}>Cancelled ({bookingStats.cancelled})</SelectItem>
                <SelectItem value={BookingStatus.REJECTED}>Rejected ({bookingStats.rejected})</SelectItem>
              </SelectContent>
            </Select>

            {/* Date range filter */}
            <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value as any }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Dates</SelectItem>
                <SelectItem value="TODAY">Today</SelectItem>
                <SelectItem value="TOMORROW">Tomorrow</SelectItem>
                <SelectItem value="THIS_WEEK">This Week</SelectItem>
                <SelectItem value="THIS_MONTH">This Month</SelectItem>
                <SelectItem value="PAST">Past Sessions</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort options */}
            <Select value={`${filters.sortBy}_${filters.sortOrder}`} onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('_');
              setFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any }));
            }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DATE_ASC">Date (Oldest)</SelectItem>
                <SelectItem value="DATE_DESC">Date (Newest)</SelectItem>
                <SelectItem value="CREATED_ASC">Created (Oldest)</SelectItem>
                <SelectItem value="CREATED_DESC">Created (Newest)</SelectItem>
                <SelectItem value="PRICE_ASC">Price (Low to High)</SelectItem>
                <SelectItem value="PRICE_DESC">Price (High to Low)</SelectItem>
                <SelectItem value="STATUS_ASC">Status (A-Z)</SelectItem>
                <SelectItem value="STATUS_DESC">Status (Z-A)</SelectItem>
              </SelectContent>
            </Select>

            {/* View options */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompactView(!showCompactView)}
              >
                {showCompactView ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                {showCompactView ? "Expanded" : "Compact"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? "bg-green-50 border-green-200" : ""}
              >
                <Bell className="h-4 w-4" />
                {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
              </Button>
            </div>
          </div>
          
          {/* Active filters display */}
          {(filters.search || filters.status !== "ALL" || filters.dateRange !== "ALL") && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.search && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{filters.search}"
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 ml-1"
                    onClick={() => setFilters(prev => ({ ...prev, search: "" }))}
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.status !== "ALL" && (
                <Badge variant="secondary" className="text-xs">
                  Status: {filters.status}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 ml-1"
                    onClick={() => setFilters(prev => ({ ...prev, status: "ALL" }))}
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.dateRange !== "ALL" && (
                <Badge variant="secondary" className="text-xs">
                  Date: {filters.dateRange.replace('_', ' ')}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 ml-1"
                    onClick={() => setFilters(prev => ({ ...prev, dateRange: "ALL" }))}
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => setFilters({
                  search: "",
                  status: "ALL",
                  dateRange: "ALL",
                  sortBy: "DATE",
                  sortOrder: "DESC"
                })}
              >
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredAndSortedBookings.length} of {bookings?.length || 0} sessions
        </p>
        {filteredAndSortedBookings.length > 0 && (
          <p className="text-sm text-gray-600">
            Sorted by {filters.sortBy.toLowerCase()} ({filters.sortOrder.toLowerCase()})
          </p>
        )}
      </div>

      {/* Bookings list */}
      <div className="space-y-4">
        {filteredAndSortedBookings.length > 0 ? (
          filteredAndSortedBookings.map(renderBookingCard)
        ) : (
          <div>
            {filters.search || filters.status !== "ALL" || filters.dateRange !== "ALL" ? (
              renderEmptyState(
                Search,
                "No sessions match your filters",
                "Try adjusting your search criteria or filters to find sessions."
              )
            ) : (
              renderEmptyState(
                BookOpen,
                "No sessions found",
                "You haven't booked any sessions yet. Start by browsing available instructors and sessions."
              )
            )}
          </div>
        )}
      </div>

      {/* Enhanced Booking Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Session Details
            </DialogTitle>
            <DialogDescription>
              Complete information about your session booking
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Quick actions bar */}
              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                {canJoinSession(selectedBooking) && (
                  <Button
                    onClick={() => handleJoinSession(selectedBooking.liveSession.id)}
                    disabled={joinSessionMutation.isPending}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Session
                  </Button>
                )}
                
                {selectedBooking.liveSession?.meetingLink && (
                  <Button
                    variant="outline"
                    onClick={() => copyMeetingLink(selectedBooking)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                )}
                
                {canRescheduleBooking(selectedBooking) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleReschedule(selectedBooking);
                    }}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                )}
                
                {canCancelBooking(selectedBooking) && (
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleCancelClick(selectedBooking);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-6">
                  {/* Instructor Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Instructor
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        {selectedBooking.offering?.instructor?.profileImage ? (
                          <img 
                            src={selectedBooking.offering.instructor.profileImage} 
                            alt="Instructor" 
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">
                            {selectedBooking.offering?.instructor?.firstName} {selectedBooking.offering?.instructor?.lastName}
                          </h4>
                          {selectedBooking.offering?.instructor?.email && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {selectedBooking.offering.instructor.email}
                            </p>
                          )}
                          {selectedBooking.offering?.averageRating > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{selectedBooking.offering.averageRating}</span>
                              <span className="text-xs text-gray-500">({selectedBooking.offering.totalBookings} sessions)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Session Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Session Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Date & Time</Label>
                          <p className="font-medium">
                            {selectedBooking.timeSlot ? (
                              <>
                                {format(new Date(selectedBooking.timeSlot.startTime), "EEEE, MMMM d, yyyy")}
                                <br />
                                <span className="text-blue-600">
                                  {format(new Date(selectedBooking.timeSlot.startTime), "h:mm a")} - {format(new Date(selectedBooking.timeSlot.endTime), "h:mm a")}
                                </span>
                              </>
                            ) : "To be scheduled"}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Duration</Label>
                          <p className="font-medium">
                            {selectedBooking.offering?.duration || 60} minutes
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Format</Label>
                          <p className="font-medium flex items-center gap-1">
                            <Monitor className="h-4 w-4" />
                            {selectedBooking.offering?.sessionFormat || 'Online'}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Type</Label>
                          <p className="font-medium flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {selectedBooking.offering?.sessionType || 'Individual'}
                          </p>
                        </div>
                      </div>

                      {selectedBooking.timeSlot?.timezone && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Timezone</Label>
                          <p className="font-medium flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            {selectedBooking.timeSlot.timezone}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Payment Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Base Price:</span>
                        <span className="font-medium">{selectedBooking.offering?.basePrice} {selectedBooking.offering?.currency}</span>
                      </div>
                      
                      {selectedBooking.timeSlot?.availability?.priceOverride && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Price Override:</span>
                          <span className="font-medium text-blue-600">
                            {selectedBooking.timeSlot.availability.priceOverride} {selectedBooking.timeSlot.availability.currency}
                          </span>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold">Final Price:</span>
                        <span className="font-bold text-green-600">
                          {getEffectivePrice(selectedBooking)} {getEffectiveCurrency(selectedBooking)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Status:</span>
                        {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {/* Status and Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Status & Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Booking Status:</span>
                        {getStatusBadge(selectedBooking.status)}
                      </div>
                      
                      {selectedBooking.liveSession && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Session Status:</span>
                          {getSessionStatusBadge(selectedBooking.liveSession.status)}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <Badge variant="outline" className={
                          selectedBooking.priority === 1 ? "border-red-200 text-red-700" :
                          selectedBooking.priority === 2 ? "border-yellow-200 text-yellow-700" :
                          "border-green-200 text-green-700"
                        }>
                          Priority {selectedBooking.priority}
                        </Badge>
                      </div>
                      
                      {selectedBooking.rescheduleCount > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Rescheduled:</span>
                          <span className="font-medium">{selectedBooking.rescheduleCount} times</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Requirements and Messages */}
                  {(selectedBooking.customTopic || selectedBooking.studentMessage || selectedBooking.customRequirements || selectedBooking.instructorResponse) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          Messages & Requirements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedBooking.customTopic && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Custom Topic</Label>
                            <p className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-800">{selectedBooking.customTopic}</p>
                          </div>
                        )}
                        
                        {selectedBooking.studentMessage && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Your Message</Label>
                            <p className="mt-1 p-3 bg-blue-50 rounded-lg text-gray-800">{selectedBooking.studentMessage}</p>
                          </div>
                        )}
                        
                        {selectedBooking.customRequirements && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Special Requirements</Label>
                            <p className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-800">{selectedBooking.customRequirements}</p>
                          </div>
                        )}
                        
                        {selectedBooking.instructorResponse && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Instructor Response</Label>
                            <p className="mt-1 p-3 bg-green-50 border-l-4 border-green-200 rounded-lg text-gray-800">{selectedBooking.instructorResponse}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Live Session Details */}
                  {selectedBooking.liveSession && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Video className="h-5 w-5" />
                          Live Session
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Session ID</Label>
                            <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedBooking.liveSession.id}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Status</Label>
                            <div className="mt-1">
                              {getSessionStatusBadge(selectedBooking.liveSession.status)}
                            </div>
                          </div>
                        </div>

                        {selectedBooking.liveSession.meetingLink && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Meeting Link</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input 
                                value={selectedBooking.liveSession.meetingLink} 
                                readOnly 
                                className="font-mono text-sm"
                              />
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyMeetingLink(selectedBooking)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(selectedBooking.liveSession.meetingLink, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Session preparation */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Headphones className="h-4 w-4" />
                            Session Preparation
                          </h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Test your audio and video before joining</li>
                            <li>• Join 5-10 minutes before the scheduled time</li>
                            <li>• Prepare your questions and materials</li>
                            <li>• Ensure stable internet connection</li>
                            <li>• Have a quiet environment ready</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {/* Session Features */}
                  {selectedBooking.offering && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Session Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className={`flex items-center gap-2 p-2 rounded ${selectedBooking.offering.recordingEnabled ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                            <VideoIcon className="h-4 w-4" />
                            <span className="text-sm">Recording</span>
                            {selectedBooking.offering.recordingEnabled ? <CheckCircle className="h-3 w-3 ml-auto" /> : <XCircle className="h-3 w-3 ml-auto" />}
                          </div>
                          
                          <div className={`flex items-center gap-2 p-2 rounded ${selectedBooking.offering.whiteboardEnabled ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">Whiteboard</span>
                            {selectedBooking.offering.whiteboardEnabled ? <CheckCircle className="h-3 w-3 ml-auto" /> : <XCircle className="h-3 w-3 ml-auto" />}
                          </div>
                          
                          <div className={`flex items-center gap-2 p-2 rounded ${selectedBooking.offering.screenShareEnabled ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm">Screen Share</span>
                            {selectedBooking.offering.screenShareEnabled ? <CheckCircle className="h-3 w-3 ml-auto" /> : <XCircle className="h-3 w-3 ml-auto" />}
                          </div>
                          
                          <div className={`flex items-center gap-2 p-2 rounded ${selectedBooking.offering.chatEnabled ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">Chat</span>
                            {selectedBooking.offering.chatEnabled ? <CheckCircle className="h-3 w-3 ml-auto" /> : <XCircle className="h-3 w-3 ml-auto" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Prerequisites and Materials */}
                  {(selectedBooking.offering?.prerequisites?.length > 0 || selectedBooking.offering?.materials?.length > 0 || selectedBooking.offering?.equipment?.length > 0) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Requirements & Materials
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedBooking.offering.prerequisites?.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Prerequisites</Label>
                            <ul className="mt-1 space-y-1">
                              {selectedBooking.offering.prerequisites.map((prereq: string, index: number) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                  <CheckCircle className="h-3 w-3 mt-0.5 text-blue-600 flex-shrink-0" />
                                  {prereq}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {selectedBooking.offering.materials?.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Materials</Label>
                            <ul className="mt-1 space-y-1">
                              {selectedBooking.offering.materials.map((material: string, index: number) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                  <FileText className="h-3 w-3 mt-0.5 text-purple-600 flex-shrink-0" />
                                  {material}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {selectedBooking.offering.equipment?.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Equipment Needed</Label>
                            <ul className="mt-1 space-y-1">
                              {selectedBooking.offering.equipment.map((equipment: string, index: number) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                  <Monitor className="h-3 w-3 mt-0.5 text-green-600 flex-shrink-0" />
                                  {equipment}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Booking Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Booking Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Booking Created</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(selectedBooking.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                        
                        {selectedBooking.acceptedAt && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Booking Accepted</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(selectedBooking.acceptedAt), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {selectedBooking.rejectedAt && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Booking Rejected</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(selectedBooking.rejectedAt), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {selectedBooking.cancelledAt && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <XCircle className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Booking Cancelled</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(selectedBooking.cancelledAt), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Cancel Session
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this session? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedBooking.offering?.title}</h4>
                <p className="text-sm text-gray-600">
                  with {selectedBooking.offering?.instructor?.firstName} {selectedBooking.offering?.instructor?.lastName}
                </p>
                {selectedBooking.timeSlot && (
                  <p className="text-sm text-gray-600">
                    {format(new Date(selectedBooking.timeSlot.startTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cancelReason">Reason for cancellation (optional)</Label>
                <Textarea
                  id="cancelReason"
                  placeholder="Let the instructor know why you're cancelling..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  {selectedBooking.paymentStatus === 'PAID' 
                    ? "A refund will be processed within 3-5 business days."
                    : "Since payment hasn't been processed, no refund is needed."
                  }
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCancelModalOpen(false);
                setCancelReason("");
              }}
            >
              Keep Session
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={cancelBookingMutation.isPending}
            >
              {cancelBookingMutation.isPending ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Cancel Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Reschedule Session
            </DialogTitle>
            <DialogDescription>
              Request to reschedule your session. The instructor will need to approve the new time.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedBooking.offering?.title}</h4>
                <p className="text-sm text-gray-600">
                  Currently scheduled for {selectedBooking.timeSlot && format(new Date(selectedBooking.timeSlot.startTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </p>
                {selectedBooking.rescheduleCount > 0 && (
                  <p className="text-sm text-amber-600">
                    This session has been rescheduled {selectedBooking.rescheduleCount} time(s) already.
                  </p>
                )}
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Rescheduling requires at least 24 hours notice and instructor approval. 
                  You can reschedule up to 2 times per booking.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="rescheduleReason">Reason for rescheduling</Label>
                <Textarea
                  id="rescheduleReason"
                  placeholder="Please explain why you need to reschedule..."
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // This would trigger reschedule logic - you'd need to implement the actual reschedule flow
                toast.info("Reschedule functionality would be implemented here");
                setIsRescheduleModalOpen(false);
              }}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Request Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}