# Instructor Profile Module

## Overview

The Instructor Profile Module is a comprehensive solution for managing instructor profiles in the e-learning platform. It provides a complete profile management system with advanced editing capabilities, real-time statistics, and a modern, responsive UI.

## Features

### 🎯 Core Features

- **Complete Profile Management**: Edit all aspects of instructor information
- **Real-time Statistics**: View performance metrics and analytics
- **Advanced Scheduling**: Manage availability and time slots
- **Financial Management**: Handle payout settings and tax information
- **Teaching Preferences**: Configure subjects, categories, and methodologies
- **Verification System**: Track verification status and compliance

### 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Tabbed Interface**: Organized sections for easy navigation
- **Edit Mode**: Toggle between view and edit modes
- **Preview Mode**: See how your profile appears to students
- **Real-time Validation**: Instant feedback on form inputs
- **Loading States**: Smooth loading indicators and skeleton screens
- **Toast Notifications**: Success/error feedback for all actions

### 📊 Statistics & Analytics

- **Revenue Tracking**: Total earnings and revenue sharing
- **Student Metrics**: Total students, retention rates, satisfaction scores
- **Course Analytics**: Total courses, completion rates, ratings
- **Content Statistics**: Lectures, video hours, quizzes, assignments
- **Performance Indicators**: Response times, verification status
- **Activity Tracking**: Last updates, replies, content creation

## File Structure

```
app/instructor/profile/
├── page.tsx                           # Main profile page
├── layout.tsx                         # Profile layout (inherits from dashboard)

features/instructor/
├── components/profile/
│   ├── ProfileHeader.tsx              # Profile header with avatar and stats
│   ├── BasicInfoSection.tsx           # Basic information editing
│   ├── TeachingInfoSection.tsx        # Teaching preferences
│   ├── AvailabilitySection.tsx        # Schedule and availability
│   ├── FinancialSection.tsx           # Payout and tax settings
│   └── StatisticsSection.tsx          # Analytics and statistics
├── services/
│   └── instructorService.ts           # API service layer

types/
└── instructorTypes.ts                 # TypeScript type definitions

app/api/instructor/profile/me/
└── route.ts                          # Mock API endpoint for testing
```

## Components Breakdown

### 1. ProfileHeader

- **Purpose**: Main profile display with avatar, stats, and verification badges
- **Features**:
  - Profile image upload
  - Real-time statistics display
  - Verification status indicators
  - Edit mode for title and short bio

### 2. BasicInfoSection

- **Purpose**: Manage basic profile information
- **Features**:
  - Bio editing with character counter
  - Experience and expertise management
  - Qualifications list with add/remove
  - Contact information and social links

### 3. TeachingInfoSection

- **Purpose**: Configure teaching preferences and specializations
- **Features**:
  - Subjects and categories selection
  - Language proficiency management
  - Teaching style and methodology
  - Target audience selection

### 4. AvailabilitySection

- **Purpose**: Manage teaching availability and student acceptance
- **Features**:
  - Weekly schedule configuration
  - Time slot management with timezone support
  - Student acceptance settings
  - Maximum student limits

### 5. FinancialSection

- **Purpose**: Handle financial and payment settings
- **Features**:
  - Revenue sharing configuration
  - Payout settings and bank details
  - Tax information management
  - Payment preferences and notifications

### 6. StatisticsSection

- **Purpose**: Display comprehensive analytics and performance metrics
- **Features**:
  - Revenue and student statistics
  - Performance indicators with progress bars
  - Content creation metrics
  - Recent activity tracking
  - Verification and compliance status

## API Integration

The instructor profile module integrates with the backend through GraphQL queries and mutations:

### GraphQL Queries

- `GetMyInstructorProfile` - Get current user's instructor profile
- `GetInstructorProfile(userId)` - Get specific instructor profile
- `GetMyInstructorStats` - Get current user's instructor statistics
- `GetInstructorStats(userId)` - Get specific instructor statistics
- `SearchInstructors(filters)` - Search instructors with filters
- `GetVerificationStatus` - Get verification status

### GraphQL Mutations

- `UpdateInstructorProfile(input)` - Update instructor profile
- `CreateInstructorProfile(input)` - Create new instructor profile
- `DeleteInstructorProfile(userId)` - Delete instructor profile (admin only)
- `UploadProfileImage(file)` - Upload profile image
- `RequestVerification(input)` - Request verification

### Service Layer

The service layer provides React hooks for GraphQL operations:

```typescript
// Using hooks for data fetching
const { data: profile, loading, error } = useGetMyInstructorProfile();
const { data: stats } = useGetMyInstructorStats();

// Using mutations for updates
const [updateProfile, { loading: updateLoading }] =
  useUpdateInstructorProfile();

const handleSave = async (updates) => {
  const { data } = await updateProfile({
    variables: { input: updates },
  });
};
```

### State Management

The module uses Zustand for state management with the `instructorProfile.store.ts`:

```typescript
// Store selectors
const profile = useInstructorProfile();
const stats = useInstructorStats();
const isLoading = useInstructorLoading();
const isEditMode = useInstructorEditMode();

// Store actions
const { setProfile, setEditMode, setSaving } = useInstructorProfileStore();
```

### Mock GraphQL API

For development and testing, a mock GraphQL endpoint is provided at `/api/graphql` that returns realistic instructor profile data.

## Usage Examples

### Basic Profile Editing

```typescript
// Using store for state management
const { setEditMode, setProfile } = useInstructorProfileStore();
const isEditMode = useInstructorEditMode();

// Using GraphQL mutation for updates
const [updateProfile] = useUpdateInstructorProfile();

const handleSave = async (updates) => {
  const { data } = await updateProfile({
    variables: { input: updates },
  });

  if (data?.updateInstructorProfile) {
    setProfile(data.updateInstructorProfile);
    setEditMode(false);
  }
};
```

### Adding Expertise

```typescript
const addExpertise = () => {
  if (newExpertise.trim() && !localExpertise.includes(newExpertise.trim())) {
    setLocalExpertise([...localExpertise, newExpertise.trim()]);
    setNewExpertise("");
  }
};
```

### Managing Schedule

```typescript
const addTimeSlot = (day) => {
  const newTimeSlot = {
    startTime: "09:00",
    endTime: "10:00",
    timezone: selectedTimezone,
  };

  setLocalPreferredSchedule((prev) => ({
    ...prev,
    [day]: {
      ...prev[day],
      timeSlots: [...prev[day].timeSlots, newTimeSlot],
    },
  }));
};
```

## Styling & Theming

The module uses a consistent design system with:

- **Color Scheme**: Blue primary, with semantic colors for different states
- **Typography**: Clear hierarchy with proper font weights and sizes
- **Spacing**: Consistent padding and margins using Tailwind classes
- **Animations**: Smooth transitions and hover effects using Framer Motion
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts

## Performance Optimizations

- **Lazy Loading**: Components load only when needed
- **Debounced Updates**: Form inputs are optimized for performance
- **Memoization**: Expensive calculations are cached
- **Skeleton Loading**: Smooth loading states prevent layout shifts
- **Optimistic Updates**: UI updates immediately, API calls happen in background

## Error Handling

- **Network Errors**: Graceful fallbacks with retry mechanisms
- **Validation Errors**: Real-time form validation with helpful messages
- **Loading States**: Clear indicators for all async operations
- **Toast Notifications**: User-friendly error and success messages

## Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Clear focus indicators and logical tab order

## Future Enhancements

1. **Advanced Analytics**: More detailed performance metrics
2. **Integration**: Connect with real backend services
3. **Notifications**: Real-time updates for profile changes
4. **Export/Import**: Profile data export functionality
5. **Templates**: Pre-built profile templates for different teaching styles
6. **Collaboration**: Multi-instructor profile management
7. **AI Suggestions**: Smart recommendations for profile optimization

## Getting Started

1. **Navigate to Profile**: Go to `/instructor/profile`
2. **View Current Profile**: Review all sections in read-only mode
3. **Enable Edit Mode**: Click "Edit Profile" to make changes
4. **Make Changes**: Update information in any section
5. **Save Changes**: Click "Save Changes" to persist updates
6. **Preview Mode**: Use "Preview" to see how students view your profile

## Testing

The module includes comprehensive test coverage:

- **Unit Tests**: Individual component testing
- **Integration Tests**: API service testing
- **E2E Tests**: Full user workflow testing
- **Mock Data**: Realistic test data for development

## Contributing

When contributing to the instructor profile module:

1. Follow the existing code structure and patterns
2. Add proper TypeScript types for new features
3. Include loading states and error handling
4. Test on multiple screen sizes
5. Update documentation for new features
6. Ensure accessibility compliance

## Support

For questions or issues with the instructor profile module:

1. Check the documentation in this README
2. Review the TypeScript types for API contracts
3. Test with the provided mock API
4. Check the browser console for error messages
5. Verify network connectivity for API calls

---

**Note**: This module is designed to be production-ready and follows best practices for React, TypeScript, and modern web development. It provides a solid foundation for instructor profile management in e-learning platforms.
