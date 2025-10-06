"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Clock,
  Check,
  CheckCheck,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Phone,
  Video,
  User,
  Bell,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const mockConversations = [
  {
    id: "1",
    student: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      status: "online",
    },
    lastMessage: "Thank you for the great session today!",
    timestamp: "2 min ago",
    unread: 2,
    isStarred: true,
    isArchived: false,
  },
  {
    id: "2",
    student: {
      name: "Michael Chen",
      avatar: "/avatars/michael.jpg",
      status: "offline",
    },
    lastMessage: "Can you help me with the React assignment?",
    timestamp: "1 hour ago",
    unread: 0,
    isStarred: false,
    isArchived: false,
  },
  {
    id: "3",
    student: {
      name: "Emily Davis",
      avatar: "/avatars/emily.jpg",
      status: "online",
    },
    lastMessage: "I have a question about the project deadline",
    timestamp: "3 hours ago",
    unread: 1,
    isStarred: false,
    isArchived: false,
  },
  {
    id: "4",
    student: {
      name: "David Wilson",
      avatar: "/avatars/david.jpg",
      status: "offline",
    },
    lastMessage: "The course material is excellent!",
    timestamp: "1 day ago",
    unread: 0,
    isStarred: true,
    isArchived: false,
  },
];

const mockMessages = [
  {
    id: "1",
    sender: "student",
    content: "Hi! I have a question about the React hooks lesson.",
    timestamp: "10:30 AM",
    isRead: true,
  },
  {
    id: "2",
    sender: "instructor",
    content:
      "Hello! I'd be happy to help. What specific part of React hooks would you like to discuss?",
    timestamp: "10:32 AM",
    isRead: true,
  },
  {
    id: "3",
    sender: "student",
    content:
      "I'm having trouble understanding the useEffect dependency array. Could you explain it?",
    timestamp: "10:35 AM",
    isRead: true,
  },
  {
    id: "4",
    sender: "instructor",
    content:
      "Absolutely! The dependency array in useEffect tells React when to re-run the effect. If you include a variable in the array, the effect will run whenever that variable changes. If you leave it empty [], the effect only runs once after the initial render.",
    timestamp: "10:37 AM",
    isRead: true,
  },
  {
    id: "5",
    sender: "student",
    content: "That makes sense! Thank you for the explanation.",
    timestamp: "10:40 AM",
    isRead: false,
  },
];

export default function InstructorMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newMessage, setNewMessage] = useState("");

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch =
      conv.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "unread" && conv.unread > 0) ||
      (filterStatus === "starred" && conv.isStarred) ||
      (filterStatus === "archived" && conv.isArchived);

    return matchesSearch && matchesFilter;
  });

  const currentConversation = mockConversations.find(
    (conv) => conv.id === selectedConversation
  );
  const currentMessages = selectedConversation ? mockMessages : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Implement send message
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">
                Communicate with your students
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Conversations
                  </CardTitle>
                  <Badge variant="outline">
                    {filteredConversations.length}
                  </Badge>
                </div>

                {/* Search and Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="starred">Starred</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                        selectedConversation === conversation.id &&
                          "bg-blue-50 border-blue-200"
                      )}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={conversation.student.avatar} />
                            <AvatarFallback>
                              {conversation.student.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                              getStatusColor(conversation.student.status)
                            )}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm truncate">
                              {conversation.student.name}
                            </h3>
                            <div className="flex items-center gap-1">
                              {conversation.isStarred && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                              {conversation.unread > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {conversation.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {conversation.timestamp}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={currentConversation.student.avatar}
                            />
                            <AvatarFallback>
                              {currentConversation.student.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                              getStatusColor(currentConversation.student.status)
                            )}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {currentConversation.student.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {currentConversation.student.status === "online"
                              ? "Online"
                              : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {currentMessages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            "flex",
                            message.sender === "instructor"
                              ? "justify-end"
                              : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                              message.sender === "instructor"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs opacity-70">
                                {message.timestamp}
                              </span>
                              {message.sender === "instructor" && (
                                <div className="flex items-center gap-1">
                                  {message.isRead ? (
                                    <CheckCheck className="w-3 h-3" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSendMessage()
                          }
                          className="pr-10"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2"
                        >
                          <Smile className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
