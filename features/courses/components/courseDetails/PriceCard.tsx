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
  
  const isInCart = course ? cartItems.has(course.id) : false;

  // Calculate discount
  const isDiscounted = course?.originalPrice && course?.price && course.originalPrice > course.price;
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

  const handleAddToCart = async () => {
    if (!course) return;
    
    setIsProcessing(true);
    try {
      if (isInCart) {
        removeFromCart(course.id);
        toast.success("Removed from cart");
      } else {
        addToCart(course.id);
        toast.success("Added to cart", {
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
        });
      }
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBuyNow = async () => {
    if (!course) return;
    
    if (!isAuthenticated) {
      toast.info("Please sign in to purchase this course");
      router.push("/sign-in?redirect=/checkout");
      return;
    }
    
    setIsProcessing(true);
    try {
      // Add to cart if not already there
      if (!isInCart) {
        addToCart(course.id);
      }
      // Navigate to checkout
      router.push("/checkout");
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

  if (!course) {
    return null;
  }

  const features = [
    {
      icon: <FaInfinity className="text-blue-500" />,
      text: "Full lifetime access",
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
      {/* Discount Banner */}
      {isDiscounted && (
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
        {/* Price Section */}
        <div className="mb-5">
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
          {course.currency && course.currency !== 'USD' && (
            <p className="text-sm text-gray-600">
              Currency: {course.currency}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {isEnrolled ? (
          <div className="space-y-3">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleStartLearning}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Continue Learning
            </Button>
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800">
                <Award className="w-3 h-3 mr-1" />
                You're enrolled!
              </Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Button 
              className="w-full"
              size="lg"
              onClick={handleBuyNow}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Buy Now"}
            </Button>
            <Button 
              variant={isInCart ? "secondary" : "outline"}
              className="w-full"
              onClick={handleAddToCart}
              disabled={isProcessing}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isInCart ? "Remove from Cart" : "Add to Cart"}
            </Button>
          </div>
        )}

       

        {/* Gift Option */}
        {!isEnrolled && (
          <button className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
            <Gift className="w-4 h-4" />
            Gift this course
          </button>
        )}

        <Separator className="my-5" />

        {/* This course includes */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">This course includes:</h3>
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