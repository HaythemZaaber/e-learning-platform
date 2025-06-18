"use client";

import {
  MessageSquare,
  Reply,
  MoreHorizontal,
  Clock,
  BookOpen,
  Star,
  Archive,
  Trash2,
  Circle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Student {
  name: string;
  avatar?: string;
  initials: string;
}

interface Message {
  id: string;
  student: Student;
  lastMessage: string;
  time: string;
  timeAgo: string;
  unread: boolean;
  course: string;
  priority: "high" | "normal" | "low";
  messageType: "question" | "feedback" | "assignment" | "general";
  responseTime?: string;
}

interface RecentMessagesProps {
  limit?: number;
  showViewAll?: boolean;
}

export function RecentMessages({
  limit = 5,
  showViewAll = true,
}: RecentMessagesProps) {
  const messages: Message[] = [
    {
      id: "1",
      student: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      lastMessage:
        "I'm having trouble with the React hooks assignment. The useEffect isn't working as expected...",
      time: "10:25 AM",
      timeAgo: "2 hours ago",
      unread: true,
      course: "React Fundamentals",
      priority: "high",
      messageType: "question",
      responseTime: "Usually replies within 1 hour",
    },
    {
      id: "2",
      student: {
        name: "Maria Garcia",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MG",
      },
      lastMessage:
        "Thank you for the detailed feedback on my project! I'll implement the changes you suggested.",
      time: "Yesterday",
      timeAgo: "1 day ago",
      unread: true,
      course: "JavaScript Masterclass",
      priority: "normal",
      messageType: "feedback",
    },
    {
      id: "3",
      student: {
        name: "Thomas Lee",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "TL",
      },
      lastMessage:
        "When will the next module be available? I'm eager to continue with the advanced topics.",
      time: "Yesterday",
      timeAgo: "1 day ago",
      unread: false,
      course: "Web Development Bootcamp",
      priority: "normal",
      messageType: "general",
    },
    {
      id: "4",
      student: {
        name: "Sarah Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SK",
      },
      lastMessage:
        "I've submitted my final project. Could you please review it when you have time?",
      time: "2 days ago",
      timeAgo: "2 days ago",
      unread: false,
      course: "Full Stack Development",
      priority: "normal",
      messageType: "assignment",
    },
    {
      id: "5",
      student: {
        name: "David Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DC",
      },
      lastMessage:
        "The API integration tutorial was very helpful. Looking forward to the database section!",
      time: "3 days ago",
      timeAgo: "3 days ago",
      unread: false,
      course: "Backend Development",
      priority: "low",
      messageType: "feedback",
    },
  ];

  const getPriorityColor = (priority: Message["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMessageTypeIcon = (type: Message["messageType"]) => {
    switch (type) {
      case "question":
        return "❓";
      case "feedback":
        return "💬";
      case "assignment":
        return "📝";
      case "general":
        return "💭";
      default:
        return "💬";
    }
  };

  const getMessageTypeColor = (type: Message["messageType"]) => {
    switch (type) {
      case "question":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "feedback":
        return "bg-green-100 text-green-800 border-green-200";
      case "assignment":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "general":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Recent Messages
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Latest messages from your students
            </CardDescription>
          </div>
          {showViewAll && (
            <Button variant="outline" size="sm" className="hover:bg-gray-100">
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.slice(0, limit).map((message) => (
            <div
              key={message.id}
              className={`group relative flex items-start gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                message.unread
                  ? "bg-blue-50/50 border-blue-200 hover:bg-blue-50"
                  : "hover:border-gray-300"
              }`}
            >
              {/* Avatar with status indicator */}
              <div className="flex-shrink-0 relative">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                  <AvatarImage
                    src={message.student.avatar || "/placeholder.svg"}
                    alt={message.student.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {message.student.initials}
                  </AvatarFallback>
                </Avatar>
                {message.unread && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Circle className="h-2 w-2 text-white fill-current" />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h6
                      className={`font-semibold text-gray-900 ${
                        message.unread ? "text-blue-900" : ""
                      }`}
                    >
                      {message.student.name}
                    </h6>
                    <Badge
                      variant="outline"
                      className={`${getMessageTypeColor(
                        message.messageType
                      )} text-xs px-2 py-1`}
                    >
                      <span className="mr-1">
                        {getMessageTypeIcon(message.messageType)}
                      </span>
                      {message.messageType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">
                      {message.time}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p
                  className={`text-sm mb-3 line-clamp-2 ${
                    message.unread
                      ? "text-gray-900 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {message.lastMessage}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <BookOpen className="h-3 w-3" />
                      <span>{message.course}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{message.timeAgo}</span>
                    </div>
                    {message.priority === "high" && (
                      <Badge
                        className={`${getPriorityColor(
                          message.priority
                        )} text-xs px-2 py-1`}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="px-2 py-1 text-xs hover:bg-gray-100"
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {message.responseTime && message.unread && (
                  <div className="mt-2 text-xs text-gray-500 bg-gray-100 rounded-md px-2 py-1">
                    💡 {message.responseTime}
                  </div>
                )}
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recent messages
              </h3>
              <p className="text-gray-500 mb-4">
                Your students haven't sent any messages yet
              </p>
              <Button variant="outline" className="hover:bg-gray-50">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send a Message
              </Button>
            </div>
          )}

          {messages.length > limit && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Showing {limit} of {messages.length} messages
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-gray-50"
                >
                  View All Messages
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
