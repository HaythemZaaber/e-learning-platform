"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { usePaymentSession } from "@/features/payments/hooks/usePayment";
import { useEnrollment } from "@/features/payments/hooks/usePayment";
import { enrollmentService, paymentSessionService } from "@/features/payments/services/paymentService";
import { usePaymentStore } from "@/stores/payment.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Home, BookOpen, Clock } from "lucide-react";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { getSession } = usePaymentSession();
  const clerkAuth = useClerkAuth();
  const { createEnrollment } = useEnrollment();
  const { clearCheckout, resetPaymentSession } = usePaymentStore();

  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  // Use ref to prevent multiple executions
  const isProcessingRef = useRef(false);

  const handlePaymentSuccess = useCallback(async () => {
    // Prevent multiple executions
    if (isProcessingRef.current || hasProcessed) {
      return;
    }

    isProcessingRef.current = true;
    setHasProcessed(true);

    try {
      // Get session_id from URL params
      const sessionIdParam = searchParams.get("session_id");
      if (!sessionIdParam) {
        toast.error("No session ID found");
        router.push("/");
        return;
      }

      setSessionId(sessionIdParam);

      // Get payment session details using Stripe session ID
      const token = await clerkAuth.getToken();
      if (!token) {
        toast.error("Authentication token not found");
        router.push("/sign-in");
        return;
      }

      const session = await paymentSessionService.getSessionByStripeId(sessionIdParam, token);
      if (!session) {
        toast.error("Payment session not found");
        router.push("/");
        return;
      }

      setPaymentSession(session);

      const enrollment = await enrollmentService.getEnrollmentByCourse(session.courseId, token);
      console.log("enrollment", enrollment);
      if (enrollment) {
        setEnrollment(enrollment);
      } else {
        const newEnrollment = await createEnrollment(session.courseId, session.id);
        if (newEnrollment) {
          setEnrollment(newEnrollment);
        }
      }



      // Clear checkout and reset payment session
      clearCheckout();
      resetPaymentSession();

      toast.success("Payment completed successfully! You are now enrolled in the course.");

    } catch (error) {
      console.error("Error handling payment success:", error);
      toast.error("There was an issue processing your payment success");
    } finally {
      setIsLoading(false);
      isProcessingRef.current = false;
    }
  }, [searchParams, user, clerkAuth, createEnrollment, clearCheckout, resetPaymentSession, router, hasProcessed]);

  useEffect(() => {
    handlePaymentSuccess();
  }, [handlePaymentSuccess]);

  const handleStartLearning = () => {
    if (paymentSession?.courseId) {
      router.push(`/courses/${paymentSession.courseId}/learn`);
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleViewCourses = () => {
    router.push("/courses");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="text-lg font-medium text-gray-700">Processing your payment...</p>
              <p className="text-sm text-gray-500 text-center">
                Please wait while we confirm your enrollment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Thank you for your purchase. You are now enrolled in the course.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Details */}
          {paymentSession && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Payment Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <span className="ml-2 font-medium">
                    ${(paymentSession.finalAmount).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="default" className="ml-2 bg-green-100 text-green-800">
                    {paymentSession.status}
                  </Badge>
                </div>
                {paymentSession.couponCode && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Coupon Applied:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {paymentSession.couponCode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Course Information */}
          {paymentSession?.course && (
            <div className="bg-white border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Course Information</h3>
              <div className="flex items-start space-x-4">
                {paymentSession.course.thumbnail && (
                  <img
                    src={paymentSession.course.thumbnail}
                    alt={paymentSession.course.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {paymentSession.course.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {paymentSession.course.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enrollment Status */}
          {enrollment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Enrollment Confirmed</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                You now have lifetime access to this course.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleStartLearning}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Start Learning
            </Button>
            <Button
              onClick={handleViewCourses}
              variant="outline"
              className="flex-1"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Browse More Courses
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

          {/* Additional Information */}
          <div className="text-center pt-6 border-t">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your registered email address.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
