"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InstructorProfile, WeeklySchedule, TimeSlot } from "@/types/instructorTypes";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  Plus, 
  X, 
  Settings,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

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

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00", "23:00"
];

const TIMEZONES = [
  "UTC-12", "UTC-11", "UTC-10", "UTC-9", "UTC-8", "UTC-7", "UTC-6",
  "UTC-5", "UTC-4", "UTC-3", "UTC-2", "UTC-1", "UTC+0", "UTC+1",
  "UTC+2", "UTC+3", "UTC+4", "UTC+5", "UTC+5:30", "UTC+6", "UTC+7",
  "UTC+8", "UTC+9", "UTC+10", "UTC+11", "UTC+12"
];

export default function AvailabilitySection({ 
  profile, 
  isEditMode, 
  isPreviewMode, 
  onUpdate
}: AvailabilitySectionProps) {
  const [selectedTimezone, setSelectedTimezone] = useState("UTC+0");
  const [isAddingTimeSlot, setIsAddingTimeSlot] = useState<string | null>(null);

  const currentSchedule = profile.preferredSchedule as WeeklySchedule || {
    monday: { available: false, timeSlots: [] },
    tuesday: { available: false, timeSlots: [] },
    wednesday: { available: false, timeSlots: [] },
    thursday: { available: false, timeSlots: [] },
    friday: { available: false, timeSlots: [] },
    saturday: { available: false, timeSlots: [] },
    sunday: { available: false, timeSlots: [] }
  };

  const handleAcceptingStudentsChange = (checked: boolean) => {
    onUpdate({ isAcceptingStudents: checked });
    toast.success(checked ? "Now accepting students" : "No longer accepting students");
  };

  const handleMaxStudentsChange = (value: string) => {
    const numValue = parseInt(value) || undefined;
    onUpdate({ maxStudentsPerCourse: numValue });
  };

  const toggleDayAvailability = (day: keyof WeeklySchedule) => {
    const newAvailability = !currentSchedule[day].available;
    const updatedSchedule = {
      ...currentSchedule,
      [day]: {
        ...currentSchedule[day],
        available: newAvailability,
        timeSlots: newAvailability ? currentSchedule[day].timeSlots : []
      }
    };
    onUpdate({ preferredSchedule: updatedSchedule });
    
    const dayName = DAYS_OF_WEEK.find(d => d.key === day)?.label;
    toast.success(newAvailability ? `${dayName} enabled` : `${dayName} disabled`);
  };

  const addTimeSlot = async (day: keyof WeeklySchedule) => {
    setIsAddingTimeSlot(day);
    
    try {
      const newTimeSlot: TimeSlot = {
        startTime: "09:00",
        endTime: "10:00",
        timezone: selectedTimezone
      };
      
      const updatedSchedule = {
        ...currentSchedule,
        [day]: {
          ...currentSchedule[day],
          timeSlots: [...currentSchedule[day].timeSlots, newTimeSlot]
        }
      };
      
      onUpdate({ preferredSchedule: updatedSchedule });
      toast.success("Time slot added");
    } catch (error) {
      toast.error("Failed to add time slot");
    } finally {
      setIsAddingTimeSlot(null);
    }
  };

  const removeTimeSlot = (day: keyof WeeklySchedule, index: number) => {
    const updatedSchedule = {
      ...currentSchedule,
      [day]: {
        ...currentSchedule[day],
        timeSlots: currentSchedule[day].timeSlots.filter((_, i) => i !== index)
      }
    };
    onUpdate({ preferredSchedule: updatedSchedule });
    toast.success("Time slot removed");
  };

  const updateTimeSlot = (day: keyof WeeklySchedule, index: number, field: keyof TimeSlot, value: string) => {
    const updatedSchedule = {
      ...currentSchedule,
      [day]: {
        ...currentSchedule[day],
        timeSlots: currentSchedule[day].timeSlots.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    };
    onUpdate({ preferredSchedule: updatedSchedule });
  };

  const getAvailabilityStats = () => {
    const availableDays = DAYS_OF_WEEK.filter(day => 
      currentSchedule[day.key as keyof WeeklySchedule].available
    ).length;
    
    const totalTimeSlots = DAYS_OF_WEEK.reduce((total, day) => 
      total + currentSchedule[day.key as keyof WeeklySchedule].timeSlots.length, 0
    );
    
    return { availableDays, totalTimeSlots };
  };

  const getAvailabilityStatus = () => {
    const { availableDays } = getAvailabilityStats();
    
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

  const availabilityStatus = getAvailabilityStatus();
  const { availableDays, totalTimeSlots } = getAvailabilityStats();

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
              <Switch
                id="accepting-students"
                checked={profile.isAcceptingStudents}
                onCheckedChange={handleAcceptingStudentsChange}
                disabled={!isEditMode}
              />
            </div>
            
            {isEditMode ? (
              <div>
                <Label htmlFor="max-students" className="text-sm font-medium">
                  Maximum Students per Course
                </Label>
                <Input
                  id="max-students"
                  type="number"
                  value={profile.maxStudentsPerCourse || ""}
                  onChange={(e) => handleMaxStudentsChange(e.target.value)}
                  placeholder="Leave empty for unlimited"
                  min="1"
                  max="100"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set a limit on course enrollment to maintain quality
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Max students per course:
                </span>
                <span className="text-sm text-gray-900 font-medium">
                  {profile.maxStudentsPerCourse || "Unlimited"}
                </span>
              </div>
            )}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{availableDays}</div>
                <div className="text-sm text-green-700">Available Days</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalTimeSlots}</div>
                <div className="text-sm text-blue-700">Time Slots</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((availableDays / 7) * 100)}%
                </div>
                <div className="text-sm text-purple-700">Week Coverage</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {totalTimeSlots > 0 ? Math.round(totalTimeSlots / Math.max(availableDays, 1)) : 0}
                </div>
                <div className="text-sm text-orange-700">Avg Slots/Day</div>
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
                          {isEditMode ? (
                            <Switch
                              checked={isAvailable}
                              onCheckedChange={() => toggleDayAvailability(day.key as keyof WeeklySchedule)}
                            />
                          ) : (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isAvailable ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-gray-100'
                            }`}>
                              {isAvailable ? (
                                <CheckCircle className="h-4 w-4 text-white" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-900">{day.label}</span>
                            <div className="text-xs text-gray-500">
                              {daySchedule.timeSlots.length} slot{daySchedule.timeSlots.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {isEditMode && isAvailable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addTimeSlot(day.key as keyof WeeklySchedule)}
                          disabled={isAddingTimeSlot === day.key}
                          className="border-purple-300 text-purple-700 hover:bg-purple-100"
                        >
                          {isAddingTimeSlot === day.key ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          Add Time
                        </Button>
                      )}
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
                            daySchedule.timeSlots.map((slot, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2, delay: index * 0.1 }}
                                className="flex items-center gap-2 p-3 bg-white rounded-lg border border-purple-200 shadow-sm"
                              >
                                {isEditMode ? (
                                  <>
                                    <Select
                                      value={slot.startTime}
                                      onValueChange={(value) => updateTimeSlot(day.key as keyof WeeklySchedule, index, 'startTime', value)}
                                    >
                                      <SelectTrigger className="w-24">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {TIME_SLOTS.map((time) => (
                                          <SelectItem key={time} value={time}>
                                            {time}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <span className="text-gray-500">to</span>
                                    <Select
                                      value={slot.endTime}
                                      onValueChange={(value) => updateTimeSlot(day.key as keyof WeeklySchedule, index, 'endTime', value)}
                                    >
                                      <SelectTrigger className="w-24">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {TIME_SLOTS.map((time) => (
                                          <SelectItem key={time} value={time}>
                                            {time}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Select
                                      value={slot.timezone}
                                      onValueChange={(value) => updateTimeSlot(day.key as keyof WeeklySchedule, index, 'timezone', value)}
                                    >
                                      <SelectTrigger className="w-32">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {TIMEZONES.map((tz) => (
                                          <SelectItem key={tz} value={tz}>
                                            {tz}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeTimeSlot(day.key as keyof WeeklySchedule, index)}
                                      className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-4 w-4 text-purple-500" />
                                    <span className="font-medium text-purple-900">
                                      {slot.startTime} - {slot.endTime}
                                    </span>
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                      {slot.timezone}
                                    </Badge>
                                  </>
                                )}
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-gray-500 italic text-sm py-2">
                              {isEditMode ? "No time slots added - click 'Add Time' to get started" : "No availability set for this day"}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {!isAvailable && (
                      <p className="text-gray-500 italic text-sm">
                        {isEditMode ? "Enable this day to add time slots" : "Not available on this day"}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timezone Settings */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-600" />
                Timezone Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="timezone" className="text-sm font-medium">
                  Default Timezone for New Time Slots
                </Label>
                <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                  <SelectTrigger className="w-64 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  This timezone will be used when adding new time slots to your schedule
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}