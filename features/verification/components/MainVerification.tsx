"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileCheck,
  Brain,
  User,
  Award,
  AlertCircle,
  RefreshCw,
  Eye,
  Download,
  MessageSquare,
  Bell,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { IdentityVerification } from "./stages/IdentityVerification";
import { ProfessionalBackground } from "./stages/ProfessionalBackground";
import { SkillsAssessment } from "./stages/SkillsAssessment";
import { BackgroundCheck } from "./stages/BackgroundCheck";

// Type definitions
interface VerificationStage {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  estimatedTime: string;
  aiVerification: boolean;
  requirements: string[];
  weight: number;
}

interface VerificationData {
  identity: {
    personalInfo: Record<string, any>;
    documents: any[];
    verificationStatus: string;
    aiVerificationScore: number;
    lastUpdated: string | null;
  };
  professional: {
    education: any[];
    experience: any[];
    references: any[];
    verificationStatus: string;
    aiVerificationScore: number;
    lastUpdated: string | null;
  };
  skills: {
    categories: any[];
    assessments: any[];
    demonstrations: any[];
    verificationStatus: string;
    aiVerificationScore: number;
    lastUpdated: string | null;
  };
  background: {
    checks: any[];
    agreements: any[];
    verificationStatus: string;
    aiVerificationScore: number;
    lastUpdated: string | null;
  };
}

interface StageComponentProps {
  data: any;
  updateData: (data: any) => void;
}

interface VerificationStatusProps {
  data: VerificationData;
  currentStage: number;
}

// Enhanced verification stages with AI verification indicators
const verificationStages = [
  {
    id: "identity",
    title: "Identity Verification",
    description:
      "AI-powered identity verification with government-issued documents",
    icon: Shield,
    estimatedTime: "5-10 minutes",
    aiVerification: true,
    requirements: ["Government ID", "Selfie Photo", "Address Proof"],
    weight: 25,
  },
  {
    id: "professional",
    title: "Professional Credentials",
    description: "Educational background and professional certifications",
    icon: Award,
    estimatedTime: "15-20 minutes",
    aiVerification: true,
    requirements: [
      "Degree Certificates",
      "Professional Licenses",
      "References",
    ],
    weight: 30,
  },
  {
    id: "skills",
    title: "Skills Assessment",
    description: "AI-proctored skills evaluation and teaching demonstration",
    icon: Brain,
    estimatedTime: "45-60 minutes",
    aiVerification: true,
    requirements: ["Subject Test", "Teaching Demo", "Portfolio Review"],
    weight: 35,
  },
  {
    id: "background",
    title: "Background & Compliance",
    description: "Background check and platform policy agreements",
    icon: FileCheck,
    estimatedTime: "5-10 minutes",
    aiVerification: false,
    requirements: ["Background Check", "Policy Agreement", "Code of Conduct"],
    weight: 10,
  },
];

// Mock components for different stages
// const IdentityVerification: React.FC<StageComponentProps> = ({
//   data,
//   updateData,
// }) => (
//   <div className="space-y-6">
//     <Alert>
//       <AlertCircle className="h-4 w-4" />
//       <div className="ml-2">
//         <h4 className="font-medium">AI Document Verification</h4>
//         <p className="text-sm mt-1">
//           Our AI system will automatically verify your documents for
//           authenticity and accuracy.
//         </p>
//       </div>
//     </Alert>
//     <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
//       <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//       <p className="text-gray-600">Upload your identity documents here</p>
//       <Button className="mt-4">Start Identity Verification</Button>
//     </div>
//   </div>
// );

// const ProfessionalBackground: React.FC<StageComponentProps> = ({
//   data,
//   updateData,
// }) => (
//   <div className="space-y-6">
//     <Alert>
//       <Brain className="h-4 w-4" />
//       <div className="ml-2">
//         <h4 className="font-medium">Credential Verification</h4>
//         <p className="text-sm mt-1">
//           AI verification of educational credentials and professional
//           certifications.
//         </p>
//       </div>
//     </Alert>
//     <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
//       <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//       <p className="text-gray-600">Upload your professional credentials</p>
//       <Button className="mt-4">Upload Credentials</Button>
//     </div>
//   </div>
// );

// const SkillsAssessment: React.FC<StageComponentProps> = ({
//   data,
//   updateData,
// }) => (
//   <div className="space-y-6">
//     <Alert variant="destructive">
//       <Clock className="h-4 w-4" />
//       <div className="ml-2">
//         <h4 className="font-medium">AI-Proctored Assessment</h4>
//         <p className="text-sm mt-1">
//           This assessment is monitored by AI for integrity. Ensure you're in a
//           quiet environment.
//         </p>
//       </div>
//     </Alert>
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <Card>
//         <CardContent className="p-4 text-center">
//           <FileCheck className="h-8 w-8 mx-auto text-blue-600 mb-2" />
//           <h4 className="font-medium">Subject Test</h4>
//           <p className="text-sm text-gray-600">60 minutes</p>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardContent className="p-4 text-center">
//           <MessageSquare className="h-8 w-8 mx-auto text-green-600 mb-2" />
//           <h4 className="font-medium">Teaching Demo</h4>
//           <p className="text-sm text-gray-600">15 minutes</p>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardContent className="p-4 text-center">
//           <Eye className="h-8 w-8 mx-auto text-purple-600 mb-2" />
//           <h4 className="font-medium">Portfolio Review</h4>
//           <p className="text-sm text-gray-600">Upload samples</p>
//         </CardContent>
//       </Card>
//     </div>
//   </div>
// );

// const BackgroundCheck: React.FC<StageComponentProps> = ({
//   data,
//   updateData,
// }) => (
//   <div className="space-y-6">
//     <Alert variant="destructive">
//       <AlertTriangle className="h-4 w-4" />
//       <div className="ml-2">
//         <h4 className="font-medium">Background Verification</h4>
//         <p className="text-sm mt-1">
//           Third-party background check will be conducted. This may take 24-48
//           hours.
//         </p>
//       </div>
//     </Alert>
//     <div className="space-y-4">
//       <div className="flex items-center justify-between p-4 border rounded-lg">
//         <span>Criminal Background Check</span>
//         <Badge variant="secondary">Pending</Badge>
//       </div>
//       <div className="flex items-center justify-between p-4 border rounded-lg">
//         <span>Education Verification</span>
//         <Badge variant="secondary">Pending</Badge>
//       </div>
//       <div className="flex items-center justify-between p-4 border rounded-lg">
//         <span>Platform Policies Agreement</span>
//         <Badge variant="default">Completed</Badge>
//       </div>
//     </div>
//   </div>
// );

const VerificationStatus: React.FC<VerificationStatusProps> = ({
  data,
  currentStage,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Bell className="h-5 w-5" />
        Verification Status
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        {verificationStages.map((stage, index) => (
          <div key={stage.id} className="flex items-center justify-between">
            <span className="text-sm font-medium">{stage.title}</span>
            <Badge
              variant={
                index < currentStage
                  ? "default"
                  : index === currentStage
                  ? "secondary"
                  : "secondary"
              }
            >
              {index < currentStage
                ? "Complete"
                : index === currentStage
                ? "In Progress"
                : "Pending"}
            </Badge>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RefreshCw className="h-4 w-4" />
          Last updated: 2 minutes ago
        </div>
      </div>
    </CardContent>
  </Card>
);

const SecurityBadges = () => (
  <div className="flex items-center justify-center gap-4 mb-6">
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Shield className="h-4 w-4 text-green-600" />
      256-bit SSL Encryption
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Brain className="h-4 w-4 text-blue-600" />
      AI-Powered Verification
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <FileCheck className="h-4 w-4 text-purple-600" />
      GDPR Compliant
    </div>
  </div>
);

export function MainVerification() {
  const [currentStage, setCurrentStage] = useState(0);
  const [verificationData, setVerificationData] = useState<VerificationData>({
    identity: {
      personalInfo: {},
      documents: [],
      verificationStatus: "pending",
      aiVerificationScore: 0,
      lastUpdated: null,
    },
    professional: {
      education: [],
      experience: [],
      references: [],
      verificationStatus: "pending",
      aiVerificationScore: 0,
      lastUpdated: null,
    },
    skills: {
      categories: [],
      assessments: [],
      demonstrations: [],
      verificationStatus: "pending",
      aiVerificationScore: 0,
      lastUpdated: null,
    },
    background: {
      checks: [],
      agreements: [],
      verificationStatus: "pending",
      aiVerificationScore: 0,
      lastUpdated: null,
    },
  });
  const [overallProgress, setOverallProgress] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] =
    useState("45-75 minutes");
  const [showPreview, setShowPreview] = useState(false);

  // Calculate weighted progress
  const updateProgress = () => {
    let totalProgress = 0;
    verificationStages.forEach((stage) => {
      const stageData =
        verificationData[stage.id as keyof typeof verificationData];
      if (stageData?.verificationStatus === "completed") {
        totalProgress += stage.weight;
      } else if (stageData?.verificationStatus === "in-progress") {
        totalProgress += stage.weight * 0.5;
      }
    });
    setOverallProgress(totalProgress);

    // Update estimated time
    const remainingStages = verificationStages.slice(currentStage);
    const totalMinutes = remainingStages.reduce((total, stage) => {
      const [min, max] = stage.estimatedTime.split("-").map((t) => parseInt(t));
      return total + (min + max) / 2;
    }, 0);
    setEstimatedTimeRemaining(`${Math.round(totalMinutes)} minutes`);
  };

  useEffect(() => {
    updateProgress();
  }, [verificationData, currentStage]);

  const handleNext = () => {
    if (currentStage < verificationStages.length - 1) {
      // Mark current stage as completed
      updateVerificationData(
        verificationStages[currentStage].id as keyof VerificationData,
        {
          verificationStatus: "completed",
          lastUpdated: new Date().toISOString(),
        }
      );
      setCurrentStage(currentStage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const updateVerificationData = (
    stage: keyof VerificationData,
    data: Partial<VerificationData[keyof VerificationData]>
  ) => {
    setVerificationData((prev) => {
      const validStages = [
        "identity",
        "professional",
        "skills",
        "background",
      ] as const;

      if (!validStages.includes(stage as (typeof validStages)[number])) {
        return prev;
      }

      return {
        ...prev,
        [stage]: { ...prev[stage], ...data },
      };
    });
  };

  const handleSubmitVerification = () => {
    // Mark final stage as completed
    updateVerificationData(
      verificationStages[currentStage].id as keyof VerificationData,
      {
        verificationStatus: "completed",
        lastUpdated: new Date().toISOString(),
      }
    );

    // Show success message
    alert(
      "Verification Submitted! You'll receive an update within 24-48 hours via email and dashboard notifications."
    );
  };

  const getStageStatus = (
    stageIndex: number
  ): "completed" | "current" | "pending" => {
    if (stageIndex < currentStage) return "completed";
    if (stageIndex === currentStage) return "current";
    return "pending";
  };

  const canProceed = () => {
    const currentStageData =
      verificationData[
        verificationStages[currentStage].id as keyof VerificationData
      ];
    // Add logic to check if current stage requirements are met
    return true; // Simplified for demo
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="sm:w-[90vw] mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-gray-900">
            Instructor Verification
          </h1>
          <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
            Complete our AI-powered verification process to join our platform as
            a certified instructor
          </p>
          <SecurityBadges />

          {/* Time Estimate */}
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4" />
            Estimated time remaining: {estimatedTimeRemaining}
          </div>
        </div>

        {/* Enhanced Progress Overview */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Verification Progress
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge
                  variant={overallProgress === 100 ? "default" : "secondary"}
                  className="text-base px-3 py-1"
                >
                  {Math.round(overallProgress)}% Complete
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? "Hide" : "Preview"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="mb-6 h-3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {verificationStages.map((stage, index) => {
                const status = getStageStatus(index);
                const Icon = stage.icon;

                return (
                  <div
                    key={stage.id}
                    className={`p-5 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                      status === "current"
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : status === "completed"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-2 rounded-full ${
                          status === "current"
                            ? "bg-blue-100"
                            : status === "completed"
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            status === "current"
                              ? "text-blue-600"
                              : status === "completed"
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-sm block">
                          {stage.title}
                        </span>
                        {stage.aiVerification && (
                          <div className="flex items-center gap-1 mt-1">
                            <Brain className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-blue-600">
                              AI Verified
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                      {stage.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        {stage.estimatedTime}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {stage.weight}% weight
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Requirements Preview */}
            {showPreview && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">
                  Current Stage Requirements:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {verificationStages[currentStage].requirements.map(
                    (req, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {req}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-3 text-xl">
                  {React.createElement(verificationStages[currentStage].icon, {
                    className: "h-7 w-7 text-blue-600",
                  })}
                  <div>
                    <div>{verificationStages[currentStage].title}</div>
                    <p className="text-sm font-normal text-gray-600 mt-1">
                      Step {currentStage + 1} of {verificationStages.length}
                    </p>
                  </div>
                </CardTitle>
                <p className="text-gray-700 mt-2">
                  {verificationStages[currentStage].description}
                </p>
              </CardHeader>
              <CardContent className="py-8">
                {currentStage === 0 && (
                  <IdentityVerification
                    data={verificationData.identity}
                    updateData={(data) =>
                      updateVerificationData("identity", data)
                    }
                  />
                )}
                {currentStage === 1 && (
                  <ProfessionalBackground
                    data={verificationData.professional}
                    updateData={(data) =>
                      updateVerificationData("professional", data)
                    }
                  />
                )}
                {currentStage === 2 && (
                  <SkillsAssessment
                    data={verificationData.skills}
                    updateData={(data) =>
                      updateVerificationData("skills", data)
                    }
                  />
                )}
                {currentStage === 3 && (
                  <BackgroundCheck
                    data={verificationData.background}
                    updateData={(data) =>
                      updateVerificationData("background", data)
                    }
                  />
                )}
              </CardContent>

              {/* Enhanced Navigation */}
              <div className="flex justify-between items-center p-6 border-t bg-gray-50">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStage === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous Step
                </Button>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {currentStage + 1} of {verificationStages.length}
                  </span>

                  {currentStage === verificationStages.length - 1 ? (
                    <Button
                      onClick={handleSubmitVerification}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      disabled={!canProceed()}
                    >
                      Submit for Review
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="flex items-center gap-2"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <VerificationStatus
              data={verificationData}
              currentStage={currentStage}
            />

            {/* Help Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Live Chat Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Guide
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
