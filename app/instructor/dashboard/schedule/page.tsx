"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  BookOpen,
  Users,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bell,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const mockSessions = [
  {
    id: "1",
    type: "teaching",
    title: "Advanced React Patterns",
    instructor: "You",
    students: 12,
    startTime: "09:00",
    endTime: "10:30",
    date: "2024-01-15",
    status: "upcoming",
    location: "Online",
    description: "Teaching advanced React patterns and best practices",
  },
  {
    id: "2",
    type: "learning",
    title: "Machine Learning Fundamentals",
    instructor: "Dr. Sarah Johnson",
    students: 45,
    startTime: "14:00",
    endTime: "15:30",
    date: "2024-01-15",
    status: "upcoming",
    location: "Online",
    description: "Learning ML concepts and algorithms",
  },
  {
    id: "3",
    type: "teaching",
    title: "JavaScript Deep Dive",
    instructor: "You",
    students: 8,
    startTime: "16:00",
    endTime: "17:30",
    date: "2024-01-15",
    status: "completed",
    location: "Online",
    description: "Teaching advanced JavaScript concepts",
  },
  {
    id: "4",
    type: "learning",
    title: "Data Science with Python",
    instructor: "Prof. Michael Chen",
    students: 32,
    startTime: "10:00",
    endTime: "11:30",
    date: "2024-01-16",
    status: "upcoming",
    location: "Online",
    description: "Learning data science techniques",
  },
];

const mockCalendarEvents = [
  {
    date: "2024-01-15",
    events: [
      {
        time: "09:00",
        title: "Advanced React Patterns",
        type: "teaching",
        duration: 90,
      },
      {
        time: "14:00",
        title: "Machine Learning Fundamentals",
        type: "learning",
        duration: 90,
      },
      {
        time: "16:00",
        title: "JavaScript Deep Dive",
        type: "teaching",
        duration: 90,
      },
    ],
  },
  {
    date: "2024-01-16",
    events: [
      {
        time: "10:00",
        title: "Data Science with Python",
        type: "learning",
        duration: 90,
      },
      {
        time: "15:00",
        title: "Web Development Workshop",
        type: "teaching",
        duration: 120,
      },
    ],
  },
];

export default function InstructorSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [filterType, setFilterType] = useState<"all" | "teaching" | "learning">(
    "all"
  );
  const [selectedDate, setSelectedDate] = useState<string>("2024-01-15");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "teaching"
      ? "bg-purple-100 text-purple-800"
      : "bg-green-100 text-green-800";
  };

  const filteredSessions = mockSessions.filter((session) => {
    if (filterType === "all") return true;
    return session.type === filterType;
  });

  const getDayEvents = (date: string) => {
    const dayEvents = mockCalendarEvents.find((day) => day.date === date);
    return dayEvents ? dayEvents.events : [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
              <p className="text-gray-600 mt-1">
                Manage your teaching and learning schedule
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  /* TODO: Implement create session */
                }}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Today's Sessions
                    </p>
                    <p className="text-2xl font-bold text-blue-900">3</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">
                      Teaching
                    </p>
                    <p className="text-2xl font-bold text-purple-900">2</p>
                  </div>
                  <Video className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Learning
                    </p>
                    <p className="text-2xl font-bold text-green-900">1</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold text-amber-900">20</p>
                  </div>
                  <Users className="w-8 h-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Select
                value={viewMode}
                onValueChange={(value: any) => setViewMode(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calendar">Calendar</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterType}
                onValueChange={(value: any) => setFilterType(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="teaching">Teaching</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium px-3">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Calendar View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCalendarEvents.map((day, index) => (
                      <motion.div
                        key={day.date}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </h3>
                          <Badge variant="outline">
                            {day.events.length} sessions
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {day.events.map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-l-4",
                                event.type === "teaching"
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-green-500 bg-green-50"
                              )}
                            >
                              <Clock className="w-4 h-4 text-gray-500" />
                              <div className="flex-1">
                                <p className="font-medium">{event.title}</p>
                                <p className="text-sm text-gray-600">
                                  {event.time} ({event.duration} min)
                                </p>
                              </div>
                              <Badge className={getTypeColor(event.type)}>
                                {event.type}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getDayEvents(selectedDate).map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "p-3 rounded-lg border-l-4",
                          event.type === "teaching"
                            ? "border-purple-500 bg-purple-50"
                            : "border-green-500 bg-green-50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{event.title}</p>
                            <p className="text-xs text-gray-600">
                              {event.time}
                            </p>
                          </div>
                          <Badge className={getTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-4">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center",
                            session.type === "teaching"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-green-100 text-green-600"
                          )}
                        >
                          {session.type === "teaching" ? (
                            <Video className="w-6 h-6" />
                          ) : (
                            <BookOpen className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {session.title}
                          </h3>
                          <p className="text-gray-600">{session.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {session.startTime} - {session.endTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {session.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {session.students} students
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        <Badge className={getTypeColor(session.type)}>
                          {session.type}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Bell className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
