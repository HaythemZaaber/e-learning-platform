// features/sessions/components/student/SessionBooking.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useLiveSessionsStore } from '@/stores/liveSessions.store';
import { 
  SessionOffering, 
  BookingRequest, 
  SessionType, 
  SessionTopicType, 
  BookingStatus, 
  PaymentStatus,
  BookingMode
} from '@/features/sessions/types/session.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentProcessor } from '@/features/sessions/components/payment/PaymentProcessor';
import { 
  Calendar as CalendarIcon,
  Clock, 
  DollarSign, 
  Users, 
  BookOpen,
  MessageSquare,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Star,
  Globe,
  Video
} from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, isAfter, isBefore, addHours } from 'date-fns';

interface SessionBookingProps {
  offering?: SessionOffering;
  onBookingComplete?: (bookingRequest: BookingRequest) => void;
  onCancel?: () => void;
}

export function SessionBooking({ offering, onBookingComplete, onCancel }: SessionBookingProps) {
  const {
    createBookingRequest,
    getAvailableTimeSlots,
    isTimeSlotAvailable,
    formatPrice,
    formatDuration,
    isLoading,
    getActiveOfferings,
  } = useLiveSessionsStore();

  const [currentStep, setCurrentStep] = useState<'selection' | 'details' | 'schedule' | 'payment' | 'confirmation'>('selection');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [alternativeDates, setAlternativeDates] = useState<Date[]>([]);
  const [selectedOffering, setSelectedOffering] = useState<SessionOffering | null>(offering || null);
  
  const [bookingData, setBookingData] = useState({
    customTopic: '',
    topicDescription: '',
    customRequirements: '',
    studentMessage: '',
    offeredPrice: 0,
  });

  // Update booking data when offering changes
  useEffect(() => {
    if (selectedOffering) {
      setBookingData(prev => ({
        ...prev,
        offeredPrice: selectedOffering.basePrice,
      }));
    }
  }, [selectedOffering]);

  const [createdBooking, setCreatedBooking] = useState<BookingRequest | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Generate available time slots when date changes
  useEffect(() => {
    if (selectedDate && selectedOffering) {
      const slots = getAvailableTimeSlots(selectedDate, selectedOffering.id);
      const timeSlots = slots.map(slot => 
        format(slot.startTime, 'HH:mm')
      ).sort();
      setAvailableSlots(timeSlots);
      
      // Reset selected time if it's not available for this date
      if (selectedTime && !timeSlots.includes(selectedTime)) {
        setSelectedTime('');
      }
    }
  }, [selectedDate, selectedOffering?.id]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const now = new Date();
    const minDate = addHours(now, 12); // Minimum 12 hours advance booking
    
    if (isBefore(date, minDate)) {
      toast.error("Please select a date at least 12 hours in advance");
      return;
    }
    
    setSelectedDate(date);
  };

  const handleCreateBooking = async () => {
    if (!selectedOffering) {
      toast.error("Please select a session offering");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }

    if (selectedOffering.topicType === SessionTopicType.FLEXIBLE && !bookingData.customTopic.trim()) {
      toast.error("Please specify the topic you'd like to learn");
      return;
    }

    try {
      const newBooking: Omit<BookingRequest, 'id' | 'createdAt' | 'expiresAt'> = {
        offeringId: selectedOffering.id,
        studentId: 'current-user-id', // Replace with actual user ID
        bookingMode: BookingMode.REQUEST,
        preferredDate: selectedDate,
        preferredTime: selectedTime,
        alternativeDates,
        customTopic: selectedOffering.topicType === SessionTopicType.FLEXIBLE ? bookingData.customTopic : undefined,
        topicDescription: bookingData.topicDescription,
        customRequirements: bookingData.customRequirements,
        status: BookingStatus.PENDING,
        priority: 1,
        rescheduleCount: 0,
        offeredPrice: bookingData.offeredPrice,
        currency: selectedOffering.currency,
        paymentStatus: PaymentStatus.PENDING,
        studentMessage: bookingData.studentMessage,
        updatedAt: new Date(),
      };

       createBookingRequest(newBooking);
       const mockBooking: BookingRequest = {
         id: 'temp-' + Date.now(),
         ...newBooking,
         createdAt: new Date(),
         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
       };
       setCreatedBooking(mockBooking);
       setCurrentStep('payment');
       
     } catch (error) {
       toast.error("Failed to create booking request");
     }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('confirmation');
    toast.success("Booking confirmed! You'll receive a confirmation email shortly.");
    setTimeout(() => {
      if (createdBooking && onBookingComplete) {
        onBookingComplete(createdBooking);
      }
    }, 3000);
  };

  const handleOfferingSelect = (offering: SessionOffering) => {
    setSelectedOffering(offering);
    setCurrentStep('details');
  };

  const isDateDisabled = (date: Date) => {
    const now = new Date();
    const minDate = addHours(now, 12);
    const maxDate = addDays(now, 60); // Maximum 60 days in advance
    
    return isBefore(date, minDate) || isAfter(date, maxDate);
  };

  const getInstructorInfo = () => {
    // Mock instructor data - replace with actual data
    return {
      name: "Dr. Sarah Chen",
      avatar: "/api/placeholder/40/40",
      rating: 4.9,
      totalSessions: 234,
      responseTime: "Usually responds within 2 hours",
      expertise: ["React", "TypeScript", "Node.js", "System Design"],
    };
  };

  const instructor = getInstructorInfo();

  // Session Selection Step
  if (currentStep === 'selection') {
    const availableOfferings = getActiveOfferings();
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Choose a Live Session</h2>
          <p className="text-muted-foreground">Select from available instructor sessions</p>
        </div>
        
        {availableOfferings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No sessions available</h3>
              <p className="text-muted-foreground">Check back later for new session offerings.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableOfferings.map((offering) => (
              <Card key={offering.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleOfferingSelect(offering)}>
                <CardHeader>
                  <CardTitle className="text-lg">{offering.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {offering.shortDescription || offering.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={offering.sessionType === SessionType.INDIVIDUAL ? 'default' : 'secondary'}>
                      {offering.sessionType === SessionType.INDIVIDUAL ? '1-on-1' : `${offering.capacity} learners max`}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(offering.duration)}
                    </Badge>
                    <Badge variant="outline">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {formatPrice(offering.basePrice, offering.currency)}
                    </Badge>
                  </div>
                  
                  {offering.tags && offering.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {offering.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (currentStep === 'payment' && createdBooking) {
    return (
      <PaymentProcessor
        bookingRequest={createdBooking}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={(error: string) => {
          toast.error(error);
          setCurrentStep('schedule');
        }}
        onCancel={() => setCurrentStep('schedule')}
      />
    );
  }

  if (currentStep === 'confirmation') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
          <p className="text-muted-foreground mb-6">
            Your session has been booked successfully. You'll receive a confirmation email with the meeting details.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Session:</span>
              <span className="font-medium">{selectedOffering?.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-medium">{selectedOffering ? formatPrice(bookingData.offeredPrice, selectedOffering.currency) : ''}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Book Live Session</h2>
          <p className="text-muted-foreground">Complete your booking in a few simple steps</p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center mb-8">
        {['details', 'schedule', 'payment'].map((step, index) => (
          <React.Fragment key={step}>
            <div className={`flex items-center ${
              currentStep === step ? 'text-primary' : 
              ['details', 'schedule'].indexOf(currentStep) > ['details', 'schedule'].indexOf(step) 
                ? 'text-green-600' : 'text-muted-foreground'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === step ? 'border-primary bg-primary text-primary-foreground' :
                ['details', 'schedule'].indexOf(currentStep) > ['details', 'schedule'].indexOf(step)
                  ? 'border-green-600 bg-green-600 text-white' : 'border-muted-foreground'
              }`}>
                {['details', 'schedule'].indexOf(currentStep) > ['details', 'schedule'].indexOf(step) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="ml-2 font-medium">
                {step === 'details' ? 'Session Details' : 
                 step === 'schedule' ? 'Schedule' : 'Payment'}
              </span>
            </div>
            {index < 2 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                ['details', 'schedule'].indexOf(currentStep) > index ? 'bg-green-600' : 'bg-muted'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Session Details
                </CardTitle>
                <CardDescription>
                  Tell us about what you'd like to learn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedOffering?.topicType === SessionTopicType.FLEXIBLE && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="customTopic">What would you like to learn? *</Label>
                      <Input
                        id="customTopic"
                        value={bookingData.customTopic}
                        onChange={(e) => setBookingData({ ...bookingData, customTopic: e.target.value })}
                        placeholder={`e.g., Advanced ${selectedOffering?.domain} concepts, specific problem solving`}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topicDescription">Provide more details (optional)</Label>
                      <Textarea
                        id="topicDescription"
                        value={bookingData.topicDescription}
                        onChange={(e) => setBookingData({ ...bookingData, topicDescription: e.target.value })}
                        placeholder="Describe your current level, specific questions, or goals for this session..."
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="customRequirements">Special Requirements (optional)</Label>
                  <Textarea
                    id="customRequirements"
                    value={bookingData.customRequirements}
                    onChange={(e) => setBookingData({ ...bookingData, customRequirements: e.target.value })}
                    placeholder="Any specific tools, software, or setup requirements..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentMessage">Message to Instructor (optional)</Label>
                  <Textarea
                    id="studentMessage"
                    value={bookingData.studentMessage}
                    onChange={(e) => setBookingData({ ...bookingData, studentMessage: e.target.value })}
                    placeholder="Introduce yourself or ask any questions..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep('schedule')}>
                    Continue to Scheduling
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 'schedule' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Choose Date & Time
                </CardTitle>
                <CardDescription>
                  Select your preferred session time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={isDateDisabled}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Available Time Slots</Label>
                    {selectedDate ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.length > 0 ? (
                          availableSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              onClick={() => setSelectedTime(time)}
                              className="justify-start"
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                            </Button>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-8 text-muted-foreground">
                            No available slots for this date
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Please select a date first
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Alternative Dates (optional)</Label>
                  <p className="text-sm text-muted-foreground">
                    Select up to 2 alternative dates in case your preferred time isn't available
                  </p>
                  {/* Alternative dates selector would go here */}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('details')}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleCreateBooking}
                    disabled={!selectedDate || !selectedTime || isLoading}
                  >
                    {isLoading ? 'Creating Booking...' : 'Continue to Payment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Session Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">{selectedOffering?.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {selectedOffering?.description}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Duration:
                  </span>
                  <span className="font-medium">{selectedOffering ? formatDuration(selectedOffering.duration) : ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Type:
                  </span>
                  <span className="font-medium">
                    {selectedOffering?.sessionType === SessionType.INDIVIDUAL ? '1-on-1' : `Group (max ${selectedOffering?.capacity})`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Price:
                  </span>
                  <span className="font-medium">{selectedOffering ? formatPrice(selectedOffering.basePrice, selectedOffering.currency) : ''}</span>
                </div>
                {selectedDate && selectedTime && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        Date:
                      </span>
                      <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Time:
                      </span>
                      <span className="font-medium">
                        {format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {selectedOffering?.recordingEnabled && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                  <Video className="h-4 w-4" />
                  <span>Session recording included</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Instructor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src={instructor.avatar} 
                  alt={instructor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{instructor.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span>{instructor.rating}</span>
                    <span className="text-muted-foreground">
                      ({instructor.totalSessions} sessions)
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>{instructor.responseTime}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Expertise:</Label>
                <div className="flex flex-wrap gap-1">
                  {instructor.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Live video session</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Screen sharing & whiteboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Chat & Q&A support</span>
                </div>
                {selectedOffering?.recordingEnabled && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Session recording</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Follow-up support</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Cancellation Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Free cancellation:</span>
                <span className="font-medium">24+ hours before</span>
              </div>
              <div className="flex justify-between">
                <span>50% refund:</span>
                <span className="font-medium">12-24 hours before</span>
              </div>
              <div className="flex justify-between">
                <span>No refund:</span>
                <span className="font-medium">Less than 12 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}