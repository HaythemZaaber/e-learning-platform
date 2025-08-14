import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FaRegClock,
  FaCertificate,
  FaInfinity,
  FaShieldAlt,
  FaCreditCard,
  FaMobileAlt,
  FaDownload,
  FaLanguage,
  FaTrophy,
  FaPlayCircle,
} from "react-icons/fa";
import { 
  ShoppingCart, 
  Zap, 
  Gift, 
  Users,
  Calendar,
  RefreshCw,
  Award,
  CheckCircle,
} from "lucide-react";
import { Course } from "@/types/courseTypes";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCoursePreviewStore } from "@/stores/coursePreview.store";
import { useQuickPayment } from "@/features/payments/hooks/usePayment";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface PriceCardProps {
  course: Course | null;
  isEnrolled?: boolean;
  isAuthenticated?: boolean;
}

export function PriceCard({ 
  course, 
  isEnrolled = false,
  isAuthenticated = false 
}: PriceCardProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const { cartItems, addToCart, removeFromCart } = useCoursePreviewStore();
  const { 
    handleAddToCart, 
    handleRemoveFromCart, 
    handleBuyNow, 
    handleEnrollFree
  } = useQuickPayment();
  
  const isInCart = course ? cartItems.has(course.id) : false;

  // Check if course is free
  const isFree = course?.price === 0 || course?.settings?.enrollmentType === "FREE";
  
  // Calculate discount (only for paid courses)
  const isDiscounted = !isFree && course?.originalPrice && course?.price && course.originalPrice > course.price;
  const discountPercentage = isDiscounted && course?.originalPrice && course?.price 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;
  const savings = isDiscounted && course?.originalPrice && course?.price
    ? (course.originalPrice - course.price).toFixed(2)
    : 0;

  // Countdown timer for limited-time offers
  useEffect(() => {
    if (course?.discountValidUntil) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(course.discountValidUntil!).getTime();
        const distance = end - now;

        if (distance < 0) {
          setTimeLeft(null);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          
          if (days > 0) {
            setTimeLeft(`${days}d ${hours}h left`);
          } else if (hours > 0) {
            setTimeLeft(`${hours}h ${minutes}m left`);
          } else {
            setTimeLeft(`${minutes}m left`);
          }
        }
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [course?.discountValidUntil]);

  const handleAddToCartClick = async () => {
    if (!course) return;
    
    setIsProcessing(true);
    try {
      if (isInCart) {
        handleRemoveFromCart(course.id);
      } else {
        handleAddToCart(course);
      }
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBuyNowClick = async () => {
    if (!course) return;
    
    if (!isAuthenticated) {
      toast.info("Please sign in to purchase this course");
      router.push("/sign-in?redirect=/checkout");
      return;
    }
    
    setIsProcessing(true);
    try {
      handleBuyNow(course);
    } catch (error) {
      toast.error("Failed to proceed to checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartLearning = () => {
    if (!course) return;
    router.push(`/courses/${course.id}/learn`);
  };

  // Handle free course enrollment
  const handleEnrollFreeClick = async (course: Course) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to enroll in courses");
      return;
    }

    try {
      setIsProcessing(true);
      await handleEnrollFree(course);
    } catch (error) {
      console.error("Free enrollment error:", error);
      toast.error("Failed to enroll in free course");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!course) {
    return null;
  }

  const features = [
    {
      icon: <FaInfinity className="text-blue-500" />,
      text: isFree ? "Free lifetime access" : "Full lifetime access",
      included: course.hasLifetimeAccess !== false,
    },
    {
      icon: <FaMobileAlt className="text-purple-500" />,
      text: "Access on mobile and TV",
      included: course.hasMobileAccess !== false,
    },
    {
      icon: <FaCertificate className="text-yellow-500" />,
      text: "Certificate of completion",
      included: course.hasCertificate,
    },
    {
      icon: <FaDownload className="text-green-500" />,
      text: `${course.downloadableResources || 0} downloadable resources`,
      included: typeof course.downloadableResources === 'number' ? course.downloadableResources > 0 : Boolean(course.downloadableResources),
    },
    {
      icon: <FaPlayCircle className="text-red-500" />,
      text: "On-demand video content",
      included: true,
    },
    {
      icon: <Users className="text-indigo-500" />,
      text: "Access to community",
      included: course.hasDiscussions,
    },
    {
      icon: <RefreshCw className="text-orange-500" />,
      text: "Free content updates",
      included: true,
    },
    {
      icon: <FaLanguage className="text-teal-500" />,
      text: `${course.subtitleLanguages?.length || 0} subtitle languages`,
      included: (course.subtitleLanguages?.length || 0) > 0,
    },
  ];

  return (
    <aside className={cn(
      "bg-white rounded-xl shadow-lg transition-all max-h-[calc(100vh-8rem)] overflow-y-auto",
      "hover:shadow-2xl"
    )}>
      {/* Discount Banner - Only show for non-enrolled users */}
      {!isEnrolled && isDiscounted && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2.5 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="font-bold text-base">{discountPercentage}% OFF</span>
            </div>
            {timeLeft && (
              <div className="flex items-center gap-1 text-xs">
                <FaRegClock className="w-3 h-3" />
                <span>{timeLeft}</span>
              </div>
            )}
          </div>
          {savings && (
            <p className="text-xs mt-1 text-white/90">
              Save ${savings} today!
            </p>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Price Section - Different for enrolled vs non-enrolled users */}
        {isEnrolled ? (
          <div className="mb-5">
            {/* Enrollment Value Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-green-800">Course Access</h2>
                  <p className="text-sm text-green-700">You have full access to this course</p>
                </div>
              </div>
              
              {/* Course Value Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-700">
                    {course.totalLectures || 0}
                  </div>
                  <div className="text-green-600">Total Lectures</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-700">
                    {course.estimatedHours || 0}h {course.estimatedMinutes || 0}m
                  </div>
                  <div className="text-green-600">Course Duration</div>
                </div>
              </div>
            </div>

            {/* Course Level and Category */}
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {course.level || 'All Levels'}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {course.category || 'General'}
              </Badge>
              {course.hasCertificate && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <FaCertificate className="w-3 h-3 mr-1" />
                  Certificate
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-5">
            {/* Original Price Section for Non-Enrolled Users */}
            {isFree ? (
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">FREE</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">No cost to enroll</span>
                </div>
                <p className="text-sm text-gray-600">
                  Access all course content at no charge
                </p>
              </div>
            ) : (
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${course.price?.toFixed(2) || '0.00'}
                </span>
                {isDiscounted && course.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ${course.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            )}
            {!isFree && course.currency && course.currency !== 'USD' && (
              <p className="text-sm text-gray-600">
                Currency: {course.currency}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {isEnrolled ? (
          <div className="space-y-4">
            {/* Enrollment Status */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">You're Enrolled!</h3>
                  <p className="text-sm text-green-700">Full access to all content</p>
                </div>
              </div>
              
              {/* Course Progress (if available) */}
              {course.progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Your Progress</span>
                    <span className="font-semibold text-green-700">
                      {Math.round(course.progress.completionPercentage || 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress.completionPercentage || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{course.progress.completedLectures || 0} of {course.progress.totalLectures || 0} lectures</span>
                    <span>{course.progress.timeSpent ? `${Math.floor(course.progress.timeSpent / 60)}m` : '0m'} watched</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                size="lg"
                onClick={handleStartLearning}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Continue Learning
              </Button>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => router.push(`/courses/${course.id}/learn`)}
                >
                  <FaPlayCircle className="w-3 h-3 mr-1" />
                  Course Content
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => router.push(`/courses/${course.id}#review-section`)}
                >
                  <Award className="w-3 h-3 mr-1" />
                  Reviews
                </Button>
              </div>
            </div>

            {/* Course Benefits for Enrolled Users */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Your Benefits
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Lifetime access to this course
                </li>
                <li className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Certificate upon completion
                </li>
                <li className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Access to all future updates
                </li>
                <li className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Mobile and TV access
                </li>
              </ul>
            </div>

            {/* Certificate Section for Completed Courses */}
            {course.progress && course.progress.completionPercentage === 100 && course.hasCertificate && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <FaCertificate className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Course Completed!</h4>
                    <p className="text-sm text-yellow-700">Congratulations on finishing the course</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  size="sm"
                >
                  <FaCertificate className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
              </div>
            )}
          </div>
        ) : isFree ? (
          <div className="space-y-3">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              onClick={() => course && handleEnrollFreeClick(course)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Enroll for Free"}
            </Button>
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                No payment required
              </Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Button 
              className="w-full"
              size="lg"
              onClick={() => course && handleBuyNowClick()}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Buy Now"}
            </Button>
            <Button 
              variant={isInCart ? "secondary" : "outline"}
              className="w-full"
              onClick={() => course && handleAddToCartClick()}
              disabled={isProcessing}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isInCart ? "Remove from Cart" : "Add to Cart"}
            </Button>
          </div>
        )}

       

        {/* Gift Option */}
        {!isEnrolled && !isFree && (
          <button className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
            <Gift className="w-4 h-4" />
            Gift this course
          </button>
        )}

        <Separator className="my-5" />

        {/* Course Features */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">
            {isEnrolled ? "Course Features:" : "This course includes:"}
          </h3>
          <ul className="space-y-2.5">
            {features.filter(f => f.included).map((feature, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className="mt-0.5 w-4 h-4">{feature.icon}</span>
                <span className="text-sm text-gray-700">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Share and Gift Options */}
        {/* <Separator className="my-5" /> */}


        {/* Payment Methods */}
        {!isEnrolled && (
          <div className="mt-5">
            <p className="text-xs text-gray-500 text-center mb-2">
              Secured payment via
            </p>
            <div className="flex justify-center gap-3">
              <FaCreditCard className="text-gray-400 text-xl" title="Credit/Debit Card" />
              {/* Add more payment icons as needed */}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}