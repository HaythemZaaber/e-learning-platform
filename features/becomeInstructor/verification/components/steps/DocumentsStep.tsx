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
  X,
  RefreshCw,
  Play
} from 'lucide-react';
import { DocumentUploader } from '../DocumentUploader';
import { BiometricCapture } from '../BiometricCapture';
import { useAuth } from '@clerk/nextjs';

interface UploadProgress {
  [key: string]: {
    progress: number;
    status: 'uploading' | 'completed' | 'error' | 'pending';
    error?: string;
  };
}

interface PreviewFile {
  file: any;
  type: string;
}

interface PreviewFile {
  file: any;
  type: string;
}

export function DocumentsStep() {
  const store = useInstructorApplicationStore();
  const { getToken } = useAuth();

  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);



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

  const handlePreviewFile = (document: any, type: string) => {
    setPreviewFile({ file: document, type });
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const getDocumentPreview = (document: any) => {
    if (!document) return null;
    
    // Handle different document data structures
    const documentUrl = document.url || document.previewUrl || document.thumbnailUrl || document.dataUrl;
    const documentType = document.type || document.mimeType || 'application/octet-stream';
    const documentName = document.name || document.fileName || 'Document';
    
    console.log('getDocumentPreview:', { 
      documentType, 
      hasThumbnail: !!document.thumbnailUrl, 
      hasUrl: !!documentUrl,
      documentName 
    });
    
    if (documentType.startsWith('image/')) {
      return (
        <div className="relative group">
          <img 
            src={documentUrl} 
            alt={documentName}
            className="w-20 h-20 object-cover rounded-lg border"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallbackUrl = target.getAttribute('data-fallback');
              if (fallbackUrl && fallbackUrl !== target.src) {
                target.src = fallbackUrl;
                target.removeAttribute('data-fallback');
              } else {
                // Show fallback icon
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }
            }}
            data-fallback={document.fallbackUrl || document.dataUrl}
          />
          {/* Fallback for failed image loads */}
          <div className="hidden w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
            <Image className="h-8 w-8 text-gray-400" />
          </div>
          <div className="absolute inset-0 hover:bg-white/10 hover:backdrop-blur-sm bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 hover:text-black   hover:bg-white/50 hover:backdrop-blur-sm"
              onClick={() => handlePreviewFile(document, 'image')}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }
    
    if (documentType.startsWith('video/')) {
      console.log('Rendering video preview:', { 
        hasThumbnail: !!document.thumbnailUrl, 
        documentUrl,
        documentName 
      });
      
      return (
        <div className="relative group">
          {document.thumbnailUrl ? (
            <img 
              src={document.thumbnailUrl}
              alt={documentName}
              className="w-20 h-20 object-cover rounded-lg border"
              onError={(e) => {
                console.log('Video thumbnail failed to load');
                // Show video icon fallback
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <video 
              src={documentUrl}
              className="w-20 h-20 object-cover rounded-lg border"
              muted
              preload="metadata"
              onError={() => {
                console.log('Video element failed to load');
                // Show fallback icon
                const videoElement = document.querySelector(`video[src="${documentUrl}"]`) as HTMLVideoElement;
                if (videoElement) {
                  videoElement.style.display = 'none';
                  videoElement.nextElementSibling?.classList.remove('hidden');
                }
              }}
            />
          )}
          {/* Fallback for failed video loads */}
          <div className="hidden w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
            <Video className="h-8 w-8 text-gray-400" />
          </div>
          <div className="absolute inset-0 hover:bg-white/10 hover:backdrop-blur-sm bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 text-white"
              onClick={() => handlePreviewFile(document, 'video')}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }
    
    // Default fallback for other file types
    return (
      <div className="relative group w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
        <FileText className="h-8 w-8 text-gray-400" />
        <div className="absolute inset-0 hover:bg-white/10 hover:backdrop-blur-sm bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 text-white"
            onClick={() => handlePreviewFile(document, 'document')}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
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
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getDocumentPreview(store.documents.identityDocument)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(store.documents.identityDocument.verificationStatus)}
                          <span className="font-medium">Identity Document</span>
                          {getStatusBadge(store.documents.identityDocument.verificationStatus)}
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          {store.documents.identityDocument.name}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Uploaded: {new Date(store.documents.identityDocument.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument('identityDocument')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getDocumentPreview(store.documents.profilePhoto)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(store.documents.profilePhoto.verificationStatus)}
                          <span className="font-medium">Profile Photo</span>
                          {getStatusBadge(store.documents.profilePhoto.verificationStatus)}
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          {store.documents.profilePhoto.name}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Uploaded: {new Date(store.documents.profilePhoto.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument('profilePhoto')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
                    <div key={cert.id} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getDocumentPreview(cert)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(cert.verificationStatus)}
                              <span className="font-medium">Education Certificate {index + 1}</span>
                              {getStatusBadge(cert.verificationStatus)}
                            </div>
                            <p className="text-sm text-purple-700 mt-1">
                              {cert.name}
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                              Uploaded: {new Date(cert.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument('educationCertificates', cert.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
                    <div key={cert.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getDocumentPreview(cert)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(cert.verificationStatus)}
                              <span className="font-medium">Professional Certification {index + 1}</span>
                              {getStatusBadge(cert.verificationStatus)}
                            </div>
                            <p className="text-sm text-orange-700 mt-1">
                              {cert.name}
                            </p>
                            <p className="text-xs text-orange-600 mt-1">
                              Uploaded: {new Date(cert.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument('professionalCertifications', cert.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
                    <div key={doc.id} className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getDocumentPreview(doc)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(doc.verificationStatus)}
                              <span className="font-medium">Employment Document {index + 1}</span>
                              {getStatusBadge(doc.verificationStatus)}
                            </div>
                            <p className="text-sm text-teal-700 mt-1">
                              {doc.name}
                            </p>
                            <p className="text-xs text-teal-600 mt-1">
                              Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument('employmentVerification', doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getDocumentPreview(store.documents.resume)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(store.documents.resume.verificationStatus)}
                          <span className="font-medium">Resume</span>
                          {getStatusBadge(store.documents.resume.verificationStatus)}
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          {store.documents.resume.name}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Uploaded: {new Date(store.documents.resume.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument('resume')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getDocumentPreview(store.documents.videoIntroduction)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(store.documents.videoIntroduction.verificationStatus)}
                          <span className="font-medium">Introduction Video</span>
                          {getStatusBadge(store.documents.videoIntroduction.verificationStatus)}
                        </div>
                        <p className="text-sm text-indigo-700 mt-1">
                          {store.documents.videoIntroduction.name}
                        </p>
                        <p className="text-xs text-indigo-600 mt-1">
                          Uploaded: {new Date(store.documents.videoIntroduction.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument('videoIntroduction')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Preview: {previewFile.file.title || previewFile.file.name}
              </h3>
              <button
                onClick={closePreview}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 max-h-[calc(90vh-120px)] overflow-auto">
              {previewFile.type === 'video' && (
                <video
                  src={previewFile.file.url}
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
                  <source src={previewFile.file.url} type={previewFile.file.type || 'video/mp4'} />
                  Your browser does not support the video tag.
                </video>
              )}
              
              {previewFile.type === 'image' && (
                <img
                  src={previewFile.file.url}
                  alt={previewFile.file.title || previewFile.file.name}
                  className="w-full max-h-[70vh] object-contain"
                />
              )}
              
              {previewFile.type === 'document' && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Document preview not available
                  </p>
                  <a
                    href={previewFile.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

