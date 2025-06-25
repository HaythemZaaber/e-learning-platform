"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  Briefcase,
  Users,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Building,
  BookOpen,
  Award,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  FileText,
  Star,
  Clock,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Type definitions
interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  gpa?: string;
  honors?: string;
  description: string;
  isVerified?: boolean;
  verificationStatus?: "pending" | "verified" | "failed";
}

interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location?: string;
  employmentType?: string;
  description: string;
  achievements?: string[];
  isVerified?: boolean;
  verificationStatus?: "pending" | "verified" | "failed";
}

interface Reference {
  id: number;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
  yearsKnown?: string;
  notes?: string;
  contactPermission?: boolean;
  isVerified?: boolean;
  verificationStatus?: "pending" | "verified" | "failed";
}

interface DocumentUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  verificationStatus: "pending" | "verified" | "failed";
}

interface ProfessionalBackgroundProps {
  data: {
    education: Education[];
    experience: Experience[];
    references: Reference[];
    documents?: {
      educationCertificates: DocumentUpload[];
      professionalCertifications: DocumentUpload[];
      employmentVerification: DocumentUpload[];
    };
    verificationStatus?: string;
    completionPercentage?: number;
  };
  updateData: (data: any) => void;
}

// Enhanced Document Uploader Component
const EnhancedDocumentUploader = ({
  documentType,
  onUpload,
  status,
  requirements,
  uploadedFiles = [],
}: {
  documentType: string;
  onUpload: (file: File) => void;
  status: "pending" | "verified" | "failed";
  requirements: string[];
  uploadedFiles?: DocumentUpload[];
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => onUpload(file));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-50 border-green-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supports PDF, JPG, PNG (max 10MB each)
        </p>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Choose Files
        </Button>
      </div>

      {/* Requirements */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Requirements
        </h4>
        <ul className="space-y-2">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-800">Uploaded Files</h4>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                    {file.uploadDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(file.verificationStatus)}>
                  {getStatusIcon(file.verificationStatus)}
                  <span className="ml-1 capitalize">
                    {file.verificationStatus}
                  </span>
                </Badge>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export function ProfessionalBackground({
  data,
  updateData,
}: ProfessionalBackgroundProps) {
  const [activeTab, setActiveTab] = useState("education");
  const [education, setEducation] = useState<Education[]>(data.education || []);
  const [experience, setExperience] = useState<Experience[]>(
    data.experience || []
  );
  const [references, setReferences] = useState<Reference[]>(
    data.references || []
  );
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Calculate completion percentage
  useEffect(() => {
    const totalFields = 15; // Approximate total required fields
    let completedFields = 0;

    // Count completed education fields
    education.forEach((edu) => {
      if (edu.institution) completedFields++;
      if (edu.degree) completedFields++;
      if (edu.field) completedFields++;
    });

    // Count completed experience fields
    experience.forEach((exp) => {
      if (exp.company) completedFields++;
      if (exp.position) completedFields++;
      if (exp.description) completedFields++;
    });

    // Count completed reference fields
    references.forEach((ref) => {
      if (ref.name && ref.email) completedFields++;
    });

    const percentage = Math.min((completedFields / totalFields) * 100, 100);
    setCompletionPercentage(percentage);
  }, [education, experience, references]);

  // Auto-save functionality
  useEffect(() => {
    setIsAutoSaving(true);
    const timer = setTimeout(() => {
      updateData({
        education,
        experience,
        references,
        completionPercentage,
      });
      setIsAutoSaving(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [education, experience, references, completionPercentage, updateData]);

  // Education functions
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now(),
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      description: "",
      verificationStatus: "pending",
    };
    const updatedEducation = [...education, newEducation];
    setEducation(updatedEducation);
  };

  const updateEducation = (
    id: number,
    field: keyof Education,
    value: string
  ) => {
    const updatedEducation = education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setEducation(updatedEducation);
  };

  const removeEducation = (id: number) => {
    const updatedEducation = education.filter((edu) => edu.id !== id);
    setEducation(updatedEducation);
  };

  // Experience functions
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
      verificationStatus: "pending",
    };
    const updatedExperience = [...experience, newExperience];
    setExperience(updatedExperience);
  };

  const updateExperience = (
    id: number,
    field: keyof Experience,
    value: string | boolean | string[]
  ) => {
    const updatedExperience = experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setExperience(updatedExperience);
  };

  const removeExperience = (id: number) => {
    const updatedExperience = experience.filter((exp) => exp.id !== id);
    setExperience(updatedExperience);
  };

  // Reference functions
  const addReference = () => {
    const newReference: Reference = {
      id: Date.now(),
      name: "",
      position: "",
      company: "",
      email: "",
      phone: "",
      relationship: "",
      contactPermission: false,
      verificationStatus: "pending",
    };
    const updatedReferences = [...references, newReference];
    setReferences(updatedReferences);
  };

  const updateReference = (
    id: number,
    field: keyof Reference,
    value: string | boolean
  ) => {
    const updatedReferences = references.map((ref) =>
      ref.id === id ? { ...ref, [field]: value } : ref
    );
    setReferences(updatedReferences);
  };

  const removeReference = (id: number) => {
    const updatedReferences = references.filter((ref) => ref.id !== id);
    setReferences(updatedReferences);
  };

  const getVerificationBadge = (status?: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Award className="h-7 w-7 text-blue-600" />
              Professional Background
            </h2>
            <p className="text-gray-600 mt-1">
              Build your professional profile with education, experience, and
              references
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAutoSaving && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Auto-saving...
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Profile Completion</span>
            <span className="text-blue-600 font-semibold">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-xs text-gray-500">
            Complete all sections to improve your verification score
          </p>
        </div>
      </div>

      {/* AI Verification Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>AI-Powered Verification:</strong> Our system will
          automatically verify your credentials against official databases and
          cross-reference your professional information.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="education"
            className="data-[state=active]:bg-white"
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Education
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="data-[state=active]:bg-white"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Experience
          </TabsTrigger>
          <TabsTrigger
            value="references"
            className="data-[state=active]:bg-white"
          >
            <Users className="h-4 w-4 mr-2" />
            References
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="education" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                Educational Background
              </h3>
              <p className="text-gray-600 mt-1">
                Add your degrees, diplomas, and educational qualifications
              </p>
            </div>
            <Button onClick={addEducation} className="shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>

          <div className="space-y-4">
            {education.map((edu) => (
              <Card
                key={edu.id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Education Entry
                        </h4>
                        <p className="text-sm text-gray-500">
                          Academic qualification details
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getVerificationBadge(edu.verificationStatus)}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Institution Name *
                      </Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, "institution", e.target.value)
                        }
                        placeholder="University/College name"
                        className="focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Degree/Qualification *
                      </Label>
                      <Select
                        value={edu.degree}
                        onValueChange={(value) =>
                          updateEducation(edu.id, "degree", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bachelor">
                            Bachelor's Degree
                          </SelectItem>
                          <SelectItem value="master">
                            Master's Degree
                          </SelectItem>
                          <SelectItem value="phd">PhD/Doctorate</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="certificate">
                            Certificate
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Field of Study *
                      </Label>
                      <Input
                        value={edu.field}
                        onChange={(e) =>
                          updateEducation(edu.id, "field", e.target.value)
                        }
                        placeholder="e.g., Computer Science, Mathematics"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Start Year
                        </Label>
                        <Input
                          value={edu.startYear}
                          onChange={(e) =>
                            updateEducation(edu.id, "startYear", e.target.value)
                          }
                          placeholder="2018"
                          maxLength={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          End Year
                        </Label>
                        <Input
                          value={edu.endYear}
                          onChange={(e) =>
                            updateEducation(edu.id, "endYear", e.target.value)
                          }
                          placeholder="2022"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        GPA/Grade (Optional)
                      </Label>
                      <Input
                        value={edu.gpa || ""}
                        onChange={(e) =>
                          updateEducation(edu.id, "gpa", e.target.value)
                        }
                        placeholder="3.8/4.0 or First Class"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Honors/Awards (Optional)
                      </Label>
                      <Input
                        value={edu.honors || ""}
                        onChange={(e) =>
                          updateEducation(edu.id, "honors", e.target.value)
                        }
                        placeholder="Magna Cum Laude, Dean's List"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Description (Optional)
                      </Label>
                      <Textarea
                        value={edu.description}
                        onChange={(e) =>
                          updateEducation(edu.id, "description", e.target.value)
                        }
                        placeholder="Relevant coursework, thesis topic, achievements..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {education.length === 0 && (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="p-4 bg-blue-50 rounded-full w-fit mx-auto mb-4">
                    <GraduationCap className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Education Entries
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start building your academic profile by adding your
                    educational background
                  </p>
                  <Button onClick={addEducation} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Education Entry
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                <Briefcase className="h-6 w-6 text-green-600" />
                Professional Experience
              </h3>
              <p className="text-gray-600 mt-1">
                Add your work history and professional achievements
              </p>
            </div>
            <Button onClick={addExperience} className="shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>

          <div className="space-y-4">
            {experience.map((exp) => (
              <Card
                key={exp.id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Building className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Work Experience
                        </h4>
                        <p className="text-sm text-gray-500">
                          Professional role details
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getVerificationBadge(exp.verificationStatus)}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Company Name *
                      </Label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, "company", e.target.value)
                        }
                        placeholder="Company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Position/Title *
                      </Label>
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(exp.id, "position", e.target.value)
                        }
                        placeholder="Job title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Employment Type
                      </Label>
                      <Select
                        value={exp.employmentType || ""}
                        onValueChange={(value) =>
                          updateExperience(exp.id, "employmentType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Location
                      </Label>
                      <Input
                        value={exp.location || ""}
                        onChange={(e) =>
                          updateExperience(exp.id, "location", e.target.value)
                        }
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Start Date *
                      </Label>
                      <Input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "startDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        End Date
                      </Label>
                      <Input
                        type="date"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "endDate", e.target.value)
                        }
                        disabled={exp.current}
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) =>
                          updateExperience(exp.id, "current", e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor={`current-${exp.id}`} className="text-sm">
                        I currently work here
                      </Label>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Job Description *
                      </Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(
                            exp.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe your key responsibilities, projects, and impact..."
                        rows={4}
                        className="resize-none" // Missing part 1: Complete the Experience TabsContent (after the description textarea)
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {experience.length === 0 && (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="p-4 bg-green-50 rounded-full w-fit mx-auto mb-4">
                    <Briefcase className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Work Experience
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start building your professional profile by adding your work
                    history
                  </p>
                  <Button onClick={addExperience} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Work Experience
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="references" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                <Users className="h-6 w-6 text-purple-600" />
                Professional References
              </h3>
              <p className="text-gray-600 mt-1">
                Add 2-3 professional references who can vouch for your work
              </p>
            </div>
            <Button onClick={addReference} className="shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Reference
            </Button>
          </div>

          <div className="space-y-4">
            {references.map((ref) => (
              <Card
                key={ref.id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Professional Reference
                        </h4>
                        <p className="text-sm text-gray-500">
                          Contact information and relationship
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getVerificationBadge(ref.verificationStatus)}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeReference(ref.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        value={ref.name}
                        onChange={(e) =>
                          updateReference(ref.id, "name", e.target.value)
                        }
                        placeholder="Reference's full name"
                        className="focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Position/Title *
                      </Label>
                      <Input
                        value={ref.position}
                        onChange={(e) =>
                          updateReference(ref.id, "position", e.target.value)
                        }
                        placeholder="Their job title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Company/Organization *
                      </Label>
                      <Input
                        value={ref.company}
                        onChange={(e) =>
                          updateReference(ref.id, "company", e.target.value)
                        }
                        placeholder="Company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Relationship *
                      </Label>
                      <Select
                        value={ref.relationship}
                        onValueChange={(value) =>
                          updateReference(ref.id, "relationship", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct-supervisor">
                            Direct Supervisor
                          </SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="colleague">Colleague</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="mentor">Mentor</SelectItem>
                          <SelectItem value="hr-representative">
                            HR Representative
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address *
                      </Label>
                      <Input
                        type="email"
                        value={ref.email}
                        onChange={(e) =>
                          updateReference(ref.id, "email", e.target.value)
                        }
                        placeholder="reference@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        value={ref.phone}
                        onChange={(e) =>
                          updateReference(ref.id, "phone", e.target.value)
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Years Known
                      </Label>
                      <Input
                        value={ref.yearsKnown || ""}
                        onChange={(e) =>
                          updateReference(ref.id, "yearsKnown", e.target.value)
                        }
                        placeholder="e.g., 3 years"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Contact Permission
                      </Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          type="checkbox"
                          id={`permission-${ref.id}`}
                          checked={ref.contactPermission || false}
                          onChange={(e) =>
                            updateReference(
                              ref.id,
                              "contactPermission",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <Label
                          htmlFor={`permission-${ref.id}`}
                          className="text-sm"
                        >
                          Permission granted to contact this reference
                        </Label>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        value={ref.notes || ""}
                        onChange={(e) =>
                          updateReference(ref.id, "notes", e.target.value)
                        }
                        placeholder="Any additional information about this reference..."
                        rows={2}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {references.length === 0 && (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="p-4 bg-purple-50 rounded-full w-fit mx-auto mb-4">
                    <Users className="h-12 w-12 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No References Added
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Professional references help verify your experience and
                    character
                  </p>
                  <Button onClick={addReference} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Reference
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Educational Certificates
                </CardTitle>
                <CardDescription>
                  Upload your degree certificates, diplomas, and transcripts for
                  verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedDocumentUploader
                  documentType="educationCertificates"
                  onUpload={(file) => {
                    console.log("Education cert uploaded:", file);
                    // Handle file upload logic here
                  }}
                  status="pending"
                  requirements={[
                    "Upload clear photos or scans of your certificates",
                    "All text must be legible and unobstructed",
                    "Include official transcripts if available",
                    "Certificates must be from accredited institutions",
                    "Ensure documents show official seals or signatures",
                  ]}
                  uploadedFiles={data.documents?.educationCertificates || []}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Professional Certifications
                </CardTitle>
                <CardDescription>
                  Upload any professional certifications, licenses, or
                  specialized training certificates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedDocumentUploader
                  documentType="professionalCertifications"
                  onUpload={(file) => {
                    console.log("Professional cert uploaded:", file);
                    // Handle file upload logic here
                  }}
                  status="pending"
                  requirements={[
                    "Include industry-specific certifications",
                    "Teaching certifications and licenses",
                    "Professional association memberships",
                    "Continuing education certificates",
                    "Technical or software certifications",
                  ]}
                  uploadedFiles={
                    data.documents?.professionalCertifications || []
                  }
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Building className="h-5 w-5 text-green-600" />
                  Employment Verification
                </CardTitle>
                <CardDescription>
                  Upload employment letters, contracts, or other work
                  verification documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedDocumentUploader
                  documentType="employmentVerification"
                  onUpload={(file) => {
                    console.log("Employment verification uploaded:", file);
                    // Handle file upload logic here
                  }}
                  status="pending"
                  requirements={[
                    "Employment verification letters from HR",
                    "Work contracts or official offer letters",
                    "Recent pay stubs or salary certificates",
                    "Performance reviews or evaluations",
                    "LinkedIn profile screenshot or professional portfolio",
                  ]}
                  uploadedFiles={data.documents?.employmentVerification || []}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Section */}
      {showPreview && (
        <Card className="mt-8 border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Eye className="h-5 w-5" />
              Professional Background Preview
            </CardTitle>
            <CardDescription className="text-blue-700">
              This is how your professional background will appear to
              verification reviewers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Education Preview */}
            {education.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  Education
                </h4>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="bg-white p-4 rounded-lg border"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {edu.institution}
                          </p>
                          <p className="text-sm text-gray-500">
                            {edu.startYear} - {edu.endYear}
                          </p>
                          {edu.gpa && (
                            <p className="text-sm text-gray-500">
                              GPA: {edu.gpa}
                            </p>
                          )}
                          {edu.honors && (
                            <p className="text-sm text-gray-500">
                              {edu.honors}
                            </p>
                          )}
                        </div>
                        {getVerificationBadge(edu.verificationStatus)}
                      </div>
                      {edu.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Preview */}
            {experience.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  Experience
                </h4>
                <div className="space-y-3">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-white p-4 rounded-lg border"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {exp.position}
                          </h5>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">
                            {exp.startDate} -{" "}
                            {exp.current ? "Present" : exp.endDate}
                          </p>
                          {exp.location && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {exp.location}
                            </p>
                          )}
                        </div>
                        {getVerificationBadge(exp.verificationStatus)}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* References Preview */}
            {references.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  References
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {references.map((ref) => (
                    <div
                      key={ref.id}
                      className="bg-white p-4 rounded-lg border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900">
                          {ref.name}
                        </h5>
                        {getVerificationBadge(ref.verificationStatus)}
                      </div>
                      <p className="text-sm text-gray-600">{ref.position}</p>
                      <p className="text-sm text-gray-600">{ref.company}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {ref.relationship}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {ref.email}
                        </span>
                        {ref.phone && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {ref.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
