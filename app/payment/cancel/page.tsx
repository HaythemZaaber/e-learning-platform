"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePaymentStore } from "@/stores/payment.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle, ArrowLeft, Home, ShoppingCart, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPaymentSession } = usePaymentStore();

  useEffect(() => {
    // Reset payment session state
    resetPaymentSession();
    
    // Show cancellation message
    toast.error("Payment was cancelled");
  }, [resetPaymentSession]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Your payment was not completed. No charges were made to your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Cancellation Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">What happened?</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                You cancelled the payment process
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                No charges were made to your payment method
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Your cart items are still available
              </li>
            </ul>
          </div>

          {/* Common Reasons */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Common reasons for cancellation:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Changed your mind about the purchase</li>
              <li>• Wanted to review the course details again</li>
              <li>• Technical issues during payment</li>
              <li>• Decided to use a different payment method</li>
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
            <p className="text-sm text-gray-500">
              Need help? Our support team is here to assist you.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Contact us at support@example.com or call +1 (555) 123-4567
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
