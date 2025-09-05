import { ApiError } from './sessionBookingApi';

// =============================================================================
// STRIPE CONNECT TYPES
// =============================================================================

export interface StripeConnectAccount {
  id: string;
  object: string;
  business_type: string;
  country: string;
  email: string;
  requirements: any;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
}

export interface CreateStripeConnectAccountRequest {
  country: string;
  email: string;
  businessType: 'individual' | 'company';
  individual?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    dob?: {
      day: number;
      month: number;
      year: number;
    };
  };
  company?: {
    name: string;
    phone?: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
}

export interface StripeConnectAccountResponse {
  success: boolean;
  accountId?: string;
  accountLink?: string;
  account?: StripeConnectAccount;
  error?: string;
}

export interface StripeConnectAccountLinkResponse {
  success: boolean;
  accountLink?: string;
  error?: string;
}

// =============================================================================
// STRIPE CONNECT API SERVICE
// =============================================================================

export class StripeConnectApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  private convertToStripeFormat(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.convertToStripeFormat(item));
    }

    const converted: any = {};
    for (const [key, value] of Object.entries(data)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      converted[snakeKey] = this.convertToStripeFormat(value);
      
      // Debug logging for key conversions
      if (key !== snakeKey) {
        console.log(`Converting key: ${key} -> ${snakeKey}`);
      }
    }
    return converted;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
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
          errorData
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

  // =============================================================================
  // STRIPE CONNECT ACCOUNT MANAGEMENT
  // =============================================================================

  async createStripeConnectAccount(
    accountData: CreateStripeConnectAccountRequest,
    token: string
  ): Promise<StripeConnectAccountResponse> {
    // Convert camelCase to snake_case for Stripe API
    const stripeData = this.convertToStripeFormat(accountData);
    
    // Debug logging
    console.log('API Service: Original data:', accountData);
    console.log('API Service: Converted data:', stripeData);
    
    return this.request<StripeConnectAccountResponse>('/payments/connect/accounts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(stripeData),
    });
  }

  async getStripeConnectAccount(token: string): Promise<StripeConnectAccountResponse> {
    return this.request<StripeConnectAccountResponse>('/payments/connect/accounts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async createStripeConnectAccountLink(token: string): Promise<StripeConnectAccountLinkResponse> {
    return this.request<StripeConnectAccountLinkResponse>('/payments/connect/accounts/links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // =============================================================================
  // PAYMENT PROCESSING
  // =============================================================================

  async createPaymentIntent(
    bookingData: {
      timeSlotId: string;
      offeringId: string;
      studentId: string;
      agreedPrice: number;
      currency: string;
      customTopic?: string;
      studentMessage?: string;
      customRequirements?: string;
      returnUrl: string;
      cancelUrl: string;
    },
    token: string
  ): Promise<{
    success: boolean;
    paymentIntent?: {
      id: string;
      client_secret: string;
      amount: number;
      currency: string;
      status: string;
    };
    error?: string;
  }> {
    return this.request('/payments/intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
  }

  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string,
    token: string
  ): Promise<{
    success: boolean;
    payment?: {
      id: string;
      status: string;
      amount: number;
      currency: string;
    };
    error?: string;
  }> {
    return this.request('/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentIntentId,
        paymentMethodId,
      }),
    });
  }

  async getPaymentIntent(
    paymentIntentId: string,
    token: string
  ): Promise<{
    success: boolean;
    paymentIntent?: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      client_secret: string;
    };
    error?: string;
  }> {
    return this.request(`/payments/intents/${paymentIntentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // =============================================================================
  // PAYMENT METHODS
  // =============================================================================

  async getPaymentMethods(token: string): Promise<{
    success: boolean;
    paymentMethods?: Array<{
      id: string;
      type: string;
      card?: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
      };
    }>;
    error?: string;
  }> {
    return this.request('/payments/methods', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async savePaymentMethod(
    paymentMethodId: string,
    token: string
  ): Promise<{
    success: boolean;
    paymentMethod?: {
      id: string;
      type: string;
    };
    error?: string;
  }> {
    return this.request('/payments/methods', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentMethodId }),
    });
  }

  async deletePaymentMethod(
    paymentMethodId: string,
    token: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    return this.request(`/payments/methods/${paymentMethodId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // =============================================================================
  // PAYMENT HISTORY
  // =============================================================================

  async getPaymentHistory(
    filters: {
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {},
    token: string
  ): Promise<{
    success: boolean;
    payments?: Array<{
      id: string;
      amount: number;
      currency: string;
      status: string;
      created: number;
      description: string;
    }>;
    total?: number;
    error?: string;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/payments/history?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // =============================================================================
  // REFUNDS
  // =============================================================================

  async processRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
    token?: string
  ): Promise<{
    success: boolean;
    refund?: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      reason: string;
    };
    error?: string;
  }> {
    return this.request('/payments/refunds', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentIntentId,
        amount,
        reason,
      }),
    });
  }

  async getRefund(
    refundId: string,
    token: string
  ): Promise<{
    success: boolean;
    refund?: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      reason: string;
      created: number;
    };
    error?: string;
  }> {
    return this.request(`/payments/refunds/${refundId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // =============================================================================
  // INSTRUCTOR PAYOUTS
  // =============================================================================

  async transferToInstructor(
    sessionId: string,
    amount: number,
    token: string
  ): Promise<{
    success: boolean;
    transfer?: {
      id: string;
      amount: number;
      currency: string;
      status: string;
    };
    error?: string;
  }> {
    return this.request('/payments/transfers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        sessionId,
        amount,
      }),
    });
  }

  async getInstructorEarnings(
    filters: {
      startDate?: string;
      endDate?: string;
      status?: string;
    } = {},
    token: string
  ): Promise<{
    success: boolean;
    earnings?: {
      total: number;
      pending: number;
      paid: number;
      currency: string;
      transfers: Array<{
        id: string;
        amount: number;
        status: string;
        created: number;
      }>;
    };
    error?: string;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/payments/earnings?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getStudentSpending(
    filters: {
      startDate?: string;
      endDate?: string;
      status?: string;
    } = {},
    token: string
  ): Promise<{
    success: boolean;
    spending?: {
      total: number;
      pending: number;
      completed: number;
      currency: string;
      payments: Array<{
        id: string;
        amount: number;
        status: string;
        created: number;
        description: string;
      }>;
    };
    error?: string;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/payments/spending?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

// Export singleton instance
export const stripeConnectApi = new StripeConnectApiService();
