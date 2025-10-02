import { toast } from 'sonner';

export enum SuggestionType {
  GENERAL = 'general',
  TITLE = 'title',
  DESCRIPTION = 'description',
  STRUCTURE = 'structure',
  SEO = 'seo',
  PRICING = 'pricing',
  CONTENT = 'content',
}

export enum ContentType {
  LECTURE_OUTLINE = 'lecture_outline',
  ASSESSMENT_QUESTIONS = 'assessment_questions',
  SEO_CONTENT = 'seo_content',
  MARKETING_COPY = 'marketing_copy',
  TITLE_SUGGESTIONS = 'title_suggestions',
  DESCRIPTION_IMPROVEMENT = 'description_improvement',
  LEARNING_OBJECTIVES = 'learning_objectives',
  TARGET_AUDIENCE = 'target_audience',
}

export interface CourseSuggestion {
  id: string;
  type: string;
  title: string;
  content: string;
  reasoning: string;
  confidence: number;
  actionable: boolean;
  metadata?: any;
}

export interface CourseAnalysis {
  completeness: {
    score: number;
    missingElements: string[];
    recommendations: string[];
  };
  quality: {
    score: number;
    strengths: string[];
    improvements: string[];
  };
  marketability: {
    score: number;
    competitiveness: string;
    targetAudience: string[];
    pricingRecommendation: string;
  };
  seo: {
    score: number;
    keywords: string[];
    optimizations: string[];
  };
}

export class AIAssistantService {
  private baseUrl: string;
  private getToken: () => Promise<string | null>;

  constructor(baseUrl: string, getToken: () => Promise<string | null>) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
  }

  private async request<T>(endpoint: string, data: any): Promise<T> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.baseUrl}/ai-assistant/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || 'AI service error');
      }

      return response.json();
    } catch (error: any) {
      console.error(`AI Assistant ${endpoint} error:`, error);
      toast.error(error.message || `Failed to ${endpoint}`);
      throw error;
    }
  }

  async generateSuggestions(data: {
    type: SuggestionType;
    context: {
      courseData: any;
      currentStep?: number;
      contentByLecture?: any;
    };
  }): Promise<CourseSuggestion[]> {
    return this.request<CourseSuggestion[]>('suggestions', data);
  }

  async analyzeCourse(courseData: any, contentByLecture: any = {}): Promise<CourseAnalysis> {
    return this.request<CourseAnalysis>('analyze', {
      courseData,
      contentByLecture,
    });
  }

  async chatWithAI(message: string, context: {
    courseData: any;
    currentStep?: number;
    contentByLecture?: any;
    chatHistory?: Array<{ role: string; content: string }>;
  }): Promise<string> {
    const result = await this.request<{ response: string }>('chat', {
      message,
      context,
    });
    return result.response;
  }

  async generateContent(type: ContentType, context: {
    courseData: any;
    currentStep?: number;
    contentByLecture?: any;
  }): Promise<{ type: string; content: string }> {
    return this.request<{ type: string; content: string }>('generate', {
      type,
      context,
    });
  }
}