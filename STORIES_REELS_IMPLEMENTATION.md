# Stories & Reels - Complete Implementation Guide

## 📋 Overview

A comprehensive Instagram-like Stories and Reels feature for instructors to create engaging content. This implementation includes privacy controls, view tracking, and a full-featured content management system.

## ✨ Features Implemented

### 1. **Stories (24-Hour Ephemeral Content)**

- ✅ Create stories with images or videos (max 15 seconds)
- ✅ Auto-expiration after 24 hours
- ✅ Like functionality
- ✅ View tracking (unique views per user)
- ✅ Public/Private privacy settings
- ✅ Full-screen Instagram-like viewer
- ✅ Progress bars and auto-advance
- ✅ Keyboard navigation (arrows, space, ESC)
- ✅ Double-tap to like

### 2. **Reels (Permanent Video Content)**

- ✅ Create reels with images or videos (max 90 seconds)
- ✅ Permanent content (doesn't expire)
- ✅ Like functionality
- ✅ View tracking (unique views per user)
- ✅ Public/Private privacy settings
- ✅ TikTok/Instagram-style vertical scroll feed
- ✅ Auto-play in viewport
- ✅ Infinite scroll pagination
- ✅ Double-tap to like

### 3. **Privacy Controls**

- **Public**: Visible to all followers/users
- **Private**: Only visible to the instructor (for drafts or personal content)
- Toggle switch in creation modals
- Default: Public

### 4. **View Tracking**

- Tracks unique views per user
- Prevents duplicate view counts
- Updates view count in real-time
- Silent failure (doesn't interrupt UX if tracking fails)
- Automatic tracking when content is viewed

### 5. **Content Management Dashboard**

- Located at: `/instructor/dashboard/content`
- Stats overview (stories, reels, views, likes)
- Grid view of all content
- Preview/watch your own content
- Delete functionality with confirmation
- Create new stories/reels

### 6. **Instructor Profile Integration**

- Stories bar at top of profile
- "Reels" tab in navigation
- Click to view in full-screen
- Shows only public content to visitors
- Shows all content to profile owner

## 🏗️ Architecture

### Frontend Structure

```
features/stories-reels/
├── components/
│   ├── CreateStoryModal.tsx       # Story creation with privacy toggle
│   ├── CreateReelModal.tsx        # Reel creation with privacy toggle
│   ├── StoryViewer.tsx            # Full-screen story viewer (with view tracking)
│   ├── ReelsFeed.tsx              # Infinite scroll feed (with view tracking)
│   ├── StoriesBar.tsx             # Horizontal stories bar
│   ├── ReelsGrid.tsx              # Grid display for profiles
│   └── index.ts                   # Exports
├── services/
│   └── storiesReelsService.ts     # API client with view tracking
types/
└── storiesReelsTypes.ts           # TypeScript types

app/
├── instructor/dashboard/content/  # Content management page
├── instructors/[instructorId]/    # Profile with stories/reels
└── reels/                         # Global reels feed
```

## 🔌 API Endpoints

### Stories

```typescript
POST   /stories-reels/story                    // Create story
GET    /stories-reels/stories                  // Get stories
POST   /stories-reels/story/:storyId/like     // Like/unlike story
POST   /stories-reels/story/:storyId/view     // Track story view ✨
DELETE /stories-reels/story/:storyId          // Delete story
```

### Reels

```typescript
POST   /stories-reels/reel                     // Create reel
GET    /stories-reels/reels                    // Get all reels (paginated)
GET    /stories-reels/instructor/:id/reels    // Get instructor reels
POST   /stories-reels/reel/:reelId/like       // Like/unlike reel
POST   /stories-reels/reel/:reelId/view       // Track reel view ✨
DELETE /stories-reels/reel/:reelId            // Delete reel
```

### Combined

```typescript
GET    /stories-reels/instructor/:id/feed     // Get stories + reels
```

## 📝 Request/Response Examples

### Create Story Request

```typescript
FormData {
  file: File,                    // Required: Image or video file
  caption: string,               // Optional: Max 200 chars
  duration: number,              // Optional: Video duration in seconds
  isPublic: boolean              // Optional: Default true ✨
}
```

### Create Reel Request

```typescript
FormData {
  file: File,                    // Required: Image or video file
  caption: string,               // Optional: Max 500 chars
  duration: number,              // Optional: Video duration in seconds
  isPublic: boolean              // Optional: Default true ✨
}
```

### View Tracking Response

```typescript
{
  viewed: boolean; // true if new view, false if already viewed
}
```

## 🎨 UI Components

### CreateStoryModal

- File upload with drag & drop
- Preview display (9:16 aspect ratio)
- Caption input (max 200 chars)
- **Privacy toggle** (Public/Private) ✨
- Duration validation (max 15s for videos)
- File size validation (max 50MB)

### CreateReelModal

- File upload with drag & drop
- Preview display (9:16 aspect ratio)
- Caption textarea (max 500 chars)
- **Privacy toggle** (Public/Private) ✨
- Duration validation (max 90s for videos)
- File size validation (max 200MB)

### StoryViewer

- Full-screen black background
- Progress bars for multiple stories
- Instructor info header
- Pause/play controls
- Navigation (click, arrows, swipe)
- Like button with heart animation
- **Auto view tracking** ✨
- Caption display at bottom

### ReelsFeed

- Vertical scroll with snap
- Auto-play videos in viewport
- **Auto view tracking on scroll** ✨
- Like button (simplified - removed share/more options)
- Instructor profile link
- Caption overlay
- Infinite scroll pagination

### StoriesBar

- Horizontal scrollable stories
- Gradient ring around thumbnails
- "Create Story" button for profile owner
- Click to open full-screen viewer

### ReelsGrid

- 3-column grid layout
- Play icon overlay on hover
- Stats display (likes, views)
- **Caption display on hover** ✨
- Click to open modal viewer
- Opens at selected reel index

## 🔒 Privacy Settings

### Public Content (isPublic: true)

- ✅ Visible to all followers
- ✅ Appears in global feeds
- ✅ Shows on instructor profile
- ✅ Followers receive notifications
- ✅ Anyone can view, like, and interact

### Private Content (isPublic: false)

- ✅ Only visible to content creator
- ❌ Not shown in global feeds
- ❌ Not visible on public profile
- ❌ No notifications sent
- ✅ Visible in content management dashboard
- 💡 Use case: Drafts, personal content, testing

## 📊 View Tracking System

### How It Works

1. **User views content** → Story appears in viewer OR Reel scrolls into viewport
2. **Track view request sent** → POST to `/story/:id/view` or `/reel/:id/view`
3. **Backend checks** → Is this a new view from this user?
4. **If new view** → Create view record + increment counter
5. **If already viewed** → Return false (no duplicate count)

### Implementation Details

- **Unique views**: One view per user per story/reel
- **Silent tracking**: Errors don't interrupt user experience
- **Set-based deduplication**: Prevents multiple requests in same session
- **Threshold-based**: View tracked when 70% of content is visible
- **Database records**: StoryView and ReelView tables track individual views

### Database Schema

```prisma
model StoryView {
  id        String   @id @default(cuid())
  storyId   String
  userId    String
  createdAt DateTime @default(now())

  @@unique([storyId, userId])
}

model ReelView {
  id        String   @id @default(cuid())
  reelId    String
  userId    String
  createdAt DateTime @default(now())

  @@unique([reelId, userId])
}
```

## 🎯 User Flows

### Creating a Story

1. Navigate to `/instructor/dashboard/content`
2. Click "Create Story"
3. Upload image/video (auto-validates duration)
4. Add optional caption
5. Toggle privacy (Public/Private)
6. Click "Create Story"
7. Story appears in dashboard and profile

### Creating a Reel

1. Navigate to `/instructor/dashboard/content`
2. Click "Create Reel"
3. Upload image/video (auto-validates duration)
4. Add optional caption
5. Toggle privacy (Public/Private)
6. Click "Create Reel"
7. Reel appears in dashboard and profile

### Viewing Stories

1. Visit instructor profile
2. See stories bar at top
3. Click story to open viewer
4. **View automatically tracked** ✨
5. Navigate with arrows/clicks
6. Double-tap to like
7. Auto-advances after duration

### Viewing Reels

1. Visit instructor profile → "Reels" tab
2. Click reel thumbnail
3. Modal opens with vertical scroll feed
4. **View tracked when reel scrolls into viewport** ✨
5. Scroll up/down to see more reels
6. Click heart to like
7. Click instructor info to visit profile

### Managing Content

1. Go to `/instructor/dashboard/content`
2. View stats overview
3. Switch between Stories/Reels tabs
4. Click content to preview
5. Hover to see stats and caption
6. Click delete button to remove
7. Confirm deletion

## 🔔 Notifications

### Notification Types

- `NEW_STORY` - Sent when instructor posts public story
- `NEW_REEL` - Sent when instructor posts public reel

### Notification Behavior

- Only sent for **public content**
- Sent to all **active followers**
- Includes instructor info and content ID
- Links to content for quick viewing

## 💡 Privacy Use Cases

### Public Stories/Reels

- Share teaching tips
- Course announcements
- Behind-the-scenes content
- Student testimonials
- Live session teasers

### Private Stories/Reels

- Draft content for review
- Personal testing
- Content planning
- Private notes
- Work-in-progress videos

## 🚀 Performance Optimizations

### View Tracking

- ✅ Single request per unique view
- ✅ Set-based deduplication in memory
- ✅ Silent failure (no error toasts)
- ✅ Async/non-blocking
- ✅ Optimistic UI (doesn't wait for response)

### Video Streaming

- ✅ Auto-play only in viewport (Intersection Observer)
- ✅ Pause when scrolled away
- ✅ Lazy loading for reels feed
- ✅ Infinite scroll with pagination

### Image Optimization

- ✅ Proper aspect ratio handling
- ✅ Object-fit for different sizes
- ✅ Preview before upload

## 🎨 Design Features

### Visual Indicators

- **Stories**: Blue gradient ring around thumbnails
- **Reels**: Purple accents in UI
- **Public**: Globe icon (blue/purple)
- **Private**: Lock icon (gray)
- **Hover effects**: Ring borders and overlay icons

### Responsive Design

- Mobile-friendly modals (max-h-90vh, scrollable)
- Touch-optimized controls
- Adaptive grid layouts (2/3/4/6 columns)
- Snap scrolling on mobile

## 📱 Mobile Experience

### Touch Gestures

- ✅ Tap left/right sides to navigate stories
- ✅ Double-tap to like
- ✅ Swipe up/down for reels
- ✅ Tap to pause/play

### Optimizations

- Snap scrolling for smooth transitions
- Large touch targets (48px minimum)
- Bottom sheet modals
- Reduced animations for performance

## 🔧 Technical Implementation

### Video Duration Detection

```typescript
async getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(Math.floor(video.duration));
    };
    video.src = URL.createObjectURL(file);
  });
}
```

### View Tracking Logic

```typescript
// In StoryViewer
useEffect(() => {
  const trackView = async () => {
    const token = await getToken();
    if (token) {
      await storiesReelsService.trackStoryView(currentStory.id, token);
    }
  };
  trackView();
}, [currentStory?.id]);

// In ReelsFeed (with Intersection Observer)
const observer = new IntersectionObserver(
  async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !trackedViews.has(reelId)) {
        trackedViews.add(reelId);
        await storiesReelsService.trackReelView(reelId, token);
      }
    }
  },
  { threshold: 0.7 }
);
```

## 📊 Stats & Analytics

### Available Metrics

- **Active Stories**: Count of non-expired stories
- **Total Reels**: Count of all reels
- **Total Views**: Combined views across all content
- **Total Likes**: Combined likes across all content
- **Individual Stats**: Per-story/reel views and likes

### Where to Find Stats

1. Content Management Dashboard - Overview cards
2. Hover over content thumbnails - Individual stats
3. While viewing - Live counts in viewer

## 🛡️ Validation & Constraints

### File Validation

| Type               | Stories                        | Reels                          |
| ------------------ | ------------------------------ | ------------------------------ |
| **Video Duration** | Max 15 seconds                 | Max 90 seconds                 |
| **File Size**      | Max 50MB                       | Max 200MB                      |
| **Formats**        | JPG, PNG, GIF, WebP, MP4, WebM | JPG, PNG, GIF, WebP, MP4, WebM |
| **Caption Length** | Max 200 chars                  | Max 500 chars                  |

### Frontend Validation

- File type checking
- File size validation
- Video duration extraction and validation
- Real-time feedback with toasts

### Backend Validation

- File type validation via ParseFilePipeBuilder
- File size limits enforced
- Video duration re-validation with FFmpeg
- Instructor role verification

## 🔄 Real-time Updates

### Notifications

- Followers receive notifications for new public stories/reels
- Notification includes instructor info and content link
- Click notification to view content directly

### View Counting

- Views increment in real-time
- Like counts update immediately (optimistic UI)
- Stats refresh when content is created/deleted

## 📍 Key Pages

### Content Management

**Path**: `/instructor/dashboard/content`

- Create stories and reels
- View all your content
- See comprehensive stats
- Preview and delete content

### Instructor Profile

**Path**: `/instructors/[instructorId]`

- Stories bar (if stories exist)
- Reels tab with grid layout
- Public content only (for visitors)
- All content (for profile owner)

### Global Reels Feed

**Path**: `/reels`

- Discover all public reels
- Infinite scroll experience
- Auto-play videos
- Like and interact

## 🎬 Viewer Features

### Story Viewer

- **Navigation**: Click sides, arrow keys, or swipe
- **Controls**: Pause/play, close
- **Interactions**: Like, double-tap to like
- **Progress**: Visual bars showing story progress
- **Auto-advance**: Automatically goes to next story
- **Keyboard shortcuts**:
  - `←` Previous story
  - `→` Next story
  - `Space` Pause/play
  - `Esc` Close viewer

### Reel Viewer

- **Scroll**: Vertical scroll with snap
- **Auto-play**: Plays when 70% visible
- **Like**: Click heart button
- **Double-tap**: Quick like
- **Profile link**: Click instructor info
- **Infinite scroll**: Auto-loads more reels
- **Opens at clicked reel**: Starts from selected index ✨

## 🎯 Best Practices

### For Instructors

#### Content Strategy

1. **Post regularly** - Keep followers engaged
2. **Use public for promotion** - Share course updates
3. **Use private for drafts** - Test before publishing
4. **Add captions** - Increase engagement
5. **Monitor stats** - See what content performs

#### Video Guidelines

1. **Keep stories short** - Under 10 seconds is ideal
2. **Make reels engaging** - First 3 seconds are crucial
3. **Use good lighting** - Clear, visible content
4. **Add value** - Teaching tips, quick lessons
5. **Be consistent** - Regular posting schedule

### For Development

#### Performance

- View tracking uses silent failures
- Intersection Observer for efficient auto-play
- Pagination prevents loading all reels at once
- Image/video optimization for web delivery

#### Error Handling

- All API calls wrapped in try-catch
- User-friendly error messages
- Graceful degradation
- Console logging for debugging

## 🐛 Troubleshooting

### Common Issues

**Video won't upload**

- Check file size (50MB stories, 200MB reels)
- Verify format (MP4 or WebM)
- Ensure duration is within limits

**Views not counting**

- Must be logged in to track views
- Each user counted only once per story/reel
- Check network/console for errors

**Stories not appearing**

- Check if story is public
- Verify story hasn't expired (24 hours)
- Ensure you're viewing the correct profile

**Reels not loading**

- Check pagination settings
- Verify content exists
- Check console for API errors

## 🔮 Future Enhancements

Potential features to add:

- [ ] Story replies/DMs
- [ ] Reel comments section
- [ ] Share to external platforms
- [ ] Story highlights (saved stories)
- [ ] Advanced analytics (demographics, retention)
- [ ] Scheduled posting
- [ ] Story templates and filters
- [ ] Music/audio library for reels
- [ ] Collaborative stories
- [ ] Polls and Q&A in stories
- [ ] Story archives
- [ ] Download own content
- [ ] Watermarking options

## 📈 Success Metrics

Track these KPIs:

- **Engagement rate**: (Likes + Views) / Followers
- **View completion**: % of users who watch full story
- **Like rate**: Likes / Views
- **Posting frequency**: Stories/Reels per week
- **Follower growth**: After posting content
- **Best performing content**: By views and likes

## 🎓 Conclusion

This Stories & Reels implementation provides instructors with powerful tools to engage their audience through ephemeral and permanent video content. The feature includes:

✅ Privacy controls for content visibility  
✅ Accurate view tracking with deduplication  
✅ Instagram-like viewing experience  
✅ Comprehensive content management  
✅ Real-time stats and analytics  
✅ Mobile-optimized interface  
✅ Production-ready code

The implementation is complete, tested, and ready for production use! 🚀
