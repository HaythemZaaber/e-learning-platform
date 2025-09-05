"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import {
  Star,
  Users,
  User,
  BookOpen,
  CheckCircle,
  MessageCircle,
  MessageSquare,
  Heart,
  MapPin,
  Globe,
  Twitter,
  Linkedin,
  Youtube,
  ExternalLink,
  Award,
  GraduationCap,
  Target,
  Calendar,
  Clock,
  Play,
  Video,
  TrendingUp,
  Shield,
  Zap,
  ChevronDown,
  Share2,
  Bookmark,
  Filter,
  Search,
  MoreHorizontal,
  AlertCircle,
  Loader2,
  Settings,
  Plus,
  DollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-secondary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CourseCard } from "@/features/courses/shared/CourseCard";
import { ReviewsSection } from "@/features/instructors/components/instructorPage/ReviewsSection";
import { InstructorPageSkeleton } from "@/features/instructors/components/instructorPage/InstructorPageSkeleton";
import { SessionBookingModal } from "@/features/sessions/components/student/SessionBookingModal";
import { CreateFirstOfferingModal } from "@/features/sessions/components/instructor/CreateFirstOfferingModal";
import { useInstructorDetails, useInstructorCourses, useInstructorReviews, useInstructorAvailability } from "@/features/instructors/hooks/useInstructorProfile";
import { useSessionOfferings } from "@/features/sessions/hooks/useLiveSessions";
import { instructorProfileService } from "@/features/instructors/services/instructorProfileService";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import coverImg from "@/public/images/coverImage.jpg";

interface InstructorPageProps {
  params: Promise<{ instructorId: string }>;
}

export default function InstructorPage({ params }: InstructorPageProps) {
  const { instructorId } = use(params);
  
  // All hooks must be called at the top level, before any conditional returns
  const { data: instructorData, loading: detailsLoading, error: detailsError } = useInstructorDetails(instructorId);
  const { data: coursesData, loading: coursesLoading } = useInstructorCourses(instructorId, { page: 1, limit: 6 });
  const { data: reviewsData, loading: reviewsLoading } = useInstructorReviews(instructorId, { page: 1, limit: 10 });
  const { data: availabilityData, loading: availabilityLoading } = useInstructorAvailability(instructorId);
  const { data: offeringsData, isLoading: offeringsLoading } = useSessionOfferings({ instructorId });
  const { user, getToken } = useAuth();

  // Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingSlot, setSelectedBookingSlot] = useState<any>(null);
  const [selectedOffering, setSelectedOffering] = useState<any>(null);
  const [isCreateOfferingModalOpen, setIsCreateOfferingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOfferingId, setSelectedOfferingId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Show skeleton while loading
  if (detailsLoading) {
    return <InstructorPageSkeleton />;
  }

  // Show error if instructor not found
  if (detailsError || !instructorData) {
    notFound();
  }

  const {
    instructor,
    profile,
    stats,
    recentCourses,
    recentReviews,
    availability,
    summary
  } = instructorData;

  // Calculate engagement metrics
  const engagementRate = 0; // Will be calculated from real data
  const trustScore = Math.round(
    (summary.averageRating * 15) + (stats.courseCompletionRate * 0.3) + (stats.responseTime <= 2 ? 20 : 10)
  );

  const handleBookingCardClick = (slot: any) => {
    setSelectedBookingSlot(slot);
    setSelectedOffering(null); // No offering selected yet - will be selected in modal
    setIsBookingModalOpen(true);
  };

  const handleDateSelection = (date: Date) => {
    setSelectedDate(date);
  };

  const handleOfferingSelection = (offeringId: string) => {
    setSelectedOfferingId(offeringId);
  };

  // Get compatible offerings based on selected slot
  const getCompatibleOfferings = () => {
    if (!offeringsData) return [];
    
    const availableOfferings = offeringsData.filter(offering => offering.isActive);
    
    if (!selectedSlot) {
      return availableOfferings;
    }
    
    // Filter offerings based on slot's maxBookings
    if (selectedSlot.maxBookings === 1) {
      // For slots with max 1 booking, only show individual session offerings
      return availableOfferings.filter(offering => 
        offering.sessionType === 'INDIVIDUAL'
      );
    } else if (selectedSlot.maxBookings > 1) {
      // For slots with multiple bookings, only show group session offerings
      return availableOfferings.filter(offering => 
        offering.sessionType === 'SMALL_GROUP' || offering.sessionType === 'LARGE_GROUP' || offering.sessionType === 'WORKSHOP' || offering.sessionType === 'MASTERCLASS'
      );
    }
    
    return availableOfferings;
  };

  // Helper function to generate calendar data
  const generateCalendarData = () => {
    if (!availability?.availabilities) return [];
    
    const calendarData = [];
    const today = new Date();
    const next30Days = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    // Group slots by date
    const slotsByDate = new Map();
    
    availability.availabilities.forEach(avail => {
      avail.generatedSlots?.forEach(slot => {
        if (slot.isAvailable && !slot.isBooked) {
          const dateKey = new Date(slot.startTime).toDateString();
          if (!slotsByDate.has(dateKey)) {
            slotsByDate.set(dateKey, []);
          }
          slotsByDate.get(dateKey).push(slot);
        }
      });
    });
    
    // Generate calendar days
    for (let d = new Date(today); d <= next30Days; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toDateString();
      const slotsForDate = slotsByDate.get(dateKey) || [];
      
      calendarData.push({
        date: new Date(d),
        slots: slotsForDate,
        hasSlots: slotsForDate.length > 0,
        slotCount: slotsForDate.length
      });
    }
    
    return calendarData;
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedBookingSlot(null);
    setSelectedOffering(null);
    setSelectedSlot(null);
    setSelectedOfferingId(null);
  };

  const handleBookingComplete = (bookingId: string) => {
    // Handle booking completion
    console.log('Booking completed:', bookingId);
    handleCloseBookingModal();
  };

  const handleCreateOfferingSuccess = () => {
    // Refresh the page or refetch data
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />

        <div className="h-80 md:h-96 relative">
          <Image
            src={coverImg || "/placeholder.svg"}
            alt={`${instructor.firstName} ${instructor.lastName} cover`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        </div>

        <div className="container relative w-[90vw]">
          <div className="-mt-60 pb-4">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row gap-6 items-start flex-1">
                <div className="relative group">
                  <div className="w-36 h-36 md:w-44 md:h-44 relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105">
                    <Image
                      src={instructor.profileImage || "/placeholder.svg"}
                      alt={`${instructor.firstName} ${instructor.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {profile.isVerified && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-white">
                        {instructor.firstName} {instructor.lastName}
                      </h1>
                    </div>
                    <p className="text-xl  mb-4 text-white">
                      {profile.title || "Instructor"}
                    </p>

                    {/* Enhanced Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-sm">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
                          <span className="font-bold text-xl">
                            {summary.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-500">
                          {summary.totalReviews.toLocaleString()} reviews
                        </span>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-sm">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="h-6 w-6 text-blue-500" />
                          <span className="font-bold text-xl">
                            {summary.totalStudents.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-500">
                          students
                        </span>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-sm">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <BookOpen className="h-6 w-6 text-green-500" />
                          <span className="font-bold text-xl">
                            {summary.totalCourses}
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-500">
                          courses
                        </span>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-sm">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Shield className="h-6 w-6 text-purple-500" />
                          <span className="font-bold text-xl">
                            {trustScore}
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-500">
                          trust score
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {profile.teachingCategories?.slice(0, 3).map((category) => (
                        <Badge
                          key={category}
                          variant="default"
                          className="px-3 py-1"
                        >
                          {category}
                        </Badge>
                      ))}
                      {profile.teachingCategories?.length > 3 && (
                        <Badge variant="outline" className="px-3 py-1">
                          +{profile.teachingCategories.length - 3} more
                        </Badge>
                      )}
                      {profile.liveSessionsEnabled && (
                        <Badge className="bg-red-100 border-gray-300 text-black px-3 py-1">
                          🔴 Live Sessions
                        </Badge>
                      )}
                    </div>

                    {/* Location & Languages */}
                    {profile.languagesSpoken && profile.languagesSpoken.length > 0 && (
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <span>{profile.languagesSpoken.slice(0, 2).map((l: any) => l.language).join(", ")}</span>
                          {profile.languagesSpoken.length > 2 && (
                            <span className="text-gray-400">
                              +{profile.languagesSpoken.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Social Links */}
                    {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                      <div className="flex gap-2">
                        {profile.socialLinks.linkedin && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            asChild
                          >
                            <Link
                              href={profile.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Linkedin className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {profile.personalWebsite && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            asChild
                          >
                            <Link
                              href={profile.personalWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 min-w-[200px]">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Now
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="hover:text-white">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save for Later
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Quick Booking Banner */}
            {profile.liveSessionsEnabled && availability?.availabilities?.length > 0 && (
              <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Live Sessions Available
                      </h3>
                      <p className="text-green-100">
                        Starting from ${profile.individualSessionRate} per session
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Book Session
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8 w-[90vw]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Enhanced Navigation */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl mb-8 shadow-lg">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-white sticky top-15 shadow-sm z-40">
                  <TabsTrigger
                    value="about"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md text-md"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="booking"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md text-md"
                  >
                    Book
                  </TabsTrigger>
                  <TabsTrigger
                    value="courses"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md text-md"
                  >
                    Courses
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md text-md"
                  >
                    Reviews
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md text-md"
                  >
                    Skills
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6 mt-6 px-2 pb-2">
                  {/* Enhanced About Section */}
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Users className="h-6 w-6 text-blue-600" />
                        About {instructor.firstName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {profile.bio || profile.shortBio || "No bio available"}
                        </p>
                      </div>

                      <Separator />

                      {/* Education */}
                      {profile.qualifications && profile.qualifications.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                            Qualifications
                          </h4>
                          <div className="space-y-2">
                            {profile.qualifications.map((qual, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-700">{qual}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expertise */}
                      {profile.expertise && profile.expertise.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                            <Award className="h-5 w-5 text-amber-600" />
                            Expertise
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {profile.expertise.map((exp, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100"
                              >
                                <Award className="h-4 w-4 text-amber-600 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">
                                  {exp}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Separator />

                      {/* Teaching Philosophy */}
                      {profile.teachingStyle && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                            <Target className="h-5 w-5 text-purple-600" />
                            Teaching Style
                          </h4>
                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                            <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                              "{profile.teachingStyle}"
                            </blockquote>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

            

<TabsContent value="booking" className="space-y-6 mt-6 px-2 pb-2">
  {profile.liveSessionsEnabled ? (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="h-6 w-6 text-green-600" />
          Book a Live Session
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {availabilityLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading availability...</span>
          </div>
        ) : availability?.availabilities?.length > 0 ? (
          <div className="space-y-8">
            {/* Step 1: Choose Your Date */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Step 1: Choose Your Date
                </h4>
                <p className="text-sm text-gray-600">Select a date to see available time slots</p>
              </div>
              <div className="p-6">
                {/* Enhanced Calendar with real data */}
                <div className="mb-6">
                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-semibold text-gray-600 py-3 bg-gray-50 rounded-lg">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {(() => {
                      const calendarData = generateCalendarData();
                      const today = new Date();
                      
                      return calendarData.map((dayData, index) => {
                        const isToday = dayData.date.toDateString() === today.toDateString();
                        const isSelected = selectedDate && dayData.date.toDateString() === selectedDate.toDateString();
                        const isPast = dayData.date < today;
                        const isDisabled = isPast || !dayData.hasSlots;
                        
                        return (
                          <div
                            key={index}
                            className={`aspect-square p-0 cursor-pointer transition-all duration-200 rounded-xl border-2 ${
                              isPast 
                                ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50' 
                                : isSelected 
                                ? 'bg-blue-500 text-white border-blue-600 shadow-lg transform scale-105' 
                                : isToday 
                                ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' 
                                : dayData.hasSlots 
                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300 hover:shadow-md hover:transform hover:scale-105' 
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => !isDisabled && handleDateSelection(dayData.date)}
                          >
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className={`text-lg font-semibold mb-1 ${
                                isSelected ? 'text-white' : 
                                isPast ? 'text-gray-400' :
                                isToday ? 'text-blue-600' :
                                dayData.hasSlots ? 'text-gray-800' : 'text-gray-500'
                              }`}>
                                {dayData.date.getDate()}
                              </div>
                              {dayData.hasSlots && !isPast && (
                                <div className={`flex items-center gap-1 ${
                                  isSelected ? 'text-blue-100' : 'text-green-600'
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    isSelected ? 'bg-blue-100' : 'bg-green-500'
                                  }`} />
                                  <span className="text-xs font-medium">
                                    {dayData.slotCount} slots
                                  </span>
                                </div>
                              )}
                              {isToday && (
                                <div className="text-xs text-blue-900 font-medium mt-1">
                                  Today
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600">Available slots</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Selected date</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                    <span className="text-gray-600">Today</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-600">No slots</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Choose Your Time Slot */}
            {selectedDate && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Step 2: Choose Your Time Slot
                  </h4>
                  <p className="text-sm text-gray-600">
                    Available slots for {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="p-6">
                  {(() => {
                    const selectedDateKey = selectedDate.toDateString();
                    const slotsForDate = availability.availabilities
                      .flatMap(avail => avail.generatedSlots || [])
                      .filter(slot => {
                        const slotDate = new Date(slot.startTime);
                        return slotDate.toDateString() === selectedDateKey && 
                               slot.isAvailable && 
                               !slot.isBooked;
                      })
                      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

                    return slotsForDate.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {slotsForDate.map((slot) => {
                          const slotDate = new Date(slot.startTime);
                          const slotEndTime = new Date(slot.endTime);
                          const availabilityData = availability.availabilities.find(avail => avail.id === slot.availabilityId);
                          const isIndividualSlot = slot.maxBookings === 1;
                          const compatibleOfferings = offeringsData?.filter(offering => {
                            if (isIndividualSlot) {
                              return offering.sessionType === 'INDIVIDUAL' && offering.isActive;
                            } else {
                              return (offering.sessionType === 'SMALL_GROUP' || 
                                      offering.sessionType === 'LARGE_GROUP' || 
                                      offering.sessionType === 'WORKSHOP' || 
                                      offering.sessionType === 'MASTERCLASS') && offering.isActive;
                            }
                          }) || [];
                          
                          return (
                            <div 
                              key={slot.id} 
                              className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                              onClick={() => {
                                setSelectedSlot(slot);
                                handleBookingCardClick(slot);
                              }}
                            >
                              {/* Decorative gradient overlay */}
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-70 transition-opacity" />
                              
                              {/* Status Badge */}
                              <div className="absolute top-4 right-4 z-10">
                                <Badge className={`${
                                  availabilityData?.autoAcceptBookings 
                                    ? 'bg-green-100 text-green-700 border-green-200' 
                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                }`}>
                                  {availabilityData?.autoAcceptBookings ? 'Instant Book' : 'Approval Needed'}
                                </Badge>
                              </div>
                              
                              <div className="relative z-10 space-y-4">
                                {/* Time Display */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    <span className="font-bold text-lg text-gray-900">
                                      {slotDate.toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit',
                                        hour12: true 
                                      })}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Duration: {slot.slotDuration} minutes
                                  </div>
                                </div>
                                
                                {/* Session Type Info */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    {isIndividualSlot ? (
                                      <User className="h-4 w-4 text-purple-600" />
                                    ) : (
                                      <Users className="h-4 w-4 text-green-600" />
                                    )}
                                    <span className="text-sm font-medium text-gray-700">
                                      {isIndividualSlot ? 'Individual Session' : `Group Session (up to ${slot.maxBookings})`}
                                    </span>
                                  </div>
                                  
                                  {/* Compatible Offerings Count */}
                                  <div className="flex items-center gap-2">
                                    <Video className="h-4 w-4 text-indigo-600" />
                                    <span className="text-sm text-gray-600">
                                      {compatibleOfferings.length} offering{compatibleOfferings.length !== 1 ? 's' : ''} available
                                    </span>
                                  </div>
                                  
                                  {/* Price Range */}
                                  {compatibleOfferings.length > 0 && (
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-4 w-4 text-green-600" />
                                      <span className="text-sm text-gray-600">
                                        {compatibleOfferings.length === 1 
                                          ? `$${compatibleOfferings[0].basePrice}`
                                          : `$${Math.min(...compatibleOfferings.map(o => o.basePrice))} - $${Math.max(...compatibleOfferings.map(o => o.basePrice))}`
                                        }
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Additional Info */}
                                <div className="space-y-2">
                                  {availabilityData?.notes && (
                                    <div className="flex items-start gap-2">
                                      <MessageSquare className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm text-gray-600 line-clamp-2">
                                        {availabilityData.notes}
                                      </span>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Shield className="h-3 w-3" />
                                      {availabilityData?.timezone || 'UTC'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      {slot.currentBookings}/{slot.maxBookings} booked
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Book Button */}
                              <Button 
                                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                                size="lg"
                                disabled={compatibleOfferings.length === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSlot(slot);
                                  handleBookingCardClick(slot);
                                }}
                              >
                                {compatibleOfferings.length === 0 ? (
                                  <>
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    No Offerings Available
                                  </>
                                ) : (
                                  <>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Book This Slot
                                  </>
                                )}
                              </Button>
                              
                              {/* Hover effect for available offerings preview */}
                              {compatibleOfferings.length > 0 && (
                                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg">
                                    <div className="text-xs text-gray-600 mb-1">Available offerings:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {compatibleOfferings.slice(0, 2).map(offering => (
                                        <Badge key={offering.id} variant="outline" className="text-xs">
                                          {offering.title}
                                        </Badge>
                                      ))}
                                      {compatibleOfferings.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{compatibleOfferings.length - 2} more
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Clock className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">No Available Slots</h3>
                        <p className="text-gray-600">
                          All time slots for this date are currently booked or unavailable.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setSelectedDate(null)}
                        >
                          Choose Different Date
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {availability.summary?.totalAvailableSlots || 0}
                  </div>
                  <div className="text-sm text-blue-700">Total Available Slots</div>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {offeringsData?.filter(o => o.isActive).length || 0}
                  </div>
                  <div className="text-sm text-green-700">Session Types</div>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {availability.summary?.nextAvailableSlot ? (
                      format(new Date(availability.summary.nextAvailableSlot.startTime), 'MMM d')
                    ) : 'N/A'}
                  </div>
                  <div className="text-sm text-purple-700">Next Available</div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Booking Tips & Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-800 text-sm">Advance Booking</div>
                      <div className="text-xs text-blue-600">
                        Book at least {availability.availabilities[0]?.minAdvanceHours || 12} hours in advance
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-800 text-sm">Session Buffer</div>
                      <div className="text-xs text-blue-600">
                        {availability.availabilities[0]?.bufferMinutes || 15} min break between sessions
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-800 text-sm">Cancellation</div>
                      <div className="text-xs text-blue-600">
                        Free cancellation up to 2 hours before session
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-800 text-sm">Meeting Link</div>
                      <div className="text-xs text-blue-600">
                        Sent 15 minutes before session start
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (!offeringsData || offeringsData.length === 0) ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">No Session Offerings Available</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              This instructor has time slots available but hasn't set up any session offerings yet. 
              Please contact them directly to schedule a session.
            </p>
            <div className="flex gap-3 justify-center">
              {user?.id === instructorId ? (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsCreateOfferingModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Offering
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Instructor
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">No Available Sessions</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              This instructor doesn't have any available time slots at the moment. 
              Check back later or contact them directly to schedule a session.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Instructor
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  ) : (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          Live Sessions Not Available
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          This instructor currently doesn't offer live sessions.
          Check out their recorded courses for a great learning experience!
        </p>
        <div className="flex gap-3 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Recorded Courses
          </Button>
          <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Instructor
          </Button>
        </div>
      </CardContent>
    </Card>
  )}
</TabsContent>

                <TabsContent
                  value="courses"
                  className="space-y-6 mt-6 px-2 pb-2"
                >
                  {/* Course Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search courses..."
                          className="pl-10 border-gray-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>

                  {/* Courses Grid */}
                  {coursesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Loading courses...</span>
                    </div>
                  ) : recentCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {recentCourses.map((course) => (
                        <Card
                          key={course.id}
                          className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:scale-105"
                        >
                          <div className="relative aspect-video">
                            <Image
                              src={course.thumbnail || "/placeholder.svg"}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button
                                size="lg"
                                className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
                              >
                                <Play className="h-6 w-6 text-white" />
                              </Button>
                            </div>
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-black/50 text-white">
                                {Math.floor((course.totalDuration || 0) / 3600)}h{" "}
                                {Math.floor(((course.totalDuration || 0) % 3600) / 60)}m
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <h4 className="font-semibold mb-2 text-lg line-clamp-2">
                              {course.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {course.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <TrendingUp className="h-4 w-4" />
                                <span>{course.views.toLocaleString()} views</span>
                              </div>
                              <Button size="sm" variant="outline">
                                View Course
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                      <CardContent className="p-12 text-center">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Courses Available</h3>
                        <p className="text-gray-600">This instructor hasn't published any courses yet.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent
                  value="reviews"
                  className="space-y-6 mt-6 px-2 pb-2"
                >
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <ReviewsSection
                        reviews={recentReviews}
                        averageRating={summary.averageRating}
                        totalReviews={summary.totalReviews}
                        instructorName={`${instructor.firstName} ${instructor.lastName}`}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="skills"
                  className="space-y-6 mt-6 px-2 pb-2"
                >
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Target className="h-6 w-6 text-indigo-600" />
                        Skills & Expertise
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.expertise?.map((skill, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-800">
                                {skill}
                              </span>
                              <Badge variant="default" className="ml-2">
                                Expert
                              </Badge>
                            </div>
                            <Progress value={95} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="space-y-6">
              {/* Quick Book Card */}
              {profile.liveSessionsEnabled && availability?.availabilities?.length > 0 && offeringsData && offeringsData.length > 0 && (
                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Book
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        ${offeringsData[0].basePrice}
                      </div>
                      <div className="text-sm text-green-100">
                        {offeringsData[0].title}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-100">Duration:</span>
                        <span className="font-medium">
                          {offeringsData[0].duration} minutes
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-100">Type:</span>
                        <span className="font-medium">
                          {offeringsData[0].sessionType === 'INDIVIDUAL' ? 'Individual' : 
                           offeringsData[0].sessionType === 'SMALL_GROUP' ? 'Small Group' : 'Group'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-100">Available:</span>
                        <span className="font-medium">
                          {availability.summary?.totalAvailabilities || 0} slots
                        </span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold"
                      size="lg"
                      onClick={() => {
                        const allGeneratedSlots = availability?.availabilities
                          ?.flatMap(avail => avail.generatedSlots || [])
                          .filter(slot => slot.isAvailable && !slot.isBooked)
                          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
                        
                        if (allGeneratedSlots && allGeneratedSlots.length > 0) {
                          const firstSlot = allGeneratedSlots[0];
                          // Find compatible offering for this slot
                          const compatibleOfferings = offeringsData.filter(offering => {
                            if (firstSlot.maxBookings === 1) {
                              return offering.sessionType === 'INDIVIDUAL';
                            } else {
                              return offering.sessionType === 'SMALL_GROUP' || offering.sessionType === 'LARGE_GROUP' || offering.sessionType === 'WORKSHOP' || offering.sessionType === 'MASTERCLASS';
                            }
                          });
                          
                                                     if (compatibleOfferings.length > 0) {
                             handleBookingCardClick(firstSlot);
                           } else {
                            toast.error("No compatible session offerings available for the next available slot.");
                          }
                        }
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Stats Card */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">
                        {summary.totalStudents.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Students</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        {summary.totalCourses}
                      </div>
                      <div className="text-xs text-gray-600">Courses</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Rating</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(summary.averageRating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">
                          {summary.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Response Time
                        </span>
                        <span className="font-semibold">
                          {stats.responseTime}h
                        </span>
                      </div>
                      <Progress
                        value={Math.max(0, 100 - stats.responseTime * 10)}
                        className="h-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Completion Rate
                        </span>
                        <span className="font-semibold">{stats.courseCompletionRate}%</span>
                      </div>
                      <Progress value={stats.courseCompletionRate} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Trust Score
                        </span>
                        <span className="font-semibold">{trustScore}/100</span>
                      </div>
                      <Progress value={trustScore} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Experience</span>
                      <span className="font-semibold">{profile.experience || 0} years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Languages & Availability Card */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5 text-emerald-600" />
                    Languages & Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {profile.languagesSpoken && profile.languagesSpoken.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">
                        Languages
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.languagesSpoken.map((lang, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-emerald-200 text-emerald-700"
                          >
                            {lang.language} ({lang.proficiency})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Live Sessions
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            profile.liveSessionsEnabled ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            profile.liveSessionsEnabled ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {profile.liveSessionsEnabled ? "Available" : "Not Available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Cards */}
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto p-4 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Send Message</div>
                    <div className="text-xs text-gray-500">
                      Usually responds in {stats.responseTime}h
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto p-4 border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <Heart className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">Follow Instructor</div>
                    <div className="text-xs text-gray-500">
                      Get notified of new content
                    </div>
                  </div>
                </Button>
              </div>

              {/* Trust Indicators */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                    Trust & Safety
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    {profile.isVerified && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-blue-800">
                            Verified Instructor
                          </div>
                          <div className="text-xs text-blue-600">
                            Identity confirmed
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-800">
                          Trust Score: {trustScore}/100
                        </div>
                        <div className="text-xs text-green-600">
                          Based on reviews & completion rate
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                      <Award className="h-5 w-5 text-amber-600" />
                      <div>
                        <div className="font-medium text-amber-800">
                          {profile.experience || 0}+ Years Experience
                        </div>
                        <div className="text-xs text-amber-600">
                          Proven track record
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Session Booking Modal */}
      {isBookingModalOpen && selectedBookingSlot && (
        <SessionBookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          selectedSlot={selectedBookingSlot}
          offeringsData={offeringsData}
          instructorName={`${instructor.firstName} ${instructor.lastName}`}
          instructorId={instructor.id}
          onBookingComplete={handleBookingComplete}
        />
      )}

      {/* Create First Offering Modal */}
      <CreateFirstOfferingModal
        isOpen={isCreateOfferingModalOpen}
        onClose={() => setIsCreateOfferingModalOpen(false)}
        onSuccess={handleCreateOfferingSuccess}
      />
    </div>
  );
}
