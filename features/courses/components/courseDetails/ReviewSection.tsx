import { Star } from "lucide-react"
import Image from "next/image"
import { Course } from "@/types/courseTypes"

interface ReviewSectionProps {
  course: Course;
}

export function ReviewSection({ course }: ReviewSectionProps) {
  const reviews = course.reviews || [];
  const avgRating = course.avgRating || 0;
  const totalRatings = course.totalRatings || 0;

  // Calculate rating distribution from actual reviews
  const ratingDistribution = [
    { stars: 5, count: reviews.filter(r => r.rating === 5).length },
    { stars: 4, count: reviews.filter(r => r.rating === 4).length },
    { stars: 3, count: reviews.filter(r => r.rating === 3).length },
    { stars: 2, count: reviews.filter(r => r.rating === 2).length },
    { stars: 1, count: reviews.filter(r => r.rating === 1).length },
  ].map(item => ({
    ...item,
    percentage: totalRatings > 0 ? Math.round((item.count / totalRatings) * 100) : 0
  }));

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold">{avgRating.toFixed(1)}</div>
          <div className="flex mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(avgRating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-1">{totalRatings} reviews</div>
        </div>

        <div className="flex-1">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 w-16">
                <span>{item.stars}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${item.percentage}%` }}></div>
              </div>
              <div className="w-8 text-right text-sm text-gray-500">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Featured reviews</h3>

          <div className="space-y-6">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={review.userAvatar || "/placeholder.svg"}
                      alt={review.userName || "User"}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-base">
                      {review.userName || "Anonymous"}
                    </h4>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-2 text-gray-700">{review.comment}</p>

                    <div className="flex items-center gap-4 mt-3">
                      <button className="text-sm text-gray-500 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        Helpful
                      </button>
                      <button className="text-sm text-gray-500">Report</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <button className="text-blue-600 mt-4">Show More Reviews</button>
          )}
        </div>
      )}

      {reviews.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          <p>No reviews yet. Be the first to review this course!</p>
        </div>
      )}
    </div>
  )
}
