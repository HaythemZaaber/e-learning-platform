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
  User
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
import { toast } from "sonner";

import { 
  useSessionOfferings, 
  useCreateBookingRequest 
} from "@/features/sessions/hooks/useLiveSessions";
import { 
  SessionOffering, 
  InstructorProfile,
  SessionType,
  SessionFormat,
  SessionTopicType,
  TopicDifficulty,
  BookingMode,
  BookingStatus,
  PaymentStatus,
  BookingRequest
} from "@/features/sessions/types/session.types";

import { SessionBooking } from "../learner/SessionBooking";

interface BrowseSessionsProps {
  user: any;
}

interface OfferingWithInstructor extends SessionOffering {
  instructor: InstructorProfile;
}

export function BrowseSessions({ user }: BrowseSessionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<SessionType | "all">("all");
  const [selectedFormat, setSelectedFormat] = useState<SessionFormat | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<TopicDifficulty | "all">("all");
  const [priceRange, setPriceRange] = useState<"all" | "0-25" | "26-50" | "51-100" | "100+">("all");
  const [sortBy, setSortBy] = useState<"relevance" | "price" | "rating" | "popularity">("relevance");
  const [selectedOffering, setSelectedOffering] = useState<OfferingWithInstructor | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  // Fetch data
  const { data: offerings = [], isLoading: offeringsLoading } = useSessionOfferings();
  const createBooking = useCreateBookingRequest();

  // Mock instructors data for now
  const instructors: InstructorProfile[] = [
    {
      id: "instructor-1",
      userId: "user-1",
      liveSessionsEnabled: true,
      defaultSessionDuration: 60,
      defaultSessionType: SessionType.INDIVIDUAL,
      preferredGroupSize: 5,
      bufferBetweenSessions: 15,
      maxSessionsPerDay: 8,
      minAdvanceBooking: 12,
      autoAcceptBookings: true,
      instantMeetingEnabled: true,
      currency: "USD",
      platformFeeRate: 10,
      defaultCancellationPolicy: "flexible" as any,
      defaultSessionFormat: SessionFormat.ONLINE,
      expertise: ["React", "JavaScript", "TypeScript"],
      qualifications: ["Computer Science Degree", "5+ years experience"],
      experience: 5,
      socialLinks: {},
      subjectsTeaching: ["Programming", "Web Development"],
      teachingCategories: ["Technology"],
      languagesSpoken: ["English"],
      teachingRating: 4.8,
      totalStudents: 150,
      totalCourses: 10,
      totalLiveSessions: 200,
      totalRevenue: 15000,
      averageCourseRating: 4.7,
      averageSessionRating: 4.8,
      studentRetentionRate: 0.85,
      sessionCompletionRate: 0.95,
      responseTime: 2,
      studentSatisfaction: 4.6,
      isVerified: true,
      complianceStatus: "compliant",
      title: "Senior React Developer",
      bio: "Experienced React developer with 5+ years of experience",
      shortBio: "React expert",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  // Combine offerings with instructor data
  const offeringsWithInstructors: OfferingWithInstructor[] = useMemo(() => {
    return offerings.map(offering => {
      const instructor = instructors.find(inst => inst.userId === offering.instructorId);
      return {
        ...offering,
        instructor: instructor || {} as InstructorProfile
      };
    });
  }, [offerings, instructors]);

  // Filter and sort offerings
  const filteredOfferings = useMemo(() => {
    let filtered = offeringsWithInstructors.filter(offering => {
      const matchesSearch = 
        offering.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offering.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offering.instructor.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offering.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = selectedType === "all" || offering.sessionType === selectedType;
      const matchesFormat = selectedFormat === "all" || offering.sessionFormat === selectedFormat;
      const matchesDifficulty = selectedDifficulty === "all" || offering.tags.includes(selectedDifficulty.toLowerCase());

      let matchesPrice = true;
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        if (max) {
          matchesPrice = offering.basePrice >= min && offering.basePrice <= max;
        } else {
          matchesPrice = offering.basePrice >= min;
        }
      }

      return matchesSearch && matchesType && matchesFormat && matchesDifficulty && matchesPrice;
    });

    // Sort offerings
    switch (sortBy) {
      case "price":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "rating":
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "popularity":
        filtered.sort((a, b) => b.totalBookings - a.totalBookings);
        break;
      default:
        // Relevance: combination of rating and popularity
        filtered.sort((a, b) => {
          const scoreA = (a.averageRating * 0.6) + (a.totalBookings * 0.4);
          const scoreB = (b.averageRating * 0.6) + (b.totalBookings * 0.4);
          return scoreB - scoreA;
        });
    }

    return filtered;
  }, [offeringsWithInstructors, searchTerm, selectedType, selectedFormat, selectedDifficulty, priceRange, sortBy]);

  const handleBookSession = (offering: OfferingWithInstructor) => {
    setSelectedOffering(offering);
    setIsBookingDialogOpen(true);
  };

  const handleCreateBooking = async (bookingRequest: BookingRequest) => {
    try {
      // The booking request is already created by the SessionBooking component
      // We just need to handle the success case
      toast.success("Booking request sent successfully!");
      setIsBookingDialogOpen(false);
      setSelectedOffering(null);
    } catch (error) {
      toast.error("Failed to send booking request");
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
        return <MapPin className="h-4 w-4" />;
      case SessionFormat.OFFLINE:
        return <MapPin className="h-4 w-4" />;
      case SessionFormat.HYBRID:
        return <MapPin className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  if (offeringsLoading) {
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
          <h2 className="text-2xl font-bold text-gray-900">Browse Sessions</h2>
          <p className="text-gray-600 mt-1">
            Discover and book live learning sessions from expert instructors
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {filteredOfferings.length} sessions available
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
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOfferings.map((offering) => (
          <Card key={offering.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={offering.instructor.personalWebsite} />
                    <AvatarFallback>
                      {offering.instructor.title?.charAt(0) || "I"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {offering.instructor.title || "Instructor"}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">
                        {offering.instructor.averageSessionRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({offering.instructor.totalStudents} students)
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
                  {offering.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {offering.description}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {getSessionTypeIcon(offering.sessionType)}
                <span className="capitalize">{offering.sessionType.toLowerCase().replace('_', ' ')}</span>
                <Separator orientation="vertical" className="h-4" />
                {getFormatIcon(offering.sessionFormat)}
                <span className="capitalize">{offering.sessionFormat.toLowerCase()}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{offering.duration}min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Max {offering.capacity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${offering.basePrice}
                  </p>
                  <p className="text-xs text-gray-500">
                    {offering.currency}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {offering.topicType === SessionTopicType.FLEXIBLE ? "Flexible" : "Fixed"} Topic
                  </Badge>
                  {offering.requiresApproval && (
                    <Badge variant="secondary" className="text-xs">
                      Approval Required
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => handleBookSession(offering)}
                    className="flex-1"
                  >
                    Book Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOfferings.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters to find more sessions.
          </p>
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Session</DialogTitle>
          </DialogHeader>
          {selectedOffering && (
            <SessionBooking
              offering={selectedOffering}
              onBookingComplete={handleCreateBooking}
              onCancel={() => setIsBookingDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
