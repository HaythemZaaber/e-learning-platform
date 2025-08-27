import { InstructorAvailability, TimeSlot } from '../types/session.types';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, addMinutes, differenceInMinutes } from 'date-fns';

export interface AvailabilityStats {
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  blockedSlots: number;
  utilizationRate: number;
}

export interface AvailabilityConflict {
  type: 'session' | 'booking' | 'blocked';
  startTime: Date;
  endTime: Date;
  reason: string;
}

export interface TimeSlotGenerationOptions {
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferMinutes: number;
  date: Date;
}

export class AvailabilityService {
  /**
   * Generate time slots for a given availability window
   */
  static generateTimeSlots(options: TimeSlotGenerationOptions): TimeSlot[] {
    const { startTime, endTime, slotDuration, bufferMinutes, date } = options;
    
    const slots: TimeSlot[] = [];
    
    // Parse start and end times
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDateTime = new Date(date);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    const endDateTime = new Date(date);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    
    let currentSlotStart = new Date(startDateTime);
    
    while (currentSlotStart < endDateTime) {
      const currentSlotEnd = new Date(currentSlotStart.getTime() + slotDuration * 60 * 1000);
      
      // Check if this slot fits within the availability window
      if (currentSlotEnd <= endDateTime) {
        const slot: TimeSlot = {
          id: `slot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          availabilityId: '',
          startTime: currentSlotStart,
          endTime: currentSlotEnd,
          date: date,
          dayOfWeek: date.getDay(),
          slotDuration: slotDuration,
          isAvailable: true,
          isBooked: false,
          isBlocked: false,
          maxBookings: 1,
          currentBookings: 0,
          timezone: 'UTC',
          generatedAt: new Date(),
        };
        
        slots.push(slot);
      }
      
      // Move to next slot (including buffer time)
      currentSlotStart = new Date(currentSlotEnd.getTime() + bufferMinutes * 60 * 1000);
    }
    
    return slots;
  }

  /**
   * Check for conflicts in a time slot
   */
  static checkAvailabilityConflicts(
    startTime: Date,
    endTime: Date,
    existingSessions: any[],
    existingBookings: any[],
    blockedSlots: TimeSlot[]
  ): AvailabilityConflict[] {
    const conflicts: AvailabilityConflict[] = [];
    
    // Check session conflicts
    existingSessions.forEach(session => {
      if (
        (startTime < session.scheduledEnd && endTime > session.scheduledStart) ||
        (startTime >= session.scheduledStart && endTime <= session.scheduledEnd)
      ) {
        conflicts.push({
          type: 'session',
          startTime: session.scheduledStart,
          endTime: session.scheduledEnd,
          reason: `Conflicts with session: ${session.title || 'Untitled'}`
        });
      }
    });
    
    // Check booking conflicts
    existingBookings.forEach(booking => {
      if (
        (startTime < booking.endTime && endTime > booking.startTime) ||
        (startTime >= booking.startTime && endTime <= booking.endTime)
      ) {
        conflicts.push({
          type: 'booking',
          startTime: booking.startTime,
          endTime: booking.endTime,
          reason: `Conflicts with booking: ${booking.studentName || 'Student'}`
        });
      }
    });
    
    // Check blocked slot conflicts
    blockedSlots.forEach(slot => {
      if (
        (startTime < slot.endTime && endTime > slot.startTime) ||
        (startTime >= slot.startTime && endTime <= slot.endTime)
      ) {
        conflicts.push({
          type: 'blocked',
          startTime: slot.startTime,
          endTime: slot.endTime,
          reason: 'Time slot is blocked'
        });
      }
    });
    
    return conflicts;
  }

  /**
   * Calculate availability statistics
   */
  static calculateAvailabilityStats(availabilities: InstructorAvailability[]): AvailabilityStats {
    let totalSlots = 0;
    let availableSlots = 0;
    let bookedSlots = 0;
    let blockedSlots = 0;
    
    availabilities.forEach(availability => {
      if (availability.generatedSlots) {
        availability.generatedSlots.forEach(slot => {
          totalSlots++;
          
          if (slot.isBlocked) {
            blockedSlots++;
          } else if (slot.isBooked) {
            bookedSlots++;
          } else if (slot.isAvailable) {
            availableSlots++;
          }
        });
      }
    });
    
    const utilizationRate = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;
    
    return {
      totalSlots,
      availableSlots,
      bookedSlots,
      blockedSlots,
      utilizationRate
    };
  }

  /**
   * Get availability for a specific date range
   */
  static getAvailabilityForDateRange(
    availabilities: InstructorAvailability[],
    startDate: Date,
    endDate: Date
  ): InstructorAvailability[] {
    return availabilities.filter(availability => {
      const availabilityDate = new Date(availability.specificDate);
      return availabilityDate >= startDate && availabilityDate <= endDate;
    });
  }

  /**
   * Get upcoming availability
   */
  static getUpcomingAvailability(
    availabilities: InstructorAvailability[],
    days: number = 7
  ): InstructorAvailability[] {
    const startDate = new Date();
    const endDate = addDays(startDate, days);
    
    return this.getAvailabilityForDateRange(availabilities, startDate, endDate);
  }

  /**
   * Validate availability data
   */
  static validateAvailability(availability: Partial<InstructorAvailability>): string[] {
    const errors: string[] = [];
    
    if (!availability.specificDate) {
      errors.push('Date is required');
    }
    
    if (!availability.startTime) {
      errors.push('Start time is required');
    }
    
    if (!availability.endTime) {
      errors.push('End time is required');
    }
    
    if (availability.startTime && availability.endTime) {
      const [startHour, startMinute] = availability.startTime.split(':').map(Number);
      const [endHour, endMinute] = availability.endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      
      if (startMinutes >= endMinutes) {
        errors.push('Start time must be before end time');
      }
    }
    
    if (availability.maxSessionsInSlot && availability.maxSessionsInSlot < 1) {
      errors.push('Maximum sessions per slot must be at least 1');
    }
    
    if (availability.defaultSlotDuration && availability.defaultSlotDuration < 15) {
      errors.push('Slot duration must be at least 15 minutes');
    }
    
    if (availability.minAdvanceHours && availability.minAdvanceHours < 1) {
      errors.push('Minimum advance hours must be at least 1');
    }
    
    if (availability.bufferMinutes && availability.bufferMinutes < 0) {
      errors.push('Buffer minutes cannot be negative');
    }
    
    return errors;
  }

  /**
   * Format time slot for display
   */
  static formatTimeSlot(slot: TimeSlot): string {
    const startTime = format(slot.startTime, 'HH:mm');
    const endTime = format(slot.endTime, 'HH:mm');
    return `${startTime} - ${endTime}`;
  }

  /**
   * Get time slot status
   */
  static getTimeSlotStatus(slot: TimeSlot): 'available' | 'booked' | 'blocked' | 'unavailable' {
    if (slot.isBlocked) return 'blocked';
    if (slot.isBooked) return 'booked';
    if (slot.isAvailable) return 'available';
    return 'unavailable';
  }

  /**
   * Check if a time slot is in the past
   */
  static isTimeSlotInPast(slot: TimeSlot): boolean {
    return slot.startTime < new Date();
  }

  /**
   * Get available time slots for a specific date
   */
  static getAvailableTimeSlotsForDate(
    availabilities: InstructorAvailability[],
    date: Date,
    offeringId?: string
  ): TimeSlot[] {
    const dateAvailabilities = availabilities.filter(availability => 
      isSameDay(new Date(availability.specificDate), date)
    );
    
    const availableSlots: TimeSlot[] = [];
    
    dateAvailabilities.forEach(availability => {
      if (availability.generatedSlots) {
        availability.generatedSlots.forEach(slot => {
          if (slot.isAvailable && !slot.isBooked && !slot.isBlocked && !this.isTimeSlotInPast(slot)) {
            availableSlots.push(slot);
          }
        });
      }
    });
    
    return availableSlots.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  /**
   * Calculate booking capacity for a time slot
   */
  static getTimeSlotCapacity(slot: TimeSlot): { current: number; max: number; available: number } {
    return {
      current: slot.currentBookings,
      max: slot.maxBookings,
      available: slot.maxBookings - slot.currentBookings
    };
  }

  /**
   * Check if a time slot can accept more bookings
   */
  static canTimeSlotAcceptBookings(slot: TimeSlot): boolean {
    return slot.isAvailable && !slot.isBlocked && slot.currentBookings < slot.maxBookings;
  }

  /**
   * Get weekly availability summary
   */
  static getWeeklyAvailabilitySummary(availabilities: InstructorAvailability[]): {
    [dayOfWeek: number]: { count: number; totalHours: number }
  } {
    const summary: { [dayOfWeek: number]: { count: number; totalHours: number } } = {};
    
    availabilities.forEach(availability => {
      const dayOfWeek = new Date(availability.specificDate).getDay();
      const [startHour, startMinute] = availability.startTime.split(':').map(Number);
      const [endHour, endMinute] = availability.endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      const durationHours = (endMinutes - startMinutes) / 60;
      
      if (!summary[dayOfWeek]) {
        summary[dayOfWeek] = { count: 0, totalHours: 0 };
      }
      
      summary[dayOfWeek].count++;
      summary[dayOfWeek].totalHours += durationHours;
    });
    
    return summary;
  }

  /**
   * Export availability data
   */
  static exportAvailabilityData(availabilities: InstructorAvailability[]): string {
    const csvData = [
      ['Date', 'Start Time', 'End Time', 'Title', 'Status', 'Max Sessions', 'Duration', 'Notes'].join(','),
      ...availabilities.map(availability => [
        format(new Date(availability.specificDate), 'yyyy-MM-dd'),
        availability.startTime,
        availability.endTime,
        availability.title || '',
        availability.isActive ? 'Active' : 'Inactive',
        availability.maxSessionsInSlot,
        `${availability.defaultSlotDuration} minutes`,
        availability.notes || ''
      ].join(','))
    ].join('\n');
    
    return csvData;
  }

  /**
   * Import availability data from CSV
   */
  static importAvailabilityData(csvData: string): Partial<InstructorAvailability>[] {
    const lines = csvData.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    const data: Partial<InstructorAvailability>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const availability: Partial<InstructorAvailability> = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        
        switch (header.trim()) {
          case 'Date':
            availability.specificDate = parseISO(value);
            break;
          case 'Start Time':
            availability.startTime = value;
            break;
          case 'End Time':
            availability.endTime = value;
            break;
          case 'Title':
            availability.title = value;
            break;
          case 'Status':
            availability.isActive = value === 'Active';
            break;
          case 'Max Sessions':
            availability.maxSessionsInSlot = parseInt(value);
            break;
          case 'Duration':
            availability.defaultSlotDuration = parseInt(value);
            break;
          case 'Notes':
            availability.notes = value;
            break;
        }
      });
      
      data.push(availability);
    }
    
    return data;
  }
}
