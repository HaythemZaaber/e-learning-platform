// features/payments/hooks/usePayment.ts
// Comprehensive payment hooks for React components

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { usePaymentStore } from "@/stores/payment.store";
import {
  paymentSessionService,
  couponService,
  enrollmentService,
  checkoutService,
  paymentMethodService,
  stripeService,
  paymentUtils,
} from "@/features/payments/services/paymentService";
import {
  PaymentSession,
  CreatePaymentSessionRequest,
  Coupon,
  ValidateCouponRequest,
  Enrollment,
  CheckoutSession,
  CreateCheckoutSessionRequest,
  PaymentMethod,
  CreatePaymentMethodRequest,
  StripePaymentIntent,
  StripeSession,
  StripeCustomer,
  formatCurrency,
} from "@/types/paymentTypes";
import { Course } from "@/types/courseTypes";

// ============================================================================
// PAYMENT SESSION HOOK
// ============================================================================

export const usePaymentSession = () => {
  const router = useRouter();
  const { user } = useAuth();
  const clerkAuth = useClerkAuth();
  const {
    currentPaymentSession,
    setCurrentPaymentSession,
    addPaymentSession,
    updatePaymentSession,
    setCreatingSession,
    setError,
    clearErrors,
  } = usePaymentStore();

  const [isLoading, setIsLoading] = useState(false);

  const createSession = useCallback(
    async (request: CreatePaymentSessionRequest): Promise<PaymentSession | null> => {
      if (!user) {
        toast.error("Please sign in to continue");
        router.push("/sign-in");
        return null;
      }

      setIsLoading(true);
      setCreatingSession(true);
      clearErrors();

      try {
        // Get Clerk token
        const token = await clerkAuth.getToken();
        
        // Remove userId from request since it will be extracted from the token
        const { userId, ...requestBody } = request;
        const response = await paymentSessionService.createSession(requestBody, token || undefined);
        
        if (response.success && response.session) {
          setCurrentPaymentSession(response.session);
          addPaymentSession(response.session);
          
          // If there's a redirect URL (Stripe Checkout), redirect to it
          if (response.redirectUrl) {
            window.location.href = response.redirectUrl;
            return response.session;
          }
          
          toast.success("Payment session created successfully");
          return response.session;
        } else {
          const errorMessage = response.error || "Failed to create payment session";
          setError(errorMessage);
          toast.error(errorMessage);
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
        setCreatingSession(false);
      }
    },
    [user, router, clerkAuth, setCurrentPaymentSession, addPaymentSession, setCreatingSession, setError, clearErrors]
  );

  const getSession = useCallback(
    async (sessionId: string): Promise<PaymentSession | null> => {
      setIsLoading(true);
      try {
        const token = await clerkAuth.getToken();
        const session = await paymentSessionService.getSession(sessionId, token || undefined);
        if (session) {
          setCurrentPaymentSession(session);
        }
        return session;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch session";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [clerkAuth, setCurrentPaymentSession, setError]
  );

  const updateSession = useCallback(
    async (sessionId: string, updates: Partial<PaymentSession>): Promise<boolean> => {
      try {
        const success = await paymentSessionService.updateSession(sessionId, updates);
        if (success) {
          updatePaymentSession(sessionId, updates);
          toast.success("Payment session updated successfully");
        }
        return success;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update session";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [updatePaymentSession, setError]
  );

  const cancelSession = useCallback(
    async (sessionId: string): Promise<boolean> => {
      try {
        const success = await paymentSessionService.cancelSession(sessionId);
        if (success) {
          setCurrentPaymentSession(null);
          toast.success("Payment session canceled successfully");
        }
        return success;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to cancel session";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [setCurrentPaymentSession, setError]
  );

  return {
    currentPaymentSession,
    isLoading,
    createSession,
    getSession,
    updateSession,
    cancelSession,
  };
};

// ============================================================================
// COUPON HOOK
// ============================================================================

export const useCoupon = () => {
  const { user } = useAuth();
  const clerkAuth = useClerkAuth();
  const {
    appliedCoupon,
    setAppliedCoupon,
    setValidatingCoupon,
    setError,
    clearErrors,
  } = usePaymentStore();

  const [isLoading, setIsLoading] = useState(false);

  const validateCoupon = useCallback(
    async (request: ValidateCouponRequest): Promise<Coupon | null> => {
      if (!user) {
        toast.error("Please sign in to apply coupons");
        return null;
      }

      setIsLoading(true);
      setValidatingCoupon(true);
      clearErrors();

      try {
        const token = await clerkAuth.getToken();
        const response = await couponService.validateCoupon(request, token || undefined);

        console.log("response", response);
        
        if (response.isValid && response.coupon) {
          setAppliedCoupon(response.coupon);
          toast.success(`Coupon applied! ${response.message || "Discount applied successfully"}`);
          return response.coupon;
        } else {
          const errorMessage = response.error || "Invalid coupon code";
          setError(errorMessage);
          toast.error(errorMessage);
          setAppliedCoupon(null);
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to validate coupon";
        setError(errorMessage);
        toast.error(errorMessage);
        setAppliedCoupon(null);
        return null;
      } finally {
        setIsLoading(false);
        setValidatingCoupon(false);
      }
    },
    [user, clerkAuth, setAppliedCoupon, setValidatingCoupon, setError, clearErrors]
  );

  const getCoupon = useCallback(
    async (code: string): Promise<Coupon | null> => {
      setIsLoading(true);
      try {
        const coupon = await couponService.getCoupon(code);
        return coupon;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch coupon";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setError]
  );

  const clearCoupon = useCallback(() => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  }, [setAppliedCoupon]);

  return {
    appliedCoupon,
    isLoading,
    validateCoupon,
    getCoupon,
    clearCoupon,
  };
};

// ============================================================================
// ENROLLMENT HOOK
// ============================================================================

export const useEnrollment = () => {
  const router = useRouter();
  const { user } = useAuth();
  const clerkAuth = useClerkAuth();
  const {
    enrollments,
    setEnrollments,
    addEnrollment,
    updateEnrollment,
    setEnrolling,
    setError,
    clearErrors,
  } = usePaymentStore();

  const [isLoading, setIsLoading] = useState(false);

  const createEnrollment = useCallback(
    async (courseId: string, paymentSessionId?: string): Promise<Enrollment | null> => {
      if (!user) {
        toast.error("Please sign in to enroll in courses");
        router.push("/sign-in");
        return null;
      }

      setIsLoading(true);
      setEnrolling(true);
      clearErrors();

      try {
        const token = await clerkAuth.getToken();
        const enrollment = await enrollmentService.createEnrollment(courseId, user.id, paymentSessionId, token || undefined);
        
        if (enrollment) {
          addEnrollment(enrollment);
          toast.success("Successfully enrolled in course!");
          router.push(`/courses/${courseId}/learn`);
          return enrollment;
        } else {
          const errorMessage = "Failed to create enrollment";
          setError(errorMessage);
          toast.error(errorMessage);
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create enrollment";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
        setEnrolling(false);
      }
    },
    [user, router, clerkAuth, addEnrollment, setEnrolling, setError, clearErrors]
  );

  const getUserEnrollments = useCallback(
    async (): Promise<Enrollment[]> => {
      if (!user) return [];

      setIsLoading(true);
      try {
        const token = await clerkAuth.getToken();
        const userEnrollments = await enrollmentService.getUserEnrollments(user.id, token || undefined);
        setEnrollments(userEnrollments);
        return userEnrollments;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch enrollments";
        setError(errorMessage);
        toast.error(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [user, clerkAuth, setEnrollments, setError]
  );

  const getEnrollmentByCourse = useCallback(
    async (courseId: string): Promise<Enrollment | null> => {
      if (!user) return null;

      try {
        const token = await clerkAuth.getToken();
        const enrollment = await enrollmentService.getEnrollmentByCourse(courseId, user.id, token || undefined);
        return enrollment;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch enrollment";
        setError(errorMessage);
        return null;
      }
    },
    [user, clerkAuth, setError]
  );

  const updateEnrollmentStatus = useCallback(
    async (enrollmentId: string, updates: Partial<Enrollment>): Promise<boolean> => {
      try {
        const success = await enrollmentService.updateEnrollment(enrollmentId, updates);
        if (success) {
          updateEnrollment(enrollmentId, updates);
          toast.success("Enrollment updated successfully");
        }
        return success;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update enrollment";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [updateEnrollment, setError]
  );

  const cancelEnrollment = useCallback(
    async (enrollmentId: string): Promise<boolean> => {
      try {
        const success = await enrollmentService.cancelEnrollment(enrollmentId);
        if (success) {
          // Remove from local state
          setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
          toast.success("Enrollment canceled successfully");
        }
        return success;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to cancel enrollment";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [enrollments, setEnrollments, setError]
  );

  return {
    enrollments,
    isLoading,
    createEnrollment,
    getUserEnrollments,
    getEnrollmentByCourse,
    updateEnrollmentStatus,
    cancelEnrollment,
  };
};

// ============================================================================
// CHECKOUT HOOK
// ============================================================================

export const useCheckout = () => {
  const router = useRouter();
  const { user } = useAuth();
  const clerkAuth = useClerkAuth();
  const {
    checkoutItems,
    checkoutSession,
    setCheckoutSession,
    setError,
    clearErrors,
  } = usePaymentStore();

  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = useCallback(
    async (request: CreateCheckoutSessionRequest): Promise<CheckoutSession | null> => {
      if (!user) {
        toast.error("Please sign in to checkout");
        router.push("/sign-in");
        return null;
      }

      if (request.items.length === 0) {
        toast.error("No items in cart");
        return null;
      }

      setIsLoading(true);
      clearErrors();

      try {
        const token = await clerkAuth.getToken();
        const session = await checkoutService.createCheckoutSession(request, token || undefined);
        
        if (session) {
          setCheckoutSession(session);
          toast.success("Checkout session created successfully");
          return session;
        } else {
          const errorMessage = "Failed to create checkout session";
          setError(errorMessage);
          toast.error(errorMessage);
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user, router, clerkAuth, setCheckoutSession, setError, clearErrors]
  );

  const getCheckoutSession = useCallback(
    async (sessionId: string): Promise<CheckoutSession | null> => {
      setIsLoading(true);
      try {
        const session = await checkoutService.getCheckoutSession(sessionId);
        if (session) {
          setCheckoutSession(session);
        }
        return session;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch checkout session";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setCheckoutSession, setError]
  );

  const completeCheckoutSession = useCallback(
    async (sessionId: string): Promise<boolean> => {
      try {
        const success = await checkoutService.completeCheckoutSession(sessionId);
        if (success) {
          toast.success("Checkout completed successfully!");
          router.push("/dashboard");
        }
        return success;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to complete checkout";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [router, setError]
  );

  return {
    checkoutItems,
    checkoutSession,
    isLoading,
    createCheckoutSession,
    getCheckoutSession,
    completeCheckoutSession,
  };
};

// ============================================================================
// PAYMENT METHOD HOOK
// ============================================================================

export const usePaymentMethods = () => {
  const { user } = useAuth();
  const clerkAuth = useClerkAuth();
  const {
    paymentMethods,
    defaultPaymentMethod,
    setPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    setError,
    clearErrors,
  } = usePaymentStore();

  const [isLoading, setIsLoading] = useState(false);

  const getUserPaymentMethods = useCallback(
    async (): Promise<PaymentMethod[]> => {
      if (!user) return [];

      setIsLoading(true);
      try {
        const token = await clerkAuth.getToken();
        const methods = await paymentMethodService.getUserPaymentMethods(user.id, token || undefined);
        setPaymentMethods(methods);
        return methods;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch payment methods";
        setError(errorMessage);
        toast.error(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [user, clerkAuth, setPaymentMethods, setError]
  );

  const addNewPaymentMethod = useCallback(
    async (request: CreatePaymentMethodRequest): Promise<PaymentMethod | null> => {
      if (!user) {
        toast.error("Please sign in to add payment methods");
        return null;
      }

      setIsLoading(true);
      clearErrors();

      try {
        const method = await paymentMethodService.addPaymentMethod(request);
        
        if (method) {
          addPaymentMethod(method);
          toast.success("Payment method added successfully");
          return method;
        } else {
          const errorMessage = "Failed to add payment method";
          setError(errorMessage);
          toast.error(errorMessage);
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to add payment method";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user, addPaymentMethod, setError, clearErrors]
  );

  const removePaymentMethodById = useCallback(
    async (methodId: string): Promise<boolean> => {
      try {
        const success = await paymentMethodService.removePaymentMethod(methodId);
        if (success) {
          removePaymentMethod(methodId);
          toast.success("Payment method removed successfully");
        }
        return success;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to remove payment method";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [removePaymentMethod, setError]
  );

  const setDefaultPaymentMethodById = useCallback(
    async (methodId: string): Promise<boolean> => {
      try {
        const success = await paymentMethodService.setDefaultPaymentMethod(methodId);
        if (success) {
          const method = paymentMethods.find(m => m.id === methodId);
          if (method) {
            setDefaultPaymentMethod(method);
          }
          toast.success("Default payment method updated");
        }
        return success;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to set default payment method";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [paymentMethods, setDefaultPaymentMethod, setError]
  );

  return {
    paymentMethods,
    defaultPaymentMethod,
    isLoading,
    getUserPaymentMethods,
    addNewPaymentMethod,
    removePaymentMethodById,
    setDefaultPaymentMethodById,
  };
};

// ============================================================================
// STRIPE HOOK
// ============================================================================

export const useStripe = () => {
  const { user } = useAuth();
  const clerkAuth = useClerkAuth();
  const { setError, clearErrors } = usePaymentStore();

  const [isLoading, setIsLoading] = useState(false);

  const createPaymentIntent = useCallback(
    async (amount: number, currency: string, metadata?: Record<string, any>): Promise<StripePaymentIntent | null> => {
      if (!user) {
        toast.error("Please sign in to make payments");
        return null;
      }

      setIsLoading(true);
      clearErrors();

      try {
        const token = await clerkAuth.getToken();
        const paymentIntent = await stripeService.createPaymentIntent(amount, currency, metadata, token || undefined);
        
        if (paymentIntent) {
          toast.success("Payment intent created successfully");
          return paymentIntent;
        } else {
          const errorMessage = "Failed to create payment intent";
          setError(errorMessage);
          toast.error(errorMessage);
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create payment intent";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user, clerkAuth, setError, clearErrors]
  );

  const createCheckoutSession = useCallback(
    async (
      items: Array<{ price: string; quantity: number }>,
      successUrl: string,
      cancelUrl: string,
      metadata?: Record<string, any>
    ): Promise<StripeSession | null> => {
      if (!user) {
        toast.error("Please sign in to checkout");
        return null;
      }

      setIsLoading(true);
      clearErrors();

      try {
        const session = await stripeService.createCheckoutSession(items, successUrl, cancelUrl, metadata);
        
        if (session) {
          toast.success("Checkout session created successfully");
          return session;
        } else {
          const errorMessage = "Failed to create checkout session";
          setError(errorMessage);
          toast.error(errorMessage);
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user, setError, clearErrors]
  );

  const createCustomer = useCallback(
    async (email: string, name?: string, metadata?: Record<string, any>): Promise<StripeCustomer | null> => {
      if (!user) {
        toast.error("Please sign in to create customer profile");
        return null;
      }

      setIsLoading(true);
      clearErrors();

      try {
        const customer = await stripeService.createCustomer(email, name, metadata);
        
        if (customer) {
          toast.success("Customer profile created successfully");
          return customer;
        } else {
          const errorMessage = "Failed to create customer profile";
          setError(errorMessage);
          toast.error(errorMessage);
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create customer profile";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user, setError, clearErrors]
  );

  return {
    isLoading,
    createPaymentIntent,
    createCheckoutSession,
    createCustomer,
  };
};

// ============================================================================
// QUICK PAYMENT HOOK (Combined functionality)
// ============================================================================

export const useQuickPayment = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    addToCheckout,
    removeFromCheckout,
    clearCheckout,
    checkoutItems,
    getCheckoutTotal,
    getCheckoutCurrency,
    isCheckoutEmpty,
    setShowPaymentModal,
    setCurrentStep,
  } = usePaymentStore();

  const { createSession } = usePaymentSession();
  const { createEnrollment } = useEnrollment();
  const { validateCoupon } = useCoupon();

  const handleAddToCart = useCallback(
    (course: Course) => {
      if (!user) {
        toast.error("Please sign in to add courses to cart");
        router.push("/sign-in");
        return;
      }

      addToCheckout(course);
      toast.success("Course added to cart", {
        action: {
          label: "View Cart",
          onClick: () => router.push("/checkout"),
        },
      });
    },
    [user, router, addToCheckout]
  );

  const handleRemoveFromCart = useCallback(
    (courseId: string) => {
      removeFromCheckout(courseId);
      toast.success("Course removed from cart");
    },
    [removeFromCheckout]
  );

  const handleBuyNow = useCallback(
    async (course: Course) => {
      if (!user) {
        toast.error("Please sign in to purchase courses");
        router.push("/sign-in");
        return;
      }

      // Add to cart if not already there
      if (!checkoutItems.find(item => item.courseId === course.id)) {
        addToCheckout(course);
      }

      // Navigate to checkout
      router.push("/checkout");
    },
    [user, router, addToCheckout, checkoutItems]
  );

  const handleEnrollFree = useCallback(
    async (course: Course) => {
      if (!user) {
        toast.error("Please sign in to enroll in courses");
        router.push("/sign-in");
        return;
      }

      const enrollment = await createEnrollment(course.id);
      if (enrollment) {
        router.push(`/courses/${course.id}/learn`);
      }
    },
    [user, router, createEnrollment]
  );

  const handleApplyCoupon = useCallback(
    async (code: string) => {
      if (!user) {
        toast.error("Please sign in to apply coupons");
        return;
      }

      if (isCheckoutEmpty()) {
        toast.error("No items in cart to apply coupon to");
        return;
      }

      const total = getCheckoutTotal();
      const currency = getCheckoutCurrency();

      await validateCoupon({
        code,
        courseId: checkoutItems[0].courseId, // For now, validate against first course
        amount: total,
      });
    },
    [user, validateCoupon, isCheckoutEmpty, getCheckoutTotal, getCheckoutCurrency, checkoutItems]
  );

  const handleProceedToPayment = useCallback(
    async () => {
      if (!user) {
        toast.error("Please sign in to proceed to payment");
        router.push("/sign-in");
        return;
      }

      if (isCheckoutEmpty()) {
        toast.error("No items in cart");
        return;
      }

      setCurrentStep("payment");
      setShowPaymentModal(true);
    },
    [user, router, isCheckoutEmpty, setCurrentStep, setShowPaymentModal]
  );

  const formatPrice = useCallback(
    (amount: number, currency: string = "USD") => {
      return formatCurrency(amount, currency as any);
    },
    []
  );

  return {
    checkoutItems,
    isCheckoutEmpty: isCheckoutEmpty(),
    total: getCheckoutTotal(),
    currency: getCheckoutCurrency(),
    handleAddToCart,
    handleRemoveFromCart,
    handleBuyNow,
    handleEnrollFree,
    handleApplyCoupon,
    handleProceedToPayment,
    clearCheckout,
    formatPrice,
  };
};

// ============================================================================
// DEFAULT EXPORTS
// ============================================================================

export default {
  usePaymentSession,
  useCoupon,
  useEnrollment,
  useCheckout,
  usePaymentMethods,
  useStripe,
  useQuickPayment,
};
