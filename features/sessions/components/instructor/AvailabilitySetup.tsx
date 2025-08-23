"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Trash2, Save } from "lucide-react";
import { useInstructorAvailability, useUpdateAvailability } from "@/features/sessions/hooks/useLiveSessions";
import { InstructorAvailability } from "@/features/sessions/types/session.types";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface TimeSlotForm {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday", 
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const TIME_SLOTS = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
  "22:00", "22:30", "23:00", "23:30"
];

export function AvailabilitySetup() {
  const { user } = useAuth();
  const { data: availabilityList, isLoading } = useInstructorAvailability(user?.id || "");
  const updateAvailabilityMutation = useUpdateAvailability();
  
  const [timeSlots, setTimeSlots] = useState<TimeSlotForm[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [advanceBookingDays, setAdvanceBookingDays] = useState(7);
  const [maxSessionsPerDay, setMaxSessionsPerDay] = useState(5);

  React.useEffect(() => {
    if (availabilityList && availabilityList.length > 0) {
      // For now, we'll work with the first availability entry as a template
      // In a real implementation, you might want to aggregate weekly patterns
      const firstAvailability = availabilityList[0];
      setIsEnabled(firstAvailability.isActive);
      setAdvanceBookingDays(firstAvailability.minAdvanceHours / 24); // Convert hours to days
      setMaxSessionsPerDay(firstAvailability.maxSessionsInSlot);
      
      // Convert availability to form format - this is a simplified approach
      // In a real app, you'd want to aggregate weekly patterns from multiple dates
      const slots: TimeSlotForm[] = [];
      availabilityList.forEach(availability => {
        const dayOfWeek = new Date(availability.specificDate).getDay();
        slots.push({
          dayOfWeek,
          startTime: availability.startTime,
          endTime: availability.endTime,
          isAvailable: availability.isActive
        });
      });
      setTimeSlots(slots);
    }
  }, [availabilityList]);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, {
      dayOfWeek: 0,
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: true
    }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlotForm, value: any) => {
    const updated = [...timeSlots];
    updated[index] = { ...updated[index], [field]: value };
    setTimeSlots(updated);
  };

  const handleSave = async () => {
    try {
      // For now, we'll create/update availability for the next 7 days as an example
      // In a real implementation, you'd want to handle weekly recurring patterns
      const today = new Date();
      const updates = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayOfWeek = date.getDay();
        
        const daySlots = timeSlots.filter(slot => slot.dayOfWeek === dayOfWeek);
        
        if (daySlots.length > 0) {
          // Find existing availability for this date or create new
          const existingAvailability = availabilityList?.find(avail => 
            new Date(avail.specificDate).toDateString() === date.toDateString()
          );
          
          if (existingAvailability) {
            // Update existing availability
            const updateData = {
              id: existingAvailability.id,
              updates: {
                isActive: isEnabled,
                startTime: daySlots[0].startTime,
                endTime: daySlots[0].endTime,
                maxSessionsInSlot: maxSessionsPerDay,
                minAdvanceHours: advanceBookingDays * 24,
                bufferMinutes: 15,
                autoAcceptBookings: true
              } as Partial<InstructorAvailability>
            };
            updates.push(updateAvailabilityMutation.mutateAsync(updateData));
          } else {
            // Create new availability - this would require a create mutation
            // For now, we'll just show a message
            toast.info("Creating new availability entries would require additional API endpoints");
          }
        }
      }
      
      if (updates.length > 0) {
        await Promise.all(updates);
        toast.success("Availability updated successfully");
      } else {
        toast.info("No availability entries to update");
      }
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  const getDaySlots = (dayIndex: number) => {
    return timeSlots.filter(slot => slot.dayOfWeek === dayIndex);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            General Availability Settings
          </CardTitle>
          <CardDescription>
            Configure your general availability preferences and booking rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Availability */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="availability-toggle" className="text-base font-medium">
                Enable Live Sessions
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow students to book live sessions with you
              </p>
            </div>
            <Switch
              id="availability-toggle"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>

          {/* Advance Booking Days */}
          <div className="space-y-2">
            <Label htmlFor="advance-booking">Advance Booking Days</Label>
            <Select value={advanceBookingDays.toString()} onValueChange={(value) => setAdvanceBookingDays(parseInt(value))}>
              <SelectTrigger id="advance-booking">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">1 week</SelectItem>
                <SelectItem value="14">2 weeks</SelectItem>
                <SelectItem value="30">1 month</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How far in advance students can book sessions
            </p>
          </div>

          {/* Max Sessions Per Day */}
          <div className="space-y-2">
            <Label htmlFor="max-sessions">Maximum Sessions Per Day</Label>
            <Select value={maxSessionsPerDay.toString()} onValueChange={(value) => setMaxSessionsPerDay(parseInt(value))}>
              <SelectTrigger id="max-sessions">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 session</SelectItem>
                <SelectItem value="2">2 sessions</SelectItem>
                <SelectItem value="3">3 sessions</SelectItem>
                <SelectItem value="5">5 sessions</SelectItem>
                <SelectItem value="8">8 sessions</SelectItem>
                <SelectItem value="10">10 sessions</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Maximum number of sessions you can conduct per day
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            Set your available time slots for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Time Slot Button */}
          <Button onClick={addTimeSlot} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Time Slot
          </Button>

          {/* Time Slots List */}
          {timeSlots.length > 0 && (
            <div className="space-y-4">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  {/* Day Selection */}
                  <Select
                    value={slot.dayOfWeek.toString()}
                    onValueChange={(value) => updateTimeSlot(index, 'dayOfWeek', parseInt(value))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day, dayIndex) => (
                        <SelectItem key={dayIndex} value={dayIndex.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Start Time */}
                  <Select
                    value={slot.startTime}
                    onValueChange={(value) => updateTimeSlot(index, 'startTime', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="text-muted-foreground">to</span>

                  {/* End Time */}
                  <Select
                    value={slot.endTime}
                    onValueChange={(value) => updateTimeSlot(index, 'endTime', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Available Toggle */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={slot.isAvailable}
                      onCheckedChange={(checked) => updateTimeSlot(index, 'isAvailable', checked)}
                    />
                    <Badge variant={slot.isAvailable ? "default" : "secondary"}>
                      {slot.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTimeSlot(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Weekly Overview */}
          <div className="space-y-4">
            <h4 className="font-medium">Weekly Overview</h4>
            <div className="grid gap-2">
              {DAYS_OF_WEEK.map((day, dayIndex) => {
                const daySlots = getDaySlots(dayIndex);
                const availableSlots = daySlots.filter(slot => slot.isAvailable);
                
                return (
                  <div key={dayIndex} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{day}</span>
                    <div className="flex items-center gap-2">
                      {availableSlots.length > 0 ? (
                        <Badge variant="default">
                          {availableSlots.length} slot{availableSlots.length !== 1 ? 's' : ''}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No slots</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={updateAvailabilityMutation.isPending}
          className="min-w-32"
        >
          {updateAvailabilityMutation.isPending ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Availability
            </>
          )}
        </Button>
      </div>
    </div>
  );
}