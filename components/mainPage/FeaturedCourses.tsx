import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Introduction à la Programmation",
    image: "/images/course1.jpg",
    instructor: "Sami Ben Ali",
    instructorImg: "/images/teacher1.jpg",
    rating: 4.8,
    students: 1220,
    price: "Gratuit",
  },
  {
    id: 2,
    title: "Mathématiques pour Lycée",
    image: "/images/course2.jpg",
    instructor: "Inès Trabelsi",
    instructorImg: "/images/teacher2.jpg",
    rating: 4.6,
    students: 980,
    price: "29 DT",
  },
  {
    id: 2,
    title: "Mathématiques pour Lycée",
    image: "/images/course2.jpg",
    instructor: "Inès Trabelsi",
    instructorImg: "/images/teacher2.jpg",
    rating: 4.6,
    students: 980,
    price: "29 DT",
  },
  {
    id: 2,
    title: "Mathématiques pour Lycée",
    image: "/images/course2.jpg",
    instructor: "Inès Trabelsi",
    instructorImg: "/images/teacher2.jpg",
    rating: 4.6,
    students: 980,
    price: "29 DT",
  },
  {
    id: 2,
    title: "Mathématiques pour Lycée",
    image: "/images/course2.jpg",
    instructor: "Inès Trabelsi",
    instructorImg: "/images/teacher2.jpg",
    rating: 4.6,
    students: 980,
    price: "29 DT",
  },
  // Add more course objects as needed
];

export default function FeaturedCourses() {
  return (
    <section className=" bg-gray-50">
      <div className="w-[90vw] container">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Cours Populaires
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-lg transition duration-300"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover rounded-t-xl"
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {course.title}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={course.instructorImg} />
                    <AvatarFallback>
                      {course.instructor.split(" ")[0][0] +
                        course.instructor.split(" ")[1][0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                </div>

                <div className="flex items-center text-sm text-yellow-500 mb-2">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="ml-1">
                    {course.rating} ({course.students} élèves)
                  </span>
                </div>

                <p className="text-primary font-bold">{course.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-end mt-10">
          <Button className="text-white bg-gradient-to-r from-primary to-secondary hover:bg-primary font-semibold p-6 text-[17px] px-10 cursor-pointer">
            Voir tous les cours
          </Button>
        </div>
      </div>
    </section>
  );
}
