"use client";

import { useState, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, DollarSign, Plus } from "lucide-react";
import { useSessions } from "../context/sessionsContext";
import type { Session } from "../types/session.types";
import {
  format,
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function SessionsCalendar() {
  const { state, dispatch, actions } = useSessions();
  const { sessions, selectedDate, viewMode } = state;
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    type: "individual" as "individual" | "group",
    topicType: "fixed" as "fixed" | "flexible",
    capacity: 1,
    basePrice: 50,
    duration: 60,
    description: "",
    fixedTopic: "",
    domain: "",
  });

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        dispatch({ type: "SET_SELECTED_DATE", payload: date });
      }
    },
    [dispatch]
  );

  const handleViewModeChange = useCallback(
    (mode: "month" | "week" | "day") => {
      dispatch({ type: "SET_VIEW_MODE", payload: mode });
    },
    [dispatch]
  );

  const getSessionsForDate = useCallback(
    (date: Date) => {
      return sessions.filter((session) => isSameDay(session.start, date));
    },
    [sessions]
  );

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "booked":
        return "bg-red-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-300";
    }
  };

  const handleCreateSession = useCallback(() => {
    const sessionStart = new Date(selectedDate);
    sessionStart.setHours(10, 0, 0, 0); // Default to 10:00 AM

    const sessionEnd = new Date(sessionStart);
    sessionEnd.setMinutes(sessionEnd.getMinutes() + newSession.duration);

    const session = {
      title: newSession.title,
      start: sessionStart,
      end: sessionEnd,
      type: newSession.type,
      topicType: newSession.topicType,
      fixedTopic:
        newSession.topicType === "fixed" ? newSession.fixedTopic : undefined,
      domain:
        newSession.topicType === "flexible" ? newSession.domain : undefined,
      status: "available" as const,
      capacity: newSession.capacity,
      basePrice: newSession.basePrice,
      color: "#10b981",
      topicDeadline:
        newSession.topicType === "flexible"
          ? new Date(sessionStart.getTime() - 24 * 60 * 60 * 1000) // 24 hours before session
          : undefined,
    };

    actions.createSession(session);

    // Reset form and close dialog
    setNewSession({
      title: "",
      type: "individual",
      topicType: "fixed",
      capacity: 1,
      basePrice: 50,
      duration: 60,
      description: "",
      fixedTopic: "",
      domain: "",
    });
    setIsAddSessionOpen(false);
  }, [selectedDate, newSession, actions]);

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-4 h-full">
        {weekDays.map((day) => {
          const daySessions = getSessionsForDate(day);
          return (
            <div
              key={day.toISOString()}
              className="border rounded-lg p-3 min-h-[200px]"
            >
              <div className="font-medium text-sm mb-2">
                {format(day, "EEE d")}
              </div>
              <div className="space-y-2">
                {daySessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-2 rounded text-xs cursor-pointer hover:opacity-80 ${getStatusColor(
                      session.status
                    )} text-white`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="font-medium truncate">{session.title}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {format(session.start, "HH:mm")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const daySessions = getSessionsForDate(selectedDate);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h3>
          <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#0E6E55] hover:bg-[#0E6E55]/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="session-title">Session Title</Label>
                  <Input
                    id="session-title"
                    placeholder="e.g., JavaScript Fundamentals"
                    value={newSession.title}
                    onChange={(e) =>
                      setNewSession((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session-type">Session Type</Label>
                    <Select
                      value={newSession.type}
                      onValueChange={(value: "individual" | "group") =>
                        setNewSession((prev) => ({
                          ...prev,
                          type: value,
                          capacity: value === "individual" ? 1 : 5,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="group">Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="topic-type">Topic Management</Label>
                    <Select
                      value={newSession.topicType || "fixed"}
                      onValueChange={(value: "fixed" | "flexible") =>
                        setNewSession((prev) => ({ ...prev, topicType: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Topic</SelectItem>
                        <SelectItem value="flexible">Flexible Topic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Conditional fields based on topic type */}
                {newSession.topicType === "fixed" ? (
                  <div>
                    <Label htmlFor="fixed-topic">Specific Topic</Label>
                    <Input
                      id="fixed-topic"
                      placeholder="e.g., Advanced Python Decorators"
                      value={newSession.fixedTopic || ""}
                      onChange={(e) =>
                        setNewSession((prev) => ({
                          ...prev,
                          fixedTopic: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="domain">Subject Domain</Label>
                    <Input
                      id="domain"
                      placeholder="e.g., Data Science, Web Development"
                      value={newSession.domain || ""}
                      onChange={(e) =>
                        setNewSession((prev) => ({
                          ...prev,
                          domain: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Students will suggest specific topics within this domain
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session-capacity">Capacity</Label>
                    <Input
                      id="session-capacity"
                      type="number"
                      min="1"
                      max="20"
                      value={newSession.capacity}
                      onChange={(e) =>
                        setNewSession((prev) => ({
                          ...prev,
                          capacity: Number.parseInt(e.target.value) || 1,
                        }))
                      }
                      className="mt-1"
                      disabled={newSession.type === "individual"}
                    />
                  </div>

                  <div>
                    <Label htmlFor="session-price">Base Price ($)</Label>
                    <Input
                      id="session-price"
                      type="number"
                      min="10"
                      step="5"
                      value={newSession.basePrice}
                      onChange={(e) =>
                        setNewSession((prev) => ({
                          ...prev,
                          basePrice: Number.parseInt(e.target.value) || 50,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="session-description">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="session-description"
                    placeholder="Brief description of what will be covered..."
                    value={newSession.description}
                    onChange={(e) =>
                      setNewSession((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddSessionOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateSession}
                    disabled={!newSession.title.trim()}
                    className="bg-[#0E6E55] hover:bg-[#0E6E55]/90"
                  >
                    Create Session
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {daySessions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No sessions scheduled for this day
              </CardContent>
            </Card>
          ) : (
            daySessions.map((session) => (
              <Card
                key={session.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(
                            session.status
                          )}`}
                        />
                        <h4 className="font-medium">{session.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {session.type}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(session.start, "HH:mm")} -{" "}
                          {format(session.end, "HH:mm")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {session.capacity} seats
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />$
                          {session.currentPrice || session.basePrice}
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant={
                        session.status === "available"
                          ? "default"
                          : session.status === "pending"
                          ? "secondary"
                          : session.status === "booked"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {session.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Calendar</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: "TOGGLE_REQUESTS_DRAWER" })}
            className="relative"
          >
            Requests
            {state.stats.pendingRequests > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-[#0E6E55]">
                {state.stats.pendingRequests}
              </Badge>
            )}
          </Button>
        </div>

        <Tabs value={viewMode} onValueChange={handleViewModeChange as any}>
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={viewMode} className="h-full">
          <TabsContent value="month" className="h-full mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-1">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                />
              </div>
              <div className="lg:col-span-2">{renderDayView()}</div>
            </div>
          </TabsContent>

          <TabsContent value="week" className="h-full mt-0">
            <div className="h-full">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Week of {format(startOfWeek(selectedDate), "MMM d, yyyy")}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDateSelect(
                        new Date(
                          selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000
                        )
                      )
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDateSelect(
                        new Date(
                          selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000
                        )
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
              {renderWeekView()}
            </div>
          </TabsContent>

          <TabsContent value="day" className="h-full mt-0">
            <div className="h-full">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDateSelect(
                        new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000)
                      )
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDateSelect(
                        new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
              {renderDayView()}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
                           