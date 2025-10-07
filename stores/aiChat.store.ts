import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  AIChatState,
  ChatMessage,
  ChatContext,
  ChatHistoryDto,
  LearningInsightsDto,
  CourseRecommendation,
  CourseRecommendationDto,
  LearningPathDto,
  StudyPlanDto,
  HelpTopic,
} from "@/types/aiChatTypes";
import { AIChatService } from "@/services/aiChat.service";

// Generate unique ID for messages
const generateId = () => Math.random().toString(36).substr(2, 9);

// Create service instance with auth token getter
const createAIChatService = (getAuthToken: () => Promise<string | null>) => {
  return new AIChatService(
    process.env.NEXT_PUBLIC_API_URL || "/api",
    getAuthToken
  );
};

// Default welcome messages based on user role
const getWelcomeMessage = (userRole?: string): ChatMessage => {
  const messages = {
    STUDENT:
      "Hello! I'm your AI learning assistant. I can help you with course selection, learning strategies, study plans, and personalized guidance for your educational journey. What would you like to know?",
    INSTRUCTOR:
      "Hi there! I'm your AI teaching assistant. I can help you with course creation, student engagement strategies, content optimization, and teaching best practices. How can I assist you today?",
    ADMIN:
      "Welcome! I'm your AI platform assistant. I can help you with analytics insights, user management strategies, platform optimization, and administrative tasks. What do you need assistance with?",
    default:
      "Hello! I'm your AI assistant for the EduConnect platform. I can help you navigate the platform, find courses, get learning recommendations, and answer any questions you have. How can I help you today?",
  };

  return {
    id: generateId(),
    role: "assistant",
    content: messages[userRole as keyof typeof messages] || messages.default,
    timestamp: new Date(),
  };
};

export const useAIChatStore = create<AIChatState>()(
  devtools(
    persist(
      (set, get) => {
        // Get auth token function - this will be set by the provider
        let getAuthToken: (() => Promise<string | null>) | null = null;

        // Set auth token getter function
        const setAuthTokenGetter = (
          tokenGetter: () => Promise<string | null>
        ) => {
          getAuthToken = tokenGetter;
        };

        return {
          // Initial state
          isOpen: false,
          isMinimized: false,
          isLoading: false,
          isTyping: false,
          messages: [],
          chatHistory: [],
          currentMessage: "",
          suggestions: [],
          relatedCourses: [],
          learningInsights: null,
          helpTopics: [],
          helpExamples: [],
          error: null,

          // Auth token setter
          setAuthTokenGetter,

          // UI Actions
          openChat: () => {
            const { messages } = get();

            // Initialize with welcome message if no messages exist
            if (messages.length === 0) {
              const welcomeMessage = getWelcomeMessage();
              set({
                isOpen: true,
                isMinimized: false,
                messages: [welcomeMessage],
              });
            } else {
              set({ isOpen: true, isMinimized: false });
            }
          },

          closeChat: () => set({ isOpen: false, isMinimized: false }),

          minimizeChat: () => set({ isMinimized: true }),

          maximizeChat: () => set({ isMinimized: false }),

          // Chat Actions
          sendMessage: async (message: string, context?: ChatContext) => {
            if (!message.trim() || !getAuthToken) return;

            const userMessage: ChatMessage = {
              id: generateId(),
              role: "user",
              content: message.trim(),
              timestamp: new Date(),
            };

            const assistantMessage: ChatMessage = {
              id: generateId(),
              role: "assistant",
              content: "",
              timestamp: new Date(),
              isLoading: true,
            };

            // Add user message immediately
            set((state) => ({
              messages: [...state.messages, userMessage],
              currentMessage: "",
              isTyping: true,
              error: null,
            }));

            // Add loading assistant message
            set((state) => ({
              messages: [...state.messages, assistantMessage],
            }));

            try {
              const service = createAIChatService(getAuthToken);
              const data = await service.chatWithAI(message, context);

              // Update assistant message with response
              set((state) => ({
                messages: state.messages.map((msg) =>
                  msg.id === assistantMessage.id
                    ? {
                        ...msg,
                        content: data.message || data.response || data,
                        isLoading: false,
                        suggestions: data.suggestions || [],
                        relatedCourses: data.relatedCourses || [],
                      }
                    : msg
                ),
                isTyping: false,
                suggestions: data.suggestions || [],
                relatedCourses: data.relatedCourses || [],
              }));
            } catch (error) {
              console.error("Failed to send message:", error);

              // Update assistant message with error
              set((state) => ({
                messages: state.messages.map((msg) =>
                  msg.id === assistantMessage.id
                    ? {
                        ...msg,
                        content:
                          "I apologize, but I'm having trouble processing your request right now. Please try again.",
                        isLoading: false,
                        error: "Failed to send message",
                      }
                    : msg
                ),
                isTyping: false,
                error: "Failed to send message. Please try again.",
              }));
            }
          },

          clearChat: async () => {
            if (!getAuthToken) return;

            try {
              const service = createAIChatService(getAuthToken);
              await service.clearChatHistory();

              const welcomeMessage = getWelcomeMessage();
              set({
                messages: [welcomeMessage],
                suggestions: [],
                relatedCourses: [],
                error: null,
              });
            } catch (error) {
              console.error("Failed to clear chat history:", error);
              set({ error: "Failed to clear chat history" });
            }
          },

          loadChatHistory: async (limit = 20) => {
            if (!getAuthToken) return;

            set({ isLoading: true });

            try {
              const service = createAIChatService(getAuthToken);
              const history: ChatHistoryDto[] = await service.getChatHistory(
                limit
              );

              // Convert history to messages format
              const messages: ChatMessage[] = history.flatMap((item) => [
                {
                  id: `${item.id}-user`,
                  role: "user" as const,
                  content: item.message,
                  timestamp: new Date(item.timestamp),
                },
                {
                  id: `${item.id}-assistant`,
                  role: "assistant" as const,
                  content: item.response,
                  timestamp: new Date(item.timestamp),
                },
              ]);

              set({
                chatHistory: history,
                messages:
                  messages.length > 0 ? messages : [getWelcomeMessage()],
                isLoading: false,
              });
            } catch (error) {
              console.error("Failed to load chat history:", error);
              set({
                isLoading: false,
                error: "Failed to load chat history",
              });
            }
          },

          getLearningInsights: async () => {
            if (!getAuthToken) return;

            set({ isLoading: true });

            try {
              const service = createAIChatService(getAuthToken);
              const insights: LearningInsightsDto =
                await service.getLearningInsights();

              set({
                learningInsights: insights,
                isLoading: false,
              });
            } catch (error) {
              console.error("Failed to get learning insights:", error);
              set({
                isLoading: false,
                error: "Failed to get learning insights",
              });
            }
          },

          getCourseRecommendations: async (dto: CourseRecommendationDto) => {
            if (!getAuthToken) return [];

            set({ isLoading: true });

            try {
              const service = createAIChatService(getAuthToken);
              const recommendations: CourseRecommendation[] =
                await service.getCourseRecommendations(dto);

              set({
                relatedCourses: recommendations,
                isLoading: false,
              });

              return recommendations;
            } catch (error) {
              console.error("Failed to get course recommendations:", error);
              set({
                isLoading: false,
                error: "Failed to get course recommendations",
              });
              return [];
            }
          },

          createLearningPath: async (dto: LearningPathDto) => {
            if (!getAuthToken) return null;

            set({ isLoading: true });

            try {
              const service = createAIChatService(getAuthToken);
              const learningPath = await service.createLearningPath(dto);

              set({
                isLoading: false,
              });

              return learningPath;
            } catch (error) {
              console.error("Failed to create learning path:", error);
              set({
                isLoading: false,
                error: "Failed to create learning path",
              });
              return null;
            }
          },

          createStudyPlan: async (dto: StudyPlanDto) => {
            if (!getAuthToken) return null;

            set({ isLoading: true });

            try {
              const service = createAIChatService(getAuthToken);
              const studyPlan = await service.createStudyPlan(dto);

              set({
                isLoading: false,
              });

              return studyPlan;
            } catch (error) {
              console.error("Failed to create study plan:", error);
              set({
                isLoading: false,
                error: "Failed to create study plan",
              });
              return null;
            }
          },

          loadHelpTopics: async () => {
            if (!getAuthToken) return;

            set({ isLoading: true });

            try {
              const service = createAIChatService(getAuthToken);
              const helpData = await service.getHelpTopics();

              set({
                helpTopics: helpData.topics || [],
                helpExamples: helpData.examples || [],
                isLoading: false,
              });
            } catch (error) {
              console.error("Failed to load help topics:", error);
              set({
                isLoading: false,
                error: "Failed to load help topics",
              });
            }
          },

          setCurrentMessage: (message: string) =>
            set({ currentMessage: message }),

          clearError: () => set({ error: null }),
        };
      },
      {
        name: "ai-chat-store",
        partialize: (state: AIChatState) => ({
          messages: state.messages,
          isOpen: state.isOpen,
          isMinimized: state.isMinimized,
        }),
      }
    ),
    {
      name: "ai-chat-store",
    }
  )
);
