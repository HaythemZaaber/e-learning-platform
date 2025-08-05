// stores/aiAssistant.store.ts
import { create } from "zustand";
import { AIAssistantService, CourseSuggestion, CourseAnalysis } from '../features/course-creation/services/aiAssistantService';

interface AIAssistantState {
  // Service instance
  service: AIAssistantService | null;
  
  // UI State
  isInitialized: boolean;
  isGeneratingSuggestions: boolean;
  isAnalyzing: boolean;
  isChatting: boolean;
  isGeneratingContent: boolean;
  
  // Data
  suggestions: CourseSuggestion[];
  analysis: CourseAnalysis | null;
  chatHistory: ChatMessage[];
  generatedContent: Record<string, any>;
  
  // Error handling
  errors: string[];
  
  // Actions
  initializeService: () => void;
  generateSuggestions: (courseData: any, currentStep: number, contentByLecture: any, specificArea?: 'title' | 'description' | 'structure' | 'content' | 'seo') => Promise<void>;
  chatWithAI: (message: string, context: any) => Promise<void>;
  analyzeCourse: (courseData: any, contentByLecture: any) => Promise<void>;
  generateContent: (type: string, context: any) => Promise<any>;
  applySuggestion: (suggestion: CourseSuggestion, updateData: (data: any) => void) => void;
  clearErrors: () => void;
  resetChat: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: CourseSuggestion[];
}

export const useAIAssistantStore = create<AIAssistantState>()((set, get) => ({
  // Initial state
  service: null,
  isInitialized: false,
  isGeneratingSuggestions: false,
  isAnalyzing: false,
  isChatting: false,
  isGeneratingContent: false,
  suggestions: [],
  analysis: null,
  chatHistory: [
    {
      role: "assistant",
      content: "Hello! I'm your AI course creation assistant. I can help you with suggestions, analyze your course, generate content, and answer any questions about course development.",
      timestamp: new Date(),
    },
  ],
  generatedContent: {},
  errors: [],

  // Initialize service
  initializeService: () => {
    const service = new AIAssistantService(
      process.env.NEXT_PUBLIC_API_URL || '/api',
      'your-api-key'
    );
    set({ service, isInitialized: true });
  },

  // Generate AI suggestions
  generateSuggestions: async (courseData, currentStep, contentByLecture, specificArea) => {
    const { service } = get();
    if (!service) return;

    set({ isGeneratingSuggestions: true, errors: [] });

    try {
      const suggestions = await service.generateSuggestions({
        type: 'suggestion',
        context: {
          courseData,
          currentStep,
          contentByLecture,
          specificArea,
        },
      });

      set({ suggestions, isGeneratingSuggestions: false });
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      set({
        errors: ['Failed to generate AI suggestions. Please try again.'],
        isGeneratingSuggestions: false,
      });
    }
  },

  // Chat with AI
  chatWithAI: async (message, context) => {
    const { service, chatHistory } = get();
    if (!service) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    set({
      chatHistory: [...chatHistory, userMessage],
      isChatting: true,
      errors: [],
    });

    try {
      const response = await service.chatWithAI(message, context);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      set((state) => ({
        chatHistory: [...state.chatHistory, assistantMessage],
        isChatting: false,
      }));
    } catch (error) {
      console.error('Chat failed:', error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date(),
      };

      set((state) => ({
        chatHistory: [...state.chatHistory, errorMessage],
        isChatting: false,
        errors: ['Failed to chat with AI. Please try again.'],
      }));
    }
  },

  // Analyze course
  analyzeCourse: async (courseData, contentByLecture) => {
    const { service } = get();
    if (!service) return;

    set({ isAnalyzing: true, errors: [] });

    try {
      const analysis = await service.analyzeCourse(courseData, contentByLecture);
      set({ analysis, isAnalyzing: false });
    } catch (error) {
      console.error('Analysis failed:', error);
      set({
        errors: ['Failed to analyze course. Please try again.'],
        isAnalyzing: false,
      });
    }
  },

  // Generate content
  generateContent: async (type, context) => {
    const { service } = get();
    if (!service) return null;

    set({ isGeneratingContent: true, errors: [] });

    try {
      const content = await service.generateContent(type, context);
      
      set((state) => ({
        generatedContent: {
          ...state.generatedContent,
          [type]: content,
        },
        isGeneratingContent: false,
      }));

      return content;
    } catch (error) {
      console.error('Content generation failed:', error);
      set({
        errors: ['Failed to generate content. Please try again.'],
        isGeneratingContent: false,
      });
      return null;
    }
  },

  // Apply suggestion
  applySuggestion: (suggestion, updateData) => {
    switch (suggestion.type) {
      case 'title':
        updateData({ title: suggestion.content });
        break;
      case 'description':
        updateData({ description: suggestion.content });
        break;
      case 'structure':
        if (suggestion.metadata?.sections) {
          updateData({ sections: suggestion.metadata.sections });
        }
        break;
      case 'seo':
        if (suggestion.metadata?.tags) {
          updateData({
            settings: {
              seoTags: suggestion.metadata.tags,
              seoDescription: suggestion.metadata.description,
            },
          });
        }
        break;
      case 'pricing':
        if (suggestion.metadata?.price) {
          updateData({ price: suggestion.metadata.price });
        }
        break;
    }

    // Remove applied suggestion
    set((state) => ({
      suggestions: state.suggestions.filter(s => s.id !== suggestion.id),
    }));
  },

  // Utility actions
  clearErrors: () => set({ errors: [] }),
  resetChat: () => set({
    chatHistory: [
      {
        role: "assistant",
        content: "Hello! I'm your AI course creation assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ],
  }),
}));