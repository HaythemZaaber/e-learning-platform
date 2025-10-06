"use client";

import { useEffect, useState, useCallback } from "react";
import { X, MessageCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageThread } from "./MessageThread";
import { useChatStore } from "@/stores/chat.store";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Conversation, Message } from "@/types/chatTypes";
import { useWebSocket } from "@/hooks/useWebSocket";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  recipientImage?: string;
}

export function ChatModal({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  recipientImage,
}: ChatModalProps) {
  const { user, getToken } = useAuth();
  const { socket } = useWebSocket();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    messages,
    getOrCreateConversation,
    fetchMessages,
    sendMessage,
    addMessage,
    markAsRead,
    updateMessageReadStatus,
    setTyping,
    typingUsers,
  } = useChatStore();

  const conversationId = conversation?.id;
  const conversationMessages = conversationId
    ? messages[conversationId] || []
    : [];
  const isTyping = conversationId
    ? (typingUsers[conversationId] || []).includes(recipientId)
    : false;

  // Initialize conversation when modal opens
  useEffect(() => {
    const initConversation = async () => {
      if (isOpen && recipientId && user?.id) {
        setLoading(true);
        try {
          const token = await getToken();
          if (!token) {
            toast.error("Authentication required");
            return;
          }

          const conv = await getOrCreateConversation(token, recipientId);
          setConversation(conv);

          // Fetch messages
          await fetchMessages(token, conv.id);

          // Mark as read
          await markAsRead(token, conv.id);

          // Join conversation room via WebSocket
          if (socket) {
            socket.emit("join_conversation", conv.id);
          }
        } catch (error) {
          console.error("Failed to initialize conversation:", error);
          toast.error("Failed to load conversation");
        } finally {
          setLoading(false);
        }
      }
    };

    initConversation();
  }, [isOpen, recipientId, user?.id]);

  // WebSocket: Listen for new messages
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (data: {
      message: Message;
      conversationId: string;
    }) => {
      if (data.conversationId === conversationId) {
        // Pass current user ID to prevent incrementing unread count for sender
        addMessage(data.message, user?.id);

        // Mark as read if modal is open
        if (isOpen) {
          getToken().then((token) => {
            if (token) markAsRead(token, conversationId);
          });
        }
      }
    };

    const handleTyping = (data: { conversationId: string; userId: string }) => {
      if (data.conversationId === conversationId) {
        setTyping(conversationId, data.userId, true);
      }
    };

    const handleStopTyping = (data: {
      conversationId: string;
      userId: string;
    }) => {
      if (data.conversationId === conversationId) {
        setTyping(conversationId, data.userId, false);
      }
    };

    const handleMessagesRead = (data: {
      conversationId: string;
      readBy: string;
    }) => {
      // Update read status for messages in the conversation
      if (data.conversationId === conversationId) {
        // Update read status for messages from the user who read them
        updateMessageReadStatus(data.conversationId, data.readBy);
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleTyping);
    socket.on("user_stopped_typing", handleStopTyping);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleTyping);
      socket.off("user_stopped_typing", handleStopTyping);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [socket, conversationId, isOpen]);

  // Leave conversation room when modal closes
  useEffect(() => {
    return () => {
      if (socket && conversationId) {
        socket.emit("leave_conversation", conversationId);
      }
    };
  }, [socket, conversationId]);

  const handleSendMessage = async (content: string) => {
    if (!user?.id || !recipientId) return;

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await sendMessage(
        token,
        {
          receiverId: recipientId,
          content,
        },
        user?.id
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleTypingStart = useCallback(() => {
    if (socket && conversationId) {
      socket.emit("typing_start", { conversationId, receiverId: recipientId });
    }
  }, [socket, conversationId, recipientId]);

  const handleTypingStop = useCallback(() => {
    if (socket && conversationId) {
      socket.emit("typing_stop", { conversationId, receiverId: recipientId });
    }
  }, [socket, conversationId, recipientId]);

  // Create mock conversation for display before real one loads
  const displayConversation =
    conversation ||
    ({
      id: "",
      otherUser: {
        id: recipientId,
        firstName: recipientName.split(" ")[0] || recipientName,
        lastName: recipientName.split(" ")[1] || "",
        profileImage: recipientImage,
        email: "",
        role: "",
      },
    } as Conversation);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[650px] p-0 gap-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat with {recipientName}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <MessageThread
              conversation={displayConversation}
              messages={conversationMessages}
              currentUserId={user?.id || ""}
              onSendMessage={handleSendMessage}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              isTyping={isTyping}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
