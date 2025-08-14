"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  BookOpen, 
  DollarSign, 
  Trash2, 
  ArrowRight,
  CreditCard,
  CheckCircle,
  Clock,
  Users,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePaymentStore } from "@/stores/payment.store";
import { useQuickPayment } from "@/features/payments/hooks/usePayment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import courseThumbnail from "@/public/images/courses/courseThumbnail.jpg";

export default function StorePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { checkoutItems, clearCheckout, getCheckoutSubtotal, getCheckoutTotal, getCheckoutItemCount } = usePaymentStore();
  const { handleRemoveFromCart, handleBuyNow } = useQuickPayment();
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/sign-in?redirect=/store");
    return null;
  }

  const handleRemoveItem = async (courseId: string) => {
    try {
      handleRemoveFromCart(courseId);
      toast.success("Course removed from cart");
    } catch (error) {
      toast.error("Failed to remove course from cart");
    }
  };

  const handleCheckout = async () => {
    if (checkoutItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    try {
      router.push("/checkout");
    } catch (error) {
      toast.error("Failed to proceed to checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCart = () => {
    clearCheckout();
    toast.success("Cart cleared");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100); // Convert from cents
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Store</h1>
              <p className="text-gray-600 mt-1">Manage your cart and purchases</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {getCheckoutItemCount()} items
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Shopping Cart
                  </CardTitle>
                  {checkoutItems.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Cart
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {checkoutItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6">Add some courses to get started with your learning journey!</p>
                    <Button onClick={() => router.push("/courses")}>
                      Browse Courses
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {checkoutItems.map((item) => (
                      <motion.div
                        key={item.courseId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {/* Course Image */}
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.course.thumbnail || courseThumbnail}
                            alt={item.course.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Course Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {item.course.title}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            {item.course.instructor?.firstName} {item.course.instructor?.lastName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600">
                                {item.course.avgRating || 0}
                              </span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {item.course.currentEnrollments || 0} students
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {formatPrice(item.price)}
                          </div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </div>
                          )}
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.courseId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Purchase History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Purchase History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No purchases yet</h3>
                  <p className="text-gray-600">Your purchase history will appear here once you complete your first course purchase.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({getCheckoutItemCount()} items)</span>
                  <span>{formatPrice(getCheckoutSubtotal())}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(getCheckoutTotal())}</span>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  disabled={checkoutItems.length === 0 || isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/courses")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Courses
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/my-courses")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  My Enrolled Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
