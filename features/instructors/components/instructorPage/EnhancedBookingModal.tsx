"use client";

import React, { useState } from "react";
import {
  Calendar,
  User,
  Users,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Video,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookingDetails {
  sessionType: "individual" | "group";
  duration: number;
  topic: string;
  specialRequirements: string;
  studentInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface SelectedDate {
  date: string;
}

interface EnhancedBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: SelectedDate;
  selectedSlot?: TimeSlot;
  instructorName: string;
  pricing: {
    individual: number;
    group: number;
  };
  onSubmit: (details: BookingDetails) => Promise<boolean>;
}

export default function EnhancedBookingModal({
  isOpen,
  onClose,
  selectedDate,
  selectedSlot,
  instructorName,
  pricing,
  onSubmit,
}: EnhancedBookingModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    sessionType: "individual",
    duration: 60,
    topic: "",
    specialRequirements: "",
    studentInfo: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bookingDetails.topic.trim()) {
      newErrors.topic = "Please enter a topic for your session";
    }

    if (!bookingDetails.studentInfo.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    if (!bookingDetails.studentInfo.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/\S+@\S+\.\S+/.test(bookingDetails.studentInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const success = await onSubmit(bookingDetails);
      if (success) {
        setStep(3); // Success step
      } else {
        setErrors({ submit: "Failed to submit booking. Please try again." });
      }
    } catch {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getSessionPrice = () => {
    return bookingDetails.sessionType === "individual" 
      ? pricing.individual 
      : pricing.group;
  };

  const totalPrice = getSessionPrice();

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Session Details</h3>
        <p className="text-gray-600">Let&apos;s get started with your booking details</p>
      </div>

             {/* Session Summary */}
       <Card className="border-blue-200 bg-blue-50">
         <CardContent className="p-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                 <Video className="h-5 w-5 text-blue-600" />
               </div>
               <div>
                 <p className="font-medium text-blue-900">Session with {instructorName}</p>
                 <p className="text-sm text-blue-700">
                   {selectedSlot?.startTime && new Date(selectedSlot.startTime).toLocaleDateString()} • {selectedSlot?.startTime && new Date(selectedSlot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - {selectedSlot?.endTime && new Date(selectedSlot.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                 </p>
               </div>
             </div>
             <Badge className="bg-blue-100 text-blue-700 border-blue-200">
               Available
             </Badge>
           </div>
         </CardContent>
       </Card>

      {/* Session Type Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Session Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${
              bookingDetails.sessionType === "individual" 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setBookingDetails(prev => ({ ...prev, sessionType: "individual" }))}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Individual Session</h4>
                  <p className="text-sm text-gray-600">1-on-1 personalized attention</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">${pricing.individual}</span>
                {bookingDetails.sessionType === "individual" && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              bookingDetails.sessionType === "group" 
                ? "border-green-500 bg-green-50" 
                : "border-gray-200 hover:border-green-300"
            }`}
            onClick={() => setBookingDetails(prev => ({ ...prev, sessionType: "group" }))}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium">Group Session</h4>
                  <p className="text-sm text-gray-600">Learn with peers</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">${pricing.group}</span>
                {bookingDetails.sessionType === "group" && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Session Duration */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Session Duration</Label>
        <Select 
          value={bookingDetails.duration.toString()} 
          onValueChange={(value) => setBookingDetails(prev => ({ ...prev, duration: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="90">1.5 hours</SelectItem>
            <SelectItem value="120">2 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={() => setStep(2)} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Learning Goals</h3>
        <p className="text-gray-600">Tell us about what you&apos;d like to learn</p>
      </div>

      {/* Session Topic */}
      <div className="space-y-4">
        <Label className="text-base font-medium">What would you like to learn?</Label>
        <Textarea
          placeholder="e.g., Advanced React hooks, Data structures, Machine learning basics..."
          value={bookingDetails.topic}
          onChange={(e) => setBookingDetails(prev => ({ ...prev, topic: e.target.value }))}
          className="min-h-[100px]"
        />
        {errors.topic && (
          <p className="text-sm text-red-600">{errors.topic}</p>
        )}
      </div>

      {/* Special Requirements */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Special Requirements (Optional)</Label>
        <Textarea
          placeholder="Any specific requirements, learning style preferences, or questions..."
          value={bookingDetails.specialRequirements}
          onChange={(e) => setBookingDetails(prev => ({ ...prev, specialRequirements: e.target.value }))}
          className="min-h-[80px]"
        />
      </div>

      {/* Student Information */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Your Information</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={bookingDetails.studentInfo.name}
              onChange={(e) => setBookingDetails(prev => ({ 
                ...prev, 
                studentInfo: { ...prev.studentInfo, name: e.target.value }
              }))}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={bookingDetails.studentInfo.email}
              onChange={(e) => setBookingDetails(prev => ({ 
                ...prev, 
                studentInfo: { ...prev.studentInfo, email: e.target.value }
              }))}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            value={bookingDetails.studentInfo.phone}
            onChange={(e) => setBookingDetails(prev => ({ 
              ...prev, 
              studentInfo: { ...prev.studentInfo, phone: e.target.value }
            }))}
          />
        </div>
      </div>

      {/* Booking Summary */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Session Type</span>
            <span className="font-medium">
              {bookingDetails.sessionType === "individual" ? "Individual" : "Group"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Duration</span>
            <span className="font-medium">{bookingDetails.duration} minutes</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Price</span>
            <span className="text-2xl font-bold text-blue-600">${totalPrice}</span>
          </div>
        </CardContent>
      </Card>

      {errors.submit && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="flex-1">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
             <div>
         <h3 className="text-lg font-semibold mb-2">Booking Confirmed!</h3>
         <p className="text-gray-600 mb-4">
           Your session has been successfully booked. You&apos;ll receive a confirmation email shortly.
         </p>
       </div>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Instructor:</span>
              <span className="font-medium">{instructorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {selectedDate?.date && new Date(selectedDate.date).toLocaleDateString()}
              </span>
            </div>
                         <div className="flex justify-between">
               <span className="text-gray-600">Time:</span>
               <span className="font-medium">
                 {selectedSlot?.startTime && new Date(selectedSlot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - {selectedSlot?.endTime && new Date(selectedSlot.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
               </span>
             </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium capitalize">{bookingDetails.sessionType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-green-600">${totalPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button onClick={onClose} className="w-full">
          Done
        </Button>
        <Button variant="outline" onClick={onClose} className="w-full">
          <BookOpen className="h-4 w-4 mr-2" />
          Browse More Courses
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book Session</DialogTitle>
          <DialogDescription>
            Schedule your learning session with {instructorName}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
