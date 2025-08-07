# Backend API Routes & GraphQL Schema

## Overview

This document outlines the backend API routes and GraphQL schema needed to support the comprehensive course filtering and data management functionality implemented in the frontend.

## GraphQL Schema

### Types

```graphql
# Course Types
type Course {
  id: ID!
  title: String!
  subtitle: String
  description: String!
  shortDescription: String
  slug: String!
  image: String
  thumbnail: String
  previewVideo: String
  trailer: String
  galleryImages: [String!]

  # Categorization
  category: String!
  subcategory: String
  tags: [String!]!
  level: CourseLevel!
  status: CourseStatus!

  # Pricing
  price: Float!
  originalPrice: Float
  discountPrice: Float
  currency: String!
  discountPercent: Int
  discountValidUntil: DateTime

  # Metrics
  rating: Float!
  ratingCount: Int!
  totalStudents: Int!
  totalDuration: String!
  totalLectures: Int!
  totalSections: Int!
  views: Int!
  uniqueViews: Int!
  completionRate: Float!

  # Badges & Features
  badge: String
  badgeColor: String
  featured: Boolean!
  bestseller: Boolean!
  trending: Boolean!
  isFeatured: Boolean!

  # Instructor
  instructor: Instructor!
  instructorId: ID!

  # Content Structure
  sections: [CourseSection!]!

  # Requirements & Outcomes
  requirements: [String!]!
  whatYoullLearn: [String!]!
  objectives: [String!]
  prerequisites: [String!]

  # Course Details
  language: String!
  hasSubtitles: Boolean!
  subtitleLanguages: [String!]
  hasCertificate: Boolean!
  hasLifetimeAccess: Boolean!
  hasMobileAccess: Boolean!

  # Enhanced Features
  hasAITutor: Boolean
  aiPersonality: String
  hasAIQuizzes: Boolean
  hasInteractiveElements: Boolean
  hasLiveSessions: Boolean
  hasProjectWork: Boolean
  hasDiscussions: Boolean
  hasAssignments: Boolean
  downloadableResources: Boolean
  offlineAccess: Boolean
  mobileOptimized: Boolean

  # Scheduling
  enrollmentStartDate: DateTime
  enrollmentEndDate: DateTime
  courseStartDate: DateTime
  courseEndDate: DateTime

  # Capacity
  maxStudents: Int
  currentEnrollments: Int!
  waitlistEnabled: Boolean!

  # Reviews
  reviews: [CourseReview!]!

  # SEO & Marketing
  seoTitle: String
  seoDescription: String
  seoTags: [String!]
  marketingTags: [String!]
  targetAudience: [String!]

  # Analytics
  avgRating: Float!
  totalRatings: Int!

  # Content Metrics
  codingExercises: Int
  articles: Int
  quizCount: Int
  assignmentCount: Int

  # User-specific fields (if authenticated)
  isBookmarked: Boolean
  isEnrolled: Boolean
  userProgress: Float
  userLastAccessed: DateTime

  # Timestamps
  createdAt: DateTime!
  updatedAt: DateTime!
  publishedAt: DateTime
  archivedAt: DateTime
}

# Instructor Type
type Instructor {
  id: ID!
  firstName: String!
  lastName: String!
  name: String!
  email: String!
  avatar: String
  profileImage: String
  title: String
  bio: String
  expertise: [String!]
  rating: Float!
  totalStudents: Int!
  totalCourses: Int!
}

# Course Section Type
type CourseSection {
  id: ID!
  title: String!
  description: String
  order: Int!
  lectures: [CourseLecture!]!
}

# Course Lecture Type
type CourseLecture {
  id: ID!
  title: String!
  description: String
  type: LectureType!
  content: String
  videoUrl: String
  duration: Int!
  order: Int!
  isPreview: Boolean!
  settings: JSON
  contentItem: ContentItem
}

# Content Item Type
type ContentItem {
  id: ID!
  title: String!
  type: ContentType!
  fileUrl: String
  fileName: String
  fileSize: Int
  mimeType: String
  order: Int!
}

# Course Review Type
type CourseReview {
  id: ID!
  rating: Float!
  comment: String
  createdAt: DateTime!
  user: User!
}

# User Type
type User {
  id: ID!
  name: String!
  avatar: String
}

# Pagination Type
type PaginationInfo {
  currentPage: Int!
  totalPages: Int!
  totalItems: Int!
  itemsPerPage: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

# Filter Facets Type
type FilterFacets {
  categories: [CategoryFacet!]!
  levels: [LevelFacet!]!
  priceRange: PriceRangeFacet!
  durations: [DurationFacet!]!
  ratings: [RatingFacet!]!
}

# Category Facet Type
type CategoryFacet {
  name: String!
  count: Int!
}

# Level Facet Type
type LevelFacet {
  name: String!
  count: Int!
}

# Price Range Facet Type
type PriceRangeFacet {
  min: Float!
  max: Float!
  avg: Float!
}

# Duration Facet Type
type DurationFacet {
  name: String!
  count: Int!
}

# Rating Facet Type
type RatingFacet {
  rating: Int!
  count: Int!
}

# Course Filters Input
input CourseFiltersInput {
  search: String
  categories: [String!]
  subcategories: [String!]
  levels: [CourseLevel!]
  priceRange: [Float!]
  durations: [String!]
  ratings: [Int!]
  instructors: [String!]
  languages: [String!]
  features: [String!]
  tags: [String!]
  enrollmentTypes: [EnrollmentType!]
  showFeatured: Boolean
  showNew: Boolean
  showBestsellers: Boolean
  sortBy: SortOption
  sortOrder: SortOrder
}

# Pagination Input
input PaginationInput {
  page: Int
  limit: Int
}

# Enums
enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
  ALL_LEVELS
}

enum CourseStatus {
  DRAFT
  UNDER_REVIEW
  PUBLISHED
  ARCHIVED
  SUSPENDED
  COMING_SOON
}

enum LectureType {
  VIDEO
  TEXT
  AUDIO
  QUIZ
  ASSIGNMENT
  IMAGE
  DOCUMENT
  ARCHIVE
  RESOURCE
}

enum ContentType {
  VIDEO
  AUDIO
  DOCUMENT
  TEXT
  QUIZ
  ASSIGNMENT
  RESOURCE
  IMAGE
  ARCHIVE
}

enum EnrollmentType {
  FREE
  PAID
  SUBSCRIPTION
  INVITATION_ONLY
  WAITLIST
}

enum SortOption {
  newest
  popular
  rating
  price-low
  price-high
  duration
  enrollments
}

enum SortOrder {
  asc
  desc
}

# Response Types
type CoursesResponse {
  courses: [Course!]!
  pagination: PaginationInfo!
  filters: FilterFacets!
}

type CourseResponse {
  course: Course!
}

type CategoriesResponse {
  categories: [CategoryFacet!]!
}

type LevelsResponse {
  levels: [LevelFacet!]!
}

type CourseStatsResponse {
  totalCourses: Int!
  totalStudents: Int!
  totalInstructors: Int!
  averageRating: Float!
  totalRevenue: Float!
  featuredCourses: Int!
  trendingCourses: Int!
  categories: [CategoryFacet!]!
  levels: [LevelFacet!]!
}

# Mutation Response Types
type BookmarkResponse {
  success: Boolean!
  message: String!
  courseId: ID!
}

type EnrollmentResponse {
  success: Boolean!
  message: String!
  courseId: ID!
}

type ProgressResponse {
  success: Boolean!
  message: String!
  courseId: ID!
  progress: Float!
}

type ReviewResponse {
  success: Boolean!
  message: String!
  reviewId: ID!
}

type TrackingResponse {
  success: Boolean!
  message: String!
}
```

## Queries

```graphql
# Main Course Queries
query GetAllCourses(
  $filters: CourseFiltersInput
  $pagination: PaginationInput
) {
  getAllCourses(filters: $filters, pagination: $pagination) {
    courses {
      id
      title
      subtitle
      description
      shortDescription
      slug
      image
      thumbnail
      previewVideo
      trailer
      galleryImages

      # Categorization
      category
      subcategory
      tags
      level
      status

      # Pricing
      price
      originalPrice
      discountPrice
      currency
      discountPercent
      discountValidUntil

      # Metrics
      rating
      ratingCount
      totalStudents
      totalDuration
      totalLectures
      totalSections
      views
      uniqueViews
      completionRate

      # Badges & Features
      badge
      badgeColor
      featured
      bestseller
      trending
      isFeatured

      # Instructor
      instructor {
        id
        firstName
        lastName
        name
        email
        avatar
        profileImage
        title
        bio
        expertise
        rating
        totalStudents
        totalCourses
      }
      instructorId

      # Content Structure
      sections {
        id
        title
        description
        order
        lectures {
          id
          title
          description
          type
          duration
          order
          isPreview
        }
      }

      # Requirements & Outcomes
      requirements
      whatYoullLearn
      objectives
      prerequisites

      # Course Details
      language
      hasSubtitles
      subtitleLanguages
      hasCertificate
      hasLifetimeAccess
      hasMobileAccess

      # Enhanced Features
      hasAITutor
      aiPersonality
      hasAIQuizzes
      hasInteractiveElements
      hasLiveSessions
      hasProjectWork
      hasDiscussions
      hasAssignments
      downloadableResources
      offlineAccess
      mobileOptimized

      # Scheduling
      enrollmentStartDate
      enrollmentEndDate
      courseStartDate
      courseEndDate

      # Capacity
      maxStudents
      currentEnrollments
      waitlistEnabled

      # Reviews
      reviews {
        id
        rating
        comment
        createdAt
        user {
          id
          name
          avatar
        }
      }

      # SEO & Marketing
      seoTitle
      seoDescription
      seoTags
      marketingTags
      targetAudience

      # Analytics
      avgRating
      totalRatings

      # Content Metrics
      codingExercises
      articles
      quizCount
      assignmentCount

      # User-specific fields (if authenticated)
      isBookmarked
      isEnrolled
      userProgress
      userLastAccessed

      # Timestamps
      createdAt
      updatedAt
      publishedAt
      archivedAt
    }
    pagination {
      currentPage
      totalPages
      totalItems
      itemsPerPage
      hasNextPage
      hasPreviousPage
    }
    filters {
      categories
      levels
      priceRange
      ratings
      durations
    }
  }
}

# Featured Courses Query
query GetFeaturedCourses($limit: Int) {
  getFeaturedCourses(limit: $limit) {
    id
    title
    subtitle
    description
    shortDescription
    image
    thumbnail
    category
    level
    price
    originalPrice
    rating
    ratingCount
    totalStudents
    totalDuration
    featured
    bestseller
    trending
    instructor {
      id
      name
      avatar
      title
    }
    createdAt
  }
}

# Trending Courses Query
query GetTrendingCourses($limit: Int) {
  getTrendingCourses(limit: $limit) {
    id
    title
    subtitle
    description
    shortDescription
    image
    thumbnail
    category
    level
    price
    originalPrice
    rating
    ratingCount
    totalStudents
    totalDuration
    trending
    instructor {
      id
      name
      avatar
      title
    }
    createdAt
  }
}

# Single Course Query
query GetCourseById($courseId: String!) {
  getCourse(courseId: $courseId) {
    id
    title
    subtitle
    description
    shortDescription
    slug
    image
    thumbnail
    previewVideo
    trailer
    galleryImages

    # Categorization
    category
    subcategory
    tags
    level
    status

    # Pricing
    price
    originalPrice
    discountPrice
    currency
    discountPercent
    discountValidUntil

    # Metrics
    rating
    ratingCount
    totalStudents
    totalDuration
    totalLectures
    totalSections
    views
    uniqueViews
    completionRate

    # Badges & Features
    badge
    badgeColor
    featured
    bestseller
    trending
    isFeatured

    # Instructor
    instructor {
      id
      firstName
      lastName
      name
      email
      avatar
      profileImage
      title
      bio
      expertise
      rating
      totalStudents
      totalCourses
    }
    instructorId

    # Content Structure
    sections {
      id
      title
      description
      order
      lectures {
        id
        title
        description
        type
        content
        videoUrl
        duration
        order
        isPreview
        settings

        contentItem {
          id
          title
          type
          fileUrl
          fileName
          fileSize
          mimeType
          order
        }
      }
    }

    # Requirements & Outcomes
    requirements
    whatYoullLearn
    objectives
    prerequisites

    # Course Details
    language
    hasSubtitles
    subtitleLanguages
    hasCertificate
    hasLifetimeAccess
    hasMobileAccess

    # Enhanced Features
    hasAITutor
    aiPersonality
    hasAIQuizzes
    hasInteractiveElements
    hasLiveSessions
    hasProjectWork
    hasDiscussions
    hasAssignments
    downloadableResources
    offlineAccess
    mobileOptimized

    # Scheduling
    enrollmentStartDate
    enrollmentEndDate
    courseStartDate
    courseEndDate

    # Capacity
    maxStudents
    currentEnrollments
    waitlistEnabled

    # Reviews
    reviews {
      id
      rating
      comment
      createdAt
      user {
        id
        name
        avatar
      }
    }

    # SEO & Marketing
    seoTitle
    seoDescription
    seoTags
    marketingTags
    targetAudience

    # Analytics
    avgRating
    totalRatings

    # Content Metrics
    codingExercises
    articles
    quizCount
    assignmentCount

    # User-specific fields (if authenticated)
    isBookmarked
    isEnrolled
    userProgress
    userLastAccessed

    # Timestamps
    createdAt
    updatedAt
    publishedAt
    archivedAt
  }
}

# Categories Query
query GetCourseCategories {
  getCourseCategories {
    id
    name
    description
    slug
    image
    courseCount
    subcategories {
      id
      name
      slug
      courseCount
    }
  }
}

# Levels Query
query GetCourseLevels {
  getCourseLevels {
    id
    name
    description
    courseCount
  }
}

# Course Stats Query
query GetCourseStats {
  getCourseStats {
    totalCourses
    totalStudents
    totalInstructors
    averageRating
    totalRevenue
    featuredCourses
    trendingCourses
    categories {
      name
      courseCount
    }
    levels {
      name
      courseCount
    }
  }
}

# Search Courses Query
query SearchCourses(
  $query: String!
  $filters: CourseFiltersInput
  $pagination: PaginationInput
) {
  searchCourses(query: $query, filters: $filters, pagination: $pagination) {
    courses {
      id
      title
      subtitle
      description
      shortDescription
      image
      thumbnail
      category
      level
      price
      originalPrice
      rating
      ratingCount
      totalStudents
      totalDuration
      instructor {
        id
        name
        avatar
        title
      }
      featured
      bestseller
      trending
      createdAt
    }
    pagination {
      currentPage
      totalPages
      totalItems
      itemsPerPage
      hasNextPage
      hasPreviousPage
    }
  }
}

# Category-specific Courses Query
query GetCoursesByCategory(
  $category: String!
  $filters: CourseFiltersInput
  $pagination: PaginationInput
) {
  getCoursesByCategory(
    category: $category
    filters: $filters
    pagination: $pagination
  ) {
    courses {
      id
      title
      subtitle
      description
      shortDescription
      image
      thumbnail
      category
      level
      price
      originalPrice
      rating
      ratingCount
      totalStudents
      totalDuration
      instructor {
        id
        name
        avatar
        title
      }
      featured
      bestseller
      trending
      createdAt
    }
    pagination {
      currentPage
      totalPages
      totalItems
      itemsPerPage
      hasNextPage
      hasPreviousPage
    }
  }
}

# Instructor-specific Courses Query
query GetCoursesByInstructor(
  $instructorId: String!
  $filters: CourseFiltersInput
  $pagination: PaginationInput
) {
  getCoursesByInstructor(
    instructorId: $instructorId
    filters: $filters
    pagination: $pagination
  ) {
    courses {
      id
      title
      subtitle
      description
      shortDescription
      image
      thumbnail
      category
      level
      price
      originalPrice
      rating
      ratingCount
      totalStudents
      totalDuration
      instructor {
        id
        name
        avatar
        title
      }
      featured
      bestseller
      trending
      createdAt
    }
    pagination {
      currentPage
      totalPages
      totalItems
      itemsPerPage
      hasNextPage
      hasPreviousPage
    }
  }
}
```

## Mutations

```graphql
# Bookmark Mutations
mutation BookmarkCourse($courseId: String!) {
  bookmarkCourse(courseId: $courseId) {
    success
    message
    courseId
  }
}

mutation RemoveBookmark($courseId: String!) {
  removeBookmark(courseId: $courseId) {
    success
    message
    courseId
  }
}

# Enrollment Mutations
mutation EnrollCourse($courseId: String!) {
  enrollCourse(courseId: $courseId) {
    success
    message
    courseId
  }
}

mutation UnenrollCourse($courseId: String!) {
  unenrollCourse(courseId: $courseId) {
    success
    message
    courseId
  }
}

# Progress Mutations
mutation UpdateCourseProgress($courseId: String!, $progress: Float!) {
  updateCourseProgress(courseId: $courseId, progress: $progress) {
    success
    message
    courseId
    progress
  }
}

# Review Mutations
mutation RateCourse($courseId: String!, $rating: Int!, $comment: String) {
  rateCourse(courseId: $courseId, rating: $rating, comment: $comment) {
    success
    message
    reviewId
  }
}

mutation UpdateCourseReview(
  $reviewId: String!
  $rating: Int!
  $comment: String
) {
  updateCourseReview(reviewId: $reviewId, rating: $rating, comment: $comment) {
    success
    message
    reviewId
  }
}

mutation DeleteCourseReview($reviewId: String!) {
  deleteCourseReview(reviewId: $reviewId) {
    success
    message
    reviewId
  }
}

# Tracking Mutations
mutation TrackCourseView($courseId: String!) {
  trackCourseView(courseId: $courseId) {
    success
    message
  }
}

mutation TrackCourseInteraction(
  $courseId: String!
  $interactionType: String!
  $metadata: String
) {
  trackCourseInteraction(
    courseId: $courseId
    interactionType: $interactionType
    metadata: $metadata
  ) {
    success
    message
  }
}
```

## REST API Routes

### Course Routes

```typescript
// GET /api/courses
// Get all courses with filtering and pagination
GET /api/courses?page=1&limit=12&category=technology&level=beginner&price_min=0&price_max=100&rating=4&sort=popular&search=javascript

// GET /api/courses/featured
// Get featured courses
GET /api/courses/featured?limit=6

// GET /api/courses/trending
// Get trending courses
GET /api/courses/trending?limit=6

// GET /api/courses/:id
// Get single course by ID
GET /api/courses/123

// GET /api/courses/category/:category
// Get courses by category
GET /api/courses/category/technology?page=1&limit=12

// GET /api/courses/instructor/:instructorId
// Get courses by instructor
GET /api/courses/instructor/456?page=1&limit=12

// GET /api/courses/search
// Search courses
GET /api/courses/search?q=javascript&page=1&limit=12

// GET /api/courses/stats
// Get course statistics
GET /api/courses/stats

// GET /api/courses/categories
// Get all categories
GET /api/courses/categories

// GET /api/courses/levels
// Get all levels
GET /api/courses/levels
```

### User Interaction Routes

```typescript
// POST /api/courses/:id/bookmark
// Bookmark a course
POST /api/courses/123/bookmark

// DELETE /api/courses/:id/bookmark
// Remove bookmark
DELETE /api/courses/123/bookmark

// POST /api/courses/:id/enroll
// Enroll in a course
POST /api/courses/123/enroll

// DELETE /api/courses/:id/enroll
// Unenroll from a course
DELETE /api/courses/123/enroll

// PUT /api/courses/:id/progress
// Update course progress
PUT /api/courses/123/progress
{
  "progress": 75.5
}

// POST /api/courses/:id/reviews
// Add a review
POST /api/courses/123/reviews
{
  "rating": 5,
  "comment": "Great course!"
}

// PUT /api/courses/:id/reviews/:reviewId
// Update a review
PUT /api/courses/123/reviews/789
{
  "rating": 4,
  "comment": "Updated review"
}

// DELETE /api/courses/:id/reviews/:reviewId
// Delete a review
DELETE /api/courses/123/reviews/789

// POST /api/courses/:id/track
// Track course view/interaction
POST /api/courses/123/track
{
  "type": "view",
  "metadata": { "source": "landing_page" }
}
```

## Database Schema

### Courses Table

```sql
CREATE TABLE courses (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT NOT NULL,
  short_description VARCHAR(1000),
  slug VARCHAR(255) UNIQUE NOT NULL,
  image VARCHAR(500),
  thumbnail VARCHAR(500),
  preview_video VARCHAR(500),
  trailer VARCHAR(500),
  gallery_images JSON,

  -- Categorization
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  tags JSON,
  level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'ALL_LEVELS') NOT NULL,
  status ENUM('DRAFT', 'UNDER_REVIEW', 'PUBLISHED', 'ARCHIVED', 'SUSPENDED', 'COMING_SOON') NOT NULL DEFAULT 'DRAFT',

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_price DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  discount_percent INT,
  discount_valid_until DATETIME,

  -- Metrics
  rating DECIMAL(3,2) DEFAULT 0.00,
  rating_count INT DEFAULT 0,
  total_students INT DEFAULT 0,
  total_duration VARCHAR(50),
  total_lectures INT DEFAULT 0,
  total_sections INT DEFAULT 0,
  views INT DEFAULT 0,
  unique_views INT DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0.00,

  -- Badges & Features
  badge VARCHAR(100),
  badge_color VARCHAR(50),
  featured BOOLEAN DEFAULT FALSE,
  bestseller BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Instructor
  instructor_id VARCHAR(255) NOT NULL,

  -- Requirements & Outcomes
  requirements JSON,
  what_you_learn JSON,
  objectives JSON,
  prerequisites JSON,

  -- Course Details
  language VARCHAR(50) DEFAULT 'English',
  has_subtitles BOOLEAN DEFAULT FALSE,
  subtitle_languages JSON,
  has_certificate BOOLEAN DEFAULT FALSE,
  has_lifetime_access BOOLEAN DEFAULT TRUE,
  has_mobile_access BOOLEAN DEFAULT TRUE,

  -- Enhanced Features
  has_ai_tutor BOOLEAN DEFAULT FALSE,
  ai_personality VARCHAR(100),
  has_ai_quizzes BOOLEAN DEFAULT FALSE,
  has_interactive_elements BOOLEAN DEFAULT FALSE,
  has_live_sessions BOOLEAN DEFAULT FALSE,
  has_project_work BOOLEAN DEFAULT FALSE,
  has_discussions BOOLEAN DEFAULT FALSE,
  has_assignments BOOLEAN DEFAULT FALSE,
  downloadable_resources BOOLEAN DEFAULT FALSE,
  offline_access BOOLEAN DEFAULT FALSE,
  mobile_optimized BOOLEAN DEFAULT FALSE,

  -- Scheduling
  enrollment_start_date DATETIME,
  enrollment_end_date DATETIME,
  course_start_date DATETIME,
  course_end_date DATETIME,

  -- Capacity
  max_students INT,
  current_enrollments INT DEFAULT 0,
  waitlist_enabled BOOLEAN DEFAULT FALSE,

  -- SEO & Marketing
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_tags JSON,
  marketing_tags JSON,
  target_audience JSON,

  -- Analytics
  avg_rating DECIMAL(3,2) DEFAULT 0.00,
  total_ratings INT DEFAULT 0,

  -- Content Metrics
  coding_exercises INT DEFAULT 0,
  articles INT DEFAULT 0,
  quiz_count INT DEFAULT 0,
  assignment_count INT DEFAULT 0,

  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at DATETIME,
  archived_at DATETIME,

  -- Indexes
  INDEX idx_category (category),
  INDEX idx_level (level),
  INDEX idx_status (status),
  INDEX idx_featured (featured),
  INDEX idx_trending (trending),
  INDEX idx_instructor (instructor_id),
  INDEX idx_price (price),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at),
  INDEX idx_published_at (published_at),
  FULLTEXT idx_search (title, description, category)
);
```

### Instructors Table

```sql
CREATE TABLE instructors (
  id VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar VARCHAR(500),
  profile_image VARCHAR(500),
  title VARCHAR(200),
  bio TEXT,
  expertise JSON,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_students INT DEFAULT 0,
  total_courses INT DEFAULT 0,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_rating (rating),
  INDEX idx_total_students (total_students)
);
```

### Course Sections Table

```sql
CREATE TABLE course_sections (
  id VARCHAR(255) PRIMARY KEY,
  course_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT NOT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_order (course_id, order_index)
);
```

### Course Lectures Table

```sql
CREATE TABLE course_lectures (
  id VARCHAR(255) PRIMARY KEY,
  section_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('VIDEO', 'TEXT', 'AUDIO', 'QUIZ', 'ASSIGNMENT', 'IMAGE', 'DOCUMENT', 'ARCHIVE', 'RESOURCE') NOT NULL,
  content TEXT,
  video_url VARCHAR(500),
  duration INT DEFAULT 0,
  order_index INT NOT NULL,
  is_preview BOOLEAN DEFAULT FALSE,
  settings JSON,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (section_id) REFERENCES course_sections(id) ON DELETE CASCADE,
  INDEX idx_section_order (section_id, order_index)
);
```

### Course Reviews Table

```sql
CREATE TABLE course_reviews (
  id VARCHAR(255) PRIMARY KEY,
  course_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_course_review (user_id, course_id),
  INDEX idx_course_rating (course_id, rating)
);
```

### User Bookmarks Table

```sql
CREATE TABLE user_bookmarks (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  course_id VARCHAR(255) NOT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_course_bookmark (user_id, course_id),
  INDEX idx_user_bookmarks (user_id),
  INDEX idx_course_bookmarks (course_id)
);
```

### User Enrollments Table

```sql
CREATE TABLE user_enrollments (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  course_id VARCHAR(255) NOT NULL,
  progress DECIMAL(5,2) DEFAULT 0.00,
  last_accessed_at DATETIME,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_course_enrollment (user_id, course_id),
  INDEX idx_user_enrollments (user_id),
  INDEX idx_course_enrollments (course_id)
);
```

## Implementation Notes

### Frontend Integration

1. **GraphQL Client Setup**: Use Apollo Client for GraphQL queries and mutations
2. **State Management**: Use Zustand store for course data and filtering state
3. **Real-time Updates**: Implement optimistic updates for bookmarks, enrollments, and reviews
4. **Error Handling**: Comprehensive error handling with user-friendly messages
5. **Loading States**: Skeleton loaders and progress indicators for better UX

### Backend Implementation

1. **GraphQL Resolvers**: Implement all query and mutation resolvers
2. **Database Optimization**: Proper indexing for fast queries and filtering
3. **Caching**: Redis caching for frequently accessed data
4. **Search**: Full-text search implementation (Elasticsearch or database FTS)
5. **Pagination**: Efficient cursor-based pagination
6. **Rate Limiting**: Protect against abuse
7. **Authentication**: JWT-based authentication for user-specific features

### Performance Considerations

1. **Database Indexes**: Optimize for common filter combinations
2. **Query Optimization**: Use database views for complex aggregations
3. **Caching Strategy**: Cache course lists, categories, and user data
4. **CDN**: Serve course images and videos through CDN
5. **Lazy Loading**: Implement infinite scroll for course lists
6. **Image Optimization**: Responsive images with multiple sizes

### Security Considerations

1. **Input Validation**: Validate all user inputs
2. **SQL Injection**: Use parameterized queries
3. **XSS Protection**: Sanitize user-generated content
4. **Rate Limiting**: Prevent abuse of API endpoints
5. **Authentication**: Secure JWT implementation
6. **Authorization**: Role-based access control

This comprehensive API design provides all the functionality needed for the course filtering and management features implemented in the frontend.
