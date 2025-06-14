"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Users,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Bell,
  MapPin,
  Video,
  Coffee,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface BookingDetails {
  sessionType: "individual" | "group";
  duration: number;
  topic: string;
  offerPrice: number;
  specialRequirements: string;
  studentInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  basePriceIndiv: number;
  basePriceGroup: number;
  status:
    | "available"
    | "pending_requests"
    | "competitive_bidding"
    | "confirmed";
  currentRequests: Array<{
    id: string;
    type: string;
    offerPrice: number;
  }>;
  confirmedSession?: {
    type: string;
    price: number;
  };
}

interface DayAvailability {
  date: string;
  timeSlots: TimeSlot[];
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: DayAvailability | null;
  selectedSlot: TimeSlot | null;
  maxGroupSize?: number;
  timezone?: string;
  onSubmitBooking: (bookingDetails: BookingDetails) => Promise<boolean>;
  initialBookingDetails?: Partial<BookingDetails>;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedDate,
  selectedSlot,
  maxGroupSize = 4,
  timezone = "UTC",
  onSubmitBooking,
  initialBookingDetails = {},
}: BookingModalProps) {
  const [bookingStep, setBookingStep] = useState<"form" | "confirmation">(
    "form"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(() => ({
    sessionType: "individual",
    duration: 60,
    topic: "",
    offerPrice: 0,
    specialRequirements: "",
    studentInfo: {
      name: "",
      email: "",
      phone: "",
    },
    ...initialBookingDetails,
  }));

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && selectedSlot) {
      const initialPrice =
        selectedSlot.status === "competitive_bidding"
          ? Math.max(...selectedSlot.currentRequests.map((r) => r.offerPrice)) +
            10
          : selectedSlot.basePriceIndiv;

      setBookingDetails((prev) => ({
        ...prev,
        offerPrice: initialPrice,
      }));
      setBookingStep("form");
    }
  }, [isOpen, selectedSlot?.id]);

  const handleClose = () => {
    setBookingStep("form");
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedSlot || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmitBooking(bookingDetails);
      if (success) {
        setBookingStep("confirmation");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      bookingDetails.topic.trim() !== "" &&
      bookingDetails.studentInfo.name.trim() !== "" &&
      bookingDetails.studentInfo.email.trim() !== "" &&
      bookingDetails.studentInfo.phone.trim() !== "" &&
      bookingDetails.offerPrice > 0
    );
  };

  if (!selectedSlot || !selectedDate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className=" w-full  p-0 gap-0">
        <DialogTitle className="sr-only">Book a Session</DialogTitle>
        <div className="flex h-full ">
          {/* Left Panel - Session Summary */}
          <div className="  bg-gray-50 border-r flex flex-col">
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Session Summary</h3>
                  <button
                    onClick={handleClose}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Session Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{selectedDate.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {selectedSlot.startTime} - {selectedSlot.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{timezone}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Base Pricing</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        Individual Session
                      </span>
                      <span className="font-medium">
                        ${selectedSlot.basePriceIndiv}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        Group Session
                      </span>
                      <span className="font-medium">
                        ${selectedSlot.basePriceGroup}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Competitive Bidding Alert */}
                {selectedSlot.status === "competitive_bidding" && (
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-orange-800 mb-1">
                          Competitive Bidding
                        </div>
                        <div className="text-sm text-orange-700">
                          Current highest offer: $
                          {Math.max(
                            ...selectedSlot.currentRequests.map(
                              (r) => r.offerPrice
                            )
                          )}
                        </div>
                        <div className="text-xs text-orange-600 mt-1">
                          {selectedSlot.currentRequests.length} other requests
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Session Features */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Session Features</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span>Live Video Session</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4" />
                      <span>10-minute buffer time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Email notifications</span>
                    </div>
                  </div>
                </div>

                {/* Your Offer Summary */}
                {bookingStep === "form" && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Your Offer</h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          {bookingDetails.sessionType === "individual"
                            ? "Individual"
                            : "Group"}{" "}
                          Session
                        </span>
                        <span className="font-semibold text-lg">
                          ${bookingDetails.offerPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Form/Confirmation */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-6 overflow-y-auto flex-1 w-full">
              {bookingStep === "form" ? (
                <BookingForm
                  bookingDetails={bookingDetails}
                  setBookingDetails={setBookingDetails}
                  selectedSlot={selectedSlot}
                  maxGroupSize={maxGroupSize}
                  onSubmit={handleSubmit}
                  onCancel={handleClose}
                  isSubmitting={isSubmitting}
                  isFormValid={isFormValid()}
                />
              ) : (
                <BookingConfirmation
                  bookingDetails={bookingDetails}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  onClose={handleClose}
                />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Booking Form Component
function BookingForm({
  bookingDetails,
  setBookingDetails,
  selectedSlot,
  maxGroupSize,
  onSubmit,
  onCancel,
  isSubmitting,
  isFormValid,
}: {
  bookingDetails: BookingDetails;
  setBookingDetails: React.Dispatch<React.SetStateAction<BookingDetails>>;
  selectedSlot: TimeSlot;
  maxGroupSize: number;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isFormValid: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Request Session</h2>
        <p className="text-gray-600">
          Fill out the details below to request your learning session.
        </p>
      </div>

      {/* Session Type Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">Session Type *</label>
        <div className="grid grid-cols-2 gap-3">
          <SessionTypeCard
            type="individual"
            isSelected={bookingDetails.sessionType === "individual"}
            onSelect={() =>
              setBookingDetails((prev) => ({
                ...prev,
                sessionType: "individual",
              }))
            }
            icon={<User className="h-5 w-5" />}
            title="Individual"
            description="One-on-one session"
          />
          <SessionTypeCard
            type="group"
            isSelected={bookingDetails.sessionType === "group"}
            onSelect={() =>
              setBookingDetails((prev) => ({ ...prev, sessionType: "group" }))
            }
            icon={<Users className="h-5 w-5" />}
            title="Group"
            description={`Up to ${maxGroupSize} students`}
          />
        </div>
      </div>

      {/* Offer Price */}
      <div>
        <label className="block text-sm font-medium mb-3">Your Offer *</label>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Minimum Price:</span>
            <span className="font-semibold">
              $
              {bookingDetails.sessionType === "individual"
                ? selectedSlot.basePriceIndiv
                : selectedSlot.basePriceGroup}
            </span>
          </div>

          <div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                $
              </span>
              <input
                type="number"
                min={
                  bookingDetails.sessionType === "individual"
                    ? selectedSlot.basePriceIndiv
                    : selectedSlot.basePriceGroup
                }
                step="5"
                value={bookingDetails.offerPrice || ""}
                onChange={(e) =>
                  setBookingDetails((prev) => ({
                    ...prev,
                    offerPrice: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
                placeholder="Enter your offer"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
              <span>Higher offers increase acceptance chances</span>
              {selectedSlot.status === "competitive_bidding" && (
                <span className="text-orange-600 font-medium">
                  Beat: $
                  {Math.max(
                    ...selectedSlot.currentRequests.map((r) => r.offerPrice)
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Session Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Session Topic *
          </label>
          <input
            type="text"
            placeholder="What would you like to learn about?"
            value={bookingDetails.topic}
            onChange={(e) =>
              setBookingDetails((prev) => ({ ...prev, topic: e.target.value }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Special Requirements
          </label>
          <textarea
            placeholder="Any specific needs, accommodations, or preparation requests?"
            value={bookingDetails.specialRequirements}
            onChange={(e) =>
              setBookingDetails((prev) => ({
                ...prev,
                specialRequirements: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Student Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Your Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={bookingDetails.studentInfo.name}
              onChange={(e) =>
                setBookingDetails((prev) => ({
                  ...prev,
                  studentInfo: { ...prev.studentInfo, name: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              value={bookingDetails.studentInfo.email}
              onChange={(e) =>
                setBookingDetails((prev) => ({
                  ...prev,
                  studentInfo: { ...prev.studentInfo, email: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your.email@example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={bookingDetails.studentInfo.phone}
            onChange={(e) =>
              setBookingDetails((prev) => ({
                ...prev,
                studentInfo: { ...prev.studentInfo, phone: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFormValid || isSubmitting}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
}

// Session Type Card Component
function SessionTypeCard({
  type,
  isSelected,
  onSelect,
  icon,
  title,
  description,
}: {
  type: string;
  isSelected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      onClick={onSelect}
      className={`p-4 border rounded-lg flex flex-col items-center gap-3 transition-all hover:shadow-sm ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500"
          : "border-gray-200 hover:border-blue-200"
      }`}
    >
      <div className={`${isSelected ? "text-blue-600" : "text-gray-500"}`}>
        {icon}
      </div>
      <div className="text-center">
        <div
          className={`font-medium ${
            isSelected ? "text-blue-900" : "text-gray-900"
          }`}
        >
          {title}
        </div>
        <div className="text-xs text-gray-500 mt-1">{description}</div>
      </div>
    </button>
  );
}

// Booking Confirmation Component
function BookingConfirmation({
  bookingDetails,
  selectedDate,
  selectedSlot,
  onClose,
}: {
  bookingDetails: BookingDetails;
  selectedDate: DayAvailability;
  selectedSlot: TimeSlot;
  onClose: () => void;
}) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-900">
          Request Submitted Successfully!
        </h2>
        <p className="text-gray-600">
          Your session request has been sent to the instructor for review.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-left max-w-md mx-auto">
        <h4 className="font-semibold mb-4 text-green-900">Request Summary</h4>
        <div className="space-y-2 text-sm text-green-800">
          <div className="flex justify-between">
            <span>Date:</span>
            <span className="font-medium">{selectedDate.date}</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span className="font-medium">
              {selectedSlot.startTime} - {selectedSlot.endTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-medium capitalize">
              {bookingDetails.sessionType}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Topic:</span>
            <span className="font-medium">{bookingDetails.topic}</span>
          </div>
          <div className="flex justify-between">
            <span>Your Offer:</span>
            <span className="font-semibold text-lg">
              ${bookingDetails.offerPrice}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Bell className="h-4 w-4" />
          <span>You'll receive email updates about your request</span>
        </div>
        <p className="text-sm text-gray-500">
          The instructor typically responds within 24 hours.
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-full max-w-sm mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Done
      </button>
    </div>
  );
}
