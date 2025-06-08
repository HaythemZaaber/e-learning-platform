"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Clock, Users, User, CalendarIcon, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { AvailabilityDay, TimeSlot, SessionType, SessionDuration } from "@/data/instructorsData"

interface EnhancedBookingCalendarProps {
  availability: AvailabilityDay[]
  instructorName: string
  sessionPricing: {
    individual: { [key in SessionDuration]: number }
    group: { [key in SessionDuration]: number }
  }
  maxGroupSize: number
  timezone: string
  onBookSession?: (booking: any) => void
}

interface BookingDetails {
  date: string
  timeSlot: TimeSlot
  sessionType: SessionType
  duration: SessionDuration
  topic: string
  specialRequirements: string
  studentInfo: {
    name: string
    email: string
    phone: string
  }
}

export function EnhancedBookingCalendar({
  availability,
  instructorName,
  sessionPricing,
  maxGroupSize,
  timezone,
  onBookSession,
}: EnhancedBookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<AvailabilityDay | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [sessionType, setSessionType] = useState<SessionType>("individual")
  const [duration, setDuration] = useState<SessionDuration>(60)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState<"details" | "payment" | "confirmation">("details")
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    date: "",
    timeSlot: null as any,
    sessionType: "individual",
    duration: 60,
    topic: "",
    specialRequirements: "",
    studentInfo: {
      name: "",
      email: "",
      phone: "",
    },
  })

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
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  // Generate calendar data with availability
  const calendarData = useMemo(() => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayAvailability = availability.find((avail) => avail.date === dateStr)
      const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

      const availableSlots = dayAvailability?.timeSlots.filter((slot) => slot.isAvailable && !slot.isBooked) || []
      const bookedSlots = dayAvailability?.timeSlots.filter((slot) => slot.isBooked) || []

      days.push({
        day,
        date: dateStr,
        availability: dayAvailability,
        availableSlots,
        bookedSlots,
        isPast: currentDay < today,
        isToday: currentDay.getTime() === today.getTime(),
      })
    }

    return days
  }, [currentDate, availability, daysInMonth, firstDayOfMonth])

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
    setSelectedDate(null)
  }

  const handleSlotSelect = (day: any, slot: TimeSlot) => {
    setSelectedDate(day.availability)
    setSelectedSlot(slot)
    setBookingDetails((prev) => ({
      ...prev,
      date: day.date,
      timeSlot: slot,
    }))
    setIsBookingOpen(true)
    setBookingStep("details")
  }

  const handleBookingSubmit = () => {
    const finalBooking = {
      ...bookingDetails,
      sessionType,
      duration,
      price: sessionPricing[sessionType][duration],
      instructorName,
      timezone,
    }

    onBookSession?.(finalBooking)
    setBookingStep("confirmation")
  }

  const currentPrice = sessionPricing[sessionType][duration]

  const getDayStatusClass = (dayData: any) => {
    if (!dayData || dayData.isPast) return "text-muted-foreground cursor-not-allowed"

    if (dayData.availableSlots.length > 0) {
      return "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
    }

    if (dayData.bookedSlots.length > 0 && dayData.availableSlots.length === 0) {
      return "bg-amber-50 text-amber-700 border-amber-200"
    }

    return "hover:bg-muted"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Book a Live Session</span>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {timezone}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded"></div>
            <span>Partially Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span>Unavailable</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}

          {calendarData.map((dayData, index) => (
            <div key={index} className="relative min-h-[60px]">
              {dayData ? (
                <Button
                  variant="ghost"
                  className={`w-full h-full p-1 text-sm flex flex-col items-center justify-center border ${getDayStatusClass(dayData)} ${
                    dayData.isToday ? "ring-2 ring-primary" : ""
                  }`}
                  disabled={dayData.isPast || dayData.availableSlots.length === 0}
                  onClick={() => dayData.availableSlots.length > 0 && setSelectedDate(dayData.availability)}
                >
                  <span className="font-medium">{dayData.day}</span>
                  {dayData.availableSlots.length > 0 && (
                    <span className="text-xs text-green-600">{dayData.availableSlots.length} slots</span>
                  )}
                  {dayData.bookedSlots.length > 0 && dayData.availableSlots.length === 0 && (
                    <span className="text-xs text-amber-600">Booked</span>
                  )}
                </Button>
              ) : (
                <div className="w-full h-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Available Time Slots */}
        {selectedDate && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Available Times - {selectedDate.date}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {selectedDate.timeSlots
                .filter((slot) => slot.isAvailable && !slot.isBooked)
                .map((slot) => (
                  <Button
                    key={slot.id}
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-2"
                    onClick={() => handleSlotSelect({ availability: selectedDate, date: selectedDate.date }, slot)}
                  >
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="font-medium">{slot.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {slot.sessionType === "group" ? (
                        <>
                          <Users className="h-3 w-3" />
                          <span>Group (${slot.price})</span>
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3" />
                          <span>1-on-1 (${slot.price})</span>
                        </>
                      )}
                    </div>
                    {slot.sessionType === "group" && slot.currentBookings && (
                      <Badge variant="secondary" className="text-xs">
                        {slot.currentBookings}/{slot.maxStudents} booked
                      </Badge>
                    )}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {/* Quick Book Section */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button className="w-full" size="lg">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Next Available Slot
              <Badge variant="secondary" className="ml-2">
                Today 2:00 PM - $120
              </Badge>
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Users className="h-4 w-4 mr-2" />
              Join Group Session
              <Badge variant="secondary" className="ml-2">
                Tomorrow 3:00 PM - $80
              </Badge>
            </Button>
          </div>
        </div>

        {/* Booking Modal */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {bookingStep === "details" && `Book Session with ${instructorName}`}
                {bookingStep === "payment" && "Payment Details"}
                {bookingStep === "confirmation" && "Booking Confirmed"}
              </DialogTitle>
            </DialogHeader>

            {bookingStep === "details" && (
              <div className="space-y-6">
                {/* Session Type Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Session Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={sessionType === "individual" ? "default" : "outline"}
                      onClick={() => setSessionType("individual")}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <User className="h-5 w-5" />
                      <div className="text-center">
                        <div className="font-medium">Individual</div>
                        <div className="text-xs text-muted-foreground">One-on-one session</div>
                      </div>
                    </Button>
                    <Button
                      variant={sessionType === "group" ? "default" : "outline"}
                      onClick={() => setSessionType("group")}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <Users className="h-5 w-5" />
                      <div className="text-center">
                        <div className="font-medium">Group</div>
                        <div className="text-xs text-muted-foreground">Up to {maxGroupSize} students</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Duration Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Duration</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 60, 120].map((dur) => (
                      <Button
                        key={dur}
                        variant={duration === dur ? "default" : "outline"}
                        onClick={() => setDuration(dur as SessionDuration)}
                        className="flex flex-col items-center gap-1 h-auto py-3"
                      >
                        <span className="font-medium">{dur} min</span>
                        <span className="text-xs">${sessionPricing[sessionType][dur as SessionDuration]}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Session Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Session Topic</Label>
                    <Input
                      id="topic"
                      placeholder="What would you like to learn about?"
                      value={bookingDetails.topic}
                      onChange={(e) => setBookingDetails((prev) => ({ ...prev, topic: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Special Requirements (Optional)</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Any specific topics, materials, or accommodations needed?"
                      value={bookingDetails.specialRequirements}
                      onChange={(e) => setBookingDetails((prev) => ({ ...prev, specialRequirements: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Student Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">Your Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={bookingDetails.studentInfo.name}
                        onChange={(e) =>
                          setBookingDetails((prev) => ({
                            ...prev,
                            studentInfo: { ...prev.studentInfo, name: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingDetails.studentInfo.email}
                        onChange={(e) =>
                          setBookingDetails((prev) => ({
                            ...prev,
                            studentInfo: { ...prev.studentInfo, email: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={bookingDetails.studentInfo.phone}
                      onChange={(e) =>
                        setBookingDetails((prev) => ({
                          ...prev,
                          studentInfo: { ...prev.studentInfo, phone: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <h4 className="font-medium">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{bookingDetails.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">
                        {selectedSlot?.startTime} - {selectedSlot?.endTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{sessionType}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Price:</span>
                      <span className="text-lg font-bold">${currentPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsBookingOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={() => setBookingStep("payment")} className="flex-1">
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {bookingStep === "payment" && (
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Payment Summary</h4>
                  <div className="flex justify-between items-center">
                    <span>Session with {instructorName}</span>
                    <span className="font-bold">${currentPrice}</span>
                  </div>
                </div>

                {/* Payment form would go here */}
                <div className="space-y-4">
                  <h4 className="font-medium">Payment Method</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto py-4">
                      <div className="text-center">
                        <div className="font-medium">Credit Card</div>
                        <div className="text-xs text-muted-foreground">Visa, Mastercard, etc.</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto py-4">
                      <div className="text-center">
                        <div className="font-medium">PayPal</div>
                        <div className="text-xs text-muted-foreground">Pay with PayPal</div>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setBookingStep("details")} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleBookingSubmit} className="flex-1">
                    Complete Booking
                  </Button>
                </div>
              </div>
            )}

            {bookingStep === "confirmation" && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
                  <p className="text-muted-foreground">
                    Your session with {instructorName} has been successfully booked.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg text-left">
                  <h4 className="font-medium mb-2">Session Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>Date: {bookingDetails.date}</div>
                    <div>
                      Time: {selectedSlot?.startTime} - {selectedSlot?.endTime}
                    </div>
                    <div>Duration: {duration} minutes</div>
                    <div>Type: {sessionType}</div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email with the meeting link and further instructions.
                </p>

                <Button onClick={() => setIsBookingOpen(false)} className="w-full">
                  Done
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
