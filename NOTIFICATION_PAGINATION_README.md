# Notification Pagination System

## Overview

The notification system has been enhanced with a comprehensive pagination feature that replaces the previous scroll-based approach. This provides better performance, improved user experience, and easier navigation through large numbers of notifications.

## Features

### 1. Advanced Pagination Component

**File**: `components/notifications/NotificationPagination.tsx`

A reusable pagination component with the following features:

- **Page Navigation**:

  - First page button (double chevron left)
  - Previous page button
  - Dynamic page numbers with ellipsis for large page counts
  - Next page button
  - Last page button (double chevron right)

- **Smart Page Number Display**:

  - Shows up to 5 page numbers at a time
  - Always displays first and last page
  - Shows ellipsis (...) when there are gaps
  - Highlights current page

- **Items Per Page Selector**:

  - Choose between 10, 20, 30, or 50 items per page
  - Dynamically updates the view
  - Persists selection during session

- **Information Display**:
  - Shows "Showing X to Y of Z notifications"
  - Clear visual feedback on current position

### 2. Enhanced NotificationList Component

**File**: `components/notifications/NotificationList.tsx`

Updated with pagination support:

- **New Props**:

  - `initialItemsPerPage` - Set default items per page (default: 20)
  - `showItemsPerPage` - Show/hide items per page selector (default: true)
  - `showPagination` - Show/hide pagination controls (default: true)

- **Conditional Scroll**:

  - Scroll only applied when `maxHeight` prop is provided
  - Notification pages use page scroll (no internal scroll)
  - Dropdown still uses internal scroll for compact display

- **Dynamic Loading**:
  - Fetches notifications based on current page
  - Updates when items per page changes
  - Maintains tab and filter selections across pages

### 3. Updated Notification Pages

All role-based notification pages now use pagination:

- **Student Notifications**: `/student/notifications`
- **Instructor Notifications**: `/instructor/notifications`
- **Admin Notifications**: `/admin/notifications`

**Configuration**:

```tsx
<NotificationList
  showFilters={true}
  showTabs={true}
  showPagination={true}
  showItemsPerPage={true}
  initialItemsPerPage={20}
/>
```

### 4. Dashboard Sidebar Integration

Notification links are now available in the dashboard sidebar for all user roles:

- Student Dashboard → Notifications
- Instructor Dashboard → Notifications
- Admin Dashboard → Notifications

## Usage

### For Notification Pages (Full Pagination)

```tsx
import { NotificationList } from "@/components/notifications/NotificationList";

export default function NotificationsPage() {
  return (
    <NotificationList
      showFilters={true}
      showTabs={true}
      showPagination={true}
      showItemsPerPage={true}
      initialItemsPerPage={20}
    />
  );
}
```

### For Dropdowns (Compact with Scroll)

```tsx
import { NotificationList } from "@/components/notifications/NotificationList";

export default function NotificationDropdown() {
  return (
    <NotificationList
      maxHeight="400px" // Enables scroll
      showFilters={false}
      showTabs={false}
      showPagination={false}
      compact={true}
    />
  );
}
```

### Standalone Pagination Component

```tsx
import { NotificationPagination } from "@/components/notifications/NotificationPagination";

<NotificationPagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalCount={totalCount}
  itemsPerPage={itemsPerPage}
  onPageChange={(page) => handlePageChange(page)}
  onItemsPerPageChange={(items) => setItemsPerPage(items)}
  isLoading={isLoading}
  showItemsPerPage={true}
/>;
```

## Benefits

1. **Better Performance**:

   - Only loads visible notifications
   - Reduces DOM size for large notification lists
   - Faster rendering and interactions

2. **Improved UX**:

   - Clear navigation controls
   - Jump to specific pages
   - Customize items per page
   - Visual feedback on current position

3. **Accessibility**:

   - Keyboard navigation support
   - Clear button states (disabled/enabled)
   - Screen reader friendly

4. **Responsive Design**:

   - Mobile-friendly layout
   - Stacks controls on small screens
   - Touch-friendly button sizes

5. **Flexibility**:
   - Reusable pagination component
   - Configurable items per page
   - Can be used in any list context

## API Integration

The system works with the existing backend pagination API:

**Endpoint**: `GET /notifications?page={page}&limit={limit}`

**Response**:

```json
{
  "notifications": [...],
  "pagination": {
    "page": 1,
    "pages": 5,
    "total": 100
  }
}
```

## Components Involved

1. **NotificationPagination.tsx** - Pagination UI component
2. **NotificationList.tsx** - Main notification list with pagination
3. **useNotifications.ts** - Hook for notification data and pagination
4. **notification.store.ts** - Zustand store for state management
5. **NotificationDropdown.tsx** - Compact dropdown (uses scroll)
6. **NotificationItem.tsx** - Individual notification display

## Future Enhancements

Potential improvements for the pagination system:

1. **Infinite Scroll Option**: Add infinite scroll as an alternative to pagination
2. **Keyboard Shortcuts**: Add keyboard navigation (e.g., Arrow keys for pages)
3. **Quick Jump**: Add input field to jump to specific page number
4. **Bookmark Pages**: Remember user's last visited page
5. **Export Notifications**: Add ability to export notification history
6. **Batch Actions**: Select multiple notifications across pages

## Migration Notes

If migrating from the old scroll-based system:

1. The `maxHeight` prop is now optional and conditional
2. Pagination is enabled by default for notification pages
3. Items per page defaults to 20 (was fetching all before)
4. Page scroll is used instead of internal scroll on notification pages
5. Dropdown still maintains scroll behavior for compact display

## Testing

To test the pagination system:

1. Navigate to any notification page (`/student/notifications`, etc.)
2. Verify pagination controls appear
3. Change items per page and verify update
4. Navigate between pages using different controls
5. Test with different notification counts (0, 1-10, 11-20, 50+, 100+)
6. Verify filters and tabs work across pages
7. Check responsive behavior on mobile devices

## Support

For issues or questions about the pagination system, refer to:

- Component documentation in code comments
- Type definitions in `@/types/notificationTypes.ts`
- Hook implementation in `@/hooks/useNotifications.ts`
