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
import { Course, CourseCategory } from "@/types/courseTypes";
import { Instructor } from "./instructorsData";

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
  {
    id: "business",
    name: "Business",
    slug: "business",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "Business and entrepreneurship",
  },
  {
    id: "language",
    name: "Language",
    slug: "language",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Learn new languages",
  },
  {
    id: "music",
    name: "Music",
    slug: "music",
    icon: <Camera className="h-4 w-4" />,
    description: "Music theory and instruments",
  },
  {
    id: "more",
    name: "More",
    slug: "more",
    icon: <MoreHorizontal className="h-4 w-4" />,
    description: "More categories",
  },
];

// Import instructors from instructorsData
import { instructors } from "./instructorsData";

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
    discountPrice: 79.99,
    originalPrice: 129.99,
    currency: "USD",

    // Course Metrics
    rating: 4.8,
    ratingCount: 2345,
    totalStudents: 15420,
    totalDuration: "45 hours",
    totalLectures: 234,
    totalSections: 12,
    level: "BEGINNER",

    // Badge & Features
    badge: "Bestseller",
    badgeColor: "success",
    featured: true,
    bestseller: true,
    trending: false,

    // Instructor - Reference to full instructor data
    instructor: instructors[0],

    // Course Progress
    progress: {
      completedLectures: 0,
      totalLectures: 234,
      completedSections: [],
      lastWatchedLecture: undefined,
      timeSpent: 0,
      completionPercentage: 0,
      certificateEarned: false,
    },

    // Content Structure
    sections: [
      {
        id: "intro",
        title: "Getting Started with Web Development",
        description: "Learn the basics and set up your development environment",
        duration: 150, // 2h 30m in minutes
        isLocked: false,
        order: 1,
        lectures: [
          {
            id: "course-intro",
            title: "Course Introduction & What We'll Build",
            description:
              "Overview of the course and projects we'll create together",
            duration: 525, // 8:45 in seconds
            type: "VIDEO",
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
            duration: 920, // 15:20 in seconds
            type: "VIDEO",
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
            duration: 1515, // 25:15 in seconds
            type: "VIDEO",
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
        duration: 525, // 8h 45m in minutes
        isLocked: false,
        order: 2,
        lectures: [
          {
            id: "css-fundamentals",
            title: "CSS3 Fundamentals & Selectors",
            duration: 1350, // 22:30 in seconds
            type: "VIDEO",
            isCompleted: false,
            isLocked: false,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          },
          {
            id: "flexbox-grid",
            title: "Flexbox & CSS Grid Layout",
            duration: 2145, // 35:45 in seconds
            type: "VIDEO",
            isCompleted: false,
            isLocked: false,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          },
          {
            id: "responsive-design",
            title: "Responsive Design & Media Queries",
            duration: 1700, // 28:20 in seconds
            type: "VIDEO",
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
        userName: "Sarah Johnson",
        userAvatar: "/avatars/sarah.jpg",
        rating: 5,
        title: "Excellent Course!",
        comment: "This course exceeded my expectations. Clear explanations and practical examples.",
        createdAt: new Date("2023-11-15"),
        helpful: 12,
        verified: true,
        isVerified: true,
        helpfulCount: 12,
        status: "PUBLISHED",
        flaggedCount: 0,
        updatedAt: new Date("2023-11-15"),
      },
      {
        id: "review-2",
        userId: "user-2",
        userName: "Michael Chen",
        userAvatar: "/avatars/michael.jpg",
        rating: 4,
        title: "Good course, but could be better",
        comment: "The course covers the basics well, but some advanced topics could be explained more clearly.",
        createdAt: new Date("2023-11-10"),
        helpful: 8,
        verified: true,
        isVerified: true,
        helpfulCount: 8,
        status: "PUBLISHED",
        flaggedCount: 0,
        updatedAt: new Date("2023-11-10"),
      },
    ],

    // Metadata
    status: "PUBLISHED",
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
    quizzes: [],
    assignments: [],
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
    discountPrice: 84.99,
    originalPrice: 189.99,
    currency: "USD",

    // Course Metrics
    rating: 4.9,
    ratingCount: 1876,
    totalStudents: 12500,
    totalDuration: "38 hours",
    totalLectures: 156,
    totalSections: 10,
    level: "INTERMEDIATE",

    // Badge & Features
    badge: "Hot & New",
    badgeColor: "error",
    featured: false,
    bestseller: false,
    trending: true,

    // Instructor - Reference to full instructor data
    instructor: instructors[1],
    // Course Progress
    progress: {
      completedLectures: 0,
      totalLectures: 234,
      completedSections: [],
      lastWatchedLecture: undefined,
      timeSpent: 0,
      completionPercentage: 0,
      certificateEarned: false,
    },

    // Content Structure (simplified for example)
    sections: [
      {
        id: "python-fundamentals",
        title: "Python Fundamentals for Data Science",
        description: "Essential Python skills for data analysis",
        duration: 260, // 4h 20m in minutes
        isLocked: false,
        order: 1,
        lectures: [
          {
            id: "python-basics-ds",
            title: "Python Basics for Data Science",
            duration: 1110, // 18:30 in seconds
            type: "VIDEO",
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
    status: "PUBLISHED",
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
    quizzes: [],
    assignments: [],
  },

  {
    id: "3",
    slug: "ui-ux-design-masterclass",
    title: "UI/UX Design Masterclass",
    subtitle: "Learn Modern Design Principles and Create Beautiful Interfaces",
    description:
      "Master the art of UI/UX design with this comprehensive course. Learn design principles, user research, wireframing, prototyping, and more. Create stunning interfaces that users love.",
    shortDescription:
      "Master UI/UX design principles and create beautiful interfaces",
    image: design,
    previewVideo:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    category: "Design",
    subcategory: "UI/UX Design",
    tags: ["UI Design", "UX Design", "Figma", "Prototyping", "User Research"],
    price: 99.99,
    discountPrice: 89.99,
    originalPrice: 149.99,
    currency: "USD",
    rating: 4.8,
    ratingCount: 1567,
    totalStudents: 12800,
    totalDuration: "42 hours",
    totalLectures: 198,
    totalSections: 14,
    level: "ALL_LEVELS",
    badge: "Bestseller",
    badgeColor: "success",
    featured: true,
    bestseller: true,
    trending: true,
    instructor: instructors[2],
    // Course Progress
    progress: {
      completedLectures: 0,
      totalLectures: 234,
      completedSections: [],
      lastWatchedLecture: undefined,
      timeSpent: 0,
      completionPercentage: 0,
      certificateEarned: false,
    },
    sections: [
      {
        id: "design-fundamentals",
        title: "Design Fundamentals",
        description: "Learn the core principles of design",
        duration: 390, // 6h 30m in minutes
        isLocked: false,
        order: 1,
        lectures: [
          {
            id: "design-principles",
            title: "Core Design Principles",
            duration: 2720, // 45:20 in seconds
            type: "VIDEO",
            isCompleted: false,
            isLocked: false,
            isFree: true,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
        ],
      },
    ],
    requirements: [
      "No prior design experience needed",
      "A computer with internet connection",
      "Figma (free version)",
      "Passion for design",
    ],
    whatYoullLearn: [
      "Master UI/UX design principles",
      "Create wireframes and prototypes",
      "Conduct user research",
      "Design responsive interfaces",
      "Build a professional design portfolio",
    ],
    targetAudience: [
      "Aspiring UI/UX designers",
      "Graphic designers looking to expand skills",
      "Web developers wanting to learn design",
      "Anyone interested in digital design",
    ],
    language: "English",
    hasSubtitles: true,
    subtitleLanguages: ["English", "Spanish"],
    hasCertificate: true,
    hasLifetimeAccess: true,
    hasMobileAccess: true,
    reviews: [
      {
        id: "review-4",
        userId: "user-4",
        userName: "Lisa Chen",
        userAvatar: "/avatars/lisa.jpg",
        rating: 5,
        title: "Transformative design course!",
        comment:
          "Emma's teaching style is incredible. I went from knowing nothing about design to creating professional interfaces.",
        createdAt: new Date("2023-12-05"),
        helpful: 28,
        verified: true,
      },
    ],
    status: "PUBLISHED",
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-12-10"),
    publishedAt: new Date("2023-04-20"),
    metaTitle: "UI/UX Design Masterclass - Learn Modern Design Principles",
    metaDescription:
      "Master UI/UX design with this comprehensive course. Learn design principles, user research, and create beautiful interfaces.",
    downloadableResources: 42,
    codingExercises: 0,
    articles: 15,
    quizzes: [],
    assignments: [],
  },

  {
    id: "4",
    slug: "digital-marketing-complete-course",
    title: "Complete Digital Marketing Course",
    subtitle: "Master SEO, Social Media, Content Marketing & More",
    description:
      "Learn everything you need to know about digital marketing. From SEO and social media to content marketing and analytics. Build a comprehensive marketing strategy and grow your business online.",
    shortDescription:
      "Master digital marketing strategies and grow your business online",
    image: marketing,
    previewVideo:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    category: "Marketing",
    subcategory: "Digital Marketing",
    tags: [
      "SEO",
      "Social Media",
      "Content Marketing",
      "Analytics",
      "Email Marketing",
    ],
    price: 79.99,
    discountPrice: 69.99,
    originalPrice: 129.99,
    currency: "USD",
    rating: 4.7,
    ratingCount: 1245,
    totalStudents: 9800,
    totalDuration: "36 hours",
    totalLectures: 168,
    totalSections: 12,
    level: "ALL_LEVELS",
    badge: "Popular",
    badgeColor: "info",
    featured: true,
    bestseller: false,
    trending: true,
    instructor: instructors[3],
    // Course Progress
    progress: {
      completedLectures: 0,
      totalLectures: 234,
      completedSections: [],
      lastWatchedLecture: undefined,
      timeSpent: 0,
      completionPercentage: 0,
      certificateEarned: false,
    },
    sections: [
      {
        id: "marketing-fundamentals",
        title: "Digital Marketing Fundamentals",
        description: "Learn the basics of digital marketing",
        duration: 345, // 5h 45m in minutes
        isLocked: false,
        order: 1,
        lectures: [
          {
            id: "marketing-intro",
            title: "Introduction to Digital Marketing",
            duration: 2115, // 35:15 in seconds
            type: "VIDEO",
            isCompleted: false,
            isLocked: false,
            isFree: true,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
        ],
      },
    ],
    requirements: [
      "No prior marketing experience needed",
      "Basic computer skills",
      "Internet connection",
      "Interest in digital marketing",
    ],
    whatYoullLearn: [
      "Master SEO and content marketing",
      "Create effective social media strategies",
      "Run successful email campaigns",
      "Analyze marketing data",
      "Build a complete marketing strategy",
    ],
    targetAudience: [
      "Marketing professionals",
      "Business owners",
      "Entrepreneurs",
      "Anyone interested in digital marketing",
    ],
    language: "English",
    hasSubtitles: true,
    subtitleLanguages: ["English"],
    hasCertificate: true,
    hasLifetimeAccess: true,
    hasMobileAccess: true,
    reviews: [
      {
        id: "review-5",
        userId: "user-5",
        userName: "John Smith",
        userAvatar: "/avatars/john.jpg",
        rating: 5,
        title: "Excellent marketing course!",
        comment:
          "Robert's course helped me grow my business significantly. The SEO section alone was worth the price.",
        createdAt: new Date("2023-11-28"),
        helpful: 22,
        verified: true,
      },
    ],
    status: "PUBLISHED",
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2023-12-05"),
    publishedAt: new Date("2023-05-15"),
    metaTitle: "Complete Digital Marketing Course - Master Online Marketing",
    metaDescription:
      "Learn digital marketing from scratch. Master SEO, social media, content marketing, and analytics to grow your business online.",
    downloadableResources: 35,
    codingExercises: 0,
    articles: 20,
    quizzes: [],
    assignments: [],
  },

  {
    id: "5",
    slug: "advanced-mathematics-masterclass",
    title: "Advanced Mathematics Masterclass",
    subtitle: "Master Calculus, Linear Algebra, and Mathematical Analysis",
    description:
      "Dive deep into advanced mathematical concepts. This comprehensive course covers calculus, linear algebra, differential equations, and mathematical analysis. Perfect for students and professionals looking to strengthen their mathematical foundation.",
    shortDescription: "Master advanced mathematical concepts and applications",
    image: math,
    previewVideo:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    category: "Mathematics",
    subcategory: "Advanced Math",
    tags: [
      "Calculus",
      "Linear Algebra",
      "Differential Equations",
      "Mathematical Analysis",
    ],
    price: 99.99,
    discountPrice: 89.99,
    originalPrice: 159.99,
    currency: "USD",
    rating: 4.9,
    ratingCount: 987,
    totalStudents: 7500,
    totalDuration: "48 hours",
    totalLectures: 210,
    totalSections: 15,
    level: "ADVANCED",
    badge: "Popular",
    badgeColor: "info",
    featured: true,
    bestseller: false,
    trending: true,
    instructor: instructors[4],
    // Course Progress
    progress: {
      completedLectures: 0,
      totalLectures: 234,
      completedSections: [],
      lastWatchedLecture: undefined,
      timeSpent: 0,
      completionPercentage: 0,
      certificateEarned: false,
    },
    sections: [
      {
        id: "calculus-fundamentals",
        title: "Calculus Fundamentals",
        description: "Master the basics of calculus",
        duration: 510, // 8h 30m in minutes
        isLocked: false,
        order: 1,
        lectures: [
          {
            id: "calculus-intro",
            title: "Introduction to Calculus",
            duration: 2720, // 45:20 in seconds
            type: "VIDEO",
            isCompleted: false,
            isLocked: false,
            isFree: true,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
        ],
      },
    ],
    requirements: [
      "Basic mathematics knowledge",
      "Understanding of algebra and trigonometry",
      "Dedication to learning complex concepts",
      "Scientific calculator",
    ],
    whatYoullLearn: [
      "Master calculus concepts and applications",
      "Understand linear algebra and matrices",
      "Solve differential equations",
      "Apply mathematical analysis techniques",
      "Develop problem-solving skills",
    ],
    targetAudience: [
      "Mathematics students",
      "Engineering students",
      "Physics students",
      "Anyone interested in advanced mathematics",
    ],
    language: "English",
    hasSubtitles: true,
    subtitleLanguages: ["English", "Spanish"],
    hasCertificate: true,
    hasLifetimeAccess: true,
    hasMobileAccess: true,
    reviews: [
      {
        id: "review-6",
        userId: "user-6",
        userName: "Michael Brown",
        userAvatar: "/avatars/michael.jpg",
        rating: 5,
        title: "Excellent math course!",
        comment:
          "The explanations are crystal clear. I finally understand complex mathematical concepts.",
        createdAt: new Date("2023-12-15"),
        helpful: 19,
        verified: true,
      },
    ],
    status: "PUBLISHED",
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2023-12-20"),
    publishedAt: new Date("2023-06-15"),
    metaTitle:
      "Advanced Mathematics Masterclass - Master Complex Math Concepts",
    metaDescription:
      "Learn advanced mathematics including calculus, linear algebra, and mathematical analysis with this comprehensive course.",
    downloadableResources: 50,
    codingExercises: 0,
    articles: 25,
    quizzes: [],
    assignments: [],
  },

  {
    id: "6",
    slug: "professional-photography-course",
    title: "Professional Photography Course",
    subtitle: "Master Camera Settings, Composition, and Photo Editing",
    description:
      "Learn professional photography from scratch. This course covers camera settings, composition techniques, lighting, and photo editing. Perfect for beginners and intermediate photographers looking to improve their skills.",
    shortDescription: "Master professional photography and photo editing",
    image: course,
    previewVideo:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    category: "Photography",
    subcategory: "Digital Photography",
    tags: [
      "Camera Settings",
      "Composition",
      "Lighting",
      "Photo Editing",
      "Adobe Lightroom",
    ],
    price: 79.99,
    discountPrice: 69.99,
    originalPrice: 119.99,
    currency: "USD",
    rating: 4.8,
    ratingCount: 1123,
    totalStudents: 8900,
    totalDuration: "40 hours",
    totalLectures: 180,
    totalSections: 12,
    level: "ALL_LEVELS",
    badge: "Bestseller",
    badgeColor: "success",
    featured: true,
    bestseller: true,
    trending: false,
    instructor: instructors[5],
    // Course Progress
    progress: {
      completedLectures: 0,
      totalLectures: 234,
      completedSections: [],
      lastWatchedLecture: undefined,
      timeSpent: 0,
      completionPercentage: 0,
      certificateEarned: false,
    },
    sections: [
      {
        id: "camera-basics",
        title: "Camera Basics and Settings",
        description: "Learn essential camera settings and controls",
        duration: 405, // 6h 45m in minutes
        isLocked: false,
        order: 1,
        lectures: [
          {
            id: "camera-intro",
            title: "Introduction to Camera Settings",
            duration: 2415, // 40:15 in seconds
            type: "VIDEO",
            isCompleted: false,
            isLocked: false,
            isFree: true,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
        ],
      },
    ],
    requirements: [
      "Any camera (DSLR, mirrorless, or smartphone)",
      "Basic computer skills",
      "Adobe Lightroom (free trial available)",
      "Passion for photography",
    ],
    whatYoullLearn: [
      "Master camera settings and controls",
      "Understand composition techniques",
      "Learn lighting and exposure",
      "Edit photos professionally",
      "Build a photography portfolio",
    ],
    targetAudience: [
      "Beginner photographers",
      "Intermediate photographers",
      "Photo enthusiasts",
      "Anyone interested in photography",
    ],
    language: "English",
    hasSubtitles: true,
    subtitleLanguages: ["English", "Spanish", "French"],
    hasCertificate: true,
    hasLifetimeAccess: true,
    hasMobileAccess: true,
    reviews: [
      {
        id: "review-7",
        userId: "user-7",
        userName: "Sarah Wilson",
        userAvatar: "/avatars/sarah.jpg",
        rating: 5,
        title: "Amazing photography course!",
        comment:
          "The instructor explains everything so clearly. My photos have improved dramatically.",
        createdAt: new Date("2023-12-10"),
        helpful: 27,
        verified: true,
      },
    ],
    status: "PUBLISHED",
    createdAt: new Date("2023-07-10"),
    updatedAt: new Date("2023-12-15"),
    publishedAt: new Date("2023-07-15"),
    metaTitle: "Professional Photography Course - Master Camera and Editing",
    metaDescription:
      "Learn professional photography from scratch. Master camera settings, composition, and photo editing with this comprehensive course.",
    downloadableResources: 45,
    codingExercises: 0,
    articles: 18,
    quizzes: [],
    assignments: [],
  },

  {
    id: "7",
    slug: "business-analytics-course",
    title: "Business Analytics and Data Visualization",
    subtitle:
      "Master Data Analysis, Business Intelligence, and Visualization Tools",
    description:
      "Learn to analyze business data and create compelling visualizations. This course covers data analysis, business intelligence, and visualization tools like Tableau and Power BI. Perfect for business professionals and analysts.",
    shortDescription: "Master business analytics and data visualization",
    image: programming,
    previewVideo:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    category: "Data Science",
    subcategory: "Business Analytics",
    tags: [
      "Data Analysis",
      "Business Intelligence",
      "Tableau",
      "Power BI",
      "Excel",
    ],
    price: 89.99,
    discountPrice: 79.99,
    originalPrice: 139.99,
    currency: "USD",
    rating: 4.7,
    ratingCount: 876,
    totalStudents: 7200,
    totalDuration: "35 hours",
    totalLectures: 165,
    totalSections: 10,
    level: "INTERMEDIATE",
    badge: "Hot & New",
    badgeColor: "error",
    featured: true,
    bestseller: false,
    trending: true,
    instructor: instructors[6],
    // Course Progress
    progress: {
      completedLectures: 0,
      totalLectures: 234,
      completedSections: [],
      lastWatchedLecture: undefined,
      timeSpent: 0,
      completionPercentage: 0,
      certificateEarned: false,
    },
    sections: [
      {
        id: "analytics-fundamentals",
        title: "Business Analytics Fundamentals",
        description: "Learn the basics of business analytics",
        duration: 330, // 5h 30m in minutes
        isLocked: false,
        order: 1,
        lectures: [
          {
            id: "analytics-intro",
            title: "Introduction to Business Analytics",
            duration: 2120, // 35:20 in seconds
            type: "VIDEO",
            isCompleted: false,
            isLocked: false,
            isFree: true,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
        ],
      },
    ],
    requirements: [
      "Basic Excel knowledge",
      "Understanding of business concepts",
      "Computer with internet connection",
      "Interest in data analysis",
    ],
    whatYoullLearn: [
      "Master data analysis techniques",
      "Create business intelligence reports",
      "Use Tableau and Power BI",
      "Visualize data effectively",
      "Make data-driven decisions",
    ],
    targetAudience: [
      "Business professionals",
      "Data analysts",
      "Managers",
      "Anyone interested in business analytics",
    ],
    language: "English",
    hasSubtitles: true,
    subtitleLanguages: ["English"],
    hasCertificate: true,
    hasLifetimeAccess: true,
    hasMobileAccess: true,
    reviews: [
      {
        id: "review-8",
        userId: "user-8",
        userName: "David Lee",
        userAvatar: "/avatars/david.jpg",
        rating: 5,
        title: "Great business analytics course!",
        comment:
          "The course helped me improve my data analysis skills significantly. Highly recommended!",
        createdAt: new Date("2023-12-05"),
        helpful: 15,
        verified: true,
      },
    ],
    status: "PUBLISHED",
    createdAt: new Date("2023-08-10"),
    updatedAt: new Date("2023-12-10"),
    publishedAt: new Date("2023-08-15"),
    metaTitle:
      "Business Analytics Course - Master Data Analysis and Visualization",
    metaDescription:
      "Learn business analytics and data visualization. Master tools like Tableau and Power BI to make data-driven decisions.",
    downloadableResources: 40,
    codingExercises: 0,
    articles: 15,
    quizzes: [],
    assignments: [],
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
