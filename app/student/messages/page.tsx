"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { ConversationList } from "@/components/chat/ConversationList";
import { MessageThread } from "@/components/chat/MessageThread";
import { useChatStore } from "@/stores/chat.store";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";
import { Message } from "@/types/chatTypes";

export default function StudentMessagesPage() {
  const { user, getToken } = useAuth();
  const { socket } = useWebSocket();
  const [initializing, setInitializing] = useState(true);

  const {
    conversations,
    selectedConversationId,
    messages,
    conversationsLoading,
    fetchConversations,
    fetchMessages,
    selectConversation,
    sendMessage,
    addMessage,
    markAsRead,
    updateMessageReadStatus,
    setTyping,
    typingUsers,
  } = useChatStore();

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );
  const conversationMessages = selectedConversationId
    ? messages[selectedConversationId] || []
    : [];
  const isTyping = selectedConversationId
    ? (typingUsers[selectedConversationId] || []).some(
        (userId) => userId !== user?.id
      )
    : false;

  // Initialize: Fetch conversations
  useEffect(() => {
    const init = async () => {
      if (user?.id) {
        try {
          const token = await getToken();
          if (token) {
            await fetchConversations(token);
          }
        } catch (error) {
          console.error("Failed to fetch conversations:", error);
          toast.error("Failed to load conversations");
        } finally {
          setInitializing(false);
        }
      }
    };

    init();
  }, [user?.id]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversationId && user?.id) {
        try {
          const token = await getToken();
          if (token) {
            await fetchMessages(token, selectedConversationId);
            await markAsRead(token, selectedConversationId);

            // Join conversation room
            if (socket) {
              socket.emit("join_conversation", selectedConversationId);
            }
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          toast.error("Failed to load messages");
        }
      }
    };

    loadMessages();

    // Leave previous conversation room when switching
    return () => {
      if (socket && selectedConversationId) {
        socket.emit("leave_conversation", selectedConversationId);
      }
    };
  }, [selectedConversationId, user?.id]);

  // WebSocket: Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: {
      message: Message;
      conversationId: string;
    }) => {
      // Pass current user ID to prevent incrementing unread count for sender
      addMessage(data.message, user?.id);

      // Mark as read if conversation is currently open
      if (data.conversationId === selectedConversationId) {
        getToken().then((token) => {
          if (token) markAsRead(token, data.conversationId);
        });
      } else {
        // Show toast notification for messages in other conversations
        toast.info("New message received", {
          description: data.message.content.substring(0, 50) + "...",
        });
      }
    };

    const handleTyping = (data: { conversationId: string; userId: string }) => {
      setTyping(data.conversationId, data.userId, true);
    };

    const handleStopTyping = (data: {
      conversationId: string;
      userId: string;
    }) => {
      setTyping(data.conversationId, data.userId, false);
    };

    const handleMessagesRead = (data: {
      conversationId: string;
      readBy: string;
    }) => {
      // Update read status for messages in the conversation
      if (data.conversationId === selectedConversationId) {
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
  }, [socket, selectedConversationId]);

  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user?.id) return;

    const receiverId =
      selectedConversation.participant1Id === user.id
        ? selectedConversation.participant2Id
        : selectedConversation.participant1Id;

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await sendMessage(
        token,
        {
          receiverId,
          content,
        },
        user.id
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleTypingStart = () => {
    if (socket && selectedConversationId && selectedConversation) {
      const receiverId =
        selectedConversation.participant1Id === user?.id
          ? selectedConversation.participant2Id
          : selectedConversation.participant1Id;

      socket.emit("typing_start", {
        conversationId: selectedConversationId,
        receiverId,
      });
    }
  };

  const handleTypingStop = () => {
    if (socket && selectedConversationId && selectedConversation) {
      const receiverId =
        selectedConversation.participant1Id === user?.id
          ? selectedConversation.participant2Id
          : selectedConversation.participant1Id;

      socket.emit("typing_stop", {
        conversationId: selectedConversationId,
        receiverId,
      });
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className=" pb-0 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">Chat with your instructors</p>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-80px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            {conversationsLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
                currentUserId={user?.id || ""}
              />
            )}
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <MessageThread
                conversation={selectedConversation}
                messages={conversationMessages}
                currentUserId={user?.id || ""}
                onSendMessage={handleSendMessage}
                onTypingStart={handleTypingStart}
                onTypingStop={handleTypingStop}
                isTyping={isTyping}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-lg border">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
