"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
  X,
  Camera,
  FileText,
  Image,
  Loader2,
  Download,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploaderProps {
  documentType: string;
  onUpload: (file: File, thumbnailUrl?: string) => void;
  status: "pending" | "uploading" | "verified" | "rejected";
  requirements: string[];
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  onError?: (error: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
  disabled?: boolean;
  enableCamera?: boolean;
  enableOCR?: boolean;
}

interface AIAnalysis {
  confidence: number;
  extractedText?: string;
  documentType?: string;
  validationChecks: Record<string, boolean>;
  issues?: string[];
  suggestions?: string[];
}

export function DocumentUploader({
  documentType,
  onUpload,
  status,
  requirements,
  maxFileSize = 10,
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  onError,
  onAnalysisComplete,
  disabled = false,
  enableCamera = true,
  enableOCR = true,
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [stream, previewUrl]);

  const handleError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      onError?.(errorMessage);
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    [onError, toast]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getFileTypeIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (type === "application/pdf") return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = useCallback(
    (file: File): boolean => {
      clearError();

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        const allowedExtensions = allowedTypes
          .map((type) => {
            if (type.startsWith("image/"))
              return type.split("/")[1].toUpperCase();
            if (type === "application/pdf") return "PDF";
            return type.split("/")[1].toUpperCase();
          })
          .join(", ");

        handleError(`Invalid file type. Allowed types: ${allowedExtensions}`);
        return false;
      }

      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxFileSize) {
        handleError(`File size too large. Maximum size is ${maxFileSize}MB`);
        return false;
      }

      // Check if file is empty
      if (file.size === 0) {
        handleError("File is empty. Please select a valid file.");
        return false;
      }

      return true;
    },
    [allowedTypes, maxFileSize, handleError, clearError]
  );

  const simulateAIAnalysis = useCallback(
    (file: File): Promise<AIAnalysis> => {
      return new Promise((resolve) => {
        // Simulate AI processing time
        setTimeout(() => {
          const analysis: AIAnalysis = {
            confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
            extractedText: enableOCR
              ? "Sample extracted text from document"
              : undefined,
            documentType: documentType,
            validationChecks: {
              textClarity: Math.random() > 0.1,
              faceVisible: file.type.startsWith("image/")
                ? Math.random() > 0.2
                : true,
              documentIntegrity: Math.random() > 0.1,
              expirationDate: Math.random() > 0.3,
              properLighting: file.type.startsWith("image/")
                ? Math.random() > 0.2
                : true,
              noBlur: Math.random() > 0.15,
            },
            issues: [],
            suggestions: [],
          };

          // Add issues based on failed checks
          Object.entries(analysis.validationChecks).forEach(
            ([check, passed]) => {
              if (!passed) {
                analysis.issues?.push(
                  `${check.replace(/([A-Z])/g, " $1").trim()}`
                );
              }
            }
          );

          // Add suggestions for improvement
          if (analysis.confidence < 90) {
            analysis.suggestions?.push(
              "Consider retaking the photo with better lighting"
            );
            analysis.suggestions?.push(
              "Ensure the document is fully visible and flat"
            );
          }

          resolve(analysis);
        }, 2000 + Math.random() * 1000); // 2-3 seconds
      });
    },
    [documentType, enableOCR]
  );

  const processFile = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return;

      setFileName(file.name);
      setFileSize(file.size);
      setIsProcessing(true);
      setUploadProgress(0);

      // Create preview URL with proper error handling
      try {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        
        // Create object URL for preview
        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);
        
        // For images, create both object URL and data URL for better compatibility
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              // Store data URL as fallback
              const dataUrl = e.target.result as string;
              // Use data URL as primary for better image display
              setPreviewUrl(dataUrl);
            }
          };
          reader.readAsDataURL(file);
        }
        
        // For videos, create thumbnail
        if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.src = newPreviewUrl;
          video.muted = true;
          video.currentTime = 1;
          
          // Wait for video to load and create thumbnail
          await new Promise<void>((resolve, reject) => {
            video.onloadeddata = () => {
              try {
                const canvas = document.createElement('canvas');
                canvas.width = 200;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(video, 0, 0, 200, 200);
                  const thumbnailUrl = canvas.toDataURL('image/jpeg');
                  // Store thumbnail URL for video preview
                  setPreviewUrl(thumbnailUrl);
                  // Store thumbnail URL for later use
                  (file as any).thumbnailUrl = thumbnailUrl;
                  console.log('Generated video thumbnail:', thumbnailUrl.substring(0, 50) + '...');
                }
                resolve();
              } catch (error) {
                reject(error);
              }
            };
            video.onerror = reject;
            // Set a timeout in case video loading takes too long
            setTimeout(() => reject(new Error('Video loading timeout')), 10000);
          });
        }
      } catch (error) {
        console.error('Error creating preview:', error);
        handleError('Failed to create document preview');
        return;
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      try {
        // Call the upload callback with thumbnail URL if available
        const thumbnailUrl = (file as any).thumbnailUrl;
        console.log('Calling onUpload with thumbnail:', !!thumbnailUrl);
        onUpload(file, thumbnailUrl);

        // Simulate AI analysis
        const analysis = await simulateAIAnalysis(file);
        setAiAnalysis(analysis);
        onAnalysisComplete?.(analysis);

        setUploadProgress(100);
        setIsProcessing(false);

        toast({
          title: "Document Uploaded",
          description: `${file.name} has been successfully uploaded and analyzed.`,
        });
      } catch (error) {
        handleError("Failed to process document. Please try again.");
        setIsProcessing(false);
        clearInterval(progressInterval);
      }
    },
    [
      validateFile,
      onUpload,
      simulateAIAnalysis,
      onAnalysisComplete,
      toast,
      handleError,
      previewUrl,
    ]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [disabled, processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
      // Reset input
      e.target.value = "";
    },
    [processFile]
  );

  const startCamera = useCallback(async () => {
    if (disabled) return;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment", // Use back camera for documents
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCapturingPhoto(true);
    } catch (error) {
      handleError(
        "Failed to access camera. Please ensure camera permissions are granted."
      );
    }
  }, [disabled, handleError]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCapturingPhoto(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `document-${Date.now()}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            processFile(file);
            stopCamera();
          }
        },
        "image/jpeg",
        0.9
      );
    }
  }, [processFile, stopCamera]);

  const resetUpload = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName("");
    setFileSize(0);
    setAiAnalysis(null);
    setUploadProgress(0);
    setIsProcessing(false);
    clearError();
  }, [previewUrl, clearError]);

  const downloadFile = useCallback(() => {
    if (previewUrl) {
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = fileName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [previewUrl, fileName]);

  const getStatusIcon = () => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "uploading":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Upload className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "uploading":
        return (
          <Badge variant="secondary">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "verified":
        return "border-green-500";
      case "rejected":
        return "border-red-500";
      case "uploading":
        return "border-blue-500";
      default:
        return "border-muted-foreground/25";
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <p className="text-sm font-medium text-red-800">Upload Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Camera View */}
      {isCapturingPhoto && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md mx-auto rounded-lg border-2 border-primary/50"
                />
                <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-3 border-t-3 border-primary"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-3 border-t-3 border-primary"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-3 border-b-3 border-primary"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-3 border-b-3 border-primary"></div>
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={capturePhoto} disabled={disabled}>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Document
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Position the document within the frame and ensure good lighting
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Upload Card */}
      {!isCapturingPhoto && (
        <Card
          className={`border-2 border-dashed transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary/5 scale-105"
              : `${getStatusColor()} ${
                  status === "verified"
                    ? "bg-green-50"
                    : status === "rejected"
                    ? "bg-red-50"
                    : ""
                }`
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="p-6">
            {previewUrl ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    <div className="text-left">
                      <span className="font-medium">Document Uploaded</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getFileTypeIcon(fileName.split(".").pop() || "")}
                        <span>{fileName}</span>
                        <span>({formatFileSize(fileSize)})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge()}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetUpload}
                      disabled={disabled || isProcessing}
                      title="Remove document"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Document preview"
                    className="w-full max-w-md mx-auto rounded-lg border"
                    onError={(e) => {
                      // Try fallback data URL if available
                      const target = e.target as HTMLImageElement;
                      const fallback = target.getAttribute('data-fallback');
                      if (fallback) {
                        target.src = fallback;
                      } else {
                        // Show error state
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }
                    }}
                  />
                  {/* Fallback for failed image loads */}
                  <div className="hidden w-full max-w-md mx-auto h-64 bg-gray-100 rounded-lg border flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Preview not available</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(previewUrl, "_blank")}
                      title="View full size"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={downloadFile}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {(isProcessing || uploadProgress < 100) && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing document...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {aiAnalysis && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        AI Verification Results
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Confidence Score:
                          </span>
                          <Badge
                            variant={
                              aiAnalysis.confidence > 90
                                ? "default"
                                : "secondary"
                            }
                          >
                            {aiAnalysis.confidence}%
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">
                            Validation Checks:
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(aiAnalysis.validationChecks).map(
                              ([check, passed]) => (
                                <div
                                  key={check}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  {passed ? (
                                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                                  )}
                                  <span className="capitalize">
                                    {check.replace(/([A-Z])/g, " $1").trim()}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {aiAnalysis.issues && aiAnalysis.issues.length > 0 && (
                          <div className="space-y-1">
                            <h5 className="text-sm font-medium text-red-700">
                              Issues Found:
                            </h5>
                            <ul className="text-sm text-red-600 space-y-1">
                              {aiAnalysis.issues.map((issue, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-1"
                                >
                                  <span className="text-red-500 mt-1">•</span>
                                  <span className="capitalize">{issue}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {aiAnalysis.suggestions &&
                          aiAnalysis.suggestions.length > 0 && (
                            <div className="space-y-1">
                              <h5 className="text-sm font-medium text-blue-700">
                                Suggestions:
                              </h5>
                              <ul className="text-sm text-blue-600 space-y-1">
                                {aiAnalysis.suggestions.map(
                                  (suggestion, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-1"
                                    >
                                      <span className="text-blue-500 mt-1">
                                        •
                                      </span>
                                      <span>{suggestion}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {enableOCR && aiAnalysis.extractedText && (
                          <div className="space-y-1">
                            <h5 className="text-sm font-medium">
                              Extracted Text Preview:
                            </h5>
                            <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                              {aiAnalysis.extractedText}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {status === "rejected" && (
                  <div className="text-center">
                    <Button variant="outline" onClick={resetUpload}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Upload Different Document
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-muted">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-1">
                      Upload {documentType}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop your document here, or click to browse
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={disabled}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                    {enableCamera && (
                      <Button
                        variant="outline"
                        onClick={startCamera}
                        disabled={disabled}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Max file size: {maxFileSize}MB • Formats:{" "}
                    {allowedTypes
                      .map((type) => type.split("/")[1].toUpperCase())
                      .join(", ")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
        aria-label="Upload document file"
      />

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Requirements */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Document Requirements</h4>
          <ul className="space-y-2">
            {requirements.map((requirement, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <span className="text-primary mt-1 font-bold">•</span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-muted">
            <p className="text-xs text-muted-foreground">
              Maximum file size: {maxFileSize}MB • Supported formats:{" "}
              {allowedTypes
                .map((type) => type.split("/")[1].toUpperCase())
                .join(", ")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
