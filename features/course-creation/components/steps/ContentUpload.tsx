"use client";

import { useState, useCallback, useEffect } from "react";
import {
  CheckCircle2,
  FileVideo,
  Upload,
  X,
  Play,
  FileText,
  AlertCircle,
  AlertTriangle,
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
  Loader2,
  Trash2,
  FileAudio,
  FileArchive,
  FileImage,
  Users,
  Layers,
  RefreshCw,
  Info,
} from "lucide-react";
import { CourseData } from "../../types";
import { useCourseCreationStore } from "../../../../stores/courseCreation.store";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useCourseCreationWithGraphQL } from "../../hooks/useCourseCreationWithGraphQL";

interface ContentUploadProps {
  data: CourseData;
  updateData: (data: Partial<CourseData>) => void;
}

export function ContentUpload({ data, updateData }: ContentUploadProps) {
  const [activeTab, setActiveTab] = useState("");
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
  
  // UI states
  const [deletingContent, setDeletingContent] = useState<Record<string, boolean>>({});
  const [previewFile, setPreviewFile] = useState<{ file: any; type: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    contentId: string;
    type: string;
    title: string;
  } | null>(null);

  const {
    uploadProgress,
    contentByLecture,
    isUploading,
    setUploadProgress,
    removeUpload,
    uploadFile,
    createTextContent,
    createAssignment,
    createResource,
    createQuiz,
    addGlobalError,
    getContentForLecture,
    getLectureContentCounts,
    removeContentFromLecture,
    deleteContentFromLecture,
  } = useCourseCreationStore();

  const { getToken } = useAuth();
  const { isServiceInitialized } = useCourseCreationWithGraphQL();

  // Get content for selected lecture
  const selectedLectureContent = selectedLecture ? getContentForLecture(selectedLecture) : null;
  const contentCounts = selectedLecture ? getLectureContentCounts(selectedLecture) : {};

  // Find selected section and lecture objects
  const selectedSectionObj = data.sections?.find((s) => s.id === selectedSection);
  const selectedLectureObj = selectedSectionObj?.lectures?.find((l) => l.id === selectedLecture);

  // Auto-select section and lecture if only one exists
  useEffect(() => {
    if (data.sections?.length === 1 && !selectedSection) {
      setSelectedSection(data.sections[0].id);
    }
    
    if (selectedSectionObj?.lectures?.length === 1 && !selectedLecture) {
      setSelectedLecture(selectedSectionObj.lectures[0].id);
    }
  }, [data.sections, selectedSectionObj, selectedSection, selectedLecture]);

  const handleFileUpload = useCallback(
    async (file: File, type: string) => {
      // Validate file
      const maxSizes = {
        videos: 500 * 1024 * 1024, // 500MB
        documents: 50 * 1024 * 1024, // 50MB
        images: 10 * 1024 * 1024, // 10MB
        audio: 100 * 1024 * 1024, // 100MB
        archives: 100 * 1024 * 1024, // 100MB
      };

      const allowedTypes = {
        videos: ["video/mp4", "video/webm", "video/mov", "video/avi"],
        documents: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ],
        images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        audio: ["audio/mp3", "audio/wav", "audio/ogg"],
        archives: ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed"],
      };

      if (file.size > maxSizes[type as keyof typeof maxSizes]) {
        toast.error(
          `File too large. Maximum size for ${type} is ${Math.round(
            maxSizes[type as keyof typeof maxSizes] / (1024 * 1024)
          )}MB`
        );
        return;
      }

      if (!allowedTypes[type as keyof typeof allowedTypes].includes(file.type)) {
        toast.error(`Invalid file type for ${type}`);
        return;
      }

      if (!selectedSection || !selectedLecture) {
        toast.error("Please select a section and lecture first");
        return;
      }

      // Check if content already exists for this lecture type
      const existingContent = selectedLectureContent?.[type] || [];
      if (existingContent.length > 0) {
        const shouldReplace = window.confirm(
          `This lecture already has ${type} content. Do you want to replace it with the new file?`
        );
        
        if (!shouldReplace) {
          return;
        }
        
        // Delete existing content first
        try {
          const authToken = await getToken({ template: "expiration" });
          await deleteContentFromLecture(selectedLecture, type, existingContent[0].id, authToken || undefined);
        } catch (error) {
          console.error("Failed to delete existing content:", error);
          toast.error("Failed to replace existing content");
          return;
        }
      }

      try {
        const authToken = await getToken({ template: "expiration" });
        await uploadFile(file, type, {
          title: file.name.replace(/\.[^/.]+$/, ""),
          description: `Uploaded ${type.slice(0, -1)} file`,
          sectionId: selectedSection,
          lectureId: selectedLecture,
        }, authToken || undefined);
        
        toast.success("File uploaded successfully!");
      } catch (error) {
        console.error("Failed to upload file:", error);
        toast.error("Failed to upload file");
      }
    },
    [selectedSection, selectedLecture, uploadFile, getToken, selectedLectureContent, deleteContentFromLecture]
  );

  const handleCreateTextContent = useCallback(async () => {
    if (!textTitle.trim() || !textContent.trim()) {
      toast.error("Please provide both title and content");
      return;
    }

    if (!selectedSection || !selectedLecture) {
      toast.error("Please select a section and lecture first");
      return;
    }

    // Check if content already exists
    const existingTextContent = selectedLectureContent?.text || [];
    if (existingTextContent.length > 0) {
      const shouldReplace = window.confirm(
        "This lecture already has text content. Do you want to replace it?"
      );
      
      if (!shouldReplace) {
        return;
      }
      
      // Delete existing content first
      try {
        const authToken = await getToken({ template: "expiration" });
        await deleteContentFromLecture(selectedLecture, "text", existingTextContent[0].id, authToken || undefined);
      } catch (error) {
        console.error("Failed to delete existing content:", error);
        toast.error("Failed to replace existing content");
        return;
      }
    }

    createTextContent({
      title: textTitle,
      content: textContent,
      description: textDescription,
      sectionId: selectedSection,
      lectureId: selectedLecture,
    });

    // Reset form
    setTextTitle("");
    setTextContent("");
    setTextDescription("");

    toast.success("Text content created successfully");
  }, [textTitle, textContent, textDescription, selectedSection, selectedLecture, createTextContent, selectedLectureContent, deleteContentFromLecture, getToken]);

  const handleCreateAssignment = useCallback(async () => {
    if (!assignmentTitle.trim() || !assignmentDescription.trim()) {
      toast.error("Please provide title and description");
      return;
    }

    if (!selectedSection || !selectedLecture) {
      toast.error("Please select a section and lecture first");
      return;
    }

    // Check if content already exists
    const existingAssignment = selectedLectureContent?.assignments || [];
    if (existingAssignment.length > 0) {
      const shouldReplace = window.confirm(
        "This lecture already has an assignment. Do you want to replace it?"
      );
      
      if (!shouldReplace) {
        return;
      }
      
      // Delete existing content first
      try {
        const authToken = await getToken({ template: "expiration" });
        await deleteContentFromLecture(selectedLecture, "assignments", existingAssignment[0].id, authToken || undefined);
      } catch (error) {
        console.error("Failed to delete existing content:", error);
        toast.error("Failed to replace existing content");
        return;
      }
    }

    createAssignment({
      title: assignmentTitle,
      description: assignmentDescription,
      instructions: assignmentInstructions,
      dueDate: assignmentDueDate,
      points: assignmentPoints ? parseInt(assignmentPoints) : undefined,
      sectionId: selectedSection,
      lectureId: selectedLecture,
    });

    // Reset form
    setAssignmentTitle("");
    setAssignmentDescription("");
    setAssignmentInstructions("");
    setAssignmentDueDate("");
    setAssignmentPoints("");

    toast.success("Assignment created successfully");
  }, [
    assignmentTitle,
    assignmentDescription,
    assignmentInstructions,
    assignmentDueDate,
    assignmentPoints,
    selectedSection,
    selectedLecture,
    createAssignment,
    selectedLectureContent,
    deleteContentFromLecture,
    getToken,
  ]);

  const handleCreateResource = useCallback(async () => {
    if (resourceType === "link" && !resourceUrl.trim()) {
      toast.error("Please provide a valid URL");
      return;
    }
    if (!resourceTitle.trim()) {
      toast.error("Please provide a title for the resource");
      return;
    }

    if (!selectedSection || !selectedLecture) {
      toast.error("Please select a section and lecture first");
      return;
    }

    // Check if content already exists
    const existingResource = selectedLectureContent?.resources || [];
    if (existingResource.length > 0) {
      const shouldReplace = window.confirm(
        "This lecture already has a resource. Do you want to replace it?"
      );
      
      if (!shouldReplace) {
        return;
      }
      
      // Delete existing content first
      try {
        const authToken = await getToken({ template: "expiration" });
        await deleteContentFromLecture(selectedLecture, "resources", existingResource[0].id, authToken || undefined);
      } catch (error) {
        console.error("Failed to delete existing content:", error);
        toast.error("Failed to replace existing content");
        return;
      }
    }

    createResource({
      title: resourceTitle,
      description: resourceDescription,
      url: resourceUrl,
      resourceType: resourceType,
      sectionId: selectedSection,
      lectureId: selectedLecture,
    });

    // Reset form
    setResourceTitle("");
    setResourceDescription("");
    setResourceUrl("");
    setResourceType("link");

    toast.success("Resource created successfully");
  }, [
    resourceType,
    resourceUrl,
    resourceTitle,
    resourceDescription,
    selectedSection,
    selectedLecture,
    createResource,
    selectedLectureContent,
    deleteContentFromLecture,
    getToken,
  ]);

  const handleRemoveContent = useCallback(
    async (contentId: string, type: string, title: string) => {
      if (!selectedLecture) return;
      
      // Check if service is initialized
      if (!isServiceInitialized) {
        toast.error("Service is not ready. Please wait a moment and try again.");
        return;
      }
      
      // Show confirmation dialog
      setShowDeleteConfirm({ contentId, type, title });
    },
    [selectedLecture, isServiceInitialized]
  );

  const confirmDeleteContent = useCallback(
    async () => {
      if (!showDeleteConfirm || !selectedLecture) return;
      
      const { contentId, type } = showDeleteConfirm;
      const deleteKey = `${type}-${contentId}`;
      
      setDeletingContent(prev => ({ ...prev, [deleteKey]: true }));
      
      try {
        const authToken = await getToken({ template: "expiration" });
        await deleteContentFromLecture(selectedLecture, type, contentId, authToken || undefined);
        toast.success("Content deleted successfully");
        setShowDeleteConfirm(null);
      } catch (error) {
        console.error("Failed to delete content:", error);
        toast.error("Failed to delete content. Please try again.");
      } finally {
        setDeletingContent(prev => ({ ...prev, [deleteKey]: false }));
      }
    },
    [showDeleteConfirm, selectedLecture, deleteContentFromLecture, getToken]
  );

  const handlePreviewFile = useCallback((file: any, type: string) => {
    setPreviewFile({ file, type });
  }, []);

  const closePreview = useCallback(() => {
    setPreviewFile(null);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
      toast.error("Please select a section and lecture first");
      return;
    }

    if (files.length) {
      Array.from(files).forEach((file) => {
        handleFileUpload(file, type);
      });
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'videos':
        return Video;
      case 'documents':
        return FileText;
      case 'images':
        return FileImage;
      case 'audio':
        return FileAudio;
      case 'archives':
        return FileArchive;
      default:
        return FileText;
    }
  };

  const tabs = [
    {
      id: "video",
      label: "Videos",
      icon: Video,
      count: contentCounts.videos || 0,
      availableFor: ["video", "text", "quiz", "assignment", "resource"],
    },
    {
      id: "text",
      label: "Text Content",
      icon: Type,
      count: contentCounts.text || 0,
      availableFor: ["text", "video", "quiz", "assignment", "resource"],
    },
    {
      id: "document",
      label: "Documents",
      icon: BookOpen,
      count: contentCounts.documents || 0,
      availableFor: ["text", "video", "quiz", "assignment", "resource"],
    },
    {
      id: "image",
      label: "Images",
      icon: FileImage,
      count: contentCounts.images || 0,
      availableFor: ["text", "video", "quiz", "assignment", "resource"],
    },
    {
      id: "audio",
      label: "Audio",
      icon: FileAudio,
      count: contentCounts.audio || 0,
      availableFor: ["video", "text", "quiz", "assignment", "resource"],
    },
    {
      id: "archive",
      label: "Archives",
      icon: FileArchive,
      count: contentCounts.archives || 0,
      availableFor: ["resource", "text", "video", "quiz", "assignment"],
    },
    {
      id: "assignment",
      label: "Assignments",
      icon: Clipboard,
      count: contentCounts.assignments || 0,
      availableFor: ["assignment", "quiz", "text", "video"],
    },
    {
      id: "resource",
      label: "Resources",
      icon: Link2,
      count: contentCounts.resources || 0,
      availableFor: ["resource", "text", "video", "quiz", "assignment"],
    },
    {
      id: "quiz",
      label: "Quizzes",
      icon: FileCheck,
      count: contentCounts.quizzes || 0,
      availableFor: ["quiz", "text", "video", "assignment"],
    },
  ];

  // Filter tabs to show only the specific content type chosen for the lecture
  const availableTabs = selectedLectureObj 
    ? tabs.filter(tab => tab.id === selectedLectureObj.type)
    : tabs;

  // Set active tab to the lecture type if available
  useEffect(() => {
    if (selectedLectureObj && selectedLectureObj.type) {
      setActiveTab(selectedLectureObj.type);
    }
  }, [selectedLectureObj]);

  const renderFileUploadSection = (type: string, title: string, acceptedFormats: string[], maxSize: string) => {
    const FileIcon = getFileIcon(type);
    const files = selectedLectureContent?.[type] || [];
    const hasExistingContent = files.length > 0;
    
    return (
      <div className="space-y-8">
        {/* Content Status */}
        {hasExistingContent ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-800">
                  Content Available
                </h4>
                <p className="text-green-700 text-sm mt-1">
                  This lecture has {title} content. You can replace it by uploading a new file.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800">
                  No Content Yet
                </h4>
                <p className="text-amber-700 text-sm mt-1">
                  Upload {title} content for this lecture to make it available to students.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            dragStates[type]
              ? "border-blue-500 bg-blue-50"
              : selectedSection && selectedLecture
              ? "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
              : "border-gray-200 bg-gray-50"
          } ${
            !selectedSection || !selectedLecture || isUploading
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onDragOver={(e) => handleDragOver(e, type)}
          onDragLeave={(e) => handleDragLeave(e, type)}
          onDrop={(e) => handleDrop(e, type)}
          onClick={() => {
            if (selectedSection && selectedLecture && !isUploading) {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = acceptedFormats.join(",");
              input.multiple = true;
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) {
                  Array.from(files).forEach((file) => {
                    handleFileUpload(file, type);
                  });
                }
              };
              input.click();
            }
          }}
        >
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full p-4 mb-4 ${
                dragStates[type] ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <Upload
                className={`h-8 w-8 ${
                  dragStates[type] ? "text-blue-600" : "text-gray-400"
                }`}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {hasExistingContent ? `Replace ${title}` : `Upload ${title}`}
            </h3>
            <p className="text-gray-600 mb-4 max-w-md">
              {hasExistingContent 
                ? `Upload a new file to replace the existing ${type} content.`
                : `Drag and drop your ${type} files here, or click to browse.`
              }
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Maximum size: {maxSize}</span>
              <span>•</span>
              <span>Formats: {acceptedFormats.join(", ").replace(/\./g, "").toUpperCase()}</span>
            </div>
            {selectedSection && selectedLecture && !isUploading && (
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {hasExistingContent ? "Replace File" : "Browse Files"}
              </button>
            )}
            {isUploading && (
              <div className="mt-6 flex items-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {Object.entries(uploadProgress)
          .filter(([key]) => key.startsWith(type))
          .map(([fileId, progress]) => (
            <div
              key={fileId}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {progress.fileName}
                  </p>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          progress.status === "error"
                            ? "bg-red-500"
                            : progress.status === "complete"
                            ? "bg-green-500"
                            : "bg-blue-600"
                        }`}
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">
                      {progress.status === "uploading" &&
                        `${progress.progress}% complete`}
                      {progress.status === "complete" && "Upload complete"}
                      {progress.status === "error" && "Upload failed"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(progress.fileSize)}
                    </p>
                  </div>
                </div>
                {progress.status === "uploading" && (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                )}
                {progress.status === "complete" && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                <button
                  onClick={() => removeUpload(fileId)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

        {/* Uploaded Files for Selected Lecture */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {title} for "{selectedLectureObj?.title || 'Selected Lecture'}" ({files.length})
          </h3>
          {files.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {files.map((file: any) => (
                <div
                  key={file.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    {type === 'videos' && (
                      <video
                        src={file.url}
                        className="w-full h-48 object-cover"
                        poster=""
                      />
                    )}
                    {type === 'images' && (
                      <img
                        src={file.url}
                        alt={file.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    {!['videos', 'images'].includes(type) && (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <FileIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handlePreviewFile(file, type)}
                        className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
                      >
                        <Eye className="h-6 w-6 text-gray-900" />
                      </button>
                    </div>
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleRemoveContent(file.id, type, file.title)}
                        disabled={deletingContent[`${type}-${file.id}`]}
                        className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingContent[`${type}-${file.id}`] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 truncate mb-1">
                      {file.title || file.name}
                    </h4>
                    {file.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {file.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mb-3">
                      {formatFileSize(file.size)} • {file.uploadedAt?.toLocaleDateString?.() || 'Recently uploaded'}
                    </p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        {file.status === 'permanent' ? 'Permanent' : 'Ready to use'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
              <FileIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No {type} uploaded for this lecture yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Upload your first {type.slice(0, -1)} file for this lecture
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Upload</h2>
          <p className="text-gray-600 mt-1">
            Create and upload content for each lecture
          </p>
        </div>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Need help?</span>
        </div>
      </div>

      {/* Enhanced Content Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-500" />
          Select Target Lecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section *
            </label>
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setActiveTab("");
                setSelectedLecture("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select a section</option>
              {data.sections?.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title} ({section.lectures?.length || 0} lectures)
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
              onChange={(e) => {
                setSelectedLecture(e.target.value);
                setActiveTab("");
              }}
              disabled={!selectedSection}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a lecture</option>
              {data.sections
                ?.find((s) => s.id === selectedSection)
                ?.lectures?.map((lecture) => {
                  const counts = getLectureContentCounts(lecture.id);
                  const totalContent = Object.values(counts).reduce((sum, count) => sum + count, 0);
                  return (
                    <option key={lecture.id} value={lecture.id}>
                      {lecture.title} ({lecture.type} - {totalContent} content items)
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
        
        {/* Selection Status */}
        {selectedSection && selectedLecture ? (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Ready to add content
              </p>
              <p className="text-sm text-green-700 mt-1">
                Section: {selectedSectionObj?.title} • Lecture: {selectedLectureObj?.title} • Type: {selectedLectureObj?.type}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Selection Required
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Please select both a section and lecture to start adding content.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={!selectedLecture}
                  className={`
                    flex items-center gap-3 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }
                    ${!selectedLecture ? "opacity-50 cursor-not-allowed" : ""}
                  `}
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
          {!selectedLecture ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                Select a Lecture First
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Choose a section and lecture from the dropdown above to start adding content.
              </p>
            </div>
          ) : (
            <>
              {/* Videos Tab */}
              {activeTab === "video" && renderFileUploadSection(
                "videos", 
                "Videos", 
                [".mp4", ".webm", ".mov", ".avi"], 
                "500MB"
              )}

              {/* Documents Tab */}
              {activeTab === "document" && renderFileUploadSection(
                "documents", 
                "Documents", 
                [".pdf", ".docx", ".pptx", ".xlsx"], 
                "50MB"
              )}

              {/* Images Tab */}
              {activeTab === "image" && renderFileUploadSection(
                "images", 
                "Images", 
                [".jpg", ".jpeg", ".png", ".gif", ".webp"], 
                "10MB"
              )}

              {/* Audio Tab */}
              {activeTab === "audio" && renderFileUploadSection(
                "audio", 
                "Audio Files", 
                [".mp3", ".wav", ".ogg"], 
                "100MB"
              )}

              {/* Archives Tab */}
              {activeTab === "archive" && renderFileUploadSection(
                "archives", 
                "Archive Files", 
                [".zip", ".rar", ".7z"], 
                "100MB"
              )}

              {/* Text Content Tab */}
              {activeTab === "text" && (
                <div className="space-y-8">
                  {/* Content Status */}
                  {selectedLectureContent?.text?.length > 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-green-800">
                            Text Content Available
                          </h4>
                          <p className="text-green-700 text-sm mt-1">
                            This lecture has text content. You can replace it by creating new content.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-800">
                            No Text Content Yet
                          </h4>
                          <p className="text-amber-700 text-sm mt-1">
                            Create text content for this lecture to provide written material to students.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Text Content Creator */}
                  <div className="bg-gray-50 rounded-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Type className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedLectureContent?.text?.length > 0 ? "Replace Text Content" : "Create Text Content"}
                        </h3>
                        <p className="text-gray-600">
                          Write rich text content for "{selectedLectureObj?.title}"
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
                        disabled={!textTitle.trim() || !textContent.trim()}
                        className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="h-5 w-5" />
                        {selectedLectureContent?.text?.length > 0 ? "Replace Text Content" : "Create Text Content"}
                      </button>
                    </div>
                  </div>

                  {/* Created Text Content for Selected Lecture */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Text Content for "{selectedLectureObj?.title}" ({selectedLectureContent?.text?.length || 0})
                    </h3>
                    {selectedLectureContent?.text?.length > 0 ? (
                      <div className="space-y-4">
                        {selectedLectureContent.text.map((content: any) => (
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
                                  Created {content.createdAt ? new Date(content.createdAt).toLocaleDateString() : 'Recently'}
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
                                  onClick={() => handleRemoveContent(content.id, "text", content.title)}
                                  disabled={deletingContent[`text-${content.id}`]}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deletingContent[`text-${content.id}`] ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                        <Type className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No text content created for this lecture yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Create your first text-based content for this lecture
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Assignment Tab */}
              {activeTab === "assignment" && (
                <div className="space-y-8">
                  {/* Content Status */}
                  {selectedLectureContent?.assignments?.length > 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-green-800">
                            Assignment Available
                          </h4>
                          <p className="text-green-700 text-sm mt-1">
                            This lecture has an assignment. You can replace it by creating a new one.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-800">
                            No Assignment Yet
                          </h4>
                          <p className="text-amber-700 text-sm mt-1">
                            Create an assignment for this lecture to test student understanding.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Clipboard className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedLectureContent?.assignments?.length > 0 ? "Replace Assignment" : "Create Assignment"}
                        </h3>
                        <p className="text-gray-600">
                          Design assignments for "{selectedLectureObj?.title}"
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
                          onChange={(e) => setAssignmentInstructions(e.target.value)}
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
                        disabled={!assignmentTitle.trim() || !assignmentDescription.trim()}
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="h-5 w-5" />
                        {selectedLectureContent?.assignments?.length > 0 ? "Replace Assignment" : "Create Assignment"}
                      </button>
                    </div>
                  </div>

                  {/* Created Assignments for Selected Lecture */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Assignments for "{selectedLectureObj?.title}" ({selectedLectureContent?.assignments?.length || 0})
                    </h3>
                    {selectedLectureContent?.assignments?.length > 0 ? (
                      <div className="space-y-4">
                        {selectedLectureContent.assignments.map((assignment: any) => (
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
                                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                    </div>
                                  )}
                                  {assignment.points && (
                                    <div className="flex items-center gap-1">
                                      <span>{assignment.points} points</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">
                                  Created {assignment.createdAt ? new Date(assignment.createdAt).toLocaleDateString() : 'Recently'}
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
                                  onClick={() => handleRemoveContent(assignment.id, "assignments", assignment.title)}
                                  disabled={deletingContent[`assignments-${assignment.id}`]}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deletingContent[`assignments-${assignment.id}`] ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                        <Clipboard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No assignments created for this lecture yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Create your first assignment for this lecture
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resources Tab */}
              {activeTab === "resource" && (
                <div className="space-y-8">
                  {/* Content Status */}
                  {selectedLectureContent?.resources?.length > 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-green-800">
                            Resource Available
                          </h4>
                          <p className="text-green-700 text-sm mt-1">
                            This lecture has a resource. You can replace it by adding a new one.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-800">
                            No Resource Yet
                          </h4>
                          <p className="text-amber-700 text-sm mt-1">
                            Add external links and resources for this lecture to provide additional materials.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-teal-100 rounded-lg">
                        <Link2 className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedLectureContent?.resources?.length > 0 ? "Replace Resource" : "Add Resource"}
                        </h3>
                        <p className="text-gray-600">
                          Share external links and resources for "{selectedLectureObj?.title}"
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
                          <option value="tool">Online Tool</option>
                          <option value="article">Article/Blog</option>
                          <option value="reference">Reference Material</option>
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

                      <button
                        onClick={handleCreateResource}
                        disabled={!resourceTitle.trim() || !resourceUrl.trim()}
                        className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="h-5 w-5" />
                        {selectedLectureContent?.resources?.length > 0 ? "Replace Resource" : "Add Resource"}
                      </button>
                    </div>
                  </div>

                  {/* Created Resources for Selected Lecture */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Resources for "{selectedLectureObj?.title}" ({selectedLectureContent?.resources?.length || 0})
                    </h3>
                    {selectedLectureContent?.resources?.length > 0 ? (
                      <div className="space-y-4">
                        {selectedLectureContent.resources.map((resource: any) => (
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
                                <p className="text-sm text-gray-500 mb-3 break-all">
                                  {resource.url}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Added {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : "Recently"}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span className="text-sm text-green-600 font-medium">
                                    Available to students
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <Eye className="h-5 w-5" />
                                </a>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Edit3 className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleRemoveContent(resource.id, "resources", resource.title)}
                                  disabled={deletingContent[`resources-${resource.id}`]}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deletingContent[`resources-${resource.id}`] ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                        <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No resources added for this lecture yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Share helpful links and resources for this lecture
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quizzes Tab */}
              {activeTab === "quiz" && (
                <div className="text-center py-16">
                  {/* Content Status */}
                  {selectedLectureContent?.quizzes?.length > 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-green-800">
                            Quiz Available
                          </h4>
                          <p className="text-green-700 text-sm mt-1">
                            This lecture has a quiz. You can replace it by creating a new one.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-800">
                            No Quiz Yet
                          </h4>
                          <p className="text-amber-700 text-sm mt-1">
                            Create a quiz for this lecture to test student knowledge and understanding.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <FileCheck className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Quiz Builder
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Create interactive quizzes and assessments to test your
                    students' knowledge for "{selectedLectureObj?.title}".
                  </p>
                  <button
                    onClick={() => {
                      // Create a basic quiz for the selected lecture
                      createQuiz({
                        title: `Quiz for ${selectedLectureObj?.title}`,
                        description: "Interactive quiz to test student knowledge",
                        questions: [
                          {
                            id: `q-${Date.now()}`,
                            type: "multiple-choice" as const,
                            question: "Sample question 1",
                            options: ["Option A", "Option B", "Option C", "Option D"],
                            correctAnswer: "Option A",
                            points: 10
                          }
                        ],
                        timeLimit: 30,
                        attempts: 3,
                        passingScore: 70,
                        sectionId: selectedSection,
                        lectureId: selectedLecture,
                      });
                      toast.success("Quiz created successfully!");
                    }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="h-5 w-5 inline mr-2" />
                    {selectedLectureContent?.quizzes?.length > 0 ? "Replace Quiz" : "Create Quiz"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Status Indicator */}
      {isUploading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Uploading files...</span>
        </div>
      )}

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
              {previewFile.type === 'videos' && (
                <video
                  src={previewFile.file.url}
                  controls
                  className="w-full max-h-[70vh] object-contain"
                  autoPlay
                  preload="metadata"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error("Video preview error:", e);
                    toast.error("Failed to load video preview. The video file may be corrupted or in an unsupported format.");
                  }}
                >
                  <source src={previewFile.file.url} type={previewFile.file.type || 'video/mp4'} />
                  Your browser does not support the video tag.
                </video>
              )}
              
              {previewFile.type === 'images' && (
                <img
                  src={previewFile.file.url}
                  alt={previewFile.file.title || previewFile.file.name}
                  className="w-full max-h-[70vh] object-contain"
                />
              )}
              
              {previewFile.type === 'documents' && (
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
              
              {previewFile.type === 'audio' && (
                <div className="text-center py-12">
                  <audio
                    src={previewFile.file.url}
                    controls
                    className="w-full max-w-md mx-auto"
                  />
                </div>
              )}
              
              {previewFile.type === 'archives' && (
                <div className="text-center py-12">
                  <FileArchive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Archive preview not available
                  </p>
                  <a
                    href={previewFile.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Archive
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Content
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{showDeleteConfirm.title}"? This action cannot be undone.
            </p>
            
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteContent}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}