"use client"

import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Filter, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import type { Review } from "@/types/instructorTypes"

interface ReviewsSectionProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  instructorName: string
}

export function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
  instructorName,
}: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest")
  const [filterRating, setFilterRating] = useState<number | "all">("all")
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    text: "",
    course: "",
  })

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.overallRating === rating).length
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
    return { rating, count, percentage }
  })

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter((review) => filterRating === "all" || review.overallRating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "highest":
          return b.overallRating - a.overallRating
        case "lowest":
          return a.overallRating - b.overallRating
        default:
          return 0
      }
    })

  const handleWriteReview = () => {
    // Handle review submission
    console.log("New review:", newReview)
    setShowWriteReview(false)
    setNewReview({ rating: 5, text: "", course: "" })
  }

  return (
    <div className="space-y-6">
      {/* Reviews Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Student Reviews</span>
            <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
              <DialogTrigger asChild>
                <Button>Write a Review</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Write a Review for {instructorName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => setNewReview((prev) => ({ ...prev, rating }))}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              rating <= newReview.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Course</label>
                    <Select
                      value={newReview.course}
                      onValueChange={(value) => setNewReview((prev) => ({ ...prev, course: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course1">Data Science Fundamentals</SelectItem>
                        <SelectItem value="course2">Advanced Machine Learning</SelectItem>
                        <SelectItem value="course3">Deep Learning with TensorFlow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Review</label>
                    <Textarea
                      placeholder="Share your experience with this instructor..."
                      value={newReview.text}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, text: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowWriteReview(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleWriteReview} className="flex-1">
                      Submit Review
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating)
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted stroke-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Based on {totalReviews.toLocaleString()} reviews</div>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  </div>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by rating:</span>
              <Select
                value={filterRating.toString()}
                onValueChange={(value) => setFilterRating(value === "all" ? "all" : Number.parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4 stars</SelectItem>
                  <SelectItem value="3">3 stars</SelectItem>
                  <SelectItem value="2">2 stars</SelectItem>
                  <SelectItem value="1">1 star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest rated</SelectItem>
                  <SelectItem value="lowest">Lowest rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                {filterRating !== "all"
                  ? `No reviews with ${filterRating} stars found.`
                  : "Be the first to write a review!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedReviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>

      {/* Load More Button */}
      {filteredAndSortedReviews.length > 0 && filteredAndSortedReviews.length < totalReviews && (
        <div className="text-center">
          <Button variant="outline">
            Load More Reviews
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null)
  const [showFullText, setShowFullText] = useState(false)

  const { reviewer, session, overallRating, comment, createdAt } = review
  const dateObj = new Date(createdAt)
  const timeAgo = formatDistanceToNow(dateObj, { addSuffix: true })

  const isLongText = comment.length > 200
  const displayText = showFullText || !isLongText ? comment : `${comment.slice(0, 200)}...`

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image src={reviewer.profileImage || "/placeholder.svg"} alt={`${reviewer.firstName} ${reviewer.lastName}`} fill className="object-cover" />
            </div>
            <div>
              <div className="font-medium">{reviewer.firstName} {reviewer.lastName}</div>
              <div className="text-sm text-muted-foreground">{timeAgo}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < overallRating ? "text-amber-500 fill-amber-500" : "text-muted stroke-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{displayText}</p>

          {isLongText && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-primary"
              onClick={() => setShowFullText(!showFullText)}
            >
              {showFullText ? "Show less" : "Read more"}
            </Button>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                Session: {session.title}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Was this helpful?</span>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${isHelpful === true ? "text-green-600" : ""}`}
                onClick={() => setIsHelpful(isHelpful === true ? null : true)}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                <span className="text-xs">Yes</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${isHelpful === false ? "text-red-600" : ""}`}
                onClick={() => setIsHelpful(isHelpful === false ? null : false)}
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                <span className="text-xs">No</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
