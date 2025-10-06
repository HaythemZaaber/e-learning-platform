"use client";

import { useState } from "react";
import { Search, MessageSquare, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/chatTypes";
import { formatDistanceToNow } from "date-fns";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = conv.otherUser;
    const fullName =
      `${otherUser?.firstName} ${otherUser?.lastName}`.toLowerCase();
    const lastMessage = conv.lastMessagePreview?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || lastMessage.includes(search);
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Messages
          </CardTitle>
          <Badge variant="outline">{conversations.length}</Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                {searchTerm ? "No conversations found" : "No messages yet"}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherUser = conversation.otherUser;
              const isSelected = selectedConversationId === conversation.id;
              const unreadCount = conversation.unreadCount || 0;

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                    isSelected && "bg-blue-50 border-blue-200"
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={otherUser?.profileImage} />
                      <AvatarFallback>
                        {otherUser?.firstName?.[0]}
                        {otherUser?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {otherUser?.firstName} {otherUser?.lastName}
                        </h3>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs ml-2">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>

                      <p
                        className={cn(
                          "text-sm truncate",
                          unreadCount > 0
                            ? "text-gray-900 font-medium"
                            : "text-gray-600"
                        )}
                      >
                        {conversation.lastMessagePreview || "No messages yet"}
                      </p>

                      {conversation.lastMessageAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(
                            new Date(conversation.lastMessageAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
