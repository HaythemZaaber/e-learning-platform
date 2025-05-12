"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const teachers = [
  {
    id: 1,
    name: "Dr. Sarah Malik",
    subject: "Mathematics",
    rating: 4.8,
    image: "/images/teacher1.jpg",
    bio: "Ph.D. in Applied Math with 10+ years of teaching experience.",
  },
  {
    id: 2,
    name: "Mohamed Ben Ali",
    subject: "Physics",
    rating: 4.7,
    image: "/images/teacher2.jpg",
    bio: "Experienced high school teacher and Olympiad trainer.",
  },
  {
    id: 3,
    name: "Laura Nguyen",
    subject: "English Literature",
    rating: 4.9,
    image: "/images/teacher3.jpg",
    bio: "Specialist in English classics and language training.",
  },
];

export default function TeachersSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Meet Our Top Teachers
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Learn from the best educators from around the world. Each of our
          teachers is handpicked for their expertise and passion for teaching.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teachers.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-2xl shadow-lg overflow-hidden">
                <Image
                  src={teacher.image}
                  alt={teacher.name}
                  width={400}
                  height={300}
                  className="w-full h-56 object-cover"
                />
                <CardContent className="p-6 text-left">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {teacher.name}
                  </h3>
                  <p className="text-sm text-indigo-600 mb-2">
                    {teacher.subject}
                  </p>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className={`${
                          idx < Math.round(teacher.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } mr-1`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {teacher.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {teacher.bio}
                  </p>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
