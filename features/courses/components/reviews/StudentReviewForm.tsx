"use client";

import { useState, useEffect } from "react";
import { Star, Send, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useCourseRatings } from "../../hooks/useCourseRatings";
import { CourseRating } from "@/types/courseRatingTypes";
import { motion, AnimatePresence } from "framer-motion";

interface StudentReviewFormProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
  existingRating?: CourseRating | null;
  onSuccess?: () => void;
}

interface RatingField {
  label: string;
  fieldName: string;
  description: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export const StudentReviewForm = ({
  courseId,
  isOpen,
  onClose,
  existingRating,
  onSuccess,
}: StudentReviewFormProps) => {
  const { createRating, updateRating, isSubmitting } =
    useCourseRatings(courseId);

  const [overallRating, setOverallRating] = useState(0);
  const [comment, setComment] = useState("");
  const [courseQuality, setCourseQuality] = useState(0);
  const [instructorRating, setInstructorRating] = useState(0);
  const [difficultyRating, setDifficultyRating] = useState(0);
  const [valueForMoney, setValueForMoney] = useState(0);
  const [userModifiedOverall, setUserModifiedOverall] = useState(false);
  const [hoverStates, setHoverStates] = useState({
    overall: 0,
    courseQuality: 0,
    instructorRating: 0,
    difficultyRating: 0,
    valueForMoney: 0,
  });

  // Initialize form with existing rating data
  useEffect(() => {
    if (existingRating) {
      setOverallRating(existingRating.rating);
      setComment(existingRating.comment || "");
      setCourseQuality(existingRating.courseQuality || 0);
      setInstructorRating(existingRating.instructorRating || 0);
      setDifficultyRating(existingRating.difficultyRating || 0);
      setValueForMoney(existingRating.valueForMoney || 0);
    } else {
      // Reset form for new rating
      setOverallRating(0);
      setComment("");
      setCourseQuality(0);
      setInstructorRating(0);
      setDifficultyRating(0);
      setValueForMoney(0);
      setUserModifiedOverall(false);
    }
  }, [existingRating, isOpen]);

  const ratingFields: RatingField[] = [
    {
      label: "Course Quality",
      fieldName: "courseQuality",
      description:
        "How well-structured and comprehensive is the course content?",
      value: courseQuality,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      label: "Instructor Rating",
      fieldName: "instructorRating",
      description: "How effective and engaging is the instructor?",
      value: instructorRating,
      icon: <Star className="h-4 w-4" />,
      color: "text-purple-600",
    },
    {
      label: "Difficulty Level",
      fieldName: "difficultyRating",
      description: "How challenging is the course material?",
      value: difficultyRating,
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-orange-600",
    },
    {
      label: "Value for Money",
      fieldName: "valueForMoney",
      description: "Is the course worth the price you paid?",
      value: valueForMoney,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600",
    },
  ];

  const handleRatingChange = (field: string, value: number) => {
    switch (field) {
      case "overall":
        setOverallRating(value);
        setUserModifiedOverall(true);
        break;
      case "courseQuality":
        setCourseQuality(value);
        break;
      case "instructorRating":
        setInstructorRating(value);
        break;
      case "difficultyRating":
        setDifficultyRating(value);
        break;
      case "valueForMoney":
        setValueForMoney(value);
        break;
    }
  };

  // Calculate overall rating from detailed ratings
  const calculateOverallRating = () => {
    const ratings = [
      courseQuality,
      instructorRating,
      difficultyRating,
      valueForMoney,
    ];
    const validRatings = ratings.filter((rating) => rating > 0);

    if (validRatings.length === 0) return 0;

    const average =
      validRatings.reduce((sum, rating) => sum + rating, 0) /
      validRatings.length;
    return Math.round(average * 2) / 2; // Round to nearest 0.5
  };

  // Auto-update overall rating when detailed ratings change (only if user hasn't manually modified it)
  useEffect(() => {
    const calculatedRating = calculateOverallRating();
    if (calculatedRating > 0 && !userModifiedOverall) {
      setOverallRating(calculatedRating);
    }
  }, [
    courseQuality,
    instructorRating,
    difficultyRating,
    valueForMoney,
    userModifiedOverall,
  ]);

  const handleSubmit = async () => {
    if (overallRating === 0) {
      return;
    }

    try {
      if (existingRating) {
        await updateRating({
          ratingId: existingRating.id,
          rating: overallRating,
          comment: comment.trim() || undefined,
          courseQuality: courseQuality || undefined,
          instructorRating: instructorRating || undefined,
          difficultyRating: difficultyRating || undefined,
          valueForMoney: valueForMoney || undefined,
        });
      } else {
        await createRating({
          courseId,
          rating: overallRating,
          comment: comment.trim() || undefined,
          courseQuality: courseQuality || undefined,
          instructorRating: instructorRating || undefined,
          difficultyRating: difficultyRating || undefined,
          valueForMoney: valueForMoney || undefined,
        });
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const renderStarRating = (
    value: number,
    onChange: (value: number) => void,
    size: "sm" | "md" | "lg" = "md",
    fieldName: string
  ) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const currentHover =
      hoverStates[fieldName as keyof typeof hoverStates] || 0;

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() =>
              setHoverStates((prev) => ({ ...prev, [fieldName]: star }))
            }
            onMouseLeave={() =>
              setHoverStates((prev) => ({ ...prev, [fieldName]: 0 }))
            }
            className="transition-colors duration-200"
          >
            <Star
              className={cn(
                sizeClasses[size],
                star <= (currentHover || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200",
                "hover:fill-yellow-300 hover:text-yellow-300"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingLabel = (rating: number) => {
    const labels = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return labels[rating as keyof typeof labels] || "";
  };

  const isFormValid = overallRating > 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {existingRating ? "Update Your Review" : "Write a Review"}
                  </CardTitle>
                  {existingRating && (
                    <p className="text-sm text-blue-600 mt-1">
                      You can modify your existing review below
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-600">
                Share your experience to help other students make informed
                decisions
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Overall Rating */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-lg font-semibold text-gray-900">
                      Overall Rating *
                    </label>
                    {overallRating > 0 &&
                      calculateOverallRating() > 0 &&
                      Math.abs(overallRating - calculateOverallRating()) <
                        0.1 && (
                        <Badge
                          variant="outline"
                          className="text-xs text-blue-600"
                        >
                          Auto-calculated
                        </Badge>
                      )}
                  </div>
                  <div className="flex items-center gap-4">
                    {renderStarRating(
                      overallRating,
                      (value) => handleRatingChange("overall", value),
                      "lg",
                      "overall"
                    )}
                    {overallRating > 0 && (
                      <Badge variant="secondary" className="text-sm">
                        {getRatingLabel(overallRating)} ({overallRating}/5)
                      </Badge>
                    )}
                  </div>
                  {overallRating > 0 &&
                    calculateOverallRating() > 0 &&
                    Math.abs(overallRating - calculateOverallRating()) >
                      0.1 && (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-gray-500">
                          💡 Auto-calculated rating would be{" "}
                          {calculateOverallRating()}/5 based on your detailed
                          ratings
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={() => {
                            setOverallRating(calculateOverallRating());
                            setUserModifiedOverall(false);
                          }}
                        >
                          Reset to Auto
                        </Button>
                      </div>
                    )}
                </div>
              </div>

              {/* Detailed Ratings */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detailed Ratings
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Rate specific aspects of the course. Your overall rating
                    will be auto-calculated from these ratings, but you can
                    modify it if needed.
                  </p>
                </div>
                <div className="grid gap-4">
                  {ratingFields.map((field, index) => (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm", field.color)}>
                            {field.icon}
                          </span>
                          <span className="font-medium text-gray-900">
                            {field.label}
                          </span>
                        </div>
                        {field.value > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {getRatingLabel(field.value)} ({field.value}/5)
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {field.description}
                      </p>
                      <div className="flex items-center gap-3">
                        {renderStarRating(
                          field.value,
                          (value) => handleRatingChange(field.fieldName, value),
                          "md",
                          field.fieldName
                        )}
                        {field.value > 0 && (
                          <span className="text-sm text-gray-500">
                            {field.value}/5
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Comment Section */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-900">
                  Written Review
                </label>
                <Textarea
                  placeholder="Share your detailed thoughts about the course. What did you like? What could be improved? Your review will help other students..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[120px] resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Optional but highly appreciated</span>
                  <span>{comment.length}/1000</span>
                </div>
              </div>

              {/* Review Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Review Guidelines
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be honest and constructive in your feedback</li>
                  <li>• Focus on the course content and instructor quality</li>
                  <li>• Avoid personal attacks or inappropriate language</li>
                  <li>• Your review will be visible to other students</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {existingRating ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {existingRating ? "Update Review" : "Submit Review"}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
