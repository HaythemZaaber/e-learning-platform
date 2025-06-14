"use client";
import type React from "react";
import { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle2, X } from "lucide-react";

interface FileUploaderProps {
  accept?: string;
  maxSize?: number;
  onUpload: (file: File) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
  title?: string;
  description?: string;
  supportedFormats?: string[];
}

interface ToastMessage {
  id: string;
  title: string;
  description: string;
  variant: "default" | "destructive" | "success";
}

export function FileUploader({
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  onUpload,
  children,
  disabled = false,
  multiple = false,
  className = "",
  title = "Upload Files",
  description = "Drag and drop your files here, or click to browse",
  supportedFormats = [],
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
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

  const validateFile = (file: File): boolean => {
    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const isValidType = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          // Extension-based check
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        } else {
          // MIME type check (with wildcard support)
          const mimePattern = type.replace("*", ".*");
          return new RegExp(mimePattern).test(file.type);
        }
      });
      if (!isValidType) {
        showToast({
          title: "Invalid file type",
          description: `Please upload a file with one of these formats: ${accept}`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Check file size
    if (file.size > maxSize) {
      showToast({
        title: "File too large",
        description: `Please upload a file smaller than ${formatFileSize(
          maxSize
        )}. Current file: ${formatFileSize(file.size)}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);

    if (multiple) {
      files.forEach((file) => {
        if (validateFile(file)) {
          onUpload(file);
          showToast({
            title: "File uploaded successfully",
            description: `${file.name} (${formatFileSize(file.size)})`,
            variant: "success",
          });
        }
      });
    } else if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onUpload(file);
        showToast({
          title: "File uploaded successfully",
          description: `${file.name} (${formatFileSize(file.size)})`,
          variant: "success",
        });
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (multiple) {
      files.forEach((file) => {
        if (validateFile(file)) {
          onUpload(file);
          showToast({
            title: "File uploaded successfully",
            description: `${file.name} (${formatFileSize(file.size)})`,
            variant: "success",
          });
        }
      });
    } else if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onUpload(file);
        showToast({
          title: "File uploaded successfully",
          description: `${file.name} (${formatFileSize(file.size)})`,
          variant: "success",
        });
      }
    }

    // Reset file input
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div
        className={`relative transition-all duration-200 ${
          isDragging ? "ring-2 ring-blue-500 bg-blue-50" : ""
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-50"
        } ${className}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
        />

        {children || (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              {description}
            </p>

            {supportedFormats.length > 0 && (
              <div className="text-xs text-gray-400">
                Supported formats: {supportedFormats.join(", ")}
              </div>
            )}

            <div className="text-xs text-gray-400 mt-2">
              Max file size: {formatFileSize(maxSize)}
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
              toast.variant === "destructive"
                ? "bg-red-50 border border-red-200"
                : toast.variant === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex-shrink-0">
              {toast.variant === "destructive" ? (
                <AlertCircle className="w-5 h-5 text-red-400" />
              ) : toast.variant === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <p
                className={`text-sm font-medium ${
                  toast.variant === "destructive"
                    ? "text-red-800"
                    : toast.variant === "success"
                    ? "text-green-800"
                    : "text-gray-800"
                }`}
              >
                {toast.title}
              </p>
              <p
                className={`text-sm mt-1 ${
                  toast.variant === "destructive"
                    ? "text-red-600"
                    : toast.variant === "success"
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
