"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Map,
  Target,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Calendar,
  Badge,
} from "lucide-react";
import { LearningPathDto } from "@/types/aiChatTypes";
import { useAIChatStore } from "@/stores/aiChat.store";

interface LearningPathCreatorProps {
  onClose?: () => void;
}

export const LearningPathCreator: React.FC<LearningPathCreatorProps> = ({
  onClose,
}) => {
  const { createLearningPath, isLoading } = useAIChatStore();

  const [formData, setFormData] = useState<LearningPathDto>({
    goal: "",
    currentSkills: [],
    timeFrame: "3 months",
    interests: [],
  });

  const [createdPath, setCreatedPath] = useState<any>(null);
  const [hasCreated, setHasCreated] = useState(false);

  const timeFrames = [
    {
      value: "1 month",
      label: "1 Month",
      description: "Quick learning sprint",
    },
    {
      value: "3 months",
      label: "3 Months",
      description: "Focused learning period",
    },
    {
      value: "6 months",
      label: "6 Months",
      description: "Comprehensive learning",
    },
    {
      value: "1 year",
      label: "1 Year",
      description: "Deep expertise building",
    },
  ];

  const commonSkills = [
    "HTML/CSS",
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "Data Analysis",
    "Machine Learning",
    "UI/UX Design",
    "Project Management",
    "Digital Marketing",
    "Content Writing",
    "Photography",
    "Video Editing",
    "Public Speaking",
    "Leadership",
    "Communication",
    "Problem Solving",
  ];

  const commonInterests = [
    "Web Development",
    "Data Science",
    "Mobile Development",
    "AI/ML",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "Game Development",
    "UI/UX Design",
    "Digital Marketing",
    "Business Analytics",
    "Product Management",
    "Creative Writing",
    "Photography",
    "Music Production",
    "Graphic Design",
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      currentSkills: prev.currentSkills.includes(skill)
        ? prev.currentSkills.filter((s) => s !== skill)
        : [...prev.currentSkills, skill],
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleCreatePath = async () => {
    if (!formData.goal.trim() || formData.interests.length === 0) {
      return;
    }

    setHasCreated(true);
    console.log("Creating learning path with data:", formData);
    const path = await createLearningPath(formData);
    console.log("Received path response:", path);
    setCreatedPath(path);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <Map className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Create Learning Path</h2>
          <p className="text-sm text-muted-foreground">
            Design a personalized roadmap to achieve your learning goals
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Define Your Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Learning Goal */}
          <div>
            <Label htmlFor="goal" className="text-base font-medium">
              What do you want to achieve?
            </Label>
            <Textarea
              id="goal"
              placeholder="e.g., Become a full-stack web developer, Learn data science for career change, Master digital marketing..."
              value={formData.goal}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, goal: e.target.value }))
              }
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Current Skills */}
          <div>
            <Label className="text-base font-medium">Your current skills</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select skills you already have (optional)
            </p>
            <div className="flex flex-wrap gap-2">
              {commonSkills.map((skill) => (
                <Button
                  key={skill}
                  variant={
                    formData.currentSkills.includes(skill)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleSkillToggle(skill)}
                  className="text-xs"
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          {/* Time Frame */}
          <div>
            <Label className="text-base font-medium">Learning timeline</Label>
            <Select
              value={formData.timeFrame}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, timeFrame: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeFrames.map((frame) => (
                  <SelectItem key={frame.value} value={frame.value}>
                    <div>
                      <div className="font-medium">{frame.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {frame.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interests */}
          <div>
            <Label className="text-base font-medium">Areas of interest</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select all areas that interest you (minimum 1)
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

          {/* Submit Button */}
          <Button
            onClick={handleCreatePath}
            disabled={
              !formData.goal.trim() ||
              formData.interests.length === 0 ||
              isLoading
            }
            className="w-full"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Creating your learning path...
              </>
            ) : (
              <>
                <Map className="w-4 h-4 mr-2" />
                Create Learning Path
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {hasCreated && createdPath && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Your Learning Path</h3>
          </div>

          <LearningPathDisplay path={createdPath} />
        </motion.div>
      )}

      {hasCreated && !createdPath && (
        <Card>
          <CardContent className="p-6 text-center">
            <Map className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-medium mb-2">Unable to create path</h4>
            <p className="text-sm text-muted-foreground">
              Please try again with different parameters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const LearningPathDisplay: React.FC<{ path: any }> = ({ path }) => {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  // Debug: Log the path data
  console.log("LearningPathDisplay received path:", path);

  // Handle both old format and new structured format
  let learningPath;

  // Check if the response has the nested learningPath structure
  if (path.learningPath) {
    learningPath = path.learningPath;
  } else {
    // The path itself might be the learning path data
    learningPath = path;
  }

  // Extract phases/weeklyPlan from the learningPath
  const phases = learningPath?.phases || learningPath?.weeklyPlan || [];
  const capstoneProject = learningPath?.capstoneProject;

  console.log("Processed learningPath:", learningPath);
  console.log("Processed phases:", phases);
  console.log("Has phases/weeklyPlan:", phases.length > 0);
  console.log("Path keys:", Object.keys(path));
  console.log(
    "LearningPath keys:",
    learningPath ? Object.keys(learningPath) : "null"
  );
  console.log("Has learningPath.weeklyPlan:", learningPath?.weeklyPlan);
  console.log("Has learningPath.phases:", learningPath?.phases);

  // If no phases/weeklyPlan found, show debug info but still try to render
  if (phases.length === 0) {
    console.warn("No phases/weeklyPlan found, but attempting to render anyway");
    console.log("Available data:", learningPath);
  }

  return (
    <div className="space-y-6">
      {/* Path Header */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {learningPath.title ||
                    learningPath.userProfile?.goal ||
                    "Your Learning Path"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {learningPath.duration ||
                    learningPath.userProfile?.timeFrame ||
                    "Timeline"}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {learningPath.description ||
                "A personalized learning journey designed just for you"}
            </p>

            {/* Disclaimer */}
            {learningPath.disclaimer && (
              <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="text-sm text-yellow-800 font-medium">
                  <strong>Note:</strong> {learningPath.disclaimer}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Path Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <Clock className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
              TIMELINE
            </p>
            <p className="text-lg font-bold text-blue-800">
              {learningPath.duration || "3 months"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
          <BookOpen className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
              PHASES
            </p>
            <p className="text-lg font-bold text-green-800">
              {phases.length || 0} phases
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 border border-purple-200">
          <Target className="w-6 h-6 text-purple-600" />
          <div>
            <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">
              STAGES
            </p>
            <p className="text-lg font-bold text-purple-800">
              {phases.length > 0
                ? phases.reduce(
                    (total: number, phase: any) =>
                      total + (phase.stages?.length || 1), // Count 1 for each phase if no stages
                    0
                  )
                : 0}{" "}
              stages
            </p>
          </div>
        </div>
      </div>

      {/* Overall Learning Objectives */}
      {learningPath.overallLearningObjectives && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Target className="w-5 h-5" />
              Overall Learning Objectives
            </CardTitle>
            <p className="text-green-700">
              What you'll achieve by the end of this path
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {learningPath.overallLearningObjectives.map(
                (objective: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white border border-green-200"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800">{objective}</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Phases */}
      {phases.length > 0 ? (
        phases.map((phase: any, phaseIndex: number) => (
          <motion.div
            key={phaseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIndex * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader
                className="cursor-pointer bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all duration-200"
                onClick={() =>
                  setExpandedPhase(
                    expandedPhase === phaseIndex ? null : phaseIndex
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {phase.phaseNumber || phaseIndex + 1}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {phase.title || phase.focus}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {phase.duration || `Week ${phase.week}`}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedPhase === phaseIndex ? "Collapse" : "Expand"}
                  </Button>
                </div>

                {/* Phase Objectives */}
                {(phase.objectives || phase.learningObjectives) && (
                  <div className="mt-4 space-y-2">
                    <h5 className="text-sm font-medium text-muted-foreground">
                      Objectives:
                    </h5>
                    <div className="grid gap-2 md:grid-cols-2">
                      {(phase.objectives || phase.learningObjectives).map(
                        (objective: string, objIndex: number) => (
                          <div
                            key={objIndex}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{objective}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Phase Description */}
                {phase.description && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      {phase.description}
                    </p>
                  </div>
                )}
              </CardHeader>

              <AnimatePresence>
                {expandedPhase === phaseIndex && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-6">
                        {/* Stages or Weekly Plan Content */}
                        {phase.stages?.map((stage: any, stageIndex: number) => (
                          <div
                            key={stageIndex}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-lg">
                                  {stage.focus}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {stage.week}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setExpandedStage(
                                    expandedStage ===
                                      `${phaseIndex}-${stageIndex}`
                                      ? null
                                      : `${phaseIndex}-${stageIndex}`
                                  )
                                }
                              >
                                {expandedStage === `${phaseIndex}-${stageIndex}`
                                  ? "Hide Details"
                                  : "Show Details"}
                              </Button>
                            </div>

                            <AnimatePresence>
                              {expandedStage ===
                                `${phaseIndex}-${stageIndex}` && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-4"
                                >
                                  {/* Skills to Develop */}
                                  {stage.skillsToDevelop && (
                                    <div>
                                      <h5 className="font-medium mb-2 flex items-center gap-2">
                                        <Badge className="w-4 h-4" />
                                        Skills to Develop
                                      </h5>
                                      <div className="flex flex-wrap gap-2">
                                        {stage.skillsToDevelop.map(
                                          (
                                            skill: string,
                                            skillIndex: number
                                          ) => (
                                            <span
                                              key={skillIndex}
                                              className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                                            >
                                              {skill}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Recommended Courses */}
                                  {stage.recommendedCourses && (
                                    <div>
                                      <h5 className="font-medium mb-3 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Recommended Courses
                                      </h5>
                                      <div className="space-y-3">
                                        {stage.recommendedCourses.map(
                                          (
                                            course: any,
                                            courseIndex: number
                                          ) => (
                                            <div
                                              key={courseIndex}
                                              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
                                            >
                                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">
                                                {courseIndex + 1}
                                              </div>
                                              <div className="flex-1">
                                                <h6 className="font-medium">
                                                  {course.title}
                                                </h6>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                  {course.author}
                                                </p>
                                                {course.link && (
                                                  <a
                                                    href={course.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                                  >
                                                    <ArrowRight className="w-3 h-3" />
                                                    Visit Course
                                                  </a>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Practice Project */}
                                  {stage.practiceProject && (
                                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                                      <h5 className="font-medium mb-2 flex items-center gap-2">
                                        <Target className="w-4 h-4 text-blue-600" />
                                        Practice Project
                                      </h5>
                                      <h6 className="font-semibold text-blue-800 mb-2">
                                        {stage.practiceProject.title}
                                      </h6>
                                      <p className="text-sm text-blue-700">
                                        {stage.practiceProject.description}
                                      </p>
                                    </div>
                                  )}

                                  {/* Milestone */}
                                  {stage.milestone && (
                                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                                      <h5 className="font-medium mb-2 flex items-center gap-2">
                                        <Award className="w-4 h-4 text-green-600" />
                                        Milestone
                                      </h5>
                                      <p className="text-sm text-green-700">
                                        {stage.milestone}
                                      </p>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}

                        {/* Weekly Plan Content (when no stages but weekly plan data) */}
                        {!phase.stages && phase.skillsToDevelop && (
                          <div className="space-y-6">
                            {/* Skills to Develop */}
                            {phase.skillsToDevelop && (
                              <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                  <Badge className="w-4 h-4" />
                                  Skills to Develop
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {phase.skillsToDevelop.map(
                                    (skill: string, skillIndex: number) => (
                                      <span
                                        key={skillIndex}
                                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                                      >
                                        {skill}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Recommended Resources */}
                            {phase.recommendedResources && (
                              <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                  <BookOpen className="w-4 h-4" />
                                  Recommended Resources
                                </h4>
                                <div className="space-y-3">
                                  {phase.recommendedResources.map(
                                    (resource: any, resourceIndex: number) => (
                                      <div
                                        key={resourceIndex}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
                                      >
                                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">
                                          {resourceIndex + 1}
                                        </div>
                                        <div className="flex-1">
                                          <h6 className="font-medium">
                                            {resource.title}
                                          </h6>
                                          <p className="text-sm text-muted-foreground mb-2">
                                            {resource.type}
                                          </p>
                                          {resource.url && (
                                            <a
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                              <ArrowRight className="w-3 h-3" />
                                              Visit Resource
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Practice Project */}
                            {phase.practiceProject && (
                              <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                  <Target className="w-4 h-4 text-blue-600" />
                                  Practice Project
                                </h4>
                                <h6 className="font-semibold text-blue-800 mb-2">
                                  {phase.practiceProject.title}
                                </h6>
                                <p className="text-sm text-blue-700">
                                  {phase.practiceProject.description}
                                </p>
                              </div>
                            )}

                            {/* Milestone */}
                            {phase.milestone && (
                              <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                  <Award className="w-4 h-4 text-green-600" />
                                  Milestone
                                </h4>
                                <p className="text-sm text-green-700">
                                  {phase.milestone}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))
      ) : (
        /* Fallback: Display available data even if structure is different */
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">
              Learning Path Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-orange-700">
                <strong>Available data structure:</strong>
              </div>
              <pre className="bg-white p-4 rounded border text-xs overflow-auto max-h-60">
                {JSON.stringify(learningPath, null, 2)}
              </pre>
              <div className="text-sm text-orange-700">
                <strong>Note:</strong> The learning path data is available but
                in a different structure than expected. Check the console logs
                for detailed debugging information.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {learningPath.nextSteps && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <ArrowRight className="w-5 h-5" />
              Next Steps
            </CardTitle>
            <p className="text-blue-700">Continue your learning journey</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {learningPath.nextSteps.map((step: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white border border-blue-200"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-blue-800">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Capstone Project */}
      {capstoneProject && (
        <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Award className="w-5 h-5" />
              {capstoneProject.title}
            </CardTitle>
            <p className="text-yellow-700">{capstoneProject.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h5 className="font-semibold mb-3">Project Ideas:</h5>
              <div className="grid gap-3 md:grid-cols-2">
                {capstoneProject.ideas?.map((idea: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-white border border-yellow-200"
                  >
                    <h6 className="font-semibold mb-2">{idea.name}</h6>
                    <ul className="space-y-1">
                      {idea.features.map(
                        (feature: string, featureIndex: number) => (
                          <li
                            key={featureIndex}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                            {feature}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-yellow-100 border border-yellow-300">
              <h6 className="font-semibold text-yellow-800 mb-2">
                Final Goal:
              </h6>
              <p className="text-yellow-700">{capstoneProject.finalGoal}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
