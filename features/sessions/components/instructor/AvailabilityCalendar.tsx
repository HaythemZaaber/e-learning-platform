"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { InstructorAvailability, TimeSlot } from '../../types/session.types';
import { AvailabilityService } from '../../services/availabilityService';
import { cn } from '@/lib/utils';

interface AvailabilityCalendarProps {
  availabilities: InstructorAvailability[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onAvailabilitySelect: (availability: InstructorAvailability) => void;
  onAddAvailability: (date: Date) => void;
  onEditAvailability: (availability: InstructorAvailability) => void;
  onDeleteAvailability: (availability: InstructorAvailability) => void;
  onExportData: () => void;
  onImportData: (data: string) => void;
  isLoading?: boolean;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function AvailabilityCalendar({
  availabilities,
  selectedDate,
  onDateSelect,
  onAvailabilitySelect,
  onAddAvailability,
  onEditAvailability,
  onDeleteAvailability,
  onExportData,
  onImportData,
  isLoading = false
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState('');

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Get availability for a specific date
  const getAvailabilityForDate = (date: Date): InstructorAvailability[] => {
    return availabilities.filter(availability => 
      isSameDay(new Date(availability.specificDate), date)
    );
  };

  // Get time slots for a specific date
  const getTimeSlotsForDate = (date: Date): TimeSlot[] => {
    const dateAvailabilities = getAvailabilityForDate(date);
    const slots: TimeSlot[] = [];
    
    dateAvailabilities.forEach(availability => {
      if (availability.generatedSlots) {
        slots.push(...availability.generatedSlots);
      }
    });
    
    return slots;
  };

  // Calculate availability stats for a date
  const getDateStats = (date: Date) => {
    const slots = getTimeSlotsForDate(date);
    const totalSlots = slots.length;
    const availableSlots = slots.filter(slot => 
      slot.isAvailable && !slot.isBooked && !slot.isBlocked
    ).length;
    const bookedSlots = slots.filter(slot => slot.isBooked).length;
    const blockedSlots = slots.filter(slot => slot.isBlocked).length;
    
    return { totalSlots, availableSlots, bookedSlots, blockedSlots };
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Handle export
  const handleExport = () => {
    const csvData = AvailabilityService.exportAvailabilityData(availabilities);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `availability-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setIsExportModalOpen(false);
  };

  // Handle import
  const handleImport = () => {
    try {
      onImportData(importData);
      setImportData('');
      setIsImportModalOpen(false);
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              const dayAvailabilities = getAvailabilityForDate(day);
              const dayStats = getDateStats(day);
              
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors",
                    !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                    isSelected && "ring-2 ring-primary bg-primary/5",
                    isCurrentDay && "border-primary",
                    dayAvailabilities.length > 0 && "bg-green-50 border-green-200"
                  )}
                  onClick={() => onDateSelect(day)}
                >
                  {/* Date Number */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-sm font-medium",
                      isCurrentDay && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                    )}>
                      {format(day, 'd')}
                    </span>
                    
                    {dayAvailabilities.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dayAvailabilities.length}
                      </Badge>
                    )}
                  </div>

                  {/* Availability Summary */}
                  {dayAvailabilities.length > 0 && (
                    <div className="space-y-1">
                      {dayAvailabilities.slice(0, 2).map((availability) => (
                        <div
                          key={availability.id}
                          className="text-xs p-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAvailabilitySelect(availability);
                          }}
                        >
                          {availability.startTime} - {availability.endTime}
                          {availability.title && (
                            <div className="font-medium truncate">{availability.title}</div>
                          )}
                        </div>
                      ))}
                      
                      {dayAvailabilities.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{dayAvailabilities.length - 2} more
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stats Summary */}
                  {dayStats.totalSlots > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{dayStats.availableSlots}</span>
                      </div>
                      {dayStats.bookedSlots > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <Users className="w-3 h-3 text-blue-500" />
                          <span>{dayStats.bookedSlots}</span>
                        </div>
                      )}
                      {dayStats.blockedSlots > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <XCircle className="w-3 h-3 text-red-500" />
                          <span>{dayStats.blockedSlots}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add Button for Current Month */}
                  {isCurrentMonth && dayAvailabilities.length === 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full mt-2 h-6 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddAvailability(day);
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Has Availability</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Available Slots</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Booked Slots</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span>Blocked Slots</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Modal */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Availability Data</DialogTitle>
            <DialogDescription>
              Export your availability data as a CSV file for backup or analysis.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                The exported file will include all your availability settings including dates, times, and configurations.
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsExportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Availability Data</DialogTitle>
            <DialogDescription>
              Import availability data from a CSV file. Make sure the file follows the correct format.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">CSV Data</label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your CSV data here..."
                className="w-full h-32 p-2 border rounded-md resize-none"
              />
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Expected CSV format: Date, Start Time, End Time, Title, Status, Max Sessions, Duration, Notes
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportData('');
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleImport}
                disabled={!importData.trim()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
