// "use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverAnimation } from "../animations/testimonialsAnimations";
import TestimonialStars from "./TestimonialsStars";
import { Testimonial } from "../../types/testimonialsTypes";
import user from "@/public/images/courses/course.jpg";

interface TestimonialCardProps {
  testimonial: Testimonial;
  onClick: () => void;
}

export default function TestimonialCard({
  testimonial,
  onClick,
}: TestimonialCardProps) {
  return (
    <HoverAnimation className="snap-center h-full">
      <Card
        className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 h-full cursor-pointer border border-gray-100"
        onClick={onClick}
      >
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <Avatar className="w-14 h-14 border-2 border-blue-100">
              <AvatarImage src={user.src} alt={testimonial.name} />
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {testimonial.fallback}
              </AvatarFallback>
            </Avatar>
            <TestimonialStars rating={testimonial.rating} />
          </div>
          <p className="text-sm text-gray-700 flex-grow line-clamp-4">
            "{testimonial.review}"
          </p>
          <div className="mt-6">
            <div className="font-semibold text-gray-900">
              {testimonial.name}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Course: {testimonial.course}
            </div>
            {testimonial.date && (
              <div className="text-xs text-gray-500 mt-1">
                {testimonial.date}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </HoverAnimation>
  );
}
