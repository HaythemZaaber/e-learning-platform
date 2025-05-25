import { Button } from "@/components/ui/button"

interface PriceCardProps {
  price: number
  discountPrice: number
}

export function PriceCard({ price, discountPrice }: PriceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Price</h2>

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl font-bold">${discountPrice}</span>
          <span className="text-sm text-gray-500 line-through ml-2">${price}</span>
        </div>
      </div>

      <Button className="w-full">Add to cart</Button>

      <div className="mt-4 text-sm text-gray-600">
        <ul className="list-disc pl-5">
          <li>30-Day Money-Back Guarantee</li>
          <li>Full lifetime access</li>
          <li>Certificate of Completion</li>
        </ul>
      </div>
    </div>
  )
}
