"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CheckCircle,
  User,
  MapPin,
  Phone,
  Mail,
  Shield,
  Camera,
  FileText,
  AlertCircle,
  Clock,
  Upload,
  Eye,
  EyeOff,
  Globe,
  Home,
  Smartphone,
  Brain,
  RefreshCw,
  Check,
  X,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { BiometricCapture } from "../BiometricCapture";
import { OTPVerification } from "../OtpVerification";

interface IdentityVerificationProps {
  data: any;
  updateData: (data: any) => void;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

interface VerificationStatus {
  photo: "pending" | "uploading" | "processing" | "verified" | "rejected";
  governmentId:
    | "pending"
    | "uploading"
    | "processing"
    | "verified"
    | "rejected";
  addressProof:
    | "pending"
    | "uploading"
    | "processing"
    | "verified"
    | "rejected";
  phoneVerified: boolean;
  emailVerified: boolean;
  biometricMatch: "pending" | "processing" | "verified" | "failed";
}

interface DocumentUploadProps {
  documentType: string;
  title: string;
  description: string;
  requirements: string[];
  status: VerificationStatus[keyof VerificationStatus];
  onUpload: (file: File) => void;
  icon: React.ElementType;
}

interface BiometricCaptureProps {
  onCapture: (photo: File) => void;
  status: VerificationStatus["photo"];
  requirements: string[];
}

interface OTPVerificationProps {
  type: "phone" | "email";
  contact: string;
  onVerified: () => void;
}

// Enhanced Document Uploader Component
const DocumentUploader: React.FC<DocumentUploadProps> = ({
  documentType,
  title,
  description,
  requirements,
  status,
  onUpload,
  icon: Icon,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  const simulateUpload = (file: File) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onUpload(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = () => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "processing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "uploading":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "verified":
        return <Check className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <X className="h-5 w-5 text-red-600" />;
      case "processing":
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      case "uploading":
        return <Upload className="h-5 w-5 text-yellow-600" />;
      default:
        return <Icon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : status === "verified"
            ? "border-green-300 bg-green-50"
            : status === "rejected"
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        } ${getStatusColor()}`}
      >
        {/* Upload Area */}
        <div
          className="text-center"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mb-4">{getStatusIcon()}</div>

          {status === "uploading" && (
            <div className="mb-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {status === "processing" && (
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600">
                  AI is verifying your document...
                </span>
              </div>
            </div>
          )}

          {status === "verified" && (
            <div className="mb-4">
              <p className="text-green-700 font-medium">
                Document Verified Successfully
              </p>
              <p className="text-sm text-green-600">
                AI verification completed
              </p>
            </div>
          )}

          {status === "rejected" && (
            <div className="mb-4">
              <p className="text-red-700 font-medium">Document Rejected</p>
              <p className="text-sm text-red-600">
                Please upload a clearer image
              </p>
            </div>
          )}

          {(status === "pending" || status === "rejected") && (
            <>
              <p className="text-gray-700 mb-2">
                Drop your {title.toLowerCase()} here, or{" "}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleChange}
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, PDF (max 10MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700">Requirements:</h4>
        <div className="grid grid-cols-1 gap-2">
          {requirements.map((req, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-sm text-gray-600"
            >
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>{req}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Biometric Capture Component
// const BiometricCapture: React.FC<BiometricCaptureProps> = ({
//   onCapture,
//   status,
//   requirements,
// }) => {
//   const [showCamera, setShowCamera] = useState(false);
//   const [countdown, setCountdown] = useState(0);

//   const handleTakePhoto = () => {
//     setShowCamera(true);
//     setCountdown(3);
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           // Simulate photo capture
//           const fakeFile = new File(["fake-photo"], "selfie.jpg", {
//             type: "image/jpeg",
//           });
//           onCapture(fakeFile);
//           setShowCamera(false);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   return (
//     <div className="space-y-4">
//       <div
//         className={`relative border-2 rounded-lg p-8 text-center ${
//           status === "verified"
//             ? "border-green-300 bg-green-50"
//             : status === "rejected"
//             ? "border-red-300 bg-red-50"
//             : "border-gray-300"
//         }`}
//       >
//         {showCamera && countdown > 0 && (
//           <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
//             <div className="text-white">
//               <div className="text-6xl font-bold mb-2">{countdown}</div>
//               <p>Get ready...</p>
//             </div>
//           </div>
//         )}

//         {status === "verified" ? (
//           <div>
//             <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
//             <p className="text-green-700 font-medium">Photo Verified</p>
//             <p className="text-sm text-green-600">Biometric match successful</p>
//           </div>
//         ) : status === "rejected" ? (
//           <div>
//             <X className="h-16 w-16 text-red-600 mx-auto mb-4" />
//             <p className="text-red-700 font-medium">Photo Rejected</p>
//             <p className="text-sm text-red-600">Please retake the photo</p>
//             <Button onClick={handleTakePhoto} className="mt-4">
//               <Camera className="h-4 w-4 mr-2" />
//               Retake Photo
//             </Button>
//           </div>
//         ) : (
//           <div>
//             <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-700 mb-4">Take a professional headshot</p>
//             <Button onClick={handleTakePhoto} disabled={showCamera}>
//               <Camera className="h-4 w-4 mr-2" />
//               {showCamera ? "Taking Photo..." : "Take Photo"}
//             </Button>
//           </div>
//         )}
//       </div>

//       <div className="space-y-2">
//         <h4 className="font-medium text-sm text-gray-700">
//           Photo Requirements:
//         </h4>
//         <div className="grid grid-cols-1 gap-2">
//           {requirements.map((req, idx) => (
//             <div
//               key={idx}
//               className="flex items-start gap-2 text-sm text-gray-600"
//             >
//               <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
//               <span>{req}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// Enhanced OTP Verification Component
// const OTPVerification: React.FC<OTPVerificationProps> = ({
//   type,
//   contact,
//   onVerified,
// }) => {
//   const [otp, setOtp] = useState("");
//   const [codeSent, setCodeSent] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [isVerifying, setIsVerifying] = useState(false);

//   const sendCode = () => {
//     setCodeSent(true);
//     setCountdown(60);
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const verifyCode = () => {
//     setIsVerifying(true);
//     // Simulate verification
//     setTimeout(() => {
//       setIsVerifying(false);
//       if (otp === "123456") {
//         onVerified();
//       } else {
//         alert("Invalid code. Please try again.");
//       }
//     }, 1500);
//   };

//   return (
//     <div className="space-y-4">
//       {!codeSent ? (
//         <Button onClick={sendCode} className="w-full">
//           <div className="flex items-center gap-2">
//             {type === "phone" ? (
//               <Smartphone className="h-4 w-4" />
//             ) : (
//               <Mail className="h-4 w-4" />
//             )}
//             Send Verification Code
//           </div>
//         </Button>
//       ) : (
//         <div className="space-y-4">
//           <Alert>
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>
//               We've sent a 6-digit code to {contact}. Enter it below to verify.
//             </AlertDescription>
//           </Alert>

//           <div className="flex gap-2">
//             <Input
//               placeholder="Enter 6-digit code"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               maxLength={6}
//               className="flex-1"
//             />
//             <Button
//               onClick={verifyCode}
//               disabled={otp.length !== 6 || isVerifying}
//             >
//               {isVerifying ? (
//                 <RefreshCw className="h-4 w-4 animate-spin" />
//               ) : (
//                 "Verify"
//               )}
//             </Button>
//           </div>

//           <div className="flex items-center justify-between text-sm text-gray-600">
//             <span>Didn't receive the code?</span>
//             {countdown > 0 ? (
//               <span>Resend in {countdown}s</span>
//             ) : (
//               <button
//                 onClick={sendCode}
//                 className="text-blue-600 hover:text-blue-700 underline"
//               >
//                 Resend Code
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

export function IdentityVerification({
  data,
  updateData,
}: IdentityVerificationProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    email: "",
  });

  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>({
      photo: "pending",
      governmentId: "pending",
      addressProof: "pending",
      phoneVerified: false,
      emailVerified: false,
      biometricMatch: "pending",
    });

  // Calculate progress without state
  const calculateProgress = useCallback(() => {
    const completed = [
      verificationStatus.photo === "verified",
      verificationStatus.governmentId === "verified",
      verificationStatus.addressProof === "verified",
      verificationStatus.phoneVerified,
      verificationStatus.emailVerified,
    ];
    return (completed.filter(Boolean).length / completed.length) * 100;
  }, [verificationStatus]);

  // Debounced update function
  const debouncedUpdate = useCallback(
    (newData: any) => {
      const timeoutId = setTimeout(() => {
        updateData(newData);
      }, 100);
      return () => clearTimeout(timeoutId);
    },
    [updateData]
  );

  // Update parent data only when necessary
  useEffect(() => {
    const progress = calculateProgress();
    const newData = {
      personalInfo,
      verificationStatus,
      overallProgress: progress,
      lastUpdated: new Date().toISOString(),
    };

    // Only update if data has actually changed
    if (JSON.stringify(newData) !== JSON.stringify(data)) {
      debouncedUpdate(newData);
    }
  }, [
    personalInfo,
    verificationStatus,
    calculateProgress,
    data,
    debouncedUpdate,
  ]);

  const handlePersonalInfoChange = useCallback(
    (field: keyof PersonalInfo, value: string) => {
      setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleDocumentUpload = useCallback(
    (documentType: keyof VerificationStatus, file: File) => {
      // Simulate upload process
      setVerificationStatus((prev) => ({
        ...prev,
        [documentType]: "uploading",
      }));

      // Simulate processing
      setTimeout(() => {
        setVerificationStatus((prev) => ({
          ...prev,
          [documentType]: "processing",
        }));
      }, 2000);

      // Simulate AI verification
      setTimeout(() => {
        setVerificationStatus((prev) => ({
          ...prev,
          [documentType]: "verified",
        }));
      }, 4000);
    },
    []
  );

  const handlePhoneVerification = useCallback(() => {
    setVerificationStatus((prev) => ({ ...prev, phoneVerified: true }));
  }, []);

  const handleEmailVerification = useCallback(() => {
    setVerificationStatus((prev) => ({ ...prev, emailVerified: true }));
  }, []);

  const getTabStatus = useCallback(
    (tab: string) => {
      switch (tab) {
        case "personal":
          return personalInfo.firstName &&
            personalInfo.lastName &&
            personalInfo.email
            ? "completed"
            : "pending";
        case "documents":
          return verificationStatus.governmentId === "verified" &&
            verificationStatus.addressProof === "verified"
            ? "completed"
            : "pending";
        case "photo":
          return verificationStatus.photo === "verified"
            ? "completed"
            : "pending";
        case "verification":
          return verificationStatus.phoneVerified &&
            verificationStatus.emailVerified
            ? "completed"
            : "pending";
        default:
          return "pending";
      }
    },
    [personalInfo, verificationStatus]
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Progress Header */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Identity Verification Progress
            </CardTitle>
            <Badge
              variant={calculateProgress() === 100 ? "default" : "secondary"}
              className="text-base px-3 py-1"
            >
              {Math.round(calculateProgress())}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} className="mb-4 h-3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: "personal", label: "Personal Info", icon: User },
              { key: "documents", label: "Documents", icon: FileText },
              { key: "photo", label: "Photo", icon: Camera },
              { key: "verification", label: "Verification", icon: Shield },
            ].map(({ key, label, icon: Icon }) => {
              const status = getTabStatus(key);
              return (
                <div
                  key={key}
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-all duration-200 ${
                    activeTab === key
                      ? "border-blue-500 bg-blue-50"
                      : status === "completed"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(key)}
                >
                  <Icon
                    className={`h-5 w-5 mx-auto mb-2 ${
                      activeTab === key
                        ? "text-blue-600"
                        : status === "completed"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  />
                  <div className="text-sm font-medium">{label}</div>
                  {status === "completed" && (
                    <CheckCircle className="h-4 w-4 text-green-600 mx-auto mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Security Badge */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>AI-Powered Verification:</strong> Your documents are processed
          using advanced AI technology for instant verification while
          maintaining the highest security standards.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="photo" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Photo
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Verify
          </TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Provide your basic personal details exactly as they appear on
                your government-issued ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) =>
                      handlePersonalInfoChange("firstName", e.target.value)
                    }
                    placeholder="Enter your first name"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) =>
                      handlePersonalInfoChange("lastName", e.target.value)
                    }
                    placeholder="Enter your last name"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) =>
                      handlePersonalInfoChange("dateOfBirth", e.target.value)
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Select
                    value={personalInfo.nationality}
                    onValueChange={(value) =>
                      handlePersonalInfoChange("nationality", value)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">🇺🇸 United States</SelectItem>
                      <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                      <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                      <SelectItem value="au">🇦🇺 Australia</SelectItem>
                      <SelectItem value="de">🇩🇪 Germany</SelectItem>
                      <SelectItem value="fr">🇫🇷 France</SelectItem>
                      <SelectItem value="other">🌍 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Address Information
              </CardTitle>
              <CardDescription>
                Your current residential address for verification purposes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={personalInfo.address}
                  onChange={(e) =>
                    handlePersonalInfoChange("address", e.target.value)
                  }
                  placeholder="Enter your complete street address"
                  className="h-11"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={personalInfo.city}
                    onChange={(e) =>
                      handlePersonalInfoChange("city", e.target.value)
                    }
                    placeholder="Enter your city"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={personalInfo.postalCode}
                    onChange={(e) =>
                      handlePersonalInfoChange("postalCode", e.target.value)
                    }
                    placeholder="Enter postal code"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={personalInfo.country}
                    onValueChange={(value) =>
                      handlePersonalInfoChange("country", value)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">🇺🇸 United States</SelectItem>
                      <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                      <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                      <SelectItem value="au">🇦🇺 Australia</SelectItem>
                      <SelectItem value="de">🇩🇪 Germany</SelectItem>
                      <SelectItem value="fr">🇫🇷 France</SelectItem>
                      <SelectItem value="other">🌍 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Contact details for verification and communication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) =>
                      handlePersonalInfoChange("phone", e.target.value)
                    }
                    placeholder="+1 (555) 123-4567"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) =>
                      handlePersonalInfoChange("email", e.target.value)
                    }
                    placeholder="your.email@example.com"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents" className="space-y-6">
          <DocumentUploader
            documentType="governmentId"
            title="Government-Issued ID"
            description="Upload a clear photo of your passport, driver's license, or national ID card"
            requirements={[
              "Document must be valid and not expired",
              "All text must be clearly visible and readable",
              "Photo must show your face clearly",
              "No shadows, glare, or reflections on the document",
              "Document must be completely visible within the frame",
            ]}
            status={verificationStatus.governmentId}
            onUpload={(file) => handleDocumentUpload("governmentId", file)}
            icon={Shield}
          />
        </TabsContent>
        <DocumentUploader
          documentType="addressProof"
          title="Address Verification Document"
          description="Upload a utility bill, bank statement, or official document from the last 3 months"
          requirements={[
            "Document must be dated within the last 3 months",
            "Your name and address must be clearly visible",
            "Accepted documents: utility bills, bank statements, tax documents",
            "Screenshots or photocopies are not accepted",
            "Document must be from a recognized institution",
          ]}
          status={verificationStatus.addressProof}
          onUpload={(file) => handleDocumentUpload("addressProof", file)}
          icon={Home}
        />
        <TabsContent value="photo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Professional Photo Capture
              </CardTitle>
              <CardDescription>
                Take or upload a professional headshot that will be used on your
                instructor profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BiometricCapture
                onCapture={(photo) => handleDocumentUpload("photo", photo)}
                status={verificationStatus.photo as "pending" | "captured" | "verified" | "rejected"}
                requirements={[
                  "Face must be clearly visible and well-lit",
                  "Look directly at the camera with a neutral expression",
                  "Remove sunglasses, hats, or face coverings",
                  "Professional attire recommended",
                  "Plain background preferred (white or light colors)",
                  "High resolution image (minimum 300x300 pixels)",
                ]}
              />
            </CardContent>
          </Card>

          {verificationStatus.photo === "verified" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Biometric Verification
                </CardTitle>
                <CardDescription>
                  AI-powered face matching with your government ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        verificationStatus.biometricMatch === "verified"
                          ? "bg-green-100"
                          : verificationStatus.biometricMatch === "processing"
                          ? "bg-blue-100"
                          : verificationStatus.biometricMatch === "failed"
                          ? "bg-red-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {verificationStatus.biometricMatch === "verified" ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : verificationStatus.biometricMatch === "processing" ? (
                        <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                      ) : verificationStatus.biometricMatch === "failed" ? (
                        <X className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {verificationStatus.biometricMatch === "verified"
                          ? "Biometric Match Successful"
                          : verificationStatus.biometricMatch === "processing"
                          ? "Processing Biometric Data..."
                          : verificationStatus.biometricMatch === "failed"
                          ? "Biometric Match Failed"
                          : "Awaiting Biometric Verification"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {verificationStatus.biometricMatch === "verified"
                          ? "Your photo matches your ID document"
                          : verificationStatus.biometricMatch === "processing"
                          ? "Comparing facial features..."
                          : verificationStatus.biometricMatch === "failed"
                          ? "Please retake your photo"
                          : "Complete photo capture to start verification"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      verificationStatus.biometricMatch === "verified"
                        ? "default"
                        : verificationStatus.biometricMatch === "processing"
                        ? "secondary"
                        : verificationStatus.biometricMatch === "failed"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {verificationStatus.biometricMatch === "verified"
                      ? "Verified"
                      : verificationStatus.biometricMatch === "processing"
                      ? "Processing"
                      : verificationStatus.biometricMatch === "failed"
                      ? "Failed"
                      : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Phone Number Verification
              </CardTitle>
              <CardDescription>
                Verify your phone number with SMS verification code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="phoneVerify">Phone Number</Label>
                    <Input
                      id="phoneVerify"
                      placeholder="Enter your phone number"
                      value={personalInfo.phone}
                      onChange={(e) =>
                        handlePersonalInfoChange("phone", e.target.value)
                      }
                      className="h-11"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 pt-6">
                    {verificationStatus.phoneVerified ? (
                      <Badge
                        variant="default"
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </div>
                </div>
                {!verificationStatus.phoneVerified && personalInfo.phone && (
                  <OTPVerification
                    type="phone"
                    contact={personalInfo.phone}
                    onVerified={handlePhoneVerification}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Address Verification
              </CardTitle>
              <CardDescription>
                Verify your email address to complete the verification process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="emailVerify">Email Address</Label>
                    <Input
                      id="emailVerify"
                      type="email"
                      placeholder="Enter your email address"
                      value={personalInfo.email}
                      onChange={(e) =>
                        handlePersonalInfoChange("email", e.target.value)
                      }
                      className="h-11"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 pt-6">
                    {verificationStatus.emailVerified ? (
                      <Badge
                        variant="default"
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </div>
                </div>
                {!verificationStatus.emailVerified && personalInfo.email && (
                  <OTPVerification
                    type="email"
                    contact={personalInfo.email}
                    onVerified={handleEmailVerification}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {calculateProgress() === 100 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Verification Complete
                </CardTitle>
                <CardDescription className="text-green-700">
                  Congratulations! Your identity has been successfully verified.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Personal Info</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Photo</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Biometric</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
