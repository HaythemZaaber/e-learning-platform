import { StaticImageData } from "next/image";
import course from "@/public/images/courses/course.jpg";

const generateTimeSlots = (startHour: number, endHour: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;
    slots.push({
      id: `${startTime}-${endTime}`,
      startTime,
      endTime,
      isAvailable: true,
      isBooked: false,
      sessionType: "individual",
      basePriceIndiv: 50,
      basePriceGroup: 30,
      price: 50,
      currentRequests: [],
      maxStudents: 1,
      status: "available",
    });
  }
  return slots;
};

export type CourseLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "All Levels";
export type Category =
  | "Programming"
  | "Design"
  | "Business"
  | "Marketing"
  | "Languages"
  | "Data Science"
  | "Music"
  | "Photography";

export type Skill = {
  name: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
};

export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: Category;
  level: CourseLevel;
  price: number;
  rating: number;
  reviews: number;
  duration: string; // e.g., "4h 30m"
  studentsCount: number;
  isBestseller?: boolean;
};

export type Review = {
  id: string;
  name: string;
  avatar: StaticImageData | string;
  date: string;
  rating: number;
  text: string;
  course: string;
};

export type SessionType = "individual" | "group";
export type SessionDuration = 30 | 60 | 120;
export type ContentType = "reel" | "story" | "course";

export interface TimeSlot {
  id: string;
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  isAvailable: boolean;
  isBooked: boolean;
  sessionType: SessionType;
  basePriceIndiv: number;
  basePriceGroup: number;
  price: number;
  currentRequests: BookingRequest[];
  maxStudents: number;
  status:
    | "available"
    | "pending_requests"
    | "competitive_bidding"
    | "confirmed";
  confirmedSession?: {
    type: SessionType;
    price: number;
    studentName: string;
  };
}

export interface DayAvailability {
  date: string; // "2024-01-15"
  timeSlots: TimeSlot[];
}

export interface BookingRequest {
  id: string;
  type: SessionType;
  offerPrice: number;
  studentName: string;
  status: "pending" | "accepted" | "rejected";
}

export interface BookingDetails {
  sessionType: SessionType;
  duration: number;
  topic: string;
  offerPrice: number;
  specialRequirements: string;
  studentInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface SocialContent {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl?: string;
  duration?: number; // in seconds
  views: number;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  tags: string[];
  isHighlight?: boolean;
}

export interface StoryHighlight {
  id: string;
  title: string;
  thumbnail: string;
  stories: SocialContent[];
  createdAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: StaticImageData | string;
  coverImage?: string;
  bio: string;
  shortBio: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  coursesCount: number;
  responseTime: string;
  completionRate: number;
  languages: string[];
  experience: number;
  education: string[];
  certifications: string[];
  philosophy: string;
  categories: Category[];
  skills: Skill[];
  courses: Course[];
  reviews: Review[];
  featuredCourse?: string;
  location: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    youtube?: string;
  };
  isOnline?: boolean;
  isVerified: boolean;
  priceRange: {
    min: number;
    max: number;
  };
  availability: DayAvailability[];
  timezone: string;
  sessionPricing: {
    individual: { [key in SessionDuration]: number };
    group: { [key in SessionDuration]: number };
  };
  maxGroupSize: number;
  bufferTime: number; // minutes between sessions
  maxSessionsPerDay: number;
  autoConfirmBookings: boolean;
  reels: SocialContent[];
  stories: SocialContent[];
  storyHighlights: StoryHighlight[];
  recordedCourses: SocialContent[];
  liveSessionsEnabled: boolean;
  groupSessionsEnabled: boolean;
  nextAvailableSlot?: {
    date: string;
    time: string;
    type: SessionType;
    price: number;
  };
  weeklyBookings: number;
  responseTimeHours: number;
  contentEngagement: {
    totalViews: number;
    totalLikes: number;
    avgEngagementRate: number;
  };
}

// Enhanced instructor data with complete social features
export const instructors: Instructor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Lead Data Science Instructor",
    avatar: course,
    coverImage: "/placeholder.svg?height=600&width=1200",
    bio: "Dr. Sarah Johnson is a data science expert with over 10 years of experience in machine learning and statistical analysis. She has worked with leading tech companies before transitioning to full-time teaching. Her approach combines theoretical concepts with practical, hands-on applications that prepare students for real-world challenges.",
    shortBio:
      "Data science expert with 10+ years of experience in machine learning and AI.",
    rating: 4.9,
    reviewsCount: 2547,
    studentsCount: 45000,
    coursesCount: 12,
    responseTime: "Under 24 hours",
    completionRate: 97,
    languages: ["English", "Spanish"],
    experience: 10,
    education: [
      "Ph.D. in Computer Science, Stanford University",
      "M.S. in Statistics, MIT",
      "B.S. in Mathematics, UC Berkeley",
    ],
    certifications: [
      "AWS Certified Machine Learning Specialist",
      "Google Professional Data Engineer",
      "IBM Data Science Professional Certificate",
    ],
    philosophy:
      "My teaching philosophy centers on making complex concepts accessible through practical examples and real-world applications. I believe anyone can master data science with the right guidance.",
    categories: ["Data Science", "Programming"],
    skills: [
      { name: "Python", proficiency: "Expert" },
      { name: "Machine Learning", proficiency: "Expert" },
      { name: "Statistical Analysis", proficiency: "Expert" },
      { name: "Deep Learning", proficiency: "Advanced" },
      { name: "Data Visualization", proficiency: "Advanced" },
    ],
    courses: [
      {
        id: "c1",
        title: "Data Science Fundamentals with Python",
        description:
          "Master the basics of data science using Python in this comprehensive course.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Data Science",
        level: "Beginner",
        price: 89.99,
        rating: 4.8,
        reviews: 1253,
        duration: "42h 30m",
        studentsCount: 22350,
        isBestseller: true,
      },
      {
        id: "c2",
        title: "Advanced Machine Learning Techniques",
        description:
          "Take your ML skills to the next level with advanced algorithms and approaches.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Data Science",
        level: "Advanced",
        price: 129.99,
        rating: 4.9,
        reviews: 842,
        duration: "38h 15m",
        studentsCount: 15420,
      },
      {
        id: "c3",
        title: "Deep Learning with TensorFlow",
        description:
          "Build neural networks and deep learning models with TensorFlow and Keras.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Data Science",
        level: "Intermediate",
        price: 99.99,
        rating: 4.7,
        reviews: 503,
        duration: "36h 45m",
        studentsCount: 8960,
      },
    ],
    reviews: [
      {
        id: "r1",
        name: "Michael T.",
        avatar: course,
        date: "2023-12-15",
        rating: 5,
        text: "Dr. Johnson's course was transformative for my career. The hands-on projects helped me build a strong portfolio that impressed employers.",
        course: "Data Science Fundamentals with Python",
      },
      {
        id: "r2",
        name: "Priya S.",
        avatar: course,
        date: "2023-11-02",
        rating: 5,
        text: "Incredible depth of knowledge and excellent teaching style. Complex topics were broken down beautifully.",
        course: "Advanced Machine Learning Techniques",
      },
      {
        id: "r3",
        name: "David K.",
        avatar: course,
        date: "2023-10-18",
        rating: 4,
        text: "Great course content, though some sections could use more examples. Overall very satisfied with what I learned.",
        course: "Deep Learning with TensorFlow",
      },
    ],
    featuredCourse: "c1",
    location: "San Francisco, CA",
    socialLinks: {
      twitter: "https://twitter.com/sarahjohnson",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      website: "https://sarahjohnson.edu",
    },
    isOnline: true,
    isVerified: true,
    priceRange: {
      min: 89.99,
      max: 129.99,
    },
    availability: [
      {
        date: "2025-06-11",
        timeSlots: generateTimeSlots(9, 17).map((slot) => ({
          ...slot,
          sessionType: slot.id.includes("09:00") ? "individual" : "group",
          basePriceIndiv: 150,
          basePriceGroup: 90,
          price: slot.id.includes("09:00") ? 150 : 90,
          maxStudents: slot.id.includes("09:00") ? 1 : 6,
          currentRequests: [],
          status: "available",
        })),
      },
      {
        date: "2025-06-12",
        timeSlots: generateTimeSlots(10, 16).map((slot) => ({
          ...slot,
          sessionType: slot.id.includes("10:00") ? "individual" : "group",
          basePriceIndiv: 110,
          basePriceGroup: 75,
          price: slot.id.includes("10:00") ? 110 : 75,
          maxStudents: slot.id.includes("10:00") ? 1 : 5,
          currentRequests: [],
          status: "available",
        })),
      },
    ],
    timezone: "America/Los_Angeles",
    sessionPricing: {
      individual: { 30: 100, 60: 150, 120: 250 },
      group: { 30: 60, 60: 90, 120: 160 },
    },
    maxGroupSize: 8,
    bufferTime: 15,
    maxSessionsPerDay: 6,
    autoConfirmBookings: true,
    liveSessionsEnabled: true,
    groupSessionsEnabled: true,
    nextAvailableSlot: {
      date: "2024-01-15",
      time: "09:00",
      type: "individual",
      price: 150,
    },
    weeklyBookings: 12,
    responseTimeHours: 2,
    contentEngagement: {
      totalViews: 125000,
      totalLikes: 8500,
      avgEngagementRate: 6.8,
    },
    reels: [
      {
        id: "reel1",
        type: "reel",
        title: "5 Python Tips for Data Science",
        description: "Quick tips to improve your Python data science workflow",
        thumbnail: "/placeholder.svg?height=400&width=300",
        videoUrl: "/placeholder-video.mp4",
        duration: 45,
        views: 15420,
        likes: 892,
        comments: 156,
        shares: 89,
        createdAt: "2024-01-10",
        tags: ["python", "datascience", "tips"],
      },
      {
        id: "reel2",
        type: "reel",
        title: "Machine Learning in 60 Seconds",
        description: "Understanding ML concepts quickly",
        thumbnail: "/placeholder.svg?height=400&width=300",
        videoUrl: "/placeholder-video.mp4",
        duration: 60,
        views: 22100,
        likes: 1340,
        comments: 203,
        shares: 145,
        createdAt: "2024-01-08",
        tags: ["machinelearning", "ai", "basics"],
      },
    ],
    stories: [
      {
        id: "story1",
        type: "story",
        title: "Morning Coffee & Code",
        thumbnail: "/placeholder.svg?height=400&width=300",
        duration: 15,
        views: 3420,
        likes: 234,
        comments: 45,
        shares: 12,
        createdAt: "2024-01-14",
        tags: ["daily", "coding"],
      },
    ],
    storyHighlights: [
      {
        id: "highlight1",
        title: "Daily Tips",
        thumbnail: "/placeholder.svg?height=100&width=100",
        stories: [],
        createdAt: "2024-01-01",
      },
      {
        id: "highlight2",
        title: "Student Success",
        thumbnail: "/placeholder.svg?height=100&width=100",
        stories: [],
        createdAt: "2024-01-01",
      },
    ],
    recordedCourses: [
      {
        id: "course1",
        type: "course",
        title: "Complete Data Science Bootcamp",
        description:
          "Comprehensive course covering all aspects of data science",
        thumbnail: "/placeholder.svg?height=300&width=500",
        duration: 18000, // 5 hours
        views: 45000,
        likes: 3200,
        comments: 890,
        shares: 456,
        createdAt: "2024-01-01",
        tags: ["datascience", "python", "complete"],
      },
    ],
  },
  {
    id: "2",
    name: "Prof. David Chen",
    title: "UX/UI Design Expert",
    avatar: course,
    bio: "Professor Chen brings 15 years of industry experience in UX/UI design to his teaching. Previously a lead designer at major tech companies, he specializes in user-centered design principles and modern interface trends. His courses combine design theory with practical skills valued by today's employers.",
    shortBio:
      "UX/UI design expert with 15+ years of industry experience at major tech companies.",
    rating: 4.8,
    reviewsCount: 1895,
    studentsCount: 37800,
    coursesCount: 8,
    responseTime: "1-2 days",
    completionRate: 94,
    languages: ["English", "Mandarin"],
    experience: 15,
    education: [
      "MFA in Design, Rhode Island School of Design",
      "B.A. in Graphic Design, Parsons School of Design",
    ],
    certifications: [
      "Adobe Certified Expert",
      "Google UX Design Professional Certificate",
      "Interaction Design Foundation Certification",
    ],
    philosophy:
      "Design is problem-solving at its core. I teach students to understand the 'why' behind every design decision and to put users first in everything they create.",
    categories: ["Design"],
    skills: [
      { name: "UI Design", proficiency: "Expert" },
      { name: "User Research", proficiency: "Expert" },
      { name: "Figma", proficiency: "Expert" },
      { name: "Adobe XD", proficiency: "Advanced" },
      { name: "Design Systems", proficiency: "Advanced" },
    ],
    courses: [
      {
        id: "c4",
        title: "Complete UI/UX Design Bootcamp",
        description:
          "Comprehensive course covering all aspects of modern UI/UX design from fundamentals to advanced techniques.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Design",
        level: "All Levels",
        price: 109.99,
        rating: 4.9,
        reviews: 1032,
        duration: "52h 20m",
        studentsCount: 18620,
        isBestseller: true,
      },
      {
        id: "c5",
        title: "Mastering Figma for Design Teams",
        description:
          "Learn to create sophisticated designs and prototypes in Figma for collaborative team environments.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Design",
        level: "Intermediate",
        price: 79.99,
        rating: 4.7,
        reviews: 683,
        duration: "28h 45m",
        studentsCount: 12340,
      },
    ],
    reviews: [
      {
        id: "r4",
        name: "Jessica L.",
        avatar: course,
        date: "2023-12-01",
        rating: 5,
        text: "Professor Chen's design bootcamp completely changed my approach to UI/UX. I landed a job within a month of completing the course!",
        course: "Complete UI/UX Design Bootcamp",
      },
      {
        id: "r5",
        name: "Ryan M.",
        avatar: course,
        date: "2023-10-15",
        rating: 4,
        text: "Thorough and well-structured course. The design principles I learned are applicable across many tools, not just those covered in the course.",
        course: "Complete UI/UX Design Bootcamp",
      },
    ],
    featuredCourse: "c4",
    location: "New York, NY",
    socialLinks: {
      twitter: "https://twitter.com/davidchen",
      linkedin: "https://linkedin.com/in/davidchen",
      website: "https://davidchen.design",
    },
    isOnline: false,
    isVerified: true,
    priceRange: {
      min: 79.99,
      max: 109.99,
    },
    availability: [
      {
        date: "2024-01-16",
        timeSlots: generateTimeSlots(10, 16).map((slot) => ({
          ...slot,
          sessionType: slot.id.includes("10:00") ? "individual" : "group",
          basePriceIndiv: 110,
          basePriceGroup: 75,
          price: slot.id.includes("10:00") ? 110 : 75,
          maxStudents: slot.id.includes("10:00") ? 1 : 5,
          currentRequests: [],
          status: "available",
        })),
      },
    ],
    timezone: "America/New_York",
    sessionPricing: {
      individual: { 30: 75, 60: 110, 120: 190 },
      group: { 30: 45, 60: 75, 120: 130 },
    },
    maxGroupSize: 6,
    bufferTime: 10,
    maxSessionsPerDay: 5,
    autoConfirmBookings: false,
    liveSessionsEnabled: true,
    groupSessionsEnabled: true,
    nextAvailableSlot: {
      date: "2024-01-16",
      time: "10:00",
      type: "individual",
      price: 110,
    },
    weeklyBookings: 8,
    responseTimeHours: 24,
    contentEngagement: {
      totalViews: 98000,
      totalLikes: 6200,
      avgEngagementRate: 6.3,
    },
    reels: [
      {
        id: "reel3",
        type: "reel",
        title: "UI Design Principles in 30 Seconds",
        description: "Quick overview of essential UI design principles",
        thumbnail: "/placeholder.svg?height=400&width=300",
        videoUrl: "/placeholder-video.mp4",
        duration: 30,
        views: 18500,
        likes: 1250,
        comments: 180,
        shares: 95,
        createdAt: "2024-01-12",
        tags: ["ui", "design", "principles"],
      },
    ],
    stories: [
      {
        id: "story2",
        type: "story",
        title: "Design Process Breakdown",
        thumbnail: "/placeholder.svg?height=400&width=300",
        duration: 20,
        views: 2890,
        likes: 195,
        comments: 32,
        shares: 8,
        createdAt: "2024-01-13",
        tags: ["design", "process"],
      },
    ],
    storyHighlights: [
      {
        id: "highlight3",
        title: "Design Tips",
        thumbnail: "/placeholder.svg?height=100&width=100",
        stories: [],
        createdAt: "2024-01-01",
      },
    ],
    recordedCourses: [
      {
        id: "course2",
        type: "course",
        title: "UX Research Fundamentals",
        description: "Learn the fundamentals of user experience research",
        thumbnail: "/placeholder.svg?height=300&width=500",
        duration: 12600, // 3.5 hours
        views: 28000,
        likes: 1850,
        comments: 420,
        shares: 210,
        createdAt: "2024-01-01",
        tags: ["ux", "research", "fundamentals"],
      },
    ],
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    title: "Full Stack Web Developer",
    avatar: course,
    bio: "Maria is a full stack developer with 8 years of experience building web applications. She has worked with startups and large enterprises, specializing in JavaScript frameworks and responsive design. Her teaching emphasizes practical skills and project-based learning.",
    shortBio:
      "Full stack developer teaching modern web technologies with 8 years of industry experience.",
    rating: 4.7,
    reviewsCount: 1245,
    studentsCount: 29500,
    coursesCount: 10,
    responseTime: "Same day",
    completionRate: 92,
    languages: ["English", "Spanish", "Portuguese"],
    experience: 8,
    education: [
      "B.S. in Computer Science, University of Texas",
      "Full Stack Web Development Bootcamp, Coding Dojo",
    ],
    certifications: [
      "AWS Certified Developer",
      "MongoDB Certified Developer",
      "React Certification",
    ],
    philosophy:
      "I believe in learning by doing. My courses are built around real-world projects that give students practical experience they can immediately apply to their work.",
    categories: ["Programming"],
    skills: [
      { name: "JavaScript", proficiency: "Expert" },
      { name: "React", proficiency: "Expert" },
      { name: "Node.js", proficiency: "Advanced" },
      { name: "MongoDB", proficiency: "Advanced" },
      { name: "TypeScript", proficiency: "Intermediate" },
    ],
    courses: [
      {
        id: "c6",
        title: "Modern JavaScript: From Fundamentals to Front-End",
        description:
          "Master JavaScript from the basics to advanced concepts and front-end development with React.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Programming",
        level: "Beginner",
        price: 94.99,
        rating: 4.8,
        reviews: 875,
        duration: "46h 15m",
        studentsCount: 15780,
        isBestseller: true,
      },
      {
        id: "c7",
        title: "MERN Stack Masterclass",
        description:
          "Build full-stack applications with MongoDB, Express, React, and Node.js.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Programming",
        level: "Intermediate",
        price: 119.99,
        rating: 4.6,
        reviews: 542,
        duration: "38h 30m",
        studentsCount: 8950,
      },
    ],
    reviews: [
      {
        id: "r6",
        name: "Thomas H.",
        avatar: course,
        date: "2023-11-28",
        rating: 5,
        text: "Maria's JavaScript course is incredibly comprehensive. I went from knowing almost nothing to building complete applications.",
        course: "Modern JavaScript: From Fundamentals to Front-End",
      },
      {
        id: "r7",
        name: "Sarah P.",
        avatar: course,
        date: "2023-09-20",
        rating: 4,
        text: "The MERN stack course was challenging but rewarding. Maria explains complex concepts very clearly.",
        course: "MERN Stack Masterclass",
      },
    ],
    featuredCourse: "c6",
    location: "Austin, TX",
    socialLinks: {
      twitter: "https://twitter.com/mariarodriguez",
      linkedin: "https://linkedin.com/in/mariarodriguez",
      //   github: "https://github.com/mariarodriguez",
    },
    isOnline: true,
    isVerified: true,
    priceRange: {
      min: 94.99,
      max: 119.99,
    },
    availability: [
      {
        date: "2024-01-17",
        timeSlots: generateTimeSlots(11, 17).map((slot) => ({
          ...slot,
          sessionType: slot.id.includes("11:00") ? "individual" : "group",
          basePriceIndiv: 100,
          basePriceGroup: 65,
          price: slot.id.includes("11:00") ? 100 : 65,
          maxStudents: slot.id.includes("11:00") ? 1 : 4,
          currentRequests: [],
          status: "available",
        })),
      },
    ],
    timezone: "America/Chicago",
    sessionPricing: {
      individual: { 30: 70, 60: 100, 120: 180 },
      group: { 30: 40, 60: 65, 120: 120 },
    },
    maxGroupSize: 5,
    bufferTime: 15,
    maxSessionsPerDay: 7,
    autoConfirmBookings: true,
    liveSessionsEnabled: true,
    groupSessionsEnabled: true,
    nextAvailableSlot: {
      date: "2024-01-17",
      time: "11:00",
      type: "individual",
      price: 100,
    },
    weeklyBookings: 15,
    responseTimeHours: 4,
    contentEngagement: {
      totalViews: 142000,
      totalLikes: 9800,
      avgEngagementRate: 6.9,
    },
    reels: [
      {
        id: "reel4",
        type: "reel",
        title: "React Hooks Explained",
        description: "Understanding React hooks in under a minute",
        thumbnail: "/placeholder.svg?height=400&width=300",
        videoUrl: "/placeholder-video.mp4",
        duration: 55,
        views: 24500,
        likes: 1680,
        comments: 240,
        shares: 125,
        createdAt: "2024-01-09",
        tags: ["react", "hooks", "javascript"],
      },
    ],
    stories: [
      {
        id: "story3",
        type: "story",
        title: "Coding Challenge Solution",
        thumbnail: "/placeholder.svg?height=400&width=300",
        duration: 25,
        views: 4250,
        likes: 310,
        comments: 55,
        shares: 18,
        createdAt: "2024-01-14",
        tags: ["coding", "challenge"],
      },
    ],
    storyHighlights: [
      {
        id: "highlight4",
        title: "Coding Tips",
        thumbnail: "/placeholder.svg?height=100&width=100",
        stories: [],
        createdAt: "2024-01-01",
      },
    ],
    recordedCourses: [
      {
        id: "course3",
        type: "course",
        title: "JavaScript ES6+ Features",
        description: "Master modern JavaScript features and syntax",
        thumbnail: "/placeholder.svg?height=300&width=500",
        duration: 10800, // 3 hours
        views: 38000,
        likes: 2400,
        comments: 580,
        shares: 290,
        createdAt: "2024-01-01",
        tags: ["javascript", "es6", "modern"],
      },
    ],
  },
  {
    id: "4",
    name: "Robert Williams",
    title: "Digital Marketing Specialist",
    avatar: course,
    bio: "Robert has over 12 years of experience in digital marketing, working with both Fortune 500 companies and small businesses. He specializes in SEO, content marketing, and social media strategy. His courses focus on actionable techniques that deliver measurable results.",
    shortBio:
      "Digital marketing expert with 12+ years working with companies of all sizes.",
    rating: 4.6,
    reviewsCount: 1089,
    studentsCount: 22700,
    coursesCount: 7,
    responseTime: "1-2 days",
    completionRate: 89,
    languages: ["English"],
    experience: 12,
    education: [
      "MBA with Marketing Focus, Northwestern University",
      "B.A. in Communications, University of Michigan",
    ],
    certifications: [
      "Google Analytics Certification",
      "HubSpot Content Marketing Certification",
      "Facebook Blueprint Certification",
    ],
    philosophy:
      "Marketing is about connecting with people authentically. I teach strategies that not only drive traffic and conversions but also build lasting relationships with customers.",
    categories: ["Marketing", "Business"],
    skills: [
      { name: "SEO", proficiency: "Expert" },
      { name: "Content Marketing", proficiency: "Expert" },
      { name: "Social Media", proficiency: "Advanced" },
      { name: "Email Marketing", proficiency: "Advanced" },
      { name: "Google Analytics", proficiency: "Expert" },
    ],
    courses: [
      {
        id: "c8",
        title: "SEO Mastery: Rank Higher in 2023",
        description:
          "Learn modern SEO techniques to improve your website's visibility and organic traffic.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Marketing",
        level: "All Levels",
        price: 89.99,
        rating: 4.7,
        reviews: 632,
        duration: "32h 45m",
        studentsCount: 11250,
      },
      {
        id: "c9",
        title: "Content Marketing Strategy",
        description:
          "Develop and implement effective content marketing strategies that drive engagement.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Marketing",
        level: "Intermediate",
        price: 79.99,
        rating: 4.5,
        reviews: 458,
        duration: "28h 20m",
        studentsCount: 8940,
      },
    ],
    reviews: [
      {
        id: "r8",
        name: "Laura J.",
        avatar: course,
        date: "2023-11-05",
        rating: 5,
        text: "Robert's SEO course gave me practical skills I could apply immediately to my company's website. We've seen a 40% increase in organic traffic!",
        course: "SEO Mastery: Rank Higher in 2023",
      },
      {
        id: "r9",
        name: "Daniel M.",
        avatar: course,
        date: "2023-10-12",
        rating: 4,
        text: "Comprehensive content marketing course with lots of practical examples. Robert clearly knows his stuff.",
        course: "Content Marketing Strategy",
      },
    ],
    featuredCourse: "c8",
    location: "Chicago, IL",
    socialLinks: {
      twitter: "https://twitter.com/robertwilliams",
      linkedin: "https://linkedin.com/in/robertwilliams",
      website: "https://robertwilliamsmarketing.com",
    },
    isOnline: false,
    isVerified: true,
    priceRange: {
      min: 79.99,
      max: 89.99,
    },
    availability: [
      {
        date: "2024-01-17",
        timeSlots: generateTimeSlots(11, 17).map((slot) => ({
          ...slot,
          sessionType: slot.id.includes("11:00") ? "individual" : "group",
          basePriceIndiv: 100,
          basePriceGroup: 65,
          price: slot.id.includes("11:00") ? 100 : 65,
          maxStudents: slot.id.includes("11:00") ? 1 : 4,
          currentRequests: [],
          status: "available",
        })),
      },
    ],
    timezone: "America/Chicago",
    sessionPricing: {
      individual: { 30: 70, 60: 100, 120: 180 },
      group: { 30: 40, 60: 65, 120: 120 },
    },
    maxGroupSize: 5,
    bufferTime: 15,
    maxSessionsPerDay: 7,
    autoConfirmBookings: true,
    liveSessionsEnabled: true,
    groupSessionsEnabled: true,
    nextAvailableSlot: {
      date: "2024-01-17",
      time: "11:00",
      type: "individual",
      price: 100,
    },
    weeklyBookings: 15,
    responseTimeHours: 4,
    contentEngagement: {
      totalViews: 142000,
      totalLikes: 9800,
      avgEngagementRate: 6.9,
    },
    reels: [
      {
        id: "reel4",
        type: "reel",
        title: "React Hooks Explained",
        description: "Understanding React hooks in under a minute",
        thumbnail: "/placeholder.svg?height=400&width=300",
        videoUrl: "/placeholder-video.mp4",
        duration: 55,
        views: 24500,
        likes: 1680,
        comments: 240,
        shares: 125,
        createdAt: "2024-01-09",
        tags: ["react", "hooks", "javascript"],
      },
    ],
    stories: [
      {
        id: "story3",
        type: "story",
        title: "Coding Challenge Solution",
        thumbnail: "/placeholder.svg?height=400&width=300",
        duration: 25,
        views: 4250,
        likes: 310,
        comments: 55,
        shares: 18,
        createdAt: "2024-01-14",
        tags: ["coding", "challenge"],
      },
    ],
    storyHighlights: [
      {
        id: "highlight4",
        title: "Coding Tips",
        thumbnail: "/placeholder.svg?height=100&width=100",
        stories: [],
        createdAt: "2024-01-01",
      },
    ],
    recordedCourses: [
      {
        id: "course3",
        type: "course",
        title: "JavaScript ES6+ Features",
        description: "Master modern JavaScript features and syntax",
        thumbnail: "/placeholder.svg?height=300&width=500",
        duration: 10800, // 3 hours
        views: 38000,
        likes: 2400,
        comments: 580,
        shares: 290,
        createdAt: "2024-01-01",
        tags: ["javascript", "es6", "modern"],
      },
    ],
  },
  {
    id: "5",
    name: "Dr. James Peterson",
    title: "Music Theory & Composition Instructor",
    avatar: course,
    bio: "Dr. Peterson holds a doctorate in Music Composition and has taught at prestigious conservatories for over 20 years. He has composed for orchestras worldwide and specializes in classical and contemporary composition. His teaching emphasizes both theoretical foundations and creative expression.",
    shortBio:
      "Accomplished composer and music educator with 20+ years of teaching experience.",
    rating: 4.9,
    reviewsCount: 875,
    studentsCount: 18900,
    coursesCount: 6,
    responseTime: "2-3 days",
    completionRate: 95,
    languages: ["English", "French"],
    experience: 20,
    education: [
      "D.M.A. in Composition, Juilliard School",
      "M.M. in Composition, Yale School of Music",
      "B.M. in Music Theory, Eastman School of Music",
    ],
    certifications: [
      "Certified Music Educator",
      "Dalcroze Eurhythmics Certification",
    ],
    philosophy:
      "Music theory is not just academic knowledge—it's a tool for creative expression. I help students build a strong foundation while encouraging them to develop their unique artistic voice.",
    categories: ["Music"],
    skills: [
      { name: "Music Composition", proficiency: "Expert" },
      { name: "Music Theory", proficiency: "Expert" },
      { name: "Piano Performance", proficiency: "Advanced" },
      { name: "Orchestration", proficiency: "Expert" },
      { name: "Digital Music Production", proficiency: "Intermediate" },
    ],
    courses: [
      {
        id: "c10",
        title: "Music Theory Comprehensive",
        description:
          "A complete course covering all aspects of music theory from basics to advanced concepts.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Music",
        level: "All Levels",
        price: 99.99,
        rating: 4.9,
        reviews: 425,
        duration: "45h 30m",
        studentsCount: 9850,
      },
      {
        id: "c11",
        title: "Classical Composition Masterclass",
        description:
          "Learn the art of classical music composition from fundamental principles to complete works.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Music",
        level: "Advanced",
        price: 129.99,
        rating: 4.8,
        reviews: 320,
        duration: "38h 15m",
        studentsCount: 5620,
      },
    ],
    reviews: [
      {
        id: "r10",
        name: "Rebecca A.",
        avatar: course,
        date: "2023-12-10",
        rating: 5,
        text: "Dr. Peterson's music theory course transformed my understanding of composition. His approach makes complex concepts accessible.",
        course: "Music Theory Comprehensive",
      },
      {
        id: "r11",
        name: "Jason K.",
        avatar: course,
        date: "2023-11-14",
        rating: 5,
        text: "The composition masterclass is outstanding. Dr. Peterson provides detailed feedback that has significantly improved my work.",
        course: "Classical Composition Masterclass",
      },
    ],
    featuredCourse: "c10",
    location: "Boston, MA",
    socialLinks: {
      linkedin: "https://linkedin.com/in/jamespeterson",
      website: "https://jamespeterson.music",
    },
    isOnline: false,
    isVerified: true,
    priceRange: {
      min: 99.99,
      max: 129.99,
    },
    availability: [
      {
        date: "2024-01-17",
        timeSlots: generateTimeSlots(11, 17).map((slot) => ({
          ...slot,
          sessionType: slot.id.includes("11:00") ? "individual" : "group",
          basePriceIndiv: 100,
          basePriceGroup: 65,
          price: slot.id.includes("11:00") ? 100 : 65,
          maxStudents: slot.id.includes("11:00") ? 1 : 4,
          currentRequests: [],
          status: "available",
        })),
      },
    ],
    timezone: "America/Chicago",
    sessionPricing: {
      individual: { 30: 70, 60: 100, 120: 180 },
      group: { 30: 40, 60: 65, 120: 120 },
    },
    maxGroupSize: 5,
    bufferTime: 15,
    maxSessionsPerDay: 7,
    autoConfirmBookings: true,
    liveSessionsEnabled: true,
    groupSessionsEnabled: true,
    nextAvailableSlot: {
      date: "2024-01-17",
      time: "11:00",
      type: "individual",
      price: 100,
    },
    weeklyBookings: 15,
    responseTimeHours: 4,
    contentEngagement: {
      totalViews: 142000,
      totalLikes: 9800,
      avgEngagementRate: 6.9,
    },
    reels: [
      {
        id: "reel4",
        type: "reel",
        title: "React Hooks Explained",
        description: "Understanding React hooks in under a minute",
        thumbnail: "/placeholder.svg?height=400&width=300",
        videoUrl: "/placeholder-video.mp4",
        duration: 55,
        views: 24500,
        likes: 1680,
        comments: 240,
        shares: 125,
        createdAt: "2024-01-09",
        tags: ["react", "hooks", "javascript"],
      },
    ],
    stories: [
      {
        id: "story3",
        type: "story",
        title: "Coding Challenge Solution",
        thumbnail: "/placeholder.svg?height=400&width=300",
        duration: 25,
        views: 4250,
        likes: 310,
        comments: 55,
        shares: 18,
        createdAt: "2024-01-14",
        tags: ["coding", "challenge"],
      },
    ],
    storyHighlights: [
      {
        id: "highlight4",
        title: "Coding Tips",
        thumbnail: "/placeholder.svg?height=100&width=100",
        stories: [],
        createdAt: "2024-01-01",
      },
    ],
    recordedCourses: [
      {
        id: "course3",
        type: "course",
        title: "JavaScript ES6+ Features",
        description: "Master modern JavaScript features and syntax",
        thumbnail: "/placeholder.svg?height=300&width=500",
        duration: 10800, // 3 hours
        views: 38000,
        likes: 2400,
        comments: 580,
        shares: 290,
        createdAt: "2024-01-01",
        tags: ["javascript", "es6", "modern"],
      },
    ],
  },
  {
    id: "6",
    name: "Emily Wong",
    title: "Language Learning Specialist",
    avatar: course,
    bio: "Emily is a polyglot who speaks seven languages fluently. With a background in linguistics and education, she has developed a unique methodology for accelerated language acquisition. Her courses focus on practical communication skills and cultural understanding.",
    shortBio:
      "Polyglot language instructor specializing in accelerated learning methods.",
    rating: 4.8,
    reviewsCount: 1356,
    studentsCount: 31200,
    coursesCount: 14,
    responseTime: "Under 24 hours",
    completionRate: 93,
    languages: [
      "English",
      "Mandarin",
      "Spanish",
      "French",
      "Japanese",
      "Korean",
      "Italian",
    ],
    experience: 12,
    education: [
      "M.A. in Applied Linguistics, Georgetown University",
      "B.A. in Modern Languages, University of California, Berkeley",
    ],
    certifications: [
      "TESOL Certification",
      "ACTFL OPI Tester",
      "Cambridge CELTA",
    ],
    philosophy:
      "Language learning should be immersive, contextual, and enjoyable. I help students build language skills that they can immediately use in real-world interactions.",
    categories: ["Languages"],
    skills: [
      { name: "Language Acquisition", proficiency: "Expert" },
      { name: "Conversation Skills", proficiency: "Expert" },
      { name: "Grammar Instruction", proficiency: "Advanced" },
      { name: "Cultural Context", proficiency: "Expert" },
      { name: "Accent Reduction", proficiency: "Advanced" },
    ],
    courses: [
      {
        id: "c12",
        title: "Mandarin Chinese for Beginners",
        description:
          "Start speaking Mandarin Chinese from day one with this practical, immersive approach.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Languages",
        level: "Beginner",
        price: 84.99,
        rating: 4.7,
        reviews: 682,
        duration: "36h 45m",
        studentsCount: 13580,
      },
      {
        id: "c13",
        title: "Business Spanish Masterclass",
        description:
          "Learn professional Spanish for international business contexts and negotiations.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Languages",
        level: "Intermediate",
        price: 94.99,
        rating: 4.8,
        reviews: 495,
        duration: "32h 20m",
        studentsCount: 9240,
      },
    ],
    reviews: [
      {
        id: "r12",
        name: "Kevin L.",
        avatar: course,
        date: "2023-12-05",
        rating: 5,
        text: "Emily's method makes Mandarin so approachable! I've tried many language courses before, but this is the first one where I feel I'm actually making progress.",
        course: "Mandarin Chinese for Beginners",
      },
      {
        id: "r13",
        name: "Sofia R.",
        avatar: course,
        date: "2023-10-22",
        rating: 4,
        text: "The Business Spanish course prepared me perfectly for my new role at an international company. The focus on practical vocabulary was exactly what I needed.",
        course: "Business Spanish Masterclass",
      },
    ],
    featuredCourse: "c12",
    location: "San Francisco, CA",
    socialLinks: {
      twitter: "https://twitter.com/emilywong",
      linkedin: "https://linkedin.com/in/emilywong",
      youtube: "https://youtube.com/c/emilywonglanguages",
    },
    isOnline: true,
    isVerified: true,
    priceRange: {
      min: 84.99,
      max: 94.99,
    },
    availability: [
      {
        date: "2024-01-18",
        timeSlots: generateTimeSlots(10, 16).map((slot) => ({
          ...slot,
          sessionType: slot.id.includes("10:00") ? "individual" : "group",
          basePriceIndiv: 90,
          basePriceGroup: 60,
          price: slot.id.includes("10:00") ? 90 : 60,
          maxStudents: slot.id.includes("10:00") ? 1 : 6,
          currentRequests: [],
          status: "available",
        })),
      },
    ],
    timezone: "America/Los_Angeles",
    sessionPricing: {
      individual: { 30: 60, 60: 90, 120: 160 },
      group: { 30: 35, 60: 60, 120: 100 },
    },
    maxGroupSize: 6,
    bufferTime: 10,
    maxSessionsPerDay: 8,
    autoConfirmBookings: true,
    liveSessionsEnabled: true,
    groupSessionsEnabled: true,
    nextAvailableSlot: {
      date: "2024-01-18",
      time: "10:00",
      type: "individual",
      price: 90,
    },
    weeklyBookings: 20,
    responseTimeHours: 2,
    contentEngagement: {
      totalViews: 98000,
      totalLikes: 7200,
      avgEngagementRate: 7.3,
    },
    reels: [
      {
        id: "reel5",
        type: "reel",
        title: "5 Tips for Learning Mandarin",
        description: "Quick tips to improve your Mandarin learning",
        thumbnail: "/placeholder.svg?height=400&width=300",
        videoUrl: "/placeholder-video.mp4",
        duration: 40,
        views: 18500,
        likes: 1250,
        comments: 180,
        shares: 95,
        createdAt: "2024-01-11",
        tags: ["mandarin", "language", "tips"],
      },
    ],
    stories: [
      {
        id: "story4",
        type: "story",
        title: "Language Learning Journey",
        thumbnail: "/placeholder.svg?height=400&width=300",
        duration: 20,
        views: 3200,
        likes: 280,
        comments: 45,
        shares: 15,
        createdAt: "2024-01-13",
        tags: ["language", "learning"],
      },
    ],
    storyHighlights: [
      {
        id: "highlight5",
        title: "Language Tips",
        thumbnail: "/placeholder.svg?height=100&width=100",
        stories: [],
        createdAt: "2024-01-01",
      },
    ],
    recordedCourses: [
      {
        id: "course4",
        type: "course",
        title: "Complete Language Learning System",
        description: "Master any language with this proven system",
        thumbnail: "/placeholder.svg?height=300&width=500",
        duration: 14400, // 4 hours
        views: 42000,
        likes: 2800,
        comments: 650,
        shares: 320,
        createdAt: "2024-01-01",
        tags: ["language", "learning", "system"],
      },
    ],
  },
  {
    id: "7",
    name: "Alex Turner",
    title: "Photography & Cinematography Expert",
    avatar: course,
    bio: "Alex is an award-winning photographer and cinematographer whose work has appeared in major publications worldwide. With 15 years in the field, he brings practical expertise in both technical and artistic aspects of visual storytelling. His teaching focuses on helping students develop their unique visual style.",
    shortBio:
      "Award-winning photographer and cinematographer with work featured in major publications.",
    rating: 4.7,
    reviewsCount: 932,
    studentsCount: 19800,
    coursesCount: 9,
    responseTime: "1-2 days",
    completionRate: 90,
    languages: ["English"],
    experience: 15,
    education: [
      "M.F.A. in Photography, School of Visual Arts",
      "B.F.A. in Film, NYU Tisch School of the Arts",
    ],
    certifications: [
      "Adobe Certified Expert in Photoshop",
      "RED Digital Cinema Certified Operator",
    ],
    philosophy:
      "Technical skills are important, but developing your artistic vision is what truly sets you apart. I help students master both aspects to create meaningful, impactful imagery.",
    categories: ["Photography"],
    skills: [
      { name: "DSLR Photography", proficiency: "Expert" },
      { name: "Lighting", proficiency: "Expert" },
      { name: "Adobe Lightroom", proficiency: "Expert" },
      { name: "Adobe Photoshop", proficiency: "Advanced" },
      { name: "Cinematography", proficiency: "Advanced" },
    ],
    courses: [
      {
        id: "c14",
        title: "Digital Photography Masterclass",
        description:
          "Master your camera and learn professional photography techniques for stunning images.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Photography",
        level: "All Levels",
        price: 89.99,
        rating: 4.8,
        reviews: 563,
        duration: "38h 30m",
        studentsCount: 11240,
      },
      {
        id: "c15",
        title: "Advanced Lighting Techniques",
        description:
          "Take your photography to the next level with professional lighting setups and techniques.",
        thumbnail: "/placeholder.svg?height=300&width=500",
        category: "Photography",
        level: "Advanced",
        price: 109.99,
        rating: 4.6,
        reviews: 385,
        duration: "26h 45m",
        studentsCount: 6580,
      },
    ],
    reviews: [
      {
        id: "r14",
        name: "Olivia C.",
        avatar: course,
        date: "2023-11-18",
        rating: 5,
        text: "Alex's photography course completely transformed my work. The lighting section alone was worth the price of admission.",
        course: "Digital Photography Masterclass",
      },
      {
        id: "r15",
        name: "Marcus W.",
        avatar: course,
        date: "2023-09-30",
        rating: 4,
        text: "The advanced lighting course is incredibly detailed. Alex explains complex setups in a way that makes them achievable.",
        course: "Advanced Lighting Techniques",
      },
    ],
    featuredCourse: "c14",
    location: "Los Angeles, CA",
    socialLinks: {
      // instagram: "https://instagram.com/alexturner",
      website: "https://alexturner.photography",
      youtube: "https://youtube.com/c/alexturnerphoto",
    },
    isOnline: false,
    isVerified: true,
    priceRange: {
      min: 89.99,
      max: 109.99,
    },
    availability: [
      {
        date: "2024-01-19",
        timeSlots: generateTimeSlots(11, 17).map((slot) => ({
          ...slot,
          sessionType: slot.id.includes("11:00") ? "individual" : "group",
          basePriceIndiv: 110,
          basePriceGroup: 75,
          price: slot.id.includes("11:00") ? 110 : 75,
          maxStudents: slot.id.includes("11:00") ? 1 : 4,
          currentRequests: [],
          status: "available",
        })),
      },
    ],
    timezone: "America/Los_Angeles",
    sessionPricing: {
      individual: { 30: 75, 60: 110, 120: 190 },
      group: { 30: 45, 60: 75, 120: 130 },
    },
    maxGroupSize: 4,
    bufferTime: 15,
    maxSessionsPerDay: 6,
    autoConfirmBookings: false,
    liveSessionsEnabled: true,
    groupSessionsEnabled: true,
    nextAvailableSlot: {
      date: "2024-01-19",
      time: "11:00",
      type: "individual",
      price: 110,
    },
    weeklyBookings: 10,
    responseTimeHours: 24,
    contentEngagement: {
      totalViews: 85000,
      totalLikes: 5800,
      avgEngagementRate: 6.8,
    },
    reels: [
      {
        id: "reel6",
        type: "reel",
        title: "Photography Composition Tips",
        description: "Learn essential composition techniques",
        thumbnail: "/placeholder.svg?height=400&width=300",
        videoUrl: "/placeholder-video.mp4",
        duration: 50,
        views: 21500,
        likes: 1450,
        comments: 210,
        shares: 110,
        createdAt: "2024-01-10",
        tags: ["photography", "composition", "tips"],
      },
    ],
    stories: [
      {
        id: "story5",
        type: "story",
        title: "Behind the Scenes",
        thumbnail: "/placeholder.svg?height=400&width=300",
        duration: 25,
        views: 3800,
        likes: 320,
        comments: 55,
        shares: 20,
        createdAt: "2024-01-12",
        tags: ["photography", "behind-the-scenes"],
      },
    ],
    storyHighlights: [
      {
        id: "highlight6",
        title: "Photo Tips",
        thumbnail: "/placeholder.svg?height=100&width=100",
        stories: [],
        createdAt: "2024-01-01",
      },
    ],
    recordedCourses: [
      {
        id: "course5",
        type: "course",
        title: "Portrait Photography Mastery",
        description: "Master the art of portrait photography",
        thumbnail: "/placeholder.svg?height=300&width=500",
        duration: 12600, // 3.5 hours
        views: 35000,
        likes: 2200,
        comments: 480,
        shares: 240,
        createdAt: "2024-01-01",
        tags: ["photography", "portrait", "mastery"],
      },
    ],
  },
];
