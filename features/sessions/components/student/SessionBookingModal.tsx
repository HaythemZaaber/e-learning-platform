"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCreateSessionBooking } from "../../hooks/useSessionBooking";
import { useCreatePaymentIntent, usePaymentValidation } from "../../hooks/useStripeConnect";
import { PaymentForm } from "./PaymentForm";
import { CreateSessionBookingDto } from "../../services/api/sessionBookingApi";
import { SessionOffering, TimeSlot, BookingStatus } from "../../types/session.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  Calendar,
  Clock,
  User,
  Users,
  DollarSign,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Video,
  CreditCard,
  Shield,
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
  Star,
  BookOpen,
  Target,
  Award,
  Monitor,
  Mic,
  Camera,
  MessageCircle,
  FileText,
  Settings,
  Globe,
  Timer,
  PlayCircle,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { format as formatDate, addMinutes } from "date-fns";
import { toast } from "sonner";

interface SessionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot: TimeSlot;
  offeringsData?: any[];
  instructorName: string;
  instructorId: string;
  onBookingComplete?: (bookingId: string) => void;
}

interface BookingFormData {
  customTopic: string;
  studentMessage: string;
  customRequirements: string;
  agreedPrice: number;
  currency: string;
}

export function SessionBookingModal({
  isOpen,
  onClose,
  selectedSlot,
  offeringsData,
  instructorName,
  instructorId,
  onBookingComplete,
}: SessionBookingModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedOffering, setSelectedOffering] = useState<SessionOffering | null>(null);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    customTopic: "",
    studentMessage: "",
    customRequirements: "",
    agreedPrice: 0,
    currency: "USD",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [checkoutSession, setCheckoutSession] = useState<any>(null);

  // Mutations
  const createBookingMutation = useCreateSessionBooking();
  const createPaymentIntentMutation = useCreatePaymentIntent();
  
  // Payment validation
  const { hasStripeAccount, isStripeComplete } = usePaymentValidation();

  // Get compatible offerings based on selected slot
  const getCompatibleOfferings = () => {
    if (!offeringsData) return [];
    
    const availableOfferings = offeringsData.filter(offering => offering.isActive);
    
    // Filter offerings based on slot's maxBookings
    if (selectedSlot.maxBookings === 1) {
      // For slots with max 1 booking, only show individual session offerings
      return availableOfferings.filter(offering => 
        offering.sessionType === 'INDIVIDUAL'
      );
    } else if (selectedSlot.maxBookings > 1) {
      // For slots with multiple bookings, only show group session offerings
      return availableOfferings.filter(offering => 
        offering.sessionType === 'SMALL_GROUP' || 
        offering.sessionType === 'LARGE_GROUP' || 
        offering.sessionType === 'WORKSHOP' || 
        offering.sessionType === 'MASTERCLASS'
      );
    }
    
    return availableOfferings;
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedOffering(null);
      setBookingData({
        customTopic: "",
        studentMessage: "",
        customRequirements: "",
        agreedPrice: 0,
        currency: "USD",
      });
      setErrors({});
      setCreatedBooking(null);
      setPaymentIntent(null);
      setCheckoutSession(null);
    }
  }, [isOpen]);

  // Update booking data when offering is selected
  useEffect(() => {
    if (selectedOffering) {
      setBookingData(prev => ({
        ...prev,
        agreedPrice: selectedOffering.basePrice,
        currency: selectedOffering.currency,
      }));
    }
  }, [selectedOffering]);

  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedOffering?.topicType === "FLEXIBLE" && !bookingData.customTopic.trim()) {
      newErrors.customTopic = "Please specify what you'd like to learn";
    }

    if (!bookingData.studentMessage.trim()) {
      newErrors.studentMessage = "Please provide a message to the instructor";
    }

    if (bookingData.agreedPrice <= 0) {
      newErrors.agreedPrice = "Please enter a valid price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!user) {
      toast.error("Please sign in to book a session");
      return;
    }

    if (!selectedOffering) {
      toast.error("Please select a session type first");
      return;
    }

    try {
      const bookingDto: CreateSessionBookingDto = {
        timeSlotId: selectedSlot.id,
        offeringId: selectedOffering.id,
        studentId: user.id,
        customTopic: bookingData.customTopic || undefined,
        studentMessage: bookingData.studentMessage,
        customRequirements: bookingData.customRequirements || undefined,
        agreedPrice: bookingData.agreedPrice,
        currency: bookingData.currency,
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      };

      const result = await createBookingMutation.mutateAsync(bookingDto);

      if (result.success) {
        setCreatedBooking(result.bookingRequest);
        setPaymentIntent(result.paymentIntent);
        setCheckoutSession(result.checkoutSession);

        if (result.checkoutSession?.url) {
          // Show payment step with checkout session
          setCurrentStep(3);
        } else if (result.autoApproved) {
          // Auto-approved booking, proceed to payment
          setCurrentStep(3);
        } else {
          // Manual approval required
          setCurrentStep(2);
        }
      } else {
        toast.error(result.error || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking request");
    }
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentIntentId: string) => {
    setCurrentStep(4);
    if (onBookingComplete) {
      onBookingComplete(createdBooking.id);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    toast.error("Payment failed. Please try again.");
  };

  // Handle payment cancel
  const handlePaymentCancel = () => {
    setCurrentStep(1);
    setCreatedBooking(null);
    setPaymentIntent(null);
    setCheckoutSession(null);
  };

  // Calculate session duration
  const sessionDuration = Math.round(
    (new Date(selectedSlot.endTime).getTime() - new Date(selectedSlot.startTime).getTime()) / (1000 * 60)
  );

  // Format slot time
  const formatSlotTime = (date: Date) => {
    return formatDate(date, "EEEE, MMMM d, yyyy 'at' h:mm a");
  };

  // Get session type display info
  const getSessionTypeInfo = (sessionType: string) => {
    switch (sessionType) {
      case 'INDIVIDUAL':
        return {
          icon: User,
          label: '1-on-1 Session',
          description: 'Personalized one-on-one attention',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      case 'SMALL_GROUP':
        return {
          icon: Users,
          label: 'Small Group',
          description: 'Learn with 2-8 other students',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'LARGE_GROUP':
        return {
          icon: Users,
          label: 'Large Group',
          description: 'Interactive group learning experience',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'WORKSHOP':
        return {
          icon: BookOpen,
          label: 'Workshop',
          description: 'Hands-on practical learning',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case 'MASTERCLASS':
        return {
          icon: Award,
          label: 'Masterclass',
          description: 'Expert-level deep dive',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        };
      default:
        return {
          icon: Video,
          label: 'Session',
          description: 'Learning session',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const renderStep1 = () => {
    const compatibleOfferings = getCompatibleOfferings();
    const isIndividualSlot = selectedSlot.maxBookings === 1;

    return (
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Session Type
          </h3>
          <p className="text-gray-600">Select the perfect learning experience for this time slot</p>
        </div>

        {/* Enhanced Session Summary */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 text-lg">Session with {instructorName}</p>
                  <p className="text-sm text-blue-700 font-medium">
                    {formatSlotTime(new Date(selectedSlot.startTime))}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Timer className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-700">{sessionDuration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isIndividualSlot ? (
                        <User className="h-4 w-4 text-purple-600" />
                      ) : (
                        <Users className="h-4 w-4 text-green-600" />
                      )}
                      <span className="text-sm text-blue-700">
                        {isIndividualSlot ? 'Individual Slot' : `Group Slot (max ${selectedSlot.maxBookings})`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-2">
                <Globe className="h-4 w-4 mr-1" />
                Online
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Offering Selection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xl text-gray-800">Available Session Types</h4>
            <Badge variant="outline" className="text-sm">
              {compatibleOfferings.length} option{compatibleOfferings.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {compatibleOfferings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {compatibleOfferings.map((offering, index) => {
                const typeInfo = getSessionTypeInfo(offering.sessionType);
                const IconComponent = typeInfo.icon;
                const isSelected = selectedOffering?.id === offering.id;
                
                return (
                  <div 
                    key={offering.id} 
                    className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      isSelected 
                        ? `${typeInfo.borderColor} ${typeInfo.bgColor} shadow-xl transform scale-105` 
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:transform hover:scale-102'
                    }`}
                    onClick={() => setSelectedOffering(offering)}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    )}

                    {/* Decorative background pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full transform translate-x-16 -translate-y-16" />
                    </div>

                    <div className="relative">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 ${typeInfo.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                            <IconComponent className={`h-7 w-7 ${typeInfo.color}`} />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl text-gray-800 mb-1">
                              {offering.title}
                            </h4>
                            <Badge className={`${typeInfo.bgColor} ${typeInfo.color} border-0 font-medium`}>
                              {typeInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed">
                          {offering.description || offering.shortDescription}
                        </p>

                        {/* Topic Info */}
                        <div className="flex items-center gap-3">
                          <Target className="h-5 w-5 text-indigo-600" />
                          <div>
                            <span className="font-medium text-gray-700">Topic: </span>
                            <span className="text-gray-600">
                              {offering.topicType === 'FLEXIBLE' ? (
                                <span className="text-green-600 font-medium">Flexible - Choose your own</span>
                              ) : (
                                offering.fixedTopic || 'Structured curriculum'
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Session Features */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600">
                              {offering.screenShareEnabled ? 'Screen sharing' : 'Video only'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-600">
                              {offering.whiteboardEnabled ? 'Whiteboard' : 'No whiteboard'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-gray-600">
                              {offering.recordingEnabled ? 'Recorded' : 'Live only'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-gray-600">
                              {offering.chatEnabled ? 'Chat enabled' : 'No chat'}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        {offering.tags && offering.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {offering.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
                              <Badge 
                                key={tagIndex} 
                                variant="outline" 
                                className="text-xs border-gray-300 text-gray-600"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {offering.tags.length > 4 && (
                              <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                                +{offering.tags.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Prerequisites */}
                        {offering.prerequisites && offering.prerequisites.length > 0 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-800">Prerequisites</span>
                            </div>
                            <ul className="text-sm text-yellow-700 space-y-1">
                              {offering.prerequisites.slice(0, 2).map((prereq: string, prereqIndex: number) => (
                                <li key={prereqIndex} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-yellow-600 rounded-full" />
                                  {prereq}
                                </li>
                              ))}
                              {offering.prerequisites.length > 2 && (
                                <li className="text-yellow-600 font-medium">
                                  +{offering.prerequisites.length - 2} more requirements
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{offering.totalBookings} bookings</span>
                            </div>
                            {offering.averageRating > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span>{offering.averageRating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <div className="text-3xl font-bold text-gray-800">
                              ${offering.basePrice}
                            </div>
                            <div className="text-sm text-gray-500">
                              per {offering.duration} min
                            </div>
                          </div>
                        </div>

                        {/* Selection indicator at bottom */}
                        {isSelected && (
                          <div className="flex items-center justify-center gap-2 pt-4 border-t border-blue-200">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-600">Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">No Compatible Offerings</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                No {isIndividualSlot ? 'individual' : 'group'} session offerings are available for this time slot.
                The instructor may need to create offerings that match this slot type.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={onClose}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Choose Different Slot
                </Button>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Instructor
                </Button>
              </div>
            </div>
          )}

          {/* Continue Button */}
          {selectedOffering && (
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={() => setCurrentStep(2)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-8"
                size="lg"
              >
                Continue to Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <MessageSquare className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Booking Details
        </h3>
        <p className="text-gray-600">Tell us more about your learning goals</p>
      </div>

      {/* Enhanced Session Summary */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${getSessionTypeInfo(selectedOffering?.sessionType || 'INDIVIDUAL').bgColor} rounded-xl flex items-center justify-center`}>
                {React.createElement(getSessionTypeInfo(selectedOffering?.sessionType || 'INDIVIDUAL').icon, {
                  className: `h-6 w-6 ${getSessionTypeInfo(selectedOffering?.sessionType || 'INDIVIDUAL').color}`
                })}
              </div>
              <div>
                <p className="font-semibold text-green-900">{selectedOffering?.title}</p>
                <p className="text-sm text-green-700">{getSessionTypeInfo(selectedOffering?.sessionType || 'INDIVIDUAL').label}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-900">${selectedOffering?.basePrice}</div>
              <div className="text-sm text-green-700">{selectedOffering?.duration} minutes</div>
            </div>
          </div>
          
          {/* Session Features Preview */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-green-200">
            {selectedOffering?.recordingEnabled && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <PlayCircle className="h-4 w-4" />
                <span>Session recorded</span>
              </div>
            )}
            {selectedOffering?.whiteboardEnabled && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <FileText className="h-4 w-4" />
                <span>Whiteboard included</span>
              </div>
            )}
            {selectedOffering?.screenShareEnabled && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Monitor className="h-4 w-4" />
                <span>Screen sharing</span>
              </div>
            )}
            {selectedOffering?.chatEnabled && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <MessageCircle className="h-4 w-4" />
                <span>Live chat</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Form Fields */}
      <div className="space-y-6">
        {/* Custom Topic (if flexible) */}
        {selectedOffering?.topicType === "FLEXIBLE" && (
          <Card className="border-indigo-200 bg-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-600" />
                What would you like to learn?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                id="customTopic"
                placeholder="e.g., Advanced React hooks and custom patterns, Data structures and algorithms, Machine learning fundamentals..."
                value={bookingData.customTopic}
                onChange={(e) => setBookingData(prev => ({ ...prev, customTopic: e.target.value }))}
                className="min-h-[120px] border-indigo-200 focus:border-indigo-400 bg-white"
              />
              <p className="text-sm text-indigo-600">
                Be specific about what you want to achieve in this session
              </p>
              {errors.customTopic && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.customTopic}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Message to Instructor */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Message to {instructorName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              id="studentMessage"
              placeholder="Hi! I'm excited to learn with you. Here's what I'm hoping to achieve in our session..."
              value={bookingData.studentMessage}
              onChange={(e) => setBookingData(prev => ({ ...prev, studentMessage: e.target.value }))}
              className="min-h-[100px]"
            />
            {errors.studentMessage && (
              <p className="text-sm text-red-600">{errors.studentMessage}</p>
            )}
          </CardContent>
        </Card>

        {/* Special Requirements */}
        <div className="space-y-2">
          <Label htmlFor="customRequirements" className="text-base font-medium">
            Special Requirements (Optional)
          </Label>
          <Textarea
            id="customRequirements"
            placeholder="Any specific requirements, learning style preferences, or accessibility needs..."
            value={bookingData.customRequirements}
            onChange={(e) => setBookingData(prev => ({ ...prev, customRequirements: e.target.value }))}
            className="min-h-[80px]"
          />
        </div>

        {/* Pricing */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Session Price</span>
              <span className="font-medium">${selectedOffering?.basePrice || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{sessionDuration} minutes</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                ${bookingData.agreedPrice}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={createBookingMutation.isPending}
            className="flex-1"
          >
            {createBookingMutation.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating Booking...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep2Submitted = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Booking Submitted</h3>
        <p className="text-gray-600">Waiting for instructor approval</p>
      </div>

      {/* Booking Details */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Booking Request Sent</span>
            </div>
            <p className="text-sm text-yellow-700">
              Your booking request has been sent to {instructorName}. 
              You'll receive a notification once they respond.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Instructor:</span>
            <span className="font-medium">{instructorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {formatSlotTime(new Date(selectedSlot.startTime))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{sessionDuration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">${bookingData.agreedPrice}</span>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Next Steps:</strong> The instructor will review your request and respond within 24 hours. 
          You'll receive an email notification with their decision.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Close
        </Button>
        <Button onClick={() => router.push('/student/bookings')} className="flex-1">
          View My Bookings
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {checkoutSession ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Complete Payment</h3>
            <p className="text-gray-600">You'll be redirected to Stripe to complete your payment</p>
          </div>

          {/* Payment Summary */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-blue-900">
                    ${bookingData.agreedPrice} {bookingData.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Session:</span>
                  <span className="font-medium text-blue-900">{selectedOffering?.title || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-medium text-blue-900">{instructorName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your payment is processed securely by Stripe. We never store your payment information.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePaymentCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={() => window.location.href = checkoutSession.url}
              className="flex-1"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Payment
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Preparing payment...</p>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600">
          Your session has been successfully booked and confirmed.
        </p>
      </div>

      {/* Success Details */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Payment Successful</span>
            </div>
            <p className="text-sm text-green-700">
              Your payment has been processed and your session is confirmed. 
              You'll receive a confirmation email with meeting details.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Session Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Instructor:</span>
            <span className="font-medium">{instructorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {formatSlotTime(new Date(selectedSlot.startTime))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{sessionDuration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Meeting Link:</span>
            <span className="font-medium text-blue-600">Will be provided</span>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Alert>
        <Video className="h-4 w-4" />
        <AlertDescription>
          <strong>Next Steps:</strong> You'll receive an email with the meeting link 15 minutes before your session. 
          Make sure to test your audio and video beforehand.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={onClose} className="flex-1">
          Done
        </Button>
        <Button 
          variant="outline" 
          onClick={() => router.push('/student/bookings')} 
          className="flex-1"
        >
          View My Sessions
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>Book Session</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Schedule your learning session with {instructorName}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && selectedOffering && renderStep2()}
          {currentStep === 2 && !selectedOffering && renderStep2Submitted()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
