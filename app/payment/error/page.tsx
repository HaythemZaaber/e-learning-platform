"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePaymentStore } from "@/stores/payment.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, Home, ShoppingCart, RefreshCw, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function PaymentErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPaymentSession } = usePaymentStore();

  const errorCode = searchParams.get("error_code");
  const errorMessage = searchParams.get("error_message");

  useEffect(() => {
    // Reset payment session state
    resetPaymentSession();
    
    // Show error message
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.error("Payment failed. Please try again.");
    }
  }, [resetPaymentSession, errorMessage]);

  const handleRetryPayment = () => {
    router.push("/checkout");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleViewCourses = () => {
    router.push("/courses");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleContactSupport = () => {
    // You can implement this to open a support chat or email
    window.open("mailto:support@example.com?subject=Payment Error", "_blank");
  };

  const getErrorMessage = () => {
    if (errorMessage) return errorMessage;
    
    switch (errorCode) {
      case "card_declined":
        return "Your card was declined. Please try a different payment method.";
      case "insufficient_funds":
        return "Insufficient funds in your account. Please try a different payment method.";
      case "expired_card":
        return "Your card has expired. Please update your payment information.";
      case "invalid_cvc":
        return "Invalid CVC code. Please check your card details.";
      case "processing_error":
        return "There was an error processing your payment. Please try again.";
      default:
        return "An unexpected error occurred during payment. Please try again.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {getErrorMessage()}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Details */}
          {errorCode && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Error Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Error Code:</span>
                  <Badge variant="destructive" className="ml-2">
                    {errorCode}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="destructive" className="ml-2">
                    Failed
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* What to do next */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What you can do:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your payment method details</li>
              <li>• Ensure you have sufficient funds</li>
              <li>• Try a different payment method</li>
              <li>• Contact your bank if the issue persists</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleRetryPayment}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={handleViewCourses}
              variant="outline"
              className="flex-1"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Browse Courses
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={handleGoHome}
              variant="ghost"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>

          {/* Support Information */}
          <div className="text-center pt-6 border-t">
            <p className="text-sm text-gray-500 mb-3">
              Still having trouble? Our support team is here to help.
            </p>
            <Button
              onClick={handleContactSupport}
              variant="outline"
              size="sm"
              className="mx-auto"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              Email: support@example.com | Phone: +1 (555) 123-4567
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
