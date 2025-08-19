"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { GET_APPLICATION_DETAILS } from '@/graphql/queries/admin';
import { 
  START_APPLICATION_REVIEW,
  UPDATE_APPLICATION_STATUS,
  APPROVE_APPLICATION,
  REJECT_APPLICATION,
  REQUEST_MORE_INFORMATION,
  REVIEW_DOCUMENT
} from '@/graphql/mutations/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Languages,
  Award,
  Star,
  Clock,
  Activity,
  Eye,
  Download,
  ExternalLink,
  MessageSquare,
  Send,
  Save,
  AlertCircle,
  Shield,

  Target,
  Zap,
  FileImage,
  Video,
  File,
  Building2,
  Heart,
  Brain,
  Lightbulb,
  Users,
  BookOpen,
  Sparkles,
  X,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { showToast } from '@/utils/toast';

interface ApplicationData {
  id: string;
  userId: string;
  status: string;
  personalInfo: any;
  professionalBackground: any;
  teachingInformation: any;
  documents: any;
  consents: any;
  submittedAt: string;
  lastSavedAt: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  phoneNumber: string;
  currentJobTitle: string;
  yearsOfExperience: number;
  subjectsToTeach: string[];
  teachingMotivation: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  aiVerification?: {
    overallScore: number;
    verificationResults: any;
    reviewedAt: string;
  };
  manualReview?: {
    decision: string;
    decisionReason: string;
    reviewedAt: string;
    conditionalRequirements: string[];
  };
}

// Enhanced Document Component
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
          <div className="flex items-start space-x-3 flex-1">
            <div 
              className="flex-shrink-0 p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors cursor-pointer"
              onClick={handlePreview}
            >
              {getDocumentIcon()}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-slate-900 truncate">{title}</h4>
              <p className="text-xs text-slate-500 truncate">{document.name || document.fileName}</p>
              <p className="text-xs text-slate-400 mt-1">
                {document.size ? `${(document.size / 1024 / 1024).toFixed(1)} MB` : 'Size unknown'} • 
                {document.uploadDate ? new Date(document.uploadDate).toLocaleDateString() : 'Date unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor()}`}>
              {document.verificationStatus === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
              {document.verificationStatus === 'pending' && <Clock className="w-3 h-3 mr-1" />}
              {document.verificationStatus === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
              {document.verificationStatus || 'pending'}
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

// AI Verification Component
const AIVerificationCard = ({ aiVerification }: { aiVerification?: any }) => {
  if (!aiVerification) return null;

  const scorePercentage = Math.round((aiVerification.overallScore || 0) * 100);

  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-800">
          <Zap className="w-5 h-5 mr-2" />
          AI Verification Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Overall Score</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    scorePercentage >= 80 ? 'bg-emerald-500' :
                    scorePercentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${scorePercentage}%` }}
                />
              </div>
              <span className="text-lg font-bold text-slate-900">{scorePercentage}%</span>
            </div>
          </div>
          
          {aiVerification.verificationResults && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-lg font-bold text-emerald-600">
                  {aiVerification.verificationResults.identityVerified ? '✓' : '✗'}
                </div>
                <div className="text-xs text-slate-600">Identity</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-lg font-bold text-emerald-600">
                  {aiVerification.verificationResults.educationVerified ? '✓' : '✗'}
                </div>
                <div className="text-xs text-slate-600">Education</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-lg font-bold text-emerald-600">
                  {aiVerification.verificationResults.experienceVerified ? '✓' : '✗'}
                </div>
                <div className="text-xs text-slate-600">Experience</div>
              </div>
            </div>
          )}

          {aiVerification.verificationResults?.recommendation && (
            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">AI Recommendation:</span>
                <Badge className={`${
                  aiVerification.verificationResults.recommendation === 'APPROVE' 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : aiVerification.verificationResults.recommendation === 'REJECT'
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
                  {aiVerification.verificationResults.recommendation}
                </Badge>
              </div>
            </div>
          )}
          
          {aiVerification.reviewedAt && (
            <p className="text-xs text-slate-500">
              Processed: {new Date(aiVerification.reviewedAt).toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function EnhancedApplicationReview() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.applicationId as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [moreInfoRequirements, setMoreInfoRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [application, setApplication] = useState<ApplicationData | null>(null);

  // Real GraphQL mutations
  const [startReview, { loading: startReviewLoading }] = useMutation(START_APPLICATION_REVIEW);
  const [updateStatus, { loading: updateStatusLoading }] = useMutation(UPDATE_APPLICATION_STATUS);
  const [approveApplication, { loading: approveLoading }] = useMutation(APPROVE_APPLICATION);
  const [rejectApplication, { loading: rejectLoading }] = useMutation(REJECT_APPLICATION);
  const [requestMoreInfo, { loading: requestInfoLoading }] = useMutation(REQUEST_MORE_INFORMATION);
  const [reviewDocument, { loading: reviewDocumentLoading }] = useMutation(REVIEW_DOCUMENT);

  // Real GraphQL query for application details
  const { data: applicationData, loading: queryLoading, error: dataError, refetch } = useQuery(GET_APPLICATION_DETAILS, {
    variables: { applicationId },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data?.getInstructorVerification?.success && data?.getInstructorVerification?.data) {
        const verificationData = data.getInstructorVerification.data;
        setApplication(transformVerificationData(verificationData));
        
        // Auto-start review if status is SUBMITTED (not REQUIRES_MORE_INFO)
        if (verificationData.status === 'SUBMITTED') {
          handleStartReview();
        }
      }
    },
    onError: (error) => {
      console.error('Error fetching application details:', error);
    }
  });

  // Transform verification data to match our interface
  const transformVerificationData = (verificationData: any): ApplicationData => {
    return {
      id: verificationData.id,
      userId: verificationData.user?.id || verificationData.userId,
      status: verificationData.status,
      personalInfo: verificationData.personalInfo || {},
      professionalBackground: verificationData.professionalBackground || {},
      teachingInformation: verificationData.teachingInformation || {},
      documents: verificationData.documents || {},
      consents: verificationData.consents || {},
      submittedAt: verificationData.submittedAt,
      lastSavedAt: verificationData.lastSavedAt,
      createdAt: verificationData.createdAt,
      updatedAt: verificationData.updatedAt,
      fullName: verificationData.fullName || `${verificationData.personalInfo?.firstName || ''} ${verificationData.personalInfo?.lastName || ''}`.trim(),
      phoneNumber: verificationData.phoneNumber || verificationData.personalInfo?.phoneNumber || '',
      currentJobTitle: verificationData.currentJobTitle || verificationData.professionalBackground?.currentJobTitle || '',
      yearsOfExperience: verificationData.yearsOfExperience || verificationData.professionalBackground?.yearsOfExperience || 0,
      subjectsToTeach: verificationData.subjectsToTeach || verificationData.teachingInformation?.subjectsToTeach?.map((s: any) => s.subject) || [],
      teachingMotivation: verificationData.teachingMotivation || verificationData.teachingInformation?.teachingMotivation || '',
      user: {
        id: verificationData.user?.id || verificationData.userId,
        email: verificationData.user?.email || verificationData.personalInfo?.email || '',
        firstName: verificationData.user?.firstName || verificationData.personalInfo?.firstName || '',
        lastName: verificationData.user?.lastName || verificationData.personalInfo?.lastName || '',
        profileImage: verificationData.user?.profileImage || verificationData.documents?.profilePhoto?.url || ''
      },
      aiVerification: verificationData.aiVerification,
      manualReview: verificationData.manualReview
    };
  };

  // Handle starting the review process
  const handleStartReview = async () => {
    try {
      const result = await startReview({
        variables: {
          input: {
            applicationId,
           
          }
        }
      });
      
      if (result.data?.startApplicationReview?.success) {
        // Update local state only if the application was SUBMITTED
        setApplication(prev => {
          if (prev && prev.status === 'SUBMITTED') {
            return { ...prev, status: "UNDER_REVIEW" };
          }
          return prev;
        });
        showToast('success', 'Review Started', 'Application review has been started.');
      } else {
        showToast('error', 'Review Start Failed', result.data?.startApplicationReview?.message || 'Failed to start review.');
      }
    } catch (error) {
      console.error('Error starting review:', error);
      showToast('error', 'Review Start Failed', 'An error occurred while starting the review.');
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <FileText className="w-4 h-4" />,
          label: 'New Submission'
        };
      case 'UNDER_REVIEW':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Activity className="w-4 h-4" />,
          label: 'Under Review'
        };
      case 'APPROVED':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Approved'
        };
      case 'REJECTED':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          label: 'Rejected'
        };
      case 'REQUIRES_MORE_INFO':
        return {
          color: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <AlertTriangle className="w-4 h-4" />,
          label: 'Needs Info'
        };
      default:
        return {
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: <FileText className="w-4 h-4" />,
          label: 'Unknown'
        };
    }
  };

  const handleApprove = async () => {
    if (!reviewNotes.trim()) {
      showToast('error', 'Review Notes Required', 'Please add review notes before approving.');
      return;
    }

    try {
      const result = await approveApplication({
        variables: {
          input: {
            applicationId,
            notes: reviewNotes
          }
        }
      });
      
      if (result.data?.approveApplication?.success) {
        showToast('success', 'Application Approved', 'The application has been approved successfully!');
        router.push('/admin/dashboard');
      } else {
        showToast('error', 'Approval Failed', result.data?.approveApplication?.message || 'Failed to approve application.');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      showToast('error', 'Approval Failed', 'An error occurred while approving the application.');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      showToast('error', 'Rejection Reason Required', 'Please provide a rejection reason.');
      return;
    }

    try {
      const result = await rejectApplication({
        variables: {
          input: {
            applicationId,
            reason: rejectionReason,
            requiresResubmission: false
          }
        }
      });
      
      if (result.data?.rejectApplication?.success) {
        showToast('success', 'Application Rejected', 'The application has been rejected successfully.');
        router.push('/admin/dashboard');
      } else {
        showToast('error', 'Rejection Failed', result.data?.rejectApplication?.message || 'Failed to reject application.');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      showToast('error', 'Rejection Failed', 'An error occurred while rejecting the application.');
    }
  };

  const handleRequestMoreInfo = async () => {
    if (moreInfoRequirements.length === 0) {
      showToast('error', 'Requirements Needed', 'Please specify what information is required.');
      return;
    }

    try {
      const result = await requestMoreInfo({
        variables: {
          input: {
            applicationId,
            requiredInfo: moreInfoRequirements
          }
        }
      });
      
      if (result.data?.requestMoreInformation?.success) {
        showToast('success', 'Information Requested', 'More information has been requested successfully.');
        router.push('/admin/dashboard');
      } else {
        showToast('error', 'Request Failed', result.data?.requestMoreInformation?.message || 'Failed to request more information.');
      }
    } catch (error) {
      console.error('Error requesting more information:', error);
      showToast('error', 'Request Failed', 'An error occurred while requesting more information.');
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !moreInfoRequirements.includes(newRequirement.trim())) {
      setMoreInfoRequirements([...moreInfoRequirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setMoreInfoRequirements(moreInfoRequirements.filter((_, i) => i !== index));
  };

  if (queryLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Error Loading Application</h2>
          <p className="text-slate-600">
            {dataError.message.includes('fetch') || dataError.message.includes('network') 
              ? 'Unable to connect to the server. Please check your connection and try again.'
              : dataError.message
            }
          </p>
          <div className="flex space-x-2">
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Link href="/admin/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Application Not Found</h2>
          <p className="text-slate-600">The requested application could not be found.</p>
          <Link href="/admin/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(application.status);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full mx-auto px-4  ">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/applications">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Applications
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Review Application</h1>
                <p className="text-slate-600 mt-1">{application.fullName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className={`${statusInfo.color} border px-3 py-1`}>
                {statusInfo.icon}
                <span className="ml-2">{statusInfo.label}</span>
              </Badge>
              
              {application.status === 'UNDER_REVIEW' && (
                <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                  <Activity className="w-4 h-4 mr-2" />
                  Review in Progress
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            

            
            {/* Application Status Alert */}
            {application.status === 'SUBMITTED' && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  This application has been automatically moved to "Under Review" status since you've started reviewing it.
                </AlertDescription>
              </Alert>
            )}

                        {/* REQUIRES_MORE_INFO Status Alert */}
            {application.status === 'REQUIRES_MORE_INFO' && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  This application requires additional information. The status will remain as "Requires More Info" until the applicant provides the requested updates.
                </AlertDescription>
              </Alert>
            )}



            

            {/* AI Verification Results */}
            {application.aiVerification && (
              <AIVerificationCard aiVerification={application.aiVerification} />
            )}

          

            {/* Application Details Tabs */}
            <Card className="shadow-sm">
              <CardHeader className="border-b border-slate-200">
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="personal" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none">
                      Personal
                    </TabsTrigger>
                    <TabsTrigger value="professional" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none">
                      Professional
                    </TabsTrigger>
                    <TabsTrigger value="teaching" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none">
                      Teaching
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none">
                      Documents
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    
                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-blue-100 bg-blue-50/30">
                          <CardHeader>
                            <CardTitle className="text-blue-800 flex items-center">
                              <User className="w-5 h-5 mr-2" />
                              Applicant Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                                {application.personalInfo?.profilePhoto ? (
                                  <img
                                    src={application.documents?.profilePhoto?.url}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-xl object-cover"
                                  />
                                ) : (
                                  <User className="w-8 h-8 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900">{application.fullName}</h3>
                                <p className="text-sm text-slate-600">{application.personalInfo?.email}</p>
                                <p className="text-sm text-slate-600">{application.phoneNumber}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-slate-500">Location:</span>
                                <p className="font-medium">{application.personalInfo?.city}, {application.personalInfo?.state}</p>
                              </div>
                              <div>
                                <span className="text-slate-500">Nationality:</span>
                                <p className="font-medium">{application.personalInfo?.nationality}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-emerald-100 bg-emerald-50/30">
                          <CardHeader>
                            <CardTitle className="text-emerald-800 flex items-center">
                              <Briefcase className="w-5 h-5 mr-2" />
                              Professional Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <span className="text-slate-500 text-sm">Current Position:</span>
                              <p className="font-medium">{application.currentJobTitle}</p>
                              <p className="text-sm text-slate-600">{application.professionalBackground?.currentEmployer}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-slate-500">Experience:</span>
                                <p className="font-medium">{application.yearsOfExperience} years</p>
                              </div>
                              <div>
                                <span className="text-slate-500">Education:</span>
                                <p className="font-medium">{application.professionalBackground?.education?.length || 0} degrees</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-slate-500">Employment Type:</span>
                                <p className="font-medium capitalize">{application.professionalBackground?.employmentType?.replace('_', ' ')}</p>
                              </div>
                              <div>
                                <span className="text-slate-500">Work Location:</span>
                                <p className="font-medium">{application.professionalBackground?.workLocation}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card className="border-purple-100 bg-purple-50/30">
                        <CardHeader>
                          <CardTitle className="text-purple-800 flex items-center">
                            <GraduationCap className="w-5 h-5 mr-2" />
                            Teaching Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium text-slate-900 mb-2">Subjects to Teach</h4>
                            <div className="flex flex-wrap gap-2">
                              {application.teachingInformation?.subjectsToTeach?.map((subject: any, index: number) => (
                                <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                                  {subject.subject || subject}
                                  {subject.confidence && (
                                    <span className="ml-1">
                                      ({subject.confidence}/5 ⭐)
                                    </span>
                                  )}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-slate-900 mb-2">Teaching Motivation</h4>
                            <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border">
                              {application.teachingMotivation}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

              
                    </TabsContent>

                    {/* Personal Tab */}
                    <TabsContent value="personal" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <User className="w-5 h-5 mr-2 text-blue-600" />
                              Basic Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 text-slate-400 mr-3" />
                                <span className="text-slate-900">{application.personalInfo?.email}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 text-slate-400 mr-3" />
                                <span className="text-slate-900">{application.personalInfo?.phoneNumber}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-slate-400 mr-3" />
                                <span className="text-slate-900">
                                  {application.personalInfo?.dateOfBirth && 
                                    new Date(application.personalInfo.dateOfBirth).toLocaleDateString()
                                  }
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Globe className="w-4 h-4 text-slate-400 mr-3" />
                                <span className="text-slate-900">{application.personalInfo?.nationality}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                              Location
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-slate-900">{application.personalInfo?.streetAddress}</p>
                              <p className="text-slate-700">
                                {application.personalInfo?.city}, {application.personalInfo?.state} {application.personalInfo?.postalCode}
                              </p>
                              <p className="text-slate-600">{application.personalInfo?.country}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {application.personalInfo?.languagesSpoken && application.personalInfo.languagesSpoken.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Languages className="w-5 h-5 mr-2 text-purple-600" />
                              Languages
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {application.personalInfo.languagesSpoken.map((lang: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                                  <div>
                                    <span className="font-medium text-slate-900">{lang.language}</span>
                                    <span className="text-sm text-purple-600 ml-2 capitalize">({lang.proficiency})</span>
                                  </div>
                                  {lang.canTeachIn && (
                                    <Badge className="bg-purple-100 text-purple-700">
                                      Can Teach
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {application.personalInfo?.emergencyContact && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                              Emergency Contact
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <span className="text-slate-500 text-sm">Name:</span>
                                <p className="font-medium">{application.personalInfo.emergencyContact.name}</p>
                              </div>
                              <div>
                                <span className="text-slate-500 text-sm">Relationship:</span>
                                <p className="font-medium">{application.personalInfo.emergencyContact.relationship}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <span className="text-slate-500 text-sm">Phone:</span>
                                  <p className="font-medium">{application.personalInfo.emergencyContact.phoneNumber}</p>
                                </div>
                                {application.personalInfo.emergencyContact.email && (
                                  <div>
                                    <span className="text-slate-500 text-sm">Email:</span>
                                    <p className="font-medium">{application.personalInfo.emergencyContact.email}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    {/* Professional Tab */}
                    <TabsContent value="professional" className="mt-0 space-y-6">
                      {application.professionalBackground?.experience && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                              Work Experience
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {application.professionalBackground.experience.map((exp: any, index: number) => (
                                <div key={exp.id || index} className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="text-lg font-semibold text-slate-900">{exp.position}</h4>
                                      <p className="text-blue-700 font-medium">{exp.company}</p>
                                      <p className="text-sm text-slate-600 mt-1">
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        {exp.location && ` • ${exp.location}`}
                                      </p>
                                      {exp.employmentType && (
                                        <p className="text-sm text-slate-600 capitalize">
                                          Employment Type: {exp.employmentType.replace('_', ' ')}
                                        </p>
                                      )}
                                      <p className="text-slate-700 mt-3">{exp.description}</p>
                                      
                                      {exp.achievements && exp.achievements.length > 0 && (
                                        <div className="mt-4">
                                          <h5 className="font-medium text-slate-900 mb-2">Key Achievements:</h5>
                                          <ul className="space-y-1">
                                            {exp.achievements.map((achievement: string, i: number) => (
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
                                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {application.professionalBackground?.education && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <GraduationCap className="w-5 h-5 mr-2 text-emerald-600" />
                              Education
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {application.professionalBackground.education.map((edu: any, index: number) => (
                                <div key={edu.id || index} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="text-lg font-semibold text-slate-900">
                                        {edu.degree} in {edu.field}
                                      </h4>
                                      <p className="text-emerald-700 font-medium">{edu.institution}</p>
                                      <p className="text-sm text-slate-600 mt-1">
                                        {edu.startYear} - {edu.endYear}
                                      </p>
                                      {edu.gpa && <p className="text-sm text-slate-700 mt-1">GPA: {edu.gpa}</p>}
                                      {edu.honors && <p className="text-sm text-slate-700">Honors: {edu.honors}</p>}
                                      <p className="text-slate-700 mt-3">{edu.description}</p>
                                    </div>
                                    {edu.isVerified && (
                                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {application.professionalBackground?.references && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Users className="w-5 h-5 mr-2 text-purple-600" />
                              References
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {application.professionalBackground.references.map((ref: any, index: number) => (
                                <div key={ref.id || index} className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-slate-900">{ref.name}</h4>
                                      <p className="text-purple-700 text-sm">{ref.position}</p>
                                      <p className="text-slate-600 text-sm">{ref.company}</p>
                                      <p className="text-xs text-slate-500 mt-2">{ref.relationship}</p>
                                      {ref.yearsKnown && (
                                        <p className="text-xs text-slate-500">Known for: {ref.yearsKnown} years</p>
                                      )}
                                      {ref.notes && (
                                        <p className="text-xs text-slate-600 mt-2 italic">"{ref.notes}"</p>
                                      )}
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-slate-500">Contact:</span>
                                        <span className="text-xs text-slate-600">{ref.email}</span>
                                        <span className="text-xs text-slate-500">•</span>
                                        <span className="text-xs text-slate-600">{ref.phone}</span>
                                      </div>
                                      {ref.contactPermission && (
                                        <Badge className="mt-2 bg-green-100 text-green-700 text-xs">
                                          Contact Permission Granted
                                        </Badge>
                                      )}
                                    </div>
                                    {ref.isVerified && (
                                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    {/* Teaching Tab */}
                    <TabsContent value="teaching" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-blue-100 bg-blue-50/30">
                          <CardHeader>
                            <CardTitle className="text-blue-800 flex items-center">
                              <Heart className="w-5 h-5 mr-2" />
                              Teaching Motivation
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-700 leading-relaxed">
                              {application.teachingInformation?.teachingMotivation}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-purple-100 bg-purple-50/30">
                          <CardHeader>
                            <CardTitle className="text-purple-800 flex items-center">
                              <Brain className="w-5 h-5 mr-2" />
                              Teaching Philosophy
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-700 leading-relaxed">
                              {application.teachingInformation?.teachingPhilosophy}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Target className="w-5 h-5 mr-2 text-orange-600" />
                              Teaching Preferences
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">Teaching Style</h4>
                              <p className="text-slate-700">{application.teachingInformation?.teachingStyle}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">Teaching Methodology</h4>
                              <p className="text-slate-700">{application.teachingInformation?.teachingMethodology}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">Preferred Class Size</h4>
                              <p className="text-slate-700">{application.teachingInformation?.preferredClassSize}</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Users className="w-5 h-5 mr-2 text-indigo-600" />
                              Target Audience & Formats
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">Target Audience</h4>
                              <div className="flex flex-wrap gap-2">
                                {application.teachingInformation?.targetAudience?.map((audience: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-700">
                                    {audience}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">Preferred Formats</h4>
                              <div className="flex flex-wrap gap-2">
                                {application.teachingInformation?.preferredFormats?.map((format: string, index: number) => (
                                  <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                                    {format}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Weekly Availability */}
                      {application.teachingInformation?.weeklyAvailability && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Calendar className="w-5 h-5 mr-2 text-green-600" />
                              Weekly Availability
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
                              {Object.entries(application.teachingInformation.weeklyAvailability).map(([day, schedule]: [string, any]) => (
                                <div key={day} className={`p-3 rounded-lg border ${
                                  schedule.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                }`}>
                                  <h5 className="font-medium text-slate-900 capitalize mb-2">{day}</h5>
                                  <div className="text-sm">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      schedule.available 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {schedule.available ? 'Available' : 'Not Available'}
                                    </span>
                                  </div>
                                  {schedule.timeSlots && schedule.timeSlots.length > 0 && (
                                    <div className="mt-2 text-xs text-slate-600">
                                      {schedule.timeSlots.map((slot: string, index: number) => (
                                        <div key={index}>{slot}</div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {application.teachingInformation?.teachingExperience && application.teachingInformation.teachingExperience.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Award className="w-5 h-5 mr-2 text-emerald-600" />
                              Teaching Experience
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {application.teachingInformation.teachingExperience.map((exp: any, index: number) => (
                                <div key={exp.id || index} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                                  <h4 className="text-lg font-semibold text-slate-900">{exp.role}</h4>
                                  <p className="text-emerald-700 font-medium">{exp.institution}</p>
                                  <p className="text-sm text-slate-600 mt-1">
                                    {exp.subject} • {exp.level} Level • {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                                  </p>
                                  {exp.studentsCount && (
                                    <p className="text-sm text-slate-600">Students taught: {exp.studentsCount}</p>
                                  )}
                                  <p className="text-slate-700 mt-3">{exp.description}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {application.documents?.identityDocument && (
                          <DocumentCard 
                            document={application.documents.identityDocument} 
                            title="Identity Document" 
                            type="identity"
                          />
                        )}
                        {application.documents?.profilePhoto && (
                          <DocumentCard 
                            document={application.documents.profilePhoto} 
                            title="Profile Photo" 
                            type="photo"
                          />
                        )}
                        {application.documents?.resume && (
                          <DocumentCard 
                            document={application.documents.resume} 
                            title="Resume/CV" 
                            type="resume"
                          />
                        )}
                        {application.documents?.videoIntroduction && (
                          <DocumentCard 
                            document={application.documents.videoIntroduction} 
                            title="Video Introduction" 
                            type="video"
                          />
                        )}
                        {application.documents?.teachingDemo && (
                          <DocumentCard 
                            document={application.documents.teachingDemo} 
                            title="Teaching Demo" 
                            type="demo"
                          />
                        )}
                      </div>

                      {/* Education Certificates */}
                      {application.documents?.educationCertificates && application.documents.educationCertificates.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <GraduationCap className="w-5 h-5 mr-2 text-emerald-600" />
                            Education Certificates
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {application.documents.educationCertificates.map((cert: any, index: number) => (
                              <DocumentCard 
                                key={cert.id || index}
                                document={cert} 
                                title={`Education Certificate ${index + 1}`} 
                                type="education"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Professional Certifications */}
                      {application.documents?.professionalCertifications && application.documents.professionalCertifications.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-purple-600" />
                            Professional Certifications
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {application.documents.professionalCertifications.map((cert: any, index: number) => (
                              <DocumentCard 
                                key={cert.id || index}
                                document={cert} 
                                title={`Professional Certification ${index + 1}`} 
                                type="certification"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Employment Verification */}
                      {application.documents?.employmentVerification && application.documents.employmentVerification.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                            Employment Verification
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {application.documents.employmentVerification.map((doc: any, index: number) => (
                              <DocumentCard 
                                key={doc.id || index}
                                document={doc} 
                                title={`Employment Verification ${index + 1}`} 
                                type="employment"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {(!application.documents || Object.keys(application.documents).length === 0) && (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-slate-900 mb-2">No documents uploaded</h3>
                          <p className="text-slate-600">The applicant hasn't uploaded any documents yet.</p>
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Review Actions */}
          <div className="space-y-6">
            
            {/* Review Actions Card */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Review Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Review Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Review Notes *
                  </label>
                  <Textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add your comprehensive review notes here..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    These notes will be saved with your decision and may be shared with the applicant.
                  </p>
                </div>

                {/* Review Actions Available Notice */}
                {(application.status === 'SUBMITTED' || application.status === 'UNDER_REVIEW') && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-800 font-medium">Review Actions Available</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      This application is ready for review. You can approve, reject, or request more information.
                    </p>
                  </div>
                )}

                {/* Manual Review Requirements Display */}
                {application.manualReview && application.status === 'REQUIRES_MORE_INFO' && application.manualReview.conditionalRequirements && application.manualReview.conditionalRequirements.length > 0 && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center mb-3">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                      <h4 className="text-sm font-medium text-orange-800">Current Requirements</h4>
                    </div>
                    <div className="space-y-2">
                      {application.manualReview.conditionalRequirements.map((requirement: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                          <span className="text-sm text-orange-700">{requirement}</span>
                        </div>
                      ))}
                    </div>
                    {application.manualReview.decisionReason && (
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <p className="text-xs text-orange-600">
                          <strong>Reason:</strong> {application.manualReview.decisionReason}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleApprove} 
                    disabled={
                      approveLoading || 
                      !reviewNotes.trim() || 
                      application.status === 'APPROVED' || 
                      application.status === 'REJECTED' ||
                      application.status === 'REQUIRES_MORE_INFO' ||
                      (application.status !== 'SUBMITTED' && application.status !== 'UNDER_REVIEW')
                    }
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {approveLoading ? 'Processing...' : 'Approve Application'}
                  </Button>

                  <Button 
                    onClick={handleReject} 
                    disabled={
                      rejectLoading || 
                      !rejectionReason.trim() || 
                      application.status === 'APPROVED' || 
                      application.status === 'REJECTED' ||
                      application.status === 'REQUIRES_MORE_INFO' ||
                      (application.status !== 'SUBMITTED' && application.status !== 'UNDER_REVIEW')
                    }
                    variant="destructive"
                    className="w-full"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {rejectLoading ? 'Processing...' : 'Reject Application'}
                  </Button>

                  <Button 
                    onClick={handleRequestMoreInfo} 
                    disabled={
                      requestInfoLoading || 
                      moreInfoRequirements.length === 0 || 
                      application.status === 'APPROVED' || 
                      application.status === 'REJECTED' ||
                      application.status === 'REQUIRES_MORE_INFO' ||
                      (application.status !== 'SUBMITTED' && application.status !== 'UNDER_REVIEW')
                    }
                    variant="outline"
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {requestInfoLoading ? 'Processing...' : 'Request More Info'}
                  </Button>
                </div>

                {/* Manual Review Summary */}
                {application.manualReview && application.status !== 'REQUIRES_MORE_INFO'  && (
                  <Card className="border-blue-200 bg-blue-50/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-blue-800 flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Previous Review Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Previous Decision:</span>
                        <Badge className={`${
                          application.manualReview.decision === 'APPROVE' 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            : application.manualReview.decision === 'REJECT'
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : 'bg-orange-100 text-orange-700 border-orange-200'
                        }`}>
                          {application.manualReview.decision}
                        </Badge>
                      </div>
                      
                      {application.manualReview.decisionReason && (
                        <div className="p-3 bg-white rounded-lg border">
                          <span className="text-sm font-medium text-slate-700">Review Notes:</span>
                          <p className="text-sm text-slate-700 mt-2">{application.manualReview.decisionReason}</p>
                        </div>
                      )}
                      
                      {application.manualReview.conditionalRequirements && application.manualReview.conditionalRequirements.length > 0 && (
                        <div className="p-3 bg-white rounded-lg border">
                          <span className="text-sm font-medium text-slate-700">Previously Requested Information:</span>
                          <div className="mt-2 space-y-2">
                            {application.manualReview.conditionalRequirements.map((requirement: string, index: number) => (
                              <div key={index} className="flex items-start">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                                <span className="text-sm text-slate-700">{requirement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {application.manualReview.reviewedAt && (
                        <p className="text-xs text-slate-500">
                          Reviewed: {new Date(application.manualReview.reviewedAt).toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}


              </CardContent>
            </Card>

            {/* Rejection Reason */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Rejection Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a clear, constructive reason for rejection..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  This reason will be sent to the applicant to help them understand the decision.
                </p>
              </CardContent>
            </Card>

            {/* More Information Request */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Request Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="What information is needed?"
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  />
                  <Button onClick={addRequirement} size="sm" variant="outline">
                    Add
                  </Button>
                </div>
                
                {moreInfoRequirements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-700">Required Information:</h4>
                    {moreInfoRequirements.map((req, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-200">
                        <span className="text-sm text-slate-700">{req}</span>
                        <Button
                          onClick={() => removeRequirement(index)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-orange-600 hover:text-orange-800"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Review Summary */}
            {application.manualReview && (
              <Card className="border-orange-200 bg-orange-50/30">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Review Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600">Decision:</span>
                      <Badge className={`${
                        application.manualReview.decision === 'APPROVE' 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : application.manualReview.decision === 'REJECT'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-orange-100 text-orange-700 border-orange-200'
                      }`}>
                        {application.manualReview.decision}
                      </Badge>
                    </div>
                    {application.manualReview.reviewedAt && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Reviewed:</span>
                        <span className="font-medium">{new Date(application.manualReview.reviewedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {application.manualReview.conditionalRequirements && application.manualReview.conditionalRequirements.length > 0 && (
                      <div className="mt-3">
                        <span className="text-slate-600 text-xs">Requirements:</span>
                        <p className="text-xs text-slate-700 mt-1 mb-2">
                          {application.manualReview.conditionalRequirements.length} items requested
                        </p>
                        <div className="space-y-1">
                          {application.manualReview.conditionalRequirements.slice(0, 2).map((requirement: string, index: number) => (
                            <div key={index} className="flex items-start">
                              <div className="w-1 h-1 bg-orange-500 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                              <span className="text-xs text-slate-700 truncate">{requirement}</span>
                            </div>
                          ))}
                          {application.manualReview.conditionalRequirements.length > 2 && (
                            <div className="text-xs text-slate-500">
                              +{application.manualReview.conditionalRequirements.length - 2} more requirements
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Application Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Application Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Submitted:</span>
                    <span className="font-medium">{new Date(application.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Days pending:</span>
                    <span className="font-medium">
                      {Math.ceil((new Date().getTime() - new Date(application.submittedAt).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Last updated:</span>
                    <span className="font-medium">{new Date(application.lastSavedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}