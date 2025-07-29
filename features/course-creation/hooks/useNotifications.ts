// hooks/useNotifications.ts
import { useCallback } from "react";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import * as React from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationOptions {
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  description?: string;
}

export function useNotifications() {
  const showNotification = useCallback(
    (
      type: NotificationType,
      message: string,
      options: NotificationOptions = {}
    ) => {
      const {
        duration = 4000,
        dismissible = true,
        action,
        description,
      } = options;

      const baseConfig = {
        duration,
        dismissible,
        action,
        description,
      };

      switch (type) {
        case "success": {
          const iconEl = React.createElement(CheckCircle, {
            className: "h-4 w-4",
          });
          return toast.success(message, {
            ...baseConfig,
            icon: iconEl,
          });
        }
        case "error": {
          const iconEl = React.createElement(AlertCircle, {
            className: "h-4 w-4",
          });
          return toast.error(message, {
            ...baseConfig,
            duration: duration || 6000, // Longer for errors
            icon: iconEl,
          });
        }
        case "warning": {
          const iconEl = React.createElement(AlertTriangle, {
            className: "h-4 w-4",
          });
          return toast.warning(message, {
            ...baseConfig,
            icon: iconEl,
          });
        }
        case "info": {
          const iconEl = React.createElement(Info, { className: "h-4 w-4" });
          return toast.info(message, {
            ...baseConfig,
            icon: iconEl,
          });
        }

        default:
          return toast(message, baseConfig);
      }
    },
    []
  );

  const showUploadProgress = useCallback(
    (fileName: string, progress: number) => {
      const toastId = `upload-${fileName}`;

      if (progress === 0) {
        return toast.loading(`Uploading ${fileName}...`, {
          id: toastId,
          duration: Infinity,
        });
      }

      if (progress === 100) {
        return toast.success(`${fileName} uploaded successfully`, {
          id: toastId,
          duration: 3000,
        });
      }

      return toast.loading(`Uploading ${fileName}... ${progress}%`, {
        id: toastId,
        duration: Infinity,
      });
    },
    []
  );

  const showUploadError = useCallback((fileName: string, error: string) => {
    const toastId = `upload-${fileName}`;
    return toast.error(`Failed to upload ${fileName}: ${error}`, {
      id: toastId,
      duration: 6000,
    });
  }, []);

  const dismissNotification = useCallback((toastId: string | number) => {
    toast.dismiss(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    success: (message: string, options?: NotificationOptions) =>
      showNotification("success", message, options),
    error: (message: string, options?: NotificationOptions) =>
      showNotification("error", message, options),
    warning: (message: string, options?: NotificationOptions) =>
      showNotification("warning", message, options),
    info: (message: string, options?: NotificationOptions) =>
      showNotification("info", message, options),
    showUploadProgress,
    showUploadError,
    dismiss: dismissNotification,
    dismissAll,
  };
}
