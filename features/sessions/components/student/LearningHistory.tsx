"use client";

import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Star, 
  MessageSquare, 
  Download, 
  Eye,
  TrendingUp,
  BookOpen,
  Award,
  Target,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { format } from "date-fns";

import { 
  LiveSession, 
  SessionReview,
  SessionStatus
} from "@/features/sessions/types/session.types";

interface LearningHistoryProps {
  user: any;
  sessions: LiveSession[];
}

interface SessionWithDetails extends LiveSession {
  instructorName: string;
  instructorAvatar?: string;
  review?: SessionReview;
  rating?: number;
  comment?: string;
}

export function LearningHistory({ user, sessions }: LearningHistoryProps) {
  const [selectedSession, setSelectedSession] = useState<SessionWithDetails | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Mock data for demonstration - replace with actual data from API
  const mockSessions: SessionWithDetails[] = [
    {
      id: "1",
      bookingRequestId: "booking-1",
      offeringId: "offering-1",
      instructorId: "instructor-1",
      sessionType: "CUSTOM" as any,
      title: "Advanced React Hooks & Context",
      description: "Deep dive into React hooks and context API with practical examples",
      finalTopic: "Advanced React Hooks & Context",
      format: "ONLINE" as any,
      sessionFormat: "ONLINE" as any,
      sessionMode: "LIVE" as any,
      maxParticipants: 1,
      minParticipants: 1,
      currentParticipants: 1,
      scheduledStart: new Date("2024-01-15T14:00:00Z"),
      scheduledEnd: new Date("2024-01-15T15:00:00Z"),
      actualStart: new Date("2024-01-15T14:05:00Z"),
      actualEnd: new Date("2024-01-15T15:10:00Z"),
      duration: 60,
      actualDuration: 65,
      status: SessionStatus.COMPLETED,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      recordingUrl: "https://example.com/recording-1.mp4",
      recordingEnabled: true,
      materials: [
        "https://example.com/react-hooks-guide.pdf",
        "https://example.com/context-examples.zip"
      ],
      sessionNotes: "Great session! Student showed good understanding of hooks concepts.",
      summary: "Covered useState, useEffect, useContext, and custom hooks with practical examples.",
      sessionArtifacts: [
        "https://example.com/code-examples.zip",
        "https://example.com/session-notes.pdf"
      ],
      pricePerPerson: 75,
      totalRevenue: 75,
      platformFee: 7.5,
      instructorPayout: 67.5,
      currency: "USD",
      payoutStatus: "PAID" as any,
      createdAt: new Date("2024-01-10T10:00:00Z"),
      updatedAt: new Date("2024-01-15T15:10:00Z"),
      instructorName: "Sarah Johnson",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5,
      comment: "Excellent session! Sarah explained complex concepts very clearly and provided great examples."
    },
    {
      id: "2",
      bookingRequestId: "booking-2",
      offeringId: "offering-2",
      instructorId: "instructor-2",
      sessionType: "CUSTOM" as any,
      title: "TypeScript Fundamentals",
      description: "Learn TypeScript basics and advanced type system features",
      finalTopic: "TypeScript Fundamentals",
      format: "ONLINE" as any,
      sessionFormat: "ONLINE" as any,
      sessionMode: "LIVE" as any,
      maxParticipants: 1,
      minParticipants: 1,
      currentParticipants: 1,
      scheduledStart: new Date("2024-01-10T16:00:00Z"),
      scheduledEnd: new Date("2024-01-10T16:45:00Z"),
      actualStart: new Date("2024-01-10T16:02:00Z"),
      actualEnd: new Date("2024-01-10T16:47:00Z"),
      duration: 45,
      actualDuration: 45,
      status: SessionStatus.COMPLETED,
      meetingLink: "https://zoom.us/j/123456789",
      recordingUrl: "https://example.com/recording-2.mp4",
      recordingEnabled: true,
      materials: [
        "https://example.com/typescript-basics.pdf",
        "https://example.com/practice-exercises.zip"
      ],
      sessionNotes: "Student grasped TypeScript concepts well. Good progress on type definitions.",
      summary: "Covered basic types, interfaces, generics, and advanced type features.",
      sessionArtifacts: [
        "https://example.com/typescript-examples.zip",
        "https://example.com/homework-assignment.pdf"
      ],
      pricePerPerson: 60,
      totalRevenue: 60,
      platformFee: 6,
      instructorPayout: 54,
      currency: "USD",
      payoutStatus: "PAID" as any,
      createdAt: new Date("2024-01-08T09:00:00Z"),
      updatedAt: new Date("2024-01-10T16:47:00Z"),
      instructorName: "Mike Chen",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      rating: 4,
      comment: "Good session overall. Mike is knowledgeable and patient. Would recommend!"
    }
  ];

  // Convert LiveSession to SessionWithDetails by adding mock instructor data
  const sessionsWithDetails: SessionWithDetails[] = sessions.length > 0 ? sessions.map(session => ({
    ...session,
    instructorName: "Instructor", // This should come from actual instructor data
    instructorAvatar: undefined,
    rating: undefined,
    comment: undefined
  })) : [];

  const displaySessions = sessionsWithDetails.length > 0 ? sessionsWithDetails : mockSessions;

  // Calculate learning statistics
  const totalSessions = displaySessions.length;
  const totalHours = displaySessions.reduce((sum, session) => sum + (session.actualDuration || session.duration), 0) / 60;
  const averageRating = displaySessions.reduce((sum, session) => sum + (session.rating || 0), 0) / totalSessions;
  const totalSpent = displaySessions.reduce((sum, session) => sum + session.pricePerPerson, 0);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleViewDetails = (session: SessionWithDetails) => {
    setSelectedSession(session);
    setIsDetailDialogOpen(true);
  };

  const handleWriteReview = (session: SessionWithDetails) => {
    setSelectedSession(session);
    setIsReviewDialogOpen(true);
  };

  const handleDownloadRecording = (session: SessionWithDetails) => {
    if (session.recordingUrl) {
      window.open(session.recordingUrl, '_blank');
      toast.success("Opening recording...");
    } else {
      toast.error("Recording not available");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learning History</h2>
          <p className="text-gray-600 mt-1">
            Track your completed sessions and learning progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {displaySessions.length} sessions completed
          </Badge>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {displaySessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow duration-200">
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
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      with {session.instructorName}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(session.scheduledStart, "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{session.actualDuration || session.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>${session.pricePerPerson}</span>
                      </div>
                    </div>

                    {session.rating && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(session.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {session.rating}/5
                        </span>
                        {session.comment && (
                          <span className="text-sm text-gray-500 italic">
                            "{session.comment}"
                          </span>
                        )}
                      </div>
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
                  
                  {session.recordingUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadRecording(session)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Recording
                    </Button>
                  )}
                  
                  {!session.rating && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleWriteReview(session)}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Review
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
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No completed sessions</h3>
          <p className="text-gray-600">
            You haven't completed any sessions yet. Complete your first session to see your learning history here.
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
                  </div>
                </div>
              </div>

              <Separator />

              {/* Session Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Date</p>
                  <p className="text-gray-900">
                    {format(selectedSession.scheduledStart, "MMM dd, yyyy")}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-gray-900">
                    {selectedSession.actualDuration || selectedSession.duration} minutes
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Price</p>
                  <p className="text-gray-900">
                    ${selectedSession.pricePerPerson} {selectedSession.currency}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              </div>

              {/* Rating */}
              {selectedSession.rating && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
                    <div className="flex items-center space-x-2">
                      {renderStars(selectedSession.rating)}
                      <span className="text-gray-900 font-medium">
                        {selectedSession.rating}/5
                      </span>
                    </div>
                    {selectedSession.comment && (
                      <p className="text-gray-600 mt-2 italic">
                        "{selectedSession.comment}"
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Session Summary */}
              {selectedSession.summary && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Session Summary</p>
                    <p className="text-gray-900">{selectedSession.summary}</p>
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

              {/* Recording */}
              {selectedSession.recordingUrl && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Session Recording</p>
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadRecording(selectedSession)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download Recording
                    </Button>
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
                
                {!selectedSession.rating && (
                  <Button
                    onClick={() => {
                      setIsDetailDialogOpen(false);
                      setIsReviewDialogOpen(true);
                    }}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Write Review
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                How was your session with {selectedSession.instructorName}?
              </p>
              
              {/* TODO: Implement review form */}
              <div className="text-center py-4">
                <p className="text-gray-500">Review form coming soon...</p>
              </div>
              
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsReviewDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsReviewDialogOpen(false)}>
                  Submit Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
