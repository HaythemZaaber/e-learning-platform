"use client";

import React, { useState } from 'react';
import { useInstructorApplicationStore } from '@/stores/verification.store';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { showToast } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Edit, 
  Send,
  User,
  GraduationCap,
  Briefcase,
  BookOpen,
  FileText,
  Shield,
  Clock,
  Star
} from 'lucide-react';
import { Label } from '@/components/ui/label';

export function ReviewStep() {
  const store = useInstructorApplicationStore();
  const { user, getToken } = useAuth();
  const { user: authUser } = useAuthStore();
  const [agreedToTerms, setAgreedToTerms] = useState(store.consents.termOfService || false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(store.consents.privacyPolicy || false);
  const [agreedToBackgroundCheck, setAgreedToBackgroundCheck] = useState(store.consents.backgroundCheck || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Auto-validate when store consents change
  React.useEffect(() => {
    validateStep();
  }, [store.consents.termOfService, store.consents.privacyPolicy, store.consents.backgroundCheck]);

  // Auto-validate when component mounts (for review step)
  React.useEffect(() => {
    validateStep();
  }, []);

  // Update store consents when local state changes
  React.useEffect(() => {
    store.updateConsent('termOfService', agreedToTerms);
    store.updateConsent('privacyPolicy', agreedToPrivacy);
    store.updateConsent('backgroundCheck', agreedToBackgroundCheck);
    // Set other required consents to true when these are accepted
    if (agreedToTerms && agreedToPrivacy && agreedToBackgroundCheck) {
      store.updateConsent('dataProcessing', true);
      store.updateConsent('contentGuidelines', true);
      store.updateConsent('codeOfConduct', true);
    }
  }, [agreedToTerms, agreedToPrivacy, agreedToBackgroundCheck, store]);

  // Sync local state with store changes
  React.useEffect(() => {
    setAgreedToTerms(store.consents.termOfService || false);
    setAgreedToPrivacy(store.consents.privacyPolicy || false);
    setAgreedToBackgroundCheck(store.consents.backgroundCheck || false);
  }, [store.consents.termOfService, store.consents.privacyPolicy, store.consents.backgroundCheck]);

  const validateStep = () => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Only check the three main agreements
    if (!store.consents.termOfService) {
      errors.push('You must agree to the terms and conditions');
    }
    
    if (!store.consents.privacyPolicy) {
      errors.push('You must agree to the privacy policy');
    }
    
    if (!store.consents.backgroundCheck) {
      errors.push('You must agree to the background check');
    }

    // Step is complete if all three main consents are accepted
    const isValid = store.consents.termOfService && store.consents.privacyPolicy && store.consents.backgroundCheck;
    
    setValidationErrors(errors);
    setValidationWarnings(warnings);
    
    store.updateStepCompletion('review', isValid, errors, warnings);
    return isValid;
  };

  const handleSubmitApplication = async () => {
    if (!validateStep()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get authentication credentials
      const userId = user?.id || authUser?.id;
      const token = await getToken();
      
      if (!userId || !token) {
        throw new Error('Authentication required. Please sign in to submit your application.');
      }

      // Use the store's submitApplication method
      const success = await store.submitApplication(userId, token);
      
      if (success) {
        // Application submitted successfully
        console.log('Application submitted successfully');
        // Show success message
        setValidationErrors([]);
        setValidationWarnings([]);
        showToast('success', 'Application Submitted', 'Your instructor application has been submitted for review.');
      } else {
        throw new Error('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Application submission failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      setValidationErrors([errorMessage]);
      showToast('error', 'Submission Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = () => {
    return store.consents.termOfService && 
           store.consents.privacyPolicy && 
           store.consents.backgroundCheck && 
           !isSubmitting;
  };

  const getStepStatus = (stepIndex: number) => {
    const step = store.steps[stepIndex];
    if (!step) return 'pending';
    return step.isValid ? 'completed' : 'incomplete';
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'incomplete':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
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

  const stepNames = [
    'Personal Information',
    'Professional Background',
    'Teaching Information',
    'Documents & Verification'
  ];

  const stepIcons = [User, GraduationCap, BookOpen, FileText];

  return (
    <div className="space-y-6">
      {/* Application Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Application Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {stepNames.map((name, index) => {
              const Icon = stepIcons[index];
              const status = getStepStatus(index);
              
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStepIcon(status)}
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStepBadge(status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => store.setCurrentStep(index)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-medium">Overall Progress</span>
            <Badge variant="default">
              {Math.round(store.getOverallProgress())}% Complete
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
              <p className="font-medium">
                {store.personalInfo.firstName || ''} {store.personalInfo.lastName || ''}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="font-medium">{store.personalInfo.email || ''}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
              <p className="font-medium">{store.personalInfo.phoneNumber || ''}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
              <p className="font-medium">{store.personalInfo.dateOfBirth || ''}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Country</Label>
              <p className="font-medium">{store.personalInfo.country || ''}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">City</Label>
              <p className="font-medium">{store.personalInfo.city || ''}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Background Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Professional Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Current Job Title</Label>
              <p className="font-medium">{store.professionalBackground.currentJobTitle || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Current Employer</Label>
              <p className="font-medium">{store.professionalBackground.currentEmployer || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Years of Experience</Label>
              <p className="font-medium">{store.professionalBackground.yearsOfExperience} years</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Employment Type</Label>
              <p className="font-medium">{store.professionalBackground.employmentType || 'Not specified'}</p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Education</Label>
            <div className="space-y-2 mt-2">
              {store.professionalBackground.education?.map((edu, index) => (
                <div key={edu.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.degree} in {edu.field} ({edu.startYear} - {edu.endYear || 'Present'})
                      </p>
                    </div>
                    {edu.isVerified && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No education entries added</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Work Experience</Label>
            <div className="space-y-2 mt-2">
              {store.professionalBackground.experience?.map((exp) => (
                <div key={exp.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{exp.position} at {exp.company}</p>
                      <p className="text-sm text-muted-foreground">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    {exp.isVerified && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No work experience entries added</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Professional References</Label>
            <div className="space-y-2 mt-2">
              {store.professionalBackground.references?.map((ref) => (
                <div key={ref.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{ref.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {ref.position} at {ref.company} • {ref.relationship}
                      </p>
                    </div>
                    {ref.isVerified && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No professional references added</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Information Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Teaching Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Subjects to Teach</Label>
            <div className="space-y-2 mt-2">
              {store.teachingInformation.subjectsToTeach?.map((subject, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{subject.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {subject.level} level • {subject.experienceYears} years experience
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <Star
                          key={level}
                          className={`h-4 w-4 ${
                            subject.confidence >= level 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No subjects to teach added</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Teaching Motivation</Label>
            <p className="mt-2 text-sm">{store.teachingInformation.teachingMotivation || ''}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Teaching Philosophy</Label>
            <p className="mt-2 text-sm">{store.teachingInformation.teachingPhilosophy || ''}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Target Audience</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {store.teachingInformation.targetAudience?.map((audience) => (
                <Badge key={audience} variant="secondary" className="text-xs">
                  {audience}
                </Badge>
              )) || (
                <p className="text-sm text-muted-foreground">No target audience specified</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents & Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Identity Document</span>
              {store.documents.identityDocument ? (
                <Badge variant="default" className="text-xs">Uploaded</Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">Missing</Badge>
              )}
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Profile Photo</span>
              {store.documents.profilePhoto ? (
                <Badge variant="default" className="text-xs">Uploaded</Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">Missing</Badge>
              )}
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Education Certificates</span>
              <Badge variant="secondary" className="text-xs">
                {store.documents.educationCertificates?.length} uploaded
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Professional Certifications</span>
              <Badge variant="secondary" className="text-xs">
                {store.documents.professionalCertifications?.length} uploaded
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Agreements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Terms & Agreements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="terms" className="text-sm font-medium">
                  Terms and Conditions
                </Label>
                <p className="text-xs text-muted-foreground">
                  I agree to the platform's terms and conditions, including instructor responsibilities, 
                  payment terms, and platform policies.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={agreedToPrivacy}
                onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="privacy" className="text-sm font-medium">
                  Privacy Policy
                </Label>
                <p className="text-xs text-muted-foreground">
                  I agree to the privacy policy and consent to the collection, use, and processing of my 
                  personal data for verification and platform purposes.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="background"
                checked={agreedToBackgroundCheck}
                onCheckedChange={(checked) => setAgreedToBackgroundCheck(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="background" className="text-sm font-medium">
                  Background Check Authorization
                </Label>
                <p className="text-xs text-muted-foreground">
                  I authorize the platform to conduct background checks and verify my credentials, 
                  education, and professional experience as part of the application process.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium">Application Review</h4>
                <p className="text-sm text-muted-foreground">
                  Our team will review your application within 3-5 business days.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium">Document Verification</h4>
                <p className="text-sm text-muted-foreground">
                  We'll verify your documents and credentials through our secure verification process.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium">Interview (if required)</h4>
                <p className="text-sm text-muted-foreground">
                  Some applicants may be invited for a brief interview to discuss their teaching approach.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">4</span>
              </div>
              <div>
                <h4 className="font-medium">Final Decision</h4>
                <p className="text-sm text-muted-foreground">
                  You'll receive a notification about your application status within 7-10 business days.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    

      {validationWarnings.length > 0 && (
        <Alert>
          <AlertDescription>
            <div className="font-medium mb-2">Recommendations:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationWarnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Application */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div>
          <h3 className="font-semibold text-lg">Ready to Submit?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Review your application carefully before submitting. You can edit any section before final submission.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSubmitApplication}
            disabled={!canSubmit() || isSubmitting}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

