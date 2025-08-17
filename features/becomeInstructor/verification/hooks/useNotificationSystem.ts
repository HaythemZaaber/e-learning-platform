"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'progress';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  actionUrl?: string;
  progress?: number;
  autoDismiss?: boolean;
  dismissAfter?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  completionPercentage: number;
  missingRequirements: string[];
  recommendations: string[];
}

export interface StepValidation {
  stepId: string;
  stepName: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  completionPercentage: number;
  requiredFields: string[];
  optionalFields: string[];
  completedFields: string[];
}

export function useNotificationSystem() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
    completionPercentage: 0,
    missingRequirements: [],
    recommendations: []
  });

  // Add notification
  const addNotification = useCallback((notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      autoDismiss: notification.autoDismiss ?? true,
      dismissAfter: notification.dismissAfter ?? 5000
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : undefined,
    });

    // Auto-dismiss if enabled
    if (newNotification.autoDismiss && newNotification.dismissAfter) {
      setTimeout(() => {
        dismissNotification(newNotification.id);
      }, newNotification.dismissAfter);
    }
  }, [toast]);

  // Dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Update validation results
  const updateValidationResults = useCallback((results: ValidationResult) => {
    setValidationResults(results);
    
    // Show validation summary notification
    if (results.errors.length > 0) {
      addNotification({
        type: 'error',
        title: 'Validation Errors',
        message: `Found ${results.errors.length} error(s) that need to be fixed.`,
        actionRequired: true,
        autoDismiss: false
      });
    } else if (results.warnings.length > 0) {
      addNotification({
        type: 'warning',
        title: 'Validation Warnings',
        message: `Found ${results.warnings.length} warning(s) to consider.`,
        actionRequired: false,
        autoDismiss: true,
        dismissAfter: 3000
      });
    } else if (results.isValid) {
      addNotification({
        type: 'success',
        title: 'Validation Complete',
        message: 'All required fields are completed successfully!',
        autoDismiss: true,
        dismissAfter: 3000
      });
    }
  }, [addNotification]);

  // Upload progress notification
  const showUploadProgress = useCallback((fileName: string, progress: number) => {
    if (progress === 0) {
      addNotification({
        type: 'progress',
        title: 'Upload Started',
        message: `Uploading ${fileName}...`,
        progress: 0,
        autoDismiss: false
      });
    } else if (progress === 100) {
      addNotification({
        type: 'success',
        title: 'Upload Complete',
        message: `${fileName} has been uploaded successfully!`,
        autoDismiss: true,
        dismissAfter: 3000
      });
    } else {
      // Update existing progress notification
      setNotifications(prev => 
        prev.map(n => 
          n.type === 'progress' && n.message.includes(fileName)
            ? { ...n, progress, message: `Uploading ${fileName}... ${progress}%` }
            : n
        )
      );
    }
  }, [addNotification]);

  // Step completion notification
  const showStepCompletion = useCallback((stepName: string, isComplete: boolean, errors: string[] = []) => {
    if (isComplete) {
      addNotification({
        type: 'success',
        title: 'Step Complete',
        message: `${stepName} has been completed successfully!`,
        autoDismiss: true,
        dismissAfter: 3000
      });
    } else if (errors.length > 0) {
      addNotification({
        type: 'error',
        title: 'Step Incomplete',
        message: `${stepName} has ${errors.length} error(s) that need to be fixed.`,
        actionRequired: true,
        autoDismiss: false
      });
    }
  }, [addNotification]);

  // Application status notification
  const showApplicationStatus = useCallback((status: string, message: string) => {
    let type: NotificationItem['type'] = 'info';
    
    switch (status) {
      case 'saved':
        type = 'success';
        break;
      case 'submitted':
        type = 'success';
        break;
      case 'error':
        type = 'error';
        break;
      case 'warning':
        type = 'warning';
        break;
      default:
        type = 'info';
    }

    addNotification({
      type,
      title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message,
      autoDismiss: type === 'success',
      dismissAfter: type === 'success' ? 5000 : undefined
    });
  }, [addNotification]);

  // Document verification notification
  const showDocumentVerification = useCallback((documentName: string, status: string) => {
    let type: NotificationItem['type'] = 'info';
    let title = 'Document Verification';
    let message = '';

    switch (status) {
      case 'verified':
        type = 'success';
        message = `${documentName} has been verified successfully!`;
        break;
      case 'failed':
        type = 'error';
        message = `${documentName} verification failed. Please upload a clearer copy.`;
        break;
      case 'pending':
        type = 'info';
        message = `${documentName} is being processed for verification.`;
        break;
      default:
        message = `${documentName} status: ${status}`;
    }

    addNotification({
      type,
      title,
      message,
      autoDismiss: type === 'success',
      dismissAfter: type === 'success' ? 3000 : undefined
    });
  }, [addNotification]);

  // Auto-save notification
  const showAutoSave = useCallback((saved: boolean, error?: string) => {
    if (saved) {
      addNotification({
        type: 'success',
        title: 'Auto-Save',
        message: 'Your progress has been automatically saved.',
        autoDismiss: true,
        dismissAfter: 2000
      });
    } else if (error) {
      addNotification({
        type: 'error',
        title: 'Auto-Save Failed',
        message: `Failed to save progress: ${error}`,
        actionRequired: true,
        autoDismiss: false
      });
    }
  }, [addNotification]);

  // Network status notification
  const showNetworkStatus = useCallback((isOnline: boolean) => {
    if (isOnline) {
      addNotification({
        type: 'success',
        title: 'Connection Restored',
        message: 'Your internet connection has been restored.',
        autoDismiss: true,
        dismissAfter: 3000
      });
    } else {
      addNotification({
        type: 'warning',
        title: 'No Internet Connection',
        message: 'You are currently offline. Some features may be limited.',
        actionRequired: false,
        autoDismiss: false
      });
    }
  }, [addNotification]);

  // Get unread notifications count
  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: NotificationItem['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Get action required notifications
  const getActionRequiredNotifications = useCallback(() => {
    return notifications.filter(n => n.actionRequired);
  }, [notifications]);

  return {
    // State
    notifications,
    validationResults,
    
    // Actions
    addNotification,
    dismissNotification,
    markAsRead,
    clearAllNotifications,
    updateValidationResults,
    
    // Specialized notifications
    showUploadProgress,
    showStepCompletion,
    showApplicationStatus,
    showDocumentVerification,
    showAutoSave,
    showNetworkStatus,
    
    // Getters
    getUnreadCount,
    getNotificationsByType,
    getActionRequiredNotifications,
  };
}
