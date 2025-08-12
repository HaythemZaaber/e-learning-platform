import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { 
  PaymentSession, 
  PaymentMethod, 
  Coupon, 
  Enrollment, 
  CheckoutSession,
  CheckoutItem,
  PaymentStatus,
  PaymentSessionStatus,
  Currency,
  formatCurrency,
  calculateDiscount,
  calculateFinalAmount,
  isPaymentSessionExpired
} from "@/types/paymentTypes";
import { Course } from "@/types/courseTypes";

// ============================================================================
// PAYMENT STORE INTERFACE
// ============================================================================

interface PaymentState {
  // Payment Sessions
  currentPaymentSession: PaymentSession | null;
  paymentSessions: PaymentSession[];
  
  // Checkout
  checkoutItems: CheckoutItem[];
  checkoutSession: CheckoutSession | null;
  couponCode: string;
  appliedCoupon: Coupon | null;
  
  // Payment Methods
  paymentMethods: PaymentMethod[];
  defaultPaymentMethod: PaymentMethod | null;
  
  // Enrollments
  enrollments: Enrollment[];
  
  // Loading States
  isLoading: boolean;
  isProcessingPayment: boolean;
  isCreatingSession: boolean;
  isValidatingCoupon: boolean;
  isEnrolling: boolean;
  
  // Error Handling
  error: string | null;
  paymentError: string | null;
  
  // UI State
  showPaymentModal: boolean;
  showCouponModal: boolean;
  currentStep: "cart" | "payment" | "confirmation" | "success" | "error";
  
  // Actions - Payment Sessions
  setCurrentPaymentSession: (session: PaymentSession | null) => void;
  addPaymentSession: (session: PaymentSession) => void;
  updatePaymentSession: (sessionId: string, updates: Partial<PaymentSession>) => void;
  clearPaymentSessions: () => void;
  
  // Actions - Checkout
  addToCheckout: (course: Course, quantity?: number) => void;
  removeFromCheckout: (courseId: string) => void;
  updateCheckoutItemQuantity: (courseId: string, quantity: number) => void;
  clearCheckout: () => void;
  setCheckoutSession: (session: CheckoutSession | null) => void;
  
  // Actions - Coupons
  setCouponCode: (code: string) => void;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  clearCoupon: () => void;
  
  // Actions - Payment Methods
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (method: PaymentMethod | null) => void;
  
  // Actions - Enrollments
  setEnrollments: (enrollments: Enrollment[]) => void;
  addEnrollment: (enrollment: Enrollment) => void;
  updateEnrollment: (enrollmentId: string, updates: Partial<Enrollment>) => void;
  
  // Actions - Loading States
  setLoading: (loading: boolean) => void;
  setProcessingPayment: (processing: boolean) => void;
  setCreatingSession: (creating: boolean) => void;
  setValidatingCoupon: (validating: boolean) => void;
  setEnrolling: (enrolling: boolean) => void;
  
  // Actions - Error Handling
  setError: (error: string | null) => void;
  setPaymentError: (error: string | null) => void;
  clearErrors: () => void;
  
  // Actions - UI State
  setShowPaymentModal: (show: boolean) => void;
  setShowCouponModal: (show: boolean) => void;
  setCurrentStep: (step: "cart" | "payment" | "confirmation" | "success" | "error") => void;
  
  // Computed Values
  getCheckoutSubtotal: () => number;
  getCheckoutDiscount: () => number;
  getCheckoutTotal: () => number;
  getCheckoutItemCount: () => number;
  getCheckoutCurrency: () => Currency;
  isCheckoutEmpty: () => boolean;
  hasValidCoupon: () => boolean;
  getEnrollmentByCourseId: (courseId: string) => Enrollment | undefined;
  isEnrolledInCourse: (courseId: string) => boolean;
  
  // Utility Actions
  reset: () => void;
  resetCheckout: () => void;
  resetPaymentSession: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
  // Payment Sessions
  currentPaymentSession: null,
  paymentSessions: [],
  
  // Checkout
  checkoutItems: [],
  checkoutSession: null,
  couponCode: "",
  appliedCoupon: null,
  
  // Payment Methods
  paymentMethods: [],
  defaultPaymentMethod: null,
  
  // Enrollments
  enrollments: [],
  
  // Loading States
  isLoading: false,
  isProcessingPayment: false,
  isCreatingSession: false,
  isValidatingCoupon: false,
  isEnrolling: false,
  
  // Error Handling
  error: null,
  paymentError: null,
  
  // UI State
  showPaymentModal: false,
  showCouponModal: false,
  currentStep: "cart" as const,
};

// ============================================================================
// PAYMENT STORE IMPLEMENTATION
// ============================================================================

export const usePaymentStore = create<PaymentState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // ========================================================================
        // PAYMENT SESSION ACTIONS
        // ========================================================================
        
        setCurrentPaymentSession: (session) => {
          set({ currentPaymentSession: session });
        },
        
        addPaymentSession: (session) => {
          set((state) => ({
            paymentSessions: [...state.paymentSessions, session],
          }));
        },
        
        updatePaymentSession: (sessionId, updates) => {
          set((state) => ({
            paymentSessions: state.paymentSessions.map((session) =>
              session.id === sessionId ? { ...session, ...updates } : session
            ),
            currentPaymentSession: state.currentPaymentSession?.id === sessionId
              ? { ...state.currentPaymentSession, ...updates }
              : state.currentPaymentSession,
          }));
        },
        
        clearPaymentSessions: () => {
          set({ paymentSessions: [], currentPaymentSession: null });
        },
        
        // ========================================================================
        // CHECKOUT ACTIONS
        // ========================================================================
        
        addToCheckout: (course, quantity = 1) => {
          set((state) => {
            const existingItem = state.checkoutItems.find(
              (item) => item.courseId === course.id
            );
            
            if (existingItem) {
              // Update quantity if item already exists
              return {
                checkoutItems: state.checkoutItems.map((item) =>
                  item.courseId === course.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
              };
            } else {
              // Add new item
              const newItem: CheckoutItem = {
                courseId: course.id,
                course,
                price: Math.round(course.price * 100), // Convert to cents
                originalPrice: course.originalPrice 
                  ? Math.round(course.originalPrice * 100)
                  : undefined,
                currency: (course.currency as Currency) || "USD",
                quantity,
              };
              
              return {
                checkoutItems: [...state.checkoutItems, newItem],
              };
            }
          });
        },
        
        removeFromCheckout: (courseId) => {
          set((state) => ({
            checkoutItems: state.checkoutItems.filter(
              (item) => item.courseId !== courseId
            ),
          }));
        },
        
        updateCheckoutItemQuantity: (courseId, quantity) => {
          if (quantity <= 0) {
            get().removeFromCheckout(courseId);
            return;
          }
          
          set((state) => ({
            checkoutItems: state.checkoutItems.map((item) =>
              item.courseId === courseId ? { ...item, quantity } : item
            ),
          }));
        },
        
        clearCheckout: () => {
          set({
            checkoutItems: [],
            checkoutSession: null,
            couponCode: "",
            appliedCoupon: null,
          });
        },
        
        setCheckoutSession: (session) => {
          set({ checkoutSession: session });
        },
        
        // ========================================================================
        // COUPON ACTIONS
        // ========================================================================
        
        setCouponCode: (code) => {
          set({ couponCode: code });
        },
        
        setAppliedCoupon: (coupon) => {
          set({ appliedCoupon: coupon });
        },
        
        clearCoupon: () => {
          set({ couponCode: "", appliedCoupon: null });
        },
        
        // ========================================================================
        // PAYMENT METHOD ACTIONS
        // ========================================================================
        
        setPaymentMethods: (methods) => {
          set({ paymentMethods: methods });
        },
        
        addPaymentMethod: (method) => {
          set((state) => ({
            paymentMethods: [...state.paymentMethods, method],
          }));
        },
        
        removePaymentMethod: (methodId) => {
          set((state) => ({
            paymentMethods: state.paymentMethods.filter(
              (method) => method.id !== methodId
            ),
            defaultPaymentMethod: state.defaultPaymentMethod?.id === methodId
              ? null
              : state.defaultPaymentMethod,
          }));
        },
        
        setDefaultPaymentMethod: (method) => {
          set({ defaultPaymentMethod: method });
        },
        
        // ========================================================================
        // ENROLLMENT ACTIONS
        // ========================================================================
        
        setEnrollments: (enrollments) => {
          set({ enrollments });
        },
        
        addEnrollment: (enrollment) => {
          set((state) => ({
            enrollments: [...state.enrollments, enrollment],
          }));
        },
        
        updateEnrollment: (enrollmentId, updates) => {
          set((state) => ({
            enrollments: state.enrollments.map((enrollment) =>
              enrollment.id === enrollmentId
                ? { ...enrollment, ...updates }
                : enrollment
            ),
          }));
        },
        
        // ========================================================================
        // LOADING STATE ACTIONS
        // ========================================================================
        
        setLoading: (loading) => set({ isLoading: loading }),
        setProcessingPayment: (processing) => set({ isProcessingPayment: processing }),
        setCreatingSession: (creating) => set({ isCreatingSession: creating }),
        setValidatingCoupon: (validating) => set({ isValidatingCoupon: validating }),
        setEnrolling: (enrolling) => set({ isEnrolling: enrolling }),
        
        // ========================================================================
        // ERROR HANDLING ACTIONS
        // ========================================================================
        
        setError: (error) => set({ error }),
        setPaymentError: (error) => set({ paymentError: error }),
        clearErrors: () => set({ error: null, paymentError: null }),
        
        // ========================================================================
        // UI STATE ACTIONS
        // ========================================================================
        
        setShowPaymentModal: (show) => set({ showPaymentModal: show }),
        setShowCouponModal: (show) => set({ showCouponModal: show }),
        setCurrentStep: (step) => set({ currentStep: step }),
        
        // ========================================================================
        // COMPUTED VALUES
        // ========================================================================
        
        getCheckoutSubtotal: () => {
          const { checkoutItems } = get();
          return checkoutItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
        },
        
        getCheckoutDiscount: () => {
          const { appliedCoupon, checkoutItems } = get();
          if (!appliedCoupon || checkoutItems.length === 0) return 0;
          
          const subtotal = get().getCheckoutSubtotal();
          return calculateDiscount(
            subtotal,
            appliedCoupon.discountType,
            appliedCoupon.discountValue
          );
        },
        
        getCheckoutTotal: () => {
          const subtotal = get().getCheckoutSubtotal();
          const discount = get().getCheckoutDiscount();
          return calculateFinalAmount(subtotal, discount);
        },
        
        getCheckoutItemCount: () => {
          const { checkoutItems } = get();
          return checkoutItems.reduce((total, item) => total + item.quantity, 0);
        },
        
        getCheckoutCurrency: () => {
          const { checkoutItems } = get();
          return checkoutItems.length > 0 ? checkoutItems[0].currency : "USD";
        },
        
        isCheckoutEmpty: () => {
          return get().checkoutItems.length === 0;
        },
        
        hasValidCoupon: () => {
          const { appliedCoupon } = get();
          return appliedCoupon !== null && appliedCoupon.isActive;
        },
        
        getEnrollmentByCourseId: (courseId) => {
          const { enrollments } = get();
          return enrollments.find(
            (enrollment) => enrollment.courseId === courseId
          );
        },
        
        isEnrolledInCourse: (courseId) => {
          const enrollment = get().getEnrollmentByCourseId(courseId);
          return enrollment !== undefined && enrollment.status === "ACTIVE";
        },
        
        // ========================================================================
        // UTILITY ACTIONS
        // ========================================================================
        
        reset: () => set(initialState),
        
        resetCheckout: () => {
          set({
            checkoutItems: [],
            checkoutSession: null,
            couponCode: "",
            appliedCoupon: null,
            currentStep: "cart",
          });
        },
        
        resetPaymentSession: () => {
          set({
            currentPaymentSession: null,
            showPaymentModal: false,
            currentStep: "cart",
          });
        },
      }),
      {
        name: "payment-storage",
        partialize: (state) => ({
          checkoutItems: state.checkoutItems,
          couponCode: state.couponCode,
          appliedCoupon: state.appliedCoupon,
          paymentMethods: state.paymentMethods,
          defaultPaymentMethod: state.defaultPaymentMethod,
          enrollments: state.enrollments,
          currentStep: state.currentStep,
        }),
      }
    ),
    { name: "payment-store" }
  )
);

// ============================================================================
// SELECTOR HOOKS FOR BETTER PERFORMANCE
// ============================================================================

export const useCheckoutItems = () => usePaymentStore((state) => state.checkoutItems);
export const useCheckoutSubtotal = () => usePaymentStore((state) => state.getCheckoutSubtotal());
export const useCheckoutTotal = () => usePaymentStore((state) => state.getCheckoutTotal());
export const useCheckoutItemCount = () => usePaymentStore((state) => state.getCheckoutItemCount());
export const useIsCheckoutEmpty = () => usePaymentStore((state) => state.isCheckoutEmpty());
export const useAppliedCoupon = () => usePaymentStore((state) => state.appliedCoupon);
export const useHasValidCoupon = () => usePaymentStore((state) => state.hasValidCoupon());
export const useCurrentPaymentSession = () => usePaymentStore((state) => state.currentPaymentSession);
export const useIsProcessingPayment = () => usePaymentStore((state) => state.isProcessingPayment);
export const usePaymentError = () => usePaymentStore((state) => state.paymentError);
export const useShowPaymentModal = () => usePaymentStore((state) => state.showPaymentModal);
export const useCurrentStep = () => usePaymentStore((state) => state.currentStep);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getFormattedCheckoutTotal = () => {
  const total = usePaymentStore.getState().getCheckoutTotal();
  const currency = usePaymentStore.getState().getCheckoutCurrency();
  return formatCurrency(total, currency);
};

export const getFormattedCheckoutSubtotal = () => {
  const subtotal = usePaymentStore.getState().getCheckoutSubtotal();
  const currency = usePaymentStore.getState().getCheckoutCurrency();
  return formatCurrency(subtotal, currency);
};

export const getFormattedCheckoutDiscount = () => {
  const discount = usePaymentStore.getState().getCheckoutDiscount();
  const currency = usePaymentStore.getState().getCheckoutCurrency();
  return formatCurrency(discount, currency);
};

