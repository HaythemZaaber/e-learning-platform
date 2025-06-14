"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileVideo,
  Upload,
  X,
  Play,
  FileText,
  AlertCircle,
  Download,
  Eye,
  Plus,
  HelpCircle,
  Video,
  BookOpen,
  FileCheck,
  Edit3,
  Clipboard,
  Link2,
  Save,
  Type,
  Calendar,
  Clock,
} from "lucide-react";
import { CourseData } from "../../types";

interface ContentUploadProps {
  data: CourseData;
  updateData: (data: any) => void;
}

export function ContentUpload({ data, updateData }: ContentUploadProps) {
  const [activeTab, setActiveTab] = useState("videos");
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any[]>>({
    videos: [],
    documents: [],
    quizzes: [],
    text: [],
    assignments: [],
    resources: [],
  });
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedLecture, setSelectedLecture] = useState("");
  const [dragStates, setDragStates] = useState<Record<string, boolean>>({});

  // Text content editor states
  const [textContent, setTextContent] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [textDescription, setTextDescription] = useState("");

  // Assignment states
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentInstructions, setAssignmentInstructions] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentPoints, setAssignmentPoints] = useState("");

  // Resource states
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceType, setResourceType] = useState("link");

  const handleFileUpload = (file: File, type: string) => {
    // Validate file
    const maxSizes = {
      videos: 500 * 1024 * 1024, // 500MB
      documents: 50 * 1024 * 1024, // 50MB
      resources: 10 * 1024 * 1024, // 10MB
    };

    const allowedTypes = {
      videos: ["video/mp4", "video/webm", "video/mov"],
      documents: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ],
      resources: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/zip",
        "text/plain",
      ],
    };

    if (file.size > maxSizes[type as keyof typeof maxSizes]) {
      alert(
        `File too large. Maximum size for ${type} is ${Math.round(
          maxSizes[type as keyof typeof maxSizes] / (1024 * 1024)
        )}MB`
      );
      return;
    }

    if (!allowedTypes[type as keyof typeof allowedTypes].includes(file.type)) {
      alert(`Invalid file type for ${type}`);
      return;
    }

    // Simulate file upload with progress
    const fileId = `${type}-${Date.now()}`;

    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
    setUploadStatus((prev) => ({ ...prev, [fileId]: "uploading" }));

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = Math.min((prev[fileId] || 0) + 10, 100);

        if (newProgress === 100) {
          clearInterval(interval);
          setUploadStatus((prev) => ({ ...prev, [fileId]: "complete" }));

          // Add the file to the uploaded files
          setUploadedFiles((prev) => ({
            ...prev,
            [type]: [
              ...prev[type],
              {
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                section: selectedSection,
                lecture: selectedLecture,
                uploadedAt: new Date(),
              },
            ],
          }));
        }

        return { ...prev, [fileId]: newProgress };
      });
    }, 300);
  };

  const handleCreateTextContent = () => {
    if (!textTitle.trim() || !textContent.trim()) {
      alert("Please provide both title and content");
      return;
    }

    const textId = `text-${Date.now()}`;
    setUploadedFiles((prev) => ({
      ...prev,
      text: [
        ...prev.text,
        {
          id: textId,
          title: textTitle,
          content: textContent,
          description: textDescription,
          section: selectedSection,
          lecture: selectedLecture,
          createdAt: new Date(),
          type: "text",
        },
      ],
    }));

    // Reset form
    setTextTitle("");
    setTextContent("");
    setTextDescription("");
  };

  const handleCreateAssignment = () => {
    if (!assignmentTitle.trim() || !assignmentDescription.trim()) {
      alert("Please provide title and description");
      return;
    }

    const assignmentId = `assignment-${Date.now()}`;
    setUploadedFiles((prev) => ({
      ...prev,
      assignments: [
        ...prev.assignments,
        {
          id: assignmentId,
          title: assignmentTitle,
          description: assignmentDescription,
          instructions: assignmentInstructions,
          dueDate: assignmentDueDate,
          points: assignmentPoints ? parseInt(assignmentPoints) : null,
          section: selectedSection,
          lecture: selectedLecture,
          createdAt: new Date(),
          type: "assignment",
        },
      ],
    }));

    // Reset form
    setAssignmentTitle("");
    setAssignmentDescription("");
    setAssignmentInstructions("");
    setAssignmentDueDate("");
    setAssignmentPoints("");
  };

  const handleCreateResource = () => {
    if (resourceType === "link" && !resourceUrl.trim()) {
      alert("Please provide a valid URL");
      return;
    }
    if (!resourceTitle.trim()) {
      alert("Please provide a title for the resource");
      return;
    }

    const resourceId = `resource-${Date.now()}`;
    setUploadedFiles((prev) => ({
      ...prev,
      resources: [
        ...prev.resources,
        {
          id: resourceId,
          title: resourceTitle,
          description: resourceDescription,
          url: resourceUrl,
          resourceType: resourceType,
          section: selectedSection,
          lecture: selectedLecture,
          createdAt: new Date(),
          type: "resource",
        },
      ],
    }));

    // Reset form
    setResourceTitle("");
    setResourceDescription("");
    setResourceUrl("");
    setResourceType("link");
  };

  const handleRemoveFile = (fileId: string, type: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((file) => file.id !== fileId),
    }));

    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });

    setUploadStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[fileId];
      return newStatus;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleDragOver = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragStates((prev) => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragStates((prev) => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragStates((prev) => ({ ...prev, [type]: false }));

    const files = e.dataTransfer.files;
    if (files.length && (!selectedSection || !selectedLecture)) {
      alert("Please select a section and lecture first");
      return;
    }

    if (files.length) {
      handleFileUpload(files[0], type);
    }
  };

  const tabs = [
    {
      id: "videos",
      label: "Videos",
      icon: Video,
      count: uploadedFiles.videos.length,
    },
    {
      id: "text",
      label: "Text Content",
      icon: Type,
      count: uploadedFiles.text.length,
    },
    {
      id: "documents",
      label: "Documents",
      icon: BookOpen,
      count: uploadedFiles.documents.length,
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: Clipboard,
      count: uploadedFiles.assignments.length,
    },
    {
      id: "resources",
      label: "Resources",
      icon: Link2,
      count: uploadedFiles.resources.length,
    },
    {
      id: "quizzes",
      label: "Quizzes",
      icon: FileCheck,
      count: uploadedFiles.quizzes.length,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Upload</h2>
          <p className="text-gray-600 mt-1">
            Create and upload all types of course content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Need help?</span>
        </div>
      </div>

      {/* Content Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Target Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section *
            </label>
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setSelectedLecture(""); // Reset lecture when section changes
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select a section</option>
              {data.sections?.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture *
            </label>
            <select
              value={selectedLecture}
              onChange={(e) => setSelectedLecture(e.target.value)}
              disabled={!selectedSection}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a lecture</option>
              {data.sections
                ?.find((s) => s.id === selectedSection)
                ?.lectures?.map((lecture) => (
                  <option key={lecture.id} value={lecture.id}>
                    {lecture.title}
                  </option>
                ))}
            </select>
          </div>
        </div>
        {(!selectedSection || !selectedLecture) && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Selection Required
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Please select both a section and lecture before creating
                content.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-8">
          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div className="space-y-8">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  dragStates.videos
                    ? "border-blue-500 bg-blue-50"
                    : selectedSection && selectedLecture
                    ? "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                    : "border-gray-200 bg-gray-50"
                } ${
                  !selectedSection || !selectedLecture
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onDragOver={(e) => handleDragOver(e, "videos")}
                onDragLeave={(e) => handleDragLeave(e, "videos")}
                onDrop={(e) => handleDrop(e, "videos")}
                onClick={() => {
                  if (selectedSection && selectedLecture) {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "video/mp4,video/webm,video/mov";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, "videos");
                    };
                    input.click();
                  }
                }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full p-4 mb-4 ${
                      dragStates.videos ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <Upload
                      className={`h-8 w-8 ${
                        dragStates.videos ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Video Content
                  </h3>
                  <p className="text-gray-600 mb-4 max-w-md">
                    Drag and drop your video files here, or click to browse.
                    Support for MP4, WebM, and MOV formats.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Maximum size: 500MB</span>
                    <span>•</span>
                    <span>Formats: MP4, WebM, MOV</span>
                  </div>
                  {selectedSection && selectedLecture && (
                    <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Browse Files
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {Object.entries(uploadProgress)
                .filter(
                  ([key]) =>
                    key.startsWith("videos-") && uploadProgress[key] < 100
                )
                .map(([fileId, progress]) => (
                  <div
                    key={fileId}
                    className="bg-white border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileVideo className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {fileId.replace("videos-", "Uploading video...")}
                        </p>
                        <div className="mt-2">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {progress}% complete
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(fileId, "videos")}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

              {/* Uploaded Videos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Uploaded Videos ({uploadedFiles.videos.length})
                </h3>
                {uploadedFiles.videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {uploadedFiles.videos.map((file) => (
                      <div
                        key={file.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative">
                          <video
                            src={file.url}
                            className="w-full h-48 object-cover"
                            poster=""
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                              <Play className="h-6 w-6 text-gray-900" />
                            </button>
                          </div>
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={() =>
                                handleRemoveFile(file.id, "videos")
                              }
                              className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 truncate mb-1">
                            {file.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-3">
                            {formatFileSize(file.size)} •{" "}
                            {file.uploadedAt.toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">
                              Upload complete
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                    <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No videos uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Start by uploading your first video lecture
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Text Content Tab */}
          {activeTab === "text" && (
            <div className="space-y-8">
              {/* Text Content Creator */}
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Type className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Create Text Lecture
                    </h3>
                    <p className="text-gray-600">
                      Write rich text content for your course
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={textTitle}
                      onChange={(e) => setTextTitle(e.target.value)}
                      placeholder="Enter the title for this text content"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={textDescription}
                      onChange={(e) => setTextDescription(e.target.value)}
                      placeholder="Brief description of the content"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Write your lecture content here..."
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    onClick={handleCreateTextContent}
                    disabled={
                      !selectedSection ||
                      !selectedLecture ||
                      !textTitle.trim() ||
                      !textContent.trim()
                    }
                    className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    Create Text Content
                  </button>
                </div>
              </div>

              {/* Created Text Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Text Content ({uploadedFiles.text.length})
                </h3>
                {uploadedFiles.text.length > 0 ? (
                  <div className="space-y-4">
                    {uploadedFiles.text.map((content) => (
                      <div
                        key={content.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-orange-100 rounded-lg">
                            <Type className="h-6 w-6 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {content.title}
                            </h4>
                            {content.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {content.description}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                              {content.content.substring(0, 150)}...
                            </p>
                            <p className="text-sm text-gray-500">
                              Created {content.createdAt.toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">
                                Ready to publish
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit3 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveFile(content.id, "text")
                              }
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                    <Type className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No text content created yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Create your first text-based lecture
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-8">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  dragStates.documents
                    ? "border-green-500 bg-green-50"
                    : selectedSection && selectedLecture
                    ? "border-gray-300 hover:border-green-400 hover:bg-green-50/50"
                    : "border-gray-200 bg-gray-50"
                } ${
                  !selectedSection || !selectedLecture
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onDragOver={(e) => handleDragOver(e, "documents")}
                onDragLeave={(e) => handleDragLeave(e, "documents")}
                onDrop={(e) => handleDrop(e, "documents")}
                onClick={() => {
                  if (selectedSection && selectedLecture) {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".pdf,.docx,.ppt,.pptx";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, "documents");
                    };
                    input.click();
                  }
                }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full p-4 mb-4 ${
                      dragStates.documents ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <FileText
                      className={`h-8 w-8 ${
                        dragStates.documents
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Documents & Resources
                  </h3>
                  <p className="text-gray-600 mb-4 max-w-md">
                    Add supplementary materials like PDFs, presentations, and
                    documents to support your course content.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Maximum size: 50MB</span>
                    <span>•</span>
                    <span>Formats: PDF, DOCX, PPT</span>
                  </div>
                  {selectedSection && selectedLecture && (
                    <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Browse Files
                    </button>
                  )}
                </div>
              </div>

              {/* Uploaded Documents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Uploaded Documents ({uploadedFiles.documents.length})
                </h3>
                {uploadedFiles.documents.length > 0 ? (
                  <div className="space-y-4">
                    {uploadedFiles.documents.map((file) => (
                      <div
                        key={file.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <FileText className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {file.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatFileSize(file.size)} • Uploaded{" "}
                              {file.uploadedAt.toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">
                                Ready to use
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Download className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveFile(file.id, "documents")
                              }
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No documents uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add supporting materials and resources for your students
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && (
            <div className="space-y-8">
              {/* Assignment Creator */}
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clipboard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Create Assignment
                    </h3>
                    <p className="text-gray-600">
                      Design assignments and tasks for your students
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Title *
                    </label>
                    <input
                      type="text"
                      value={assignmentTitle}
                      onChange={(e) => setAssignmentTitle(e.target.value)}
                      placeholder="Enter assignment title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={assignmentDescription}
                      onChange={(e) => setAssignmentDescription(e.target.value)}
                      placeholder="Describe what students need to do"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Instructions
                    </label>
                    <textarea
                      value={assignmentInstructions}
                      onChange={(e) =>
                        setAssignmentInstructions(e.target.value)
                      }
                      placeholder="Provide step-by-step instructions"
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          value={assignmentDueDate}
                          onChange={(e) => setAssignmentDueDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points
                      </label>
                      <input
                        type="number"
                        value={assignmentPoints}
                        onChange={(e) => setAssignmentPoints(e.target.value)}
                        placeholder="Total points"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCreateAssignment}
                    disabled={
                      !selectedSection ||
                      !selectedLecture ||
                      !assignmentTitle.trim() ||
                      !assignmentDescription.trim()
                    }
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    Create Assignment
                  </button>
                </div>
              </div>

              {/* Created Assignments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Assignments ({uploadedFiles.assignments.length})
                </h3>
                {uploadedFiles.assignments.length > 0 ? (
                  <div className="space-y-4">
                    {uploadedFiles.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <Clipboard className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {assignment.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                              {assignment.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              {assignment.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Due:{" "}
                                  {new Date(
                                    assignment.dueDate
                                  ).toLocaleDateString()}
                                </div>
                              )}
                              {assignment.points && (
                                <div className="flex items-center gap-1">
                                  <span>{assignment.points} points</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Created{" "}
                              {assignment.createdAt.toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">
                                Ready to assign
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit3 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveFile(assignment.id, "assignments")
                              }
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                    <Clipboard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No assignments created yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Create your first assignment for students
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div className="space-y-8">
              {/* Resource Creator */}
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <Link2 className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Add Resource
                    </h3>
                    <p className="text-gray-600">
                      Share external links, tools, or upload resource files
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resource Type
                    </label>
                    <select
                      value={resourceType}
                      onChange={(e) => setResourceType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    >
                      <option value="link">External Link</option>
                      <option value="file">File Upload</option>
                      <option value="tool">Online Tool</option>
                      <option value="article">Article/Blog</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={resourceTitle}
                      onChange={(e) => setResourceTitle(e.target.value)}
                      placeholder="Enter resource title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={resourceDescription}
                      onChange={(e) => setResourceDescription(e.target.value)}
                      placeholder="Describe what this resource is about"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>

                  {resourceType === "link" ||
                  resourceType === "tool" ||
                  resourceType === "article" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL *
                      </label>
                      <input
                        type="url"
                        value={resourceUrl}
                        onChange={(e) => setResourceUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                        dragStates.resources
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-300 hover:border-teal-400"
                      } cursor-pointer`}
                      onDragOver={(e) => handleDragOver(e, "resources")}
                      onDragLeave={(e) => handleDragLeave(e, "resources")}
                      onDrop={(e) => handleDrop(e, "resources")}
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".pdf,.jpg,.jpeg,.png,.gif,.zip,.txt";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) handleFileUpload(file, "resources");
                        };
                        input.click();
                      }}
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Upload resource file (PDF, Images, ZIP, etc.)
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleCreateResource}
                    disabled={
                      !selectedSection ||
                      !selectedLecture ||
                      !resourceTitle.trim() ||
                      (resourceType !== "file" && !resourceUrl.trim())
                    }
                    className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    Add Resource
                  </button>
                </div>
              </div>

              {/* Created Resources */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resources ({uploadedFiles.resources.length})
                </h3>
                {uploadedFiles.resources.length > 0 ? (
                  <div className="space-y-4">
                    {uploadedFiles.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-teal-100 rounded-lg">
                            <Link2 className="h-6 w-6 text-teal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-teal-600 mb-2 capitalize">
                              {resource.resourceType}
                            </p>
                            {resource.description && (
                              <p className="text-sm text-gray-600 mb-3">
                                {resource.description}
                              </p>
                            )}
                            {resource.url && (
                              <p className="text-sm text-gray-500 mb-3 break-all">
                                {resource.url}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">
                              Added{" "}
                              {resource.createdAt?.toLocaleDateString() ||
                                "Recently"}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">
                                Available to students
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Eye className="h-5 w-5" />
                              </a>
                            )}
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit3 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveFile(resource.id, "resources")
                              }
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                    <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No resources added yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Share helpful links and resources with your students
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === "quizzes" && (
            <div className="text-center py-16">
              <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FileCheck className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quiz Builder Coming Soon
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create interactive quizzes and assessments to test your
                students' knowledge and track their progress.
              </p>
              <button
                disabled
                className="px-6 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
              >
                <Plus className="h-5 w-5 inline mr-2" />
                Create Quiz
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Statistics */}
      {(uploadedFiles.videos.length > 0 ||
        uploadedFiles.documents.length > 0 ||
        uploadedFiles.text.length > 0 ||
        uploadedFiles.assignments.length > 0 ||
        uploadedFiles.resources.length > 0) && (
        <div className="bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Content Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {uploadedFiles.videos.length}
              </div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {uploadedFiles.text.length}
              </div>
              <div className="text-sm text-gray-600">Text</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {uploadedFiles.documents.length}
              </div>
              <div className="text-sm text-gray-600">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {uploadedFiles.assignments.length}
              </div>
              <div className="text-sm text-gray-600">Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">
                {uploadedFiles.resources.length}
              </div>
              <div className="text-sm text-gray-600">Resources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {uploadedFiles.quizzes.length}
              </div>
              <div className="text-sm text-gray-600">Quizzes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
