"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  BookOpen,
  Video,
  FileText,
  PuzzleIcon as Quiz,
  DotIcon as DragHandleDots2Icon,
  Trash2,
  Edit,
  Eye,
  Clock,
  Star,
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

interface CourseBuilderProps {
  course?: Course
  onCourseUpdate?: (course: Course) => void
  onProgressUpdate?: (progress: number) => void
}

export function CourseBuilder({ course, onCourseUpdate, onProgressUpdate }: CourseBuilderProps) {
  const [currentCourse, setCurrentCourse] = useState<Course>(
    course || {
      id: "",
      title: "",
      description: "",
      category: "",
      level: "",
      language: "",
      price: 0,
      thumbnail: "",
      status: "draft",
      sections: [],
      settings: {
        allowComments: true,
        allowDownloads: false,
        certificateEnabled: true,
        prerequisiteCourses: [],
        tags: [],
      },
    },
  )

  const [activeSection, setActiveSection] = useState<string | null>(null)

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "New Section",
      description: "",
      lessons: [],
      resources: [],
    }

    const updatedCourse = {
      ...currentCourse,
      sections: [...currentCourse.sections, newSection],
    }

    setCurrentCourse(updatedCourse)
    onCourseUpdate?.(updatedCourse)
    setActiveSection(newSection.id)
  }

  const addLesson = (sectionId: string) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: "New Lesson",
      type: "video",
      content: "",
      duration: "0:00",
      resources: [],
    }

    const updatedCourse = {
      ...currentCourse,
      sections: currentCourse.sections.map((section) =>
        section.id === sectionId ? { ...section, lessons: [...section.lessons, newLesson] } : section,
      ),
    }

    setCurrentCourse(updatedCourse)
    onCourseUpdate?.(updatedCourse)
  }

  const updateCourseInfo = (field: string, value: any) => {
    const updatedCourse = { ...currentCourse, [field]: value }
    setCurrentCourse(updatedCourse)
    onCourseUpdate?.(updatedCourse)

    // Update progress based on filled fields
    const filledFields = [
      updatedCourse.title,
      updatedCourse.description,
      updatedCourse.category,
      updatedCourse.level,
      updatedCourse.language,
    ].filter(Boolean).length

    const progress = Math.min((filledFields / 5) * 100, 100)
    onProgressUpdate?.(progress)
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

  return (
    <div className="space-y-6">
      {/* Course Information */}
      <Card className="border-primary-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <CardTitle className="flex items-center gap-2 text-primary-700">
            <BookOpen className="w-5 h-5" />
            Course Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="Enter course title"
                value={currentCourse.title}
                onChange={(e) => updateCourseInfo("title", e.target.value)}
                className="border-gray-300 focus:border-primary-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={currentCourse.category} onValueChange={(value) => updateCourseInfo("category", value)}>
                <SelectTrigger className="border-gray-300 focus:border-primary-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select value={currentCourse.level} onValueChange={(value) => updateCourseInfo("level", value)}>
                <SelectTrigger className="border-gray-300 focus:border-primary-500">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language *</Label>
              <Select value={currentCourse.language} onValueChange={(value) => updateCourseInfo("language", value)}>
                <SelectTrigger className="border-gray-300 focus:border-primary-500">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Course Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what students will learn in this course"
              value={currentCourse.description}
              onChange={(e) => updateCourseInfo("description", e.target.value)}
              className="border-gray-300 focus:border-primary-500 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              value={currentCourse.price}
              onChange={(e) => updateCourseInfo("price", Number.parseFloat(e.target.value) || 0)}
              className="border-gray-300 focus:border-primary-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Course Content */}
      <Card className="border-secondary-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-secondary-50 to-accent-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-secondary-700">
              <Video className="w-5 h-5" />
              Course Content
            </CardTitle>
            <Button onClick={addSection} className="bg-secondary-600 hover:bg-secondary-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {currentCourse.sections.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No sections yet</h3>
              <p className="mb-4">Start building your course by adding your first section</p>
              <Button onClick={addSection} className="bg-primary-600 hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Section
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentCourse.sections.map((section, sectionIndex) => (
                <Card key={section.id} className="border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DragHandleDots2Icon className="w-5 h-5 text-gray-400 cursor-move" />
                        <div>
                          <h3 className="font-medium">
                            Section {sectionIndex + 1}: {section.title}
                          </h3>
                          <p className="text-sm text-gray-500">{section.lessons.length} lessons</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {section.lessons.length === 0 ? (
                      <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-500 mb-3">No lessons in this section</p>
                        <Button variant="outline" size="sm" onClick={() => addLesson(section.id)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Lesson
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <DragHandleDots2Icon className="w-4 h-4 text-gray-400 cursor-move" />
                              {getLessonIcon(lesson.type)}
                              <div>
                                <p className="font-medium">
                                  {lessonIndex + 1}. {lesson.title}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {lesson.duration}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    {lesson.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => addLesson(section.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Lesson
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Statistics */}
      {currentCourse.sections.length > 0 && (
        <Card className="border-accent-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-accent-50 to-primary-50">
            <CardTitle className="flex items-center gap-2 text-accent-700">
              <Star className="w-5 h-5" />
              Course Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{currentCourse.sections.length}</div>
                <p className="text-sm text-gray-600">Sections</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">
                  {currentCourse.sections.reduce((total, section) => total + section.lessons.length, 0)}
                </div>
                <p className="text-sm text-gray-600">Lessons</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">
                  {currentCourse.price > 0 ? `$${currentCourse.price}` : "Free"}
                </div>
                <p className="text-sm text-gray-600">Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
    