"use client";

import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  Download,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

import { 
  LiveSession, 
  SessionStatus,
  SessionType,
  SessionFormat,
  SessionMode,
  LiveSessionType,
  PayoutStatus
} from "@/features/sessions/types/session.types";

interface UpcomingSessionsProps {
  user: any;
  sessions: LiveSession[];
}

interface SessionWithDetails extends LiveSession {
  instructorName: string;
  instructorAvatar?: string;
  instructorEmail?: string;
}

export function UpcomingSessions({ user, sessions }: UpcomingSessionsProps) {
  const [selectedSession, setSelectedSession] = useState<SessionWithDetails | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Mock data for demonstration - replace with actual data from API
  const mockSessions: SessionWithDetails[] = [
    {
      id: "1",
      bookingRequestId: "booking-1",
      offeringId: "offering-1",
      instructorId: "instructor-1",
      sessionType: LiveSessionType.CUSTOM,
      title: "Advanced React Hooks & Context",
      description: "Deep dive into React hooks and context API with practical examples",
      finalTopic: "Advanced React Hooks & Context",
      format: SessionFormat.ONLINE,
      sessionFormat: SessionFormat.ONLINE,
      sessionMode: SessionMode.LIVE,
      maxParticipants: 1,
      minParticipants: 1,
      currentParticipants: 1,
      scheduledStart: new Date("2024-01-20T14:00:00Z"),
      scheduledEnd: new Date("2024-01-20T15:00:00Z"),
      duration: 60,
      status: SessionStatus.CONFIRMED,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      meetingPassword: "react123",
      recordingEnabled: true,
      materials: [
        "https://example.com/react-hooks-guide.pdf",
        "https://example.com/context-examples.zip"
      ],
      sessionArtifacts: [
        "https://example.com/session-recording.mp4",
        "https://example.com/whiteboard-notes.pdf"
      ],
      pricePerPerson: 75,
      totalRevenue: 75,
      platformFee: 7.5,
      instructorPayout: 67.5,
      currency: "USD",
      payoutStatus: PayoutStatus.PENDING,
      createdAt: new Date("2024-01-15T10:00:00Z"),
      updatedAt: new Date("2024-01-17T14:30:00Z"),
      instructorName: "Sarah Johnson",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      instructorEmail: "sarah.johnson@email.com"
    },
    {
      id: "2",
      bookingRequestId: "booking-2",
      offeringId: "offering-2",
      instructorId: "instructor-2",
      sessionType: LiveSessionType.CUSTOM,
      title: "TypeScript Fundamentals",
      description: "Learn TypeScript basics and advanced type system features",
      finalTopic: "TypeScript Fundamentals",
      format: SessionFormat.ONLINE,
      sessionFormat: SessionFormat.ONLINE,
      sessionMode: SessionMode.LIVE,
      maxParticipants: 1,
      minParticipants: 1,
      currentParticipants: 1,
      scheduledStart: new Date("2024-01-25T16:00:00Z"),
      scheduledEnd: new Date("2024-01-25T16:45:00Z"),
      duration: 45,
      status: SessionStatus.SCHEDULED,
      meetingLink: "https://zoom.us/j/123456789",
      meetingPassword: "typescript456",
      recordingEnabled: true,
      materials: [
        "https://example.com/typescript-basics.pdf",
        "https://example.com/practice-exercises.zip"
      ],
      sessionArtifacts: [
        "https://example.com/session-recording.mp4",
        "https://example.com/code-examples.zip"
      ],
      pricePerPerson: 60,
      totalRevenue: 60,
      platformFee: 6,
      instructorPayout: 54,
      currency: "USD",
      payoutStatus: PayoutStatus.PENDING,
      createdAt: new Date("2024-01-16T09:00:00Z"),
      updatedAt: new Date("2024-01-16T09:00:00Z"),
      instructorName: "Mike Chen",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      instructorEmail: "mike.chen@email.com"
    }
  ];

  // Transform sessions to include instructor details if they don't have them
  const transformSessions = (sessions: LiveSession[]): SessionWithDetails[] => {
    return sessions.map(session => ({
      ...session,
      instructorName: (session as any).instructorName || "Instructor",
      instructorAvatar: (session as any).instructorAvatar,
      instructorEmail: (session as any).instructorEmail
    }));
  };

  const displaySessions = sessions.length > 0 ? transformSessions(sessions) : mockSessions;

  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.SCHEDULED:
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case SessionStatus.CONFIRMED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case SessionStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-orange-500" />;
      case SessionStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case SessionStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.SCHEDULED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case SessionStatus.CONFIRMED:
        return "bg-green-100 text-green-800 border-green-200";
      case SessionStatus.IN_PROGRESS:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case SessionStatus.COMPLETED:
        return "bg-green-100 text-green-800 border-green-200";
      case SessionStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleJoinSession = (session: SessionWithDetails) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
      toast.success("Opening meeting link...");
    } else {
      toast.error("Meeting link not available");
    }
  };

  const handleViewDetails = (session: SessionWithDetails) => {
    setSelectedSession(session);
    setIsDetailDialogOpen(true);
  };

  const isSessionStartingSoon = (session: SessionWithDetails) => {
    const now = new Date();
    const sessionStart = new Date(session.scheduledStart);
    const timeDiff = sessionStart.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff <= 1 && hoursDiff > 0;
  };

  const isSessionOverdue = (session: SessionWithDetails) => {
    const now = new Date();
    const sessionStart = new Date(session.scheduledStart);
    return now > sessionStart && session.status === SessionStatus.SCHEDULED;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Sessions</h2>
          <p className="text-gray-600 mt-1">
            Your scheduled and confirmed live learning sessions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {displaySessions.length} sessions
          </Badge>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {displaySessions.map((session) => (
          <Card 
            key={session.id} 
            className={`hover:shadow-md transition-shadow duration-200 ${
              isSessionStartingSoon(session) ? 'ring-2 ring-orange-200 bg-orange-50' : ''
            } ${
              isSessionOverdue(session) ? 'ring-2 ring-red-200 bg-red-50' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.instructorAvatar} />
                    <AvatarFallback>
                      {session.instructorName?.charAt(0) || "I"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {session.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(session.status)} text-xs`}
                      >
                        {getStatusIcon(session.status)}
                        <span className="ml-1 capitalize">
                          {session.status.toLowerCase().replace('_', ' ')}
                        </span>
                      </Badge>
                      
                      {isSessionStartingSoon(session) && (
                        <Badge variant="destructive" className="text-xs">
                          Starting Soon
                        </Badge>
                      )}
                      
                      {isSessionOverdue(session) && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      with {session.instructorName}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(session.scheduledStart, "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(session.scheduledStart, "HH:mm")} - {format(session.scheduledEnd, "HH:mm")}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span className="capitalize">{session.format.toLowerCase()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{session.currentParticipants}/{session.maxParticipants}</span>
                      </div>
                    </div>

                    {session.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {session.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(session)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  
                  {session.meetingLink && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleJoinSession(session)}
                      disabled={session.status === SessionStatus.CANCELLED}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displaySessions.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
          <p className="text-gray-600">
            You don't have any scheduled sessions. Browse available sessions to book your next learning experience.
          </p>
        </div>
      )}

      {/* Session Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-6">
              {/* Session Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{selectedSession.title}</h3>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedSession.instructorAvatar} />
                    <AvatarFallback>
                      {selectedSession.instructorName?.charAt(0) || "I"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedSession.instructorName}</p>
                    <p className="text-sm text-gray-600">Instructor</p>
                    {selectedSession.instructorEmail && (
                      <p className="text-sm text-gray-500">{selectedSession.instructorEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Session Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <Badge className={`${getStatusColor(selectedSession.status)} mt-1`}>
                    {getStatusIcon(selectedSession.status)}
                    <span className="ml-1 capitalize">
                      {selectedSession.status.toLowerCase().replace('_', ' ')}
                    </span>
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-gray-900">{selectedSession.duration} minutes</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Date & Time</p>
                  <p className="text-gray-900">
                    {format(selectedSession.scheduledStart, "MMM dd, yyyy 'at' HH:mm")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(selectedSession.scheduledStart, { addSuffix: true })}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Format</p>
                  <p className="text-gray-900 capitalize">
                    {selectedSession.format.toLowerCase()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Price</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedSession.pricePerPerson} {selectedSession.currency}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Recording</p>
                  <p className="text-gray-900">
                    {selectedSession.recordingEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>

              {/* Meeting Link */}
              {selectedSession.meetingLink && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Meeting Link</p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleJoinSession(selectedSession)}
                        disabled={selectedSession.status === SessionStatus.CANCELLED}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Join Meeting
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedSession.meetingLink!);
                          toast.success("Meeting link copied to clipboard");
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    {selectedSession.meetingPassword && (
                      <p className="text-sm text-gray-600 mt-1">
                        Password: {selectedSession.meetingPassword}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Materials */}
              {selectedSession.materials && selectedSession.materials.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Session Materials</p>
                    <div className="space-y-2">
                      {selectedSession.materials.map((material, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(material, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download Material {index + 1}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Session Artifacts */}
              {selectedSession.sessionArtifacts && selectedSession.sessionArtifacts.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Session Artifacts</p>
                    <div className="space-y-2">
                      {selectedSession.sessionArtifacts.map((artifact, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(artifact, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download Artifact {index + 1}
                          </Button>
                        </div>
                      ))}
                    </div>
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
                
                {selectedSession.meetingLink && selectedSession.status !== SessionStatus.CANCELLED && (
                  <Button
                    onClick={() => {
                      handleJoinSession(selectedSession);
                      setIsDetailDialogOpen(false);
                    }}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Join Session
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
