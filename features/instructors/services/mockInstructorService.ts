import {
  InstructorProfile,
  InstructorHeroStats,
  TransformedInstructor,
} from "@/types/instructorGraphQLTypes";

// =============================================================================
// MOCK DATA FOR FALLBACK
// =============================================================================

const mockInstructors: InstructorProfile[] = [
  {
    id: "1",
    userId: "user1",
    title: "Lead Data Science Instructor",
    bio: "Dr. Sarah Johnson is a data science expert with over 10 years of experience in machine learning and statistical analysis.",
    shortBio:
      "Data science expert with 10+ years of experience in machine learning and AI.",
    expertise: [
      "Python",
      "Machine Learning",
      "Statistical Analysis",
      "Deep Learning",
    ],
    qualifications: [
      "Ph.D. in Computer Science, Stanford University",
      "M.S. in Statistics, MIT",
    ],
    experience: 10,
    socialLinks: {},
    personalWebsite: "https://sarahjohnson.edu",
    linkedinProfile: "https://linkedin.com/in/sarahjohnson",
    subjectsTeaching: ["Data Science", "Machine Learning", "Python"],
    teachingCategories: ["Data Science", "Programming"],
    languagesSpoken: ["English", "Spanish"],
    teachingStyle: "Hands-on, practical approach with real-world applications",
    targetAudience: "Beginners to Advanced",
    teachingMethodology: "Project-based learning",
    teachingRating: 4.9,
    totalStudents: 45000,
    totalCourses: 12,
    totalRevenue: 125000,
    currency: "USD",
    averageCourseRating: 4.8,
    studentRetentionRate: 97,
    courseCompletionRate: 95,
    responseTime: 2,
    studentSatisfaction: 96,
    isAcceptingStudents: true,
    maxStudentsPerCourse: 50,
    preferredSchedule: {},
    availableTimeSlots: {},
    isVerified: true,
    verificationLevel: "Verified",
    lastVerificationDate: new Date(),
    complianceStatus: "Compliant",
    totalLectures: 150,
    totalVideoHours: 200,
    totalQuizzes: 45,
    totalAssignments: 30,
    contentUpdateFreq: 7,
    payoutSettings: {},
    taxInformation: {},
    paymentPreferences: {},
    revenueSharing: 70,
    isPromotionEligible: true,
    marketingConsent: true,
    featuredInstructor: true,
    badgesEarned: ["Top Instructor", "Verified Expert", "Course Creator"],
    lastCourseUpdate: new Date(),
    lastStudentReply: new Date(),
    lastContentCreation: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: "user1",
      email: "sarah.johnson@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      profileImage: "/placeholder.svg",
      role: "INSTRUCTOR",
      instructorStatus: "ACTIVE",
    },
  },
  {
    id: "2",
    userId: "user2",
    title: "UX/UI Design Expert",
    bio: "Professor Chen brings 15 years of industry experience in UX/UI design to his teaching.",
    shortBio:
      "UX/UI design expert with 15+ years of industry experience at major tech companies.",
    expertise: ["UI Design", "User Research", "Figma", "Adobe XD"],
    qualifications: [
      "MFA in Design, Rhode Island School of Design",
      "B.A. in Graphic Design, Parsons School of Design",
    ],
    experience: 15,
    socialLinks: {},
    personalWebsite: "https://davidchen.design",
    linkedinProfile: "https://linkedin.com/in/davidchen",
    subjectsTeaching: ["UI/UX Design", "Design Systems", "User Research"],
    teachingCategories: ["Design"],
    languagesSpoken: ["English", "Mandarin"],
    teachingStyle: "Design is problem-solving at its core",
    targetAudience: "All Levels",
    teachingMethodology: "User-centered design principles",
    teachingRating: 4.8,
    totalStudents: 37800,
    totalCourses: 8,
    totalRevenue: 98000,
    currency: "USD",
    averageCourseRating: 4.7,
    studentRetentionRate: 94,
    courseCompletionRate: 92,
    responseTime: 24,
    studentSatisfaction: 93,
    isAcceptingStudents: true,
    maxStudentsPerCourse: 40,
    preferredSchedule: {},
    availableTimeSlots: {},
    isVerified: true,
    verificationLevel: "Verified",
    lastVerificationDate: new Date(),
    complianceStatus: "Compliant",
    totalLectures: 120,
    totalVideoHours: 160,
    totalQuizzes: 35,
    totalAssignments: 25,
    contentUpdateFreq: 10,
    payoutSettings: {},
    taxInformation: {},
    paymentPreferences: {},
    revenueSharing: 75,
    isPromotionEligible: true,
    marketingConsent: true,
    featuredInstructor: true,
    badgesEarned: [
      "Design Expert",
      "Verified Instructor",
      "Industry Professional",
    ],
    lastCourseUpdate: new Date(),
    lastStudentReply: new Date(),
    lastContentCreation: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: "user2",
      email: "david.chen@example.com",
      firstName: "David",
      lastName: "Chen",
      profileImage: "/placeholder.svg",
      role: "INSTRUCTOR",
      instructorStatus: "ACTIVE",
    },
  },
  {
    id: "3",
    userId: "user3",
    title: "Full Stack Web Developer",
    bio: "Maria is a full stack developer with 8 years of experience building web applications.",
    shortBio:
      "Full stack developer teaching modern web technologies with 8 years of industry experience.",
    expertise: ["JavaScript", "React", "Node.js", "MongoDB", "TypeScript"],
    qualifications: [
      "B.S. in Computer Science, University of Texas",
      "Full Stack Web Development Bootcamp, Coding Dojo",
    ],
    experience: 8,
    socialLinks: {},
    personalWebsite: "https://mariarodriguez.dev",
    linkedinProfile: "https://linkedin.com/in/mariarodriguez",
    subjectsTeaching: [
      "JavaScript",
      "React",
      "Node.js",
      "Full Stack Development",
    ],
    teachingCategories: ["Programming"],
    languagesSpoken: ["English", "Spanish", "Portuguese"],
    teachingStyle: "Learning by doing with real-world projects",
    targetAudience: "Beginners to Intermediate",
    teachingMethodology: "Project-based learning",
    teachingRating: 4.7,
    totalStudents: 29500,
    totalCourses: 10,
    totalRevenue: 85000,
    currency: "USD",
    averageCourseRating: 4.6,
    studentRetentionRate: 92,
    courseCompletionRate: 90,
    responseTime: 4,
    studentSatisfaction: 91,
    isAcceptingStudents: true,
    maxStudentsPerCourse: 45,
    preferredSchedule: {},
    availableTimeSlots: {},
    isVerified: true,
    verificationLevel: "Verified",
    lastVerificationDate: new Date(),
    complianceStatus: "Compliant",
    totalLectures: 100,
    totalVideoHours: 140,
    totalQuizzes: 30,
    totalAssignments: 20,
    contentUpdateFreq: 5,
    payoutSettings: {},
    taxInformation: {},
    paymentPreferences: {},
    revenueSharing: 80,
    isPromotionEligible: true,
    marketingConsent: true,
    featuredInstructor: true,
    badgesEarned: [
      "Web Development Expert",
      "Verified Instructor",
      "Course Creator",
    ],
    lastCourseUpdate: new Date(),
    lastStudentReply: new Date(),
    lastContentCreation: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: "user3",
      email: "maria.rodriguez@example.com",
      firstName: "Maria",
      lastName: "Rodriguez",
      profileImage: "/placeholder.svg",
      role: "INSTRUCTOR",
      instructorStatus: "ACTIVE",
    },
  },
];

const mockHeroStats: InstructorHeroStats = {
  totalInstructors: 150,
  availableToday: 45,
  averageRating: 4.7,
  totalStudents: 125000,
  liveSessionsEnabled: 89,
  verifiedInstructors: 142,
};

// =============================================================================
// TRANSFORM FUNCTION
// =============================================================================

const transformInstructorData = (
  instructor: InstructorProfile
): TransformedInstructor => {
  const fullName =
    [instructor.user.firstName, instructor.user.lastName]
      .filter(Boolean)
      .join(" ") || "Instructor";

  return {
    id: instructor.id,
    name: fullName,
    title: instructor.title || "Instructor",
    avatar: instructor.user.profileImage || "/placeholder.svg",
    coverImage: "/placeholder.svg?height=600&width=1200",
    bio: instructor.bio || "",
    shortBio: instructor.shortBio || "",
    rating: instructor.teachingRating || 0,
    reviewsCount: Math.floor(instructor.totalStudents * 0.1), // Estimate
    studentsCount: instructor.totalStudents,
    coursesCount: instructor.totalCourses,
    responseTime: `${instructor.responseTime || 24} hours`,
    completionRate: instructor.courseCompletionRate || 0,
    languages: Array.isArray(instructor.languagesSpoken)
      ? instructor.languagesSpoken
      : ["English"],
    experience: instructor.experience || 0,
    education: instructor.qualifications || [],
    certifications: instructor.qualifications || [],
    philosophy: instructor.teachingStyle || "",
    categories: instructor.teachingCategories || [],
    skills: instructor.expertise.map((exp) => ({
      name: exp,
      proficiency: "Expert",
    })),
    location: "Remote", // Default location
    socialLinks: {
      linkedin: instructor.linkedinProfile,
      website: instructor.personalWebsite,
    },
    isOnline: Math.random() > 0.7, // Random online status
    isVerified: instructor.isVerified,
    priceRange: {
      min: 50,
      max: 200,
    },
    liveSessionsEnabled: true, // Default to true
    groupSessionsEnabled: true, // Default to true
    nextAvailableSlot: {
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      type: "individual",
      price: 100,
    },
    weeklyBookings: Math.floor(Math.random() * 20) + 5,
    responseTimeHours: instructor.responseTime || 24,
    contentEngagement: {
      totalViews: instructor.totalStudents * 10,
      totalLikes: instructor.totalStudents,
      avgEngagementRate: 5.5,
    },
    reels: [],
    stories: [],
    storyHighlights: [],
    recordedCourses: [],
    follow: {
      totalFollowers: (instructor as any).totalFollowers ?? 0,
      newFollowersThisWeek: (instructor as any).newFollowersThisWeek ?? 0,
      newFollowersThisMonth: (instructor as any).newFollowersThisMonth ?? 0,
      isFollowing: (instructor as any).isFollowing ?? false,
    },
  };
};

// =============================================================================
// MOCK SERVICE FUNCTIONS
// =============================================================================

export const getMockFeaturedInstructors = (
  limit: number = 6
): InstructorProfile[] => {
  return mockInstructors.slice(0, limit);
};

export const getMockInstructorHeroStats = (): InstructorHeroStats => {
  return mockHeroStats;
};

export const getMockInstructorsList = (
  filters?: any,
  page: number = 1,
  limit: number = 6,
  sortBy: string = "featured"
): {
  instructors: InstructorProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
} => {
  // Simulate filtering and pagination
  let filtered = [...mockInstructors];

  // Apply basic filters
  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (instructor) =>
        instructor.user.firstName?.toLowerCase().includes(query) ||
        instructor.user.lastName?.toLowerCase().includes(query) ||
        instructor.title?.toLowerCase().includes(query)
    );
  }

  if (filters?.categories?.length > 0) {
    filtered = filtered.filter((instructor) =>
      instructor.teachingCategories.some((cat) =>
        filters.categories.includes(cat)
      )
    );
  }

  if (filters?.minRating) {
    filtered = filtered.filter(
      (instructor) => (instructor.teachingRating || 0) >= filters.minRating
    );
  }

  // Apply sorting
  switch (sortBy) {
    case "rating":
      filtered.sort(
        (a, b) => (b.teachingRating || 0) - (a.teachingRating || 0)
      );
      break;
    case "students":
      filtered.sort((a, b) => b.totalStudents - a.totalStudents);
      break;
    case "name":
      filtered.sort((a, b) =>
        (a.user.firstName + " " + a.user.lastName).localeCompare(
          b.user.firstName + " " + b.user.lastName
        )
      );
      break;
    default:
      // Featured order (already sorted)
      break;
  }

  // Apply pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedInstructors = filtered.slice(startIndex, endIndex);

  return {
    instructors: paginatedInstructors,
    total,
    page,
    limit,
    totalPages,
    hasMore: page < totalPages,
  };
};

export const getMockAvailableTodayInstructors = (
  limit: number = 10
): InstructorProfile[] => {
  return mockInstructors.slice(0, limit);
};

export const getMockTransformedInstructors = (): TransformedInstructor[] => {
  return mockInstructors.map(transformInstructorData);
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const isGraphQLAvailable = (): boolean => {
  // Check if we're in a browser environment and if Apollo Client is available
  if (typeof window === "undefined") return false;

  // Always use GraphQL queries as requested by the user
  return true;
};

export const getFallbackData = () => {
  return {
    featuredInstructors: getMockFeaturedInstructors(),
    heroStats: getMockInstructorHeroStats(),
    transformedInstructors: getMockTransformedInstructors(),
  };
};
