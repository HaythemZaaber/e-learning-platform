"use client";

import { useState, useCallback, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Users,
  DollarSign,
  Plus,
  TrendingUp,
  Eye,
  Star,
  Filter,
  Search,
  MoreHorizontal,
  Calendar as CalendarIcon,
  MapPin,
  Zap,
  Target,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Switch } from "@/components/ui/switch";
import {
  format,
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  isToday,
  isFuture,
  isPast,
} from "date-fns";
import {
  mockSessions,
  mockRequests,
} from "@/features/sessions/data/session-data";
import { useSessions } from "../context/sessionsContext";

export function SessionsCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { dispatch } = useSessions();
  const [viewMode, setViewMode] = useState("month");
  const [sessions] = useState(mockSessions);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewRequestsSession, setViewRequestsSession] = useState<any>(null);
  const [newSession, setNewSession] = useState({
    title: "",
    type: "individual",
    topicType: "fixed",
    capacity: 1,
    basePrice: 50,
    duration: 90,
    description: "",
    fixedTopic: "",
    domain: "",
    enableDynamicPricing: false,
    minPrice: 30,
    maxPrice: 150,
    autoAccept: false,
  });

  const handleDateSelect = useCallback((date: Date) => {
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleViewModeChange = useCallback((mode: string) => {
    setViewMode(mode);
  }, []);

  const getSessionsForDate = useCallback(
    (date: Date) => {
      return sessions.filter((session) => isSameDay(session.start, date));
    },
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.domain?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || session.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchTerm, statusFilter]);

  const getStatusConfig = (status: string) => {
    const configs = {
      available: {
        color: "bg-emerald-500",
        bgColor: "bg-emerald-50 border-emerald-200",
        textColor: "text-emerald-700",
        badge: "default",
      },
      pending: {
        color: "bg-amber-500",
        bgColor: "bg-amber-50 border-amber-200",
        textColor: "text-amber-700",
        badge: "secondary",
      },
      booked: {
        color: "bg-blue-500",
        bgColor: "bg-blue-50 border-blue-200",
        textColor: "text-blue-700",
        badge: "outline",
      },
      completed: {
        color: "bg-gray-500",
        bgColor: "bg-gray-50 border-gray-200",
        textColor: "text-gray-700",
        badge: "outline",
      },
    };
    return configs[status as keyof typeof configs] || configs.available;
  };

  const getSessionMetrics = (session: any) => {
    const completionRate = Math.floor(Math.random() * 40) + 60; // Mock data
    const demandScore =
      session.requests > 5 ? "High" : session.requests > 2 ? "Medium" : "Low";
    return { completionRate, demandScore };
  };

  const handleCreateSession = useCallback(() => {
    const sessionStart = new Date(selectedDate);
    sessionStart.setHours(10, 0, 0, 0);
    const sessionEnd = new Date(sessionStart);
    sessionEnd.setMinutes(sessionEnd.getMinutes() + newSession.duration);

    const session = {
      id: Date.now().toString(),
      title: newSession.title,
      start: sessionStart,
      end: sessionEnd,
      type: newSession.type,
      topicType: newSession.topicType,
      fixedTopic:
        newSession.topicType === "fixed" ? newSession.fixedTopic : undefined,
      domain:
        newSession.topicType === "flexible" ? newSession.domain : undefined,
      status: "available",
      capacity: newSession.capacity,
      basePrice: newSession.basePrice,
      currentPrice: newSession.basePrice,
      color: newSession.type === "individual" ? "#10b981" : "#3b82f6",
      requests: 0,
      views: 0,
      rating: 0,
    };

    // Reset form
    setNewSession({
      title: "",
      type: "individual",
      topicType: "fixed",
      capacity: 1,
      basePrice: 50,
      duration: 90,
      description: "",
      fixedTopic: "",
      domain: "",
      enableDynamicPricing: false,
      minPrice: 30,
      maxPrice: 150,
      autoAccept: false,
    });
    setIsAddSessionOpen(false);
  }, [selectedDate, newSession]);

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-2 h-full">
        {weekDays.map((day) => {
          const daySessions = getSessionsForDate(day);
          const isCurrentDay = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`border rounded-xl p-4 min-h-[300px] transition-all hover:shadow-md ${
                isCurrentDay ? "bg-blue-50 border-blue-200" : "bg-card"
              }`}
            >
              <div
                className={`font-semibold text-sm mb-3 flex items-center justify-between ${
                  isCurrentDay ? "text-blue-700" : "text-foreground"
                }`}
              >
                <span>{format(day, "EEE d")}</span>
                {isPast(day) && !isCurrentDay && (
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                )}
                {isCurrentDay && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                )}
              </div>
              <div className="space-y-2">
                {daySessions.map((session) => {
                  const statusConfig = getStatusConfig(session.status);
                  return (
                    <div
                      key={session.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-105 ${statusConfig.bgColor}`}
                      onClick={() => setSelectedSession(session)}
                    >
                      <div
                        className={`font-medium text-xs mb-1 ${statusConfig.textColor}`}
                      >
                        {session.title}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Clock className="w-3 h-3" />
                        {format(session.start, "HH:mm")}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${statusConfig.color}`}
                          />
                          <span className="text-xs text-muted-foreground">
                            ${session.currentPrice ?? session.basePrice}
                          </span>
                        </div>
                        {getRequestsForSession(session.id).length > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0.5"
                          >
                            {getRequestsForSession(session.id).length}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const daySessions = getSessionsForDate(selectedDate).sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            <Badge variant={isToday(selectedDate) ? "default" : "outline"}>
              {isToday(selectedDate)
                ? "Today"
                : isFuture(selectedDate)
                ? "Upcoming"
                : "Past"}
            </Badge>
          </div>

          <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Create New Session
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session-title">Session Title*</Label>
                    <Input
                      id="session-title"
                      placeholder="e.g., Advanced React Patterns"
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
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select
                      value={newSession.duration.toString()}
                      onValueChange={(value) =>
                        setNewSession((prev) => ({
                          ...prev,
                          duration: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Session Type</Label>
                    <Select
                      value={newSession.type}
                      onValueChange={(value) =>
                        setNewSession((prev) => ({
                          ...prev,
                          type: value,
                          capacity: value === "individual" ? 1 : 6,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Individual (1-on-1)
                          </div>
                        </SelectItem>
                        <SelectItem value="group">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Group Session
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Topic Management</Label>
                    <Select
                      value={newSession.topicType}
                      onValueChange={(value) =>
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

                {newSession.topicType === "fixed" ? (
                  <div>
                    <Label htmlFor="fixed-topic">Specific Topic*</Label>
                    <Input
                      id="fixed-topic"
                      placeholder="e.g., Advanced Python Decorators"
                      value={newSession.fixedTopic}
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
                    <Label htmlFor="domain">Subject Domain*</Label>
                    <Input
                      id="domain"
                      placeholder="e.g., Data Science, Web Development"
                      value={newSession.domain}
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="20"
                      value={newSession.capacity}
                      onChange={(e) =>
                        setNewSession((prev) => ({
                          ...prev,
                          capacity: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="mt-1"
                      disabled={newSession.type === "individual"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="base-price">Base Price ($)</Label>
                    <Input
                      id="base-price"
                      type="number"
                      min="10"
                      step="5"
                      value={newSession.basePrice}
                      onChange={(e) =>
                        setNewSession((prev) => ({
                          ...prev,
                          basePrice: parseInt(e.target.value) || 50,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-center pt-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="dynamic-pricing"
                        checked={newSession.enableDynamicPricing}
                        onCheckedChange={(checked) =>
                          setNewSession((prev) => ({
                            ...prev,
                            enableDynamicPricing: checked,
                          }))
                        }
                      />
                      <Label htmlFor="dynamic-pricing" className="text-sm">
                        Dynamic Pricing
                      </Label>
                    </div>
                  </div>
                </div>

                {newSession.enableDynamicPricing && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        Dynamic Pricing Settings
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min-price">Min Price ($)</Label>
                        <Input
                          id="min-price"
                          type="number"
                          value={newSession.minPrice}
                          onChange={(e) =>
                            setNewSession((prev) => ({
                              ...prev,
                              minPrice: parseInt(e.target.value),
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-price">Max Price ($)</Label>
                        <Input
                          id="max-price"
                          type="number"
                          value={newSession.maxPrice}
                          onChange={(e) =>
                            setNewSession((prev) => ({
                              ...prev,
                              maxPrice: parseInt(e.target.value),
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="description">Session Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn..."
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

                <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                  <Switch
                    id="auto-accept"
                    checked={newSession.autoAccept}
                    onCheckedChange={(checked) =>
                      setNewSession((prev) => ({
                        ...prev,
                        autoAccept: checked,
                      }))
                    }
                  />
                  <div>
                    <Label htmlFor="auto-accept" className="font-medium">
                      Auto-accept bookings
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically accept bookings that meet your criteria
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddSessionOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateSession}
                    disabled={!newSession.title.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
            <Card className="border-dashed border-2">
              <CardContent className="p-12 text-center">
                <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="font-semibold text-lg mb-2">
                  No sessions scheduled
                </h4>
                <p className="text-muted-foreground mb-4">
                  Create your first session for{" "}
                  {format(selectedDate, "MMMM d, yyyy")}
                </p>
                <Button
                  onClick={() => setIsAddSessionOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            daySessions.map((session) => {
              const statusConfig = getStatusConfig(session.status);
              const metrics = getSessionMetrics(session);

              return (
                <Card
                  key={session.id}
                  className={`cursor-pointer transition-all hover:shadow-lg border-l-4 ${statusConfig.bgColor}`}
                  style={{ borderLeftColor: session.color }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-3 h-3 rounded-full mt-1 ${statusConfig.color}`}
                          />
                          <div>
                            <h4 className="font-semibold text-lg">
                              {session.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {session.domain ?? ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground ml-6">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(session.start, "HH:mm")} -{" "}
                            {format(session.end, "HH:mm")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {session.type === "individual"
                              ? "1-on-1"
                              : `Up to ${session.capacity} students`}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />$
                            {session.currentPrice ?? session.basePrice}
                            {session.currentPrice &&
                              session.currentPrice > session.basePrice && (
                                <TrendingUp className="w-3 h-3 text-green-500 ml-1" />
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={statusConfig.badge as any}
                          className="capitalize"
                        >
                          {session.status}
                        </Badge>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              // onClick={() => setViewRequestsSession(session)}
                              onClick={() =>
                                dispatch({ type: "TOGGLE_REQUESTS_DRAWER" })
                              }
                            >
                              View Requests
                            </DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Cancel Session
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 p-4 bg-white/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {getRequestsForSession(session.id).length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Requests
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span className="text-lg font-semibold">{0}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Views
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-lg font-semibold">{0}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Rating
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {metrics.demandScore}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Demand
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // Helper to get requests for a session
  const getRequestsForSession = (sessionId: string) =>
    mockRequests.filter((req) => req.sessionId === sessionId);

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Session Calendar
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your availability and track performance
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">This Week</p>
                <p className="text-2xl font-bold text-blue-900">
                  {sessions.length}
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {sessions.reduce(
                    (acc, s) => acc + getRequestsForSession(s.id).length,
                    0
                  )}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Revenue</p>
                <p className="text-2xl font-bold text-purple-900">
                  ${sessions.reduce((acc, s) => acc + (s.currentPrice ?? 0), 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Avg Rating</p>
                <p className="text-2xl font-bold text-amber-900">
                  {(
                    sessions.reduce((acc, s) => acc + 0, 0) / sessions.length
                  ).toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-amber-600 fill-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-4 mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter} >
          <SelectTrigger className="flex-1 w-full">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Tabs value={viewMode} onValueChange={handleViewModeChange} className="flex-1">
          <TabsList className="bg-white border w-full flex flex-1">
            <TabsTrigger value="month" className="flex-1">
              Month
            </TabsTrigger>
            <TabsTrigger value="week" className="flex-1">
              Week
            </TabsTrigger>
            <TabsTrigger value="day" className="flex-1">
              Day
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Calendar Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={viewMode} className="h-full">
          <TabsContent value="month" className="h-full mt-0">
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              {/* Calendar Section */}
              <div className="w-full lg:w-1/3 flex-shrink-0">
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg">Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="rounded-md w-full max-w-full mx-auto"
                      modifiers={{
                        hasSession: sessions.map((s) => s.start),
                        today: [new Date()],
                      }}
                      modifiersStyles={{
                        hasSession: {
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          fontWeight: "bold",
                        },
                        today: {
                          backgroundColor: "#3b82f6",
                          color: "white",
                        },
                      }}
                      required
                    />
                  </CardContent>
                </Card>

                {/* Session Summary */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setIsAddSessionOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Session
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Bulk Schedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
              {/* Day View Section (requests/list) */}
              <div className="w-full lg:w-2/3">{renderDayView()}</div>
            </div>
          </TabsContent>

          <TabsContent value="week" className="h-full mt-0">
            <div className="h-full">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">
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
                    Previous Week
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateSelect(new Date())}
                  >
                    Today
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
                    Next Week
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
                    Previous Day
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateSelect(new Date())}
                  >
                    Today
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
                    Next Day
                  </Button>
                </div>
              </div>
              {renderDayView()}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <Dialog
          open={!!selectedSession}
          onOpenChange={() => setSelectedSession(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    getStatusConfig(selectedSession.status).color
                  }`}
                />
                {selectedSession.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{format(selectedSession.start, "PPp")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {selectedSession.type === "individual"
                        ? "Individual Session"
                        : `Group (${selectedSession.capacity} max)`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>
                      $
                      {selectedSession.currentPrice ??
                        selectedSession.basePrice}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Status: </span>
                    <Badge
                      variant={
                        getStatusConfig(selectedSession.status).badge as any
                      }
                    >
                      {selectedSession.status}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Domain: </span>
                    <span>{selectedSession.domain ?? ""}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Topic Type: </span>
                    <span className="capitalize">
                      {selectedSession.topicType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {getRequestsForSession(selectedSession.id).length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Pending Requests
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{0}</div>
                  <div className="text-xs text-muted-foreground">
                    Profile Views
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{0}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Average Rating
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSession(null)}
                >
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Manage Session
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* View Requests Modal */}
      {viewRequestsSession && (
        <Dialog
          open={!!viewRequestsSession}
          onOpenChange={() => setViewRequestsSession(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Booking Requests for {viewRequestsSession.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {getRequestsForSession(viewRequestsSession.id).length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No requests for this session.
                </div>
              ) : (
                getRequestsForSession(viewRequestsSession.id).map((req) => (
                  <div
                    key={req.id}
                    className="border rounded-lg p-4 flex items-center gap-4"
                  >
                    <img
                      src={req.learnerAvatar}
                      alt={req.learnerName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{req.learnerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {req.sessionTime}
                      </div>
                      <div className="text-sm mt-1">{req.message}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        ${req.offeredPrice}
                      </div>
                      <div className="text-xs capitalize mt-1">
                        {req.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setViewRequestsSession(null)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
