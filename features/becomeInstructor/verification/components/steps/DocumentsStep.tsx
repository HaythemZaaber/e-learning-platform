"use client";

import React, { useState, useEffect } from 'react';
import { useInstructorApplicationStore } from '@/stores/verification.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { showToast } from '@/utils/toast';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Eye,
  Download,
  Camera,
  Video,
  Image,
  GraduationCap,
  Briefcase,
  User,
  Shield,
  Loader2,
  Info,
  RefreshCw
} from 'lucide-react';
import { DocumentUploader } from '../DocumentUploader';
import { BiometricCapture } from '../BiometricCapture';
import { DocumentPreview } from '../DocumentPreview';
import { useAuth } from '@clerk/nextjs';

interface UploadProgress {
  [key: string]: {
    progress: number;
    status: 'uploading' | 'completed' | 'error' | 'pending';
    error?: string;
  };
}



export function DocumentsStep() {
  const store = useInstructorApplicationStore();
  const { getToken } = useAuth();

  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);




  const updateUploadProgress = (documentType: string, progress: number, status: 'uploading' | 'completed' | 'error' | 'pending', error?: string) => {
    setUploadProgress(prev => ({
      ...prev,
      [documentType]: { progress, status, error }
    }));
  };

  // Dynamic type detection function
  const detectDocumentType = (file: File): string => {
    const mimeType = file.type.toLowerCase();
    
    // Image types
    if (mimeType.startsWith('image/')) {
      return 'image';
    }
    
    // Video types
    if (mimeType.startsWith('video/')) {
      return 'video';
    }
    
    // Document types
    if (mimeType === 'application/pdf' || 
        mimeType.includes('document') || 
        mimeType.includes('text') ||
        mimeType.includes('word') ||
        mimeType.includes('excel') ||
        mimeType.includes('powerpoint')) {
      return 'document';
    }
    
    // Default to document for unknown types
    return 'document';
  };

  const handleDocumentUpload = async (type: keyof typeof store.documents, documentType: string, file: File, thumbnailUrl?: string) => {
    // Detect the actual file type if documentType is generic
    const detectedType = documentType === 'mixed' ? detectDocumentType(file) : documentType;
    const uploadKey = `${type}-${detectedType}`;
    
    try {
      // Initialize upload progress
      updateUploadProgress(uploadKey, 0, 'uploading');
      
      // Get the token from the clerk
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Show upload started notification
      showToast('info', "Upload Started", `Uploading ${file.name} as ${detectedType}...`);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[uploadKey];
          if (current && current.progress < 95) {
            return {
              ...prev,
              [uploadKey]: { ...current, progress: current.progress + Math.random() * 5 }
            };
          }
          return prev;
        });
      }, 100);

      // Upload the document with detected type
      await store.uploadDocument(type, detectedType, file, token);
      
      // If we have a thumbnail URL, update the document with it
      if (thumbnailUrl && file.name) {
        console.log('Updating document thumbnail:', { type, fileName: file.name, thumbnailUrl });
        // Find the uploaded document and update its thumbnail
        const documents = store.documents[type];
        if (Array.isArray(documents)) {
          const document = documents.find(doc => doc.name === file.name);
          if (document) {
            store.updateDocumentThumbnail(type, document.id, thumbnailUrl);
            console.log('Updated thumbnail for array document:', document.id);
          }
        } else if (documents && documents.name === file.name) {
          store.updateDocumentThumbnail(type, documents.id, thumbnailUrl);
          console.log('Updated thumbnail for single document:', documents.id);
        }
      }
      
      // Clear progress interval and mark as completed
      clearInterval(progressInterval);
      updateUploadProgress(uploadKey, 100, 'completed');
      
      // Show success notification
      showToast('success', "Upload Successful", `${file.name} has been uploaded and is being processed.`);



    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      updateUploadProgress(uploadKey, 0, 'error', errorMessage);
      
      showToast('error', "Upload Failed", errorMessage);
    }
  };

  const handlePhotoCapture = (photo: File) => {
    handleDocumentUpload('profilePhoto', 'image', photo);
  };

  const retryUpload = async (type: keyof typeof store.documents, documentType: string, file: File) => {
    const uploadKey = `${type}-${documentType}`;
    updateUploadProgress(uploadKey, 0, 'pending');
    await handleDocumentUpload(type, documentType, file);
  };

  const removeDocument = (type: keyof typeof store.documents, documentId?: string) => {
    store.removeDocument(type, documentId);
    showToast('success', "Document Removed", "Document has been removed from your application.");
  };

  const validateStep = () => {
    setIsValidating(true);
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Required documents validation
    if (!store.documents.identityDocument) {
      errors.push('Government-issued ID is required for identity verification');
    }
    
    if (!store.documents.profilePhoto) {
      errors.push('Professional profile photo is required');
    }
    
    if (!store.documents.educationCertificates || store.documents.educationCertificates.length === 0) {
      errors.push('At least one education certificate is required');
    }

    // Optional but recommended documents
    if (!store.documents.professionalCertifications || store.documents.professionalCertifications.length === 0) {
      warnings.push('Professional certifications are recommended to strengthen your application');
    }

    if (!store.documents.employmentVerification || store.documents.employmentVerification.length === 0) {
      warnings.push('Employment verification documents are recommended');
    }

    // Document quality checks
    if (store.documents.identityDocument && store.documents.identityDocument.verificationStatus === 'failed') {
      errors.push('Identity document verification failed. Please upload a clearer copy.');
    }

    if (store.documents.profilePhoto && store.documents.profilePhoto.verificationStatus === 'failed') {
      errors.push('Profile photo verification failed. Please upload a better quality photo.');
    }

    setValidationErrors(errors);
    setValidationWarnings(warnings);
    
    const isValid = errors.length === 0;
    store.updateStepCompletion('documents', isValid, errors, warnings);
    
    setIsValidating(false);
    return isValid;
  };

  const getDocumentStatus = (document: any) => {
    if (!document) return 'pending';
    return document.verificationStatus || 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
      default:
        return <Upload className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="text-xs">Verified</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
    }
  };



  const getUploadProgress = (uploadKey: string) => {
    return uploadProgress[uploadKey] || { progress: 0, status: 'pending' as const };
  };

  return (
    <div className="space-y-6">
      {/* Step Header with Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents & Verification
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Upload required documents for identity verification and professional credentials
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Badge variant={store.steps[3]?.isValid ? "default" : "secondary"}>
                  {store.steps[3]?.isValid ? "Complete" : "Incomplete"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {store.steps[3]?.completionPercentage}% complete
                </span>
              </div>
              <Progress value={store.steps[3]?.completionPercentage || 0} className="w-32 mt-2" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Required documents missing:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
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

      {/* Identity Document */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Identity Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h4 className="font-medium mb-2">Government-Issued ID</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a valid government-issued identification document (passport, driver's license, national ID)
              </p>
              
              {store.documents.identityDocument && (
                <DocumentPreview
                  document={store.documents.identityDocument}
                  onRemove={() => removeDocument('identityDocument')}
                  size="md"
                />
              )}

              {!store.documents.identityDocument && (
                <DocumentUploader
                  documentType="Government ID"
                  onUpload={(file, thumbnailUrl) => handleDocumentUpload('identityDocument', 'image', file, thumbnailUrl)}
                  status="pending"
                  requirements={[
                    'Valid government-issued ID (passport, driver\'s license, national ID)',
                    'Document must be clearly legible',
                    'File size must be under 10MB',
                    'Supported formats: JPG, PNG, PDF'
                  ]}
                  maxFileSize={10}
                  allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                  enableCamera={true}
                  enableOCR={true}
                />
              )}

              {/* Upload Progress */}
              {getUploadProgress('identityDocument-image').status === 'uploading' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Uploading...</span>
                    <span>{Math.round(getUploadProgress('identityDocument-image').progress)}%</span>
                  </div>
                  <Progress value={getUploadProgress('identityDocument-image').progress} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h4 className="font-medium mb-2">Professional Profile Photo</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a professional headshot that will be displayed on your instructor profile
              </p>
              
              {store.documents.profilePhoto && (
                <DocumentPreview
                  document={store.documents.profilePhoto}
                  onRemove={() => removeDocument('profilePhoto')}
                  size="md"
                />
              )}

              {!store.documents.profilePhoto && (
                <div className="space-y-4">
                  <BiometricCapture 
                    onCapture={handlePhotoCapture}
                    status="pending"
                    requirements={[
                      'Professional headshot with clear face visibility',
                      'Good lighting and high quality',
                      'Neutral background preferred',
                      'No sunglasses or hats',
                      'File size must be under 5MB',
                      'Supported formats: JPG, PNG'
                    ]}
                    maxFileSize={5}
                    acceptedFormats={['image/jpeg', 'image/png']}
                  />
                  
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">or</span>
                  </div>
                  
                  <DocumentUploader
                    documentType="Profile Photo"
                    onUpload={(file, thumbnailUrl) => handleDocumentUpload('profilePhoto', 'image', file, thumbnailUrl)}
                    status="pending"
                    requirements={[
                      'Professional headshot',
                      'Clear, high-quality image',
                      'File size must be under 5MB',
                      'Supported formats: JPG, PNG'
                    ]}
                    maxFileSize={5}
                    allowedTypes={['image/jpeg', 'image/png']}
                    enableCamera={true}
                    enableOCR={false}
                  />
                </div>
              )}

              {/* Upload Progress */}
              {getUploadProgress('profilePhoto-image').status === 'uploading' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Uploading...</span>
                    <span>{Math.round(getUploadProgress('profilePhoto-image').progress)}%</span>
                  </div>
                  <Progress value={getUploadProgress('profilePhoto-image').progress} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education Certificates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h4 className="font-medium mb-2">Academic Credentials</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your academic certificates, diplomas, or transcripts
              </p>
              
              {(store.documents.educationCertificates || []).length > 0 && (
                <div className="space-y-3">
                  {(store.documents.educationCertificates || []).map((cert, index) => (
                    <DocumentPreview
                      key={cert.id}
                      document={cert}
                      onRemove={() => removeDocument('educationCertificates', cert.id)}
                      size="md"
                    />
                  ))}
                </div>
              )}

              <DocumentUploader
                documentType="Education Certificate"
                onUpload={(file, thumbnailUrl) => handleDocumentUpload('educationCertificates', 'document', file, thumbnailUrl)}
                status="pending"
                requirements={[
                  'Official academic certificates, diplomas, or transcripts',
                  'Documents must be clearly legible',
                  'File size must be under 10MB',
                  'Supported formats: JPG, PNG, PDF'
                ]}
                maxFileSize={10}
                allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                enableCamera={true}
                enableOCR={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h4 className="font-medium mb-2">Professional Credentials</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload professional certifications, licenses, or industry credentials
              </p>
              
              {(store.documents.professionalCertifications || []).length > 0 && (
                <div className="space-y-3">
                  {(store.documents.professionalCertifications || []).map((cert, index) => (
                    <DocumentPreview
                      key={cert.id}
                      document={cert}
                      onRemove={() => removeDocument('professionalCertifications', cert.id)}
                      size="md"
                    />
                  ))}
                </div>
              )}

              <DocumentUploader
                documentType="Professional Certification"
                onUpload={(file, thumbnailUrl) => handleDocumentUpload('professionalCertifications', 'document', file, thumbnailUrl)}
                status="pending"
                requirements={[
                  'Professional certifications, licenses, or industry credentials',
                  'Documents must be clearly legible',
                  'File size must be under 10MB',
                  'Supported formats: JPG, PNG, PDF'
                ]}
                maxFileSize={10}
                allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                enableCamera={true}
                enableOCR={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Employment Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h4 className="font-medium mb-2">Employment Documents</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload employment verification letters or reference letters
              </p>
              
              {(store.documents.employmentVerification || []).length > 0 && (
                <div className="space-y-3">
                  {(store.documents.employmentVerification || []).map((doc, index) => (
                    <DocumentPreview
                      key={doc.id}
                      document={doc}
                      onRemove={() => removeDocument('employmentVerification', doc.id)}
                      size="md"
                    />
                  ))}
                </div>
              )}

              <DocumentUploader
                documentType="Employment Verification"
                onUpload={(file, thumbnailUrl) => handleDocumentUpload('employmentVerification', 'document', file, thumbnailUrl)}
                status="pending"
                requirements={[
                  'Employment verification letters or reference letters',
                  'Documents must be clearly legible',
                  'File size must be under 10MB',
                  'Supported formats: JPG, PNG, PDF'
                ]}
                maxFileSize={10}
                allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                enableCamera={true}
                enableOCR={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume/CV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h4 className="font-medium mb-2">Professional Resume</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your current resume or CV highlighting your qualifications and experience
              </p>
              
              {store.documents.resume && (
                <DocumentPreview
                  document={store.documents.resume}
                  onRemove={() => removeDocument('resume')}
                  size="md"
                />
              )}

              {!store.documents.resume && (
                <DocumentUploader
                  documentType="Resume"
                  onUpload={(file, thumbnailUrl) => handleDocumentUpload('resume', 'document', file, thumbnailUrl)}
                  status="pending"
                  requirements={[
                    'Current professional resume or CV',
                    'Include education, work experience, and skills',
                    'Document must be clearly legible',
                    'File size must be under 10MB',
                    'Supported formats: JPG, PNG, PDF'
                  ]}
                  maxFileSize={10}
                  allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                  enableCamera={true}
                  enableOCR={true}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Introduction Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h4 className="font-medium mb-2">Introduction Video (Optional)</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a short video introducing yourself and your teaching approach
              </p>
              
              {store.documents.videoIntroduction ? (
                <DocumentPreview
                  document={store.documents.videoIntroduction}
                  onRemove={() => removeDocument('videoIntroduction')}
                  size="md"
                />
              ) : (
                <DocumentUploader
                  documentType="Introduction Video"
                  onUpload={(file, thumbnailUrl) => handleDocumentUpload('videoIntroduction', 'video', file, thumbnailUrl)}
                  status="pending"
                  requirements={[
                    'Short video (1-3 minutes) introducing yourself',
                    'Explain your teaching experience and approach',
                    'Good audio and video quality',
                    'File size must be under 100MB',
                    'Supported formats: MP4, MOV, AVI'
                  ]}
                  maxFileSize={100}
                  allowedTypes={['video/mp4', 'video/mov', 'video/avi']}
                  enableCamera={false}
                  enableOCR={false}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation and Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Badge variant={store.steps[3]?.isValid ? "default" : "secondary"}>
                  {store.steps[3]?.isValid ? "Valid" : "Incomplete"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {store.steps[3]?.completionPercentage}% complete
                </span>
              </div>
              {isValidating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validating...
                </div>
              )}
            </div>
            

          </div>
          
          <Progress value={store.steps[3]?.completionPercentage || 0} className="mt-4" />
        </CardContent>
      </Card>


    </div>
  );
}

