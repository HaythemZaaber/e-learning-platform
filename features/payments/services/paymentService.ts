// features/payments/services/paymentService.ts
// Comprehensive payment services for the e-learning platform

import {
  PaymentSession,
  CreatePaymentSessionRequest,
  PaymentSessionResponse,
  Coupon,
  ValidateCouponRequest,
  CouponValidationResponse,
  Enrollment,
  CheckoutSession,
  CreateCheckoutSessionRequest,
  PaymentMethod,
  CreatePaymentMethodRequest,
  RefundRequest,
  Refund,
  PaymentAnalytics,
  ApiResponse,
  PaymentSessionApiResponse,
  CouponApiResponse,
  EnrollmentApiResponse,
  CheckoutApiResponse,
  StripePaymentIntent,
  StripeSession,
  StripeCustomer,
  StripePaymentMethod,
  PaymentWebhookEvent,
  formatCurrency,
  calculateDiscount,
  calculateFinalAmount,
} from "@/types/paymentTypes";

// ============================================================================
// API BASE CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// ============================================================================
// API CLIENT UTILITIES
// ============================================================================

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData.code,
      errorData.details
    );
  }

  return response.json();
};

const getAuthHeaders = (token?: string): HeadersInit => {
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ============================================================================
// PAYMENT SESSION SERVICES
// ============================================================================

export const paymentSessionService = {
  /**
   * Create a new payment session for a course
   */
  async createSession(
    request: CreatePaymentSessionRequest,
    token?: string
  ): Promise<PaymentSessionResponse> {
    try {
      // Remove userId from request body since it will be extracted from the token
      const { userId, ...requestBody } = request;

      const response = await fetch(`${API_BASE_URL}/payments/sessions`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(requestBody),
      });

      const data = await handleApiResponse<PaymentSessionApiResponse>(response);

      return {
        success: data.success,
        session: data.session,
        error: data.error,
        redirectUrl: data.redirectUrl,
      };
    } catch (error) {
      console.error("Error creating payment session:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment session",
      };
    }
  },

  /**
   * Get payment session by ID
   */
  async getSession(
    sessionId: string,
    token?: string
  ): Promise<PaymentSession | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/sessions/${sessionId}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<PaymentSessionApiResponse>(response);
      return data.session || null;
    } catch (error) {
      console.error("Error fetching payment session:", error);
      return null;
    }
  },

  /**
   * 🔧 CRITICAL: Get payment session by Stripe session ID
   * This method fixes the infinite loop issue on the success page
   */
  async getSessionByStripeId(
    stripeSessionId: string,
    token?: string
  ): Promise<PaymentSession | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/sessions/stripe/${stripeSessionId}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<PaymentSessionApiResponse>(response);
      return data.session || null;
    } catch (error) {
      console.error("Error fetching payment session by Stripe ID:", error);
      return null;
    }
  },

  /**
   * Get payment session by PayPal order ID
   */
  async getSessionByPayPalOrderId(
    paypalOrderId: string,
    token?: string
  ): Promise<PaymentSession | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/sessions/paypal/${paypalOrderId}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<PaymentSessionApiResponse>(response);
      return data.session || null;
    } catch (error) {
      console.error(
        "Error fetching payment session by PayPal order ID:",
        error
      );
      return null;
    }
  },

  /**
   * Verify and update payment session status from Stripe
   */
  async verifyPaymentSessionStatus(
    stripeSessionId: string,
    token?: string
  ): Promise<{
    success: boolean;
    session?: PaymentSession;
    updated?: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/sessions/stripe/${stripeSessionId}/verify`,
        {
          method: "POST",
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<{
        success: boolean;
        session?: PaymentSession;
        updated?: boolean;
        error?: string;
      }>(response);
      return data as {
        success: boolean;
        session?: PaymentSession;
        updated?: boolean;
        error?: string;
      };
    } catch (error) {
      console.error("Error verifying payment session status:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify payment session",
      };
    }
  },

  /**
   * Update payment session status
   */
  async updateSession(
    sessionId: string,
    updates: Partial<PaymentSession>,
    token?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/sessions/${sessionId}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(token),
          body: JSON.stringify(updates),
        }
      );

      const data = await handleApiResponse<ApiResponse>(response);
      return data.success;
    } catch (error) {
      console.error("Error updating payment session:", error);
      return false;
    }
  },

  /**
   * Cancel payment session
   */
  async cancelSession(sessionId: string, token?: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/sessions/${sessionId}/cancel`,
        {
          method: "POST",
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<ApiResponse>(response);
      return data.success;
    } catch (error) {
      console.error("Error canceling payment session:", error);
      return false;
    }
  },

  /**
   * Get user's payment sessions
   */
  async getUserSessions(
    userId: string,
    token?: string
  ): Promise<PaymentSession[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/sessions/user/${userId}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<{ sessions: PaymentSession[] }>(
        response
      );
      return data.sessions || [];
    } catch (error) {
      console.error("Error fetching user payment sessions:", error);
      return [];
    }
  },
};

// ============================================================================
// COUPON SERVICES
// ============================================================================

export const couponService = {
  /**
   * Validate a coupon code
   */
  async validateCoupon(
    request: ValidateCouponRequest,
    token?: string
  ): Promise<CouponValidationResponse> {
    try {
      // Remove userId from request body since it will be extracted from the token
      const { userId, ...requestBody } = request;

      const response = await fetch(
        `${API_BASE_URL}/payments/coupons/validate`,
        {
          method: "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify(requestBody),
        }
      );

      const data = await handleApiResponse<CouponApiResponse>(response);

      return {
        isValid: data.isValid || false,
        coupon: data.coupon,
        discountAmount: data.discountAmount || 0,
        finalAmount: data.finalAmount || request.amount,
        error: data.error,
        message: data.message,
      };
    } catch (error) {
      console.error("Error validating coupon:", error);
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: request.amount,
        error:
          error instanceof Error ? error.message : "Failed to validate coupon",
      };
    }
  },

  /**
   * Get coupon by code
   */
  async getCoupon(code: string, token?: string): Promise<Coupon | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/coupons/${code}`, {
        headers: getAuthHeaders(token),
      });

      const data = await handleApiResponse<CouponApiResponse>(response);
      return data.coupon || null;
    } catch (error) {
      console.error("Error fetching coupon:", error);
      return null;
    }
  },

  /**
   * Get all active coupons
   */
  async getActiveCoupons(token?: string): Promise<Coupon[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/coupons/active`, {
        headers: getAuthHeaders(token),
      });

      const data = await handleApiResponse<{ coupons: Coupon[] }>(response);
      return data.coupons || [];
    } catch (error) {
      console.error("Error fetching active coupons:", error);
      return [];
    }
  },
};

// ============================================================================
// ENROLLMENT SERVICES
// ============================================================================

export const enrollmentService = {
  /**
   * Create enrollment for a course
   */
  async createEnrollment(
    courseId: string,
    paymentSessionId?: string,
    token?: string
  ): Promise<Enrollment | null> {
    try {
      // Remove userId from request body since it will be extracted from the token
      const response = await fetch(`${API_BASE_URL}/payments/enrollments`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          courseId,
          paymentSessionId,
        }),
      });

      const data = await handleApiResponse(response);
      return data as Enrollment;
    } catch (error) {
      console.error("Error creating enrollment:", error);
      return null;
    }
  },

  /**
   * Get user's enrollments
   */
  async getUserEnrollments(
    userId: string,
    token?: string
  ): Promise<Enrollment[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/enrollments/user/${userId}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<{ enrollments: Enrollment[] }>(
        response
      );
      return data.enrollments || [];
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      return [];
    }
  },

  /**
   * Get enrollment by course ID
   */
  async getEnrollmentByCourse(
    courseId: string,
    token?: string
  ): Promise<Enrollment | null> {
    try {
      // Debug: Check if courseId is valid
      if (!courseId || courseId === "undefined") {
        console.error(
          "Invalid courseId provided to getEnrollmentByCourse:",
          courseId
        );
        return null;
      }

      const response = await fetch(
        `${API_BASE_URL}/payments/enrollments/course/${courseId}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      // If enrollment not found (404), return null (this is expected)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // If it's a "not found" error (404), this is expected - enrollment doesn't exist yet
        if (response.status === 404) {
          return null;
        }
        // For other errors (400, 500, etc.), throw to be caught below
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await handleApiResponse(response);
      return data as Enrollment;
    } catch (error) {
      // Only log unexpected errors, not "not found" errors
      if (
        error instanceof Error &&
        !error.message.includes("Enrollment not found")
      ) {
        console.error("Error fetching enrollment:", error);
      }
      return null;
    }
  },

  /**
   * Update enrollment
   */
  async updateEnrollment(
    enrollmentId: string,
    updates: Partial<Enrollment>,
    token?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/enrollments/${enrollmentId}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(token),
          body: JSON.stringify(updates),
        }
      );

      const data = await handleApiResponse<ApiResponse>(response);
      return data.success;
    } catch (error) {
      console.error("Error updating enrollment:", error);
      return false;
    }
  },

  /**
   * Cancel enrollment
   */
  async cancelEnrollment(
    enrollmentId: string,
    token?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/enrollments/${enrollmentId}/cancel`,
        {
          method: "POST",
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<ApiResponse>(response);
      return data.success;
    } catch (error) {
      console.error("Error canceling enrollment:", error);
      return false;
    }
  },
};

// ============================================================================
// CHECKOUT SERVICES
// ============================================================================

export const checkoutService = {
  /**
   * Create checkout session
   */
  async createCheckoutSession(
    request: CreateCheckoutSessionRequest,
    token?: string
  ): Promise<CheckoutSession | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/sessions`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(request),
      });

      const data = await handleApiResponse<CheckoutApiResponse>(response);
      return data.checkoutSession || null;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return null;
    }
  },

  /**
   * Get checkout session by ID
   */
  async getCheckoutSession(
    sessionId: string,
    token?: string
  ): Promise<CheckoutSession | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/checkout/sessions/${sessionId}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<CheckoutApiResponse>(response);
      return data.checkoutSession || null;
    } catch (error) {
      console.error("Error fetching checkout session:", error);
      return null;
    }
  },

  /**
   * Complete checkout session
   */
  async completeCheckoutSession(
    sessionId: string,
    token?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/checkout/sessions/${sessionId}/complete`,
        {
          method: "POST",
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<ApiResponse>(response);
      return data.success;
    } catch (error) {
      console.error("Error completing checkout session:", error);
      return false;
    }
  },
};

// ============================================================================
// PAYMENT METHOD SERVICES
// ============================================================================

export const paymentMethodService = {
  /**
   * Get user's payment methods
   */
  async getUserPaymentMethods(
    userId: string,
    token?: string
  ): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/methods/user/${userId}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<{ paymentMethods: PaymentMethod[] }>(
        response
      );
      return data.paymentMethods || [];
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return [];
    }
  },

  /**
   * Add payment method
   */
  async addPaymentMethod(
    request: CreatePaymentMethodRequest,
    token?: string
  ): Promise<PaymentMethod | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/methods`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(request),
      });

      const data = await handleApiResponse<{ paymentMethod: PaymentMethod }>(
        response
      );
      return data.paymentMethod || null;
    } catch (error) {
      console.error("Error adding payment method:", error);
      return null;
    }
  },

  /**
   * Remove payment method
   */
  async removePaymentMethod(
    methodId: string,
    token?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/methods/${methodId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<ApiResponse>(response);
      return data.success;
    } catch (error) {
      console.error("Error removing payment method:", error);
      return false;
    }
  },

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(
    methodId: string,
    token?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/methods/${methodId}/default`,
        {
          method: "POST",
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<ApiResponse>(response);
      return data.success;
    } catch (error) {
      console.error("Error setting default payment method:", error);
      return false;
    }
  },
};

// ============================================================================
// REFUND SERVICES
// ============================================================================

export const refundService = {
  /**
   * Create refund
   */
  async createRefund(
    request: RefundRequest,
    token?: string
  ): Promise<Refund | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/refunds`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(request),
      });

      const data = await handleApiResponse<{ refund: Refund }>(response);
      return data.refund || null;
    } catch (error) {
      console.error("Error creating refund:", error);
      return null;
    }
  },

  /**
   * Get refund by ID
   */
  async getRefund(refundId: string, token?: string): Promise<Refund | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/refunds/${refundId}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<{ refund: Refund }>(response);
      return data.refund || null;
    } catch (error) {
      console.error("Error fetching refund:", error);
      return null;
    }
  },

  /**
   * Get refunds for payment session
   */
  async getRefundsByPaymentSession(
    paymentSessionId: string,
    token?: string
  ): Promise<Refund[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/refunds/session/${paymentSessionId}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<{ refunds: Refund[] }>(response);
      return data.refunds || [];
    } catch (error) {
      console.error("Error fetching refunds:", error);
      return [];
    }
  },
};

// ============================================================================
// ANALYTICS SERVICES
// ============================================================================

export const analyticsService = {
  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(
    userId?: string,
    dateRange?: string,
    token?: string
  ): Promise<PaymentAnalytics | null> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);
      if (dateRange) params.append("dateRange", dateRange);

      const response = await fetch(
        `${API_BASE_URL}/payments/analytics?${params}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<{ analytics: PaymentAnalytics }>(
        response
      );
      return data.analytics || null;
    } catch (error) {
      console.error("Error fetching payment analytics:", error);
      return null;
    }
  },
};

// ============================================================================
// STRIPE INTEGRATION SERVICES
// ============================================================================

export const stripeService = {
  /**
   * Create Stripe payment intent
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, any>,
    token?: string
  ): Promise<StripePaymentIntent | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/stripe/payment-intent`,
        {
          method: "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify({
            amount,
            currency,
            metadata,
          }),
        }
      );

      const data = await handleApiResponse<{
        paymentIntent: StripePaymentIntent;
      }>(response);
      return data.paymentIntent || null;
    } catch (error) {
      console.error("Error creating Stripe payment intent:", error);
      return null;
    }
  },

  /**
   * Create Stripe checkout session
   */
  async createCheckoutSession(
    items: Array<{ price: string; quantity: number }>,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, any>,
    token?: string
  ): Promise<StripeSession | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/stripe/checkout-session`,
        {
          method: "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify({
            items,
            successUrl,
            cancelUrl,
            metadata,
          }),
        }
      );

      const data = await handleApiResponse<{ session: StripeSession }>(
        response
      );
      return data.session || null;
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      return null;
    }
  },

  /**
   * Create or retrieve Stripe customer
   */
  async createCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, any>,
    token?: string
  ): Promise<StripeCustomer | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/stripe/customers`,
        {
          method: "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify({
            email,
            name,
            metadata,
          }),
        }
      );

      const data = await handleApiResponse<{ customer: StripeCustomer }>(
        response
      );
      return data.customer || null;
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      return null;
    }
  },

  /**
   * Get Stripe customer
   */
  async getCustomer(
    customerId: string,
    token?: string
  ): Promise<StripeCustomer | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/stripe/customers/${customerId}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<{ customer: StripeCustomer }>(
        response
      );
      return data.customer || null;
    } catch (error) {
      console.error("Error fetching Stripe customer:", error);
      return null;
    }
  },
};

// ============================================================================
// PAYPAL INTEGRATION SERVICES
// ============================================================================

export const paypalService = {
  /**
   * Capture a PayPal order
   */
  async captureOrder(
    orderId: string,
    token?: string
  ): Promise<{
    success: boolean;
    session?: PaymentSession;
    enrollment?: any;
  } | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/paypal/capture/${orderId}`,
        {
          method: "POST",
          headers: getAuthHeaders(token),
        }
      );

      const data = await handleApiResponse<{
        success: boolean;
        session?: PaymentSession;
        enrollment?: any;
      }>(response);
      return data || null;
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      return null;
    }
  },
};

// ============================================================================
// WEBHOOK SERVICES
// ============================================================================

export const webhookService = {
  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(event: PaymentWebhookEvent): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/webhooks/stripe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      const data = await handleApiResponse<ApiResponse>(response);
      return data.success;
    } catch (error) {
      console.error("Error handling webhook:", error);
      return false;
    }
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const paymentUtils = {
  /**
   * Format amount for display
   */
  formatAmount: (amount: number, currency: string = "USD"): string => {
    return formatCurrency(amount, currency as any);
  },

  /**
   * Calculate discount amount
   */
  calculateDiscountAmount: (
    originalAmount: number,
    discountType: string,
    discountValue: number
  ): number => {
    return calculateDiscount(
      originalAmount,
      discountType as any,
      discountValue
    );
  },

  /**
   * Calculate final amount after discount
   */
  calculateFinalAmountAfterDiscount: (
    originalAmount: number,
    discountAmount: number
  ): number => {
    return calculateFinalAmount(originalAmount, discountAmount);
  },

  /**
   * Validate payment form data
   */
  validatePaymentForm: (
    formData: any
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.email || !formData.email.includes("@")) {
      errors.push("Valid email is required");
    }

    if (!formData.name || formData.name.trim().length < 2) {
      errors.push("Name is required (minimum 2 characters)");
    }

    if (
      !formData.cardNumber ||
      formData.cardNumber.replace(/\s/g, "").length < 13
    ) {
      errors.push("Valid card number is required");
    }

    if (!formData.cardExpiry || !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      errors.push("Valid expiry date is required (MM/YY format)");
    }

    if (!formData.cardCvc || formData.cardCvc.length < 3) {
      errors.push("Valid CVC is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Format card number for display
   */
  formatCardNumber: (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  },

  /**
   * Mask card number for security
   */
  maskCardNumber: (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, "");
    if (cleaned.length < 4) return cleaned;
    return `**** **** **** ${cleaned.slice(-4)}`;
  },
};

// ============================================================================
// DEFAULT EXPORTS
// ============================================================================

export default {
  paymentSessionService,
  couponService,
  enrollmentService,
  checkoutService,
  paymentMethodService,
  refundService,
  analyticsService,
  stripeService,
  webhookService,
  paymentUtils,
};
