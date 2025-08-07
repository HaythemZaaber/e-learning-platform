import { gql } from "@apollo/client";

// ============================================================================
// MAIN COURSES QUERIES
// ============================================================================

export const GET_ALL_COURSES = gql`
  query GetAllCourses($filters: CourseFiltersInput, $pagination: PaginationInput) {
    getAllCourses(filters: $filters, pagination: $pagination) {
      courses {
        id
        title
        description
        shortDescription
        thumbnail
        trailer
        galleryImages
        
        # Categorization
        category
        subcategory
        level
        status
        
        # Pricing
        price
        originalPrice
        currency
        discountPercent
        discountValidUntil
        
        # Analytics & Performance
        views
        uniqueViews
        completionRate
        avgRating
        totalRatings
        
        # Content Counts
        totalSections
        totalLectures
        totalQuizzes
        totalAssignments
        totalContentItems
        totalDiscussions
        totalAnnouncements
        
        # Course Settings & Features
        isFeatured
        isBestseller
        isTrending
        
        # Instructor
        instructor {
          id
          firstName
          lastName
          
          email
          
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
        whatYouLearn
        objectives
        prerequisites
        
        # Course Details
        language
        subtitleLanguages
        
        # Advanced Features
        hasLiveSessions
        hasRecordings
        hasDiscussions
        hasAssignments
        hasQuizzes
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
           
          user {
            id
           username
           lastName
          }
        }
        
        # SEO & Marketing
        seoTitle
        seoDescription
        seoTags
        marketingTags
        targetAudience
        
        # Duration & Difficulty
        estimatedHours
        estimatedMinutes
        difficulty
        intensityLevel
        
        # Certificates & Completion
        certificate
        certificateTemplate
        passingGrade
        allowRetakes
        maxAttempts
        
        # Course Settings
        enrollmentType
        isPublic
        version
    
        
      
         
         
         
         
      }

  total

  page

  limit

  totalPages

  hasNextPage


  hasPreviousPage


      
    }
  }
`;

export const GET_FEATURED_COURSES = gql`
  query GetFeaturedCourses($limit: Float) {
    getFeaturedCourses(limit: $limit) {
      id
      title
      description
      shortDescription
      thumbnail
      category
      level
      price
      originalPrice
      avgRating
      totalRatings
      currentEnrollments
      estimatedHours
      estimatedMinutes
      isFeatured
      isBestseller
      isTrending
      instructor {
        id
        username
        profileImage
        title
      }
       
    }
  }
`;

export const GET_TRENDING_COURSES = gql`
  query GetTrendingCourses($limit: Float) {
    getTrendingCourses(limit: $limit) {
      id
      title
      description
      shortDescription
      thumbnail
      category
      level
      price
      originalPrice
      avgRating
      totalRatings
      currentEnrollments
      estimatedHours
      estimatedMinutes
      isTrending
      instructor {
        id
        firstName
        lastName
        profileImage
        title
      }
       
    }
  }
`;

export const GET_COURSE_BY_ID = gql`
  query GetCourseById($courseId: String!) {
    getCourse(courseId: $courseId) {
      id
      title
      description
      shortDescription
      thumbnail
      trailer
      galleryImages
      
      # Categorization
      category
      subcategory
      level
      status
      
      # Pricing
      price
      originalPrice
      currency
      discountPercent
      discountValidUntil
      
      # Analytics & Performance
      views
      uniqueViews
      completionRate
      avgRating
      totalRatings
      
      # Content Counts
      totalSections
      totalLectures
      totalQuizzes
      totalAssignments
      totalContentItems
      totalDiscussions
      totalAnnouncements
      
      # Course Settings & Features
      isFeatured
      isBestseller
      isTrending
      
      # Instructor
      instructor {
        id
        firstName
        lastName
        username
        email
        profileImage
        title
        bio
        expertise
        rating
        
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
      whatYouLearn
      objectives
      prerequisites
      
      # Course Details
      language
      subtitleLanguages
      
      # Advanced Features
      hasLiveSessions
      hasRecordings
      hasDiscussions
      hasAssignments
      hasQuizzes
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
         
        user {
          id
      
          profileImage
        }
      }
      
      # SEO & Marketing
      seoTitle
      seoDescription
      seoTags
      marketingTags
      targetAudience
      
      # Duration & Difficulty
      estimatedHours
      estimatedMinutes
      difficulty
      intensityLevel
      
      # Certificates & Completion
      certificate
      certificateTemplate
      passingGrade
      allowRetakes
      maxAttempts
      
      # Course Settings
      enrollmentType
      isPublic
      version
      lastMajorUpdate
     
      
    }
  }
`;



export const GET_COURSE_LEVELS = gql`
  query GetCourseLevels {
    getCourseLevels {
      id
      name
      description
      courseCount
    }
  }
`;

export const GET_COURSE_STATS = gql`
  query GetCourseStats {
    getCourseStats {
      currentEnrollments
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
`;

// ============================================================================
// INSTRUCTOR COURSES QUERIES
// ============================================================================

export const GET_INSTRUCTOR_COURSES = gql`
  query GetInstructorCourses {
    getMyCourses {
      id
      title
      description
      shortDescription
      category
      subcategory
      level
      price
      originalPrice
      currency
      thumbnail
      status
      language
      
      # Course metrics (calculated fields from creation)
      avgRating
      estimatedHours 
      estimatedMinutes 
      difficulty     
      intensityLevel
      
      totalLectures
      totalSections
      totalRatings   
      completionRate 
      views
      
      # Scheduling & capacity
      enrollmentStartDate
      enrollmentEndDate
      courseStartDate
      courseEndDate
      maxStudents
      currentEnrollments
      waitlistEnabled
        
      # Requirements & outcomes
      objectives
      prerequisites
      whatYouLearn
      requirements
    }
  }
`;

// ============================================================================
// SEARCH AND FILTER QUERIES
// ============================================================================

export const SEARCH_COURSES = gql`
  query SearchCourses($query: String!, $filters: CourseFiltersInput, $pagination: PaginationInput) {
    searchCourses(query: $query, filters: $filters, pagination: $pagination) {
      courses {
        id
        title
        description
        shortDescription
        thumbnail
        category
        level
        price
        originalPrice
        avgRating
        totalRatings
        currentEnrollments
        estimatedHours
        estimatedMinutes
        instructor {
          id
          name
          profileImage
          title
        }
        isFeatured
        isBestseller
        isTrending
         
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
`;

export const GET_COURSES_BY_CATEGORY = gql`
  query GetCoursesByCategory($category: String!, $filters: CourseFiltersInput, $pagination: PaginationInput) {
    getCoursesByCategory(category: $category, filters: $filters, pagination: $pagination) {
      courses {
        id
        title
        description
        shortDescription
        thumbnail
        category
        level
        price
        originalPrice
        avgRating
        totalRatings
        currentEnrollments
        estimatedHours
        estimatedMinutes
        instructor {
          id
          name
          profileImage
          title
        }
        isFeatured
        isBestseller
        isTrending
         
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
`;

export const GET_COURSES_BY_INSTRUCTOR = gql`
  query GetCoursesByInstructor($instructorId: String!, $filters: CourseFiltersInput, $pagination: PaginationInput) {
    getCoursesByInstructor(instructorId: $instructorId, filters: $filters, pagination: $pagination) {
      courses {
        id
        title
        description
        shortDescription
        thumbnail
        category
        level
        price
        originalPrice
        avgRating
        totalRatings
        currentEnrollments
        estimatedHours
        estimatedMinutes
        instructor {
          id
          name
          profileImage
          title
        }
        isFeatured
        isBestseller
        isTrending
         
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
`;

// Course Sharing Queries
export const GET_COURSE_SHARE_LINKS = gql`
  query GetCourseShareLinks($courseId: String!) {
    getCourseShareLinks(courseId: $courseId) {
      success
      message
      shareData {
        courseUrl
        socialLinks {
          facebook
          twitter
          linkedin
          whatsapp
          telegram
          email
        }
        embedCode
        qrCode
      }
      errors
    }
  }
`;

export const COPY_COURSE_SHARE_LINK = gql`
  query CopyCourseShareLink($courseId: String!) {
    copyCourseShareLink(courseId: $courseId) {
      success
      message
      shareData {
        courseUrl
        socialLinks {
          facebook
          twitter
          linkedin
          whatsapp
          telegram
          email
        }
        embedCode
        qrCode
      }
      errors
    }
  }
`;

export const GENERATE_COURSE_QR_CODE = gql`
  query GenerateCourseQRCode($courseId: String!) {
    generateCourseQRCode(courseId: $courseId) {
      success
      message
      shareData {
        courseUrl
        socialLinks {
          facebook
          twitter
          linkedin
          whatsapp
          telegram
          email
        }
        embedCode
        qrCode
      }
      errors
    }
  }
`;

export const GET_COURSE_ANALYTICS = gql`
  query GetCourseAnalytics($courseId: ID!) {
    courseAnalytics(courseId: $courseId) {
      totalEnrollments
      totalRevenue
      averageRating
      totalReviews
      completionRate
      averageProgress
      monthlyEnrollments {
        month
        count
      }
      monthlyRevenue {
        month
        amount
      }
    }
  }
`; 