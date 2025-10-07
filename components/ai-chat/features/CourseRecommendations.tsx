"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  BookOpen,
  Star,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Award,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  CourseRecommendation,
  CourseRecommendationDto,
} from "@/types/aiChatTypes";
import { useAIChatStore } from "@/stores/aiChat.store";
import Link from "next/link";

interface CourseRecommendationsProps {
  onClose?: () => void;
}

export const CourseRecommendations: React.FC<CourseRecommendationsProps> = ({
  onClose,
}) => {
  const { getCourseRecommendations, relatedCourses, isLoading } =
    useAIChatStore();

  const [formData, setFormData] = useState<CourseRecommendationDto>({
    interests: [],
    skillLevel: "BEGINNER",
    timeCommitment: 5,
    budget: 100,
  });

  const [recommendations, setRecommendations] = useState<
    CourseRecommendation[]
  >([]);
  const [hasSearched, setHasSearched] = useState(false);

  const commonInterests = [
    "Web Development",
    "Data Science",
    "Machine Learning",
    "Mobile Development",
    "UI/UX Design",
    "Digital Marketing",
    "Business",
    "Photography",
    "Music",
    "Writing",
    "Languages",
    "Art",
    "Fitness",
    "Cooking",
    "Programming",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "Game Development",
  ];

  const skillLevels = [
    { value: "BEGINNER", label: "Beginner", description: "New to the subject" },
    {
      value: "INTERMEDIATE",
      label: "Intermediate",
      description: "Some experience",
    },
    { value: "ADVANCED", label: "Advanced", description: "Experienced" },
    { value: "EXPERT", label: "Expert", description: "Very experienced" },
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleGetRecommendations = async () => {
    if (formData.interests.length === 0) {
      return;
    }

    setHasSearched(true);
    const results = await getCourseRecommendations(formData);
    setRecommendations(results);
  };

  const getSkillLevelColor = (level: string) => {
    const colors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-orange-100 text-orange-800",
      EXPERT: "bg-red-100 text-red-800",
    };
    return colors[level as keyof typeof colors] || colors.BEGINNER;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Course Recommendations</h2>
          <p className="text-sm text-muted-foreground">
            Get personalized course suggestions based on your preferences
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Tell us about your learning goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Interests */}
          <div>
            <Label className="text-base font-medium">What interests you?</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select all topics that interest you (minimum 1)
            </p>
            <div className="flex flex-wrap gap-2">
              {commonInterests.map((interest) => (
                <Button
                  key={interest}
                  variant={
                    formData.interests.includes(interest)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleInterestToggle(interest)}
                  className="text-xs"
                >
                  {interest}
                </Button>
              ))}
            </div>
          </div>

          {/* Skill Level */}
          <div>
            <Label className="text-base font-medium">Your skill level</Label>
            <Select
              value={formData.skillLevel}
              onValueChange={(value: any) =>
                setFormData((prev) => ({ ...prev, skillLevel: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {level.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Commitment */}
          <div>
            <Label className="text-base font-medium">
              Time commitment: {formData.timeCommitment} hours per week
            </Label>
            <Slider
              value={[formData.timeCommitment]}
              onValueChange={([value]) =>
                setFormData((prev) => ({ ...prev, timeCommitment: value }))
              }
              max={40}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 hour/week</span>
              <span>40+ hours/week</span>
            </div>
          </div>

          {/* Budget */}
          <div>
            <Label className="text-base font-medium">
              Budget: ${formData.budget}
            </Label>
            <Slider
              value={[formData.budget]}
              onValueChange={([value]) =>
                setFormData((prev) => ({ ...prev, budget: value }))
              }
              max={1000}
              min={0}
              step={25}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>$0</span>
              <span>$1000+</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleGetRecommendations}
            disabled={formData.interests.length === 0 || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Finding perfect courses...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Get Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Recommended Courses ({recommendations.length})
            </h3>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-medium mb-2">No courses found</h4>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your preferences or expanding your interests
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

const CourseCard: React.FC<{ course: CourseRecommendation }> = ({ course }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm line-clamp-2">
                {course.title}
              </h4>
              <Badge variant="outline" className="ml-2 text-xs">
                {course.level}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {course.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{course.avgRating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{course.estimatedHours}h</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span>{course.price}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/courses/${course.id}`} className="flex-1">
                <Button size="sm" className="w-full text-xs">
                  View Course
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
