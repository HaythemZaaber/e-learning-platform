// =============================================================================
// PAYMENT API SERVICE
// =============================================================================

import { loadStripe, Stripe } from '@stripe/stripe-js';

// =============================================================================
// TYPES
// =============================================================================

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
  payment_method_types: string[];
  created: number;
  metadata: Record<string, string>;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  bookingId: string;
  instructorId: string;
  studentId: string;
  sessionTitle: string;
  metadata?: Record<string, string>;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  paymentMethodId?: string;
  returnUrl?: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details: {
    name?: string;
    email?: string;
  };
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  description: string;
  bookingId: string;
  instructorId: string;
  studentId: string;
}

export interface RefundRequest {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
  metadata?: Record<string, string>;
}

export interface RefundResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  reason?: string;
  created: number;
}

// =============================================================================
// API CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// =============================================================================
// API SERVICE
// =============================================================================

class PaymentApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/payments${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData.code
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // Create payment intent for session booking
  async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntent> {
    return this.request<PaymentIntent>('/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Confirm payment
  async confirmPayment(data: ConfirmPaymentRequest): Promise<{ success: boolean; paymentIntent: PaymentIntent }> {
    return this.request<{ success: boolean; paymentIntent: PaymentIntent }>('/confirm-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get payment intent details
  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    return this.request<PaymentIntent>(`/payment-intent/${paymentIntentId}`);
  }

  // Get user's payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return this.request<PaymentMethod[]>('/payment-methods');
  }

  // Save payment method
  async savePaymentMethod(paymentMethodId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/save-payment-method', {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId }),
    });
  }

  // Delete payment method
  async deletePaymentMethod(paymentMethodId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/payment-methods/${paymentMethodId}`, {
      method: 'DELETE',
    });
  }

  // Get payment history
  async getPaymentHistory(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaymentHistory[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return this.request<PaymentHistory[]>(`/payment-history?${params.toString()}`);
  }

  // Process refund
  async processRefund(data: RefundRequest): Promise<RefundResponse> {
    return this.request<RefundResponse>('/refund', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get refund details
  async getRefund(refundId: string): Promise<RefundResponse> {
    return this.request<RefundResponse>(`/refunds/${refundId}`);
  }

  // Transfer funds to instructor (after session completion)
  async transferToInstructor(data: {
    paymentIntentId: string;
    instructorId: string;
    amount: number;
    currency: string;
    description: string;
  }): Promise<{ success: boolean; transferId: string }> {
    return this.request<{ success: boolean; transferId: string }>('/transfer-to-instructor', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get instructor earnings
  async getInstructorEarnings(instructorId: string, filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<{
    totalEarnings: number;
    pendingEarnings: number;
    completedEarnings: number;
    currency: string;
    transactions: Array<{
      id: string;
      amount: number;
      status: string;
      created: number;
      description: string;
    }>;
  }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/instructor-earnings/${instructorId}?${params.toString()}`);
  }

  // Get student spending
  async getStudentSpending(studentId: string, filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<{
    totalSpent: number;
    currency: string;
    transactions: Array<{
      id: string;
      amount: number;
      status: string;
      created: number;
      description: string;
      instructorName: string;
    }>;
  }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/student-spending/${studentId}?${params.toString()}`);
  }
}

// =============================================================================
// STRIPE INTEGRATION
// =============================================================================

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// =============================================================================
// PAYMENT UTILITIES
// =============================================================================

export const formatAmount = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Stripe amounts are in cents
};

export const formatAmountForDisplay = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'succeeded':
      return 'text-green-600 bg-green-100';
    case 'processing':
      return 'text-blue-600 bg-blue-100';
    case 'requires_payment_method':
    case 'requires_confirmation':
    case 'requires_action':
      return 'text-yellow-600 bg-yellow-100';
    case 'canceled':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getPaymentStatusText = (status: string): string => {
  switch (status) {
    case 'succeeded':
      return 'Payment Successful';
    case 'processing':
      return 'Processing';
    case 'requires_payment_method':
      return 'Payment Method Required';
    case 'requires_confirmation':
      return 'Confirmation Required';
    case 'requires_action':
      return 'Action Required';
    case 'canceled':
      return 'Payment Canceled';
    default:
      return 'Unknown Status';
  }
};

// =============================================================================
// EXPORTS
// =============================================================================

export const paymentApi = new PaymentApiService();
export { ApiError };

