// services/aiAssistantService.ts
import { CourseData, CourseSection as Section, CourseLecture as Lecture } from '@/types/courseTypes';

export interface AIAssistantRequest {
  type: 'suggestion' | 'chat' | 'analysis' | 'content_generation';
  context: {
    courseData: CourseData;
    currentStep: number;
    contentByLecture: any;
    userQuery?: string;
    specificArea?: 'title' | 'description' | 'structure' | 'content' | 'seo';
  };
}

export interface AIAssistantResponse {
  type: 'suggestion' | 'chat_response' | 'analysis' | 'content';
  data: {
    suggestions?: CourseSuggestion[];
    message?: string;
    analysis?: CourseAnalysis;
    generatedContent?: any;
  };
  confidence: number;
  reasoning?: string;
}

export interface CourseSuggestion {
  id: string;
  type: 'title' | 'description' | 'structure' | 'content' | 'seo' | 'pricing';
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
    pricingRecommendation?: number;
  };
  seo: {
    score: number;
    keywords: string[];
    optimizations: string[];
  };
}

export class AIAssistantService {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async generateSuggestions(request: AIAssistantRequest): Promise<CourseSuggestion[]> {
    try {
      const response = await fetch(`${this.apiUrl}/ai/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.suggestions || [];
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
      return this.getFallbackSuggestions(request);
    }
  }

  async chatWithAI(message: string, context: AIAssistantRequest['context']): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          message,
          context,
          conversationId: this.generateConversationId(),
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.message || 'I apologize, but I couldn\'t process your request at the moment.';
    } catch (error) {
      console.error('Failed to chat with AI:', error);
      return this.getFallbackChatResponse(message, context);
    }
  }

  async analyzeCourse(courseData: CourseData, contentByLecture: any): Promise<CourseAnalysis> {
    try {
      const response = await fetch(`${this.apiUrl}/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          courseData,
          contentByLecture,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.analysis;
    } catch (error) {
      console.error('Failed to analyze course:', error);
      return this.getFallbackAnalysis(courseData, contentByLecture);
    }
  }

  async generateContent(type: string, context: any): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          type,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.content;
    } catch (error) {
      console.error('Failed to generate content:', error);
      return this.getFallbackContent(type, context);
    }
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getFallbackSuggestions(request: AIAssistantRequest): CourseSuggestion[] {
    const { courseData, specificArea } = request.context;
    
    const suggestions: CourseSuggestion[] = [];

    // Title suggestions
    if (!specificArea || specificArea === 'title') {
      if (!courseData.title || courseData.title.length < 10) {
        suggestions.push({
          id: 'title_1',
          type: 'title',
          title: 'Course Title Enhancement',
          content: `Complete Guide to ${courseData.category || 'Your Subject'}: From Beginner to Expert`,
          reasoning: 'Clear, descriptive titles with skill progression tend to perform better',
          confidence: 0.8,
          actionable: true,
        });
      }
    }

    // Description suggestions
    if (!specificArea || specificArea === 'description') {
      if (!courseData.description || courseData.description.length < 100) {
        suggestions.push({
          id: 'desc_1',
          type: 'description',
          title: 'Enhanced Course Description',
          content: `Master ${courseData.title || 'essential skills'} with this comprehensive, hands-on course. Perfect for ${courseData.level}s looking to advance their expertise through practical projects and real-world applications. You'll gain in-demand skills that employers value most.`,
          reasoning: 'Descriptions should highlight benefits, target audience, and practical outcomes',
          confidence: 0.85,
          actionable: true,
        });
      }
    }

    return suggestions;
  }

  private getFallbackChatResponse(message: string, context: AIAssistantRequest['context']): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('title')) {
      return `For your course title, consider including the target skill level (${context.courseData.level}) and main benefit. A good formula is: "Action Word + Subject + Outcome + Level". For example: "Master [Your Subject]: Complete ${context.courseData.level} Course with Real Projects"`;
    }
    
    if (lowerMessage.includes('description')) {
      return `Your course description should answer: What will students learn? Who is this for? What makes it unique? How will it help their career? Include specific outcomes and mention any hands-on projects or real-world applications.`;
    }
    
    if (lowerMessage.includes('structure')) {
      return `A well-structured course typically has: 1) Welcome & Introduction (10%), 2) Foundation/Basics (20-30%), 3) Core Concepts (40-50%), 4) Advanced Topics (20%), and 5) Conclusion & Next Steps (10%). Each section should build logically on the previous one.`;
    }
    
    return `I'm here to help with your course creation! You can ask me about course titles, descriptions, structure, content organization, or any other aspect of course development. What specific area would you like assistance with?`;
  }

  private getFallbackAnalysis(courseData: CourseData, contentByLecture: any): CourseAnalysis {
    const totalSections = courseData.sections?.length || 0;
    const totalLectures = courseData.sections?.reduce((sum, section) => 
      sum + (section.lectures?.length || 0), 0) || 0;
    const totalContent = Object.values(contentByLecture).reduce((total: number, lectureContent: any) => {
      return total + Object.values(lectureContent).reduce((lectureTotal: number, contentArray: any) => {
        return lectureTotal + (Array.isArray(contentArray) ? contentArray.length : 0);
      }, 0);
    }, 0);

    return {
      completeness: {
        score: Math.min((totalSections * 20 + totalLectures * 10 + totalContent * 5), 100),
        missingElements: [
          ...(totalSections === 0 ? ['Course sections'] : []),
          ...(totalLectures === 0 ? ['Lecture content'] : []),
          ...(!courseData.thumbnail ? ['Course thumbnail'] : []),
        ],
        recommendations: [
          'Add more detailed course objectives',
          'Include practical exercises',
          'Consider adding downloadable resources',
        ],
      },
      quality: {
        score: 75,
        strengths: [
          ...(courseData.title ? ['Clear course title'] : []),
          ...(courseData.description ? ['Course description provided'] : []),
        ],
        improvements: [
          'Expand course description with specific outcomes',
          'Add more interactive elements',
          'Include progress assessments',
        ],
      },
      marketability: {
        score: 65,
        competitiveness: 'Moderate competition in this category',
        targetAudience: [`${courseData.level} learners`, 'Career changers', 'Skill upgraders'],
        pricingRecommendation: courseData.level === 'beginner' ? 49 : 
                             courseData.level === 'intermediate' ? 79 : 129,
      },
      seo: {
        score: 60,
        keywords: [courseData.category, courseData.level, 'course', 'training'].filter(Boolean),
        optimizations: [
          'Include target keywords in title',
          'Add relevant tags',
          'Optimize description for search',
        ],
      },
    };
  }

  private getFallbackContent(type: string, context: any): any {
    switch (type) {
      case 'lecture_outline':
        return {
          title: context.title || 'New Lecture',
          outline: [
            'Introduction and objectives (5 min)',
            'Main concept explanation (15 min)',
            'Practical demonstration (10 min)',
            'Student exercise (15 min)',
            'Q&A and wrap-up (5 min)',
          ],
        };
      case 'assessment_questions':
        return [
          'What is the main concept covered in this lecture?',
          'How would you apply this in a real-world scenario?',
          'What are the key benefits of this approach?',
        ];
      default:
        return null;
    }
  }
} 