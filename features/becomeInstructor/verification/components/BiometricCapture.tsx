"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BiometricCaptureProps {
  onCapture: (photo: File) => void;
  status: "pending" | "captured" | "verified" | "rejected";
  requirements: string[];
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
  onError?: (error: string) => void;
  disabled?: boolean;
}

export function BiometricCapture({
  onCapture,
  status,
  requirements,
  maxFileSize = 5,
  acceptedFormats = ["image/jpeg", "image/png"],
  onError,
  disabled = false,
}: BiometricCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check camera permission on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const permission = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        setCameraPermission(permission.state);

        permission.onchange = () => {
          setCameraPermission(permission.state);
        };
      } catch (error) {
        console.warn("Permission API not supported");
      }
    };

    checkPermissions();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [stream, capturedImage]);

  const handleError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
    },
    [onError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxFileSize) {
        handleError(`File size too large. Maximum size is ${maxFileSize}MB`);
        return false;
      }

      // Check file format
      if (!acceptedFormats.includes(file.type)) {
        handleError(
          `Invalid file format. Accepted formats: ${acceptedFormats.join(", ")}`
        );
        return false;
      }

      return true;
    },
    [maxFileSize, acceptedFormats, handleError]
  );

  const startCamera = useCallback(async () => {
    if (disabled) return;

    setIsLoading(true);
    clearError();

    try {
      // Enhanced constraints for better quality
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: "user",
          frameRate: { ideal: 30 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          setIsCapturing(true);
          setIsLoading(false);
        };
      }

      setCameraPermission("granted");
    } catch (error: any) {
      setCameraPermission("denied");
      if (error.name === "NotAllowedError") {
        handleError(
          "Camera access denied. Please allow camera permissions and try again."
        );
      } else if (error.name === "NotFoundError") {
        handleError("No camera found. Please connect a camera and try again.");
      } else if (error.name === "NotSupportedError") {
        handleError("Camera not supported in this browser.");
      } else {
        handleError("Failed to access camera. Please try again.");
      }
    }
  }, [disabled, clearError, handleError]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
    setIsLoading(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || disabled) return;

    setIsLoading(true);
    clearError();

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        handleError("Failed to get canvas context");
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0);

      // Convert to blob with higher quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File(
              [blob],
              `biometric-capture-${Date.now()}.jpg`,
              {
                type: "image/jpeg",
                lastModified: Date.now(),
              }
            );

            if (validateFile(file)) {
              const imageUrl = URL.createObjectURL(blob);
              setCapturedImage(imageUrl);
              onCapture(file);
              stopCamera();
            }
          } else {
            handleError("Failed to capture photo");
          }
          setIsLoading(false);
        },
        "image/jpeg",
        0.9 // Higher quality
      );
    } catch (error) {
      handleError("Failed to capture photo");
    }
  }, [onCapture, stopCamera, disabled, clearError, handleError, validateFile]);

  const retakePhoto = useCallback(() => {
    if (disabled) return;

    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
    clearError();
    startCamera();
  }, [capturedImage, disabled, clearError, startCamera]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || disabled) return;

      clearError();

      if (validateFile(file)) {
        const imageUrl = URL.createObjectURL(file);
        setCapturedImage(imageUrl);
        onCapture(file);
      }

      // Reset input
      event.target.value = "";
    },
    [onCapture, disabled, clearError, validateFile]
  );

  const getStatusBadge = () => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "captured":
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
      case "captured":
        return "border-blue-500";
      default:
        return "border-gray-300";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {capturedImage ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Photo Captured</h3>
                  {getStatusBadge()}
                </div>
                <div className="relative inline-block">
                  <img
                    src={capturedImage}
                    alt="Captured biometric photo"
                    className={`w-64 h-64 object-cover rounded-lg border-2 ${getStatusColor()}`}
                  />
                  {status === "verified" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg">
                      <div className="bg-white rounded-full p-2">
                        <Check className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                  )}
                  {status === "rejected" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-lg">
                      <div className="bg-white rounded-full p-2">
                        <X className="h-8 w-8 text-red-500" />
                      </div>
                    </div>
                  )}
                  {status === "captured" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 rounded-lg">
                      <div className="bg-white rounded-full p-2">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={retakePhoto}
                    disabled={disabled || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-2" />
                    )}
                    Retake Photo
                  </Button>
                </div>
              </div>
            ) : isCapturing ? (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full max-w-md mx-auto rounded-lg border-2 border-primary/50"
                    style={{ aspectRatio: "4/3" }}
                  />
                  {/* Camera overlay with corner guides */}
                  <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-6 h-6 border-l-3 border-t-3 border-primary"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-r-3 border-t-3 border-primary"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-3 border-b-3 border-primary"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-3 border-b-3 border-primary"></div>
                  </div>
                  {/* Center guide */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-primary/30 rounded-full"></div>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={capturePhoto}
                    disabled={disabled || isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    Capture Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={stopCamera}
                    disabled={disabled || isLoading}
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Position your face within the circular guide and click capture
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Take Your Photo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We'll use this photo for your instructor profile and
                    identity verification
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      onClick={startCamera}
                      disabled={
                        disabled || isLoading || cameraPermission === "denied"
                      }
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4 mr-2" />
                      )}
                      Start Camera
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept={acceptedFormats.join(",")}
                        onChange={handleFileUpload}
                        disabled={disabled}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="Upload photo file"
                      />
                      <Button variant="outline" disabled={disabled}>
                        Upload Photo
                      </Button>
                    </div>
                  </div>
                  {cameraPermission === "denied" && (
                    <p className="text-xs text-red-600 mt-2">
                      Camera access denied. Please enable camera permissions in
                      your browser settings.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Requirements */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Photo Requirements</h4>
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
              {acceptedFormats
                .map((format) => format.split("/")[1].toUpperCase())
                .join(", ")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
