import { Button } from "@/components/ui/button";
import {
  FaRegClock,
  FaCertificate,
  FaInfinity,
  FaShieldAlt,
  FaCreditCard,
} from "react-icons/fa";
import { Course } from "@/types/courseTypes";

interface PriceCardProps {
  course: Course;
  isEnrolled?: boolean;
}

export function PriceCard({ course, isEnrolled = false }: PriceCardProps) {
  const isDiscounted = course.originalPrice && course.price && course.originalPrice > course.price;
  const discountPercentage = isDiscounted && course.originalPrice && course.price 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <aside className="bg-white rounded-xl shadow-lg p-6 sticky top-66 transition-all transform -translate-y-1/2">
      {isDiscounted && (
        <div className="mb-2 flex items-center gap-2">
          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </span>
          <FaRegClock className="text-red-400" title="Limited time discount" />
        </div>
      )}

      <div className="flex items-end gap-3 mb-4">
        <span className="text-3xl font-extrabold text-gray-900">
          ${course.price?.toFixed(2) || '0.00'}
        </span>
        {isDiscounted && course.originalPrice && (
          <span className="text-base text-gray-400 line-through">
            ${course.originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {isEnrolled ? (
        <Button className="w-full mb-4" disabled>
          Already Enrolled
        </Button>
      ) : (
        <>
          <Button className="w-full mb-2">Add to cart</Button>
          <Button variant="outline" className="w-full mb-4">
            Buy now
          </Button>
        </>
      )}

      <div className="flex justify-center gap-2 mb-4">
        <FaCreditCard className="text-gray-400" title="Visa/Mastercard" />
        {/* Add more payment icons as needed */}
      </div>

      <ul className="space-y-2 text-gray-700 text-sm">
        <li className="flex items-center gap-2">
          <FaShieldAlt className="text-green-500" />
          30-Day Money-Back Guarantee
        </li>
        <li className="flex items-center gap-2">
          <FaInfinity className="text-blue-500" />
          Full lifetime access
        </li>
        {course.hasCertificate && (
          <li className="flex items-center gap-2">
            <FaCertificate className="text-yellow-500" />
            Certificate of Completion
          </li>
        )}
        {course.downloadableResources && (
          <li className="flex items-center gap-2">
            <FaInfinity className="text-purple-500" />
            Downloadable resources
          </li>
        )}
      </ul>
    </aside>
  );
}
