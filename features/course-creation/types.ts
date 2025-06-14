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
  enrollmentType: "free" | "paid" | "invite";
  language: string;
  certificate: boolean;
  seoDescription: string;
  seoTags: string[];
  accessibility: {
    captions: boolean;
    transcripts: boolean;
    audioDescription: boolean;
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
