"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";
import SectionHead from "../shared/SectionHead";
import course from "@/public/images/courses/course.jpg";

const categories = [
  "All",
  "Programming",
  "Mathematics",
  "Languages",
  "Science",
  "More",
];

const courses = [
  {
    id: 1,
    title: "JavaScript for Beginners",
    category: "Programming",
    teacher: "Jane Doe",
    rating: 4.8,
    duration: "12h",
    image: course,
    badge: "Trending",
  },
  {
    id: 2,
    title: "Algebra Basics",
    category: "Mathematics",
    teacher: "John Smith",
    rating: 4.6,
    duration: "10h",
    image: course,
    badge: "New",
  },
  {
    id: 3,
    title: "Introduction to French",
    category: "Languages",
    teacher: "Emma Brown",
    rating: 4.9,
    duration: "8h",
    image: course,
    badge: "Free",
  },
  // Add more courses as needed
];

export default function CoursesSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  return (
    <section className="  bg-gray-50 ">
      <div className="container w-[90vw]">
        {/* <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Explore Our Courses</h2>
          <p className="text-muted-foreground">
            Learn from top educators in various fields
          </p>
        </div> */}

        <SectionHead
          tag="Explore Our Courses"
          title="Learn from top educators in various fields"
        />

        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full "
        >
          <TabsList className="flex flex-wrap justify-center mx-auto gap-2 mb-6">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value={selectedCategory}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-xl transition-shadow p-0"
              >
                <div className="relative h-50 w-full">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="rounded-t-xl object-cover"
                  />
                  {course.badge && (
                    <Badge className="absolute top-2 right-2 bg-primary text-white">
                      {course.badge}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    By {course.teacher} • {course.duration}
                  </p>
                  <Button variant="link" className="mt-2 px-0">
                    View Course →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
