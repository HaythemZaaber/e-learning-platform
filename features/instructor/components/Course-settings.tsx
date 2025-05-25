"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Shield,
  Award,
  Users,
  MessageSquare,
  Download,
  Tag,
  Plus,
  X,
  Globe,
  Clock,
  DollarSign,
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

interface CourseSettingsProps {
  course?: Course
  onCourseUpdate?: (course: Course) => void
}

export function CourseSettings({ course, onCourseUpdate }: CourseSettingsProps) {
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

  const [newTag, setNewTag] = useState("")

  const updateSettings = (field: keyof CourseSettings, value: any) => {
    const updatedCourse = {
      ...currentCourse,
      settings: {
        ...currentCourse.settings,
        [field]: value,
      },
    }
    setCurrentCourse(updatedCourse)
    onCourseUpdate?.(updatedCourse)
  }

  const addTag = () => {
    if (newTag.trim() && !currentCourse.settings.tags.includes(newTag.trim())) {
      updateSettings("tags", [...currentCourse.settings.tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateSettings(
      "tags",
      currentCourse.settings.tags.filter((tag) => tag !== tagToRemove),
    )
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="border-primary-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <CardTitle className="flex items-center gap-2 text-primary-700">
            <Settings className="w-5 h-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="visibility">Course Visibility</Label>
              <Select defaultValue="public">
                <SelectTrigger className="border-gray-300 focus:border-primary-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Public - Anyone can find and enroll
                    </div>
                  </SelectItem>
                  <SelectItem value="unlisted">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Unlisted - Only with direct link
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Private - Invitation only
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollment">Enrollment Period</Label>
              <Select defaultValue="always">
                <SelectTrigger className="border-gray-300 focus:border-primary-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Always Open
                    </div>
                  </SelectItem>
                  <SelectItem value="limited">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Limited Time
                    </div>
                  </SelectItem>
                  <SelectItem value="scheduled">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Scheduled Start
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricing">Pricing Model</Label>
            <Select defaultValue="one-time">
              <SelectTrigger className="border-gray-300 focus:border-primary-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Free Course
                  </div>
                </SelectItem>
                <SelectItem value="one-time">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    One-time Payment
                  </div>
                </SelectItem>
                <SelectItem value="subscription">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Subscription
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Student Interaction Settings */}
      <Card className="border-secondary-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-secondary-50 to-accent-50">
          <CardTitle className="flex items-center gap-2 text-secondary-700">
            <Users className="w-5 h-5" />
            Student Interaction
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-secondary-600" />
                <Label htmlFor="comments">Allow Comments</Label>
              </div>
              <p className="text-sm text-gray-600">Students can leave comments on lessons</p>
            </div>
            <Switch
              id="comments"
              checked={currentCourse.settings.allowComments}
              onCheckedChange={(checked) => updateSettings("allowComments", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-secondary-600" />
                <Label htmlFor="downloads">Allow Downloads</Label>
              </div>
              <p className="text-sm text-gray-600">Students can download course materials</p>
            </div>
            <Switch
              id="downloads"
              checked={currentCourse.settings.allowDownloads}
              onCheckedChange={(checked) => updateSettings("allowDownloads", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-secondary-600" />
                <Label htmlFor="certificate">Certificate of Completion</Label>
              </div>
              <p className="text-sm text-gray-600">Issue certificates when students complete the course</p>
            </div>
            <Switch
              id="certificate"
              checked={currentCourse.settings.certificateEnabled}
              onCheckedChange={(checked) => updateSettings("certificateEnabled", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Course Tags */}
      <Card className="border-accent-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-accent-50 to-primary-50">
          <CardTitle className="flex items-center gap-2 text-accent-700">
            <Tag className="w-5 h-5" />
            Course Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Add Tags</Label>
            <p className="text-sm text-gray-600">Help students find your course with relevant tags</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
                className="border-gray-300 focus:border-accent-500"
              />
              <Button onClick={addTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {currentCourse.settings.tags.length > 0 && (
            <div className="space-y-2">
              <Label>Current Tags</Label>
              <div className="flex flex-wrap gap-2">
                {currentCourse.settings.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card className="border-primary-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <CardTitle className="flex items-center gap-2 text-primary-700">
            <Shield className="w-5 h-5" />
            Prerequisites
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Required Courses</Label>
            <p className="text-sm text-gray-600">Select courses that students must complete before enrolling</p>
            <Select>
              <SelectTrigger className="border-gray-300 focus:border-primary-500">
                <SelectValue placeholder="Select prerequisite courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intro-programming">Introduction to Programming</SelectItem>
                <SelectItem value="web-basics">Web Development Basics</SelectItem>
                <SelectItem value="design-fundamentals">Design Fundamentals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Recommended Experience</Label>
            <Textarea
              placeholder="Describe any recommended background knowledge or experience"
              className="border-gray-300 focus:border-primary-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-primary-600 hover:bg-primary-700">Save Settings</Button>
      </div>
    </div>
  )
}
