// =============================================================================
// PAYMENT REACT QUERY HOOKS
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  paymentApi, 
  ApiError,
  CreatePaymentIntentRequest,
  ConfirmPaymentRequest,
  RefundRequest,
  PaymentIntent,
  PaymentMethod,
  PaymentHistory
} from '../services/api/paymentApi';

// =============================================================================
// PAYMENT INTENT HOOKS
// =============================================================================

export const useCreatePaymentIntent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePaymentIntentRequest) => paymentApi.createPaymentIntent(data),
    onSuccess: (data) => {
      toast.success('Payment intent created successfully');
      queryClient.invalidateQueries({ queryKey: ['paymentIntents'] });
    },
    onError: (error: ApiError) => {
      console.error('Error creating payment intent:', error);
      toast.error(error.message || 'Failed to create payment intent');
    },
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ConfirmPaymentRequest) => paymentApi.confirmPayment(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Payment confirmed successfully');
        queryClient.invalidateQueries({ queryKey: ['paymentIntents'] });
        queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      } else {
        toast.error('Payment confirmation failed');
      }
    },
    onError: (error: ApiError) => {
      console.error('Error confirming payment:', error);
      toast.error(error.message || 'Failed to confirm payment');
    },
  });
};

export const usePaymentIntent = (paymentIntentId: string) => {
  return useQuery({
    queryKey: ['paymentIntent', paymentIntentId],
    queryFn: () => paymentApi.getPaymentIntent(paymentIntentId),
    enabled: !!paymentIntentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =============================================================================
// PAYMENT METHODS HOOKS
// =============================================================================

export const usePaymentMethods = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['paymentMethods', user?.id],
    queryFn: () => paymentApi.getPaymentMethods(),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSavePaymentMethod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentMethodId: string) => paymentApi.savePaymentMethod(paymentMethodId),
    onSuccess: () => {
      toast.success('Payment method saved successfully');
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
    onError: (error: ApiError) => {
      console.error('Error saving payment method:', error);
      toast.error(error.message || 'Failed to save payment method');
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentMethodId: string) => paymentApi.deletePaymentMethod(paymentMethodId),
    onSuccess: () => {
      toast.success('Payment method deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
    onError: (error: ApiError) => {
      console.error('Error deleting payment method:', error);
      toast.error(error.message || 'Failed to delete payment method');
    },
  });
};

// =============================================================================
// PAYMENT HISTORY HOOKS
// =============================================================================

export const usePaymentHistory = (filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['paymentHistory', user?.id, filters],
    queryFn: () => paymentApi.getPaymentHistory(filters),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =============================================================================
// REFUND HOOKS
// =============================================================================

export const useProcessRefund = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RefundRequest) => paymentApi.processRefund(data),
    onSuccess: (data) => {
      toast.success('Refund processed successfully');
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
    },
    onError: (error: ApiError) => {
      console.error('Error processing refund:', error);
      toast.error(error.message || 'Failed to process refund');
    },
  });
};

export const useRefund = (refundId: string) => {
  return useQuery({
    queryKey: ['refund', refundId],
    queryFn: () => paymentApi.getRefund(refundId),
    enabled: !!refundId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// =============================================================================
// INSTRUCTOR EARNINGS HOOKS
// =============================================================================

export const useInstructorEarnings = (
  instructorId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }
) => {
  return useQuery({
    queryKey: ['instructorEarnings', instructorId, filters],
    queryFn: () => paymentApi.getInstructorEarnings(instructorId, filters),
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTransferToInstructor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      paymentIntentId: string;
      instructorId: string;
      amount: number;
      currency: string;
      description: string;
    }) => paymentApi.transferToInstructor(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Funds transferred to instructor successfully');
        queryClient.invalidateQueries({ queryKey: ['instructorEarnings'] });
        queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
      } else {
        toast.error('Failed to transfer funds to instructor');
      }
    },
    onError: (error: ApiError) => {
      console.error('Error transferring funds to instructor:', error);
      toast.error(error.message || 'Failed to transfer funds to instructor');
    },
  });
};

// =============================================================================
// STUDENT SPENDING HOOKS
// =============================================================================

export const useStudentSpending = (
  studentId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }
) => {
  return useQuery({
    queryKey: ['studentSpending', studentId, filters],
    queryFn: () => paymentApi.getStudentSpending(studentId, filters),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =============================================================================
// PAYMENT UTILITY HOOKS
// =============================================================================

export const usePaymentStatus = (paymentIntentId: string) => {
  const { data: paymentIntent, isLoading, error } = usePaymentIntent(paymentIntentId);
  
  return {
    paymentIntent,
    isLoading,
    error,
    status: paymentIntent?.status,
    isProcessing: paymentIntent?.status === 'processing',
    isSucceeded: paymentIntent?.status === 'succeeded',
    isCanceled: paymentIntent?.status === 'canceled',
    requiresAction: ['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(paymentIntent?.status || ''),
  };
};

export const usePaymentMethodsCount = () => {
  const { data: paymentMethods, isLoading } = usePaymentMethods();
  
  return {
    count: paymentMethods?.length || 0,
    isLoading,
    hasPaymentMethods: (paymentMethods?.length || 0) > 0,
  };
};

// =============================================================================
// PAYMENT ANALYTICS HOOKS
// =============================================================================

export const usePaymentAnalytics = (userId: string, userType: 'student' | 'instructor') => {
  const studentSpending = useStudentSpending(userId, {});
  const instructorEarnings = useInstructorEarnings(userId, {});
  
  if (userType === 'student') {
    return {
      data: studentSpending.data,
      isLoading: studentSpending.isLoading,
      error: studentSpending.error,
      totalSpent: studentSpending.data?.totalSpent || 0,
      currency: studentSpending.data?.currency || 'USD',
      transactions: studentSpending.data?.transactions || [],
    };
  } else {
    return {
      data: instructorEarnings.data,
      isLoading: instructorEarnings.isLoading,
      error: instructorEarnings.error,
      totalEarnings: instructorEarnings.data?.totalEarnings || 0,
      pendingEarnings: instructorEarnings.data?.pendingEarnings || 0,
      completedEarnings: instructorEarnings.data?.completedEarnings || 0,
      currency: instructorEarnings.data?.currency || 'USD',
      transactions: instructorEarnings.data?.transactions || [],
    };
  }
};

// =============================================================================
// PAYMENT VALIDATION HOOKS
// =============================================================================

export const usePaymentValidation = (amount: number, currency: string = 'USD') => {
  const isValidAmount = amount > 0 && amount <= 999999; // $9,999.99 max
  const isValidCurrency = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'].includes(currency.toUpperCase());
  
  return {
    isValidAmount,
    isValidCurrency,
    isValid: isValidAmount && isValidCurrency,
    errors: {
      amount: !isValidAmount ? 'Amount must be between $0.01 and $9,999.99' : null,
      currency: !isValidCurrency ? 'Currency not supported' : null,
    },
  };
};

// =============================================================================
// PAYMENT ERROR HANDLING
// =============================================================================

export const usePaymentErrorHandler = () => {
  const handlePaymentError = (error: any) => {
    if (error instanceof ApiError) {
      switch (error.code) {
        case 'card_declined':
          toast.error('Your card was declined. Please try a different payment method.');
          break;
        case 'insufficient_funds':
          toast.error('Insufficient funds. Please try a different payment method.');
          break;
        case 'expired_card':
          toast.error('Your card has expired. Please update your payment method.');
          break;
        case 'invalid_cvc':
          toast.error('Invalid CVC. Please check your card details.');
          break;
        case 'processing_error':
          toast.error('Payment processing error. Please try again.');
          break;
        default:
          toast.error(error.message || 'Payment failed. Please try again.');
      }
    } else {
      toast.error('An unexpected error occurred. Please try again.');
    }
  };
  
  return { handlePaymentError };
};

