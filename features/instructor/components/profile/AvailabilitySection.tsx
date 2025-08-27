"use client";

import { motion, AnimatePresence } from "framer-motion";
import { InstructorProfile, WeeklySchedule, TimeSlot } from "@/types/instructorTypes";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

interface AvailabilitySectionProps {
  profile: InstructorProfile;
  isEditMode: boolean;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<InstructorProfile>) => void;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' }
];

export default function AvailabilitySection({ 
  profile, 
  isEditMode, 
  isPreviewMode, 
  onUpdate
}: AvailabilitySectionProps) {
  const currentSchedule = profile.preferredSchedule as WeeklySchedule || {
    monday: { available: false, timeSlots: [] },
    tuesday: { available: false, timeSlots: [] },
    wednesday: { available: false, timeSlots: [] },
    thursday: { available: false, timeSlots: [] },
    friday: { available: false, timeSlots: [] },
    saturday: { available: false, timeSlots: [] },
    sunday: { available: false, timeSlots: [] }
  };

  const getAvailabilityStats = () => {
    const availableDays = DAYS_OF_WEEK.filter(day => 
      currentSchedule[day.key as keyof WeeklySchedule].available
    ).length;
    
    const totalTimeSlots = DAYS_OF_WEEK.reduce((total, day) => 
      total + currentSchedule[day.key as keyof WeeklySchedule].timeSlots.length, 0
    );

    const availableSlots = DAYS_OF_WEEK.reduce((total, day) => 
      total + currentSchedule[day.key as keyof WeeklySchedule].timeSlots.filter(slot => slot.isAvailable).length, 0
    );

    const bookedSlots = DAYS_OF_WEEK.reduce((total, day) => 
      total + currentSchedule[day.key as keyof WeeklySchedule].timeSlots.filter(slot => slot.isBooked).length, 0
    );

    const blockedSlots = DAYS_OF_WEEK.reduce((total, day) => 
      total + currentSchedule[day.key as keyof WeeklySchedule].timeSlots.filter(slot => slot.isBlocked).length, 0
    );
    
    return { availableDays, totalTimeSlots, availableSlots, bookedSlots, blockedSlots };
  };

  const getAvailabilityStatus = () => {
    const { availableDays, availableSlots } = getAvailabilityStats();
    
    if (availableDays === 0) return { 
      status: "Not Available", 
      color: "text-red-600", 
      bgColor: "bg-red-100",
      description: "You're not available any days"
    };
    if (availableDays <= 2) return { 
      status: "Limited Availability", 
      color: "text-yellow-600", 
      bgColor: "bg-yellow-100",
      description: "Consider adding more available days"
    };
    if (availableDays <= 5) return { 
      status: "Good Availability", 
      color: "text-blue-600", 
      bgColor: "bg-blue-100",
      description: "Good availability for students"
    };
    return { 
      status: "Excellent Availability", 
      color: "text-green-600", 
      bgColor: "bg-green-100",
      description: "Great availability throughout the week"
    };
  };

  const getSlotStatus = (slot: TimeSlot) => {
    if (slot.isBlocked) {
      return {
        status: "Blocked",
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: Lock,
        description: "This slot is blocked"
      };
    }
    if (slot.isBooked) {
      return {
        status: "Booked",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        icon: UserCheck,
        description: `Booked (${slot.currentBookings}/${slot.maxBookings})`
      };
    }
    if (slot.isAvailable) {
      return {
        status: "Available",
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: Unlock,
        description: `Available (${slot.currentBookings}/${slot.maxBookings})`
      };
    }
    return {
      status: "Unavailable",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      icon: UserX,
      description: "Not available"
    };
  };

  const availabilityStatus = getAvailabilityStatus();
  const { availableDays, totalTimeSlots, availableSlots, bookedSlots, blockedSlots } = getAvailabilityStats();

  return (
    <div className="space-y-6">
      {/* Student Acceptance Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Student Acceptance Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <Label htmlFor="accepting-students" className="text-sm font-medium text-blue-900">
                  Accepting New Students
                </Label>
                <p className="text-sm text-blue-700 mt-1">
                  Allow students to book sessions and enroll in your courses
                </p>
              </div>
              <div className="flex items-center gap-2">
                {profile.isAcceptingStudents ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="text-sm font-medium">
                  {profile.isAcceptingStudents ? "Accepting Students" : "Not Accepting Students"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Max students per course:
              </span>
              <span className="text-sm text-gray-900 font-medium">
                {profile.maxStudentsPerCourse || "Unlimited"}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Availability Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Availability Overview
              </div>
              <Badge variant="outline" className={`${availabilityStatus.color} ${availabilityStatus.bgColor} border-0`}>
                {availabilityStatus.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{availableDays}</div>
                <div className="text-sm text-green-700">Available Days</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalTimeSlots}</div>
                <div className="text-sm text-blue-700">Total Slots</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{availableSlots}</div>
                <div className="text-sm text-emerald-700">Available Slots</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{bookedSlots}</div>
                <div className="text-sm text-orange-700">Booked Slots</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{blockedSlots}</div>
                <div className="text-sm text-red-700">Blocked Slots</div>
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {availabilityStatus.description}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day, dayIndex) => {
                const daySchedule = currentSchedule[day.key as keyof WeeklySchedule];
                const isAvailable = daySchedule.available;
                
                return (
                  <motion.div
                    key={day.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * dayIndex }}
                    className={`border rounded-lg p-4 transition-all ${
                      isAvailable ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isAvailable ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-gray-100'
                          }`}>
                            {isAvailable ? (
                              <CheckCircle className="h-4 w-4 text-white" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{day.label}</span>
                            <div className="text-xs text-gray-500">
                              {daySchedule.timeSlots.length} slot{daySchedule.timeSlots.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isAvailable && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2"
                        >
                          {daySchedule.timeSlots.length > 0 ? (
                            daySchedule.timeSlots.map((slot, index) => {
                              const slotStatus = getSlotStatus(slot);
                              const StatusIcon = slotStatus.icon;
                              
                              return (
                                <motion.div
                                  key={slot.slotId}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  transition={{ duration: 0.2, delay: index * 0.1 }}
                                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200 shadow-sm"
                                >
                                  <div className="flex items-center gap-3">
                                    <StatusIcon className={`h-4 w-4 ${slotStatus.color}`} />
                                    <div>
                                      <div className="font-medium text-purple-900">
                                        {slot.start} - {slot.end}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {slot.duration} minutes
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className={`${slotStatus.bgColor} ${slotStatus.color}`}>
                                      {slotStatus.status}
                                    </Badge>
                                    <div className="text-xs text-gray-500">
                                      {slotStatus.description}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })
                          ) : (
                            <p className="text-gray-500 italic text-sm py-2">
                              No time slots available for this day
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {!isAvailable && (
                      <p className="text-gray-500 italic text-sm">
                        Not available on this day
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Management Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              Schedule Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your availability schedule is managed in a separate section. To add, edit, or remove time slots, 
                please use the dedicated availability management interface.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}