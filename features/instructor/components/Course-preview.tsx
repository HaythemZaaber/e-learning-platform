"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  Globe,
  Download,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  PuzzleIcon as Quiz,
  Eye,
  Heart,
  Share2,
} from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: string
  language: string
  price: number
  thumbnail: string
  status: "draft" | "review" | "published"
  sections: Section[]
  settings: CourseSettings
}

interface Section {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  resources: Resource[]
}

interface Lesson {
  id: string
  title: string
  type: "video" | "text" | "quiz" | "assignment"
  content: string
  duration: string
  resources: Resource[]
}

interface Resource {
  id: string
  name: string
  type: "pdf" | "image" | "video" | "audio" | "document"
  url: string
  size: string
}

interface CourseSettings {
  allowComments: boolean
  allowDownloads: boolean
  certificateEnabled: boolean
  prerequisiteCourses: string[]
  tags: string[]
}

interface CoursePreviewProps {
  course?: Course
}

export function CoursePreview({ course }: CoursePreviewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("overview")

  const mockCourse: Course = course || {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description:
      "Learn to build modern web applications from scratch using the latest technologies including React, Node.js, and MongoDB. This comprehensive course covers everything from basic HTML/CSS to advanced full-stack development.",
    category: "programming",
    level: "BEGINNER",
    language: "english",
    price: 99.99,
    thumbnail: "/placeholder.svg?height=400&width=600",
    status: "draft",
    sections: [
      {
        id: "1",
        title: "Getting Started",
        description: "Introduction to web development",
        lessons: [
          { id: "1", title: "Welcome to the Course", type: "video", content: "", duration: "5:30", resources: [] },
          {
            id: "2",
            title: "Setting Up Your Environment",
            type: "video",
            content: "",
            duration: "12:45",
            resources: [],
          },
          { id: "3", title: "Course Overview", type: "text", content: "", duration: "8:00", resources: [] },
        ],
        resources: [],
      },
      {
        id: "2",
        title: "HTML & CSS Fundamentals",
        description: "Learn the building blocks of web development",
        lessons: [
          { id: "4", title: "HTML Basics", type: "video", content: "", duration: "25:30", resources: [] },
          { id: "5", title: "CSS Styling", type: "video", content: "", duration: "30:15", resources: [] },
          { id: "6", title: "Practice Quiz", type: "quiz", content: "", duration: "10:00", resources: [] },
        ],
        resources: [],
      },
    ],
    settings: {
      allowComments: true,
      allowDownloads: false,
      certificateEnabled: true,
      prerequisiteCourses: [],
      tags: ["web development", "react", "javascript", "beginner"],
    },
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "text":
        return <FileText className="w-4 h-4" />
      case "quiz":
        return <Quiz className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const totalLessons = mockCourse.sections.reduce((total, section) => total + section.lessons.length, 0)
  const totalDuration = mockCourse.sections.reduce(
    (total, section) =>
      total +
      section.lessons.reduce((sectionTotal, lesson) => {
        const [minutes, seconds] = lesson.duration.split(":").map(Number)
        return sectionTotal + minutes + seconds / 60
      }, 0),
    0,
  )

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <Card className="border-primary-200 shadow-lg">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={mockCourse.thumbnail || "/placeholder.svg"}
              alt={mockCourse.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-t-lg flex items-center justify-center">
              <Button size="lg" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30">
                <Play className="w-6 h-6 mr-2" />
                Preview Course
              </Button>
            </div>
            <Badge className="absolute top-4 right-4 bg-primary-600 text-white">
              {mockCourse.status.charAt(0).toUpperCase() + mockCourse.status.slice(1)}
            </Badge>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockCourse.title}</h1>
                <p className="text-gray-600 mb-4">{mockCourse.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {mockCourse.settings.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {Math.floor(totalDuration / 60)}h {Math.floor(totalDuration % 60)}m
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {totalLessons} lessons
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {mockCourse.level}
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {mockCourse.language}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {mockCourse.price > 0 ? `$${mockCourse.price}` : "Free"}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="instructor">Instructor</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <span>Build modern, responsive websites from scratch</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <span>Master HTML, CSS, and JavaScript fundamentals</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <span>Learn React for building interactive user interfaces</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <span>Understand backend development with Node.js</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary-600" />
                  <span className="text-sm">Q&A Support</span>
                </div>
                {mockCourse.settings.allowDownloads && (
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary-600" />
                    <span className="text-sm">Downloadable Resources</span>
                  </div>
                )}
                {mockCourse.settings.certificateEnabled && (
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary-600" />
                    <span className="text-sm">Certificate</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary-600" />
                  <span className="text-sm">Lifetime Access</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-4">
          {mockCourse.sections.map((section, index) => (
            <Card key={section.id}>
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        Section {index + 1}: {section.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{section.lessons.length} lessons</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {expandedSections.has(section.id) && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getLessonIcon(lesson.type)}
                          <span className="font-medium">
                            {lessonIndex + 1}. {lesson.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {lesson.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {lesson.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="instructor">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">John Doe</h3>
                  <p className="text-gray-600 mb-4">
                    Full-Stack Developer & Instructor with 8+ years of experience in web development. Passionate about
                    teaching and helping students achieve their goals.
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      4.8 instructor rating
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      12,450 students
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      15 courses
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Student Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold">4.8</div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Based on 1,234 reviews</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>U{review}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">Student {review}</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">
                            Excellent course! The instructor explains everything clearly and the projects are very
                            practical.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
