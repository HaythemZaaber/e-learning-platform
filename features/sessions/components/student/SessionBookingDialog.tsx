"use client";

import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Star, 
  Video,
  MapPin,
  Globe,
  User,
  BookOpen,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from "date-fns";

import { 
  LiveSession, 
  InstructorProfile,
  SessionType,
  SessionFormat,
  SessionStatus,
  LiveSessionType
} from "@/features/sessions/types/session.types";

interface SessionWithInstructor extends LiveSession {
  instructor: InstructorProfile;
}

interface SessionBookingDialogProps {
  session: SessionWithInstructor;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (bookingData: {
    customRequirements?: string;
    studentMessage?: string;
  }) => void;
  isLoading: boolean;
}

export function SessionBookingDialog({
  session,
  isOpen,
  onClose,
  onBookingComplete,
  isLoading
}: SessionBookingDialogProps) {
  const [customRequirements, setCustomRequirements] = useState("");
  const [studentMessage, setStudentMessage] = useState("");
  const [currentStep, setCurrentStep] = useState<"details" | "confirmation">("details");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("confirmation");
  };

  const handleConfirmBooking = () => {
    onBookingComplete({
      customRequirements: customRequirements.trim() || undefined,
      studentMessage: studentMessage.trim() || undefined,
    });
  };

  const handleBack = () => {
    setCurrentStep("details");
  };

  const getSessionTypeIcon = (type: SessionType) => {
    switch (type) {
      case SessionType.INDIVIDUAL:
        return <User className="h-4 w-4" />;
      case SessionType.SMALL_GROUP:
        return <Users className="h-4 w-4" />;
      case SessionType.LARGE_GROUP:
        return <Users className="h-4 w-4" />;
      case SessionType.WORKSHOP:
        return <BookOpen className="h-4 w-4" />;
      case SessionType.MASTERCLASS:
        return <Zap className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getFormatIcon = (format: SessionFormat) => {
    switch (format) {
      case SessionFormat.ONLINE:
        return <Video className="h-4 w-4" />;
      case SessionFormat.OFFLINE:
        return <MapPin className="h-4 w-4" />;
      case SessionFormat.HYBRID:
        return <Globe className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const formatSessionDate = (date: Date) => {
    return format(new Date(date), "EEEE, MMMM dd, yyyy 'at' HH:mm");
  };

  const getAvailableSlots = () => {
    return session.maxParticipants - (session.currentParticipants || 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {currentStep === "details" ? "Book Session" : "Confirm Booking"}
          </DialogTitle>
        </DialogHeader>

        {currentStep === "details" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.instructor.personalWebsite || ""} />
                    <AvatarFallback>
                      {session.instructor.title?.charAt(0) || "I"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{session.title}</h3>
                    <p className="text-sm text-gray-600">{session.instructor.title}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">
                        {(session.instructor.averageSessionRating || 0).toFixed(1)} ({session.instructor.totalStudents || 0} students)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatSessionDate(session.scheduledStart)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{session.duration} minutes</span>
                  </div>
                                     <div className="flex items-center space-x-2">
                     {getSessionTypeIcon(session.sessionType === LiveSessionType.CUSTOM ? SessionType.INDIVIDUAL : SessionType.SMALL_GROUP)}
                     <span className="capitalize">{session.sessionType === LiveSessionType.CUSTOM ? 'Individual' : 'Group'}</span>
                   </div>
                  <div className="flex items-center space-x-2">
                    {getFormatIcon(session.sessionFormat)}
                    <span className="capitalize">{session.sessionFormat.toLowerCase()}</span>
                  </div>
                </div>

                {session.finalTopic && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Session Topic</p>
                    <p className="text-sm text-blue-700">{session.finalTopic}</p>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Price</p>
                    <p className="text-xs text-gray-600">Per person</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${session.pricePerPerson}</p>
                    <p className="text-xs text-gray-600">{session.currency}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Available spots:</span>
                  <Badge variant="outline">{getAvailableSlots()} remaining</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Custom Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Requirements (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customRequirements">Specific topics or questions you'd like to cover</Label>
                  <Textarea
                    id="customRequirements"
                    placeholder="e.g., I'd like to focus on React hooks and state management..."
                    value={customRequirements}
                    onChange={(e) => setCustomRequirements(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="studentMessage">Message to instructor (Optional)</Label>
                  <Textarea
                    id="studentMessage"
                    placeholder="Any additional information you'd like to share..."
                    value={studentMessage}
                    onChange={(e) => setStudentMessage(e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  "Continue to Confirmation"
                )}
              </Button>
            </div>
          </form>
        ) : (
          /* Confirmation Step */
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Booking Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.instructor.personalWebsite || ""} />
                    <AvatarFallback>
                      {session.instructor.title?.charAt(0) || "I"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{session.title}</h3>
                    <p className="text-sm text-gray-600">with {session.instructor.title}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date & Time</p>
                    <p className="font-medium">{formatSessionDate(session.scheduledStart)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium">{session.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Format</p>
                    <p className="font-medium capitalize">{session.sessionFormat.toLowerCase()}</p>
                  </div>
                                     <div>
                     <p className="text-gray-600">Type</p>
                     <p className="font-medium capitalize">{session.sessionType === LiveSessionType.CUSTOM ? 'Individual' : 'Group'}</p>
                   </div>
                </div>

                {customRequirements && (
                  <div>
                    <p className="text-gray-600 text-sm">Your Requirements</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{customRequirements}</p>
                  </div>
                )}

                {studentMessage && (
                  <div>
                    <p className="text-gray-600 text-sm">Message to Instructor</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{studentMessage}</p>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Total Price</span>
                  <span className="text-2xl font-bold text-gray-900">${session.pricePerPerson}</span>
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-orange-900">Important Information</h4>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• You'll receive a confirmation email with session details</li>
                      <li>• Meeting link will be sent 15 minutes before the session</li>
                      <li>• Cancellation policy: Free cancellation up to 24 hours before</li>
                      <li>• Payment will be processed immediately</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button 
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
