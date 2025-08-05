"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_COURSE_ANALYTICS, GET_COURSE_BY_ID } from "@/features/courses/services/graphql/courseQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, DollarSign, Star, TrendingUp, Clock, Award } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CourseAnalyticsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const { data: courseData, loading: courseLoading } = useQuery(GET_COURSE_BY_ID, {
    variables: { id: courseId },
    skip: !courseId,
  });

  const { data: analyticsData, loading: analyticsLoading } = useQuery(GET_COURSE_ANALYTICS, {
    variables: { courseId },
    skip: !courseId,
  });

  const course = courseData?.course;
  const analytics = analyticsData?.courseAnalytics;

  if (courseLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Course not found</p>
        <Link href="/instructor/dashboard/courses">
          <Button className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Enrollments",
      value: analytics?.totalEnrollments || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Revenue",
      value: `$${(analytics?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Average Rating",
      value: (analytics?.averageRating || 0).toFixed(1),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completion Rate",
      value: `${(analytics?.completionRate || 0).toFixed(1)}%`,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/instructor/dashboard/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Analytics</h1>
            <p className="text-muted-foreground">{course.title}</p>
          </div>
        </div>
        <Badge variant={course.status === "published" ? "default" : "secondary"}>
          {course.status}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.monthlyEnrollments?.length > 0 ? (
              <div className="space-y-3">
                {analytics.monthlyEnrollments.slice(-6).map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(item.count / Math.max(...analytics.monthlyEnrollments.map((m: any) => m.count))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No enrollment data available</p>
            )}
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.monthlyRevenue?.length > 0 ? (
              <div className="space-y-3">
                {analytics.monthlyRevenue.slice(-6).map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(item.amount / Math.max(...analytics.monthlyRevenue.map((m: any) => m.amount))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">${item.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No revenue data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {analytics?.averageProgress?.toFixed(1) || 0}%
              </div>
              <p className="text-sm text-gray-600">Average Progress</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {analytics?.totalReviews || 0}
              </div>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {course.totalLectures || 0}
              </div>
              <p className="text-sm text-gray-600">Total Lectures</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 