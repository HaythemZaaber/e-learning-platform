"use client";

import React, { useState, useEffect } from 'react';
import { useInstructorApplicationStore } from '@/stores/verification.store';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { showToast } from '@/utils/toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  User,
  GraduationCap,
  BookOpen,
  FileText,
  Eye,
  Save,
  Send,
  Loader2,
  Info,
  AlertTriangle,
  CheckSquare,
  XCircle
} from 'lucide-react';

// Import step components
import { PersonalInformationStep } from './steps/PersonalInformationStep';
import { ProfessionalBackgroundStep } from './steps/ProfessionalBackgroundStep';
import { TeachingInformationStep } from './steps/TeachingInformationStep';
import { DocumentsStep } from './steps/DocumentsStep';
import { ReviewStep } from './steps/ReviewStep';

const steps = [
  {
    id: 'personal-information',
    title: 'Personal Information',
    description: 'Basic personal details and contact information',
    icon: User,
    component: PersonalInformationStep
  },
  {
    id: 'professional-background',
    title: 'Professional Background',
    description: 'Education, work experience, and references',
    icon: GraduationCap,
    component: ProfessionalBackgroundStep
  },
  {
    id: 'teaching-information',
    title: 'Teaching Information',
    description: 'Subjects, philosophy, and teaching preferences',
    icon: BookOpen,
    component: TeachingInformationStep
  },
  {
    id: 'documents',
    title: 'Documents & Verification',
    description: 'Upload required documents and credentials',
    icon: FileText,
    component: DocumentsStep
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review your application and submit',
    icon: Eye,
    component: ReviewStep
  }
];

export function MainVerification() {
  const store = useInstructorApplicationStore();
  const { user, getToken, isAuthenticated, isLoading: authLoading } = useAuth();
  const { user: authUser } = useAuthStore();

  
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadAttempted, setLoadAttempted] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);


  // Monitor storage size and handle quota errors
  useEffect(() => {
    const checkStorage = () => {
      try {
        const storageSize = store.getStorageSize();
        const sizeInKB = parseFloat(storageSize.replace(' KB', ''));
        
        if (sizeInKB > 4000) { // Warning at 4MB
          setStorageError(`Storage usage is high (${storageSize}). Consider cleaning up.`);
        } else if (sizeInKB > 5000) { // Critical at 5MB
          setStorageError(`Storage usage is critical (${storageSize}). Cleaning up automatically.`);
          store.handleStorageError();
        } else {
          setStorageError(null);
        }
      } catch (error) {
        console.error('Storage check failed:', error);
        setStorageError('Storage monitoring failed');
      }
    };

    // Check storage every 30 seconds
    const interval = setInterval(checkStorage, 30000);
    checkStorage(); // Initial check

    return () => clearInterval(interval);
  }, []); // Remove store dependency

  console.log("personalInfo", store.personalInfo);
  console.log("professionalBackground", store.professionalBackground);
  console.log("teachingInformation", store.teachingInformation);
  console.log("documents", store.documents);
  console.log("verificationStatus", store.verificationStatus);
  console.log("consents", store.consents);
  console.log("steps", store.steps);
  // Get the authenticated user ID
  const getCurrentUserId = (): string | null => {
    return user?.id || authUser?.id || null;
  };

  // Get authentication token
  const getAuthToken = async (): Promise<string | null> => {
    try {
      return await getToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };



  // Load application data on component mount
  useEffect(() => {
    if (loadAttempted || authLoading) return;
    
    const loadApplication = async () => {
      setIsLoading(true);
      setLoadAttempted(true);
      
      try {
        const userId = user?.id || authUser?.id;
        const token = await getToken();
        
        if (!userId || !token) {
          setAuthError('Please sign in to access the instructor application.');
          return;
        }

        await store.loadApplication(userId, token);
        
        showToast('success', "Application Loaded", "Your application has been loaded successfully.");

      } catch (error) {
        console.error('Error loading application:', error);
        setAuthError(error instanceof Error ? error.message : 'Failed to load application');
        
        showToast('error', "Load Failed", error instanceof Error ? error.message : 'Failed to load application');
      } finally {
        setIsLoading(false);
      }
    };

    // Only load if we have user data
    if (user?.id || authUser?.id) {
      loadApplication();
    } else {
      setAuthError('Please sign in to access the instructor application.');
      setLoadAttempted(true);
    }
  }, [user?.id, authUser?.id, authLoading, loadAttempted]);

  const handleNext = () => {
    if (store.currentStep < steps.length - 1) {
      store.setCurrentStep(store.currentStep + 1);
      showToast('info', "Moving to Next Step", "You can always come back to complete this step later.");
    }
  };

  const handlePrevious = () => {
    if (store.currentStep > 0) {
      store.setCurrentStep(store.currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow free navigation between all steps
    store.setCurrentStep(stepIndex);
  };

  const handleSaveDraft = async () => {
    if (!isAuthenticated || !getCurrentUserId()) {
      setAuthError('Please sign in to save your application.');
      return;
    }

    setSaveStatus('saving');
    try {
      const userId = getCurrentUserId();
      const token = await getAuthToken();
      
      if (!userId || !token) {
        throw new Error('Authentication token not available');
      }

      await store.saveDraft(userId, token);
      setSaveStatus('saved');
      
      showToast('success', "Draft Saved", "Your application draft has been saved successfully.");
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaveStatus('error');
      setAuthError(error instanceof Error ? error.message : 'Failed to save draft');
      
      showToast('error', "Save Failed", error instanceof Error ? error.message : 'Failed to save draft');
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleSubmitApplication = async () => {
    if (!isAuthenticated || !getCurrentUserId()) {
      setAuthError('Please sign in to submit your application.');
      return;
    }

    setIsLoading(true);
    try {
      const userId = getCurrentUserId();
      const token = await getAuthToken();
      
      if (!userId || !token) {
        throw new Error('Authentication token not available');
      }

      // Final validation before submission
      const allStepsValid = store.validateAllSteps();
      if (!allStepsValid) {
        throw new Error('Please complete all required steps before submitting');
      }

      const success = await store.submitApplication(userId, token);
      
      if (success) {
        showToast('success', "Application Submitted", "Your application has been submitted successfully and is under review.");
        
        // Show success state
        setAuthError(null);
      } else {
        throw new Error('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Application submission failed:', error);
      setAuthError(error instanceof Error ? error.message : 'Submission failed');
      
      showToast('error', "Submission Failed", error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    const step = store.steps[stepIndex];
    if (!step) return 'pending';
    return step.isValid ? 'completed' : 'incomplete';
  };

  const getStepIcon = (status: string, Icon: React.ComponentType<{ className?: string }>) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'incomplete':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <Icon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="text-xs">Complete</Badge>;
      case 'incomplete':
        return <Badge variant="destructive" className="text-xs">Incomplete</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
    }
  };

  const CurrentStepComponent = steps[store.currentStep].component;

  // Show authentication error if user is not authenticated
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-red-600 flex items-center justify-center gap-2">
                <XCircle className="h-5 w-5" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
              <div className="mt-4 text-center">
                <Button onClick={() => window.location.href = '/sign-in'}>
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading state for auth only if we don't have user data
  if (authLoading && !getCurrentUserId()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading && !store.verificationId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your application...</p>
        </div>
      </div>
    );
  }

  // Show application under review state
  if (store.verificationId && !store.personalInfo.firstName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-blue-600 flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                Application Under Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your instructor application is currently under review by our team. 
                  You cannot modify the application during this time. 
                  We will notify you once the review is complete.
                </AlertDescription>
              </Alert>
              <div className="mt-4 text-center">
                <Button onClick={() => window.location.href = '/dashboard'}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Become an Instructor</h1>
              <p className="text-gray-600 mt-2">
                Complete your application to start teaching on our platform
              </p>
            </div>
          </div>
          
          {/* Storage Warning */}
          {storageError && (
            <Alert className="mt-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>{storageError}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => store.cleanupStorage()}
                    >
                      Clean Up
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStorageError(null)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              disabled={saveStatus === 'saving'}
              className='bg-blue-500 hover:bg-blue-600 text-white hover:text-white'
            >
              {saveStatus === 'saving' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'saved' && 'Saved!'}
              {saveStatus === 'error' && 'Error'}
              {saveStatus === 'idle' && 'Save Draft'}
            </Button>
          </div>
        </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Application Progress
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(store.getOverallProgress())}% Complete
              </span>
            </div>
            <Progress value={store.getOverallProgress()} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Step Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {steps.map((step, index) => {
                    const status = getStepStatus(index);
                    const Icon = step.icon;
                    const isActive = index === store.currentStep;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => handleStepClick(index)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          isActive 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {getStepIcon(status, Icon)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`font-medium text-sm ${
                                isActive ? 'text-blue-700' : 'text-gray-700'
                              }`}>
                                {step.title}
                              </p>
                              {getStepBadge(status)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Application Status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Started</span>
                    <span className="text-sm font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated Time</span>
                    <span className="text-sm font-medium">20-30 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Validation Summary */}
            {Object.keys(store.ui.errors).length > 0 && (
              <Card className="mt-6 border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Issues Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(store.ui.errors).map(([field, errors]) => (
                      <div key={field} className="text-sm">
                        <span className="font-medium text-red-600">{field}:</span>
                        <ul className="list-disc list-inside mt-1 text-red-500">
                          {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Step Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {React.createElement(steps[store.currentStep].icon, {
                      className: "h-6 w-6 text-blue-600"
                    })}
                    <div>
                      <CardTitle className="text-xl">
                        {steps[store.currentStep].title}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        {steps[store.currentStep].description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Step {store.currentStep + 1} of {steps.length}</p>
                    <p className="text-sm font-medium text-gray-700">
                      {Math.round(store.getOverallProgress())}% Complete
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Step Content */}
            <Card>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                    <span className="text-gray-600">Loading...</span>
                  </div>
                ) : (
                  <CurrentStepComponent />
                )}
              </CardContent>
            </Card>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between mt-6">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={store.currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  disabled={saveStatus === 'saving'}
                >
                  {saveStatus === 'saving' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Draft
                </Button>

                {store.currentStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitApplication}
                    disabled={!store.steps[store.currentStep]?.isValid || isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </div>

            {/* Error Display */}
            {Object.keys(store.ui.errors).length > 0 && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Please fix the following errors:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(store.ui.errors).map(([field, errors]) =>
                      errors.map((error: string, index: number) => (
                        <li key={`${field}-${index}`}>{error}</li>
                      ))
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Success Messages */}
            {store.ui.successMessages.length > 0 && (
              <Alert className="mt-6">
                <CheckSquare className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Success:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {store.ui.successMessages.map((message: string, index: number) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Warnings */}
            {Object.keys(store.ui.warnings).length > 0 && (
              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Recommendations:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(store.ui.warnings).map(([field, warnings]) =>
                      warnings.map((warning: string, index: number) => (
                        <li key={`${field}-${index}`}>{warning}</li>
                      ))
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
  );
}