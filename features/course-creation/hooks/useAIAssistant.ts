import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { AIAssistantService, CourseSuggestion, CourseAnalysis, SuggestionType, ContentType } from '../services/aiAssistantService';
import { toast } from 'sonner';

// LocalStorage utility functions
const STORAGE_KEY = 'ai-assistant-data';

interface StoredAIAssistantData {
  suggestions: CourseSuggestion[];
  analysis: CourseAnalysis | null;
  chatHistory: ChatMessage[];
  generatedContent: Record<string, any>;
  selectedSuggestionType: SuggestionType;
  lastUpdated: number;
}

const saveToStorage = (data: StoredAIAssistantData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save AI Assistant data to localStorage:', error);
  }
};

const loadFromStorage = (): StoredAIAssistantData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      if (parsed.chatHistory) {
        parsed.chatHistory = parsed.chatHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to load AI Assistant data from localStorage:', error);
  }
  return null;
};

const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear AI Assistant data from localStorage:', error);
  }
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useAIAssistant() {
  const { getToken } = useAuth();
  
  // Initialize state with stored data or defaults
  const initializeState = () => {
    const stored = loadFromStorage();
    if (stored) {
      return {
        suggestions: stored.suggestions || [],
        analysis: stored.analysis || null,
        chatHistory: stored.chatHistory || [
          {
            role: 'assistant' as const,
            content: "Hello! I'm your AI course creation assistant. I can help you with suggestions, analyze your course, generate content, and answer any questions about course development.",
            timestamp: new Date(),
          },
        ],
        generatedContent: stored.generatedContent || {},
        selectedSuggestionType: stored.selectedSuggestionType || SuggestionType.GENERAL,
      };
    }
    
    return {
      suggestions: [],
      analysis: null,
      chatHistory: [
        {
          role: 'assistant' as const,
          content: "Hello! I'm your AI course creation assistant. I can help you with suggestions, analyze your course, generate content, and answer any questions about course development.",
          timestamp: new Date(),
        },
      ],
      generatedContent: {},
      selectedSuggestionType: SuggestionType.GENERAL,
    };
  };

  const initialState = initializeState();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CourseSuggestion[]>(initialState.suggestions);
  const [analysis, setAnalysis] = useState<CourseAnalysis | null>(initialState.analysis);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(initialState.chatHistory);
  const [generatedContent, setGeneratedContent] = useState<Record<string, any>>(initialState.generatedContent);
  const [selectedSuggestionType, setSelectedSuggestionType] = useState<SuggestionType>(initialState.selectedSuggestionType);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const aiServiceRef = useRef<AIAssistantService | null>(null);

  // Save current state to localStorage
  const saveCurrentState = useCallback(() => {
    const currentState: StoredAIAssistantData = {
      suggestions,
      analysis,
      chatHistory,
      generatedContent,
      selectedSuggestionType,
      lastUpdated: Date.now(),
    };
    saveToStorage(currentState);
  }, [suggestions, analysis, chatHistory, generatedContent, selectedSuggestionType]);

  // Auto-save when state changes
  useEffect(() => {
    saveCurrentState();
  }, [saveCurrentState]);

  // Initialize AI service
  const initializeService = useCallback(() => {
    if (!aiServiceRef.current) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      aiServiceRef.current = new AIAssistantService(baseUrl, async () => {
        return getToken({ template: 'expiration' });
      });
    }
    return aiServiceRef.current;
  }, [getToken]);

  // Generate suggestions
  const generateSuggestions = useCallback(async (
    type: SuggestionType,
    courseData: any,
    currentStep?: number,
    contentByLecture?: any
  ) => {
    const service = initializeService();
    setLoadingStates(prev => ({ ...prev, suggestions: true }));

    try {
      const newSuggestions = await service.generateSuggestions({
        type,
        context: {
          courseData,
          currentStep,
          contentByLecture,
        },
      });

      setSuggestions(newSuggestions);
      toast.success(`Generated ${newSuggestions.length} AI suggestions`);
      return newSuggestions;
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      return [];
    } finally {
      setLoadingStates(prev => ({ ...prev, suggestions: false }));
    }
  }, [initializeService]);

  // Analyze course
  const analyzeCourse = useCallback(async (
    courseData: any,
    contentByLecture: any = {}
  ) => {
    const service = initializeService();
    setLoadingStates(prev => ({ ...prev, analysis: true }));

    try {
      const courseAnalysis = await service.analyzeCourse(courseData, contentByLecture);
      setAnalysis(courseAnalysis);
      toast.success('Course analysis completed!');
      return courseAnalysis;
    } catch (error) {
      console.error('Failed to analyze course:', error);
      return null;
    } finally {
      setLoadingStates(prev => ({ ...prev, analysis: false }));
    }
  }, [initializeService]);

  // Chat with AI
  const sendChatMessage = useCallback(async (
    message: string,
    courseData: any,
    currentStep?: number,
    contentByLecture?: any
  ) => {
    const service = initializeService();

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, userMessage]);
    setLoadingStates(prev => ({ ...prev, chat: true }));

    try {
      const response = await service.chatWithAI(message, {
        courseData,
        currentStep,
        contentByLecture,
        chatHistory: chatHistory.map(m => ({ role: m.role, content: m.content })),
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setChatHistory(prev => [...prev, assistantMessage]);
      return response;
    } catch (error) {
      console.error('Chat failed:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, errorMessage]);
      return null;
    } finally {
      setLoadingStates(prev => ({ ...prev, chat: false }));
    }
  }, [initializeService, chatHistory]);

  // Generate content
  const generateContent = useCallback(async (
    type: ContentType,
    courseData: any,
    currentStep?: number,
    contentByLecture?: any
  ) => {
    const service = initializeService();
    setLoadingStates(prev => ({ ...prev, [type]: true }));

    try {
      const content = await service.generateContent(type, {
        courseData,
        currentStep,
        contentByLecture,
      });

      setGeneratedContent(prev => ({
        ...prev,
        [type]: content,
      }));

      toast.success(`${type.replace(/_/g, ' ')} generated successfully!`);
      return content;
    } catch (error) {
      console.error(`Failed to generate ${type}:`, error);
      return null;
    } finally {
      setLoadingStates(prev => ({ ...prev, [type]: false }));
    }
  }, [initializeService]);

  // Remove suggestion
  const removeSuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  // Clear chat history
  const clearChatHistory = useCallback(() => {
    setChatHistory([
      {
        role: 'assistant',
        content: "Hello! I'm your AI course creation assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Change suggestion type
  const changeSuggestionType = useCallback((type: SuggestionType) => {
    setSelectedSuggestionType(type);
  }, []);

  // Clear stored data
  const clearStoredData = useCallback(() => {
    clearStorage();
    toast.success('AI Assistant data cleared successfully!');
  }, []);

  // Reset all state
  const resetAIState = useCallback(() => {
    setSuggestions([]);
    setAnalysis(null);
    setGeneratedContent({});
    clearChatHistory();
    clearStorage();
  }, [clearChatHistory]);

  return {
    // State
    suggestions,
    analysis,
    chatHistory,
    generatedContent,
    selectedSuggestionType,
    loadingStates,
    isLoading: Object.values(loadingStates).some(Boolean),

    // Actions
    generateSuggestions,
    analyzeCourse,
    sendChatMessage,
    generateContent,
    removeSuggestion,
    clearChatHistory,
    resetAIState,
    clearStoredData,
    changeSuggestionType,
  };
}