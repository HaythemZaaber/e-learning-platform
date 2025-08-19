"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  User,
  Award,
  Calendar,
  Eye,
  Download,
  RefreshCw,
  ArrowRight,
  Info,
  Shield,
  BookOpen,
  Users,
  Target,
  Star,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  School,
  FileCheck,
  Video,
  Image,
  File,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Bell,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  Timer,
  Sparkles,
  Upload,
  Play,
  FileImage,
  X,
  GraduationCapIcon,
  Building2,
  Languages,
  Heart,
  Brain,
  Lightbulb,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useApolloClient } from "@apollo/client";
import { GET_INSTRUCTOR_VERIFICATION } from "@/features/becomeInstructor/verification/graphql/instructor-application";
import { showToast } from "@/utils/toast";


// Types
type ApplicationStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "REQUIRES_MORE_INFO";

interface ApplicationData {
  id: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt: string | null;
  createdAt: string;
  estimatedReviewTime: string;
  overallProgress: number;
  reviewerNotes: string;
  nextSteps: string[];
  manualReview?: {
    decision?: string;
    decisionReason?: string;
    reviewedAt?: string;
    conditionalRequirements?: string[];
  };
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    nationality: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    timezone: string;
    primaryLanguage: string;
    languagesSpoken: Array<{
      language: string;
      proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
      canTeachIn: boolean;
    }>;
    emergencyContact: {
      name: string;
      relationship: string;
      phoneNumber: string;
      email?: string;
    };
  };
  professionalBackground: {
    currentJobTitle?: string;
    currentEmployer?: string;
    employmentType: 'full_time' | 'part_time' | 'freelance' | 'self_employed' | 'unemployed' | 'student';
    workLocation: string;
    yearsOfExperience: number;
    education: Array<{
      id: string;
      institution: string;
      degree: string;
      field: string;
      startYear: string;
      endYear: string;
      gpa?: string;
      honors?: string;
      description: string;
      isVerified?: boolean;
      verificationStatus?: 'pending' | 'verified' | 'failed';
    }>;
    experience: Array<{
      id: string;
      position: string;
      company: string;
      startDate: string;
      endDate: string | null;
      current: boolean;
      location: string;
      description: string;
      achievements?: string[];
      isVerified?: boolean;
      verificationStatus?: 'pending' | 'verified' | 'failed';
    }>;
    references: Array<{
      id: string;
      name: string;
      position: string;
      company: string;
      email: string;
      phone: string;
      relationship: string;
      yearsKnown?: string;
      isVerified?: boolean;
      verificationStatus?: 'pending' | 'verified' | 'failed';
    }>;
  };
  teachingInformation: {
    subjectsToTeach: Array<{
      subject: string;
      category: string;
      level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
      experienceYears: number;
      confidence: 1 | 2 | 3 | 4 | 5;
    }>;
    hasTeachingExperience: boolean;
    teachingExperience: Array<{
      id: string;
      role: string;
      institution: string;
      subject: string;
      level: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      description: string;
      studentsCount?: number;
      achievements?: string[];
    }>;
    teachingMotivation: string;
    teachingPhilosophy: string;
    targetAudience: string[];
    teachingStyle: string;
    teachingMethodology: string;
    preferredFormats: string[];
    preferredClassSize: string;
  };
  documents: {
    identityDocument: {
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
      uploadDate: string;
      verificationStatus: 'pending' | 'verified' | 'failed';
    } | null;
    profilePhoto: {
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
      uploadDate: string;
      verificationStatus: 'pending' | 'verified' | 'failed';
    } | null;
    resume: {
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
      uploadDate: string;
      verificationStatus: 'pending' | 'verified' | 'failed';
    } | null;
    videoIntroduction: {
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
      uploadDate: string;
      verificationStatus: 'pending' | 'verified' | 'failed';
    } | null;
    teachingDemo: {
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
      uploadDate: string;
      verificationStatus: 'pending' | 'verified' | 'failed';
    } | null;
    educationCertificates: Array<{
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
      uploadDate: string;
      verificationStatus: 'pending' | 'verified' | 'failed';
    }>;
    professionalCertifications: Array<{
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
      uploadDate: string;
      verificationStatus: 'pending' | 'verified' | 'failed';
    }>;
  };
  consents: {
    backgroundCheck: boolean;
    dataProcessing: boolean;
    termOfService: boolean;
    privacyPolicy: boolean;
    contentGuidelines: boolean;
    codeOfConduct: boolean;
  };
  steps: Array<{
    id: string;
    title: string;
    status: 'completed' | 'in_progress' | 'pending' | 'failed';
    completionPercentage: number;
    lastUpdated?: string;
    notes?: string;
  }>;
  statusInfo: {
    title: string;
    description: string;
    actionText: string;
  };
}

const getStatusInfo = (status: ApplicationStatus) => {
  switch (status) {
    case "DRAFT":
      return {
        icon: FileText,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
        ringColor: "ring-slate-200",
        title: "Draft",
        description: "Your application is saved as a draft",
        actionText: "Continue Application"
      };
    case "SUBMITTED":
      return {
        icon: Clock,
        color: "text-blue-600", 
        bgColor: "bg-blue-50",
        badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
        ringColor: "ring-blue-200",
        title: "Submitted",
        description: "Your application has been submitted and is queued for review",
        actionText: "View Application"
      };
    case "UNDER_REVIEW":
      return {
        icon: Activity,
        color: "text-amber-600",
        bgColor: "bg-amber-50", 
        badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
        ringColor: "ring-amber-200",
        title: "Under Review",
        description: "Our team is carefully reviewing your application",
        actionText: "Track Progress"
      };
    case "APPROVED":
      return {
        icon: CheckCircle2,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200", 
        ringColor: "ring-emerald-200",
        title: "Approved",
        description: "Congratulations! You're now an approved instructor",
        actionText: "Start Teaching"
      };
    case "REJECTED":
      return {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        badgeColor: "bg-red-100 text-red-700 border-red-200",
        ringColor: "ring-red-200", 
        title: "Needs Attention",
        description: "Your application requires some updates",
        actionText: "Review Feedback"
      };
    case "REQUIRES_MORE_INFO":
      return {
        icon: AlertTriangle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        badgeColor: "bg-orange-100 text-orange-700 border-orange-200",
        ringColor: "ring-orange-200",
        title: "Needs More Info", 
        description: "Please address the feedback and resubmit",
        actionText: "Update Application"
      };
    default:
      return {
        icon: FileText,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
        ringColor: "ring-slate-200",
        title: "Unknown",
        description: "Application status unknown",
        actionText: "View Details"
      };
  }
};

// Custom hook to fetch application status
const useApplicationStatus = (userId: string | undefined) => {
  const client = useApolloClient();
  const [data, setData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!userId) {
      setError("User ID is required");
      return;
    }

    console.log('Fetching application status for user:', userId);

    try {
      setLoading(true);
      setError(null);

      const { data: response } = await client.query({
        query: GET_INSTRUCTOR_VERIFICATION,
        variables: { userId },
        fetchPolicy: 'network-only',
      });

      console.log('GraphQL response:', response);

      if (response.getInstructorVerification.success && response.getInstructorVerification.data) {
        const verificationData = response.getInstructorVerification.data;
        
        // Transform the data to match the application status page format
        const transformedData = transformVerificationDataForStatus(verificationData);
        setData(transformedData);
      } else {
        // If no application exists, set data to null instead of error
        if (response.getInstructorVerification.message?.includes('not found') || 
            response.getInstructorVerification.message?.includes('No verification')) {
          setData(null);
        } else {
          setError(response.getInstructorVerification.message || "Failed to fetch application status");
        }
      }
    } catch (err) {
      console.error('Error fetching application status:', err);
      setError("Failed to fetch application status");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
};

// Transform verification data to match application status page format
const transformVerificationDataForStatus = (verificationData: any): ApplicationData => {
  const personalInfo = verificationData.personalInfo || {};
  const professionalBackground = verificationData.professionalBackground || {};
  const teachingInformation = verificationData.teachingInformation || {};
  const documents = verificationData.documents || {};
  const consents = verificationData.consents || {};
  const manualReview = verificationData.manualReview || {};
  
  // Calculate overall progress based on application status and manual review
  let overallProgress = 0;
  
  if (verificationData.status === 'DRAFT') {
    // Calculate progress based on completed sections
    const completedSections = [
      !!personalInfo.firstName,
      !!(professionalBackground.education?.length > 0),
      !!(teachingInformation.subjectsToTeach?.length > 0),
      !!(documents.identityDocument && documents.profilePhoto),
      !!(consents.backgroundCheck && consents.termOfService && consents.privacyPolicy)
    ];
    const completedCount = completedSections.filter(Boolean).length;
    overallProgress = Math.round((completedCount / 5) * 30); // Max 30% for draft
  } else if (verificationData.status === 'SUBMITTED') {
    overallProgress = 40; // Submitted applications are 40% complete
  } else if (verificationData.status === 'UNDER_REVIEW') {
    overallProgress = manualReview.reviewedAt ? 85 : 70; // Higher progress if manual review completed
  } else if (verificationData.status === 'REQUIRES_MORE_INFO') {
    overallProgress = 85; // Requires more info applications are 85% complete
  } else if (verificationData.status === 'APPROVED') {
    overallProgress = 100; // Approved applications are 100% complete
  } else if (verificationData.status === 'REJECTED') {
    overallProgress = 90; // Rejected applications are 90% complete (process finished)
  }

  // Transform steps for timeline based on status and manual review
  const transformedSteps: Array<{
    id: string;
    title: string;
    status: 'completed' | 'in_progress' | 'pending' | 'failed';
    completionPercentage: number;
    lastUpdated?: string;
    notes?: string;
  }> = [
    {
      id: 'application-created',
      title: 'Application Created',
      status: 'completed',
      completionPercentage: 100,
      lastUpdated: verificationData.createdAt,
      notes: 'Application started',
    },
    {
      id: 'personal-information',
      title: 'Personal Information',
      status: personalInfo.firstName ? 'completed' : 'pending',
      completionPercentage: personalInfo.firstName ? 100 : 0,
      lastUpdated: personalInfo.lastUpdated || verificationData.updatedAt,
      notes: personalInfo.firstName ? 'Personal details completed' : 'Personal details pending',
    },
    {
      id: 'professional-background',
      title: 'Professional Background',
      status: professionalBackground.education?.length > 0 ? 'completed' : 'pending',
      completionPercentage: professionalBackground.education?.length > 0 ? 100 : 0,
      lastUpdated: professionalBackground.lastUpdated || verificationData.updatedAt,
      notes: professionalBackground.education?.length > 0 ? 'Professional background completed' : 'Professional background pending',
    },
    {
      id: 'teaching-information',
      title: 'Teaching Information',
      status: teachingInformation.subjectsToTeach?.length > 0 ? 'completed' : 'pending',
      completionPercentage: teachingInformation.subjectsToTeach?.length > 0 ? 100 : 0,
      lastUpdated: teachingInformation.lastUpdated || verificationData.updatedAt,
      notes: teachingInformation.subjectsToTeach?.length > 0 ? 'Teaching information completed' : 'Teaching information pending',
    },
    {
      id: 'documents',
      title: 'Documents & Verification',
      status: (documents.identityDocument && documents.profilePhoto) ? 'completed' : 'pending',
      completionPercentage: (documents.identityDocument && documents.profilePhoto) ? 100 : 0,
      lastUpdated: documents.lastUpdated || verificationData.updatedAt,
      notes: (documents.identityDocument && documents.profilePhoto) ? 'Required documents uploaded' : 'Documents pending',
    },
    {
      id: 'application-submitted',
      title: 'Application Submitted',
      status: verificationData.submittedAt ? 'completed' : 'pending',
      completionPercentage: verificationData.submittedAt ? 100 : 0,
      lastUpdated: verificationData.submittedAt,
      notes: verificationData.submittedAt ? 'Application submitted for review' : 'Application not yet submitted',
    },
    {
      id: 'initial-review',
      title: 'Initial Review',
      status: verificationData.status === 'SUBMITTED' ? 'in_progress' : 
             verificationData.status === 'UNDER_REVIEW' ? 'completed' : 
             verificationData.status === 'APPROVED' ? 'completed' : 
             verificationData.status === 'REQUIRES_MORE_INFO' ? 'completed' : 
             verificationData.status === 'REJECTED' ? 'completed' : 'pending',
      completionPercentage: verificationData.status === 'SUBMITTED' ? 30 : 
                           verificationData.status === 'UNDER_REVIEW' ? 100 : 
                           verificationData.status === 'APPROVED' ? 100 : 
                           verificationData.status === 'REQUIRES_MORE_INFO' ? 100 : 
                           verificationData.status === 'REJECTED' ? 100 : 0,
      lastUpdated: verificationData.submittedAt,
      notes: verificationData.status === 'SUBMITTED' ? 'Application received and queued' : 
             verificationData.status === 'UNDER_REVIEW' ? 'Under comprehensive review' : 
             verificationData.status === 'APPROVED' ? 'Review completed - approved' : 
             verificationData.status === 'REQUIRES_MORE_INFO' ? 'Review completed - requires updates' : 
             verificationData.status === 'REJECTED' ? 'Review completed - not approved' : 'Pending submission',
    },
    {
      id: 'comprehensive-review',
      title: 'Comprehensive Review',
      status: verificationData.status === 'UNDER_REVIEW' ? 'in_progress' : 
             verificationData.status === 'APPROVED' ? 'completed' : 
             verificationData.status === 'REQUIRES_MORE_INFO' ? 'completed' : 
             verificationData.status === 'REJECTED' ? 'completed' : 'pending',
      completionPercentage: verificationData.status === 'UNDER_REVIEW' ? 60 : 
                           verificationData.status === 'APPROVED' ? 100 : 
                           verificationData.status === 'REQUIRES_MORE_INFO' ? 100 : 
                           verificationData.status === 'REJECTED' ? 100 : 0,
      lastUpdated: manualReview.reviewedAt || verificationData.updatedAt,
      notes: verificationData.status === 'UNDER_REVIEW' ? 'Background checks and verification in progress' : 
             verificationData.status === 'APPROVED' ? 'All checks completed successfully' : 
             verificationData.status === 'REQUIRES_MORE_INFO' ? 'Review completed with requirements' : 
             verificationData.status === 'REJECTED' ? 'Review completed - not approved' : 'Awaiting review',
    },
    {
      id: 'manual-review',
      title: 'Manual Review',
      status: manualReview.reviewedAt ? 'completed' : 
             verificationData.status === 'UNDER_REVIEW' ? 'in_progress' : 'pending',
      completionPercentage: manualReview.reviewedAt ? 100 : 
                           verificationData.status === 'UNDER_REVIEW' ? 80 : 0,
      lastUpdated: manualReview.reviewedAt,
      notes: manualReview.reviewedAt ? 
             `Review completed - ${manualReview.decision || 'Decision made'}` : 
             verificationData.status === 'UNDER_REVIEW' ? 'Under manual review by our team' : 'Awaiting manual review',
    },
    {
      id: 'final-decision',
      title: 'Final Decision',
      status: verificationData.status === 'APPROVED' ? 'completed' : 
             verificationData.status === 'REQUIRES_MORE_INFO' ? 'completed' : 
             verificationData.status === 'REJECTED' ? 'completed' : 'pending',
      completionPercentage: verificationData.status === 'APPROVED' ? 100 : 
                           verificationData.status === 'REQUIRES_MORE_INFO' ? 100 : 
                           verificationData.status === 'REJECTED' ? 100 : 0,
      lastUpdated: manualReview.reviewedAt || verificationData.updatedAt,
      notes: verificationData.status === 'APPROVED' ? 'Application approved - welcome aboard!' : 
             verificationData.status === 'REQUIRES_MORE_INFO' ? 'Updates required - please review feedback' : 
             verificationData.status === 'REJECTED' ? 'Application not approved at this time' : 'Decision pending',
    },
  ];

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return {
          title: 'Draft',
          description: 'Your application is saved as a draft',
          actionText: 'Continue Application'
        };
      case 'SUBMITTED':
        return {
          title: 'Submitted',
          description: 'Your application has been submitted and is queued for review',
          actionText: 'View Application'
        };
      case 'UNDER_REVIEW':
        return {
          title: 'Under Review',
          description: 'Our team is carefully reviewing your application',
          actionText: 'Track Progress'
        };
      case 'APPROVED':
        return {
          title: 'Approved',
          description: 'Congratulations! You\'re now an approved instructor',
          actionText: 'Start Teaching'
        };
      case 'REJECTED':
        return {
          title: 'Needs Attention',
          description: 'Your application requires some updates',
          actionText: 'Review Feedback'
        };
      default:
        return {
          title: 'Unknown',
          description: 'Application status unknown',
          actionText: 'View Details'
        };
    }
  };

  const statusInfo = getStatusInfo(verificationData.status);

  // Handle manual review information for REQUIRES_MORE_INFO status
  let reviewerNotes = 'Your application is progressing well through our review process. Our team is currently verifying your professional credentials and teaching qualifications.';
  let nextSteps: string[] = [];
  
  if (verificationData.status === 'REQUIRES_MORE_INFO' && manualReview) {
    reviewerNotes = manualReview.decisionReason || 'Your application requires additional information before we can proceed with the review.';
    nextSteps = manualReview.conditionalRequirements || [];
  } else if (verificationData.status === 'UNDER_REVIEW') {
    if (manualReview.reviewedAt) {
      reviewerNotes = manualReview.decisionReason || 'Your application has been reviewed and is currently under final evaluation.';
      nextSteps = [
        'Final decision processing',
        'Notification preparation',
        'Onboarding setup (if approved)'
      ];
    } else {
      reviewerNotes = 'Your application is under comprehensive review by our team. We are verifying all submitted information and conducting background checks.';
      nextSteps = [
        'Background check in progress',
        'Credential verification ongoing', 
        'Teaching demo evaluation',
        'Manual review scheduling'
      ];
    }
  } else if (verificationData.status === 'APPROVED') {
    reviewerNotes = 'Congratulations! Your application has been approved. Welcome to our instructor community!';
    nextSteps = [
      'Complete onboarding process',
      'Set up your instructor profile',
      'Start creating your first course',
      'Attend instructor orientation'
    ];
  } else if (verificationData.status === 'REJECTED') {
    reviewerNotes = manualReview.decisionReason || 'We regret to inform you that your application was not approved at this time.';
    nextSteps = [
      'Review feedback provided',
      'Consider reapplying in the future',
      'Address any concerns mentioned'
    ];
  }

  return {
    id: verificationData.id,
    status: verificationData.status,
    submittedAt: verificationData.submittedAt,
    reviewedAt: verificationData.reviewedAt,
    createdAt: verificationData.createdAt,
    estimatedReviewTime: '3-5 business days',
    overallProgress,
    reviewerNotes,
    nextSteps,
    personalInfo: {
      firstName: personalInfo.firstName || '',
      lastName: personalInfo.lastName || '',
      email: personalInfo.email || '',
      phoneNumber: personalInfo.phoneNumber || '',
      dateOfBirth: personalInfo.dateOfBirth || '',
      nationality: personalInfo.nationality || '',
      streetAddress: personalInfo.streetAddress || '',
      city: personalInfo.city || '',
      state: personalInfo.state || '',
      postalCode: personalInfo.postalCode || '',
      country: personalInfo.country || '',
      timezone: personalInfo.timezone || 'UTC',
      primaryLanguage: personalInfo.primaryLanguage || 'en',
      languagesSpoken: personalInfo.languagesSpoken || [],
      emergencyContact: personalInfo.emergencyContact || {
        name: '',
        relationship: '',
        phoneNumber: '',
        email: '',
      },
    },
    professionalBackground: {
      currentJobTitle: professionalBackground.currentJobTitle || '',
      currentEmployer: professionalBackground.currentEmployer || '',
      employmentType: professionalBackground.employmentType || 'full_time',
      workLocation: professionalBackground.workLocation || '',
      yearsOfExperience: professionalBackground.yearsOfExperience || 0,
      education: professionalBackground.education || [],
      experience: professionalBackground.experience || [],
      references: professionalBackground.references || [],
    },
    teachingInformation: {
      subjectsToTeach: teachingInformation.subjectsToTeach || [],
      hasTeachingExperience: teachingInformation.hasTeachingExperience || false,
      teachingExperience: teachingInformation.teachingExperience || [],
      teachingMotivation: teachingInformation.teachingMotivation || '',
      teachingPhilosophy: teachingInformation.teachingPhilosophy || '',
      targetAudience: teachingInformation.targetAudience || [],
      teachingStyle: teachingInformation.teachingStyle || '',
      teachingMethodology: teachingInformation.teachingMethodology || '',
      preferredFormats: teachingInformation.preferredFormats || [],
      preferredClassSize: teachingInformation.preferredClassSize || 'any',
    },
    documents: {
      identityDocument: documents.identityDocument || null,
      profilePhoto: documents.profilePhoto || null,
      resume: documents.resume || null,
      videoIntroduction: documents.videoIntroduction || null,
      teachingDemo: documents.teachingDemo || null,
      educationCertificates: documents.educationCertificates || [],
      professionalCertifications: documents.professionalCertifications || [],
    },
    consents: {
      backgroundCheck: consents.backgroundCheck || false,
      dataProcessing: consents.dataProcessing || false,
      termOfService: consents.termOfService || false,
      privacyPolicy: consents.privacyPolicy || false,
      contentGuidelines: consents.contentGuidelines || false,
      codeOfConduct: consents.codeOfConduct || false,
    },
    steps: transformedSteps,
    statusInfo,
  };
};

const ProgressRing = ({ percentage, size = 120, strokeWidth = 8 }: { percentage: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor" 
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-500 transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{percentage}%</div>
          <div className="text-xs text-slate-500">Complete</div>
        </div>
      </div>
    </div>
  );
};

const StatusTimeline = ({ steps }: { steps: any[] }) => {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div key={step.id} className="relative flex items-start">
          {/* Timeline line */}
          {index < steps.length - 1 && (
            <div className="absolute left-6 top-12 w-0.5 h-16 bg-slate-200" />
          )}
          
          {/* Status icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ring-4 ring-white ${
            step.status === "completed" ? "bg-emerald-100 text-emerald-600" :
            step.status === "in_progress" ? "bg-blue-100 text-blue-600" :
            step.status === "failed" ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400"
          }`}>
            {step.status === "completed" ? (
              <CheckCircle className="w-6 h-6" />
            ) : step.status === "in_progress" ? (
              <Clock className="w-6 h-6" />
            ) : step.status === "failed" ? (
              <XCircle className="w-6 h-6" />
            ) : (
              <div className="w-3 h-3 rounded-full bg-current" />
            )}
          </div>

          {/* Step content */}
          <div className="ml-6 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-900">{step.title}</h4>
              <span className="text-sm font-medium text-slate-500">
                {step.completionPercentage}%
              </span>
            </div>
            
            {step.notes && (
              <p className="mt-1 text-sm text-slate-600">{step.notes}</p>
            )}
            
            {step.lastUpdated && (
              <p className="mt-2 text-xs text-slate-500">
                Last updated: {new Date(step.lastUpdated).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}

            {/* Progress bar */}
            <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  step.status === "completed" ? "bg-emerald-500" :
                  step.status === "in_progress" ? "bg-blue-500" :
                  step.status === "failed" ? "bg-red-500" : "bg-slate-300"
                }`}
                style={{ width: `${step.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};



const DocumentCard = ({ document, title, type }: { document: any; title: string; type: string }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  if (!document) return null;

  const getDocumentIcon = () => {
    if (document.type?.includes('image')) return <FileImage className="w-5 h-5" />;
    if (document.type?.includes('video')) return <Video className="w-5 h-5" />;
    if (document.type?.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getStatusColor = () => {
    switch (document.verificationStatus) {
      case 'verified': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  return (
    <>
    <div className="group relative bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
            <div 
              className="flex-shrink-0 p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors cursor-pointer"
              onClick={handlePreview}
            >
            {getDocumentIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{title}</h4>
            <p className="text-xs text-slate-500 truncate">{document.name}</p>
            <p className="text-xs text-slate-400 mt-1">
              {(document.size / 1024 / 1024).toFixed(1)} MB • {new Date(document.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor()}`}>
            {document.verificationStatus === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
            {document.verificationStatus === 'pending' && <Clock className="w-3 h-3 mr-1" />}
            {document.verificationStatus === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
            {document.verificationStatus}
          </span>
          
            <button 
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              onClick={handlePreview}
            >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Preview: {title}
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 max-h-[calc(90vh-120px)] overflow-auto">
              {document.type?.startsWith('image/') && (
                <img
                  src={document.url}
                  alt={title}
                  className="w-full max-h-[70vh] object-contain"
                  onError={(e) => {
                    console.error("Image preview error:", e);
                    showToast('error', "Image Preview Error", "Failed to load image preview.");
                  }}
                />
              )}
              
              {document.type?.startsWith('video/') && (
                <video
                  src={document.url}
                  controls
                  className="w-full max-h-[70vh] object-contain"
                  autoPlay
                  preload="metadata"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error("Video preview error:", e);
                    showToast('error', "Video Preview Error", "Failed to load video preview. The video file may be corrupted or in an unsupported format.");
                  }}
                >
                  <source src={document.url} type={document.type} />
                  Your browser does not support the video tag.
                </video>
              )}
              
              {!document.type?.startsWith('video/') && !document.type?.startsWith('image/') && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Document preview not available for this file type
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download Document
                    </a>
                    
                    <button
                      onClick={() => window.open(document.url, '_blank')}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Open in New Tab
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function InstructorApplicationStatus() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { data: applicationData, loading, error, refetch } = useApplicationStatus(user?.id);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const isFetchingRef = useRef(false);

  // Always call useMemo to maintain hook order
  const stats = useMemo(() => {
    if (!applicationData) {
      return [
        {
          label: "Application Progress",
          value: "0%",
          icon: BarChart3,
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        },
        {
          label: "Documents Verified",
          value: "0/0",
          icon: FileCheck,
          color: "text-emerald-600", 
          bgColor: "bg-emerald-50"
        },
        {
          label: "Days in Review",
          value: "0",
          icon: CalendarIcon,
          color: "text-amber-600",
          bgColor: "bg-amber-50"
        },
        {
          label: "Teaching Subjects",
          value: "0",
          icon: BookOpen,
          color: "text-purple-600",
          bgColor: "bg-purple-50"
        }
      ];
    }

    const verifiedDocuments = [
      applicationData.documents.identityDocument,
      applicationData.documents.profilePhoto,
      applicationData.documents.resume,
      applicationData.documents.videoIntroduction,
      applicationData.documents.teachingDemo,
      ...applicationData.documents.educationCertificates,
      ...applicationData.documents.professionalCertifications,
    ].filter(doc => doc && doc.verificationStatus === 'verified').length;

    const totalDocuments = [
      applicationData.documents.identityDocument,
      applicationData.documents.profilePhoto,
      applicationData.documents.resume,
      applicationData.documents.videoIntroduction,
      applicationData.documents.teachingDemo,
      ...applicationData.documents.educationCertificates,
      ...applicationData.documents.professionalCertifications,
    ].filter(Boolean).length;

    const daysInReview = (() => {
      if (!applicationData.submittedAt) {
        return applicationData.status === 'UNDER_REVIEW' ? 1 : 0;
      }
      
      try {
        const submittedDate = new Date(applicationData.submittedAt);
        if (isNaN(submittedDate.getTime())) {
          return applicationData.status === 'UNDER_REVIEW' ? 1 : 0;
        }
        
        const days = Math.ceil((new Date().getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));
        return isNaN(days) ? (applicationData.status === 'UNDER_REVIEW' ? 1 : 0) : days;
      } catch (error) {
        console.error('Error calculating days in review:', error);
        return applicationData.status === 'UNDER_REVIEW' ? 1 : 0;
      }
    })();

    return [
    {
      label: "Application Progress",
      value: `${applicationData.overallProgress}%`,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Documents Verified",
        value: `${verifiedDocuments}/${totalDocuments}`,
      icon: FileCheck,
      color: "text-emerald-600", 
      bgColor: "bg-emerald-50"
    },
    {
      label: "Days in Review",
        value: daysInReview.toString(),
      icon: CalendarIcon,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      label: "Teaching Subjects",
      value: applicationData.teachingInformation.subjectsToTeach.length.toString(),
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
    ];
  }, [applicationData]);

    useEffect(() => {
    // Debug authentication state (only log once to avoid spam)
    console.log('Auth state changed:', { authLoading, isAuthenticated, userId: user?.id });
    
    // Only fetch if user is authenticated and not loading
    if (!authLoading && isAuthenticated && user?.id && !isFetchingRef.current) {
      isFetchingRef.current = true;
      refetch().finally(() => {
        isFetchingRef.current = false;
      });
    }
  }, [user?.id, authLoading, isAuthenticated]); // Remove refetch from dependencies to prevent infinite loop

  const refreshApplicationStatus = async () => {
    if (!user?.id || refreshing || isFetchingRef.current) return; // Prevent multiple simultaneous refreshes
    
    try {
      setRefreshing(true);
      isFetchingRef.current = true;
      await refetch();
      showToast('success', 'Status Updated', 'Application status has been refreshed.');
    } catch (err) {
      showToast('error', 'Refresh Failed', 'Failed to refresh application status.');
      console.error(err);
    } finally {
      setRefreshing(false);
      isFetchingRef.current = false;
    }
  };

  const handleContactSupport = () => {
    // TODO: Implement contact support functionality
    showToast('info', 'Contact Support', 'Support contact functionality will be implemented soon.');
  };

  const handleDownloadApplication = () => {
    // TODO: Implement download application functionality
    showToast('info', 'Download Application', 'Download functionality will be implemented soon.');
  };

  const handleNotificationSettings = () => {
    // TODO: Implement notification settings functionality
    showToast('info', 'Notification Settings', 'Notification settings will be implemented soon.');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">
            {authLoading ? "Loading authentication..." : "Loading your application status..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/sign-in'}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Application Found</h2>
            <p className="text-slate-600 mb-6">
              You haven't started an instructor application yet. Would you like to begin the application process?
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/become-instructor'}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Application
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(applicationData.status as ApplicationStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl" />
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={applicationData.documents.profilePhoto?.url || "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face"}
                    alt="Profile"
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                  />
                  {applicationData.status === "APPROVED" && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {applicationData.personalInfo.firstName} {applicationData.personalInfo.lastName}
                  </h1>
                  <p className="text-lg text-slate-600 mt-1">Instructor Application</p>
                  <div className="flex items-center mt-3 space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.badgeColor}`}>
                      <statusInfo.icon className="w-4 h-4 mr-2" />
                      {statusInfo.title}
                    </span>
                    <span className="text-sm text-slate-500">{applicationData.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <ProgressRing percentage={applicationData.overallProgress} />
                <button 
                  onClick={() => {
                    if (applicationData.status === 'DRAFT') {
                      window.location.href = '/become-instructor';
                    } else if (applicationData.status === 'APPROVED') {
                      window.location.href = '/instructor/dashboard';
                    } else {
                      // For other statuses, show current status info
                      showToast('info', 'Application Status', statusInfo.description);
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  {statusInfo.actionText}
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Status and Timeline */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Status Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Application Status</h2>
                  <button 
                    onClick={refreshApplicationStatus}
                    disabled={refreshing}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className={`p-6 rounded-2xl ${statusInfo.bgColor} border border-slate-200`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-white shadow-sm ${statusInfo.ringColor} ring-1`}>
                      <statusInfo.icon className={`w-8 h-8 ${statusInfo.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{statusInfo.description}</h3>
                      <p className="text-slate-600 mt-2">{applicationData.reviewerNotes}</p>
                      
                      {applicationData.estimatedReviewTime && (
                        <div className="flex items-center mt-4 p-3 bg-blue-50 rounded-lg">
                          <Timer className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">Estimated Review Time</p>
                            <p className="text-sm text-blue-700">{applicationData.estimatedReviewTime}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Manual Review Information */}
                {applicationData.status === 'REQUIRES_MORE_INFO' && (
                  <div className="mt-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <AlertTriangle className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-orange-900 mb-2">Review Decision</h4>
                          <p className="text-orange-800 mb-4">{applicationData.reviewerNotes}</p>
                          
                          {applicationData.nextSteps && applicationData.nextSteps.length > 0 && (
                            <div>
                              <h5 className="font-medium text-orange-900 mb-3">Required Information:</h5>
                              <div className="space-y-2">
                                {applicationData.nextSteps.map((requirement, index) => (
                                  <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                                    <span className="text-sm text-slate-700">{requirement}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-orange-800 font-medium mb-2">
                                  <strong>Next Steps:</strong> Please address the above requirements and resubmit your application.
                                </p>
                                <p className="text-xs text-orange-700">
                                  Click the button below to update your application with the required information.
                                </p>
                              </div>
                              <button
                                onClick={() => window.location.href = '/become-instructor/verification'}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
                              >
                                Update Application
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Steps for other statuses */}
                {applicationData.status !== 'REQUIRES_MORE_INFO' && applicationData.nextSteps && applicationData.nextSteps.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">What's Happening Now</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {applicationData.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Application Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Application Progress</h2>
                <p className="text-slate-600 mt-1">Track your application through each stage</p>
              </div>
              <div className="p-6">
                <StatusTimeline steps={applicationData.steps} />
              </div>
            </div>

            {/* Application Details Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="border-b border-slate-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: "overview", label: "Overview", icon: Eye },
                    { id: "personal", label: "Personal", icon: User },
                    { id: "professional", label: "Professional", icon: Briefcase },
                    { id: "teaching", label: "Teaching", icon: GraduationCap },
                    { id: "documents", label: "Documents", icon: FileText }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          Personal Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Location</span>
                            <span className="font-medium">{applicationData.personalInfo.city}, {applicationData.personalInfo.state}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Languages</span>
                            <span className="font-medium">{applicationData.personalInfo.languagesSpoken.length} languages</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Timezone</span>
                            <span className="font-medium">{applicationData.personalInfo.timezone.split('/')[1]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-emerald-600" />
                          Professional Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Current Role</span>
                            <span className="font-medium">{applicationData.professionalBackground.currentJobTitle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Experience</span>
                            <span className="font-medium">{applicationData.professionalBackground.yearsOfExperience} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Education</span>
                            <span className="font-medium">{applicationData.professionalBackground.education.length} degrees</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                        Teaching Subjects
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {applicationData.teachingInformation.subjectsToTeach.map((subject, index) => (
                          <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                            <h4 className="font-semibold text-slate-900">{subject.subject}</h4>
                            <p className="text-sm text-slate-600 mt-1">{subject.category}</p>
                            <div className="flex items-center mt-3">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= subject.confidence 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-slate-600 ml-2">{subject.experienceYears}y exp</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Personal Tab */}
                {activeTab === "personal" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-600" />
                            Basic Information
                          </h3>
                          <div className="space-y-3 bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 text-slate-400 mr-3" />
                              <span className="text-slate-900">{applicationData.personalInfo.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 text-slate-400 mr-3" />
                              <span className="text-slate-900">{applicationData.personalInfo.phoneNumber}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-slate-400 mr-3" />
                              <span className="text-slate-900">{new Date(applicationData.personalInfo.dateOfBirth).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Globe className="w-4 h-4 text-slate-400 mr-3" />
                              <span className="text-slate-900">{applicationData.personalInfo.nationality}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                            Location
                          </h3>
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-slate-900">{applicationData.personalInfo.streetAddress}</p>
                            <p className="text-slate-700 mt-1">
                              {applicationData.personalInfo.city}, {applicationData.personalInfo.state} {applicationData.personalInfo.postalCode}
                            </p>
                            <p className="text-slate-600 mt-1">{applicationData.personalInfo.country}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <Languages className="w-5 h-5 mr-2 text-purple-600" />
                            Languages
                          </h3>
                          <div className="space-y-3">
                            {applicationData.personalInfo.languagesSpoken.map((lang, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div>
                                  <span className="font-medium text-slate-900">{lang.language}</span>
                                  <span className="text-sm text-purple-600 ml-2 capitalize">({lang.proficiency})</span>
                                </div>
                                {lang.canTeachIn && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                    Can Teach
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <Heart className="w-5 h-5 mr-2 text-red-500" />
                            Emergency Contact
                          </h3>
                          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                            <p className="font-medium text-slate-900">{applicationData.personalInfo.emergencyContact.name}</p>
                            <p className="text-sm text-slate-600 mt-1">{applicationData.personalInfo.emergencyContact.relationship}</p>
                            <p className="text-sm text-slate-700 mt-2">{applicationData.personalInfo.emergencyContact.phoneNumber}</p>
                            {applicationData.personalInfo.emergencyContact.email && (
                              <p className="text-sm text-slate-700">{applicationData.personalInfo.emergencyContact.email}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Tab */}
                {activeTab === "professional" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                        Work Experience
                      </h3>
                      <div className="space-y-4">
                        {applicationData.professionalBackground.experience.map((exp, index) => (
                          <div key={exp.id} className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-slate-900">{exp.position}</h4>
                                <p className="text-blue-700 font-medium">{exp.company}</p>
                                <p className="text-sm text-slate-600 mt-1">
                                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate} • {exp.location}
                                </p>
                                <p className="text-slate-700 mt-3">{exp.description}</p>
                                
                                {exp.achievements && exp.achievements.length > 0 && (
                                  <div className="mt-4">
                                    <h5 className="font-medium text-slate-900 mb-2">Key Achievements:</h5>
                                    <ul className="space-y-1">
                                      {exp.achievements.map((achievement, i) => (
                                        <li key={i} className="text-sm text-slate-700 flex items-start">
                                          <Sparkles className="w-3 h-3 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                          {achievement}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              {exp.isVerified && (
                                <div className="ml-4">
                                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Verified
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <GraduationCapIcon className="w-5 h-5 mr-2 text-emerald-600" />
                        Education
                      </h3>
                      <div className="space-y-4">
                        {applicationData.professionalBackground.education.map((edu, index) => (
                          <div key={edu.id} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-slate-900">{edu.degree} in {edu.field}</h4>
                                <p className="text-emerald-700 font-medium">{edu.institution}</p>
                                <p className="text-sm text-slate-600 mt-1">{edu.startYear} - {edu.endYear}</p>
                                {edu.gpa && <p className="text-sm text-slate-700 mt-1">GPA: {edu.gpa}</p>}
                                {edu.honors && <p className="text-sm text-slate-700">Honors: {edu.honors}</p>}
                                <p className="text-slate-700 mt-3">{edu.description}</p>
                              </div>
                              {edu.isVerified && (
                                <div className="ml-4">
                                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Verified
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        References
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {applicationData.professionalBackground.references.map((ref, index) => (
                          <div key={ref.id} className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-900">{ref.name}</h4>
                                <p className="text-purple-700 text-sm">{ref.position}</p>
                                <p className="text-slate-600 text-sm">{ref.company}</p>
                                <p className="text-xs text-slate-500 mt-2">{ref.relationship} • Known for {ref.yearsKnown}</p>
                              </div>
                              {ref.isVerified && (
                                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Teaching Tab */}
                {activeTab === "teaching" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-blue-600" />
                        Teaching Philosophy & Motivation
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                            <Heart className="w-4 h-4 text-red-500 mr-2" />
                            Why I Want to Teach
                          </h4>
                          <p className="text-slate-700 leading-relaxed">{applicationData.teachingInformation.teachingMotivation}</p>
                        </div>
                        
                        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                            My Teaching Philosophy
                          </h4>
                          <p className="text-slate-700 leading-relaxed">{applicationData.teachingInformation.teachingPhilosophy}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-emerald-600" />
                        Teaching Experience
                      </h3>
                      <div className="space-y-4">
                        {applicationData.teachingInformation.teachingExperience.map((exp, index) => (
                          <div key={exp.id} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-slate-900">{exp.role}</h4>
                                <p className="text-emerald-700 font-medium">{exp.institution}</p>
                                <p className="text-sm text-slate-600 mt-1">
                                  {exp.subject} • {exp.level} Level • {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                                </p>
                                {exp.studentsCount && (
                                  <p className="text-sm text-slate-600">Students taught: {exp.studentsCount}</p>
                                )}
                                <p className="text-slate-700 mt-3">{exp.description}</p>
                                
                                {exp.achievements && exp.achievements.length > 0 && (
                                  <div className="mt-4">
                                    <h5 className="font-medium text-slate-900 mb-2">Teaching Achievements:</h5>
                                    <ul className="space-y-1">
                                      {exp.achievements.map((achievement, i) => (
                                        <li key={i} className="text-sm text-slate-700 flex items-start">
                                          <Star className="w-3 h-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                                          {achievement}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-orange-600" />
                          Teaching Preferences
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                            <h4 className="font-medium text-slate-900 mb-2">Teaching Style</h4>
                            <p className="text-slate-700">{applicationData.teachingInformation.teachingStyle}</p>
                          </div>
                          
                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                            <h4 className="font-medium text-slate-900 mb-2">Methodology</h4>
                            <p className="text-slate-700">{applicationData.teachingInformation.teachingMethodology}</p>
                          </div>
                          
                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                            <h4 className="font-medium text-slate-900 mb-2">Preferred Class Size</h4>
                            <p className="text-slate-700">{applicationData.teachingInformation.preferredClassSize}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-indigo-600" />
                          Target Audience & Formats
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-slate-900 mb-2">Target Audience</h4>
                            <div className="flex flex-wrap gap-2">
                              {applicationData.teachingInformation.targetAudience.map((audience, index) => (
                                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                                  {audience}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-slate-900 mb-2">Preferred Formats</h4>
                            <div className="flex flex-wrap gap-2">
                              {applicationData.teachingInformation.preferredFormats.map((format, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                  {format}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === "documents" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <Upload className="w-5 h-5 mr-2 text-blue-600" />
                        Required Documents
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DocumentCard 
                          document={applicationData.documents.identityDocument} 
                          title="Identity Document" 
                          type="identity"
                        />
                        <DocumentCard 
                          document={applicationData.documents.profilePhoto} 
                          title="Profile Photo" 
                          type="photo"
                        />
                        <DocumentCard 
                          document={applicationData.documents.resume} 
                          title="Resume/CV" 
                          type="resume"
                        />
                        <DocumentCard 
                          document={applicationData.documents.videoIntroduction} 
                          title="Video Introduction" 
                          type="video"
                        />
                        <DocumentCard 
                          document={applicationData.documents.teachingDemo} 
                          title="Teaching Demo" 
                          type="video"
                        />
                      </div>
                    </div>

                    {applicationData.documents.educationCertificates.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                          <School className="w-5 h-5 mr-2 text-emerald-600" />
                          Education Certificates
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {applicationData.documents.educationCertificates.map((doc, index) => (
                            <DocumentCard 
                              key={doc.id}
                              document={doc} 
                              title={`Education Certificate ${index + 1}`} 
                              type="certificate"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {applicationData.documents.professionalCertifications.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-purple-600" />
                          Professional Certifications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {applicationData.documents.professionalCertifications.map((doc, index) => (
                            <DocumentCard 
                              key={doc.id}
                              document={doc} 
                              title={`Professional Certificate ${index + 1}`} 
                              type="certificate"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions and Additional Info */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleContactSupport}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-3" />
                    <span className="font-medium">Contact Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={handleDownloadApplication}
                  className="w-full flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Download className="w-5 h-5 mr-3" />
                    <span className="font-medium">Download Application</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={handleNotificationSettings}
                  className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 mr-3" />
                    <span className="font-medium">Notification Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={refreshApplicationStatus}
                  disabled={refreshing}
                  className="w-full flex items-center justify-between p-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <RefreshCw className={`w-5 h-5 mr-3 ${refreshing ? 'animate-spin' : ''}`} />
                    <span className="font-medium">Refresh Status</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Application Timeline Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                Timeline
              </h3>
              <div className="space-y-4">
                {/* Application Created */}
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Application Created</p>
                      <p className="text-xs text-slate-500">
                        {new Date(applicationData.createdAt || applicationData.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Application Submitted */}
                {applicationData.submittedAt && (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Application Submitted</p>
                        <p className="text-xs text-slate-500">
                          {new Date(applicationData.submittedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Under Review */}
                {(applicationData.status === 'SUBMITTED' || applicationData.status === 'UNDER_REVIEW') && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Under Review</p>
                        <p className="text-xs text-slate-500">
                          {applicationData.status === 'SUBMITTED' ? 'Initial review in progress' : 'Comprehensive review ongoing'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Manual Review Completed */}
                {applicationData.manualReview?.reviewedAt && (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Manual Review Completed</p>
                        <p className="text-xs text-slate-500">
                          {new Date(applicationData.manualReview.reviewedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Final Decision */}
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  applicationData.status === 'APPROVED' ? 'bg-emerald-50' :
                  applicationData.status === 'REQUIRES_MORE_INFO' ? 'bg-orange-50' :
                  applicationData.status === 'REJECTED' ? 'bg-red-50' : 'bg-slate-50 opacity-50'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      applicationData.status === 'APPROVED' ? 'bg-emerald-500' :
                      applicationData.status === 'REQUIRES_MORE_INFO' ? 'bg-orange-500' :
                      applicationData.status === 'REJECTED' ? 'bg-red-500' : 'bg-slate-300'
                    }`}></div>
                    <div>
                      <p className={`text-sm font-medium ${
                        applicationData.status === 'APPROVED' ? 'text-slate-900' :
                        applicationData.status === 'REQUIRES_MORE_INFO' ? 'text-slate-900' :
                        applicationData.status === 'REJECTED' ? 'text-slate-900' : 'text-slate-600'
                      }`}>
                        {applicationData.status === 'APPROVED' ? 'Approved' :
                         applicationData.status === 'REQUIRES_MORE_INFO' ? 'More Information Required' :
                         applicationData.status === 'REJECTED' ? 'Not Approved' : 'Decision Pending'}
                      </p>
                      <p className={`text-xs ${
                        applicationData.status === 'APPROVED' ? 'text-slate-500' :
                        applicationData.status === 'REQUIRES_MORE_INFO' ? 'text-slate-500' :
                        applicationData.status === 'REJECTED' ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {applicationData.status === 'APPROVED' ? 'Welcome to our instructor community!' :
                         applicationData.status === 'REQUIRES_MORE_INFO' ? 'Please address the feedback provided' :
                         applicationData.status === 'REJECTED' ? 'Review feedback for future applications' : 'Awaiting review completion'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help & Resources */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-indigo-600" />
                Help & Resources
              </h3>
              <div className="space-y-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">What happens next?</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our review team is carefully evaluating your application. We'll notify you via email 
                    as soon as we have an update.
                  </p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">Need help?</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Contact our support team if you have questions about your application status 
                    or the review process.
                  </p>
                </div>
                
                <button 
                  onClick={handleContactSupport}
                  className="w-full bg-indigo-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Get Support
                </button>
              </div>
            </div>

            {/* Application Tips */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Tips for Success
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Keep your profile updated with latest information</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Respond promptly to any requests for additional information</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Check your email regularly for updates</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Prepare for potential interview if requested</p>
                </div>
              </div>
            </div>

            {/* Estimated Review Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Review Progress
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Application Submission</span>
                  <span className={`text-sm font-medium ${
                    applicationData.submittedAt ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {applicationData.submittedAt ? 'Complete' : 'Pending'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    applicationData.submittedAt ? 'bg-emerald-500 w-full' : 'bg-slate-300 w-0'
                  }`}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Document Verification</span>
                  <span className={`text-sm font-medium ${
                    applicationData.status === 'SUBMITTED' || applicationData.status === 'UNDER_REVIEW' || 
                    applicationData.status === 'APPROVED' || applicationData.status === 'REQUIRES_MORE_INFO' || 
                    applicationData.status === 'REJECTED' ? 'text-emerald-600' : 
                    applicationData.status === 'DRAFT' ? 'text-amber-600' : 'text-slate-400'
                  }`}>
                    {applicationData.status === 'SUBMITTED' || applicationData.status === 'UNDER_REVIEW' || 
                     applicationData.status === 'APPROVED' || applicationData.status === 'REQUIRES_MORE_INFO' || 
                     applicationData.status === 'REJECTED' ? 'Complete' : 
                     applicationData.status === 'DRAFT' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    applicationData.status === 'SUBMITTED' || applicationData.status === 'UNDER_REVIEW' || 
                    applicationData.status === 'APPROVED' || applicationData.status === 'REQUIRES_MORE_INFO' || 
                    applicationData.status === 'REJECTED' ? 'bg-emerald-500 w-full' : 
                    applicationData.status === 'DRAFT' ? 'bg-amber-500 w-3/4' : 'bg-slate-300 w-0'
                  }`}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Background Check</span>
                  <span className={`text-sm font-medium ${
                    applicationData.status === 'UNDER_REVIEW' || applicationData.status === 'APPROVED' || 
                    applicationData.status === 'REQUIRES_MORE_INFO' || applicationData.status === 'REJECTED' ? 'text-emerald-600' : 
                    applicationData.status === 'SUBMITTED' ? 'text-blue-600' : 'text-slate-400'
                  }`}>
                    {applicationData.status === 'UNDER_REVIEW' || applicationData.status === 'APPROVED' || 
                     applicationData.status === 'REQUIRES_MORE_INFO' || applicationData.status === 'REJECTED' ? 'Complete' : 
                     applicationData.status === 'SUBMITTED' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    applicationData.status === 'UNDER_REVIEW' || applicationData.status === 'APPROVED' || 
                    applicationData.status === 'REQUIRES_MORE_INFO' || applicationData.status === 'REJECTED' ? 'bg-emerald-500 w-full' : 
                    applicationData.status === 'SUBMITTED' ? 'bg-blue-500 w-2/3' : 'bg-slate-300 w-0'
                  }`}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Manual Review</span>
                  <span className={`text-sm font-medium ${
                    applicationData.status === 'APPROVED' || applicationData.status === 'REQUIRES_MORE_INFO' || 
                    applicationData.status === 'REJECTED' ? 'text-emerald-600' : 
                    applicationData.status === 'UNDER_REVIEW' ? 'text-blue-600' : 'text-slate-400'
                  }`}>
                    {applicationData.status === 'APPROVED' || applicationData.status === 'REQUIRES_MORE_INFO' || 
                     applicationData.status === 'REJECTED' ? 'Complete' : 
                     applicationData.status === 'UNDER_REVIEW' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    applicationData.status === 'APPROVED' || applicationData.status === 'REQUIRES_MORE_INFO' || 
                    applicationData.status === 'REJECTED' ? 'bg-emerald-500 w-full' : 
                    applicationData.status === 'UNDER_REVIEW' ? 'bg-blue-500 w-4/5' : 'bg-slate-300 w-0'
                  }`}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Final Decision</span>
                  <span className={`text-sm font-medium ${
                    applicationData.status === 'APPROVED' ? 'text-emerald-600' : 
                    applicationData.status === 'REQUIRES_MORE_INFO' ? 'text-orange-600' : 
                    applicationData.status === 'REJECTED' ? 'text-red-600' : 'text-slate-400'
                  }`}>
                    {applicationData.status === 'APPROVED' ? 'Approved' : 
                     applicationData.status === 'REQUIRES_MORE_INFO' ? 'More Info Required' : 
                     applicationData.status === 'REJECTED' ? 'Not Approved' : 'Pending'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    applicationData.status === 'APPROVED' ? 'bg-emerald-500 w-full' : 
                    applicationData.status === 'REQUIRES_MORE_INFO' ? 'bg-orange-500 w-full' : 
                    applicationData.status === 'REJECTED' ? 'bg-red-500 w-full' : 'bg-slate-300 w-0'
                  }`}></div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <Timer className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Estimated Completion</p>
                    <p className="text-sm text-blue-700">{applicationData.estimatedReviewTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h2 className="text-2xl font-bold mb-2">Thank you for your application!</h2>
                <p className="text-blue-100 text-lg max-w-2xl">
                  We're excited about the possibility of having you join our instructor community. 
                  Our team is working hard to review your application thoroughly.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{applicationData.overallProgress}%</div>
                  <div className="text-blue-200 text-sm">Progress</div>
                </div>
                <div className="w-px h-12 bg-blue-300/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {(() => {
                      if (!applicationData.submittedAt) {
                        return applicationData.status === 'UNDER_REVIEW' ? 1 : 0;
                      }
                      
                      try {
                        const submittedDate = new Date(applicationData.submittedAt);
                        if (isNaN(submittedDate.getTime())) {
                          return applicationData.status === 'UNDER_REVIEW' ? 1 : 0;
                        }
                        
                        const days = Math.ceil((new Date().getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));
                        return isNaN(days) ? (applicationData.status === 'UNDER_REVIEW' ? 1 : 0) : days;
                      } catch (error) {
                        console.error('Error calculating days in review:', error);
                        return applicationData.status === 'UNDER_REVIEW' ? 1 : 0;
                      }
                    })()}
                  </div>
                  <div className="text-blue-200 text-sm">Days</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
        </div>
      </div>
    </div>
  );
}