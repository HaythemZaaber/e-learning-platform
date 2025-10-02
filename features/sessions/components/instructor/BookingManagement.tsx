"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  useInstructorBookings, 
  useApproveSessionBooking, 
  useRejectSessionBooking,
  useCancelSessionBooking,
  useRescheduleSession,
  useStartSession,
  useCompleteSession,
  useMeetingInfo,
  useSessionParticipants
} from "../../hooks/useSessionBooking";
import { useSessionOfferings } from "../../hooks/useLiveSessions";
import { BookingStatus, SessionStatus } from "../../types/session.types";
import { StripeConnectSetup } from "./StripeConnectSetup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Edit,
  Trash2,
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
  Package,
  Plus,
  CreditCard,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface BookingManagementProps {
  instructorId: string;
}

export function BookingManagement({ instructorId }: BookingManagementProps) {
  const { user, getToken } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState<"approve" | "reject">("approve");
  const [activeTab, setActiveTab] = useState<BookingStatus | "ALL">("ALL");
  const [showStripeSetup, setShowStripeSetup] = useState(false);
  const [hasStripeConnect, setHasStripeConnect] = useState(false);
  const [isCheckingStripe, setIsCheckingStripe] = useState(true);

  // Queries
  const { data: bookings, isLoading, refetch } = useInstructorBookings(instructorId || '');
  const { data: meetingInfo } = useMeetingInfo(selectedBooking?.liveSession?.id || "");
  const { data: participants } = useSessionParticipants(selectedBooking?.liveSession?.id || "");
  const { data: offerings, isLoading: offeringsLoading } = useSessionOfferings({ instructorId: instructorId || '' });



  // Mutations
  const approveBookingMutation = useApproveSessionBooking();
  const rejectBookingMutation = useRejectSessionBooking();
  const cancelBookingMutation = useCancelSessionBooking();
  const rescheduleBookingMutation = useRescheduleSession();
  const startSessionMutation = useStartSession();
  const completeSessionMutation = useCompleteSession();

  // Group bookings by status (always use the full bookings array for counts)
  const allBookings = bookings || [];
  const pendingBookings = allBookings.filter(b => b.status === BookingStatus.PENDING);
  const acceptedBookings = allBookings.filter(b => b.status === BookingStatus.ACCEPTED);
  const completedBookings = allBookings.filter(b => b.status === BookingStatus.COMPLETED);
  const cancelledBookings = allBookings.filter(b => b.status === BookingStatus.CANCELLED);

  // Filter bookings by status for display (only when not showing "ALL")
  const filteredBookings = activeTab === "ALL" 
    ? allBookings 
    : allBookings.filter(booking => booking.status === activeTab);

  // Handle booking actions
  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleApproveBooking = async (bookingId: string, message?: string) => {
    try {
      await approveBookingMutation.mutateAsync({ id: bookingId, instructorMessage: message });
      refetch();
      setIsResponseModalOpen(false);
      setResponseMessage("");
    } catch (error) {
      console.error("Error approving booking:", error);
    }
  };

  const handleRejectBooking = async (bookingId: string, reason?: string) => {
    try {
      await rejectBookingMutation.mutateAsync({ id: bookingId, reason });
      refetch();
      setIsResponseModalOpen(false);
      setResponseMessage("");
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  const handleCancelBooking = async (bookingId: string, reason?: string) => {
    try {
      await cancelBookingMutation.mutateAsync({
        bookingId,
        reason,
        processRefund: true
      });
      refetch();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleStartSession = async (sessionId: string) => {
    try {
      await startSessionMutation.mutateAsync(sessionId);
      refetch();
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      await completeSessionMutation.mutateAsync({
        sessionId,
        completeData: {
          sessionId,
          summary: "Session completed successfully",
          actualDuration: 60
        }
      });
      refetch();
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };

  const handleJoinSession = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  // Get status badge color
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pending</Badge>;
      case BookingStatus.ACCEPTED:
        return <Badge variant="outline" className="border-green-500 text-green-700">Accepted</Badge>;
      case BookingStatus.REJECTED:
        return <Badge variant="outline" className="border-red-500 text-red-700">Rejected</Badge>;
      case BookingStatus.COMPLETED:
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Completed</Badge>;
      case BookingStatus.CANCELLED:
        return <Badge variant="outline" className="border-gray-500 text-gray-700">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get session status badge
  const getSessionStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.SCHEDULED:
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Scheduled</Badge>;
      case SessionStatus.IN_PROGRESS:
        return <Badge variant="outline" className="border-green-500 text-green-700">Live</Badge>;
      case SessionStatus.COMPLETED:
        return <Badge variant="outline" className="border-purple-500 text-purple-700">Completed</Badge>;
      case SessionStatus.CANCELLED:
        return <Badge variant="outline" className="border-red-500 text-red-700">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderBookingCard = (booking: any) => (
    <Card key={booking.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">
                {booking.student?.firstName} {booking.student?.lastName}
              </h4>
              <p className="text-sm text-gray-600">{booking.student?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(booking.status)}
            {booking.liveSession && getSessionStatusBadge(booking.liveSession.status)}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {booking.timeSlot && format(new Date(booking.timeSlot.startTime), "EEEE, MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {booking.timeSlot && 
                `${format(new Date(booking.timeSlot.startTime), "h:mm a")} - ${format(new Date(booking.timeSlot.endTime), "h:mm a")}`
              }
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>${booking.finalPrice || booking.offeredPrice}</span>
          </div>
        </div>

        {booking.customTopic && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Topic:</p>
            <p className="text-sm text-gray-600">{booking.customTopic}</p>
          </div>
        )}

        {booking.studentMessage && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Student Message:</p>
            <p className="text-sm text-gray-600 line-clamp-2">{booking.studentMessage}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock4 className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(booking)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>

            {booking.status === BookingStatus.PENDING && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-500 text-green-700 hover:bg-green-50"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setResponseType("approve");
                    setIsResponseModalOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setResponseType("reject");
                    setIsResponseModalOpen(true);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}

            {booking.status === BookingStatus.ACCEPTED && booking.liveSession && (
              <>
                {booking.liveSession.status === SessionStatus.SCHEDULED && (
                  <Button
                    size="sm"
                    onClick={() => handleStartSession(booking.liveSession.id)}
                    disabled={startSessionMutation.isPending}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start Session
                  </Button>
                )}
                
                {booking.liveSession.status === SessionStatus.IN_PROGRESS && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleJoinSession(booking.liveSession.meetingLink)}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Join Session
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteSession(booking.liveSession.id)}
                      disabled={completeSessionMutation.isPending}
                    >
                      <StopCircle className="h-4 w-4 mr-1" />
                      End Session
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Check Stripe Connect status
  useEffect(() => {
    const checkStripeConnectStatus = async () => {
      try {
        setIsCheckingStripe(true);
        const token = await getAuthToken();
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/connect/accounts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.account) {
            // Check if account is fully set up
            const isComplete = data.account.charges_enabled && 
                             data.account.payouts_enabled && 
                             data.account.details_submitted;
            setHasStripeConnect(isComplete);
          } else {
            setHasStripeConnect(false);
          }
        } else {
          setHasStripeConnect(false);
        }
      } catch (error) {
        console.error("Error checking Stripe Connect status:", error);
        setHasStripeConnect(false);
      } finally {
        setIsCheckingStripe(false);
      }
    };

    if (user?.id) {
      checkStripeConnectStatus();
    }
  }, [user?.id]);

  const getAuthToken = async () => {
    try {
      return await getToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  // Don't show loading if instructorId is not available
  if (!instructorId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-600">Instructor information not available</p>
        </div>
      </div>
    );
  }

  // Show loading only for actual data loading
  if (isLoading || offeringsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <div className="mt-4 text-sm text-gray-600">
          Loading bookings: {isLoading ? 'Yes' : 'No'}, 
          Loading offerings: {offeringsLoading ? 'Yes' : 'No'}, 
          Checking Stripe: {isCheckingStripe ? 'Yes' : 'No'}
        </div>
      </div>
    );
  }

  // Show content even if Stripe check is still loading
  if (isCheckingStripe) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Booking Management</h2>
            <p className="text-gray-600">Manage your session bookings and requests</p>
          </div>
          <div className="text-sm text-gray-500">Checking payment setup...</div>
        </div>
        
        {/* Show bookings even while checking Stripe */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookingStatus | "ALL")}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="ALL">All ({allBookings.length})</TabsTrigger>
            <TabsTrigger value={BookingStatus.PENDING}>Pending ({pendingBookings.length})</TabsTrigger>
            <TabsTrigger value={BookingStatus.ACCEPTED}>Accepted ({acceptedBookings.length})</TabsTrigger>
            <TabsTrigger value={BookingStatus.COMPLETED}>Completed ({completedBookings.length})</TabsTrigger>
            <TabsTrigger value={BookingStatus.CANCELLED}>Cancelled ({cancelledBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="ALL" className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map(renderBookingCard)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                  <p className="text-gray-600">You don't have any bookings yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (showStripeSetup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Payment Setup Required</h2>
            <p className="text-gray-600">Set up payment processing to receive bookings</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowStripeSetup(false)}
          >
            Back to Bookings
          </Button>
        </div>
        
        <StripeConnectSetup 
          onSetupComplete={() => {
            setShowStripeSetup(false);
            setHasStripeConnect(true);
            // Refresh the page or refetch data
            window.location.reload();
          }}
        />
      </div>
    );
  }

  // Check if instructor has any offerings
  if (!offerings || offerings.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Booking Management</h2>
            <p className="text-gray-600">Manage your session bookings and requests</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">No Session Offerings</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to create session offerings before you can receive booking requests from students.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/instructor/dashboard/sessions?tab=offerings'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Offering
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-gray-600">Manage your session bookings and requests</p>
        </div>
        
                 <div className="flex items-center gap-4">
           <div className="text-center">
             <div className="text-2xl font-bold text-blue-600">{pendingBookings.length}</div>
             <div className="text-sm text-gray-600">Pending</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-bold text-green-600">{acceptedBookings.length}</div>
             <div className="text-sm text-gray-600">Accepted</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-bold text-purple-600">{completedBookings.length}</div>
             <div className="text-sm text-gray-600">Completed</div>
           </div>
           
           {!hasStripeConnect && (
             <Button 
               variant="outline" 
               onClick={() => setShowStripeSetup(true)}
               className="border-orange-200 text-orange-600 hover:bg-orange-50"
             >
               <CreditCard className="h-4 w-4 mr-2" />
               Set Up Payments
             </Button>
           )}
         </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookingStatus | "ALL")}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ALL">All ({allBookings.length})</TabsTrigger>
          <TabsTrigger value={BookingStatus.PENDING}>Pending ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value={BookingStatus.ACCEPTED}>Accepted ({acceptedBookings.length})</TabsTrigger>
          <TabsTrigger value={BookingStatus.COMPLETED}>Completed ({completedBookings.length})</TabsTrigger>
          <TabsTrigger value={BookingStatus.CANCELLED}>Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="ALL" className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map(renderBookingCard)
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                <p className="text-gray-600">You don't have any bookings yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value={BookingStatus.PENDING} className="space-y-4">
          {pendingBookings.length > 0 ? (
            pendingBookings.map(renderBookingCard)
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No pending bookings</h3>
                <p className="text-gray-600">All booking requests have been processed.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value={BookingStatus.ACCEPTED} className="space-y-4">
          {acceptedBookings.length > 0 ? (
            acceptedBookings.map(renderBookingCard)
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <UserCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No accepted bookings</h3>
                <p className="text-gray-600">No accepted bookings at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value={BookingStatus.COMPLETED} className="space-y-4">
          {completedBookings.length > 0 ? (
            completedBookings.map(renderBookingCard)
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed sessions</h3>
                <p className="text-gray-600">No completed sessions yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value={BookingStatus.CANCELLED} className="space-y-4">
          {cancelledBookings.length > 0 ? (
            cancelledBookings.map(renderBookingCard)
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <XCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No cancelled bookings</h3>
                <p className="text-gray-600">No cancelled bookings at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Detailed information about this booking request
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Student Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {selectedBooking.student?.firstName} {selectedBooking.student?.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{selectedBooking.student?.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Session Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date</p>
                      <p className="font-medium">
                        {selectedBooking.timeSlot && format(new Date(selectedBooking.timeSlot.startTime), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time</p>
                      <p className="font-medium">
                        {selectedBooking.timeSlot && 
                          `${format(new Date(selectedBooking.timeSlot.startTime), "h:mm a")} - ${format(new Date(selectedBooking.timeSlot.endTime), "h:mm a")}`
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Duration</p>
                      <p className="font-medium">
                        {selectedBooking.timeSlot && 
                          Math.round((new Date(selectedBooking.timeSlot.endTime).getTime() - new Date(selectedBooking.timeSlot.startTime).getTime()) / (1000 * 60))
                        } minutes
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Price</p>
                      <p className="font-medium">${selectedBooking.finalPrice || selectedBooking.offeredPrice}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Topic and Requirements */}
              {(selectedBooking.customTopic || selectedBooking.studentMessage || selectedBooking.customRequirements) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Session Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedBooking.customTopic && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Topic</p>
                        <p className="text-gray-800">{selectedBooking.customTopic}</p>
                      </div>
                    )}
                    {selectedBooking.studentMessage && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Student Message</p>
                        <p className="text-gray-800">{selectedBooking.studentMessage}</p>
                      </div>
                    )}
                    {selectedBooking.customRequirements && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Special Requirements</p>
                        <p className="text-gray-800">{selectedBooking.customRequirements}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Live Session Information */}
              {selectedBooking.liveSession && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Live Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Status</span>
                      {getSessionStatusBadge(selectedBooking.liveSession.status)}
                    </div>
                    
                    {meetingInfo && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Meeting Link</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleJoinSession(meetingInfo.meetingLink)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Join Meeting
                        </Button>
                      </div>
                    )}

                    {participants && participants.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Participants</p>
                        <div className="space-y-2">
                          {participants.map((participant: any) => (
                            <div key={participant.id} className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {participant.user?.firstName} {participant.user?.lastName}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {participant.role}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                  Close
                </Button>
                
                {selectedBooking.status === BookingStatus.PENDING && (
                  <>
                    <Button
                      onClick={() => {
                        setIsDetailsModalOpen(false);
                        setResponseType("approve");
                        setIsResponseModalOpen(true);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Booking
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setIsDetailsModalOpen(false);
                        setResponseType("reject");
                        setIsResponseModalOpen(true);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Booking
                    </Button>
                  </>
                )}

                {selectedBooking.status === BookingStatus.ACCEPTED && selectedBooking.liveSession && (
                  <>
                    {selectedBooking.liveSession.status === SessionStatus.SCHEDULED && (
                      <Button
                        onClick={() => handleStartSession(selectedBooking.liveSession.id)}
                        disabled={startSessionMutation.isPending}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    )}
                    
                    {selectedBooking.liveSession.status === SessionStatus.IN_PROGRESS && (
                      <>
                        <Button
                          onClick={() => handleJoinSession(selectedBooking.liveSession.meetingLink)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleCompleteSession(selectedBooking.liveSession.id)}
                          disabled={completeSessionMutation.isPending}
                        >
                          <StopCircle className="h-4 w-4 mr-2" />
                          End Session
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Modal */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {responseType === "approve" ? "Approve Booking" : "Reject Booking"}
            </DialogTitle>
            <DialogDescription>
              {responseType === "approve" 
                ? "Send a message to the student (optional)"
                : "Provide a reason for rejection (optional)"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="responseMessage">
                {responseType === "approve" ? "Message to Student" : "Reason for Rejection"}
              </Label>
              <Textarea
                id="responseMessage"
                placeholder={
                  responseType === "approve" 
                    ? "Optional message to send to the student..."
                    : "Optional reason for rejecting this booking..."
                }
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsResponseModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (responseType === "approve") {
                    handleApproveBooking(selectedBooking.id, responseMessage);
                  } else {
                    handleRejectBooking(selectedBooking.id, responseMessage);
                  }
                }}
                disabled={
                  responseType === "approve" 
                    ? approveBookingMutation.isPending 
                    : rejectBookingMutation.isPending
                }
              >
                {responseType === "approve" ? "Approve" : "Reject"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
