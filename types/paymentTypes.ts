// types/paymentTypes.ts
// Comprehensive payment types for the e-learning platform

import { Course } from "@/types/courseTypes";
import { User } from "@/types/userTypes";

// ============================================================================
// PAYMENT ENUMS (Aligned with Prisma Schema)
// ============================================================================

export type PaymentStatus = 
  | "FREE" 
  | "PENDING" 
  | "PAID" 
  | "FAILED" 
  | "REFUNDED" 
  | "PARTIAL_REFUND" 
  | "CANCELED" 
  | "EXPIRED";

export type PaymentSessionStatus = 
  | "PENDING" 
  | "PROCESSING" 
  | "COMPLETED" 
  | "FAILED" 
  | "CANCELED" 
  | "EXPIRED";

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export type PaymentMethodType = 
  | "card" 
  | "bank_account" 
  | "paypal" 
  | "apple_pay" 
  | "google_pay" 
  | "crypto";

export type Currency = 
  | "USD" 
  | "EUR" 
  | "GBP" 
  | "JPY" 
  | "CAD" 
  | "AUD" 
  | "CHF" 
  | "CNY" 
  | "INR" 
  | "BRL";

// ============================================================================
// PAYMENT SESSION INTERFACES
// ============================================================================

export interface PaymentSession {
  id: string;
  courseId: string;
  userId: string;
  status: PaymentSessionStatus;
  amount: number; // Amount in cents
  currency: Currency;
  paymentIntentId?: string;
  enrollmentId?: string;
  metadata: Record<string, any>;

  // Stripe-specific fields
  stripeSessionId?: string;
  stripeCustomerId?: string;

  // Coupon and discount information
  couponCode?: string;
  discountAmount: number;
  finalAmount: number; // Amount after discounts

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;

  // Relationships
  course?: Course;
  user?: User;
  enrollment?: Enrollment;
}

export interface CreatePaymentSessionRequest {
  courseId: string;
  userId?: string; // Optional since it will be extracted from the token
  couponCode?: string;
  metadata?: Record<string, any>;
  successUrl?: string; // URL to redirect to after successful payment
  cancelUrl?: string; // URL to redirect to after cancelled payment
}

export interface PaymentSessionResponse {
  success: boolean;
  session?: PaymentSession;
  error?: string;
  redirectUrl?: string;
}

// ============================================================================
// PAYMENT METHOD INTERFACES
// ============================================================================

export interface PaymentMethod {
  id: string;
  userId: string;
  stripePaymentMethodId: string;
  type: PaymentMethodType;
  cardBrand?: string;
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  billingDetails: BillingDetails;
  isDefault: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingDetails {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface CreatePaymentMethodRequest {
  paymentMethodId: string;
  billingDetails?: BillingDetails;
  isDefault?: boolean;
}

// ============================================================================
// COUPON INTERFACES
// ============================================================================

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number; // Percentage or fixed amount
  currency: Currency;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;

  // Validity period
  validFrom?: Date;
  validUntil?: Date;

  // Usage restrictions
  minimumAmount?: number; // Minimum order amount in cents
  maximumDiscount?: number; // Maximum discount amount in cents
  applicableCourses: string[]; // Course IDs this coupon applies to

  // Metadata
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValidateCouponRequest {
  code: string;
  courseId: string;
  userId?: string; // Optional since it will be extracted from the token
  amount: number; // Amount in cents
}

export interface CouponValidationResponse {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  finalAmount: number;
  error?: string;
  message?: string;
}

// ============================================================================
// ENROLLMENT INTERFACES
// ============================================================================

export interface Enrollment {
  id: string;
  enrolledAt: Date;
  completedAt?: Date;
  status: EnrollmentStatus;
  progress: number; // 0-100
  currentLectureId?: string;

  // Enhanced enrollment features
  enrollmentSource: EnrollmentSource;
  completedLectures: number;
  totalLectures: number;

  // Payment info
  paymentStatus: PaymentStatus;
  paymentId?: string;
  amountPaid?: number;
  discountApplied?: number;

  // Learning analytics
  totalTimeSpent: number; // in minutes
  streakDays: number;
  lastAccessedAt?: Date;

  // Certificates
  certificateEarned: boolean;
  certificateEarnedAt?: Date;

  // Additional fields from GraphQL queries
  type: EnrollmentType;
  source: EnrollmentSource;
  amount: number;
  currency: Currency;
  paidAt?: Date;
  expiresAt?: Date;
  notes?: string;
  completionPercentage: number;

  // Relationships
  userId: string;
  courseId: string;
  paymentSessions?: PaymentSession[];
}

export type EnrollmentStatus = 
  | "ACTIVE" 
  | "COMPLETED" 
  | "CANCELLED" 
  | "SUSPENDED" 
  | "REFUNDED" 
  | "EXPIRED";

export type EnrollmentType = 
  | "FREE" 
  | "PAID" 
  | "SUBSCRIPTION" 
  | "INVITATION_ONLY" 
  | "WAITLIST";

export type EnrollmentSource = 
  | "DIRECT" 
  | "REFERRAL" 
  | "PROMOTION" 
  | "BUNDLE" 
  | "LEARNING_PATH";

// ============================================================================
// CHECKOUT INTERFACES
// ============================================================================

export interface CheckoutItem {
  courseId: string;
  course: Course;
  price: number;
  originalPrice?: number;
  currency: Currency;
  quantity: number;
}

export interface CheckoutSession {
  id: string;
  userId: string;
  items: CheckoutItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  currency: Currency;
  couponCode?: string;
  coupon?: Coupon;
  status: "pending" | "completed" | "failed" | "canceled";
  paymentSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface CreateCheckoutSessionRequest {
  items: Array<{
    courseId: string;
    quantity?: number;
  }>;
  couponCode?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// STRIPE INTERFACES
// ============================================================================

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
  payment_method_types: string[];
  metadata: Record<string, any>;
}

export interface StripeSession {
  id: string;
  payment_intent?: string;
  payment_status: string;
  status: string;
  url?: string;
  metadata: Record<string, any>;
}

export interface StripeCustomer {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  metadata: Record<string, any>;
}

export interface StripePaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
}

// ============================================================================
// PAYMENT WEBHOOK INTERFACES
// ============================================================================

export interface PaymentWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  livemode: boolean;
}

export interface PaymentWebhookHandler {
  handlePaymentIntentSucceeded: (event: PaymentWebhookEvent) => Promise<void>;
  handlePaymentIntentFailed: (event: PaymentWebhookEvent) => Promise<void>;
  handleCheckoutSessionCompleted: (event: PaymentWebhookEvent) => Promise<void>;
  handleInvoicePaymentSucceeded: (event: PaymentWebhookEvent) => Promise<void>;
  handleInvoicePaymentFailed: (event: PaymentWebhookEvent) => Promise<void>;
}

// ============================================================================
// PAYMENT ANALYTICS INTERFACES
// ============================================================================

export interface PaymentAnalytics {
  totalRevenue: number;
  currency: Currency;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageOrderValue: number;
  conversionRate: number;
  refundRate: number;
  
  // Time-based analytics
  dailyRevenue: Array<{ date: string; revenue: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  
  // Course performance
  topPerformingCourses: Array<{
    courseId: string;
    courseTitle: string;
    revenue: number;
    enrollments: number;
  }>;
  
  // Payment method distribution
  paymentMethodDistribution: Array<{
    method: PaymentMethodType;
    count: number;
    percentage: number;
  }>;
}

// ============================================================================
// REFUND INTERFACES
// ============================================================================

export interface RefundRequest {
  paymentSessionId: string;
  amount?: number; // Partial refund amount in cents
  reason: string;
  metadata?: Record<string, any>;
}

export interface Refund {
  id: string;
  paymentSessionId: string;
  amount: number;
  currency: Currency;
  reason: string;
  status: "pending" | "succeeded" | "failed";
  stripeRefundId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
}

export interface PaymentSessionApiResponse extends ApiResponse {
  session?: PaymentSession;
  redirectUrl?: string;
}

export interface CouponApiResponse extends ApiResponse {
  coupon?: Coupon;
  discountAmount?: number;
  finalAmount?: number;
}

export interface EnrollmentApiResponse extends ApiResponse {
  enrollment?: Enrollment;
  paymentSession?: PaymentSession;
}

export interface CheckoutApiResponse extends ApiResponse {
  checkoutSession?: CheckoutSession;
  paymentSession?: PaymentSession;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface PaymentFormData {
  email: string;
  name: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  savePaymentMethod?: boolean;
}

export interface PaymentError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "FREE",
  "PENDING", 
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIAL_REFUND",
  "CANCELED",
  "EXPIRED",
];

export const PAYMENT_SESSION_STATUSES: PaymentSessionStatus[] = [
  "PENDING",
  "PROCESSING",
  "COMPLETED", 
  "FAILED",
  "CANCELED",
  "EXPIRED",
];

export const PAYMENT_METHOD_TYPES: PaymentMethodType[] = [
  "card",
  "bank_account",
  "paypal",
  "apple_pay",
  "google_pay",
  "crypto",
];

export const SUPPORTED_CURRENCIES: Currency[] = [
  "USD",
  "EUR", 
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
  "BRL",
];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  CNY: "¥",
  INR: "₹",
  BRL: "R$",
};

export const CURRENCY_DECIMALS: Record<Currency, number> = {
  USD: 2,
  EUR: 2,
  GBP: 2,
  JPY: 0,
  CAD: 2,
  AUD: 2,
  CHF: 2,
  CNY: 2,
  INR: 2,
  BRL: 2,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const formatCurrency = (
  amount: number, 
  currency: Currency = "USD", 
  includeSymbol: boolean = true
): string => {
  const symbol = includeSymbol ? CURRENCY_SYMBOLS[currency] : "";
  const decimals = CURRENCY_DECIMALS[currency];
  const formattedAmount = (amount / 100).toFixed(decimals);
  
  return `${symbol}${formattedAmount}`;
};

export const calculateDiscount = (
  originalAmount: number,
  discountType: DiscountType,
  discountValue: number
): number => {
  if (discountType === "PERCENTAGE") {
    return Math.round((originalAmount * discountValue) / 100);
  }
  return Math.min(discountValue, originalAmount);
};

export const calculateFinalAmount = (
  originalAmount: number,
  discountAmount: number
): number => {
  return Math.max(0, originalAmount - discountAmount);
};

export const isPaymentSessionExpired = (session: PaymentSession): boolean => {
  if (!session.expiresAt) return false;
  return new Date() > session.expiresAt;
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const colors: Record<PaymentStatus, string> = {
    FREE: "text-green-600 bg-green-100",
    PENDING: "text-yellow-600 bg-yellow-100",
    PAID: "text-green-600 bg-green-100",
    FAILED: "text-red-600 bg-red-100",
    REFUNDED: "text-blue-600 bg-blue-100",
    PARTIAL_REFUND: "text-orange-600 bg-orange-100",
    CANCELED: "text-gray-600 bg-gray-100",
    EXPIRED: "text-red-600 bg-red-100",
  };
  return colors[status] || colors.PENDING;
};

export const getPaymentSessionStatusColor = (status: PaymentSessionStatus): string => {
  const colors: Record<PaymentSessionStatus, string> = {
    PENDING: "text-yellow-600 bg-yellow-100",
    PROCESSING: "text-blue-600 bg-blue-100",
    COMPLETED: "text-green-600 bg-green-100",
    FAILED: "text-red-600 bg-red-100",
    CANCELED: "text-gray-600 bg-gray-100",
    EXPIRED: "text-red-600 bg-red-100",
  };
  return colors[status] || colors.PENDING;
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isPaymentStatus = (value: string): value is PaymentStatus => {
  return PAYMENT_STATUSES.includes(value as PaymentStatus);
};

export const isPaymentSessionStatus = (value: string): value is PaymentSessionStatus => {
  return PAYMENT_SESSION_STATUSES.includes(value as PaymentSessionStatus);
};

export const isCurrency = (value: string): value is Currency => {
  return SUPPORTED_CURRENCIES.includes(value as Currency);
};

export const isPaymentMethodType = (value: string): value is PaymentMethodType => {
  return PAYMENT_METHOD_TYPES.includes(value as PaymentMethodType);
};

// ============================================================================
// DEFAULT EXPORTS
// ============================================================================

export default {
  PAYMENT_STATUSES,
  PAYMENT_SESSION_STATUSES,
  PAYMENT_METHOD_TYPES,
  SUPPORTED_CURRENCIES,
  CURRENCY_SYMBOLS,
  CURRENCY_DECIMALS,
  formatCurrency,
  calculateDiscount,
  calculateFinalAmount,
  isPaymentSessionExpired,
  getPaymentStatusColor,
  getPaymentSessionStatusColor,
  isPaymentStatus,
  isPaymentSessionStatus,
  isCurrency,
  isPaymentMethodType,
};
