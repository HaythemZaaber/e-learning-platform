import { create } from "zustand";
import {
  Conversation,
  Message,
  SendMessageDto,
  TypingData,
} from "@/types/chatTypes";
import { chatService } from "@/services/chat.service";

interface ChatState {
  // Conversations
  conversations: Conversation[];
  selectedConversationId: string | null;
  conversationsLoading: boolean;
  conversationsError: string | null;

  // Messages
  messages: Record<string, Message[]>; // conversationId -> messages
  messagesLoading: boolean;
  messagesError: string | null;

  // Unread count
  unreadCount: number;

  // Typing indicators
  typingUsers: Record<string, string[]>; // conversationId -> userIds[]

  // Actions
  fetchConversations: (token: string) => Promise<void>;
  fetchMessages: (token: string, conversationId: string) => Promise<void>;
  sendMessage: (
    token: string,
    dto: SendMessageDto,
    currentUserId?: string
  ) => Promise<void>;
  selectConversation: (conversationId: string | null) => void;
  markAsRead: (token: string, conversationId: string) => Promise<void>;
  addMessage: (message: Message, currentUserId?: string) => void;
  updateMessageReadStatus: (conversationId: string, userId: string) => void;
  setTyping: (
    conversationId: string,
    userId: string,
    isTyping: boolean
  ) => void;
  fetchUnreadCount: (token: string) => Promise<void>;
  getOrCreateConversation: (
    token: string,
    userId: string
  ) => Promise<Conversation>;
  reset: () => void;
}

const initialState = {
  conversations: [],
  selectedConversationId: null,
  conversationsLoading: false,
  conversationsError: null,
  messages: {},
  messagesLoading: false,
  messagesError: null,
  unreadCount: 0,
  typingUsers: {},
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,

  fetchConversations: async (token: string) => {
    set({ conversationsLoading: true, conversationsError: null });
    try {
      const response = await chatService.getConversations(token);
      set({
        conversations: response.conversations,
        conversationsLoading: false,
      });
    } catch (error: any) {
      set({
        conversationsError: error.message || "Failed to fetch conversations",
        conversationsLoading: false,
      });
    }
  },

  fetchMessages: async (token: string, conversationId: string) => {
    set({ messagesLoading: true, messagesError: null });
    try {
      const response = await chatService.getMessages(token, conversationId);
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: response.messages,
        },
        messagesLoading: false,
      }));
    } catch (error: any) {
      set({
        messagesError: error.message || "Failed to fetch messages",
        messagesLoading: false,
      });
    }
  },

  sendMessage: async (
    token: string,
    dto: SendMessageDto,
    currentUserId?: string
  ) => {
    try {
      const message = await chatService.sendMessage(token, dto);
      // Message will be added via WebSocket event or we can add it optimistically
      // Pass currentUserId so we don't increment unread count for sender
      get().addMessage(message, currentUserId);
    } catch (error: any) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },

  selectConversation: (conversationId: string | null) => {
    set({ selectedConversationId: conversationId });
  },

  markAsRead: async (token: string, conversationId: string) => {
    try {
      await chatService.markMessagesAsRead(token, conversationId);

      // Update local state
      set((state) => {
        const updatedMessages = { ...state.messages };
        if (updatedMessages[conversationId]) {
          updatedMessages[conversationId] = updatedMessages[conversationId].map(
            (msg) => ({
              ...msg,
              isRead: true,
              readAt: msg.isRead ? msg.readAt : new Date().toISOString(),
            })
          );
        }

        // Update conversation unread count
        const updatedConversations = state.conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        );

        return {
          messages: updatedMessages,
          conversations: updatedConversations,
        };
      });

      // Refresh unread count
      await get().fetchUnreadCount(token);
    } catch (error: any) {
      console.error("Failed to mark messages as read:", error);
    }
  },

  addMessage: (message: Message, currentUserId?: string) => {
    set((state) => {
      const conversationId = message.conversationId;
      const existingMessages = state.messages[conversationId] || [];

      // Check if message already exists (avoid duplicates)
      const messageExists = existingMessages.some(
        (msg) => msg.id === message.id
      );
      if (messageExists) {
        return state;
      }

      // Add message to the conversation
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...existingMessages, message],
      };

      // Update conversation's last message and timestamp
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          // Only increment unread count if:
          // 1. Message is not read AND
          // 2. Current user is the receiver (not the sender)
          const shouldIncrementUnread =
            !message.isRead &&
            currentUserId &&
            message.receiverId === currentUserId;

          return {
            ...conv,
            lastMessage: message,
            lastMessageAt: message.createdAt,
            lastMessagePreview: message.content.substring(0, 100),
            unreadCount: shouldIncrementUnread
              ? (conv.unreadCount || 0) + 1
              : conv.unreadCount || 0,
          };
        }
        return conv;
      });

      // Sort conversations by last message time
      updatedConversations.sort((a, b) => {
        const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return timeB - timeA;
      });

      return {
        messages: updatedMessages,
        conversations: updatedConversations,
      };
    });
  },

  updateMessageReadStatus: (conversationId: string, userId: string) => {
    set((state) => {
      const updatedMessages = { ...state.messages };
      if (updatedMessages[conversationId]) {
        updatedMessages[conversationId] = updatedMessages[conversationId].map(
          (msg) =>
            msg.senderId === userId
              ? { ...msg, isRead: true, readAt: new Date().toISOString() }
              : msg
        );
      }
      return { messages: updatedMessages };
    });
  },

  setTyping: (conversationId: string, userId: string, isTyping: boolean) => {
    set((state) => {
      const typingUsers = { ...state.typingUsers };
      const currentTyping = typingUsers[conversationId] || [];

      if (isTyping) {
        if (!currentTyping.includes(userId)) {
          typingUsers[conversationId] = [...currentTyping, userId];
        }
      } else {
        typingUsers[conversationId] = currentTyping.filter(
          (id) => id !== userId
        );
      }

      return { typingUsers };
    });
  },

  fetchUnreadCount: async (token: string) => {
    try {
      const response = await chatService.getUnreadCount(token);
      set({ unreadCount: response.unreadCount });
    } catch (error: any) {
      console.error("Failed to fetch unread count:", error);
    }
  },

  getOrCreateConversation: async (token: string, userId: string) => {
    try {
      const conversation = await chatService.getOrCreateConversation(
        token,
        userId
      );

      // Add to conversations if not already there
      set((state) => {
        const exists = state.conversations.some(
          (conv) => conv.id === conversation.id
        );
        if (!exists) {
          return {
            conversations: [conversation, ...state.conversations],
          };
        }
        return state;
      });

      return conversation;
    } catch (error: any) {
      console.error("Failed to get or create conversation:", error);
      throw error;
    }
  },

  reset: () => {
    set(initialState);
  },
}));
