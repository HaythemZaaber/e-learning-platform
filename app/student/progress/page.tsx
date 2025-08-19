"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  Calendar,
  BookOpen,
  CheckCircle,
  Star,
  BarChart3,
  Trophy,
  Activity,
  Zap,
  Flame,
  Bookmark,
  Users,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data - replace with real data from your API
const mockData = {
  overallStats: {
    totalCourses: 8,
    completedCourses: 3,
    inProgressCourses: 4,
    notStartedCourses: 1,
    totalHoursLearned: 45,
    averageGrade: 87,
    currentStreak: 12,
    longestStreak: 25,
    certificatesEarned: 2,
    totalPoints: 1250,
  },
  monthlyProgress: [
    { month: "Jan", hours: 12, courses: 2 },
    { month: "Feb", hours: 18, courses: 3 },
    { month: "Mar", hours: 15, courses: 2 },
    { month: "Apr", hours: 22, courses: 4 },
    { month: "May", hours: 28, courses: 5 },
    { month: "Jun", hours: 35, courses: 6 },
  ],
  achievements: [
    {
      id: 1,
      title: "First Course Completed",
      description: "Completed your first course",
      icon: CheckCircle,
      earned: true,
      earnedDate: "2024-01-15",
      points: 100,
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Maintained a 7-day learning streak",
      icon: Flame,
      earned: true,
      earnedDate: "2024-02-20",
      points: 200,
    },
    {
      id: 3,
      title: "Perfect Score",
      description: "Achieved 100% on a course assessment",
      icon: Star,
      earned: true,
      earnedDate: "2024-03-10",
      points: 150,
    },
    {
      id: 4,
      title: "Social Learner",
      description: "Participated in 10 discussion forums",
      icon: Users,
      earned: false,
      points: 100,
    },
    {
      id: 5,
      title: "Global Explorer",
      description: "Learned from instructors in 5 different countries",
      icon: Globe,
      earned: false,
      points: 300,
    },
  ],
  courseProgress: [
    {
      id: 1,
      title: "Advanced JavaScript",
      instructor: "Sarah Johnson",
      progress: 85,
      grade: 92,
      timeSpent: 12,
      lastAccessed: "2 days ago",
      nextMilestone: "Complete Module 5",
    },
    {
      id: 2,
      title: "React Fundamentals",
      instructor: "Mike Chen",
      progress: 65,
      grade: 88,
      timeSpent: 8,
      lastAccessed: "1 week ago",
      nextMilestone: "Build Todo App",
    },
    {
      id: 3,
      title: "UI/UX Design",
      instructor: "Emily Davis",
      progress: 100,
      grade: 95,
      timeSpent: 15,
      lastAccessed: "3 weeks ago",
      nextMilestone: "Certificate earned!",
    },
  ],
  learningStreak: {
    currentStreak: 12,
    longestStreak: 25,
    totalDays: 45,
    weeklyActivity: [5, 7, 6, 4, 7, 3, 6], // Days per week
  },
};

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedTab, setSelectedTab] = useState("overview");

  const getStreakColor = (streak: number) => {
    if (streak >= 20) return "text-red-600";
    if (streak >= 10) return "text-orange-600";
    if (streak >= 5) return "text-yellow-600";
    return "text-green-600";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overallStats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {mockData.overallStats.completedCourses} completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overallStats.totalHoursLearned}h</div>
            <p className="text-xs text-muted-foreground">
              Total time invested
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className={`h-4 w-4 ${getStreakColor(mockData.overallStats.currentStreak)}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStreakColor(mockData.overallStats.currentStreak)}`}>
              {mockData.overallStats.currentStreak} days
            </div>
            <p className="text-xs text-muted-foreground">
              Best: {mockData.overallStats.longestStreak} days
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overallStats.averageGrade}%</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Course Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Learning Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flame className="h-5 w-5 mr-2 text-orange-600" />
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className={`text-4xl font-bold ${getStreakColor(mockData.learningStreak.currentStreak)}`}>
                    {mockData.learningStreak.currentStreak} days
                  </div>
                  <p className="text-muted-foreground">Current streak</p>
                  <div className="flex justify-center space-x-1">
                    {mockData.learningStreak.weeklyActivity.map((days, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          days > 0 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {days}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Last 7 days activity</p>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Monthly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.monthlyProgress.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">{month.hours}h</span>
                        <span className="text-sm text-muted-foreground">{month.courses} courses</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Course Progress Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="space-y-4">
            {mockData.courseProgress.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getGradeColor(course.grade)}`}>
                        {course.grade}%
                      </div>
                      <p className="text-sm text-muted-foreground">Grade</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Time Spent</p>
                        <p className="font-medium">{course.timeSpent}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Accessed</p>
                        <p className="font-medium">{course.lastAccessed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Milestone</p>
                        <p className="font-medium text-xs">{course.nextMilestone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockData.achievements.map((achievement) => (
              <Card key={achievement.id} className={`hover:shadow-md transition-shadow ${
                achievement.earned ? 'border-green-200' : 'border-gray-200'
              }`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <achievement.icon className={`h-8 w-8 ${
                      achievement.earned ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className="font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant={achievement.earned ? "default" : "secondary"}>
                      {achievement.points} pts
                    </Badge>
                    {achievement.earned && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Earned
                      </Badge>
                    )}
                  </div>
                  {achievement.earned && achievement.earnedDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(achievement.earnedDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Learning Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-purple-600" />
                  Learning Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Most Active Day</span>
                    <span className="font-medium">Wednesday</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Peak Learning Time</span>
                    <span className="font-medium">7:00 PM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Session</span>
                    <span className="font-medium">45 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Programming</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Design</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Business</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Marketing</span>
                      <span>82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}