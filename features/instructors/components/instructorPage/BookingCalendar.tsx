"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  User,
  CalendarIcon,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  MessageSquare,
  Bell,
  Star,
  MapPin,
  Video,
  Coffee,
} from "lucide-react";
import {
  DayAvailability,
  TimeSlot,
  BookingRequest,
} from "@/data/instructorsData";
import BookingModal from "./BookingModal";

interface DayData {
  day: number;
  date: string;
  availability?: DayAvailability;
  availableSlots: TimeSlot[];
  pendingSlots: TimeSlot[];
  confirmedSlots: TimeSlot[];
  isPast: boolean;
  isToday: boolean;
}

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

interface BookingCalendarProps {
  availability?: DayAvailability[];
  instructorName: string;
  sessionPricing?: {
    individual: {
      [key: number]: number;
    };
    group: {
      [key: number]: number;
    };
  };
  maxGroupSize?: number;
  timezone?: string;
}

export default function BookingCalendar({
  availability,
  instructorName,
  sessionPricing,
  maxGroupSize = 4,
  timezone,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<DayAvailability | null>(
    null
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [userRole, setUserRole] = useState("student"); // 'student' or 'instructor'
  const timeSlotsRef = useRef<HTMLDivElement>(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Generate calendar data
  const calendarData = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayAvailability = availability?.find(
        (avail) => avail.date === dateStr
      );
      const currentDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      const availableSlots =
        dayAvailability?.timeSlots.filter((slot) => slot.isAvailable) || [];
      const pendingSlots = availableSlots.filter(
        (slot) =>
          slot.status === "pending_requests" ||
          slot.status === "competitive_bidding"
      );
      const confirmedSlots = availableSlots.filter(
        (slot) => slot.status === "confirmed"
      );

      days.push({
        day,
        date: dateStr,
        availability: dayAvailability,
        availableSlots,
        pendingSlots,
        confirmedSlots,
        isPast: currentDay < today,
        isToday: currentDay.getTime() === today.getTime(),
      });
    }

    return days;
  }, [currentDate, daysInMonth, firstDayOfMonth, availability]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
  };

  const handleSlotSelect = (
    day: { availability: DayAvailability },
    slot: TimeSlot
  ) => {
    if (!day.availability) return;
    setSelectedDate(day.availability);
    setSelectedSlot(slot);
    setIsBookingOpen(true);
  };

  const getDayStatusClass = (dayData: DayData | null) => {
    if (!dayData || dayData.isPast)
      return "text-muted-foreground cursor-not-allowed";

    if (dayData.confirmedSlots.length > 0) {
      return "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200";
    }

    if (dayData.pendingSlots.length > 0) {
      return "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200";
    }

    if (dayData.availableSlots.length > 0) {
      return "bg-green-50 hover:bg-green-100 text-green-700 border-green-200";
    }

    return "hover:bg-muted";
  };

  const getSlotStatusBadge = (slot: TimeSlot) => {
    switch (slot.status) {
      case "available":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            Available
          </span>
        );
      case "pending_requests":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
            <Bell className="w-3 h-3 mr-1" />
            {slot.currentRequests.length} Request
            {slot.currentRequests.length > 1 ? "s" : ""}
          </span>
        );
      case "competitive_bidding":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
            <DollarSign className="w-3 h-3 mr-1" />
            Bidding ({slot.currentRequests.length})
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Confirmed
          </span>
        );
      default:
        return null;
    }
  };

  const handleSubmitBooking = async (bookingDetails: BookingDetails) => {
    if (!selectedSlot) return false;

    const request = {
      slotId: selectedSlot.id,
      sessionType: bookingDetails.sessionType,
      offerPrice: bookingDetails.offerPrice,
      topic: bookingDetails.topic,
      specialRequirements: bookingDetails.specialRequirements,
      studentInfo: bookingDetails.studentInfo,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error submitting booking:", error);
      return false;
    }
  };

  const handleDayClick = (dayData: DayData) => {
    if (dayData.availableSlots.length > 0 && dayData.availability) {
      setSelectedDate(dayData.availability);
      // Add a small delay to ensure the time slots section is rendered
      setTimeout(() => {
        timeSlotsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Session Booking</h1>
          <p className="text-muted-foreground">
            Book your learning session with competitive pricing
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="student">Student View</option>
            <option value="instructor">Instructor View</option>
          </select>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-lg shadow-lg border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span className="text-lg font-semibold">Available Sessions</span>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded"></div>
              <span>Pending Requests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
              <span>Competitive Bidding</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
              <span>Confirmed</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}

            {calendarData.map((dayData, index) => (
              <div key={index} className="relative min-h-[80px]">
                {dayData ? (
                  <button
                    className={`w-full h-full p-2 text-sm flex flex-col items-center justify-start border rounded-md ${getDayStatusClass(
                      dayData
                    )} ${dayData.isToday ? "ring-2 ring-blue-500" : ""}`}
                    disabled={dayData.isPast}
                    onClick={() => handleDayClick(dayData)}
                  >
                    <span className="font-medium mb-1">{dayData.day}</span>
                    {dayData.availableSlots.length > 0 && (
                      <div className="text-xs space-y-1">
                        {dayData.availableSlots.length > 0 && (
                          <div className="text-green-600">
                            {dayData.availableSlots.length} slots
                          </div>
                        )}
                        {dayData.pendingSlots.length > 0 && (
                          <div className="text-amber-600">
                            {dayData.pendingSlots.length} pending
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="w-full h-full"></div>
                )}
              </div>
            ))}
          </div>

          {/* Time Slots Display */}
          {selectedDate && (
            <div ref={timeSlotsRef} className="border-t pt-6">
              <h4 className="font-medium flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4" />
                Available Times - {selectedDate.date}
              </h4>
              <div className="grid gap-4">
                {selectedDate.timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        {getSlotStatusBadge(slot)}
                      </div>
                      <button
                        onClick={() =>
                          handleSlotSelect({ availability: selectedDate }, slot)
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        disabled={slot.status === "confirmed"}
                      >
                        {slot.status === "confirmed"
                          ? "Booked"
                          : "Request Session"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <User className="h-3 w-3" />
                          <span>Individual: ${slot.basePriceIndiv}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>Group: ${slot.basePriceGroup}</span>
                        </div>
                      </div>

                      {slot.currentRequests.length > 0 && (
                        <div>
                          <div className="font-medium mb-1">
                            Current Requests:
                          </div>
                          {slot.currentRequests.map((request) => (
                            <div
                              key={request.id}
                              className="text-xs text-muted-foreground"
                            >
                              {request.type} - ${request.offerPrice}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {slot.status === "confirmed" && slot.confirmedSession && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        <div className="text-sm">
                          <strong>Confirmed:</strong>{" "}
                          {slot.confirmedSession.type} session - $
                          {slot.confirmedSession.price}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          // setSelectedDate(null);
          // setSelectedSlot(null);
        }}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        maxGroupSize={maxGroupSize}
        timezone={timezone}
        onSubmitBooking={handleSubmitBooking}
      />
    </div>
  );
}
