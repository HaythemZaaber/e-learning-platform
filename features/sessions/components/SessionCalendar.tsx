"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Video,
  MapPin,
  BookOpen,
  User,
  MoreHorizontal,
  Play,
  AlertCircle,
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

interface Student {
  name: string;
  avatar?: string;
  initials: string;
}

interface Session {
  id: string;
  title: string;
  type: "group" | "individual";
  date: string;
  time: string;
  duration: string;
  students?: number;
  student?: Student;
  status: "scheduled" | "starting-soon" | "in-progress" | "completed";
  course?: string;
  location?: "online" | "in-person";
  meetingLink?: string;
}

interface SessionCalendarProps {
  view?: "calendar" | "upcoming" | "list";
  limit?: number;
  showCreateButton?: boolean;
}

export function SessionCalendar({
  view = "calendar",
  limit = 5,
  showCreateButton = false,
}: SessionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const upcomingSessions: Session[] = [
    {
      id: "1",
      title: "Advanced JavaScript Concepts",
      type: "group",
      date: "Today",
      time: "2:00 PM",
      duration: "2h",
      students: 12,
      status: "starting-soon",
      course: "Full Stack Development",
      location: "online",
      meetingLink: "#",
    },
    {
      id: "2",
      title: "React Hooks Deep Dive",
      type: "individual",
      date: "Today",
      time: "4:30 PM",
      duration: "1h",
      student: {
        name: "David Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DC",
      },
      status: "scheduled",
      course: "React Mastery",
      location: "online",
      meetingLink: "#",
    },
    {
      id: "3",
      title: "Database Design Workshop",
      type: "group",
      date: "Tomorrow",
      time: "10:00 AM",
      duration: "3h",
      students: 8,
      status: "scheduled",
      course: "Backend Development",
      location: "online",
      meetingLink: "#",
    },
    {
      id: "4",
      title: "Code Review Session",
      type: "individual",
      date: "Jun 19",
      time: "3:00 PM",
      duration: "45m",
      student: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
      status: "scheduled",
      course: "Web Development",
      location: "online",
      meetingLink: "#",
    },
    {
      id: "5",
      title: "API Development Masterclass",
      type: "group",
      date: "Jun 20",
      time: "1:00 PM",
      duration: "2.5h",
      students: 15,
      status: "scheduled",
      course: "Backend Development",
      location: "online",
      meetingLink: "#",
    },
  ];

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "starting-soon":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "in-progress":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: Session["status"]) => {
    switch (status) {
      case "starting-soon":
        return <AlertCircle className="h-3 w-3" />;
      case "in-progress":
        return <Play className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  if (view === "upcoming") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Upcoming Sessions
            </CardTitle>
            {showCreateButton && (
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
            )}
          </div>
          <CardDescription>
            {upcomingSessions.length} sessions scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingSessions.slice(0, limit).map((session) => (
              <div
                key={session.id}
                className="group relative flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-gray-300"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Session Avatar/Icon */}
                  <div className="flex-shrink-0">
                    {session.type === "individual" && session.student ? (
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                          <AvatarImage
                            src={session.student.avatar || "/placeholder.svg"}
                            alt={session.student.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                            {session.student.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-2.5 w-2.5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-xs font-bold text-green-600">
                            {session.students}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Session Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
                          {session.title}
                        </h3>

                        <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{session.date}</span>
                            <span>•</span>
                            <span>{session.time}</span>
                            <span className="text-gray-400">
                              ({session.duration})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {session.course && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <BookOpen className="h-3 w-3" />
                              <span>{session.course}</span>
                            </div>
                          )}

                          {session.student && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <User className="h-3 w-3" />
                              <span>{session.student.name}</span>
                            </div>
                          )}

                          {session.type === "group" && session.students && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Users className="h-3 w-3" />
                              <span>{session.students} students</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(
                        session.status
                      )} text-xs font-medium`}
                    >
                      {getStatusIcon(session.status)}
                      <span className="ml-1 capitalize">
                        {session.status.replace("-", " ")}
                      </span>
                    </Badge>

                    <div className="flex items-center space-x-2">
                      {session.status === "starting-soon" ? (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white px-4"
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Join Now
                        </Button>
                      ) : session.status === "in-progress" ? (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-gray-100 px-4"
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Join
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {upcomingSessions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No upcoming sessions
                </h3>
                <p className="text-gray-500 mb-4">
                  Schedule your first session to get started
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Session
                </Button>
              </div>
            )}

            {upcomingSessions.length > limit && (
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full hover:bg-gray-50">
                  View All Sessions ({upcomingSessions.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calendar view (simplified for now)
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Session Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
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
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Calendar view coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
