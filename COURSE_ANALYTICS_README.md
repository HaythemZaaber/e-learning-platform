# Course Analytics System

A comprehensive and modern course analytics system for instructors to track and analyze their course performance with beautiful charts and detailed insights.

## 🚀 Features

### 📊 Comprehensive Analytics

- **Enrollment Trends**: Track enrollment patterns over time with interactive charts
- **Rating Distribution**: Visualize student ratings with multiple chart types
- **Engagement Metrics**: Monitor student engagement with session duration, progress rates, and interactions
- **Revenue Analytics**: Track revenue performance and conversion rates
- **Student Progress**: Monitor individual student progress and completion rates
- **Popular Content**: Identify most viewed and completed course content

### 🎨 Modern UI/UX

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Interactive Charts**: Built with Recharts for smooth animations and interactions
- **Real-time Updates**: Auto-refresh functionality with customizable intervals
- **Fullscreen Mode**: Toggle between normal and fullscreen view
- **Time Range Filters**: Analyze data for different time periods (7d, 30d, 90d, 1y, all)
- **Export Functionality**: Export analytics data for external analysis

### 📈 Chart Types

- **Line Charts**: For enrollment trends and revenue over time
- **Area Charts**: For cumulative enrollment tracking
- **Bar Charts**: For rating distribution
- **Pie Charts**: For categorical data visualization
- **Radial Bar Charts**: For engagement metrics
- **Progress Bars**: For completion rates and student progress

## 🏗️ Architecture

### Backend Integration

The system integrates with your GraphQL backend using the following DTOs:

```typescript
// Main analytics response
CourseAnalyticsData {
  courseId: string
  courseTitle: string
  totalEnrollments: number
  enrollmentTrend: EnrollmentTrend[]
  ratingDistribution: CourseRatingDistribution
  engagementMetrics: EngagementMetrics
  revenueStats: RevenueStats
  studentProgress: StudentProgress[]
  // ... more fields
}
```

### Frontend Components

#### 1. **Analytics Hook** (`useCourseAnalytics.ts`)

- Fetches analytics data from GraphQL API
- Handles loading states and error management
- Provides real-time refresh functionality
- Supports time range filtering

#### 2. **Chart Components**

- `EnrollmentTrendChart.tsx`: Interactive enrollment tracking
- `RatingDistributionChart.tsx`: Multiple chart variants (bar, pie, horizontal)
- `EngagementMetricsChart.tsx`: Radial charts for engagement metrics
- `RevenueChart.tsx`: Revenue trends and conversion tracking

#### 3. **Main Modal** (`CourseAnalyticsModal.tsx`)

- Tabbed interface for different analytics views
- Responsive layout with fullscreen support
- Export and refresh functionality
- Loading states and error handling

## 📱 Usage

### For Instructors

1. **Access Analytics**: Click the "Analytics" button on any course in the instructor dashboard
2. **Navigate Tabs**: Switch between Overview, Enrollment, Engagement, Revenue, Students, and Content tabs
3. **Filter Data**: Use the time range selector to analyze different periods
4. **Fullscreen Mode**: Click the maximize button for detailed analysis
5. **Export Data**: Use the export button to download analytics data

### For Developers

#### Using the Analytics Hook

```typescript
import { useCourseAnalytics } from "@/features/courses/hooks/useCourseAnalytics";

const MyComponent = ({ courseId }: { courseId: string }) => {
  const { analytics, loading, error, refetch, timeRange, setTimeRange } =
    useCourseAnalytics({
      courseId,
      enabled: true,
    });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>{analytics?.courseTitle}</h1>
      <p>Total Enrollments: {analytics?.totalEnrollments}</p>
      {/* Render your analytics UI */}
    </div>
  );
};
```

#### Using Individual Chart Components

```typescript
import { EnrollmentTrendChart } from "@/features/courses/components/analytics/charts/EnrollmentTrendChart";

<EnrollmentTrendChart
  data={analytics.enrollmentTrend}
  loading={loading}
  className="h-[400px]"
/>;
```

## 🎯 Key Metrics Tracked

### Enrollment Analytics

- Total enrollments
- Active students
- Completed students
- Enrollment trends over time
- Completion statistics

### Rating & Review Analytics

- Average rating
- Total ratings count
- Rating distribution (1-5 stars)
- Recent reviews with detailed breakdowns
- Course quality scores

### Engagement Metrics

- Total views and unique viewers
- Average session duration
- Average progress rate
- Total interactions
- Engagement score calculation

### Revenue Analytics

- Total revenue
- Average revenue per student
- Paid enrollments count
- Free to paid conversion rate
- Revenue trends over time

### Student Progress

- Individual student progress tracking
- Lecture completion rates
- Time spent in course
- Last access dates
- Student status (active, completed, inactive)

### Popular Content

- Most viewed lectures/content
- Completion rates by content
- Average ratings by content
- Content type breakdown

## 🔧 Configuration

### Time Ranges

The system supports multiple time ranges for analysis:

- `7d`: Last 7 days
- `30d`: Last 30 days (default)
- `90d`: Last 90 days
- `1y`: Last year
- `all`: All time data

### Chart Customization

Each chart component accepts customization props:

- `className`: Custom CSS classes
- `loading`: Loading state
- `variant`: Different chart types where applicable

### Export Options

The export functionality can be extended to support:

- CSV format
- PDF reports
- Excel files
- Custom date ranges

## 🚀 Performance Features

### Optimization

- **Lazy Loading**: Charts load only when needed
- **Memoization**: Components use React.memo for performance
- **Efficient Rendering**: Charts use virtualization for large datasets
- **Caching**: GraphQL queries are cached for better performance

### Real-time Updates

- **Auto Refresh**: Configurable refresh intervals
- **Manual Refresh**: Refresh button for immediate updates
- **Optimistic Updates**: UI updates before server response

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#3B82F6) for main metrics
- **Success**: Green (#10B981) for positive trends
- **Warning**: Yellow (#F59E0B) for attention items
- **Error**: Red (#EF4444) for negative trends
- **Neutral**: Gray scale for secondary information

### Typography

- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable font sizes
- **Metrics**: Large, prominent numbers
- **Labels**: Small, descriptive text

### Spacing & Layout

- **Consistent Grid**: 4px base unit
- **Card Layout**: Clean, bordered containers
- **Responsive**: Mobile-first approach
- **White Space**: Generous spacing for clarity

## 🔮 Future Enhancements

### Planned Features

1. **Comparative Analytics**: Compare multiple courses
2. **Predictive Analytics**: Forecast enrollment trends
3. **Advanced Filtering**: More granular data filtering
4. **Custom Dashboards**: Personalized analytics views
5. **Alerts & Notifications**: Automated insights and alerts
6. **API Integration**: Third-party analytics integration
7. **Advanced Visualizations**: More chart types and interactions

### Technical Improvements

1. **WebSocket Integration**: Real-time data updates
2. **Offline Support**: Cached analytics for offline viewing
3. **Performance Monitoring**: Analytics for the analytics system
4. **A/B Testing**: Test different analytics layouts
5. **Accessibility**: Enhanced screen reader support

## 🛠️ Development

### Prerequisites

- Node.js 18+
- React 18+
- TypeScript 4.9+
- GraphQL client (Apollo)

### Installation

```bash
npm install recharts framer-motion lucide-react
```

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
```

## 📄 License

This analytics system is part of the e-learning platform and follows the same licensing terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues with the analytics system, please:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

---

**Built with ❤️ for the e-learning platform**
