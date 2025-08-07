"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Copy, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Mail, 
  Code, 
  QrCode, 
  Download,
  ExternalLink,
  Check,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseSharing } from "../../hooks/useCourseSharing";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CourseShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  courseDescription?: string;
}

export const CourseShareModal = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  courseDescription
}: CourseShareModalProps) => {
  const [activeTab, setActiveTab] = useState("social");
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  
  const {
    shareData,
    qrCodeData,
    shareLinksLoading,
    copyLinkLoading,
    qrCodeLoading,
    fetchShareLinks,
    copyCourseLink,
    generateQRCodeForCourse,
    shareToSocial,
    shareViaEmail,
    copyEmbedCode,
    downloadQRCode,
  } = useCourseSharing(courseId);

  // Fetch share links when modal opens
  useEffect(() => {
    if (isOpen && courseId) {
      fetchShareLinks(courseId);
    }
  }, [isOpen, courseId]); // fetchShareLinks is stable due to useCallback in the hook

  const handleCopy = async (text: string, itemType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set([...prev, itemType]));
      toast.success(`${itemType} copied to clipboard!`);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemType);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedItems(prev => new Set([...prev, itemType]));
      toast.success(`${itemType} copied to clipboard!`);
      
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemType);
          return newSet;
        });
      }, 2000);
    }
  };

  const handleQuickCopy = () => {
    if (shareData?.courseUrl) {
      handleCopy(shareData.courseUrl, "link");
    } else {
      copyCourseLink(courseId);
    }
  };

  const handleGenerateQR = () => {
    if (!qrCodeData?.qrCode) {
      generateQRCodeForCourse(courseId);
    }
  };

  const socialPlatforms = [
    { key: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600 hover:bg-blue-700" },
    { key: "twitter", name: "Twitter", icon: Twitter, color: "bg-sky-500 hover:bg-sky-600" },
    { key: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700 hover:bg-blue-800" },
    { key: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "bg-green-600 hover:bg-green-700" },
    { key: "telegram", name: "Telegram", icon: MessageCircle, color: "bg-blue-500 hover:bg-blue-600" },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Share2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Share Course</h3>
                <p className="text-sm text-gray-600">{courseTitle}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="link">Direct Link</TabsTrigger>
                <TabsTrigger value="embed">Embed Code</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
              </TabsList>

              {/* Social Media Tab */}
              <TabsContent value="social" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {socialPlatforms.map((platform) => (
                      <Button
                        key={platform.key}
                        onClick={() => shareData && shareToSocial(platform.key, shareData)}
                        disabled={shareLinksLoading || !shareData}
                        className={`${platform.color} text-white flex items-center gap-2`}
                      >
                        <platform.icon className="h-4 w-4" />
                        {platform.name}
                      </Button>
                    ))}
                    <Button
                      onClick={() => shareData && shareViaEmail(shareData)}
                      disabled={shareLinksLoading || !shareData}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                  </div>

                  {shareLinksLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Generating share links...</span>
                    </div>
                  )}

                  {shareData && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Course URL:</span>
                          <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                            {shareData.courseUrl}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Share Text:</span>
                          <span className="text-gray-900">
                            {courseTitle} - Check out this amazing course!
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Direct Link Tab */}
              <TabsContent value="link" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course URL
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={shareData?.courseUrl || ""}
                        readOnly
                        placeholder="Loading course URL..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleQuickCopy}
                        disabled={copyLinkLoading || !shareData?.courseUrl}
                        className="flex items-center gap-2"
                      >
                        {copiedItems.has("link") ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => shareData?.courseUrl && window.open(shareData.courseUrl, '_blank')}
                        disabled={!shareData?.courseUrl}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open Course
                      </Button>
                      <Button
                        onClick={() => shareData && shareViaEmail(shareData)}
                        disabled={!shareData}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Share via Email
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Embed Code Tab */}
              <TabsContent value="embed" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Embed Code
                    </label>
                    <div className="space-y-2">
                      <Textarea
                        value={shareData?.embedCode || ""}
                        readOnly
                        placeholder="Loading embed code..."
                        className="font-mono text-xs h-24"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => shareData?.embedCode && copyEmbedCode(shareData)}
                          disabled={!shareData?.embedCode}
                          className="flex items-center gap-2"
                        >
                          {copiedItems.has("embed") ? (
                            <>
                              <Check className="h-4 w-4" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              Copy Code
                            </>
                          )}
                        </Button>
                        <Badge variant="secondary" className="text-xs">
                          <Code className="h-3 w-3 mr-1" />
                          HTML
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">How to use</h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li>1. Copy the embed code above</li>
                      <li>2. Paste it into your website's HTML</li>
                      <li>3. The course will be embedded in your page</li>
                    </ol>
                  </div>
                </div>
              </TabsContent>

              {/* QR Code Tab */}
              <TabsContent value="qr" className="space-y-4">
                <div className="space-y-4">
                  {!qrCodeData?.qrCode && !qrCodeLoading && (
                    <div className="text-center py-8">
                      <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Generate a QR code for easy sharing</p>
                      <Button
                        onClick={handleGenerateQR}
                        disabled={qrCodeLoading}
                        className="flex items-center gap-2"
                      >
                        {qrCodeLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <QrCode className="h-4 w-4" />
                            Generate QR Code
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {qrCodeLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Generating QR code...</span>
                    </div>
                  )}

                  {qrCodeData?.qrCode && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <img
                          src={qrCodeData.qrCode}
                          alt="Course QR Code"
                          className="mx-auto border border-gray-200 rounded-lg"
                          width={200}
                          height={200}
                        />
                      </div>
                      
                      <div className="flex justify-center gap-2">
                        <Button
                          onClick={() => qrCodeData && downloadQRCode(qrCodeData)}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          onClick={() => qrCodeData.qrCode && handleCopy(qrCodeData.qrCode, "qr")}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          {copiedItems.has("qr") ? (
                            <>
                              <Check className="h-4 w-4" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              Copy URL
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">QR Code Benefits</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Easy sharing on mobile devices</li>
                          <li>• Perfect for printed materials</li>
                          <li>• Quick access to course</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Share this course with students and colleagues
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleQuickCopy} disabled={copyLinkLoading || !shareData?.courseUrl}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 