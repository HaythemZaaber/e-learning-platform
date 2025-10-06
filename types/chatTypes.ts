export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  role: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: MessageType;
  attachments?: any[];
  isRead: boolean;
  readAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  id: string;
  participant1Id: string;
  participant1: User;
  participant2Id: string;
  participant2: User;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  isActive: boolean;
  isBlocked: boolean;
  blockedBy?: string;
  createdAt: string;
  updatedAt: string;
  otherUser?: User;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface SendMessageDto {
  receiverId: string;
  content: string;
  messageType?: MessageType;
  attachments?: any[];
}

export interface GetConversationsResponse {
  conversations: Conversation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetMessagesResponse {
  messages: Message[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface TypingData {
  conversationId: string;
  userId: string;
}

export interface MessageReadData {
  conversationId: string;
  readBy: string;
  count: number;
}
