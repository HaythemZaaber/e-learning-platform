import {
  CourseRecommendationDto,
  LearningPathDto,
  StudyPlanDto,
  ChatHistoryDto,
  LearningInsightsDto,
  HelpResponse,
  ChatContext,
} from "@/types/aiChatTypes";

export class AIChatService {
  private baseUrl: string;
  private getAuthToken: () => Promise<string | null>;

  constructor(
    baseUrl: string = "/api",
    getAuthToken: () => Promise<string | null>
  ) {
    this.baseUrl = baseUrl;
    this.getAuthToken = getAuthToken;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  async chatWithAI(message: string, context?: ChatContext): Promise<any> {
    const dto = {
      message,
      context,
    };

    return this.makeRequest<any>("/ai-chat/chat", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  async getCourseRecommendations(dto: CourseRecommendationDto): Promise<any[]> {
    return this.makeRequest<any[]>("/ai-chat/recommendations", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  async createLearningPath(dto: LearningPathDto): Promise<any> {
    return this.makeRequest<any>("/ai-chat/learning-path", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  async createStudyPlan(dto: StudyPlanDto): Promise<any> {
    return this.makeRequest<any>("/ai-chat/study-plan", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  async getChatHistory(limit: number = 20): Promise<ChatHistoryDto[]> {
    return this.makeRequest<ChatHistoryDto[]>(
      `/ai-chat/history?limit=${limit}`
    );
  }

  async clearChatHistory(): Promise<void> {
    return this.makeRequest<void>("/ai-chat/history", {
      method: "DELETE",
    });
  }

  async getLearningInsights(): Promise<LearningInsightsDto> {
    return this.makeRequest<LearningInsightsDto>("/ai-chat/insights");
  }

  async getHelpTopics(): Promise<HelpResponse> {
    return this.makeRequest<HelpResponse>("/ai-chat/help");
  }

  // Utility method to check if AI chat is available
  async checkAvailability(): Promise<boolean> {
    try {
      await this.makeRequest("/ai-chat/help");
      return true;
    } catch (error) {
      console.error("AI chat service unavailable:", error);
      return false;
    }
  }

  // Method to get suggested questions based on user context
  async getSuggestedQuestions(context?: any): Promise<string[]> {
    // This could be expanded to use AI to generate contextual questions
    const defaultQuestions = [
      "What courses do you recommend for beginners?",
      "How can I improve my learning efficiency?",
      "What's the best way to track my progress?",
      "Can you help me create a study schedule?",
      "What skills should I focus on developing?",
    ];

    if (context?.currentPage === "courses") {
      return [
        "What courses match my skill level?",
        "How do I choose the right course?",
        "What are the most popular courses?",
        "Can you recommend courses based on my interests?",
      ];
    }

    if (context?.courseId) {
      return [
        "How can I succeed in this course?",
        "What study strategies work best?",
        "How much time should I dedicate to this course?",
        "What are the key concepts I should focus on?",
      ];
    }

    return defaultQuestions;
  }
}
