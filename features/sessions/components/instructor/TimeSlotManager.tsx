"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Lock,
  Unlock,
  Eye,
  Calendar,
  DollarSign,
  MessageSquare,
  Settings,
  RefreshCw
} from 'lucide-react';
import { format, isSameDay, isToday, isPast, addMinutes } from 'date-fns';
import { TimeSlot, InstructorAvailability } from '../../types/session.types';
import { AvailabilityService } from '../../services/availabilityService';
import { cn } from '@/lib/utils';

interface TimeSlotManagerProps {
  availability: InstructorAvailability;
  timeSlots: TimeSlot[];
  onBlockSlot: (slotId: string, reason?: string) => void;
  onUnblockSlot: (slotId: string) => void;
  onEditSlot: (slot: TimeSlot) => void;
  onViewBookings: (slot: TimeSlot) => void;
  onGenerateSlots: () => void;
  isLoading?: boolean;
}

export function TimeSlotManager({
  availability,
  timeSlots,
  onBlockSlot,
  onUnblockSlot,
  onEditSlot,
  onViewBookings,
  onGenerateSlots,
  isLoading = false
}: TimeSlotManagerProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Group time slots by status
  const groupedSlots = useMemo(() => {
    const groups = {
      available: timeSlots.filter(slot => 
        slot.isAvailable && !slot.isBooked && !slot.isBlocked && !isPast(slot.startTime)
      ),
      booked: timeSlots.filter(slot => slot.isBooked),
      blocked: timeSlots.filter(slot => slot.isBlocked),
      past: timeSlots.filter(slot => isPast(slot.startTime))
    };

    return groups;
  }, [timeSlots]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = timeSlots.length;
    const available = groupedSlots.available.length;
    const booked = groupedSlots.booked.length;
    const blocked = groupedSlots.blocked.length;
    const past = groupedSlots.past.length;

    return { total, available, booked, blocked, past };
  }, [timeSlots, groupedSlots]);

  // Handle block slot
  const handleBlockSlot = () => {
    if (selectedSlot) {
      onBlockSlot(selectedSlot.id, blockReason);
      setIsBlockModalOpen(false);
      setBlockReason('');
      setSelectedSlot(null);
    }
  };

  // Handle unblock slot
  const handleUnblockSlot = (slot: TimeSlot) => {
    onUnblockSlot(slot.id);
  };

  // Get slot status badge
  const getSlotStatusBadge = (slot: TimeSlot) => {
    if (slot.isBlocked) {
      return <Badge variant="destructive" className="text-xs">Blocked</Badge>;
    }
    if (slot.isBooked) {
      return <Badge variant="secondary" className="text-xs">Booked</Badge>;
    }
    if (isPast(slot.startTime)) {
      return <Badge variant="outline" className="text-xs">Past</Badge>;
    }
    return <Badge variant="default" className="text-xs">Available</Badge>;
  };

  // Get slot capacity info
  const getSlotCapacity = (slot: TimeSlot) => {
    const capacity = AvailabilityService.getTimeSlotCapacity(slot);
    return `${capacity.current}/${capacity.max}`;
  };

  // Format slot time
  const formatSlotTime = (slot: TimeSlot) => {
    return `${format(slot.startTime, 'HH:mm')} - ${format(slot.endTime, 'HH:mm')}`;
  };

  // Render slot card
  const renderSlotCard = (slot: TimeSlot) => (
    <Card
      key={slot.id}
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        slot.isBlocked && "border-red-200 bg-red-50",
        slot.isBooked && "border-yellow-200 bg-yellow-50",
        isPast(slot.startTime) && "opacity-60"
      )}
      onClick={() => {
        setSelectedSlot(slot);
        setIsDetailsModalOpen(true);
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{formatSlotTime(slot)}</span>
          </div>
          {getSlotStatusBadge(slot)}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span>{slot.slotDuration} min</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Capacity:</span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{getSlotCapacity(slot)}</span>
            </div>
          </div>

          {slot.isBooked && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bookings:</span>
              <span className="text-blue-600 font-medium">{slot.currentBookings}</span>
            </div>
          )}

          {slot.isBlocked && (
            <div className="text-xs text-red-600">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Blocked
            </div>
          )}
        </div>

        <div className="flex gap-1 mt-3">
          {!slot.isBlocked && !isPast(slot.startTime) && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSlot(slot);
                setIsBlockModalOpen(true);
              }}
            >
              <Lock className="w-3 h-3 mr-1" />
              Block
            </Button>
          )}

          {slot.isBlocked && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleUnblockSlot(slot);
              }}
            >
              <Unlock className="w-3 h-3 mr-1" />
              Unblock
            </Button>
          )}

          {slot.isBooked && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onViewBookings(slot);
              }}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Render slot list item
  const renderSlotListItem = (slot: TimeSlot) => (
    <div
      key={slot.id}
      className={cn(
        "flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50",
        slot.isBlocked && "border-red-200 bg-red-50",
        slot.isBooked && "border-yellow-200 bg-yellow-50",
        isPast(slot.startTime) && "opacity-60"
      )}
      onClick={() => {
        setSelectedSlot(slot);
        setIsDetailsModalOpen(true);
      }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{formatSlotTime(slot)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{slot.slotDuration} min</span>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span className="text-sm">{getSlotCapacity(slot)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {getSlotStatusBadge(slot)}

        <div className="flex gap-1">
          {!slot.isBlocked && !isPast(slot.startTime) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSlot(slot);
                setIsBlockModalOpen(true);
              }}
            >
              <Lock className="w-3 h-3" />
            </Button>
          )}

          {slot.isBlocked && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleUnblockSlot(slot);
              }}
            >
              <Unlock className="w-3 h-3" />
            </Button>
          )}

          {slot.isBooked && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onViewBookings(slot);
              }}
            >
              <MessageSquare className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Time Slots</h3>
          <p className="text-sm text-muted-foreground">
            Manage time slots for {format(new Date(availability.specificDate), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={(value: 'grid' | 'list') => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateSlots}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-2xl font-bold">{stats.available}</p>
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
                <p className="text-2xl font-bold">{stats.booked}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold">{stats.blocked}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Past</p>
                <p className="text-2xl font-bold">{stats.past}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Slots */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeSlots.map(renderSlotCard)}
        </div>
      ) : (
        <div className="space-y-2">
          {timeSlots.map(renderSlotListItem)}
        </div>
      )}

      {/* Empty State */}
      {timeSlots.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium mb-2">No Time Slots</h4>
            <p className="text-muted-foreground mb-4">
              No time slots have been generated for this availability period.
            </p>
            <Button onClick={onGenerateSlots}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Time Slots
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Block Slot Modal */}
      <Dialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Time Slot</DialogTitle>
            <DialogDescription>
              Block this time slot to prevent bookings. You can unblock it later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedSlot && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{formatSlotTime(selectedSlot)}</p>
                <p className="text-sm text-muted-foreground">
                  {format(selectedSlot.startTime, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            )}

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
              <Button onClick={handleBlockSlot}>
                <Lock className="w-4 h-4 mr-2" />
                Block Time Slot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Slot Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Time Slot Details</DialogTitle>
            <DialogDescription>
              Detailed information about this time slot
            </DialogDescription>
          </DialogHeader>
          
          {selectedSlot && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Time:</span>
                  <span>{formatSlotTime(selectedSlot)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Date:</span>
                  <span>{format(selectedSlot.startTime, 'EEEE, MMMM d, yyyy')}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Duration:</span>
                  <span>{selectedSlot.slotDuration} minutes</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Capacity:</span>
                  <span>{getSlotCapacity(selectedSlot)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  {getSlotStatusBadge(selectedSlot)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Timezone:</span>
                  <span>{selectedSlot.timezone}</span>
                </div>

                {selectedSlot.isBooked && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Bookings:</span>
                    <span className="text-blue-600 font-medium">{selectedSlot.currentBookings}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {!selectedSlot.isBlocked && !isPast(selectedSlot.startTime) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      setSelectedSlot(selectedSlot);
                      setIsBlockModalOpen(true);
                    }}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Block Slot
                  </Button>
                )}

                {selectedSlot.isBlocked && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleUnblockSlot(selectedSlot);
                      setIsDetailsModalOpen(false);
                    }}
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    Unblock Slot
                  </Button>
                )}

                {selectedSlot.isBooked && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onViewBookings(selectedSlot);
                      setIsDetailsModalOpen(false);
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Bookings
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
