"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  useQuickPayment,
  useCoupon,
  usePaymentSession,
} from "@/features/payments/hooks/usePayment";
import {
  usePaymentStore,
  useCheckoutItems,
  useCheckoutSubtotal,
  useCheckoutTotal,
  useAppliedCoupon,
} from "@/stores/payment.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShoppingCart,
  CreditCard,
  CheckCircle,
  X,
  ArrowLeft,
  Gift,
  Shield,
  Clock,
  Users,
  Award,
  Zap,
  Trash2,
  Plus,
  Minus,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/types/paymentTypes";
import { Course } from "@/types/courseTypes";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const checkoutItems = useCheckoutItems();
  const subtotal = useCheckoutSubtotal();
  const total = useCheckoutTotal();
  const appliedCoupon = useAppliedCoupon();

  // Get discount from store method
  const { getCheckoutDiscount } = usePaymentStore();
  const discount = getCheckoutDiscount();

  const {
    handleRemoveFromCart,
    handleApplyCoupon,
    clearCheckout,
    formatPrice,
  } = useQuickPayment();

  const { validateCoupon, clearCoupon } = useCoupon();
  const { createSession } = usePaymentSession();

  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "cart" | "payment" | "success"
  >("cart");
  const [selectedProvider, setSelectedProvider] = useState<"STRIPE" | "PAYPAL">(
    "STRIPE"
  );

  // Note: Authentication check is now handled in the render method
  // No automatic redirect - user will see a sign-in prompt instead

  // Redirect if cart is empty
  useEffect(() => {
    if (checkoutItems.length === 0 && isAuthenticated) {
      router.push("/courses");
      toast.info("Your cart is empty");
    }
  }, [checkoutItems.length, isAuthenticated, router]);

  const handleApplyCouponCode = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      await handleApplyCoupon(couponCode);
      setCouponCode("");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    clearCoupon();
  };

  const handleQuantityChange = (courseId: string, newQuantity: number) => {
    // This would need to be implemented in the store
    if (newQuantity <= 0) {
      handleRemoveFromCart(courseId);
    } else {
      // Update quantity logic would go here
      toast.info("Quantity update feature coming soon");
    }
  };

  const handleProceedToPayment = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    if (checkoutItems.length === 0) {
      toast.error("No items in cart");
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Create payment session for the first course (simplified for demo)
      const firstCourse = checkoutItems[0];
      const frontendUrl =
        process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
      // PayPal doesn't support placeholders in return URL - it uses token parameter
      // Stripe supports {CHECKOUT_SESSION_ID} placeholder
      const returnUrl =
        selectedProvider === "PAYPAL"
          ? `${frontendUrl}/payment/success?provider=PAYPAL`
          : `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&provider=STRIPE`;

      const result = await createSession({
        courseId: firstCourse.courseId,
        couponCode: appliedCoupon?.code,
        provider: selectedProvider,
        returnUrl: returnUrl,
        cancelUrl: `${frontendUrl}/payment/cancel`,
        metadata: {
          totalAmount: total,
          itemCount: checkoutItems.length,
        },
      });

      if (result && result.redirectUrl) {
        // Redirect to payment provider (Stripe Checkout or PayPal)
        window.location.href = result.redirectUrl;
      } else if (result && result.session) {
        setCurrentStep("payment");
        toast.success("Payment session created! Redirecting to payment...");
      }
    } catch (error) {
      toast.error("Failed to process payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleContinueShopping = () => {
    router.push("/courses");
  };

  const handleBackToCart = () => {
    setCurrentStep("cart");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              Sign In Required
            </h2>
            <p className="text-blue-600 mb-6">
              You need to be signed in to access the checkout and complete your
              purchase.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push("/sign-in")}
              >
                Sign In to Continue
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some courses to get started</p>
          <Button onClick={handleContinueShopping}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  if (currentStep === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-green-600 mb-6">
              Thank you for your purchase. You can now access your courses.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "payment") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBackToCart} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold">Payment</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing payment...</p>
                    <p className="text-sm text-gray-500 mt-2">
                      This is a demo. In production, you would see a Stripe
                      payment form here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {checkoutItems.map((item) => (
                      <div
                        key={item.courseId}
                        className="flex items-center gap-3"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {item.course.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            {formatPrice(item.price, item.currency)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>
                        {formatPrice(
                          subtotal,
                          checkoutItems[0]?.currency || "USD"
                        )}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>
                          -
                          {formatPrice(
                            discount,
                            checkoutItems[0]?.currency || "USD"
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        {formatPrice(
                          total,
                          checkoutItems[0]?.currency || "USD"
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">
            Review your cart and complete your purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Shopping Cart ({checkoutItems.length}{" "}
                {checkoutItems.length === 1 ? "item" : "items"})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCheckout}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear Cart
              </Button>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {checkoutItems.map((item) => (
                <Card key={item.courseId}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Course Image */}
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                        {item.course.thumbnail && (
                          <img
                            src={item.course.thumbnail}
                            alt={item.course.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>

                      {/* Course Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">
                          {item.course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.course.shortDescription ||
                            item.course.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.course.totalDuration || "N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {item.course.totalLectures || 0} lectures
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {item.course.level}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(
                                item.courseId,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(
                                item.courseId,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="text-right">
                        <div className="mb-2">
                          {item.originalPrice &&
                            item.originalPrice > item.price && (
                              <p className="text-sm text-gray-500 line-through">
                                {formatPrice(item.originalPrice, item.currency)}
                              </p>
                            )}
                          <p className="text-lg font-bold">
                            {formatPrice(item.price, item.currency)}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromCart(item.courseId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="text-center">
              <Button variant="outline" onClick={handleContinueShopping}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {formatPrice(
                        subtotal,
                        checkoutItems[0]?.currency || "USD"
                      )}
                    </span>
                  </div>

                  {/* Coupon Section */}
                  <div className="space-y-3">
                    {appliedCoupon ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              {appliedCoupon.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveCoupon}
                            className="text-green-600 hover:text-green-700 p-1 h-auto"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-green-700">
                          {appliedCoupon.discountType === "PERCENTAGE"
                            ? `${appliedCoupon.discountValue}% off`
                            : `${formatPrice(
                                appliedCoupon.discountValue * 100,
                                "USD"
                              )} off`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={handleApplyCouponCode}
                            disabled={isApplyingCoupon || !couponCode.trim()}
                          >
                            {isApplyingCoupon ? "Applying..." : "Apply"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Discount */}
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>
                        -
                        {formatPrice(
                          discount,
                          checkoutItems[0]?.currency || "USD"
                        )}
                      </span>
                    </div>
                  )}

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>
                      {formatPrice(total, checkoutItems[0]?.currency || "USD")}
                    </span>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>
                      Secure payment powered by{" "}
                      {selectedProvider === "PAYPAL" ? "PayPal" : "Stripe"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-base">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProvider("STRIPE")}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      selectedProvider === "STRIPE"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium block">
                      Credit Card
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProvider("PAYPAL")}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      selectedProvider === "PAYPAL"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 mx-auto mb-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.105zm14.146-14.42a.915.915 0 0 0-.762-.51h-3.92c-.524 0-.969.382-1.05.9l-1.12 7.104a.641.641 0 0 0 .633.74h2.606c.524 0 .968-.382 1.05-.9l1.118-7.104a.64.64 0 0 0-.555-.74z" />
                    </svg>
                    <span className="text-sm font-medium block">PayPal</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Proceed to Payment */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleProceedToPayment}
              disabled={isProcessingPayment || checkoutItems.length === 0}
            >
              {isProcessingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  {selectedProvider === "PAYPAL" ? (
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.105zm14.146-14.42a.915.915 0 0 0-.762-.51h-3.92c-.524 0-.969.382-1.05.9l-1.12 7.104a.641.641 0 0 0 .633.74h2.606c.524 0 .968-.382 1.05-.9l1.118-7.104a.64.64 0 0 0-.555-.74z" />
                    </svg>
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  {selectedProvider === "PAYPAL"
                    ? "Pay with PayPal"
                    : "Proceed to Payment"}
                </>
              )}
            </Button>

            {/* Additional Info */}
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Lifetime access to courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Access to course community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
