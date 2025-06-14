"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CourseData, Section, Lecture } from "../types";

interface CoursePreviewProps {
  data: CourseData;
  onClose: () => void;
}

export function CoursePreview({ data, onClose }: CoursePreviewProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
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
    return formatDuration(total);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="container max-w-4xl mx-auto py-8">
        <div className="bg-card rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Course Preview</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">{data.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {data.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{getTotalLectures()} lectures</span>
                  <span>•</span>
                  <span>{getTotalDuration()}</span>
                  <span>•</span>
                  <span>{data.level}</span>
                </div>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                {data.thumbnail ? (
                  <img
                    src={data.thumbnail}
                    alt={data.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No thumbnail</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.objectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.prerequisites.map((prerequisite: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {getTotalLectures()} lectures • {getTotalDuration()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.sections.map((section: Section) => (
                  <div key={section.id} className="space-y-2">
                    <h3 className="font-medium">{section.title}</h3>
                    {section.lectures && section.lectures.length > 0 ? (
                      <ul className="space-y-1 pl-4">
                        {section.lectures.map((lecture: Lecture) => (
                          <li
                            key={lecture.id}
                            className="text-sm flex items-center justify-between"
                          >
                            <span>{lecture.title}</span>
                            <span className="text-muted-foreground">
                              {formatDuration(lecture.duration || 0)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground pl-4">
                        No lectures in this section
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
