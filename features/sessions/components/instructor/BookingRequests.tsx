"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Video, 
  Phone,
  Eye,
  Star,
  Filter,
  Search,
  SortAsc,
  SortDesc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { format } from "date-fns";

import { 
  useBookingRequests, 
  useApproveBooking, 
  useRejectBooking,
  useUpdateBookingStatus 
} from "@/features/sessions/hooks/useLiveSessions";
import { 
  BookingRequest, 
  BookingStatus, 
  SessionType, 
  SessionFormat 
} from "@/features/sessions/types/session.types";

interface BookingRequestsProps {
  user: any;
}

interface BookingRequestWithDetails extends BookingRequest {
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  sessionTitle: string;
  sessionType: SessionType;
  sessionFormat: SessionFormat;
  sessionPrice: number;
  sessionDuration: number;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionLocation?: string;
  sessionMeetingLink?: string;
}

export function BookingRequests({ user }: BookingRequestsProps) {
  const [selectedRequest, setSelectedRequest] = useState<BookingRequestWithDetails | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "student" | "session">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch booking requests
  const { data: requests = [], isLoading } = useBookingRequests(user?.id || "");
  const approveBooking = useApproveBooking();
  const rejectBooking = useRejectBooking();
  const updateStatus = useUpdateBookingStatus();

  // Mock data for demonstration - replace with actual data from API
  const mockRequests: BookingRequestWithDetails[] = [
    {
      id: "1",
      offeringId: "offering-1",
      studentId: "student-1",
      bookingMode: "REQUEST" as any,
      status: BookingStatus.PENDING,
      requestDate: new Date("2024-01-15T10:00:00Z"),
      preferredDate: new Date("2024-01-20T14:00:00Z"),
      message: "I'm really interested in learning advanced React concepts. I have some experience with basics but want to dive deeper into hooks and context.",
      studentMessage: "I'm really interested in learning advanced React concepts. I have some experience with basics but want to dive deeper into hooks and context.",
      studentName: "Sarah Johnson",
      studentEmail: "sarah.johnson@email.com",
      studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      sessionTitle: "Advanced React Hooks & Context",
      sessionType: SessionType.INDIVIDUAL,
      sessionFormat: SessionFormat.ONLINE,
      sessionPrice: 75,
      sessionDuration: 60,
      sessionStartTime: "2024-01-20T14:00:00Z",
      sessionEndTime: "2024-01-20T15:00:00Z",
      sessionMeetingLink: "https://meet.google.com/abc-defg-hij",
      alternativeDates: [],
      priority: 1,
      rescheduleCount: 0,
      offeredPrice: 75,
      currency: "USD",
      paymentStatus: "PENDING" as any,
      expiresAt: new Date("2024-01-22T10:00:00Z"),
      createdAt: new Date("2024-01-15T10:00:00Z"),
      updatedAt: new Date("2024-01-15T10:00:00Z")
    },
    {
      id: "2",
      offeringId: "offering-2",
      studentId: "student-2",
      bookingMode: "REQUEST" as any,
      status: BookingStatus.PENDING,
      requestDate: new Date("2024-01-15T09:30:00Z"),
      preferredDate: new Date("2024-01-22T16:00:00Z"),
      message: "Looking for help with TypeScript fundamentals. I'm transitioning from JavaScript and need guidance on types and interfaces.",
      studentMessage: "Looking for help with TypeScript fundamentals. I'm transitioning from JavaScript and need guidance on types and interfaces.",
      studentName: "Mike Chen",
      studentEmail: "mike.chen@email.com",
      studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      sessionTitle: "TypeScript Fundamentals",
      sessionType: SessionType.INDIVIDUAL,
      sessionFormat: SessionFormat.ONLINE,
      sessionPrice: 60,
      sessionDuration: 45,
      sessionStartTime: "2024-01-22T16:00:00Z",
      sessionEndTime: "2024-01-22T16:45:00Z",
      sessionMeetingLink: "https://meet.google.com/xyz-uvw-rst",
      alternativeDates: [],
      priority: 1,
      rescheduleCount: 0,
      offeredPrice: 60,
      currency: "USD",
      paymentStatus: "PENDING" as any,
      expiresAt: new Date("2024-01-24T09:30:00Z"),
      createdAt: new Date("2024-01-15T09:30:00Z"),
      updatedAt: new Date("2024-01-15T09:30:00Z")
    },
    {
      id: "3",
      offeringId: "offering-3",
      studentId: "student-3",
      bookingMode: "REQUEST" as any,
      status: BookingStatus.ACCEPTED,
      requestDate: new Date("2024-01-14T15:00:00Z"),
      preferredDate: new Date("2024-01-18T10:00:00Z"),
      message: "Interested in the group workshop on Node.js backend development.",
      studentMessage: "Interested in the group workshop on Node.js backend development.",
      studentName: "Emma Davis",
      studentEmail: "emma.davis@email.com",
      studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      sessionTitle: "Node.js Backend Development Workshop",
      sessionType: SessionType.SMALL_GROUP,
      sessionFormat: SessionFormat.ONLINE,
      sessionPrice: 40,
      sessionDuration: 90,
      sessionStartTime: "2024-01-18T10:00:00Z",
      sessionEndTime: "2024-01-18T11:30:00Z",
      sessionMeetingLink: "https://meet.google.com/def-ghi-jkl",
      alternativeDates: [],
      priority: 1,
      rescheduleCount: 0,
      offeredPrice: 40,
      currency: "USD",
      paymentStatus: "PAID" as any,
      expiresAt: new Date("2024-01-16T15:00:00Z"),
      acceptedAt: new Date("2024-01-15T10:00:00Z"),
      createdAt: new Date("2024-01-14T15:00:00Z"),
      updatedAt: new Date("2024-01-15T10:00:00Z")
    }
  ];

  // Filter and sort requests
  const filteredRequests = mockRequests.filter(request => {
    const matchesFilter = filter === "all" || request.status === filter;
    const matchesSearch = 
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.message?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    return matchesFilter && matchesSearch;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "date":
        comparison = (a.requestDate?.getTime() || 0) - (b.requestDate?.getTime() || 0);
        break;
      case "student":
        comparison = a.studentName.localeCompare(b.studentName);
        break;
      case "session":
        comparison = a.sessionTitle.localeCompare(b.sessionTitle);
        break;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Handle booking approval
  const handleApprove = async (requestId: string) => {
    try {
      await approveBooking.mutateAsync({ bookingId: requestId, instructorId: user?.id });
      toast.success("Booking request approved!");
    } catch (error) {
      toast.error("Failed to approve booking request");
    }
  };

  // Handle booking rejection
  const handleReject = async (requestId: string, reason?: string) => {
    try {
      await rejectBooking.mutateAsync({ bookingId: requestId, instructorId: user?.id, reason });
      toast.success("Booking request rejected");
    } catch (error) {
      toast.error("Failed to reject booking request");
    }
  };

  // Handle status update
  const handleStatusUpdate = async (requestId: string, status: BookingStatus) => {
    try {
      await updateStatus.mutateAsync({ bookingId: requestId, status, instructorId: user?.id });
      toast.success("Booking status updated!");
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "ACCEPTED":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "CANCELLED":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getFormatIcon = (format: SessionFormat) => {
    switch (format) {
      case "ONLINE":
        return <Video className="h-4 w-4 text-blue-600" />;
      case "OFFLINE":
        return <MapPin className="h-4 w-4 text-green-600" />;
      case "HYBRID":
        return <Video className="h-4 w-4 text-purple-600" />;
      default:
        return <Video className="h-4 w-4" />;
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
          <h2 className="text-2xl font-bold">Booking Requests</h2>
          <p className="text-muted-foreground">
            Manage student booking requests for your sessions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {sortedRequests.filter(r => r.status === "PENDING").length} Pending
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ACCEPTED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="session">Session</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {sortedRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No booking requests</h3>
              <p className="text-muted-foreground text-center">
                {filter === "all" 
                  ? "You don't have any booking requests yet."
                  : `No ${filter.toLowerCase()} booking requests found.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.studentAvatar} />
                      <AvatarFallback>
                        {request.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{request.studentName}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <h4 className="font-medium text-sm mb-1">{request.sessionTitle}</h4>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {request.preferredDate && format(new Date(request.preferredDate), "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {request.preferredDate && format(new Date(request.preferredDate), "HH:mm")}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${request.sessionPrice}
                        </span>
                        <span className="flex items-center gap-1">
                          {getFormatIcon(request.sessionFormat)}
                          {request.sessionFormat}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {request.message}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-muted-foreground">
                          Requested {request.requestDate && format(new Date(request.requestDate), "MMM d, yyyy 'at' HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    
                    {request.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          disabled={approveBooking.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          disabled={rejectBooking.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {request.status === BookingStatus.ACCEPTED && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(request.id, BookingStatus.CANCELLED)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Request Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedRequest.studentAvatar} />
                  <AvatarFallback>
                    {selectedRequest.studentName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedRequest.studentName}</h3>
                  <p className="text-muted-foreground">{selectedRequest.studentEmail}</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              {/* Session Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Session Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Session Title</Label>
                    <p className="text-sm">{selectedRequest.sessionTitle}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Session Type</Label>
                    <p className="text-sm">{selectedRequest.sessionType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Format</Label>
                    <p className="text-sm flex items-center gap-1">
                      {getFormatIcon(selectedRequest.sessionFormat)}
                      {selectedRequest.sessionFormat}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Duration</Label>
                    <p className="text-sm">{selectedRequest.sessionDuration} minutes</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <p className="text-sm">${selectedRequest.sessionPrice}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Preferred Date</Label>
                    <p className="text-sm">
                      {selectedRequest.preferredDate && format(new Date(selectedRequest.preferredDate), "MMM d, yyyy 'at' HH:mm")}
                    </p>
                  </div>
                </div>
                
                {selectedRequest.sessionLocation && (
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm">{selectedRequest.sessionLocation}</p>
                  </div>
                )}
                
                {selectedRequest.sessionMeetingLink && (
                  <div>
                    <Label className="text-sm font-medium">Meeting Link</Label>
                    <p className="text-sm">
                      <a 
                        href={selectedRequest.sessionMeetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedRequest.sessionMeetingLink}
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {/* Student Message */}
              <div>
                <Label className="text-sm font-medium">Student Message</Label>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="text-sm">{selectedRequest.message}</p>
                </div>
              </div>

              {/* Request Timeline */}
              <div>
                <Label className="text-sm font-medium">Request Timeline</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Request submitted</span>
                    <span className="text-muted-foreground">
                      {selectedRequest.requestDate && format(new Date(selectedRequest.requestDate), "MMM d, yyyy 'at' HH:mm")}
                    </span>
                  </div>
                  {selectedRequest.status !== "PENDING" && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Request {selectedRequest.status.toLowerCase()}</span>
                      <span className="text-muted-foreground">Recently</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.status === "PENDING" && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setIsDetailDialogOpen(false);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setIsDetailDialogOpen(false);
                    }}
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
