import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stripeConnectApi } from '../services/api/stripeConnectApi';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// =============================================================================
// STRIPE CONNECT ACCOUNT HOOKS
// =============================================================================

export const useStripeConnectAccount = () => {
  const { user, getToken } = useAuth();
  
  return useQuery({
    queryKey: ['stripeConnectAccount', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      if (!token) throw new Error('Failed to get authentication token');
      return stripeConnectApi.getStripeConnectAccount(token);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateStripeConnectAccount = () => {
  const { user, getToken } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (accountData: any) => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      if (!token) throw new Error('Failed to get authentication token');
      return stripeConnectApi.createStripeConnectAccount(accountData, token);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Stripe Connect account created successfully');
        queryClient.invalidateQueries({ queryKey: ['stripeConnectAccount'] });
      } else {
        toast.error(data.error || 'Failed to create Stripe Connect account');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create Stripe Connect account');
    },
  });
};

export const useCreateStripeConnectAccountLink = () => {
  const { user, getToken } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      if (!token) throw new Error('Failed to get authentication token');
      return stripeConnectApi.createStripeConnectAccountLink(token);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create onboarding link');
    },
  });
};

// =============================================================================
// PAYMENT INTENT HOOKS
// =============================================================================

export const useCreatePaymentIntent = () => {
  const { user, getToken } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: any) => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      if (!token) throw new Error('Failed to get authentication token');
      return stripeConnectApi.createPaymentIntent(bookingData, token);
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      } else {
        toast.error(data.error || 'Failed to create payment intent');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create payment intent');
    },
  });
};

export const usePaymentIntent = (paymentIntentId: string) => {
  const { user, getToken } = useAuth();
  
  return useQuery({
    queryKey: ['paymentIntent', paymentIntentId],
    queryFn: async () => {
      if (!user?.id || !paymentIntentId) throw new Error('Invalid request');
      const token = await getToken();
      return stripeConnectApi.getPaymentIntent(paymentIntentId, token);
    },
    enabled: !!user?.id && !!paymentIntentId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useConfirmPayment = () => {
  const { user, getToken } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ paymentIntentId, paymentMethodId }: {
      paymentIntentId: string;
      paymentMethodId: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      return stripeConnectApi.confirmPayment(paymentIntentId, paymentMethodId, token);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Payment confirmed successfully');
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
      } else {
        toast.error(data.error || 'Failed to confirm payment');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to confirm payment');
    },
  });
};

// =============================================================================
// PAYMENT METHODS HOOKS
// =============================================================================

export const usePaymentMethods = () => {
  const { user, getToken } = useAuth();
  
  return useQuery({
    queryKey: ['paymentMethods', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      return stripeConnectApi.getPaymentMethods(token);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSavePaymentMethod = () => {
  const { user, getToken } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      return stripeConnectApi.savePaymentMethod(paymentMethodId, token);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Payment method saved successfully');
        queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
      } else {
        toast.error(data.error || 'Failed to save payment method');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save payment method');
    },
  });
};

export const useDeletePaymentMethod = () => {
  const { user, getToken } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      return stripeConnectApi.deletePaymentMethod(paymentMethodId, token);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Payment method deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
      } else {
        toast.error(data.error || 'Failed to delete payment method');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete payment method');
    },
  });
};

// =============================================================================
// PAYMENT HISTORY HOOKS
// =============================================================================

export const usePaymentHistory = (filters: {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
} = {}) => {
  const { user, getToken } = useAuth();
  
  return useQuery({
    queryKey: ['paymentHistory', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      return stripeConnectApi.getPaymentHistory(filters, token);
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// =============================================================================
// REFUND HOOKS
// =============================================================================

export const useProcessRefund = () => {
  const { user, getToken } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ paymentIntentId, amount, reason }: {
      paymentIntentId: string;
      amount?: number;
      reason?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      return stripeConnectApi.processRefund(paymentIntentId, amount, reason, token);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Refund processed successfully');
        queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
      } else {
        toast.error(data.error || 'Failed to process refund');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to process refund');
    },
  });
};

export const useRefund = (refundId: string) => {
  const { user, getToken } = useAuth();
  
  return useQuery({
    queryKey: ['refund', refundId],
    queryFn: async () => {
      if (!user?.id || !refundId) throw new Error('Invalid request');
      const token = await getToken();
      return stripeConnectApi.getRefund(refundId, token);
    },
    enabled: !!user?.id && !!refundId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =============================================================================
// INSTRUCTOR PAYOUT HOOKS
// =============================================================================

export const useTransferToInstructor = () => {
  const { user, getToken } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sessionId, amount }: {
      sessionId: string;
      amount: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      return stripeConnectApi.transferToInstructor(sessionId, amount, token);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Transfer initiated successfully');
        queryClient.invalidateQueries({ queryKey: ['instructorEarnings'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      } else {
        toast.error(data.error || 'Failed to initiate transfer');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to initiate transfer');
    },
  });
};

export const useInstructorEarnings = (filters: {
  startDate?: string;
  endDate?: string;
  status?: string;
} = {}) => {
  const { user, getToken } = useAuth();
  
  return useQuery({
    queryKey: ['instructorEarnings', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      return stripeConnectApi.getInstructorEarnings(filters, token);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStudentSpending = (filters: {
  startDate?: string;
  endDate?: string;
  status?: string;
} = {}) => {
  const { user, getToken } = useAuth();
  
  return useQuery({
    queryKey: ['studentSpending', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      const token = await getToken();
      return stripeConnectApi.getStudentSpending(filters, token);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

export const usePaymentStatus = (paymentIntentId: string) => {
  const { data: paymentIntent } = usePaymentIntent(paymentIntentId);
  
  return {
    isLoading: !paymentIntent,
    status: paymentIntent?.paymentIntent?.status,
    isPending: paymentIntent?.paymentIntent?.status === 'requires_payment_method',
    isProcessing: paymentIntent?.paymentIntent?.status === 'processing',
    isSucceeded: paymentIntent?.paymentIntent?.status === 'succeeded',
    isFailed: paymentIntent?.paymentIntent?.status === 'canceled',
  };
};

export const usePaymentMethodsCount = () => {
  const { data: paymentMethods } = usePaymentMethods();
  
  return {
    count: paymentMethods?.paymentMethods?.length || 0,
    hasMethods: (paymentMethods?.paymentMethods?.length || 0) > 0,
  };
};

export const usePaymentAnalytics = () => {
  const { data: earnings } = useInstructorEarnings();
  const { data: spending } = useStudentSpending();
  
  return {
    instructorEarnings: earnings?.earnings,
    studentSpending: spending?.spending,
    totalEarnings: earnings?.earnings?.total || 0,
    totalSpending: spending?.spending?.total || 0,
  };
};

export const usePaymentValidation = () => {
  const { data: stripeAccount } = useStripeConnectAccount();
  
  return {
    hasStripeAccount: stripeAccount?.success && !!stripeAccount?.account,
    isStripeComplete: stripeAccount?.account?.charges_enabled && 
                     stripeAccount?.account?.payouts_enabled && 
                     stripeAccount?.account?.details_submitted,
    canReceivePayments: stripeAccount?.account?.charges_enabled || false,
    canReceivePayouts: stripeAccount?.account?.payouts_enabled || false,
    requirements: stripeAccount?.account?.requirements,
  };
};

export const usePaymentErrorHandler = () => {
  return {
    handlePaymentError: (error: any) => {
      if (error?.code === 'card_declined') {
        toast.error('Your card was declined. Please try a different payment method.');
      } else if (error?.code === 'insufficient_funds') {
        toast.error('Insufficient funds. Please try a different payment method.');
      } else if (error?.code === 'expired_card') {
        toast.error('Your card has expired. Please update your payment method.');
      } else if (error?.code === 'incorrect_cvc') {
        toast.error('Incorrect CVC. Please check your card details.');
      } else if (error?.code === 'processing_error') {
        toast.error('Payment processing error. Please try again.');
      } else {
        toast.error(error?.message || 'Payment failed. Please try again.');
      }
    },
  };
};

