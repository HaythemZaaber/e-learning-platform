"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Star, 
  Clock, 
  DollarSign,
  Calendar,
  BookOpen,
  TrendingUp,
  Zap,
  Eye,
  Heart,
  Share2,
  User,
  Video,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format, isAfter, isBefore, addHours } from "date-fns";

import { 
  useAvailableLiveSessions, 
  useBookLiveSession
} from "@/features/sessions/hooks/useLiveSessions";
import { 
  LiveSession, 
  InstructorProfile,
  SessionType,
  SessionFormat,
  SessionStatus,
  ReservationStatus,
  PaymentStatus,
  LiveSessionType
} from "@/features/sessions/types/session.types";

import { SessionBookingDialog } from "./SessionBookingDialog";

interface BrowseSessionsProps {
  user: any;
}

interface SessionWithInstructor extends LiveSession {
  instructor: InstructorProfile;
}

export function BrowseSessions({ user }: BrowseSessionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<SessionType | "all">("all");
  const [selectedFormat, setSelectedFormat] = useState<SessionFormat | "all">("all");
  const [priceRange, setPriceRange] = useState<"all" | "0-25" | "26-50" | "51-100" | "100+">("all");
  const [sortBy, setSortBy] = useState<"relevance" | "price" | "date" | "popularity">("relevance");
  const [selectedSession, setSelectedSession] = useState<SessionWithInstructor | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  // Create stable filters to prevent infinite loops
  const stableFilters = useMemo(() => ({
    status: SessionStatus.SCHEDULED,
    // Don't pass startDate to avoid infinite loops - let the API handle filtering
  }), []);

  // Fetch available live sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useAvailableLiveSessions(stableFilters);

  const bookSession = useBookLiveSession();

  // Get unique instructor IDs from sessions (for future use when we implement real instructor profile fetching)
  const instructorIds = useMemo(() => {
    const ids = [...new Set(sessions.map(session => session.instructorId))];
    return ids;
  }, [sessions]);

  // Combine sessions with instructor data
  const sessionsWithInstructors: SessionWithInstructor[] = useMemo(() => {
    const now = new Date(); // Create date once to avoid new Date() on every iteration
    return sessions.map(session => {
      // For now, create a mock instructor profile
      // In a real implementation, you'd fetch all instructor profiles
      const mockInstructor: InstructorProfile = {
        id: session.instructorId,
        userId: session.instructorId,
        title: "Instructor",
        bio: "Experienced instructor",
        shortBio: "Expert instructor",
        expertise: ["Programming", "Web Development"],
        qualifications: ["Computer Science Degree"],
        experience: 5,
        socialLinks: {},
        subjectsTeaching: ["Programming"],
        teachingCategories: ["Technology"],
        languagesSpoken: ["English"],
        liveSessionsEnabled: true,
        defaultSessionDuration: 60,
        defaultSessionType: SessionType.INDIVIDUAL,
        preferredGroupSize: 5,
        bufferBetweenSessions: 15,
        maxSessionsPerDay: 8,
        minAdvanceBookings: 12,
        autoAcceptBookings: true,
        instantMeetingEnabled: true,
        currency: "USD",
        platformFeeRate: 10,
        defaultCancellationPolicy: "flexible" as any,
        defaultSessionFormat: SessionFormat.ONLINE,
        teachingRating: 4.8,
        totalStudents: 150,
        totalCourses: 10,
        totalLiveSessions: 200,
        totalRevenue: 15000,
        averageCourseRating: 4.7,
        averageSessionRating: 4.8,
        studentRetentionRate: 0.85,
        courseCompletionRate: 0.92,
        sessionCompletionRate: 0.95,
        responseTime: 2,
        studentSatisfaction: 4.6,
        isAcceptingStudents: true,
        maxStudentsPerCourse: 50,
        preferredSchedule: {},
        availableTimeSlots: [],
        isVerified: true,
        complianceStatus: "compliant",
        createdAt: now,
        updatedAt: now,
      };

      return {
        ...session,
        instructor: mockInstructor
      };
    });
  }, [sessions]);

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    let filtered = sessionsWithInstructors.filter(session => {
      const matchesSearch = 
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.instructor.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.finalTopic?.toLowerCase().includes(searchTerm.toLowerCase());

      // Note: session.sessionType is LiveSessionType, not SessionType, so we need to check differently
      const matchesType = selectedType === "all" || 
        (session.sessionType === LiveSessionType.CUSTOM && selectedType === SessionType.INDIVIDUAL) ||
        (session.sessionType === LiveSessionType.COURSE_BASED && selectedType === SessionType.SMALL_GROUP);
      const matchesFormat = selectedFormat === "all" || session.sessionFormat === selectedFormat;

      let matchesPrice = true;
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        if (max) {
          matchesPrice = session.pricePerPerson >= min && session.pricePerPerson <= max;
        } else {
          matchesPrice = session.pricePerPerson >= min;
        }
      }

      return matchesSearch && matchesType && matchesFormat && matchesPrice;
    });

    // Sort sessions
    switch (sortBy) {
      case "price":
        filtered.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
        break;
      case "date":
        filtered.sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime());
        break;
      case "popularity":
        filtered.sort((a, b) => (b.currentParticipants || 0) - (a.currentParticipants || 0));
        break;
      default:
        // Relevance: combination of rating and availability
        filtered.sort((a, b) => {
          const scoreA = ((a.instructor.averageSessionRating || 0) * 0.6) + ((a.maxParticipants - (a.currentParticipants || 0)) * 0.4);
          const scoreB = ((b.instructor.averageSessionRating || 0) * 0.6) + ((b.maxParticipants - (b.currentParticipants || 0)) * 0.4);
          return scoreB - scoreA;
        });
    }

    return filtered;
  }, [sessionsWithInstructors, searchTerm, selectedType, selectedFormat, priceRange, sortBy]);

  const handleBookSession = (session: SessionWithInstructor) => {
    setSelectedSession(session);
    setIsBookingDialogOpen(true);
  };

  const handleBookingComplete = async (bookingData: {
    customRequirements?: string;
    studentMessage?: string;
  }) => {
    if (!selectedSession || !user?.id) {
      toast.error("Missing session or user information");
      return;
    }

    try {
      await bookSession.mutateAsync({
        sessionId: selectedSession.id,
        studentId: user.id,
        customRequirements: bookingData.customRequirements,
        studentMessage: bookingData.studentMessage,
      });

      setIsBookingDialogOpen(false);
      setSelectedSession(null);
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const getSessionTypeIcon = (type: SessionType) => {
    switch (type) {
      case SessionType.INDIVIDUAL:
        return <User className="h-4 w-4" />;
      case SessionType.SMALL_GROUP:
        return <Users className="h-4 w-4" />;
      case SessionType.LARGE_GROUP:
        return <Users className="h-4 w-4" />;
      case SessionType.WORKSHOP:
        return <BookOpen className="h-4 w-4" />;
      case SessionType.MASTERCLASS:
        return <Zap className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getFormatIcon = (format: SessionFormat) => {
    switch (format) {
      case SessionFormat.ONLINE:
        return <Video className="h-4 w-4" />;
      case SessionFormat.OFFLINE:
        return <MapPin className="h-4 w-4" />;
      case SessionFormat.HYBRID:
        return <Globe className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const getAvailableSlots = (session: LiveSession) => {
    return session.maxParticipants - (session.currentParticipants || 0);
  };

  const formatSessionDate = (date: Date) => {
    return format(new Date(date), "MMM dd, yyyy 'at' HH:mm");
  };

  const isSessionStartingSoon = (session: LiveSession) => {
    const now = new Date();
    const sessionStart = new Date(session.scheduledStart);
    const hoursUntilStart = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilStart <= 24 && hoursUntilStart > 0;
  };

  if (sessionsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Browse Live Sessions</h2>
          <p className="text-gray-600 mt-1">
            Discover and book live learning sessions from expert instructors
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {filteredSessions.length} sessions available
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sessions, topics, or instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Session Type */}
            <Select value={selectedType} onValueChange={(value: SessionType | "all") => setSelectedType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Session Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={SessionType.INDIVIDUAL}>Individual</SelectItem>
                <SelectItem value={SessionType.SMALL_GROUP}>Small Group</SelectItem>
                <SelectItem value={SessionType.LARGE_GROUP}>Large Group</SelectItem>
                <SelectItem value={SessionType.WORKSHOP}>Workshop</SelectItem>
                <SelectItem value={SessionType.MASTERCLASS}>Masterclass</SelectItem>
              </SelectContent>
            </Select>

            {/* Format */}
            <Select value={selectedFormat} onValueChange={(value: SessionFormat | "all") => setSelectedFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value={SessionFormat.ONLINE}>Online</SelectItem>
                <SelectItem value={SessionFormat.OFFLINE}>Offline</SelectItem>
                <SelectItem value={SessionFormat.HYBRID}>Hybrid</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select value={priceRange} onValueChange={(value: any) => setPriceRange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-25">$0 - $25</SelectItem>
                <SelectItem value="26-50">$26 - $50</SelectItem>
                <SelectItem value="51-100">$51 - $100</SelectItem>
                <SelectItem value="100+">$100+</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.instructor.personalWebsite || ""} />
                    <AvatarFallback>
                      {session.instructor.title?.charAt(0) || "I"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.instructor.title || "Instructor"}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">
                        {(session.instructor.averageSessionRating || 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({session.instructor.totalStudents || 0} students)
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {session.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {session.description || "Join this live learning session with an expert instructor."}
                </p>
                {session.finalTopic && (
                  <p className="text-sm text-blue-600 mt-1">
                    Topic: {session.finalTopic}
                  </p>
                )}
              </div>

                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {getSessionTypeIcon(session.sessionType === LiveSessionType.CUSTOM ? SessionType.INDIVIDUAL : SessionType.SMALL_GROUP)}
                  <span className="capitalize">{session.sessionType === LiveSessionType.CUSTOM ? 'Individual' : 'Group'}</span>
                  <Separator orientation="vertical" className="h-4" />
                  {getFormatIcon(session.sessionFormat)}
                  <span className="capitalize">{session.sessionFormat.toLowerCase()}</span>
                </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatSessionDate(session.scheduledStart)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{session.duration}min</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${session.pricePerPerson}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.currency}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between flex-col gap-2">
                <div className="flex items-center space-x-2 w-full justify-center">
                  <Badge variant="outline" className="text-xs">
                    {getAvailableSlots(session)} spots left
                  </Badge>
                  {isSessionStartingSoon(session) && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                      Starting Soon
                    </Badge>
                  )}
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 w-full">
                  <Button 
                    onClick={() => handleBookSession(session)}
                    className="flex-1"
                    disabled={getAvailableSlots(session) === 0}
                  >
                    {getAvailableSlots(session) === 0 ? "Full" : "Book Session"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters to find more sessions.
          </p>
        </div>
      )}

      {/* Booking Dialog */}
      {selectedSession && (
        <SessionBookingDialog
          session={selectedSession}
          isOpen={isBookingDialogOpen}
          onClose={() => {
            setIsBookingDialogOpen(false);
            setSelectedSession(null);
          }}
          onBookingComplete={handleBookingComplete}
          isLoading={bookSession.isPending}
        />
      )}
    </div>
  );
}
