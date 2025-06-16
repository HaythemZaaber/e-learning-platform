"use client";

import { MessageSquare } from "lucide-react";
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

interface RecentMessagesProps {
  limit?: number;
}

export function RecentMessages({ limit = 5 }: RecentMessagesProps) {
  const messages = [
    {
      id: "1",
      student: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      lastMessage:
        "I'm having trouble with the React assignment. Can you help?",
      time: "10:25 AM",
      unread: true,
      course: "React Fundamentals",
    },
    {
      id: "2",
      student: {
        name: "Maria Garcia",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MG",
      },
      lastMessage: "Thank you for the feedback on my project!",
      time: "Yesterday",
      unread: false,
      course: "JavaScript Masterclass",
    },
    {
      id: "3",
      student: {
        name: "Thomas Lee",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "TL",
      },
      lastMessage: "When will the next module be available?",
      time: "Yesterday",
      unread: false,
      course: "Web Development Bootcamp",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Messages
          </CardTitle>
          <CardDescription>Latest messages from your students</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.slice(0, limit).map((message) => (
          <div
            key={message.id}
            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={message.student.avatar || "/placeholder.svg"}
                alt={message.student.name}
              />
              <AvatarFallback>{message.student.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{message.student.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {message.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {message.lastMessage}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {message.course}
                </Badge>
                {message.unread && (
                  <Badge className="h-2 w-2 rounded-full p-0" />
                )}
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent messages</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
