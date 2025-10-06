"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface FloatRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function FloatRatingInput({
  value,
  onChange,
  disabled = false,
  size = "md",
  showValue = true,
  className = "",
}: FloatRatingInputProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const handleStarClick = (rating: number) => {
    if (disabled) return;
    onChange(rating);
  };

  const handleStarHover = (rating: number) => {
    if (disabled) return;
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHoveredRating(null);
  };

  const getRatingText = (rating: number) => {
    if (rating === 0) return "Select a rating";
    if (rating <= 1) return "Poor";
    if (rating <= 2) return "Fair";
    if (rating <= 3) return "Good";
    if (rating <= 4) return "Very Good";
    return "Excellent";
  };

  const getRatingColor = (rating: number) => {
    if (rating === 0) return "text-gray-400";
    if (rating <= 2) return "text-red-500";
    if (rating <= 3) return "text-yellow-500";
    if (rating <= 4) return "text-blue-500";
    return "text-green-500";
  };

  const displayRating = hoveredRating ?? value;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= displayRating;
          const isHalfStar =
            star === Math.ceil(displayRating) && displayRating % 1 !== 0;

          return (
            <button
              key={star}
              type="button"
              className="transition-colors duration-200 disabled:cursor-not-allowed"
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleStarClick(star)}
              disabled={disabled}
            >
              <Star
                className={`${
                  sizeClasses[size]
                } transition-colors duration-200 ${
                  isActive
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 hover:text-amber-300"
                }`}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <div className="ml-2">
          <span
            className={`font-semibold text-lg ${getRatingColor(displayRating)}`}
          >
            {displayRating > 0 ? displayRating.toFixed(1) : "0.0"}
          </span>
          <span className="ml-2 text-sm text-gray-600">
            {getRatingText(displayRating)}
          </span>
        </div>
      )}
    </div>
  );
}
