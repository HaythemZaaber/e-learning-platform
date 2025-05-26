import { Button } from "@/components/ui/button";
import {
  FaRegClock,
  FaCertificate,
  FaInfinity,
  FaShieldAlt,
  FaCreditCard,
} from "react-icons/fa";

interface PriceCardProps {
  price: number;
  discountPrice: number;
}

export function PriceCard({ price, discountPrice }: PriceCardProps) {
  const isDiscounted = discountPrice < price;

  return (
    <aside className="bg-white rounded-xl shadow-lg p-6 sticky top-66 transition-all transform -translate-y-1/2">
      {isDiscounted && (
        <div className="mb-2 flex items-center gap-2">
          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
            Limited Offer
          </span>
          <FaRegClock className="text-red-400" title="Limited time discount" />
        </div>
      )}

      <div className="flex items-end gap-3 mb-4">
        <span className="text-3xl font-extrabold text-gray-900">
          ${discountPrice.toFixed(2)}
        </span>
        {isDiscounted && (
          <span className="text-base text-gray-400 line-through">
            ${price.toFixed(2)}
          </span>
        )}
      </div>

      <Button className="w-full mb-2">Add to cart</Button>
      <Button variant="outline" className="w-full mb-4">
        Buy now
      </Button>

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
        <li className="flex items-center gap-2">
          <FaCertificate className="text-yellow-500" />
          Certificate of Completion
        </li>
      </ul>
    </aside>
  );
}
