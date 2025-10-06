import { apiClient } from "@/lib/api-client";
import {
  SendMessageDto,
  GetConversationsResponse,
  GetMessagesResponse,
  UnreadCountResponse,
  Conversation,
  Message,
} from "@/types/chatTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const chatService = {
  /**
   * Send a message to another user
   */
  async sendMessage(token: string, dto: SendMessageDto): Promise<Message> {
    return await apiClient.post<Message>(`/chat/messages`, dto, token);
  },

  /**
   * Get all conversations for the current user
   */
  async getConversations(
    token: string,
    page: number = 1,
    limit: number = 20
  ): Promise<GetConversationsResponse> {
    return await apiClient.get<GetConversationsResponse>(
      `/chat/conversations?page=${page}&limit=${limit}`,
      token
    );
  },

  /**
   * Get messages in a specific conversation
   */
  async getMessages(
    token: string,
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<GetMessagesResponse> {
    return await apiClient.get<GetMessagesResponse>(
      `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
      token
    );
  },

  /**
   * Mark all messages in a conversation as read
   */
  async markMessagesAsRead(
    token: string,
    conversationId: string
  ): Promise<{ success: boolean; markedCount: number }> {
    return await apiClient.post<{ success: boolean; markedCount: number }>(
      `/chat/conversations/${conversationId}/read`,
      {},
      token
    );
  },

  /**
   * Get unread messages count
   */
  async getUnreadCount(token: string): Promise<UnreadCountResponse> {
    return await apiClient.get<UnreadCountResponse>(
      `/chat/unread-count`,
      token
    );
  },

  /**
   * Delete a message
   */
  async deleteMessage(token: string, messageId: string): Promise<Message> {
    return await apiClient.delete<Message>(
      `/chat/messages/${messageId}`,
      token
    );
  },

  /**
   * Get or create conversation with a specific user
   */
  async getOrCreateConversation(
    token: string,
    userId: string
  ): Promise<Conversation> {
    return await apiClient.post<Conversation>(
      `/chat/conversations/with/${userId}`,
      {},
      token
    );
  },
};
