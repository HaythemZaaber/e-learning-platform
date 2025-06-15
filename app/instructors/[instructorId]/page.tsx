import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Users,
  BookOpen,
  CheckCircle,
  MessageCircle,
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
import { CourseCard } from "@/features/courses/shared/CourseCard";
import BookingCalendar from "@/features/instructors/components/instructorPage/BookingCalendar";
import { ReelsGrid } from "@/features/instructors/components/instructorPage/ReelsGrid";
import { StoriesViewer } from "@/features/instructors/components/instructorPage/StoriesViewer";
import { ReviewsSection } from "@/features/instructors/components/instructorPage/ReviewsSection";
import { instructors } from "@/data/instructorsData";
import coverImg from "@/public/images/coverImage.jpg";

interface InstructorPageProps {
  params: Promise<{ instructorId: string }>;
}

interface BookingRequest {
  slotId: string;
  sessionType: string;
  offerPrice: number;
  topic: string;
  specialRequirements: string;
  studentInfo: {
    name: string;
    email: string;
    phone: string;
  };
  timestamp: string;
}

export default async function InstructorPage({ params }: InstructorPageProps) {
  const { instructorId } = await params;
  const instructor = instructors.find((i) => i.id === instructorId);

  if (!instructor) {
    notFound();
  }

  const {
    name,
    title,
    avatar,
    coverImage = coverImg,
    bio,
    rating,
    reviewsCount,
    studentsCount,
    coursesCount,
    responseTime,
    completionRate,
    languages,
    experience,
    education,
    certifications,
    philosophy,
    categories,
    skills,
    courses,
    reviews,
    location,
    socialLinks,
    isOnline,
    isVerified,
    liveSessionsEnabled,
    groupSessionsEnabled,
    availability,
    sessionPricing,
    maxGroupSize,
    nextAvailableSlot,
    weeklyBookings,
    responseTimeHours,
    reels,
    stories,
    storyHighlights,
    recordedCourses,
    contentEngagement,
    timezone,
  } = instructor;

  // Calculate engagement metrics
  const engagementRate = contentEngagement?.avgEngagementRate || 0;
  const trustScore = Math.round(
    rating * 15 + completionRate * 0.3 + (responseTimeHours <= 2 ? 20 : 10)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />

        {coverImage && (
          <div className="h-80 md:h-96 relative">
            <Image
              src={coverImg || "/placeholder.svg"}
              alt={`${name} cover`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          </div>
        )}

        <div className="container relative w-[90vw]">
          <div className={`${coverImg ? "-mt-60" : "pt-12"} pb-8`}>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row gap-6 items-start flex-1">
                <div className="relative group">
                  <div className="w-36 h-36 md:w-44 md:h-44 relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105">
                    <Image
                      src={avatar || "/placeholder.svg"}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {isOnline && (
                    <div className="absolute -bottom-2 -right-2">
                      <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Online
                      </div>
                    </div>
                  )}
                  {isVerified && (
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
                        {name}
                      </h1>
                    </div>
                    <p className="text-xl text-gray-600 mb-4 text-white">
                      {title}
                    </p>

                    {/* Enhanced Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-sm">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
                          <span className="font-bold text-xl">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-500">
                          {reviewsCount.toLocaleString()} reviews
                        </span>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-sm">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="h-6 w-6 text-blue-500" />
                          <span className="font-bold text-xl">
                            {studentsCount.toLocaleString()}
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
                            {coursesCount}
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
                      {categories.slice(0, 3).map((category) => (
                        <Badge
                          key={category}
                          variant="default"
                          className="px-3 py-1"
                        >
                          {category}
                        </Badge>
                      ))}
                      {categories.length > 3 && (
                        <Badge variant="outline" className="px-3 py-1">
                          +{categories.length - 3} more
                        </Badge>
                      )}
                      {liveSessionsEnabled && (
                        <Badge className="bg-red-100 border-gray-300 text-black px-3 py-1">
                          🔴 Live Sessions
                        </Badge>
                      )}
                      {reels.length > 0 && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1">
                          <Play className="h-3 w-3 mr-1" />
                          {reels.length} Reels
                        </Badge>
                      )}
                    </div>

                    {/* Location & Languages */}
                    {(location || languages.length > 0) && (
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                        {location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{location}</span>
                          </div>
                        )}
                        {languages.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <span>{languages.slice(0, 2).join(", ")}</span>
                            {languages.length > 2 && (
                              <span className="text-gray-400">
                                +{languages.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Social Links */}
                    {Object.keys(socialLinks).length > 0 && (
                      <div className="flex gap-2">
                        {socialLinks.twitter && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            asChild
                          >
                            <Link
                              href={socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Twitter className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {socialLinks.linkedin && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            asChild
                          >
                            <Link
                              href={socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Linkedin className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {socialLinks.youtube && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            asChild
                          >
                            <Link
                              href={socialLinks.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Youtube className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {socialLinks.website && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            asChild
                          >
                            <Link
                              href={socialLinks.website}
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
                    className="flex-1 text-white"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="lg">
                        <MoreHorizontal className="h-4 w-4 text-white" />
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
            {liveSessionsEnabled && nextAvailableSlot && (
              <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Next Available Session
                      </h3>
                      <p className="text-green-100">
                        {nextAvailableSlot.date} at {nextAvailableSlot.time} • $
                        {nextAvailableSlot.price}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Quick Book
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
            <div className="sticky top-0  bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl mb-8 shadow-lg">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-white  sticky top-15 shadow-sm z-40">
                  <TabsTrigger
                    value="about"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md text-md "
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="booking"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md text-md "
                  >
                    Book
                  </TabsTrigger>
                  <TabsTrigger
                    value="courses"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md text-md "
                  >
                    Courses
                  </TabsTrigger>
                  <TabsTrigger
                    value="reels"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md text-md "
                  >
                    Reels
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md text-md "
                  >
                    Reviews
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md text-md "
                  >
                    Skills
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6 mt-6 px-2 pb-2">
                  {/* Stories Section */}
                  {(stories.length > 0 || storyHighlights.length > 0) && (
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <StoriesViewer
                          highlights={storyHighlights}
                          recentStories={stories}
                          instructorName={name}
                          instructorAvatar={avatar}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Enhanced About Section */}
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Users className="h-6 w-6 text-blue-600" />
                        About {name.split(" ")[0]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {bio}
                        </p>
                      </div>

                      <Separator />

                      {/* Education */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                          Education
                        </h4>
                        <div className="space-y-2">
                          {education.map((edu, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700">{edu}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                          <Award className="h-5 w-5 text-amber-600" />
                          Certifications
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {certifications.map((cert, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100"
                            >
                              <Award className="h-4 w-4 text-amber-600 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">
                                {cert}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Teaching Philosophy */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                          <Target className="h-5 w-5 text-purple-600" />
                          Teaching Philosophy
                        </h4>
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                          <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                            "{philosophy}"
                          </blockquote>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="booking"
                  className="space-y-6 mt-6 px-2 pb-2"
                >
                  {liveSessionsEnabled ? (
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Calendar className="h-6 w-6 text-green-600" />
                          Book a Session
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <BookingCalendar
                          availability={availability}
                          instructorName={name}
                          sessionPricing={sessionPricing}
                          maxGroupSize={maxGroupSize}
                          timezone={timezone}
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                      <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">
                          Live Sessions Not Available
                        </h3>
                        <p className="text-gray-600 mb-6">
                          This instructor currently doesn't offer live sessions.
                          Check out their recorded courses instead!
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Browse Recorded Courses
                        </Button>
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

                  {/* Live Courses */}
                  {/* <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Video className="h-6 w-6 text-red-500" />
                      Live Courses by {name.split(" ")[0]}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {courses.map((course) => (
                        <Card
                          key={course.id}
                          className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
                        >
                          <CourseCard course={course} />
                        </Card>
                      ))}
                    </div>
                  </div> */}

                  {/* Recorded Courses */}
                  {recordedCourses.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Play className="h-6 w-6 text-purple-500" />
                        Recorded Sessions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {recordedCourses.map((course) => (
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
                                  {Math.floor((course.duration || 0) / 3600)}h{" "}
                                  {Math.floor(
                                    ((course.duration || 0) % 3600) / 60
                                  )}
                                  m
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
                                  <span>
                                    {course.views.toLocaleString()} views
                                  </span>
                                </div>
                                <Button size="sm" variant="outline">
                                  Watch Now
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reels" className="space-y-6 mt-6 px-2 pb-2">
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Play className="h-6 w-6 text-purple-600" />
                        {name.split(" ")[0]}'s Reels
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ReelsGrid reels={reels} instructorName={name} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="reviews"
                  className="space-y-6 mt-6 px-2 pb-2"
                >
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <ReviewsSection
                        reviews={reviews}
                        averageRating={rating}
                        totalReviews={reviewsCount}
                        instructorName={name}
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
                        {skills.map((skill, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-800">
                                {skill.name}
                              </span>
                              <Badge
                                variant={
                                  skill.proficiency === "Expert"
                                    ? "default"
                                    : skill.proficiency === "Advanced"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="ml-2"
                              >
                                {skill.proficiency}
                              </Badge>
                            </div>
                            <Progress
                              value={
                                skill.proficiency === "Expert"
                                  ? 95
                                  : skill.proficiency === "Advanced"
                                  ? 80
                                  : skill.proficiency === "Intermediate"
                                  ? 60
                                  : 40
                              }
                              className="h-2"
                            />
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
              {liveSessionsEnabled && nextAvailableSlot && (
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
                        ${nextAvailableSlot.price}
                      </div>
                      <div className="text-sm text-green-100">
                        Next available session
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-100">Date:</span>
                        <span className="font-medium">
                          {nextAvailableSlot.date}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-100">Time:</span>
                        <span className="font-medium">
                          {nextAvailableSlot.time}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-100">Type:</span>
                        <span className="font-medium capitalize">
                          {nextAvailableSlot.type}
                        </span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold"
                      size="lg"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book This Session
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
                        {studentsCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Students</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        {coursesCount}
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
                                i < Math.floor(rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Response Time
                        </span>
                        <span className="font-semibold">
                          {responseTimeHours}h
                        </span>
                      </div>
                      <Progress
                        value={Math.max(0, 100 - responseTimeHours * 10)}
                        className="h-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Completion Rate
                        </span>
                        <span className="font-semibold">{completionRate}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
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
                      <span className="font-semibold">{experience} years</span>
                    </div>

                    {weeklyBookings > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Weekly Bookings
                        </span>
                        <Badge variant="default" className="font-semibold">
                          {weeklyBookings}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Content Engagement Card */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Play className="h-5 w-5 text-purple-600" />
                    Content Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">
                        {contentEngagement.totalViews.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Total Views</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-pink-50 rounded-lg">
                        <div className="text-lg font-bold text-pink-600">
                          {contentEngagement.totalLikes.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Likes</div>
                      </div>
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <div className="text-lg font-bold text-indigo-600">
                          {reels.length}
                        </div>
                        <div className="text-xs text-gray-600">Reels</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        Engagement Rate
                      </span>
                      <span className="font-semibold">
                        {engagementRate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={engagementRate} className="h-2" />
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
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((language) => (
                        <Badge
                          key={language}
                          variant="outline"
                          className="border-emerald-200 text-emerald-700"
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {timezone && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Timezone
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{timezone}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Currently
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            isOnline ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {isOnline ? "Online" : "Offline"}
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
                      Usually responds in {responseTimeHours}h
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
                    {isVerified && (
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
                          {experience}+ Years Experience
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
    </div>
  );
}
