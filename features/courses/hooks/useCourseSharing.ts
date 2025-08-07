"use client";

import { useCallback } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_COURSE_SHARE_LINKS, COPY_COURSE_SHARE_LINK, GENERATE_COURSE_QR_CODE } from "../services/graphql/courseQueries";
import { toast } from "sonner";

interface ShareData {
  courseUrl: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    whatsapp: string;
    telegram: string;
    email: string;
  };
  embedCode: string;
  qrCode?: string;
}

interface ShareResponse {
  success: boolean;
  message: string;
  shareData?: ShareData;
  errors?: string[];
}

export const useCourseSharing = (courseId?: string) => {
  // Get share links
  const [getShareLinks, { loading: shareLinksLoading, data: shareLinksData }] = useLazyQuery(GET_COURSE_SHARE_LINKS, {
    onCompleted: (data) => {
      if (data.getCourseShareLinks.success) {
        toast.success("Share links generated successfully!");
      } else {
        toast.error(data.getCourseShareLinks.message || "Failed to generate share links");
      }
    },
    onError: (error) => {
      toast.error(`Failed to generate share links: ${error.message}`);
    },
  });

  // Copy share link
  const [copyShareLink, { loading: copyLinkLoading }] = useLazyQuery(COPY_COURSE_SHARE_LINK, {
    onCompleted: async (data) => {
      if (data.copyCourseShareLink.success && data.copyCourseShareLink.shareData?.courseUrl) {
        try {
          await navigator.clipboard.writeText(data.copyCourseShareLink.shareData.courseUrl);
          toast.success("Course URL copied to clipboard!");
        } catch (error) {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = data.copyCourseShareLink.shareData.courseUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          toast.success("Course URL copied to clipboard!");
        }
      } else {
        toast.error(data.copyCourseShareLink.message || "Failed to copy course URL");
      }
    },
    onError: (error) => {
      toast.error(`Failed to copy course URL: ${error.message}`);
    },
  });

  // Generate QR code
  const [generateQRCode, { loading: qrCodeLoading, data: qrCodeData }] = useLazyQuery(GENERATE_COURSE_QR_CODE, {
    onCompleted: (data) => {
      if (data.generateCourseQRCode.success) {
        toast.success("QR code generated successfully!");
      } else {
        toast.error(data.generateCourseQRCode.message || "Failed to generate QR code");
      }
    },
    onError: (error) => {
      toast.error(`Failed to generate QR code: ${error.message}`);
    },
  });

  // Functions to trigger sharing actions
  const fetchShareLinks = useCallback((courseIdToShare: string) => {
    getShareLinks({ variables: { courseId: courseIdToShare } });
  }, [getShareLinks]);

  const copyCourseLink = useCallback((courseIdToShare: string) => {
    copyShareLink({ variables: { courseId: courseIdToShare } });
  }, [copyShareLink]);

  const generateQRCodeForCourse = useCallback((courseIdToShare: string) => {
    generateQRCode({ variables: { courseId: courseIdToShare } });
  }, [generateQRCode]);

  // Share to social media functions
  const shareToSocial = (platform: string, shareData: ShareData) => {
    if (!shareData) return;

    const url = shareData.socialLinks[platform as keyof typeof shareData.socialLinks];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  // Share via email
  const shareViaEmail = (shareData: ShareData) => {
    if (!shareData) return;
    window.open(shareData.socialLinks.email, '_blank');
  };

  // Copy embed code
  const copyEmbedCode = async (shareData: ShareData) => {
    if (!shareData?.embedCode) return;

    try {
      await navigator.clipboard.writeText(shareData.embedCode);
      toast.success("Embed code copied to clipboard!");
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareData.embedCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Embed code copied to clipboard!");
    }
  };

  // Download QR code
  const downloadQRCode = (shareData: ShareData) => {
    if (!shareData?.qrCode) return;

    const link = document.createElement('a');
    link.href = shareData.qrCode;
    link.download = `course-qr-code-${courseId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded!");
  };

  return {
    // Data
    shareData: shareLinksData?.getCourseShareLinks?.shareData,
    qrCodeData: qrCodeData?.generateCourseQRCode?.shareData,
    
    // Loading states
    shareLinksLoading,
    copyLinkLoading,
    qrCodeLoading,
    
    // Actions
    fetchShareLinks,
    copyCourseLink,
    generateQRCodeForCourse,
    shareToSocial,
    shareViaEmail,
    copyEmbedCode,
    downloadQRCode,
    
    // Helper functions
    getShareLinksData: () => shareLinksData?.getCourseShareLinks,
    getQRCodeData: () => qrCodeData?.generateCourseQRCode,
  };
}; 