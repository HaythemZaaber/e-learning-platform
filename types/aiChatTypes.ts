export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  relatedCourses?: CourseRecommendation[];
  isLoading?: boolean;
  error?: string;
}

export interface CourseRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  avgRating: number;
  thumbnail?: string;
  estimatedHours?: number;
}

export interface ChatResponse {
  message: string;
  suggestions: string[];
  relatedCourses: CourseRecommendation[];
  timestamp: Date;
}

export interface ChatContext {
  currentPage?: string;
  courseId?: string;
  sessionId?: string;
  previousMessages?: Array<{ role: string; content: string }>;
}

export interface CourseRecommendationDto {
  interests: string[];
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  timeCommitment: number; // hours per week
  budget: number; // maximum price willing to pay
}

export interface LearningPathDto {
  goal: string; // What they want to achieve
  currentSkills: string[];
  timeFrame: string; // e.g., "3 months", "6 months", "1 year"
  interests: string[];
}

export interface StudyPlanDto {
  courseId: string;
  studyHours: number; // hours per week
  studyDays: string[]; // e.g., ["Monday", "Wednesday", "Friday"]
  deadline: string; // target completion date
}

export interface ChatHistoryDto {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
}

export interface LearningInsightsDto {
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  nextSteps: string[];
  motivation: string;
}

export interface HelpTopic {
  category: string;
  questions: string[];
}

export interface HelpResponse {
  topics: HelpTopic[];
  examples: string[];
}

export interface AIChatState {
  // UI State
  isOpen: boolean;
  isMinimized: boolean;
  isLoading: boolean;
  isTyping: boolean;

  // Chat Data
  messages: ChatMessage[];
  chatHistory: ChatHistoryDto[];
  currentMessage: string;

  // Features
  suggestions: string[];
  relatedCourses: CourseRecommendation[];
  learningInsights: LearningInsightsDto | null;
  helpTopics: HelpTopic[];
  helpExamples: string[];

  // Error handling
  error: string | null;

  // Actions
  openChat: () => void;
  closeChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  sendMessage: (message: string, context?: ChatContext) => Promise<void>;
  clearChat: () => Promise<void>;
  loadChatHistory: (limit?: number) => Promise<void>;
  getLearningInsights: () => Promise<void>;
  getCourseRecommendations: (
    dto: CourseRecommendationDto
  ) => Promise<CourseRecommendation[]>;
  createLearningPath: (dto: LearningPathDto) => Promise<any>;
  createStudyPlan: (dto: StudyPlanDto) => Promise<any>;
  loadHelpTopics: () => Promise<void>;
  setCurrentMessage: (message: string) => void;
  clearError: () => void;
  setAuthTokenGetter: (tokenGetter: () => Promise<string | null>) => void;
}

export interface TypingIndicator {
  isTyping: boolean;
  message?: string;
}
