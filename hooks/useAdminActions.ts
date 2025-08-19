import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { 
  START_APPLICATION_REVIEW, 
  APPROVE_APPLICATION, 
  REJECT_APPLICATION, 
  REQUEST_MORE_INFORMATION,
  REVIEW_DOCUMENT 
} from '@/graphql/mutations/admin';
import { showToast } from '@/utils/toast';

interface AdminActionState {
  isActionLoading: boolean;
  currentAction: string | null;
}

interface AdminActions {
  startReview: (applicationId: string) => Promise<boolean>;
  approveApplication: (applicationId: string, notes: string) => Promise<boolean>;
  rejectApplication: (applicationId: string, reason: string, requiresResubmission?: boolean) => Promise<boolean>;
  requestMoreInfo: (applicationId: string, requiredInfo: string[], deadline?: Date) => Promise<boolean>;
  reviewDocument: (documentId: string, status: string, notes?: string) => Promise<boolean>;
  state: AdminActionState;
}

export const useAdminActions = (): AdminActions => {
  const [state, setState] = useState<AdminActionState>({
    isActionLoading: false,
    currentAction: null,
  });

  const [startReviewMutation] = useMutation(START_APPLICATION_REVIEW);
  const [approveApplicationMutation] = useMutation(APPROVE_APPLICATION);
  const [rejectApplicationMutation] = useMutation(REJECT_APPLICATION);
  const [requestMoreInfoMutation] = useMutation(REQUEST_MORE_INFORMATION);
  const [reviewDocumentMutation] = useMutation(REVIEW_DOCUMENT);

  const setLoading = (loading: boolean, action?: string) => {
    setState({
      isActionLoading: loading,
      currentAction: action || null,
    });
  };

  const startReview = async (applicationId: string): Promise<boolean> => {
    setLoading(true, 'startReview');
    try {
      const result = await startReviewMutation({
        variables: {
          input: { applicationId }
        }
      });

      if (result.data?.startApplicationReview?.success) {
        showToast('success', 'Review Started', 'Application review has been started successfully.');
        return true;
      } else {
        const error = result.data?.startApplicationReview?.message || 'Failed to start review';
        showToast('error', 'Failed', error);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start review';
      showToast('error', 'Failed', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (applicationId: string, notes: string): Promise<boolean> => {
    if (!notes.trim()) {
      showToast('error', 'Notes Required', 'Please add review notes before approving.');
      return false;
    }

    setLoading(true, 'approveApplication');
    try {
      const result = await approveApplicationMutation({
        variables: {
          input: {
            applicationId,
            notes
          }
        }
      });

      if (result.data?.approveApplication?.success) {
        showToast('success', 'Application Approved', 'Application has been approved successfully.');
        return true;
      } else {
        const error = result.data?.approveApplication?.message || 'Failed to approve application';
        showToast('error', 'Failed', error);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve application';
      showToast('error', 'Failed', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectApplication = async (
    applicationId: string, 
    reason: string, 
    requiresResubmission: boolean = false
  ): Promise<boolean> => {
    if (!reason.trim()) {
      showToast('error', 'Reason Required', 'Please provide a rejection reason.');
      return false;
    }

    setLoading(true, 'rejectApplication');
    try {
      const result = await rejectApplicationMutation({
        variables: {
          input: {
            applicationId,
            reason,
            requiresResubmission
          }
        }
      });

      if (result.data?.rejectApplication?.success) {
        showToast('success', 'Application Rejected', 'Application has been rejected successfully.');
        return true;
      } else {
        const error = result.data?.rejectApplication?.message || 'Failed to reject application';
        showToast('error', 'Failed', error);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject application';
      showToast('error', 'Failed', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestMoreInfo = async (
    applicationId: string, 
    requiredInfo: string[], 
    deadline?: Date
  ): Promise<boolean> => {
    if (requiredInfo.length === 0) {
      showToast('error', 'Required Info', 'Please specify what additional information is needed.');
      return false;
    }

    setLoading(true, 'requestMoreInfo');
    try {
      const deadlineDate = deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      
      const result = await requestMoreInfoMutation({
        variables: {
          input: {
            applicationId,
            requiredInfo,
            deadline: deadlineDate.toISOString()
          }
        }
      });

      if (result.data?.requestMoreInformation?.success) {
        showToast('success', 'More Info Requested', 'Request for more information has been sent successfully.');
        return true;
      } else {
        const error = result.data?.requestMoreInformation?.message || 'Failed to request more information';
        showToast('error', 'Failed', error);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request more information';
      showToast('error', 'Failed', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reviewDocument = async (
    documentId: string, 
    status: string, 
    notes?: string
  ): Promise<boolean> => {
    setLoading(true, 'reviewDocument');
    try {
      const result = await reviewDocumentMutation({
        variables: {
          input: {
            documentId,
            verificationStatus: status,
            notes
          }
        }
      });

      if (result.data?.reviewDocument) {
        showToast('success', 'Document Reviewed', 'Document has been reviewed successfully.');
        return true;
      } else {
        showToast('error', 'Failed', 'Failed to review document.');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to review document';
      showToast('error', 'Failed', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    startReview,
    approveApplication,
    rejectApplication,
    requestMoreInfo,
    reviewDocument,
    state,
  };
};
