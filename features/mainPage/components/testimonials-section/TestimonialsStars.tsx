"use client";

import { Star } from "lucide-react";

interface TestimonialStarsProps {
  rating: number;
  size?: number;
  className?: string;
}

export default function TestimonialStars({
  rating,
  size = 16,
  className = "",
}: TestimonialStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={`flex ${className}`}>
      {[...Array(5)].map((_, idx) => {
        if (idx < fullStars) {
          // Full star
          return (
            <Star
              key={idx}
              size={size}
              className="text-yellow-400 fill-yellow-400 mr-1"
            />
          );
        } else if (idx === fullStars && hasHalfStar) {
          // Half star
          return (
            <div key={idx} className="relative mr-1">
              <Star size={size} className="text-gray-300" />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: "50%" }}
              >
                <Star size={size} className="text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          );
        } else {
          // Empty star
          return <Star key={idx} size={size} className="text-gray-300 mr-1" />;
        }
      })}
    </div>
  );
}
