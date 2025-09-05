"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  Save, 
  Settings,
  BarChart3,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Lock,
  Unlock,
  RefreshCw,
  CalendarDays,
  TrendingUp,
  Zap,
  CalendarCheck
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { 
  useInstructorAvailability,
  useCreateAvailability,
  useUpdateAvailability,
  useDeleteAvailability,
  useGenerateTimeSlots,
  useCheckAvailability,
  useAvailableTimeSlots,
  useBlockTimeSlot,
  useUnblockTimeSlot,
  useUpcomingAvailability,
  useAvailabilityStats
} from "../../hooks/useLiveSessions";
import { InstructorAvailability, TimeSlot } from "../../types/session.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AvailabilityFormData {
  specificDate: Date;
  startTime: string;
  endTime: string;
  isActive: boolean;
  maxSessionsInSlot: number;
  defaultSlotDuration: number;
  minAdvanceHours: number;
  maxAdvanceHours: number;
  bufferMinutes: number;
  autoAcceptBookings: boolean;
  priceOverride?: number;
  currency: string;
  timezone: string;
  notes?: string;
  title?: string;
}

const TIME_SLOTS = [
  "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
  "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
];

const DURATION_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

const BUFFER_OPTIONS = [
  { value: 0, label: "No buffer" },
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
];

export function AvailabilitySetup() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<InstructorAvailability | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  // Form state
  const [formData, setFormData] = useState<AvailabilityFormData>({
    specificDate: new Date(),
    startTime: "09:00",
    endTime: "17:00",
    isActive: true,
    maxSessionsInSlot: 1,
    defaultSlotDuration: 60,
    minAdvanceHours: 12,
    maxAdvanceHours: 720,
    bufferMinutes: 15,
    autoAcceptBookings: false,
    currency: "USD",
    timezone: "UTC",
  });

  // Data fetching
  const { data: availabilityList, isLoading: availabilityLoading, refetch: refetchAvailability } = 
    useInstructorAvailability(user?.id || "", undefined, undefined);
  
  const { data: upcomingAvailability, isLoading: upcomingLoading } = 
    useUpcomingAvailability(user?.id || "", 7);
  
  const { data: availabilityStats, isLoading: statsLoading } = 
    useAvailabilityStats(user?.id || "");
  
  const { data: availableTimeSlots, isLoading: timeSlotsLoading } = 
    useAvailableTimeSlots(user?.id || "", selectedDate);

  // Mutations
  const createAvailabilityMutation = useCreateAvailability();
  const updateAvailabilityMutation = useUpdateAvailability();
  const deleteAvailabilityMutation = useDeleteAvailability();
  const generateTimeSlotsMutation = useGenerateTimeSlots();
  const checkAvailabilityMutation = useCheckAvailability();
  const blockTimeSlotMutation = useBlockTimeSlot();
  const unblockTimeSlotMutation = useUnblockTimeSlot();

  // Computed values
  const weekDates = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  const availabilityForSelectedDate = useMemo(() => {
    return availabilityList?.filter(avail => 
      isSameDay(new Date(avail.specificDate), selectedDate)
    ) || [];
  }, [availabilityList, selectedDate]);

  // Update form data when editing availability
  useEffect(() => {
    if (editingAvailability) {
      setFormData({
        specificDate: new Date(editingAvailability.specificDate),
        startTime: editingAvailability.startTime,
        endTime: editingAvailability.endTime,
        isActive: editingAvailability.isActive,
        maxSessionsInSlot: editingAvailability.maxSessionsInSlot,
        defaultSlotDuration: editingAvailability.defaultSlotDuration,
        minAdvanceHours: editingAvailability.minAdvanceHours,
        maxAdvanceHours: editingAvailability.maxAdvanceHours || 720,
        bufferMinutes: editingAvailability.bufferMinutes,
        autoAcceptBookings: editingAvailability.autoAcceptBookings,
        priceOverride: editingAvailability.priceOverride,
        currency: editingAvailability.currency || "USD",
        timezone: editingAvailability.timezone || "UTC",
        notes: editingAvailability.notes || "",
        title: editingAvailability.title || "",
      });
    }
  }, [editingAvailability]);

  // Handlers
  const handleCreateAvailability = async () => {
    try {
      await createAvailabilityMutation.mutateAsync({
        instructorId: user?.id || "",
        ...formData,
      });
      setIsCreateModalOpen(false);
      setFormData({
        specificDate: new Date(),
        startTime: "09:00",
        endTime: "17:00",
        isActive: true,
        maxSessionsInSlot: 1,
        defaultSlotDuration: 60,
        minAdvanceHours: 12,
        maxAdvanceHours: 720,
        bufferMinutes: 15,
        autoAcceptBookings: false,
        currency: "USD",
        timezone: "UTC",
      });
    } catch (error) {
      console.error("Failed to create availability:", error);
    }
  };

  const handleUpdateAvailability = async (id: string, updates: Partial<InstructorAvailability>) => {
    try {
      await updateAvailabilityMutation.mutateAsync({ id, updates });
      setEditingAvailability(null);
    } catch (error) {
      console.error("Failed to update availability:", error);
    }
  };

  const handleDeleteAvailability = async (id: string) => {
    try {
      await deleteAvailabilityMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete availability:", error);
    }
  };

  const handleGenerateTimeSlots = async (startDate: Date, endDate: Date) => {
    try {
      await generateTimeSlotsMutation.mutateAsync({
        instructorId: user?.id || "",
        startDate,
        endDate,
      });
    } catch (error) {
      console.error("Failed to generate time slots:", error);
    }
  };

  const handleBlockTimeSlot = async (slotId: string) => {
    try {
      await blockTimeSlotMutation.mutateAsync({ slotId, reason: blockReason });
      setIsBlockModalOpen(false);
      setBlockReason("");
      setSelectedTimeSlot(null);
    } catch (error) {
      console.error("Failed to block time slot:", error);
    }
  };

  const handleUnblockTimeSlot = async (slotId: string) => {
    try {
      await unblockTimeSlotMutation.mutateAsync(slotId);
    } catch (error) {
      console.error("Failed to unblock time slot:", error);
    }
  };

  const handleCheckAvailability = async (date: Date, startTime: string, endTime: string) => {
    try {
      const result = await checkAvailabilityMutation.mutateAsync({
        instructorId: user?.id || "",
        date,
        startTime,
        endTime,
      });
      
      if (result.available) {
        toast.success("Time slot is available!");
      } else {
        toast.error("Time slot has conflicts");
      }
    } catch (error) {
      console.error("Failed to check availability:", error);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Please log in to manage your availability.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Availability Management</h2>
          <p className="text-muted-foreground">
            Manage your teaching schedule and time slots
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Availability
        </Button>
      </div>

      {/* Stats Overview */}
      {!statsLoading && availabilityStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Slots</p>
                  <p className="text-2xl font-bold">{availabilityStats.totalSlots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold">{availabilityStats.availableSlots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Booked</p>
                  <p className="text-2xl font-bold">{availabilityStats.bookedSlots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                  <p className="text-2xl font-bold">{availabilityStats.utilizationRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Weekly Calendar</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                      >
                        Previous Week
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                      >
                        Next Week
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div key={day} className="text-center font-medium text-sm p-2">
                        {day}
                      </div>
                    ))}
                    {weekDates.map((date) => {
                      const dayAvailabilities = availabilityList?.filter(avail => 
                        isSameDay(new Date(avail.specificDate), date)
                      ) || [];
                      
                      return (
                        <div
                          key={date.toISOString()}
                          className={cn(
                            "min-h-[100px] p-2 border rounded-lg cursor-pointer hover:bg-muted/50",
                            isSameDay(date, selectedDate) && "ring-2 ring-primary",
                            dayAvailabilities.length > 0 && "bg-green-50 border-green-200"
                          )}
                          onClick={() => setSelectedDate(date)}
                        >
                          <div className="text-sm font-medium mb-2">
                            {format(date, "d")}
                          </div>
                          {dayAvailabilities.map((avail) => (
                            <div
                              key={avail.id}
                              className="text-xs bg-blue-100 text-blue-800 p-1 rounded mb-1"
                            >
                              {avail.startTime} - {avail.endTime}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Date Details */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Availability for selected date */}
                  {availabilityForSelectedDate.length > 0 ? (
                    <div className="space-y-3">
                      {availabilityForSelectedDate.map((availability) => (
                        <div
                          key={availability.id}
                          className="p-3 border rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">
                                {availability.startTime} - {availability.endTime}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingAvailability(availability)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteAvailability(availability.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          {availability.title && (
                            <p className="text-sm font-medium">{availability.title}</p>
                          )}
                          <div className="flex gap-2">
                            <Badge variant={availability.isActive ? "default" : "secondary"}>
                              {availability.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                              {availability.maxSessionsInSlot} session{availability.maxSessionsInSlot !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="w-8 h-8 mx-auto mb-2" />
                      <p>No availability set for this date</p>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, specificDate: selectedDate }));
                          setIsCreateModalOpen(true);
                        }}
                      >
                        Add Availability
                      </Button>
                    </div>
                  )}

                  {/* Time slots for selected date */}
                  {!timeSlotsLoading && availableTimeSlots && availableTimeSlots.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Available Time Slots</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimeSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className={cn(
                              "p-2 text-xs border rounded cursor-pointer",
                              slot.isBlocked && "bg-red-50 border-red-200",
                              slot.isBooked && "bg-yellow-50 border-yellow-200",
                              !slot.isBlocked && !slot.isBooked && "bg-green-50 border-green-200"
                            )}
                            onClick={() => setSelectedTimeSlot(slot)}
                          >
                            {format(new Date(slot.startTime), "HH:mm")} - {format(new Date(slot.endTime), "HH:mm")}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Availability</CardTitle>
              <CardDescription>
                Manage your availability settings and time slots
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availabilityLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin" />
                  <p>Loading availability...</p>
                </div>
              ) : availabilityList && availabilityList.length > 0 ? (
                <div className="space-y-4">
                  {availabilityList.map((availability) => (
                    <div
                      key={availability.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-sm">
                            <p className="font-medium">
                              {format(new Date(availability.specificDate), "EEEE, MMMM d, yyyy")}
                            </p>
                            <p className="text-muted-foreground">
                              {availability.startTime} - {availability.endTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingAvailability(availability)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAvailability(availability.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge variant={availability.isActive ? "default" : "secondary"}>
                          {availability.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {availability.maxSessionsInSlot} session{availability.maxSessionsInSlot !== 1 ? 's' : ''}
                        </Badge>
                        <Badge variant="outline">
                          {availability.defaultSlotDuration}min slots
                        </Badge>
                        {availability.priceOverride && (
                          <Badge variant="outline">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {availability.priceOverride}
                          </Badge>
                        )}
                      </div>

                      {availability.notes && (
                        <p className="text-sm text-muted-foreground">{availability.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2" />
                  <p>No availability set</p>
                  <Button
                    className="mt-2"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Add Your First Availability
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming View */}
        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Availability</CardTitle>
              <CardDescription>
                Your availability for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin" />
                  <p>Loading upcoming availability...</p>
                </div>
              ) : upcomingAvailability && upcomingAvailability.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAvailability.map((availability) => (
                    <div
                      key={availability.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-sm">
                            <p className="font-medium">
                              {format(new Date(availability.specificDate), "EEEE, MMMM d, yyyy")}
                            </p>
                            <p className="text-muted-foreground">
                              {availability.startTime} - {availability.endTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingAvailability(availability)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge variant={availability.isActive ? "default" : "secondary"}>
                          {availability.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {availability.maxSessionsInSlot} session{availability.maxSessionsInSlot !== 1 ? 's' : ''}
                        </Badge>
                      </div>

                      {availability.generatedSlots && availability.generatedSlots.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Available Time Slots:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {availability.generatedSlots.slice(0, 6).map((slot) => (
                              <div
                                key={slot.id}
                                className="text-xs p-2 border rounded bg-green-50"
                              >
                                {format(new Date(slot.startTime), "HH:mm")} - {format(new Date(slot.endTime), "HH:mm")}
                              </div>
                            ))}
                            {availability.generatedSlots.length > 6 && (
                              <div className="text-xs p-2 border rounded bg-gray-50 text-center">
                                +{availability.generatedSlots.length - 6} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2" />
                  <p>No upcoming availability</p>
                  <Button
                    className="mt-2"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Add Availability
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings View */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
              <CardDescription>
                Generate time slots and manage availability in bulk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Generate Time Slots for Date Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={format(selectedDate, "yyyy-MM-dd")}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    />
                    <Input
                      type="date"
                      value={format(addDays(selectedDate, 7), "yyyy-MM-dd")}
                      onChange={(e) => {
                        const endDate = new Date(e.target.value);
                        handleGenerateTimeSlots(selectedDate, endDate);
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => handleGenerateTimeSlots(selectedDate, addDays(selectedDate, 7))}
                    className="w-full"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Time Slots
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Check Availability</Label>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                  <Button
                    onClick={() => handleCheckAvailability(selectedDate, formData.startTime, formData.endTime)}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Check Availability
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Availability Modal */}
      <Dialog open={isCreateModalOpen || !!editingAvailability} onOpenChange={() => {
        setIsCreateModalOpen(false);
        setEditingAvailability(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <DialogTitle className="text-xl">
              {editingAvailability ? "Edit Availability" : "Create New Availability"}
            </DialogTitle>
            <DialogDescription>
              Set your availability for a specific date with custom settings
            </DialogDescription>
          </DialogHeader>
          
                    <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={format(formData.specificDate, "yyyy-MM-dd")}
                      onChange={(e) => setFormData(prev => ({ ...prev, specificDate: new Date(e.target.value) }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Title (Optional)</Label>
                    <Input
                      placeholder="e.g., Morning Session, Afternoon Availability"
                      value={formData.title || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

                          {/* Time Settings Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold">Time Settings</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Select value={formData.startTime} onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}>
                      <SelectTrigger>
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Select value={formData.endTime} onValueChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}>
                      <SelectTrigger>
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
                  </div>
                </div>
                
              {/* Timezone Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Timezone</h3>
                </div>
                                 <div className="space-y-2">
                   <Label>Timezone</Label>
                   <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
                     <SelectTrigger>
                       <SelectValue placeholder="Select your timezone" />
                     </SelectTrigger>
                                           <SelectContent>
                        <div className="p-2">
                          <p className="text-sm font-medium text-muted-foreground mb-2">All Timezones</p>
                          <SelectItem value="UTC-12">🌍 UTC-12 - Baker Island, Howland Island</SelectItem>
                          <SelectItem value="UTC-11">🌍 UTC-11 - American Samoa, Niue</SelectItem>
                          <SelectItem value="UTC-10">🌍 UTC-10 - Hawaii, Tahiti</SelectItem>
                          <SelectItem value="UTC-9">🌍 UTC-9 - Alaska, French Polynesia</SelectItem>
                          <SelectItem value="UTC-8">🌍 UTC-8 - Pacific Time (PT) - Los Angeles, Seattle</SelectItem>
                          <SelectItem value="UTC-7">🌍 UTC-7 - Mountain Time (MT) - Denver, Phoenix</SelectItem>
                          <SelectItem value="UTC-6">🌍 UTC-6 - Central Time (CT) - Chicago, Dallas</SelectItem>
                          <SelectItem value="UTC-5">🌍 UTC-5 - Eastern Time (ET) - New York, Miami</SelectItem>
                          <SelectItem value="UTC-4">🌍 UTC-4 - Atlantic Time - Puerto Rico, Caracas</SelectItem>
                          <SelectItem value="UTC-3">🌍 UTC-3 - Brasília Time - São Paulo, Buenos Aires</SelectItem>
                          <SelectItem value="UTC-2">🌍 UTC-2 - Fernando de Noronha</SelectItem>
                          <SelectItem value="UTC-1">🌍 UTC-1 - Azores, Cape Verde</SelectItem>
                          <SelectItem value="UTC+0">🌍 UTC+0 - Universal Time (GMT) - London, Lisbon</SelectItem>
                          <SelectItem value="UTC+1">🌍 UTC+1 - Central European Time - Paris, Berlin, Rome</SelectItem>
                          <SelectItem value="UTC+2">🌍 UTC+2 - Eastern European Time - Athens, Cairo, Helsinki</SelectItem>
                          <SelectItem value="UTC+3">🌍 UTC+3 - Moscow Time - Moscow, Istanbul, Riyadh</SelectItem>
                          <SelectItem value="UTC+4">🌍 UTC+4 - Gulf Standard Time - Dubai, Baku, Tbilisi</SelectItem>
                          <SelectItem value="UTC+5">🌍 UTC+5 - Pakistan Standard Time - Karachi, Tashkent</SelectItem>
                          <SelectItem value="UTC+5:30">🌍 UTC+5:30 - India Standard Time - Mumbai, New Delhi</SelectItem>
                          <SelectItem value="UTC+6">🌍 UTC+6 - Bangladesh Time - Dhaka, Almaty</SelectItem>
                          <SelectItem value="UTC+7">🌍 UTC+7 - Indochina Time - Bangkok, Jakarta, Ho Chi Minh</SelectItem>
                          <SelectItem value="UTC+8">🌍 UTC+8 - China Standard Time - Beijing, Shanghai, Singapore</SelectItem>
                          <SelectItem value="UTC+9">🌍 UTC+9 - Japan Standard Time - Tokyo, Seoul, Pyongyang</SelectItem>
                          <SelectItem value="UTC+10">🌍 UTC+10 - Australian Eastern Time - Sydney, Melbourne</SelectItem>
                          <SelectItem value="UTC+11">🌍 UTC+11 - Solomon Islands, New Caledonia</SelectItem>
                          <SelectItem value="UTC+12">🌍 UTC+12 - New Zealand Standard Time - Auckland, Fiji</SelectItem>
                        </div>
                      </SelectContent>
                   </Select>
                   <div className="space-y-1">
                     <p className="text-xs text-muted-foreground">
                       <strong>Why is this important?</strong> Your timezone ensures that your availability times are displayed correctly to students worldwide.
                     </p>
                     <p className="text-xs text-muted-foreground">
                       <strong>Example:</strong> If you set "9:00 AM" in Eastern Time, students in London will see "2:00 PM" (during standard time).
                     </p>
                   </div>
                 </div>
              </div>
              </div>

                          {/* Slot Configuration Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold">Slot Configuration</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Max Sessions per Slot</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.maxSessionsInSlot}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxSessionsInSlot: parseInt(e.target.value) }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Slot Duration</Label>
                    <Select value={formData.defaultSlotDuration.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, defaultSlotDuration: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Buffer Minutes</Label>
                    <Select value={formData.bufferMinutes.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, bufferMinutes: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BUFFER_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

                          {/* Booking Rules Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold">Booking Rules</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min Advance Hours</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.minAdvanceHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, minAdvanceHours: parseInt(e.target.value) }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Max Advance Hours</Label>
                    <Input
                      type="number"
                      min="24"
                      value={formData.maxAdvanceHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxAdvanceHours: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

                          {/* Pricing Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold">Pricing</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price Override (Optional)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Leave empty to use offering price"
                      value={formData.priceOverride || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceOverride: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>


                          {/* Additional Settings Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold">Additional Settings</h3>
                </div>
                
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    placeholder="Any additional notes about this availability..."
                    value={formData.notes || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoAcceptBookings"
                      checked={formData.autoAcceptBookings}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoAcceptBookings: checked }))}
                    />
                    <Label htmlFor="autoAcceptBookings">Auto-accept bookings</Label>
                  </div>
                </div>
              </div>
          </div>
          </div>
          
          <div className="flex-shrink-0 pt-4 border-t flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingAvailability(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingAvailability) {
                  handleUpdateAvailability(editingAvailability.id, formData);
                } else {
                  handleCreateAvailability();
                }
              }}
              disabled={createAvailabilityMutation.isPending || updateAvailabilityMutation.isPending}
            >
              {editingAvailability ? "Update" : "Create"} Availability
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Block Time Slot Modal */}
      <Dialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Time Slot</DialogTitle>
            <DialogDescription>
              Block this time slot to prevent bookings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reason (Optional)</Label>
              <Textarea
                placeholder="Why are you blocking this time slot?"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsBlockModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedTimeSlot && handleBlockTimeSlot(selectedTimeSlot.id)}
                disabled={blockTimeSlotMutation.isPending}
              >
                Block Time Slot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}