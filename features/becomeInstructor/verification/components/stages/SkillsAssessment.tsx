"use client";

import { useState, useEffect } from "react";
import { 
  Brain, 
  Video, 
  FileText, 
  Award, 
  Play, 
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  BookOpen,
  Users,
  Target,
  Zap,
  Monitor,
  Mic,
  Camera,
  FileUp,
  Download,
  Info,
  TrendingUp,
  Shield,
  Eye,
  RefreshCw
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

interface SkillsAssessmentProps {
  data: any;
  updateData: (data: any) => void;
}

const teachingCategories = [
  {
    id: "programming",
    name: "Programming & Development",
    icon: Monitor,
    color: "blue",
    subcategories: [
      { name: "Web Development", popularity: 95, demand: "High" },
      { name: "Mobile Development", popularity: 87, demand: "High" },
      { name: "Data Science", popularity: 92, demand: "Very High" },
      { name: "AI/ML", popularity: 89, demand: "Very High" },
      { name: "DevOps", popularity: 78, demand: "High" },
      { name: "Cybersecurity", popularity: 85, demand: "High" },
    ],
  },
  {
    id: "business",
    name: "Business & Entrepreneurship",
    icon: TrendingUp,
    color: "green",
    subcategories: [
      { name: "Digital Marketing", popularity: 88, demand: "High" },
      { name: "Finance & Investment", popularity: 82, demand: "Medium" },
      { name: "Management", popularity: 75, demand: "Medium" },
      { name: "Strategy", popularity: 70, demand: "Medium" },
      { name: "E-commerce", popularity: 86, demand: "High" },
    ],
  },
  {
    id: "design",
    name: "Design & Creativity",
    icon: Zap,
    color: "purple",
    subcategories: [
      { name: "Graphic Design", popularity: 83, demand: "Medium" },
      { name: "UI/UX Design", popularity: 91, demand: "Very High" },
      { name: "Photography", popularity: 77, demand: "Medium" },
      { name: "Video Editing", popularity: 84, demand: "High" },
      { name: "3D Modeling", popularity: 72, demand: "Medium" },
    ],
  },
  {
    id: "languages",
    name: "Languages",
    icon: Users,
    color: "orange",
    subcategories: [
      { name: "English", popularity: 95, demand: "Very High" },
      { name: "Spanish", popularity: 78, demand: "High" },
      { name: "French", popularity: 65, demand: "Medium" },
      { name: "Mandarin", popularity: 72, demand: "High" },
      { name: "German", popularity: 58, demand: "Medium" },
    ],
  },
  {
    id: "academics",
    name: "Academic Subjects",
    icon: BookOpen,
    color: "indigo",
    subcategories: [
      { name: "Mathematics", popularity: 85, demand: "High" },
      { name: "Science", popularity: 80, demand: "High" },
      { name: "History", popularity: 62, demand: "Low" },
      { name: "Literature", popularity: 58, demand: "Low" },
      { name: "Physics", popularity: 75, demand: "Medium" },
    ],
  },
];

const skillLevels = [
  {
    id: "beginner",
    name: "Beginner",
    description: "Basic understanding, can teach fundamentals",
    requirements: "1+ years experience",
    icon: Target,
    color: "green",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "Solid knowledge, can teach practical applications",
    requirements: "3+ years experience",
    icon: TrendingUp,
    color: "blue",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Expert level, can teach complex concepts",
    requirements: "5+ years experience",
    icon: Award,
    color: "purple",
  },
  {
    id: "expert",
    name: "Expert",
    description: "Industry expert, can teach at professional level",
    requirements: "10+ years experience",
    icon: Star,
    color: "orange",
  },
];

const videoRequirements = {
  introduction: {
    duration: "2-3 minutes",
    requirements: [
      "Professional appearance and setting",
      "Clear audio and good lighting",
      "Introduce yourself and background",
      "Explain your teaching philosophy",
      "Share what makes you unique as an instructor"
    ]
  },
  demo: {
    duration: "10-15 minutes",
    requirements: [
      "Choose a topic from your selected categories",
      "Clear lesson structure with intro, main content, and summary",
      "Engage with imaginary students",
      "Use visual aids or examples",
      "Demonstrate your teaching style"
    ]
  }
};

export function SkillsAssessment({ data, updateData }: SkillsAssessmentProps) {
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategories, setSelectedCategories] = useState(
    data.categories || []
  );
  const [videoIntroduction, setVideoIntroduction] = useState<File | null>(
    data.videoIntroduction || null
  );
  const [teachingDemo, setTeachingDemo] = useState<File | null>(
    data.teachingDemo || null
  );
  const [lessonPlan, setLessonPlan] = useState(data.lessonPlan || "");
  const [quizAnswers, setQuizAnswers] = useState(data.quizAnswers || {});
  const [completionStatus, setCompletionStatus] = useState({
    categories: false,
    videos: false,
    lesson: false,
    quiz: false,
  });
  const [overallProgress, setOverallProgress] = useState(0);

  // Calculate completion status and progress
  useEffect(() => {
    const status = {
      categories: selectedCategories.length > 0,
      videos: videoIntroduction !== null && teachingDemo !== null,
      lesson: lessonPlan.trim().length > 500,
      quiz: Object.keys(quizAnswers).length > 0,
    };

    setCompletionStatus(status);

    const completedTabs = Object.values(status).filter(Boolean).length;
    setOverallProgress((completedTabs / 4) * 100);

    // Update parent component with completion status
    updateData({
      categories: selectedCategories,
      videoIntroduction,
      teachingDemo,
      lessonPlan,
      quizAnswers,
      completionStatus: status,
      overallProgress: (completedTabs / 4) * 100,
    });
  }, [
    selectedCategories,
    videoIntroduction,
    teachingDemo,
    lessonPlan,
    quizAnswers,
  ]);

  const handleCategorySelection = (
    categoryId: string,
    subcategory: string,
    level: string
  ) => {
    const existingIndex = selectedCategories.findIndex(
      (cat: any) =>
        cat.categoryId === categoryId && cat.subcategory === subcategory
    );

    let updatedCategories;
    if (existingIndex >= 0) {
      updatedCategories = selectedCategories.map((cat: any, index: number) =>
        index === existingIndex
          ? { ...cat, level, lastUpdated: new Date().toISOString() }
          : cat
      );
    } else {
      updatedCategories = [
        ...selectedCategories,
        {
          categoryId,
          subcategory,
          level,
          verified: false,
          aiScore: 0,
          lastUpdated: new Date().toISOString(),
        },
      ];
    }

    setSelectedCategories(updatedCategories);
  };

  const removeCategorySelection = (categoryId: string, subcategory: string) => {
    const updatedCategories = selectedCategories.filter(
      (cat: any) =>
        !(cat.categoryId === categoryId && cat.subcategory === subcategory)
    );
    setSelectedCategories(updatedCategories);
  };

  const handleVideoUpload = (type: "introduction" | "demo", file: File) => {
    if (type === "introduction") {
      setVideoIntroduction(file);
    } else {
      setTeachingDemo(file);
    }
  };

  const getTabIcon = (tab: string) => {
    const icons = {
      categories: Brain,
      videos: Video,
      lesson: FileText,
      quiz: Award,
    };
    return icons[tab as keyof typeof icons];
  };

  const getTabStatus = (tab: string) => {
    return completionStatus[tab as keyof typeof completionStatus];
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with AI Verification Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Brain className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="font-medium mb-1">AI-Powered Skills Verification</div>
          Your skills will be verified through our advanced AI system that
          analyzes your teaching demonstrations, lesson plans, and subject
          knowledge assessments for authenticity and quality.
        </AlertDescription>
      </Alert>

      {/* Progress Overview */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Skills Assessment Progress
            </CardTitle>
            <Badge
              variant={overallProgress === 100 ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              {Math.round(overallProgress)}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="mb-4 h-2" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["categories", "videos", "lesson", "quiz"].map((tab) => {
              const Icon = getTabIcon(tab);
              const isComplete = getTabStatus(tab);
              return (
                <div
                  key={tab}
                  className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                    isComplete
                      ? "border-green-200 bg-green-50"
                      : activeTab === tab
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mx-auto mb-1 ${
                      isComplete
                        ? "text-green-600"
                        : activeTab === tab
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  />
                  <div className="text-xs font-medium capitalize">{tab}</div>
                  {isComplete && (
                    <CheckCircle className="h-3 w-3 text-green-600 mx-auto mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6 h-12">
          {["categories", "videos", "lesson", "quiz"].map((tab) => {
            const Icon = getTabIcon(tab);
            const isComplete = getTabStatus(tab);
            return (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex items-center gap-2 data-[state=active]:bg-blue-100"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline capitalize">{tab}</span>
                {isComplete && (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="h-6 w-6 text-blue-600" />
                Teaching Categories & Expertise Levels
              </CardTitle>
              <CardDescription className="text-base">
                Select the subjects you want to teach and demonstrate your
                expertise level in each area. Choose categories that match your
                professional experience and passion.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8 space-y-8">
              {teachingCategories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <div key={category.id} className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div
                        className={`p-3 rounded-full bg-${category.color}-100`}
                      >
                        <CategoryIcon
                          className={`h-6 w-6 text-${category.color}-600`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {category.subcategories.length} specializations
                          available
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.subcategories.map((subcategory) => {
                        const existing = selectedCategories.find(
                          (cat: any) =>
                            cat.categoryId === category.id &&
                            cat.subcategory === subcategory.name
                        );

                        return (
                          <Card
                            key={subcategory.name}
                            className={`transition-all duration-200 hover:shadow-md ${
                              existing
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <span className="font-semibold text-gray-900 block mb-1">
                                    {subcategory.name}
                                  </span>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                      variant="secondary"
                                      className={`text-xs ${
                                        subcategory.demand === "Very High"
                                          ? "bg-red-100 text-red-700"
                                          : subcategory.demand === "High"
                                          ? "bg-orange-100 text-orange-700"
                                          : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {subcategory.demand} Demand
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <TrendingUp className="h-3 w-3" />
                                    {subcategory.popularity}% popularity
                                  </div>
                                </div>
                                {existing && (
                                  <Badge variant="default" className="ml-2">
                                    {existing.level}
                                  </Badge>
                                )}
                              </div>

                              <Select
                                value={existing?.level || ""}
                                onValueChange={(level) =>
                                  level === "remove"
                                    ? removeCategorySelection(
                                        category.id,
                                        subcategory.name
                                      )
                                    : handleCategorySelection(
                                        category.id,
                                        subcategory.name,
                                        level
                                      )
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select expertise level" />
                                </SelectTrigger>
                                <SelectContent>
                                  {existing && (
                                    <SelectItem
                                      value="remove"
                                      className="text-red-600"
                                    >
                                      Remove selection
                                    </SelectItem>
                                  )}
                                  {skillLevels.map((level) => {
                                    const LevelIcon = level.icon;
                                    return (
                                      <SelectItem
                                        key={level.id}
                                        value={level.id}
                                      >
                                        <div className="flex items-center gap-2">
                                          <LevelIcon
                                            className={`h-4 w-4 text-${level.color}-600`}
                                          />
                                          <div>
                                            <div className="font-medium">
                                              {level.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {level.requirements}
                                            </div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Selected Categories Summary */}
              {selectedCategories.length > 0 && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      Your Selected Teaching Areas ({selectedCategories.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedCategories.map((cat: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full bg-${
                                cat.level === "expert"
                                  ? "orange"
                                  : cat.level === "advanced"
                                  ? "purple"
                                  : cat.level === "intermediate"
                                  ? "blue"
                                  : "green"
                              }-500`}
                            />
                            <span className="font-medium">
                              {cat.subcategory}
                            </span>
                            <Badge variant="outline" >
                              {cat.level}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeCategorySelection(
                                cat.categoryId,
                                cat.subcategory
                              )
                            }
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          {/* Video Introduction */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Video className="h-6 w-6 text-purple-600" />
                Video Introduction
              </CardTitle>
              <CardDescription className="text-base">
                Record a personal introduction video to help students connect
                with you as an instructor
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              {videoIntroduction ? (
                <div className="space-y-6">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="font-medium">
                        Introduction video uploaded successfully!
                      </div>
                      <div className="text-sm mt-1">
                        Your video will be reviewed by our AI system for quality
                        and authenticity.
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Video className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-semibold block">
                            Introduction Video
                          </span>
                          <span className="text-sm text-gray-600">
                            {videoIntroduction.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Uploaded</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setVideoIntroduction(null)}
                        >
                          Replace
                        </Button>
                      </div>
                    </div>
                    <video
                      controls
                      className="w-full max-w-2xl rounded-lg border shadow-sm"
                      src={URL.createObjectURL(videoIntroduction)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Camera className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      Record Your Introduction
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Create a personal connection with potential students by
                      introducing yourself, your background, and your passion
                      for teaching.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Record Video
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Video
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Info className="h-5 w-5 text-blue-600" />
                        Video Requirements & Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Technical Requirements
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Duration:{" "}
                              {videoRequirements.introduction.duration}
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Format: MP4, MOV, or AVI
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Max file size: 500MB
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Resolution: 720p or higher
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Content Guidelines
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            {videoRequirements.introduction.requirements.map(
                              (req, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  {req}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Teaching Demo */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Play className="h-6 w-6 text-blue-600" />
                Teaching Demonstration
              </CardTitle>
              <CardDescription className="text-base">
                Showcase your teaching skills with a sample lesson that
                demonstrates your expertise and style
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              {teachingDemo ? (
                <div className="space-y-6">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="font-medium">
                        Teaching demonstration uploaded successfully!
                      </div>
                      <div className="text-sm mt-1">
                        AI analysis will evaluate your teaching methodology,
                        clarity, and engagement techniques.
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Play className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-semibold block">
                            Teaching Demo
                          </span>
                          <span className="text-sm text-gray-600">
                            {teachingDemo.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Uploaded</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTeachingDemo(null)}
                        >
                          Replace
                        </Button>
                      </div>
                    </div>
                    <video
                      controls
                      className="w-full max-w-2xl rounded-lg border shadow-sm"
                      src={URL.createObjectURL(teachingDemo)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Monitor className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      Record Teaching Demonstration
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Demonstrate your teaching skills by delivering a sample
                      lesson. This helps us evaluate your instructional methods
                      and student engagement techniques.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Record Demo
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Demo
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Demo Requirements & Evaluation Criteria
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        // 1. Missing part in the video demo card - complete the
                        requirements section:
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Technical Requirements
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Duration: {videoRequirements.demo.duration}
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Format: MP4, MOV, or AVI
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Max file size: 1GB
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Resolution: 720p or higher
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Evaluation Criteria
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            {videoRequirements.demo.requirements.map(
                              (req, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  {req}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Missing Lesson Plan Tab Content */}
        <TabsContent value="lesson" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-6 w-6 text-green-600" />
                Sample Lesson Plan
              </CardTitle>
              <CardDescription className="text-base">
                Create a comprehensive lesson plan that demonstrates your
                teaching methodology and curriculum design skills
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="lesson-plan"
                    className="text-base font-semibold"
                  >
                    Detailed Lesson Plan
                  </Label>
                  <Textarea
                    id="lesson-plan"
                    value={lessonPlan}
                    onChange={(e) => setLessonPlan(e.target.value)}
                    placeholder="Create a comprehensive lesson plan including learning objectives, lesson structure, activities, materials, and assessment methods..."
                    rows={20}
                    className="resize-none text-sm leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Minimum 500 characters required</span>
                    <span
                      className={
                        lessonPlan.length >= 500
                          ? "text-green-600"
                          : "text-orange-600"
                      }
                    >
                      {lessonPlan.length}/500
                    </span>
                  </div>
                </div>

                {lessonPlan.length >= 500 && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Great! Your lesson plan meets the minimum requirements and
                      will be evaluated by our AI system.
                    </AlertDescription>
                  </Alert>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-green-600" />
                      Lesson Plan Framework
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">
                          Essential Components
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            Clear learning objectives and outcomes
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            Structured lesson timeline (60 minutes)
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            Interactive activities and exercises
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            Required materials and resources
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            Assessment and evaluation methods
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">
                          Advanced Elements
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start gap-2">
                            <Star className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            Differentiation strategies
                          </li>
                          <li className="flex items-start gap-2">
                            <Star className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            Technology integration
                          </li>
                          <li className="flex items-start gap-2">
                            <Star className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            Real-world applications
                          </li>
                          <li className="flex items-start gap-2">
                            <Star className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            Student engagement techniques
                          </li>
                          <li className="flex items-start gap-2">
                            <Star className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            Homework and follow-up activities
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Missing Quiz Tab Content */}
        <TabsContent value="quiz" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-6 w-6 text-orange-600" />
                Knowledge Assessment
              </CardTitle>
              <CardDescription className="text-base">
                Demonstrate your subject expertise through comprehensive
                assessments tailored to your selected teaching areas
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              {selectedCategories.length > 0 ? (
                <div className="space-y-6">
                  <Alert className="border-orange-200 bg-orange-50">
                    <Brain className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <div className="font-medium mb-1">
                        AI-Powered Assessment System
                      </div>
                      Each assessment is dynamically generated based on your
                      expertise level and includes advanced anti-cheating
                      measures to ensure authentic evaluation.
                    </AlertDescription>
                  </Alert>

                  {selectedCategories.map((category: any, index: number) => {
                    const categoryData = teachingCategories.find(
                      (cat) => cat.id === category.categoryId
                    );
                    const CategoryIcon = categoryData?.icon || Award;
                    const isCompleted =
                      quizAnswers[
                        `${category.categoryId}-${category.subcategory}`
                      ];

                    return (
                      <Card
                        key={index}
                        className={`transition-all duration-200 ${
                          isCompleted
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg bg-${
                                  categoryData?.color || "gray"
                                }-100`}
                              >
                                <CategoryIcon
                                  className={`h-5 w-5 text-${
                                    categoryData?.color || "gray"
                                  }-600`}
                                />
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {category.subcategory}
                                </CardTitle>
                                <CardDescription>
                                  {categoryData?.name} • {category.level} level
                                </CardDescription>
                              </div>
                            </div>
                            {isCompleted ? (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {isCompleted ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < Math.floor(isCompleted.score / 20)
                                            ? "text-yellow-500 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="font-semibold text-lg">
                                    {isCompleted.score}%
                                  </span>
                                </div>
                                <Badge
                                  variant={
                                    isCompleted.score >= 80
                                      ? "default"
                                      : "destructive"
                                  }
                                >
                                  {isCompleted.score >= 80
                                    ? "Passed"
                                    : "Failed"}
                                </Badge>
                              </div>
                              <Progress
                                value={isCompleted.score}
                                className="h-2"
                              />
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newAnswers = { ...quizAnswers };
                                    delete newAnswers[
                                      `${category.categoryId}-${category.subcategory}`
                                    ];
                                    setQuizAnswers(newAnswers);
                                  }}
                                >
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Retake
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Results
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">
                                    15
                                  </div>
                                  <div className="text-xs text-blue-600">
                                    Questions
                                  </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">
                                    20
                                  </div>
                                  <div className="text-xs text-green-600">
                                    Minutes
                                  </div>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                  <div className="text-2xl font-bold text-orange-600">
                                    80%
                                  </div>
                                  <div className="text-xs text-orange-600">
                                    Pass Rate
                                  </div>
                                </div>
                              </div>
                              <Button
                                className="w-full"
                                onClick={() => {
                                  // Simulate quiz completion for demo
                                  const simulatedScore =
                                    Math.floor(Math.random() * 40) + 60; // 60-100%
                                  setQuizAnswers((prev:any) => ({
                                    ...prev,
                                    [`${category.categoryId}-${category.subcategory}`]:
                                      {
                                        score: simulatedScore,
                                        completedAt: new Date().toISOString(),
                                        questions: 15,
                                        correct: Math.floor(
                                          (simulatedScore / 100) * 15
                                        ),
                                      },
                                  }));
                                }}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Start Assessment
                              </Button>
                              <p className="text-sm text-gray-600 text-center">
                                Adaptive difficulty based on your{" "}
                                {category.level} expertise level
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* Overall Assessment Progress */}
                  {Object.keys(quizAnswers).length > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                          <TrendingUp className="h-5 w-5" />
                          Overall Assessment Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-blue-800">
                              Completed: {Object.keys(quizAnswers).length} /{" "}
                              {selectedCategories.length}
                            </span>
                            <Badge variant="secondary">
                              {Math.round(
                                (Object.keys(quizAnswers).length /
                                  selectedCategories.length) *
                                  100
                              )}
                              %
                            </Badge>
                          </div>
                          <Progress
                            value={
                              (Object.keys(quizAnswers).length /
                                selectedCategories.length) *
                              100
                            }
                            className="h-2"
                          />
                          <div className="text-sm text-blue-700">
                            Average Score:{" "}
                            {Object.keys(quizAnswers).length > 0
                              ? Math.round(
                                  Object.values(quizAnswers).reduce(
                                    (sum: number, result: any) =>
                                      sum + result.score,
                                    0
                                  ) / Object.keys(quizAnswers).length
                                )
                              : 0}
                            %
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center p-12">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="h-10 w-10 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Ready to Test Your Knowledge?
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Select your teaching categories first to access personalized
                    knowledge assessments that validate your expertise in each
                    subject area.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("categories")}
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    Select Teaching Categories
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}