// data/coursesData.ts
import {
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Users,
  Award,
  MoreHorizontal,
  Code,
  Palette,
  Camera,
  BarChart3,
} from "lucide-react";
import course from "@/public/images/courses/course.jpg";
import programming from "@/public/images/courses/programming.jpg";
import math from "@/public/images/courses/math.jpg";
import design from "@/public/images/courses/design.jpg";
import marketing from "@/public/images/courses/marketing.jpg";
import { Course, CourseCategory, CourseInstructor } from "../types/courseTypes";

// Categories
export const categories: CourseCategory[] = [
  {
    id: "all",
    name: "All",
    slug: "all",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Browse all available courses",
  },
  {
    id: "programming",
    name: "Programming",
    slug: "programming",
    icon: <Code className="h-4 w-4" />,
    description: "Learn coding and software development",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    slug: "mathematics",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "Master mathematical concepts and applications",
  },
  {
    id: "design",
    name: "Design",
    slug: "design",
    icon: <Palette className="h-4 w-4" />,
    description: "UI/UX, graphic design, and creative skills",
  },
  {
    id: "marketing",
    name: "Marketing",
    slug: "marketing",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "Digital marketing and business growth",
  },
  {
    id: "data-science",
    name: "Data Science",
    slug: "data-science",
    icon: <TrendingUp className="h-4 w-4" />,
    description: "Analytics, machine learning, and AI",
  },
  {
    id: "photography",
    name: "Photography",
    slug: "photography",
    icon: <Camera className="h-4 w-4" />,
    description: "Photography techniques and editing",
  },
];

// Instructors
export const instructors: CourseInstructor[] = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    role: "Senior Full-Stack Developer",
    avatar: course,
    bio: "Sarah has 8+ years of experience in web development, working with companies like Google and Microsoft. She's passionate about teaching and has helped over 50,000+ students master web development.",
    rating: 4.9,
    totalReviews: 2340,
    totalStudents: 52000,
    totalCourses: 12,
    expertise: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahcodes",
      website: "https://sarahjohnson.dev",
    },
  },
  {
    id: "michael-chen",
    name: "Michael Chen",
    role: "Lead Data Scientist",
    avatar: course,
    bio: "Michael is a Lead Data Scientist with PhD in Machine Learning. He has worked at top tech companies and published 20+ research papers in AI and ML.",
    rating: 4.8,
    totalReviews: 1876,
    totalStudents: 35000,
    totalCourses: 8,
    expertise: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/michaelchen",
      website: "https://michaelchen.ai",
    },
  },
  {
    id: "emma-roberts",
    name: "Emma Roberts",
    role: "Senior UX Designer",
    avatar: course,
    bio: "Emma is a Senior UX Designer with 6+ years at top design agencies. She specializes in user research, design systems, and has worked with Fortune 500 companies.",
    rating: 4.7,
    totalReviews: 1254,
    totalStudents: 28000,
    totalCourses: 6,
    expertise: [
      "UI/UX Design",
      "Figma",
      "Design Systems",
      "User Research",
      "Prototyping",
    ],
  },
];

// Comprehensive Course Data
export const coursesData: Course[] = [
  {
    // Basic Information
    id: "1",
    slug: "complete-web-development-masterclass",
    title: "Complete Web Development Masterclass",
    subtitle:
      "Build 20+ Real Projects and Master Front-End & Back-End Development",
    description:
      "Master modern web development from scratch! This comprehensive course covers HTML5, CSS3, JavaScript ES6+, React, Node.js, Express, MongoDB, and deployment. Build real-world projects including e-commerce sites, social media apps, and APIs. Perfect for beginners and those looking to advance their skills.",
    shortDescription:
      "Learn front-end and back-end web development by building 20+ real projects",

    // Media
    image: programming,
    previewVideo:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",

    // Categorization
    category: "Programming",
    subcategory: "Web Development",
    tags: [
      "JavaScript",
      "React",
      "Node.js",
      "Full Stack",
      "Web Development",
      "HTML",
      "CSS",
    ],

    // Pricing
    price: 89.99,
    originalPrice: 129.99,
    currency: "USD",

    // Course Metrics
    rating: 4.8,
    ratingCount: 2345,
    totalStudents: 15420,
    totalDuration: "45 hours",
    totalLectures: 234,
    totalSections: 12,
    level: "Beginner",

    // Badge & Features
    badge: "Bestseller",
    badgeColor: "success",
    featured: true,
    bestseller: true,
    trending: false,

    // Instructor
    instructor: instructors[0],

    // Content Structure
    sections: [
      {
        id: "intro",
        title: "Getting Started with Web Development",
        description: "Learn the basics and set up your development environment",
        duration: "2h 30m",
        isLocked: false,
        order: 1,
        lectures: [
          {
            id: "course-intro",
            title: "Course Introduction & What We'll Build",
            description:
              "Overview of the course and projects we'll create together",
            duration: "8:45",
            type: "video",
            isCompleted: false,
            isLocked: false,
            isFree: true,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            resources: [
              {
                name: "Course Roadmap",
                url: "/resources/roadmap.pdf",
                type: "pdf",
              },
            ],
          },
          {
            id: "setup-environment",
            title: "Setting Up Your Development Environment",
            description: "Install VS Code, Node.js, and essential extensions",
            duration: "15:20",
            type: "video",
            isCompleted: false,
            isLocked: false,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            resources: [
              {
                name: "Setup Checklist",
                url: "/resources/setup-checklist.pdf",
                type: "pdf",
              },
            ],
          },
          {
            id: "html-basics",
            title: "HTML5 Fundamentals",
            description: "Learn HTML5 semantic elements and structure",
            duration: "25:15",
            type: "video",
            isCompleted: false,
            isLocked: false,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          },
        ],
      },
      {
        id: "css-styling",
        title: "Advanced CSS & Responsive Design",
        description:
          "Master CSS3, Flexbox, Grid, and responsive design principles",
        duration: "8h 45m",
        isLocked: false,
        order: 2,
        lectures: [
          {
            id: "css-fundamentals",
            title: "CSS3 Fundamentals & Selectors",
            duration: "22:30",
            type: "video",
            isCompleted: false,
            isLocked: false,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          },
          {
            id: "flexbox-grid",
            title: "Flexbox & CSS Grid Layout",
            duration: "35:45",
            type: "video",
            isCompleted: false,
            isLocked: false,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          },
          {
            id: "responsive-design",
            title: "Responsive Design & Media Queries",
            duration: "28:20",
            type: "video",
            isCompleted: false,
            isLocked: false,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          },
        ],
      },
    ],

    // Requirements & Learning Outcomes
    requirements: [
      "No prior programming experience needed",
      "A computer with internet connection",
      "Eagerness to learn and build projects",
      "Basic computer skills (file management, web browsing)",
    ],
    whatYoullLearn: [
      "Build responsive websites using HTML5, CSS3, and JavaScript",
      "Master React.js for building modern user interfaces",
      "Create RESTful APIs with Node.js and Express",
      "Work with databases using MongoDB",
      "Deploy applications to cloud platforms",
      "Implement user authentication and authorization",
      "Build real-world projects for your portfolio",
      "Understand modern development workflows and tools",
    ],
    targetAudience: [
      "Complete beginners who want to learn web development",
      "Students looking to switch careers to tech",
      "Entrepreneurs who want to build their own websites",
      "Anyone interested in modern web technologies",
    ],

    // Course Details
    language: "English",
    hasSubtitles: true,
    subtitleLanguages: ["English", "Spanish", "French"],
    hasCertificate: true,
    hasLifetimeAccess: true,
    hasMobileAccess: true,

    // Reviews
    reviews: [
      {
        id: "review-1",
        userId: "user-1",
        userName: "Alex Thompson",
        userAvatar: "/avatars/alex.jpg",
        rating: 5,
        title: "Excellent course for beginners!",
        comment:
          "Sarah explains complex concepts in a very simple way. The projects are practical and helped me build a strong portfolio. Highly recommended!",
        createdAt: new Date("2023-11-15"),
        helpful: 24,
        verified: true,
      },
      {
        id: "review-2",
        userId: "user-2",
        userName: "Maria Garcia",
        userAvatar: "/avatars/maria.jpg",
        rating: 5,
        title: "Best investment I've made",
        comment:
          "This course helped me transition from marketing to web development. Got my first dev job 3 months after completing it!",
        createdAt: new Date("2023-10-22"),
        helpful: 18,
        verified: true,
      },
    ],

    // Metadata
    status: "published",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-11-20"),
    publishedAt: new Date("2023-02-01"),

    // SEO & Marketing
    metaTitle:
      "Complete Web Development Masterclass - Learn HTML, CSS, JavaScript & React",
    metaDescription:
      "Master web development with this comprehensive course. Build 20+ projects, learn React, Node.js, and get job-ready skills.",

    // Additional Features
    downloadableResources: 45,
    codingExercises: 28,
    articles: 12,
    quizzes: 15,
    assignments: 8,
  },

  {
    // Basic Information
    id: "2",
    slug: "python-data-science-machine-learning",
    title: "Python for Data Science and Machine Learning",
    subtitle:
      "Complete Data Science Bootcamp: NumPy, Pandas, Matplotlib, Scikit-Learn & TensorFlow",
    description:
      "Become a Data Scientist with Python! Learn data analysis, visualization, and machine learning. Master NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, and TensorFlow. Work with real datasets and build ML models from scratch.",
    shortDescription:
      "Master Python for data analysis, visualization, and machine learning",

    // Media
    image: programming,
    previewVideo:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",

    // Categorization
    category: "Data Science",
    subcategory: "Machine Learning",
    tags: [
      "Python",
      "Machine Learning",
      "Data Analysis",
      "Pandas",
      "NumPy",
      "TensorFlow",
    ],

    // Pricing
    price: 94.99,
    originalPrice: 189.99,
    currency: "USD",

    // Course Metrics
    rating: 4.9,
    ratingCount: 1876,
    totalStudents: 12500,
    totalDuration: "38 hours",
    totalLectures: 156,
    totalSections: 10,
    level: "Intermediate",

    // Badge & Features
    badge: "Hot & New",
    badgeColor: "error",
    featured: true,
    bestseller: false,
    trending: true,

    // Instructor
    instructor: instructors[1],

    // Content Structure (simplified for example)
    sections: [
      {
        id: "python-fundamentals",
        title: "Python Fundamentals for Data Science",
        description: "Essential Python skills for data analysis",
        duration: "4h 20m",
        isLocked: false,
        order: 1,
        lectures: [
          {
            id: "python-basics-ds",
            title: "Python Basics for Data Science",
            duration: "18:30",
            type: "video",
            isCompleted: false,
            isLocked: false,
            isFree: true,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
        ],
      },
    ],

    // Requirements & Learning Outcomes
    requirements: [
      "Basic Python knowledge helpful but not required",
      "High school level mathematics",
      "Interest in data analysis and machine learning",
      "Computer with Python installed",
    ],
    whatYoullLearn: [
      "Master Python libraries: NumPy, Pandas, Matplotlib, Seaborn",
      "Perform data analysis and visualization",
      "Build machine learning models with Scikit-Learn",
      "Deep learning with TensorFlow and Keras",
      "Work with real-world datasets",
      "Statistical analysis and hypothesis testing",
      "Time series analysis and forecasting",
      "Portfolio of data science projects",
    ],
    targetAudience: [
      "Aspiring data scientists and analysts",
      "Students in STEM fields",
      "Professionals looking to transition to data science",
      "Anyone interested in machine learning and AI",
    ],

    // Course Details
    language: "English",
    hasSubtitles: true,
    subtitleLanguages: ["English", "Spanish"],
    hasCertificate: true,
    hasLifetimeAccess: true,
    hasMobileAccess: true,

    // Reviews
    reviews: [
      {
        id: "review-3",
        userId: "user-3",
        userName: "David Kim",
        userAvatar: "/avatars/david.jpg",
        rating: 5,
        title: "Outstanding ML course!",
        comment:
          "Michael's teaching style is exceptional. The hands-on projects really helped me understand complex ML concepts.",
        createdAt: new Date("2023-11-10"),
        helpful: 32,
        verified: true,
      },
    ],

    // Metadata
    status: "published",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-11-18"),
    publishedAt: new Date("2023-03-20"),

    // SEO & Marketing
    metaTitle:
      "Python Data Science & Machine Learning Bootcamp - Complete Course",
    metaDescription:
      "Learn Python for Data Science and Machine Learning. Master Pandas, NumPy, Scikit-Learn, TensorFlow with real projects.",

    // Additional Features
    downloadableResources: 38,
    codingExercises: 45,
    articles: 8,
    quizzes: 12,
    assignments: 15,
  },
];

// Helper functions
export const getCourseById = (courseId: string): Course | undefined => {
  return coursesData.find((course) => course.id === courseId);
};

export const getCourseBySlug = (slug: string): Course | undefined => {
  return coursesData.find((course) => course.slug === slug);
};

export const getCoursesByCategory = (category: string): Course[] => {
  if (category === "all") return coursesData;
  return coursesData.filter(
    (course) => course.category.toLowerCase() === category.toLowerCase()
  );
};

export const getFeaturedCourses = (): Course[] => {
  return coursesData.filter((course) => course.featured);
};

export const getBestsellerCourses = (): Course[] => {
  return coursesData.filter((course) => course.bestseller);
};

export const getTrendingCourses = (): Course[] => {
  return coursesData.filter((course) => course.trending);
};

export const getCoursesByInstructor = (instructorId: string): Course[] => {
  return coursesData.filter((course) => course.instructor.id === instructorId);
};

export const searchCourses = (query: string): Course[] => {
  const searchTerm = query.toLowerCase();
  return coursesData.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      course.instructor.name.toLowerCase().includes(searchTerm)
  );
};
