"use client";

import { X, Clock, Users, Award, Play, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { CourseData, Section, Lecture } from "../types";

interface CoursePreviewProps {
  data: CourseData;
  onClose: () => void;
}

export function CoursePreview({ data, onClose }: CoursePreviewProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0
      ? `${hours}h`
      : `${hours}h ${remainingMinutes}m`;
  };

  const getTotalLectures = () => {
    let count = 0;
    data.sections?.forEach((section: Section) => {
      count += section.lectures?.length || 0;
    });
    return count;
  };

  const getTotalDuration = () => {
    let total = 0;
    data.sections?.forEach((section: Section) => {
      section.lectures?.forEach((lecture: Lecture) => {
        total += lecture.duration || 0;
      });
    });
    return total;
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSectionProgress = (section: Section) => {
    // Mock progress - in real app this would come from user data
    return Math.floor(Math.random() * 100);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full  overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={`${getLevelColor(data.level)} border`}>
                  {data.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">4.8 (2,341 reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-3 leading-tight">
                {data.title}
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-4">
                {data.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span>{getTotalLectures()} lectures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(getTotalDuration())}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>12,847 students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Certificate included</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
                {data.thumbnail ? (
                  <img
                    src={data.thumbnail}
                    alt={data.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <Play className="h-12 w-12 mx-auto mb-2 opacity-60" />
                      <span className="text-white/80">Preview Video</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="bg-white/90 rounded-full p-3">
                    <Play className="h-6 w-6 text-gray-800 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(95vh-280px)] overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                Enroll Now - $49.99
              </Button>
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Add to Wishlist
              </Button>
              <Button variant="outline" className="border-gray-200">
                Share Course
              </Button>
            </div>

            {/* Learning Outcomes & Requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    What you'll learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.objectives?.map(
                      (objective: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">
                            {objective}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-amber-800">
                    <Award className="h-5 w-5" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.prerequisites?.map(
                      (prerequisite: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-amber-600 rounded-full mt-2.5 flex-shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">
                            {prerequisite}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Course Content */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
                <CardTitle className="text-xl">Course Content</CardTitle>
                <CardDescription className="text-base">
                  {data.sections?.length || 0} sections • {getTotalLectures()}{" "}
                  lectures • {formatDuration(getTotalDuration())} total length
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {data.sections?.map(
                    (section: Section, sectionIndex: number) => {
                      const progress = getSectionProgress(section);
                      const sectionDuration =
                        section.lectures?.reduce(
                          (total, lecture) => total + (lecture.duration || 0),
                          0
                        ) || 0;

                      return (
                        <div
                          key={section.id}
                          className="p-6 hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                  Section {sectionIndex + 1}
                                </span>
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {section.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <span>
                                  {section.lectures?.length || 0} lectures
                                </span>
                                <span>•</span>
                                <span>{formatDuration(sectionDuration)}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Progress
                                  value={progress}
                                  className="flex-1 h-2"
                                />
                                <span className="text-xs text-gray-500 min-w-fit">
                                  {progress}% complete
                                </span>
                              </div>
                            </div>
                          </div>

                          {section.lectures && section.lectures.length > 0 ? (
                            <div className="space-y-2 ml-4 border-l-2 border-gray-100 pl-4">
                              {section.lectures.map(
                                (lecture: Lecture, lectureIndex: number) => (
                                  <div
                                    key={lecture.id}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white hover:shadow-sm transition-all group cursor-pointer"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-gray-400 font-mono min-w-fit">
                                        {String(lectureIndex + 1).padStart(
                                          2,
                                          "0"
                                        )}
                                      </span>
                                      <Play className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                                        {lecture.title}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-500 min-w-fit">
                                      {formatDuration(lecture.duration || 0)}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 ml-4 italic">
                              No lectures in this section yet
                            </p>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold text-gray-900">$49.99</p>
              <p className="text-sm text-gray-500">
                One-time payment • Lifetime access
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close Preview
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
