"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Download, 
  X, 
  FileText, 
  Image, 
  Video, 
  Play,
  CheckCircle,
  AlertCircle,
  Upload,
  Loader2
} from 'lucide-react';
import { showToast } from '@/utils/toast';

interface DocumentPreviewProps {
  document: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    thumbnailUrl?: string;
    previewUrl?: string;
    uploadDate: string;
    verificationStatus: 'pending' | 'verified' | 'failed';
  };
  onRemove?: () => void;
  showActions?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function DocumentPreview({ 
  document, 
  onRemove, 
  showActions = true, 
  size = 'md' 
}: DocumentPreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-6 w-6 text-blue-500" />;
    }
    if (type.startsWith('video/')) {
      return <Video className="h-6 w-6 text-purple-500" />;
    }
    return <FileText className="h-6 w-6 text-gray-500" />;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16';
      case 'lg':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(document.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('success', 'Download Started', `${document.name} is being downloaded.`);
    } catch (error) {
      showToast('error', 'Download Failed', 'Failed to download the document.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = () => {
    const documentUrl = document.url || document.previewUrl || document.thumbnailUrl;
    const documentType = document.type || 'application/octet-stream';

    if (documentType.startsWith('image/')) {
      return (
        <div className="relative group">
          <img 
            src={documentUrl} 
            alt={document.name}
            className={`${getSizeClasses()} object-cover rounded-lg border cursor-pointer transition-transform hover:scale-105`}
            onClick={() => setIsPreviewOpen(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback for failed image loads */}
          <div className="hidden w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
            <Image className="h-8 w-8 text-gray-400" />
          </div>
          <div className="absolute inset-0 hover:bg-black/20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-black hover:bg-white/80"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    if (documentType.startsWith('video/')) {
      return (
        <div className="relative group">
          {document.thumbnailUrl ? (
            <img 
              src={document.thumbnailUrl}
              alt={document.name}
              className={`${getSizeClasses()} object-cover rounded-lg border cursor-pointer transition-transform hover:scale-105`}
              onClick={() => setIsPreviewOpen(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <video 
              src={documentUrl}
              className={`${getSizeClasses()} object-cover rounded-lg border cursor-pointer transition-transform hover:scale-105`}
              muted
              preload="metadata"
              onClick={() => setIsPreviewOpen(true)}
            />
          )}
          {/* Fallback for failed video loads */}
          <div className="hidden w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
            <Video className="h-8 w-8 text-gray-400" />
          </div>
          <div className="absolute inset-0 hover:bg-black/20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-black hover:bg-white/80"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    // Default fallback for other file types
    return (
      <div className={`${getSizeClasses()} bg-gray-100 rounded-lg border flex items-center justify-center cursor-pointer transition-transform hover:scale-105`}>
        {getFileIcon(documentType)}
      </div>
    );
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {renderPreview()}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(document.verificationStatus)}
                <span className="font-medium text-sm truncate">{document.name}</span>
                {getStatusBadge(document.verificationStatus)}
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>Size: {formatFileSize(document.size)}</p>
                <p>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</p>
                <p>Type: {document.type}</p>
              </div>

              {showActions && (
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewOpen(true)}
                    className="text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Download className="h-3 w-3 mr-1" />
                    )}
                    Download
                  </Button>

                  {onRemove && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRemove}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Preview: {document.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 max-h-[calc(90vh-120px)] overflow-auto">
              {document.type.startsWith('video/') && (
                <video
                  src={document.url}
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
                  <source src={document.url} type={document.type} />
                  Your browser does not support the video tag.
                </video>
              )}
              
              {document.type.startsWith('image/') && (
                <img
                  src={document.url}
                  alt={document.name}
                  className="w-full max-h-[70vh] object-contain"
                  onError={(e) => {
                    console.error("Image preview error:", e);
                    showToast('error', "Image Preview Error", "Failed to load image preview.");
                  }}
                />
              )}
              
              {!document.type.startsWith('video/') && !document.type.startsWith('image/') && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Document preview not available for this file type
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={handleDownload}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      Download Document
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => window.open(document.url, '_blank')}
                    >
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
