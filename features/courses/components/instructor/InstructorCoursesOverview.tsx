"use client";

import {
  Plus,
  BookOpen,
  Users,
  Star,
  TrendingUp,
  Trophy,
  Activity,
  UserPlus,
  CheckCircle,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseList } from "../../shared/CourseList";
import Link from "next/link";

interface InstructorCourseGridProps {
  limit?: number;
  showCreateButton?: boolean;
  onCreateCourse?: () => void;
}

export function InstructorCoursesOverview({
  limit = 6,
  showCreateButton = false,
  onCreateCourse,
}: InstructorCourseGridProps) {
  const handleCourseAction = (action: string, courseId: string) => {
    switch (action) {
      case "view":
        // Navigate to course details
        console.log("View course:", courseId);
        break;
      case "edit":
        // Navigate to course editor
        console.log("Edit course:", courseId);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Courses Overview Header */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Courses Overview</h2>
            <p className="text-muted-foreground">
              Manage and track your course performance
            </p>
          </div>
          {showCreateButton && (
            <Link href="/instructor/dashboard/courses/course-creation">

            <Button onClick={onCreateCourse}>
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
            </Link>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Total Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-xs text-muted-foreground">
                    Total Students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-xs text-muted-foreground">
                    Completion Rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Performance Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Performing Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                name: "Advanced React Development",
                students: 324,
                rating: 4.9,
                revenue: "$2,840",
              },
              {
                name: "JavaScript Fundamentals",
                students: 256,
                rating: 4.8,
                revenue: "$1,920",
              },
              {
                name: "Node.js Backend Development",
                students: 189,
                rating: 4.7,
                revenue: "$1,512",
              },
            ].map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {course.revenue}
                  </p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Recent Course Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                action: "New enrollment",
                course: "React Development",
                time: "2 hours ago",
                type: "enrollment",
              },
              {
                action: "Course completed",
                course: "JavaScript Fundamentals",
                time: "4 hours ago",
                type: "completion",
              },
              {
                action: "New review (5★)",
                course: "Node.js Backend",
                time: "6 hours ago",
                type: "review",
              },
              {
                action: "Course updated",
                course: "Advanced React",
                time: "1 day ago",
                type: "update",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    activity.type === "enrollment"
                      ? "bg-blue-100"
                      : activity.type === "completion"
                      ? "bg-green-100"
                      : activity.type === "review"
                      ? "bg-yellow-100"
                      : "bg-purple-100"
                  }`}
                >
                  {activity.type === "enrollment" && (
                    <UserPlus className="h-4 w-4 text-blue-600" />
                  )}
                  {activity.type === "completion" && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {activity.type === "review" && (
                    <Star className="h-4 w-4 text-yellow-600" />
                  )}
                  {activity.type === "update" && (
                    <Edit className="h-4 w-4 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.course}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      

      {/* Create Course CTA */}
      {/* {showCreateButton && (
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="mt-4 text-xl">Create New Course</CardTitle>
            <p className="mt-2 text-center text-muted-foreground">
              Start building your next course and share your knowledge with
              students worldwide
            </p>
            <Button className="mt-4" onClick={onCreateCourse}>
              Get Started
            </Button>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
