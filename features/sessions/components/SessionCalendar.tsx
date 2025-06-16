"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Video,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SessionCalendarProps {
  view?: "calendar" | "upcoming" | "list";
  limit?: number;
  showCreateButton?: boolean;
}

export function SessionCalendar({
  view = "calendar",
  limit = 10,
  showCreateButton = false,
}: SessionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const upcomingSessions = [
    {
      id: "1",
      title: "Advanced JavaScript Workshop",
      type: "group" as const,
      date: "Today",
      time: "2:00 PM - 4:00 PM",
      students: 12,
      status: "scheduled" as const,
    },
    {
      id: "2",
      title: "1-on-1 Mentoring: React Hooks",
      type: "individual" as const,
      date: "Tomorrow",
      time: "10:00 AM - 11:00 AM",
      student: {
        name: "David Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DC",
      },
      status: "scheduled" as const,
    },
    {
      id: "3",
      title: "Code Review Session",
      type: "individual" as const,
      date: "Jun 15, 2025",
      time: "3:00 PM - 4:00 PM",
      student: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
      status: "scheduled" as const,
    },
  ];

  if (view === "upcoming") {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled sessions</CardDescription>
          </div>
          {showCreateButton && (
            <Button size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingSessions.slice(0, limit).map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {session.type === "individual" && session.student ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session.student.avatar || "/placeholder.svg"}
                      alt={session.student.name}
                    />
                    <AvatarFallback>{session.student.initials}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{session.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {session.date} • {session.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{session.type}</Badge>
                <Button size="sm">
                  <Video className="mr-2 h-4 w-4" />
                  Join
                </Button>
              </div>
            </div>
          ))}

          {upcomingSessions.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No upcoming sessions</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Session Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Calendar view coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
