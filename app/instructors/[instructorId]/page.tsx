import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-secondary"
import {CourseCard}  from "@/components/shared/CourseCard"
import { EnhancedBookingCalendar } from "@/features/instructors/components/instructorPage/BookingCalendar"
import { ReelsGrid } from "@/features/instructors/components/instructorPage/ReelsGrid"
import { EnhancedStoriesViewer } from "@/features/instructors/components/instructorPage/StoriesViewer"
import { EnhancedReviewsSection } from "@/features/instructors/components/instructorPage/ReviewsSection"
import { instructors } from "@/data/instructorsData"

interface InstructorPageProps {
  params: Promise<{ instructorId: string }>
}

export default async function InstructorPage({ params }: InstructorPageProps) {
  const { instructorId } = await params
  const instructor = instructors.find((i) => i.id === instructorId)

  if (!instructor) {
    notFound()
  }

  const {
    name,
    title,
    avatar,
    coverImage,
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
  } = instructor

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {coverImage && (
          <div className="h-64 md:h-80 relative">
            <Image src={coverImage || "/placeholder.svg"} alt={`${name} cover`} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        <div className="container relative">
          <div className={`${coverImage ? "-mt-20" : "pt-8"} pb-8`}>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full overflow-hidden border-4 border-background shadow-lg">
                  <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
                </div>
                {isOnline && (
                  <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-background rounded-full"></span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
                      {isVerified && <CheckCircle className="h-6 w-6 text-blue-500" />}
                    </div>
                    <p className="text-lg text-muted-foreground mb-3">{title}</p>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                        <span className="font-semibold">{rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({reviewsCount.toLocaleString()} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{studentsCount.toLocaleString()} students</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{coursesCount} courses</span>
                      </div>
                      {location && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {categories.map((category) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                      {liveSessionsEnabled && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">🔴 Live Sessions</Badge>
                      )}
                      {reels.length > 0 && (
                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                          <Play className="h-3 w-3 mr-1" />
                          {reels.length} Reels
                        </Badge>
                      )}
                    </div>

                    {/* Live Session Quick Info */}
                    {liveSessionsEnabled && nextAvailableSlot && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                              Next available: {nextAvailableSlot.time} • ${nextAvailableSlot.price}
                            </span>
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Social Links */}
                    {Object.keys(socialLinks).length > 0 && (
                      <div className="flex gap-3">
                        {socialLinks.twitter && (
                          <Button variant="outline" size="icon" asChild>
                            <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter className="h-4 w-4" />
                              <span className="sr-only">Twitter</span>
                            </Link>
                          </Button>
                        )}
                        {socialLinks.linkedin && (
                          <Button variant="outline" size="icon" asChild>
                            <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                              <span className="sr-only">LinkedIn</span>
                            </Link>
                          </Button>
                        )}
                        {socialLinks.youtube && (
                          <Button variant="outline" size="icon" asChild>
                            <Link href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                              <Youtube className="h-4 w-4" />
                              <span className="sr-only">YouTube</span>
                            </Link>
                          </Button>
                        )}
                        {socialLinks.website && (
                          <Button variant="outline" size="icon" asChild>
                            <Link href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Website</span>
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" className="min-w-[120px]">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="lg">
                      <Heart className="h-4 w-4 mr-2" />
                      Follow
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Sticky Tabs */}
            <div className="sticky top-16 z-40 bg-background border-b mb-6">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="booking">Book</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="reels">Reels</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6 mt-6">
                  {/* Stories Section */}
                  {(stories.length > 0 || storyHighlights.length > 0) && (
                    <Card>
                      <CardContent className="p-6">
                        <EnhancedStoriesViewer
                          highlights={storyHighlights}
                          recentStories={stories}
                          instructorName={name}
                          instructorAvatar={avatar}
                        />
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        About {name.split(" ")[0]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">{bio}</p>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Education
                        </h4>
                        <ul className="space-y-1">
                          {education.map((edu, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {edu}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Certifications
                        </h4>
                        <ul className="space-y-1">
                          {certifications.map((cert, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {cert}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Teaching Philosophy
                        </h4>
                        <p className="text-sm text-muted-foreground italic">"{philosophy}"</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="booking" className="space-y-6 mt-6">
                  {liveSessionsEnabled ? (
                    <EnhancedBookingCalendar
                      availability={availability}
                      instructorName={name}
                      sessionPricing={sessionPricing}
                      maxGroupSize={maxGroupSize}
                      timezone={timezone}
                      onBookSession={(booking) => {
                        console.log("Booking:", booking)
                        // Handle booking logic here
                      }}
                    />
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Live Sessions Not Available</h3>
                        <p className="text-muted-foreground">
                          This instructor currently doesn't offer live sessions. Check out their recorded courses
                          instead!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="courses" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Courses by {name.split(" ")[0]}</h3>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {courses.map((course) => (
                    CourseCard ey={course.id} course={course} />
                      ))}
                    </div> */}
                  </div>

                  {recordedCourses.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Recorded Sessions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recordedCourses.map((course) => (
                          <Card key={course.id} className="overflow-hidden">
                            <div className="relative aspect-video">
                              <Image
                                src={course.thumbnail || "/placeholder.svg"}
                                alt={course.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Button size="lg" className="rounded-full">
                                  <Play className="h-6 w-6" />
                                </Button>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">{course.title}</h4>
                              <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {Math.floor((course.duration || 0) / 3600)}h{" "}
                                    {Math.floor(((course.duration || 0) % 3600) / 60)}m
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">{course.views.toLocaleString()} views</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reels" className="space-y-6 mt-6">
                  <ReelsGrid reels={reels} instructorName={name} />
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6 mt-6">
                  <EnhancedReviewsSection
                    reviews={reviews}
                    averageRating={rating}
                    totalReviews={reviewsCount}
                    instructorName={name}
                  />
                </TabsContent>

                <TabsContent value="skills" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills & Expertise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {skills.map((skill, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="font-medium">{skill.name}</span>
                            <Badge
                              variant={
                                skill.proficiency === "Expert"
                                  ? "default"
                                  : skill.proficiency === "Advanced"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {skill.proficiency}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Booking Card */}
            {liveSessionsEnabled && nextAvailableSlot && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Book</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${nextAvailableSlot.price}</div>
                    <div className="text-sm text-muted-foreground">Next available session</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Date:</span>
                      <span className="font-medium">{nextAvailableSlot.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time:</span>
                      <span className="font-medium">{nextAvailableSlot.time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{nextAvailableSlot.type}</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Book This Session
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Students</span>
                  <span className="font-semibold">{studentsCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Courses</span>
                  <span className="font-semibold">{coursesCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Rating</span>
                  <span className="font-semibold">{rating.toFixed(1)}/5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-semibold">{responseTimeHours}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-semibold">{completionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-semibold">{experience} years</span>
                </div>
                {weeklyBookings > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Weekly Bookings</span>
                    <span className="font-semibold">{weeklyBookings}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content Engagement Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Content Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Views</span>
                  <span className="font-semibold">{contentEngagement.totalViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Likes</span>
                  <span className="font-semibold">{contentEngagement.totalLikes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Engagement Rate</span>
                  <span className="font-semibold">{contentEngagement.avgEngagementRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Reels Posted</span>
                  <span className="font-semibold">{reels.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Languages Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <Badge key={language} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
