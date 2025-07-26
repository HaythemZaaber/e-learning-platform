export interface Lecture {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "assignment" | "resource";
  duration?: number;
  content?: string;
  description?: string;
  status: "draft" | "published";
}

export interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
}

export interface CourseData {
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  thumbnail?: string;
  objectives: string[];
  prerequisites: string[];
  sections: Section[];
  settings: CourseSettings;
}

export interface CourseSettings {
  isPublic: boolean;
  enrollmentType: "free" | "paid" | "subscription";
  language: string;
  certificate: boolean;
  seoDescription: string;
  seoTags: string[];
  accessibility: {
    captions: boolean;
    transcripts: boolean;
    audioDescription: boolean;
  };
  pricing?: {
    amount: number;
    currency: string;
    discountPercentage: number;
    earlyBirdDiscount: boolean;
    installmentPlans: boolean;
  };
  enrollment?: {
    maxStudents: number | null;
    enrollmentDeadline: string;
    prerequisitesCourse: string;
    ageRestriction: string;
  };
  communication?: {
    discussionForum: boolean;
    directMessaging: boolean;
    liveChat: boolean;
    announcementEmails: boolean;
  };
  completion?: {
    passingGrade: number;
    allowRetakes: boolean;
    timeLimit: number | null;
    certificateTemplate: string;
  };
  content?: {
    downloadableResources: boolean;
    offlineAccess: boolean;
    mobileOptimized: boolean;
    printableMaterials: boolean;
  };
  marketing?: {
    featuredCourse: boolean;
    courseTags: string[];
    difficultyRating: string;
    estimatedDuration: string;
  };
}

export interface DragDropResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  };
}

export interface DroppableProvided {
  innerRef: (element: HTMLElement | null) => void;
  placeholder?: React.ReactNode;
  droppableProps: {
    [key: string]: any;
  };
}

export interface DraggableProvided {
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: {
    [key: string]: any;
  };
  dragHandleProps?: {
    [key: string]: any;
  };
}
