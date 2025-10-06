"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  Clock,
  Star,
  BarChart3,
  PieChart,
  Calendar,
  Award,
  Target,
  Eye,
  MessageSquare,
  Video,
  Download,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const mockAnalytics = {
  overview: {
    totalStudents: 1247,
    totalCourses: 12,
    totalEarnings: 45680,
    totalHours: 342,
    averageRating: 4.8,
    completionRate: 87,
  },
  monthlyData: [
    { month: "Jan", students: 120, earnings: 3200, hours: 45 },
    { month: "Feb", students: 135, earnings: 3800, hours: 52 },
    { month: "Mar", students: 142, earnings: 4200, hours: 48 },
    { month: "Apr", students: 158, earnings: 4800, hours: 55 },
    { month: "May", students: 165, earnings: 5200, hours: 58 },
    { month: "Jun", students: 172, earnings: 5600, hours: 62 },
  ],
  topCourses: [
    {
      id: 1,
      title: "Advanced React Patterns",
      students: 245,
      earnings: 12250,
      rating: 4.9,
    },
    {
      id: 2,
      title: "JavaScript Deep Dive",
      students: 198,
      earnings: 9900,
      rating: 4.8,
    },
    {
      id: 3,
      title: "Node.js Mastery",
      students: 156,
      earnings: 7800,
      rating: 4.7,
    },
    {
      id: 4,
      title: "TypeScript Fundamentals",
      students: 134,
      earnings: 6700,
      rating: 4.6,
    },
  ],
  studentEngagement: {
    averageSessionTime: 45,
    completionRate: 87,
    returnRate: 78,
    satisfactionScore: 4.8,
  },
};

export default function InstructorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedMetric, setSelectedMetric] = useState("students");

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "students":
        return Users;
      case "earnings":
        return DollarSign;
      case "courses":
        return BookOpen;
      case "hours":
        return Clock;
      default:
        return TrendingUp;
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "students":
        return "text-blue-600";
      case "earnings":
        return "text-green-600";
      case "courses":
        return "text-purple-600";
      case "hours":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Track your teaching performance and student engagement
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="earnings">Earnings</SelectItem>
                  <SelectItem value="courses">Courses</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Total Students
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {mockAnalytics.overview.totalStudents.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">
                        +12% from last month
                      </span>
                    </div>
                  </div>
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Total Earnings
                    </p>
                    <p className="text-3xl font-bold text-green-900">
                      ${mockAnalytics.overview.totalEarnings.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">
                        +8% from last month
                      </span>
                    </div>
                  </div>
                  <DollarSign className="w-12 h-12 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">
                      Average Rating
                    </p>
                    <p className="text-3xl font-bold text-purple-900">
                      {mockAnalytics.overview.averageRating}
                    </p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        Based on 1,247 reviews
                      </span>
                    </div>
                  </div>
                  <Star className="w-12 h-12 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">
                      Completion Rate
                    </p>
                    <p className="text-3xl font-bold text-orange-900">
                      {mockAnalytics.overview.completionRate}%
                    </p>
                    <div className="flex items-center mt-2">
                      <Target className="w-4 h-4 text-orange-600 mr-1" />
                      <span className="text-sm text-orange-600">
                        Above average
                      </span>
                    </div>
                  </div>
                  <Target className="w-12 h-12 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Monthly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Performance Chart</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      +23% Growth
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Compared to last period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Student Engagement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Student Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Average Session Time
                    </span>
                    <span className="text-lg font-bold">
                      {mockAnalytics.studentEngagement.averageSessionTime} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-lg font-bold">
                      {mockAnalytics.studentEngagement.completionRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Return Rate</span>
                    <span className="text-lg font-bold">
                      {mockAnalytics.studentEngagement.returnRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Satisfaction Score
                    </span>
                    <span className="text-lg font-bold">
                      {mockAnalytics.studentEngagement.satisfactionScore}/5
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Performing Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Performing Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.topCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students} students
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />$
                            {course.earnings.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {course.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200"
                      >
                        Top Performer
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
