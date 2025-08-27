# Availability Management System

A comprehensive availability management system for instructors to manage their teaching schedules, time slots, and booking availability.

## 🎯 Overview

This system provides instructors with a complete solution for managing their availability, including:

- **Daily Availability Management**: Set availability for specific dates with custom time windows
- **Time Slot Generation**: Automatically generate bookable time slots based on availability settings
- **Conflict Detection**: Check for scheduling conflicts before setting availability
- **Slot Management**: Block/unblock individual time slots as needed
- **Statistics & Analytics**: Track utilization rates and booking statistics
- **Calendar Interface**: Visual calendar for easy availability management
- **Import/Export**: Backup and restore availability data

## 🏗️ Architecture

### Backend Integration

The system integrates with your NestJS backend through the following routes:

```typescript
// Core Availability Management
GET    /instructor-availability                    // Get instructor availability
POST   /instructor-availability                    // Create availability slot
PATCH  /instructor-availability/:id               // Update availability slot
DELETE /instructor-availability/:id               // Delete availability slot

// Time Slot Management
POST   /instructor-availability/generate-slots    // Generate time slots
GET    /instructor-availability/time-slots/available // Get available time slots
PATCH  /instructor-availability/time-slots/:slotId/block    // Block time slot
PATCH  /instructor-availability/time-slots/:slotId/unblock  // Unblock time slot

// Availability Checking
POST   /instructor-availability/check-availability // Check time slot availability

// Analytics & Reporting
GET    /instructor-availability/:instructorId/upcoming // Get upcoming availability
GET    /instructor-availability/:instructorId/stats    // Get availability statistics
```

### Frontend Components

#### 1. AvailabilitySetup (`features/sessions/components/instructor/AvailabilitySetup.tsx`)

The main availability management component with multiple views:

- **Calendar View**: Weekly calendar with availability visualization
- **List View**: Detailed list of all availability entries
- **Upcoming View**: Focus on next 7 days of availability
- **Settings View**: Bulk actions and configuration

**Features:**

- Create, edit, and delete availability slots
- Visual calendar interface
- Time slot generation
- Conflict checking
- Statistics dashboard
- Export/import functionality

#### 2. AvailabilityCalendar (`features/sessions/components/instructor/AvailabilityCalendar.tsx`)

A dedicated calendar component for visual availability management:

- **Monthly Calendar View**: Navigate through months
- **Availability Indicators**: Visual cues for available dates
- **Quick Actions**: Add availability directly from calendar
- **Export/Import**: Data backup and restoration

#### 3. TimeSlotManager (`features/sessions/components/instructor/TimeSlotManager.tsx`)

Detailed time slot management for specific availability periods:

- **Grid/List Views**: Multiple viewing modes
- **Slot Statistics**: Real-time slot status tracking
- **Block/Unblock**: Individual slot management
- **Booking Integration**: View and manage bookings

### Services & Utilities

#### 1. AvailabilityService (`features/sessions/services/availabilityService.ts`)

Business logic and utility functions:

```typescript
class AvailabilityService {
  // Generate time slots for availability windows
  static generateTimeSlots(options: TimeSlotGenerationOptions): TimeSlot[];

  // Check for scheduling conflicts
  static checkAvailabilityConflicts(
    startTime,
    endTime,
    sessions,
    bookings,
    blockedSlots
  ): AvailabilityConflict[];

  // Calculate availability statistics
  static calculateAvailabilityStats(availabilities): AvailabilityStats;

  // Validate availability data
  static validateAvailability(availability): string[];

  // Export/import functionality
  static exportAvailabilityData(availabilities): string;
  static importAvailabilityData(csvData): Partial<InstructorAvailability>[];
}
```

#### 2. API Integration (`features/sessions/services/api/liveSessionsApi.ts`)

Complete API integration with all backend routes:

```typescript
class LiveSessionsApiService {
  // Core availability management
  async getInstructorAvailability(
    instructorId,
    startDate?,
    endDate?
  ): Promise<InstructorAvailability[]>;
  async createAvailability(availability): Promise<InstructorAvailability>;
  async updateAvailability(id, updates): Promise<InstructorAvailability>;
  async deleteAvailability(id): Promise<void>;

  // Time slot management
  async generateTimeSlots(
    instructorId,
    startDate,
    endDate
  ): Promise<TimeSlot[]>;
  async getAvailableTimeSlots(
    instructorId,
    date,
    offeringId?
  ): Promise<TimeSlot[]>;
  async blockTimeSlot(slotId, reason?): Promise<TimeSlot>;
  async unblockTimeSlot(slotId): Promise<TimeSlot>;

  // Availability checking
  async checkAvailability(
    instructorId,
    date,
    startTime,
    endTime
  ): Promise<{ available: boolean; conflicts? }>;

  // Analytics
  async getUpcomingAvailability(
    instructorId,
    days?
  ): Promise<InstructorAvailability[]>;
  async getAvailabilityStats(instructorId): Promise<AvailabilityStats>;
}
```

#### 3. React Query Hooks (`features/sessions/hooks/useLiveSessions.ts`)

Comprehensive hooks for data fetching and mutations:

```typescript
// Query hooks
export const useInstructorAvailability = (instructorId, startDate?, endDate?)
export const useAvailableTimeSlots = (instructorId, date, offeringId?)
export const useUpcomingAvailability = (instructorId, days?)
export const useAvailabilityStats = (instructorId)

// Mutation hooks
export const useCreateAvailability = ()
export const useUpdateAvailability = ()
export const useDeleteAvailability = ()
export const useGenerateTimeSlots = ()
export const useCheckAvailability = ()
export const useBlockTimeSlot = ()
export const useUnblockTimeSlot = ()
```

## 📊 Data Models

### InstructorAvailability

```typescript
interface InstructorAvailability {
  id: string;
  instructorId: string;

  // Daily availability (day-by-day control)
  specificDate: Date;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format

  // Settings and rules
  isActive: boolean;
  maxSessionsInSlot: number;
  defaultSlotDuration: number;
  minAdvanceHours: number;
  maxAdvanceHours?: number;
  bufferMinutes: number;
  autoAcceptBookings: boolean;

  // Pricing overrides
  priceOverride?: number;
  currency?: string;

  // Metadata
  timezone: string;
  notes?: string;
  title?: string;

  // Generated time slots
  generatedSlots?: TimeSlot[];

  createdAt: Date;
  updatedAt: Date;
}
```

### TimeSlot

```typescript
interface TimeSlot {
  id: string;
  availabilityId: string;

  // Slot details
  startTime: Date;
  endTime: Date;
  date: Date;
  dayOfWeek: number;
  slotDuration: number;

  // Status
  isAvailable: boolean;
  isBooked: boolean;
  isBlocked: boolean;

  // Booking info
  maxBookings: number;
  currentBookings: number;

  // Metadata
  timezone: string;
  generatedAt: Date;
}
```

## 🚀 Usage Examples

### Creating Availability

```typescript
const createAvailabilityMutation = useCreateAvailability();

const handleCreateAvailability = async () => {
  await createAvailabilityMutation.mutateAsync({
    instructorId: user.id,
    specificDate: new Date("2024-01-15"),
    startTime: "09:00",
    endTime: "17:00",
    isActive: true,
    maxSessionsInSlot: 3,
    defaultSlotDuration: 60,
    minAdvanceHours: 12,
    bufferMinutes: 15,
    autoAcceptBookings: false,
    currency: "USD",
    timezone: "UTC",
    title: "Morning Session",
    notes: "Available for individual and group sessions",
  });
};
```

### Checking Availability Conflicts

```typescript
const checkAvailabilityMutation = useCheckAvailability();

const handleCheckAvailability = async () => {
  const result = await checkAvailabilityMutation.mutateAsync({
    instructorId: user.id,
    date: new Date("2024-01-15"),
    startTime: "10:00",
    endTime: "11:00",
  });

  if (result.available) {
    console.log("Time slot is available!");
  } else {
    console.log("Conflicts found:", result.conflicts);
  }
};
```

### Managing Time Slots

```typescript
const blockTimeSlotMutation = useBlockTimeSlot();
const unblockTimeSlotMutation = useUnblockTimeSlot();

// Block a time slot
await blockTimeSlotMutation.mutateAsync({
  slotId: "slot_123",
  reason: "Personal appointment",
});

// Unblock a time slot
await unblockTimeSlotMutation.mutateAsync("slot_123");
```

### Generating Time Slots

```typescript
const generateTimeSlotsMutation = useGenerateTimeSlots();

const handleGenerateSlots = async () => {
  await generateTimeSlotsMutation.mutateAsync({
    instructorId: user.id,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
  });
};
```

## 🎨 UI/UX Features

### Visual Indicators

- **Color-coded Status**: Green for available, yellow for booked, red for blocked
- **Calendar Integration**: Visual calendar with availability indicators
- **Real-time Updates**: Live statistics and status updates
- **Responsive Design**: Mobile-friendly interface

### User Experience

- **Intuitive Navigation**: Tab-based interface for different views
- **Quick Actions**: One-click availability creation and management
- **Bulk Operations**: Generate slots for date ranges
- **Conflict Prevention**: Real-time conflict checking
- **Data Export**: CSV export for backup and analysis

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **High Contrast**: Clear visual hierarchy
- **Responsive Design**: Works on all device sizes

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Timezone Configuration
NEXT_PUBLIC_DEFAULT_TIMEZONE=UTC

# Feature Flags
NEXT_PUBLIC_ENABLE_AVAILABILITY_EXPORT=true
NEXT_PUBLIC_ENABLE_AVAILABILITY_IMPORT=true
```

### Default Settings

```typescript
const DEFAULT_AVAILABILITY_SETTINGS = {
  defaultSlotDuration: 60, // minutes
  minAdvanceHours: 12,
  maxAdvanceHours: 720, // 30 days
  bufferMinutes: 15,
  maxSessionsInSlot: 1,
  autoAcceptBookings: false,
  currency: "USD",
  timezone: "UTC",
};
```

## 📈 Analytics & Reporting

### Availability Statistics

- **Total Slots**: Total number of time slots
- **Available Slots**: Slots available for booking
- **Booked Slots**: Slots with active bookings
- **Blocked Slots**: Manually blocked slots
- **Utilization Rate**: Percentage of slots that are booked

### Weekly Summary

- **Day-by-day Breakdown**: Availability per day of the week
- **Total Hours**: Total available hours per day
- **Booking Patterns**: Peak booking times and days

### Export Capabilities

- **CSV Export**: Complete availability data export
- **Date Range Selection**: Export specific date ranges
- **Custom Fields**: Include/exclude specific data fields

## 🔒 Security & Validation

### Input Validation

- **Time Validation**: Ensure start time is before end time
- **Date Validation**: Prevent setting availability in the past
- **Conflict Detection**: Check for overlapping availability
- **Capacity Limits**: Validate maximum sessions per slot

### Data Integrity

- **Cascade Deletion**: Proper cleanup when deleting availability
- **Booking Protection**: Prevent deletion of availability with active bookings
- **Audit Trail**: Track changes to availability settings

## 🧪 Testing

### Unit Tests

```typescript
// Test availability service functions
describe("AvailabilityService", () => {
  test("should generate time slots correctly", () => {
    const slots = AvailabilityService.generateTimeSlots({
      startTime: "09:00",
      endTime: "17:00",
      slotDuration: 60,
      bufferMinutes: 15,
      date: new Date("2024-01-15"),
    });

    expect(slots).toHaveLength(6); // 8 hours / 1.25 hours per slot
  });

  test("should detect conflicts correctly", () => {
    const conflicts = AvailabilityService.checkAvailabilityConflicts(
      new Date("2024-01-15T10:00:00"),
      new Date("2024-01-15T11:00:00"),
      existingSessions,
      existingBookings,
      blockedSlots
    );

    expect(conflicts).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// Test API integration
describe("Availability API", () => {
  test("should create availability successfully", async () => {
    const availability = await createAvailability({
      instructorId: "instructor_123",
      specificDate: new Date("2024-01-15"),
      startTime: "09:00",
      endTime: "17:00",
    });

    expect(availability.id).toBeDefined();
    expect(availability.generatedSlots).toHaveLength(6);
  });
});
```

## 🚀 Deployment

### Build Process

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

### Environment Setup

1. Configure API endpoints in environment variables
2. Set up database connections
3. Configure authentication providers
4. Set up monitoring and logging

## 📚 API Documentation

### Complete API Reference

For detailed API documentation, see the Swagger documentation at:
`http://localhost:3001/api-docs`

### Rate Limiting

- **Standard Endpoints**: 100 requests per minute
- **Bulk Operations**: 10 requests per minute
- **Analytics Endpoints**: 50 requests per minute

## 🤝 Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write unit tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information
4. Contact the development team

---

**Note**: This availability management system is designed to work seamlessly with your existing live sessions platform and provides a comprehensive solution for instructors to manage their teaching schedules effectively.
