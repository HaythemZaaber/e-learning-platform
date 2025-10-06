import { gql } from "@apollo/client";

// =============================================================================
// LANDING PAGE QUERIES
// =============================================================================

export const GET_FEATURED_INSTRUCTORS = gql`
  query GetFeaturedInstructors($limit: Int) {
    getFeaturedInstructors(limit: $limit) {
      featuredInstructors {
        id
        userId
        title
        bio
        shortBio
        expertise
        qualifications
        experience
        socialLinks
        personalWebsite
        linkedinProfile
        subjectsTeaching
        teachingCategories
        languagesSpoken
        teachingStyle
        targetAudience
        teachingMethodology
        teachingRating
        totalStudents
        totalCourses
        totalRevenue
        currency
        averageCourseRating
        studentRetentionRate
        courseCompletionRate
        individualSessionRate
        groupSessionRate
        responseTime
        studentSatisfaction
        isAcceptingStudents
        maxStudentsPerCourse
        totalFollowers
        newFollowersThisWeek
        newFollowersThisMonth
        isFollowing
        preferredSchedule
        availableTimeSlots
        isVerified
        verificationLevel
        lastVerificationDate
        complianceStatus
        totalLectures
        totalVideoHours
        totalQuizzes
        totalAssignments
        contentUpdateFreq
        payoutSettings
        taxInformation
        paymentPreferences
        revenueSharing
        isPromotionEligible
        marketingConsent
        featuredInstructor
        badgesEarned
        lastCourseUpdate
        lastStudentReply
        lastContentCreation
        createdAt
        updatedAt
        user {
          id
          email
          firstName
          lastName
          profileImage
          role
          instructorStatus
        }
      }
      total
      hasMore
    }
  }
`;

export const GET_INSTRUCTOR_HERO_STATS = gql`
  query GetInstructorHeroStats {
    getInstructorHeroStats {
      totalInstructors
      availableToday
      averageRating
      totalStudents
      liveSessionsEnabled
      verifiedInstructors
    }
  }
`;

// =============================================================================
// INSTRUCTORS PAGE QUERIES
// =============================================================================

export const GET_INSTRUCTORS_LIST = gql`
  query GetInstructorsList(
    $filters: InstructorListFiltersInput
    $page: Int
    $limit: Int
    $sortBy: String
  ) {
    getInstructorsList(
      filters: $filters
      page: $page
      limit: $limit
      sortBy: $sortBy
    ) {
      instructors {
        id
        userId
        title
        bio
        shortBio
        expertise
        qualifications
        experience
        socialLinks
        personalWebsite
        linkedinProfile
        subjectsTeaching
        teachingCategories
        languagesSpoken
        teachingStyle
        targetAudience
        teachingMethodology
        teachingRating
        totalStudents
        totalCourses
        totalRevenue
        currency
        individualSessionRate
        groupSessionRate
        averageCourseRating
        studentRetentionRate
        courseCompletionRate
        responseTime
        studentSatisfaction
        isAcceptingStudents
        maxStudentsPerCourse
        totalFollowers
        newFollowersThisWeek
        newFollowersThisMonth
        isFollowing
        preferredSchedule
        availableTimeSlots
        isVerified
        verificationLevel
        lastVerificationDate
        complianceStatus
        totalLectures
        totalVideoHours
        totalQuizzes
        totalAssignments
        contentUpdateFreq
        payoutSettings
        taxInformation
        paymentPreferences
        revenueSharing
        isPromotionEligible
        marketingConsent
        featuredInstructor
        badgesEarned
        lastCourseUpdate
        lastStudentReply
        lastContentCreation
        createdAt
        updatedAt
        user {
          id
          email
          firstName
          lastName
          profileImage
          role
          instructorStatus
        }
      }
      total
      page
      limit
      totalPages
      hasMore
      filters
    }
  }
`;

export const GET_AVAILABLE_TODAY_INSTRUCTORS = gql`
  query GetAvailableTodayInstructors($limit: Int) {
    getAvailableTodayInstructors(limit: $limit) {
      id
      userId
      title
      bio
      shortBio
      expertise
      qualifications
      experience
      socialLinks
      personalWebsite
      linkedinProfile
      subjectsTeaching
      teachingCategories
      languagesSpoken
      teachingStyle
      targetAudience
      teachingMethodology
      teachingRating
      totalStudents
      totalCourses
      totalRevenue
      currency
      individualSessionRate
      groupSessionRate
      averageCourseRating
      studentRetentionRate
      courseCompletionRate
      responseTime
      studentSatisfaction
      isAcceptingStudents
      maxStudentsPerCourse
      totalFollowers
      newFollowersThisWeek
      newFollowersThisMonth
      isFollowing
      preferredSchedule
      availableTimeSlots
      isVerified
      verificationLevel
      lastVerificationDate
      complianceStatus
      totalLectures
      totalVideoHours
      totalQuizzes
      totalAssignments
      contentUpdateFreq
      payoutSettings
      taxInformation
      paymentPreferences
      revenueSharing
      isPromotionEligible
      marketingConsent
      featuredInstructor
      badgesEarned
      lastCourseUpdate
      lastStudentReply
      lastContentCreation
      createdAt
      updatedAt
      user {
        id
        email
        firstName
        lastName
        profileImage
        role
        instructorStatus
      }
    }
  }
`;

// =============================================================================
// INDIVIDUAL INSTRUCTOR QUERIES
// =============================================================================

export const GET_INSTRUCTOR_PROFILE = gql`
  query GetInstructorProfile($userId: String!) {
    getInstructorProfile(userId: $userId) {
      id
      userId
      title
      bio
      shortBio
      expertise
      qualifications
      experience
      socialLinks
      personalWebsite
      linkedinProfile
      subjectsTeaching
      teachingCategories
      languagesSpoken
      teachingStyle
      targetAudience
      teachingMethodology
      teachingRating
      totalStudents
      totalCourses
      totalRevenue
      currency
      individualSessionRate
      groupSessionRate
      averageCourseRating
      studentRetentionRate
      courseCompletionRate
      responseTime
      studentSatisfaction
      isAcceptingStudents
      maxStudentsPerCourse
      totalFollowers
      newFollowersThisWeek
      newFollowersThisMonth
      isFollowing
      preferredSchedule
      availableTimeSlots
      isVerified
      verificationLevel
      lastVerificationDate
      complianceStatus
      totalLectures
      totalVideoHours
      totalQuizzes
      totalAssignments
      contentUpdateFreq
      payoutSettings
      taxInformation
      paymentPreferences
      revenueSharing
      isPromotionEligible
      marketingConsent
      featuredInstructor
      badgesEarned
      lastCourseUpdate
      lastStudentReply
      lastContentCreation
      createdAt
      updatedAt
      user {
        id
        email
        firstName
        lastName
        profileImage
        role
        instructorStatus
      }
    }
  }
`;

export const GET_MY_INSTRUCTOR_PROFILE = gql`
  query GetMyInstructorProfile {
    getMyInstructorProfile {
      id
      userId
      title
      bio
      shortBio
      expertise
      qualifications
      experience
      socialLinks
      personalWebsite
      linkedinProfile
      subjectsTeaching
      teachingCategories
      languagesSpoken
      teachingStyle
      targetAudience
      teachingMethodology
      teachingRating
      totalStudents
      totalCourses
      totalRevenue
      currency
      individualSessionRate
      groupSessionRate
      averageCourseRating
      studentRetentionRate
      courseCompletionRate
      responseTime
      studentSatisfaction
      isAcceptingStudents
      maxStudentsPerCourse
      totalFollowers
      newFollowersThisWeek
      newFollowersThisMonth
      isFollowing
      preferredSchedule
      availableTimeSlots
      isVerified
      verificationLevel
      lastVerificationDate
      complianceStatus
      totalLectures
      totalVideoHours
      totalQuizzes
      totalAssignments
      contentUpdateFreq
      payoutSettings
      taxInformation
      paymentPreferences
      revenueSharing
      isPromotionEligible
      marketingConsent
      featuredInstructor
      badgesEarned
      lastCourseUpdate
      lastStudentReply
      lastContentCreation
      createdAt
      updatedAt
      user {
        id
        email
        firstName
        lastName
        profileImage
        role
        instructorStatus
      }
    }
  }
`;

// =============================================================================
// INSTRUCTOR STATISTICS QUERIES
// =============================================================================

export const GET_INSTRUCTOR_STATS = gql`
  query GetInstructorStats($userId: String!) {
    getInstructorStats(userId: $userId) {
      profile {
        id
        userId
        title
        bio
        shortBio
        expertise
        qualifications
        experience
        socialLinks
        personalWebsite
        linkedinProfile
        subjectsTeaching
        teachingCategories
        languagesSpoken
        teachingStyle
        targetAudience
        teachingMethodology
        teachingRating
        totalStudents
        totalCourses
        totalRevenue
        currency
        individualSessionRate
        groupSessionRate
        averageCourseRating
        studentRetentionRate
        courseCompletionRate
        responseTime
        studentSatisfaction
        isAcceptingStudents
        maxStudentsPerCourse
        totalFollowers
        newFollowersThisWeek
        newFollowersThisMonth
        isFollowing
        preferredSchedule
        availableTimeSlots
        isVerified
        verificationLevel
        lastVerificationDate
        complianceStatus
        totalLectures
        totalVideoHours
        totalQuizzes
        totalAssignments
        contentUpdateFreq
        payoutSettings
        taxInformation
        paymentPreferences
        revenueSharing
        isPromotionEligible
        marketingConsent
        featuredInstructor
        badgesEarned
        lastCourseUpdate
        lastStudentReply
        lastContentCreation
        createdAt
        updatedAt
        user {
          id
          email
          firstName
          lastName
          profileImage
          role
          instructorStatus
        }
      }
      statistics {
        totalCourses
        publishedCourses
        totalEnrollments
        totalRevenue
        averageRating
        courses {
          id
          title
          status
          avgRating
          totalRatings
          views
          currentEnrollments
          price
        }
      }
      totalRevenue
      totalStudents
      totalCourses
      averageRating
      courseCompletionRate
      studentRetentionRate
      studentSatisfactionRate
      averageResponseTime
      totalLectures
      totalVideoHours
      totalQuizzes
      totalAssignments
      contentUpdateFrequency
      lastCourseUpdate
      lastStudentReply
      lastContentCreation
      verificationStatus
      complianceStatus
    }
  }
`;

export const GET_MY_INSTRUCTOR_STATS = gql`
  query GetMyInstructorStats {
    getMyInstructorStats {
      profile {
        id
        userId
        title
        bio
        shortBio
        expertise
        qualifications
        experience
        socialLinks
        personalWebsite
        linkedinProfile
        subjectsTeaching
        teachingCategories
        languagesSpoken
        teachingStyle
        targetAudience
        teachingMethodology
        teachingRating
        totalStudents
        totalCourses
        totalRevenue
        currency
        individualSessionRate
        groupSessionRate
        averageCourseRating
        studentRetentionRate
        courseCompletionRate
        responseTime
        studentSatisfaction
        isAcceptingStudents
        maxStudentsPerCourse
        totalFollowers
        newFollowersThisWeek
        newFollowersThisMonth
        isFollowing
        preferredSchedule
        availableTimeSlots
        isVerified
        verificationLevel
        lastVerificationDate
        complianceStatus
        totalLectures
        totalVideoHours
        totalQuizzes
        totalAssignments
        contentUpdateFreq
        payoutSettings
        taxInformation
        paymentPreferences
        revenueSharing
        isPromotionEligible
        marketingConsent
        featuredInstructor
        badgesEarned
        lastCourseUpdate
        lastStudentReply
        lastContentCreation
        createdAt
        updatedAt
        user {
          id
          email
          firstName
          lastName
          profileImage
          role
          instructorStatus
        }
      }
      statistics {
        totalCourses
        publishedCourses
        totalEnrollments
        totalRevenue
        averageRating
        courses {
          id
          title
          status
          avgRating
          totalRatings
          views
          currentEnrollments
          price
        }
      }
      totalRevenue
      totalStudents
      totalCourses
      averageRating
      courseCompletionRate
      studentRetentionRate
      studentSatisfactionRate
      averageResponseTime
      totalLectures
      totalVideoHours
      totalQuizzes
      totalAssignments
      contentUpdateFrequency
      lastCourseUpdate
      lastStudentReply
      lastContentCreation
      verificationStatus
      complianceStatus
    }
  }
`;

// =============================================================================
// SEARCH QUERIES
// =============================================================================

export const SEARCH_INSTRUCTORS = gql`
  query SearchInstructors($filters: InstructorSearchFiltersInput) {
    searchInstructors(filters: $filters) {
      instructors {
        id
        userId
        title
        bio
        shortBio
        expertise
        qualifications
        experience
        socialLinks
        personalWebsite
        linkedinProfile
        subjectsTeaching
        teachingCategories
        languagesSpoken
        teachingStyle
        targetAudience
        teachingMethodology
        teachingRating
        totalStudents
        totalCourses
        totalRevenue
        currency
        averageCourseRating
        studentRetentionRate
        courseCompletionRate
        responseTime
        studentSatisfaction
        isAcceptingStudents
        maxStudentsPerCourse
        totalFollowers
        newFollowersThisWeek
        newFollowersThisMonth
        isFollowing
        preferredSchedule
        availableTimeSlots
        isVerified
        verificationLevel
        lastVerificationDate
        complianceStatus
        totalLectures
        totalVideoHours
        totalQuizzes
        totalAssignments
        contentUpdateFreq
        payoutSettings
        taxInformation
        paymentPreferences
        revenueSharing
        isPromotionEligible
        marketingConsent
        featuredInstructor
        badgesEarned
        lastCourseUpdate
        lastStudentReply
        lastContentCreation
        createdAt
        updatedAt
        user {
          id
          email
          firstName
          lastName
          profileImage
          role
          instructorStatus
        }
      }
      total
      hasMore
    }
  }
`;

// =============================================================================
// FRAGMENTS FOR REUSABLE FIELDS
// =============================================================================

export const INSTRUCTOR_PROFILE_FRAGMENT = gql`
  fragment InstructorProfileFields on InstructorProfile {
    id
    userId
    title
    bio
    shortBio
    expertise
    qualifications
    experience
    socialLinks
    personalWebsite
    linkedinProfile
    subjectsTeaching
    teachingCategories
    languagesSpoken
    teachingStyle
    targetAudience
    teachingMethodology
    teachingRating
    totalStudents
    totalCourses
    totalRevenue
    currency
    averageCourseRating
    studentRetentionRate
    courseCompletionRate
    responseTime
    studentSatisfaction
    isAcceptingStudents
    maxStudentsPerCourse
    totalFollowers
    newFollowersThisWeek
    newFollowersThisMonth
    isFollowing
    preferredSchedule
    availableTimeSlots
    isVerified
    verificationLevel
    lastVerificationDate
    complianceStatus
    totalLectures
    totalVideoHours
    totalQuizzes
    totalAssignments
    contentUpdateFreq
    payoutSettings
    taxInformation
    paymentPreferences
    revenueSharing
    isPromotionEligible
    marketingConsent
    featuredInstructor
    badgesEarned
    lastCourseUpdate
    lastStudentReply
    lastContentCreation
    createdAt
    updatedAt
    user {
      id
      email
      firstName
      lastName
      profileImage
      role
      instructorStatus
    }
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    firstName
    lastName
    profileImage
    role
    instructorStatus
  }
`;
