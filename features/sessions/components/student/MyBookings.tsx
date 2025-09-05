"use client";

import { useState, useMemo } from "react";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  DollarSign, 
  User,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { format } from "date-fns";

import { 
  useUpdateBookingRequest,
  useCancelBookingRequest 
} from "@/features/sessions/hooks/useLiveSessions";
import { 
  BookingRequest, 
  BookingStatus,
  SessionType,
  SessionFormat
} from "@/features/sessions/types/session.types";

interface MyBookingsProps {
  user: any;
  bookings: BookingRequest[];
}

interface BookingWithDetails extends BookingRequest {
  instructorName: string;
  instructorAvatar?: string;
  sessionTitle: string;
  sessionType: SessionType;
  sessionFormat: SessionFormat;
  sessionDuration: number;
}

export function MyBookings({ user, bookings }: MyBookingsProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  const updateBooking = useUpdateBookingRequest();
  const cancelBooking = useCancelBookingRequest();

  // Mock data for demonstration - replace with actual data from API
  const mockBookings: BookingWithDetails[] = [
    {
      id: "1",
      offeringId: "offering-1",
      studentId: user?.id,
      bookingMode: "REQUEST" as any,
      preferredDate: new Date("2024-01-20T14:00:00Z"),
      preferredTime: "14:00",
      alternativeDates: [new Date("2024-01-21T14:00:00Z"), new Date("2024-01-22T14:00:00Z")],
      customTopic: "Advanced React Hooks",
      topicDescription: "I want to learn about custom hooks and advanced patterns",
      customRequirements: "Please prepare examples with TypeScript",
      studentMessage: "I'm really excited to learn from you!",
      status: BookingStatus.PENDING,
      priority: 1,
      rescheduleCount: 0,
      offeredPrice: 75,
      currency: "USD",
      paymentStatus: "PENDING" as any,
      expiresAt: new Date("2024-01-27T14:00:00Z"),
      createdAt: new Date("2024-01-15T10:00:00Z"),
      updatedAt: new Date("2024-01-15T10:00:00Z"),
      instructorName: "Sarah Johnson",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      sessionTitle: "Advanced React Hooks & Context",
      sessionType: SessionType.INDIVIDUAL,
      sessionFormat: SessionFormat.ONLINE,
      sessionDuration: 60
    },
    {
      id: "2",
      offeringId: "offering-2",
      studentId: user?.id,
      bookingMode: "REQUEST" as any,
      preferredDate: new Date("2024-01-25T16:00:00Z"),
      preferredTime: "16:00",
      alternativeDates: [],
      status: BookingStatus.ACCEPTED,
      priority: 2,
      rescheduleCount: 0,
      offeredPrice: 60,
      currency: "USD",
      paymentStatus: "PAID" as any,
      expiresAt: new Date("2024-02-01T16:00:00Z"),
      createdAt: new Date("2024-01-16T09:00:00Z"),
      updatedAt: new Date("2024-01-17T14:30:00Z"),
      instructorName: "Mike Chen",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      sessionTitle: "TypeScript Fundamentals",
      sessionType: SessionType.INDIVIDUAL,
      sessionFormat: SessionFormat.ONLINE,
      sessionDuration: 45
    },
    {
      id: "3",
      offeringId: "offering-3",
      studentId: user?.id,
      bookingMode: "REQUEST" as any,
      preferredDate: new Date("2024-01-18T10:00:00Z"),
      preferredTime: "10:00",
      alternativeDates: [],
      status: BookingStatus.REJECTED,
      priority: 1,
      rescheduleCount: 0,
      offeredPrice: 40,
      currency: "USD",
      paymentStatus: "FREE" as any,
      expiresAt: new Date("2024-01-25T10:00:00Z"),
      createdAt: new Date("2024-01-14T15:00:00Z"),
      updatedAt: new Date("2024-01-15T11:20:00Z"),
      instructorName: "Emma Davis",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      sessionTitle: "Node.js Backend Development Workshop",
      sessionType: SessionType.SMALL_GROUP,
      sessionFormat: SessionFormat.ONLINE,
      sessionDuration: 90
    }
  ];

  // Transform bookings to include instructor and session details
  const transformBookings = useMemo(() => {
    if (bookings.length > 0) {
      // In a real app, you would fetch instructor and session details for each booking
      // For now, we'll use mock data or create placeholder data
      return bookings.map((booking): BookingWithDetails => ({
        ...booking,
        instructorName: `Instructor ${booking.id}`, // Placeholder - replace with actual data
        instructorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor${booking.id}`,
        sessionTitle: booking.customTopic || `Session ${booking.id}`, // Use custom topic or fallback
        sessionType: booking.sessionType || SessionType.INDIVIDUAL,
        sessionFormat: SessionFormat.ONLINE, // Default to online
        sessionDuration: 60 // Default duration
      }));
    }
    return mockBookings;
  }, [bookings]);

  const filteredBookings = transformBookings.filter(booking => 
    filter === "all" || booking.status === filter
  );

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return <Clock className="h-4 w-4 text-orange-500" />;
      case BookingStatus.ACCEPTED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case BookingStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case BookingStatus.EXPIRED:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case BookingStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case BookingStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case BookingStatus.ACCEPTED:
        return "bg-green-100 text-green-800 border-green-200";
      case BookingStatus.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      case BookingStatus.EXPIRED:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case BookingStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200";
      case BookingStatus.COMPLETED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking.mutateAsync({ id: bookingId, reason: "Cancelled by student" });
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleViewDetails = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
          <p className="text-gray-600 mt-1">
            Track and manage your session booking requests
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {filteredBookings.length} bookings
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex items-center space-x-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === BookingStatus.PENDING ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(BookingStatus.PENDING)}
              >
                Pending
              </Button>
              <Button
                variant={filter === BookingStatus.ACCEPTED ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(BookingStatus.ACCEPTED)}
              >
                Accepted
              </Button>
              <Button
                variant={filter === BookingStatus.REJECTED ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(BookingStatus.REJECTED)}
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={booking.instructorAvatar} />
                    <AvatarFallback>
                      {booking.instructorName?.charAt(0) || "I"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {booking.sessionTitle}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(booking.status)} text-xs`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">
                          {booking.status.toLowerCase()}
                        </span>
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      with {booking.instructorName}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {booking.preferredDate ? format(booking.preferredDate, "MMM dd, yyyy") : "TBD"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{booking.preferredTime || "TBD"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${booking.offeredPrice}</span>
                      </div>
                    </div>

                    {booking.studentMessage && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        "{booking.studentMessage}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(booking)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  
                  {booking.status === BookingStatus.PENDING && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {filter === "all" 
              ? "You haven't made any booking requests yet."
              : `No ${filter.toLowerCase()} bookings found.`
            }
          </p>
        </div>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              {/* Session Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{selectedBooking.sessionTitle}</h3>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedBooking.instructorAvatar} />
                    <AvatarFallback>
                      {selectedBooking.instructorName?.charAt(0) || "I"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedBooking.instructorName}</p>
                    <p className="text-sm text-gray-600">Instructor</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <Badge className={`${getStatusColor(selectedBooking.status)} mt-1`}>
                    {getStatusIcon(selectedBooking.status)}
                    <span className="ml-1 capitalize">
                      {selectedBooking.status.toLowerCase()}
                    </span>
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Price</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedBooking.offeredPrice} {selectedBooking.currency}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Preferred Date</p>
                  <p className="text-gray-900">
                    {selectedBooking.preferredDate ? format(selectedBooking.preferredDate, "MMM dd, yyyy") : "TBD"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Preferred Time</p>
                  <p className="text-gray-900">{selectedBooking.preferredTime || "TBD"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Session Type</p>
                  <p className="text-gray-900 capitalize">
                    {selectedBooking.sessionType.toLowerCase().replace('_', ' ')}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Format</p>
                  <p className="text-gray-900 capitalize">
                    {selectedBooking.sessionFormat.toLowerCase()}
                  </p>
                </div>
              </div>

              {/* Custom Requirements */}
              {selectedBooking.customTopic && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Custom Topic</p>
                    <p className="text-gray-900">{selectedBooking.customTopic}</p>
                    {selectedBooking.topicDescription && (
                      <p className="text-sm text-gray-600 mt-1">{selectedBooking.topicDescription}</p>
                    )}
                  </div>
                </>
              )}

              {selectedBooking.customRequirements && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Special Requirements</p>
                  <p className="text-gray-900">{selectedBooking.customRequirements}</p>
                </div>
              )}

              {/* Student Message */}
              {selectedBooking.studentMessage && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Message</p>
                    <p className="text-gray-900 italic">"{selectedBooking.studentMessage}"</p>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Close
                </Button>
                
                {selectedBooking.status === BookingStatus.PENDING && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleCancelBooking(selectedBooking.id);
                      setIsDetailDialogOpen(false);
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
