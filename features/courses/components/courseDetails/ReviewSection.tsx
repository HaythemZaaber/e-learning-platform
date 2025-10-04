import {
  Star,
  ThumbsUp,
  Filter,
  Search,
  MoreVertical,
  Flag,
  Edit,
  Trash2,
  Plus,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { Course } from "@/types/courseTypes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useCourseRatings } from "../../hooks/useCourseRatings";
import { StudentReviewForm } from "../reviews/StudentReviewForm";
import { DeleteReviewModal } from "../reviews/DeleteReviewModal";
import { useAuth } from "@/hooks/useAuth";

interface ReviewSectionProps {
  course: Course | null;
}

export function ReviewSection({ course }: ReviewSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating">(
    "helpful"
  );
  const [showMore, setShowMore] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [reportedReviews, setReportedReviews] = useState<Set<string>>(
    new Set()
  );
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    reviewId: string;
    rating: number;
    comment?: string;
  } | null>(null);

  const { user, isAuthenticated } = useAuth();
  const {
    ratings,
    userRating,
    ratingsLoading,
    createRating,
    updateRating,
    deleteRating,
    isSubmitting,
    refetchRatings,
    refetchUserRating,
  } = useCourseRatings(course?.id || "", { limit: 10 });

  if (!course) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Use data from the new rating system
  const reviews = ratings || [];

  // Calculate ratings from reviews data
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
        reviews.length
      : course.avgRating || 0;
  const totalRatings = reviews.length || course.totalRatings || 0;

  // Calculate rating distribution from reviews
  const ratingDistribution = useMemo(() => {
    const distribution = [
      { stars: 5, count: 0, percentage: 0 },
      { stars: 4, count: 0, percentage: 0 },
      { stars: 3, count: 0, percentage: 0 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 },
    ];

    reviews.forEach((review: any) => {
      const index = 5 - review.rating;
      if (index >= 0 && index < 5) {
        distribution[index].count++;
      }
    });

    distribution.forEach((item) => {
      item.percentage =
        totalRatings > 0 ? Math.round((item.count / totalRatings) * 100) : 0;
    });

    return distribution;
  }, [reviews, totalRatings]);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews.filter((review: any) => {
      const matchesSearch =
        !searchTerm ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating = !filterRating || review.rating === filterRating;

      return matchesSearch && matchesRating;
    });

    // Sort reviews - put user's review first if it exists
    filtered.sort((a: any, b: any) => {
      // If user has a review, put it first
      if (userRating && a.id === userRating.id) return -1;
      if (userRating && b.id === userRating.id) return 1;

      switch (sortBy) {
        case "recent":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        case "helpful":
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, searchTerm, filterRating, sortBy, userRating]);

  const displayedReviews = showMore
    ? filteredAndSortedReviews
    : filteredAndSortedReviews.slice(0, 3);

  const handleMarkHelpful = (reviewId: string) => {
    if (helpfulReviews.has(reviewId)) {
      const newSet = new Set(helpfulReviews);
      newSet.delete(reviewId);
      setHelpfulReviews(newSet);
      toast.success("Removed helpful mark");
    } else {
      setHelpfulReviews(new Set([...helpfulReviews, reviewId]));
      toast.success("Marked as helpful");
    }
  };

  const handleReportReview = (reviewId: string) => {
    if (reportedReviews.has(reviewId)) {
      toast.info("You've already reported this review");
    } else {
      setReportedReviews(new Set([...reportedReviews, reviewId]));
      toast.success("Review reported. Thank you for your feedback.");
    }
  };

  const handleEditReview = (reviewId: string) => {
    setEditingReview(reviewId);
    setShowReviewForm(true);
  };

  const handleDeleteReview = (reviewId: string) => {
    const review = reviews.find((r: any) => r.id === reviewId);
    if (review) {
      setDeleteConfirm({
        reviewId,
        rating: review.rating,
        comment: review.comment,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm) {
      await deleteRating(deleteConfirm.reviewId);
      setDeleteConfirm(null);
    }
  };

  const handleWriteReview = () => {
    setEditingReview(null);
    setShowReviewForm(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    // Refetch all data to update the UI immediately
    refetchRatings();
    refetchUserRating();
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Student Reviews</h2>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            {!userRating ? (
              <Button
                onClick={handleWriteReview}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  You've reviewed this course
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditReview(userRating.id)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating Overview */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {avgRating.toFixed(1)}
          </div>
          {renderStars(avgRating, "lg")}
          <div className="text-sm text-gray-600 mt-2">
            Course Rating • {totalRatings.toLocaleString()} reviews
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map((item) => (
            <button
              key={item.stars}
              onClick={() =>
                setFilterRating(filterRating === item.stars ? null : item.stars)
              }
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg transition-colors",
                filterRating === item.stars ? "bg-blue-50" : "hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-1 w-20">
                {renderStars(item.stars, "sm")}
              </div>
              <Progress value={item.percentage} className="flex-1 h-2" />
              <span className="text-sm text-gray-600 w-12 text-right">
                {item.percentage}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Sort by:{" "}
              {sortBy === "recent"
                ? "Most Recent"
                : sortBy === "helpful"
                ? "Most Helpful"
                : "Highest Rated"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy("helpful")}>
              Most Helpful
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("recent")}>
              Most Recent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("rating")}>
              Highest Rated
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {filterRating && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFilterRating(null)}
          >
            Clear Filter ({filterRating} ⭐)
          </Button>
        )}
      </div>

      {/* Reviews List */}
      {displayedReviews.length > 0 ? (
        <div className="space-y-6">
          {displayedReviews.map((review: any) => {
            const isHelpful = helpfulReviews.has(review.id);
            const isReported = reportedReviews.has(review.id);

            return (
              <div
                key={review.id}
                className={cn(
                  "border-b pb-6 last:border-0",
                  isReported && "opacity-50"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {review.user?.profileImage ? (
                      <Image
                        src={review.user.profileImage}
                        alt={review.user.firstName || "User"}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                        {(review.user?.firstName || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {review.user?.firstName && review.user?.lastName
                            ? `${review.user.firstName} ${review.user.lastName}`
                            : "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          {renderStars(review.rating, "sm")}
                          <span className="text-sm text-gray-500">
                            {review.createdAt &&
                              formatDistanceToNow(new Date(review.createdAt), {
                                addSuffix: true,
                              })}
                          </span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* More Options */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {userRating && userRating.id === review.id ? (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleEditReview(review.id)}
                                className="text-blue-600"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Review
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Review
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleReportReview(review.id)}
                              className="text-red-600"
                            >
                              <Flag className="mr-2 h-4 w-4" />
                              Report Review
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Review Text */}
                    <p className="mt-3 text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Detailed Ratings - Compact Display */}
                    {(review.courseQuality ||
                      review.instructorRating ||
                      review.difficultyRating ||
                      review.valueForMoney) && (
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
                        {review.courseQuality && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 bg-blue-50 px-1.5 sm:px-2 py-1 rounded-full border border-blue-100">
                            <span className="font-medium text-blue-700 hidden sm:inline">
                              Quality:
                            </span>
                            <span className="font-medium text-blue-700 sm:hidden">
                              Q:
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                  key={star}
                                  className={`w-2 h-2 ${
                                    star <= review.courseQuality
                                      ? "text-blue-500"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </div>
                              ))}
                            </div>
                            <span className="text-blue-600 font-medium">
                              {review.courseQuality}/5
                            </span>
                          </div>
                        )}

                        {review.instructorRating && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 bg-purple-50 px-1.5 sm:px-2 py-1 rounded-full border border-purple-100">
                            <span className="font-medium text-purple-700 hidden sm:inline">
                              Instructor:
                            </span>
                            <span className="font-medium text-purple-700 sm:hidden">
                              I:
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                  key={star}
                                  className={`w-2 h-2 ${
                                    star <= review.instructorRating
                                      ? "text-purple-500"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </div>
                              ))}
                            </div>
                            <span className="text-purple-600 font-medium">
                              {review.instructorRating}/5
                            </span>
                          </div>
                        )}

                        {review.difficultyRating && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 bg-orange-50 px-1.5 sm:px-2 py-1 rounded-full border border-orange-100">
                            <span className="font-medium text-orange-700 hidden sm:inline">
                              Difficulty:
                            </span>
                            <span className="font-medium text-orange-700 sm:hidden">
                              D:
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                  key={star}
                                  className={`w-2 h-2 ${
                                    star <= review.difficultyRating
                                      ? "text-orange-500"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </div>
                              ))}
                            </div>
                            <span className="text-orange-600 font-medium">
                              {review.difficultyRating}/5
                            </span>
                          </div>
                        )}

                        {review.valueForMoney && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 bg-green-50 px-1.5 sm:px-2 py-1 rounded-full border border-green-100">
                            <span className="font-medium text-green-700 hidden sm:inline">
                              Value:
                            </span>
                            <span className="font-medium text-green-700 sm:hidden">
                              V:
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                  key={star}
                                  className={`w-2 h-2 ${
                                    star <= review.valueForMoney
                                      ? "text-green-500"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </div>
                              ))}
                            </div>
                            <span className="text-green-600 font-medium">
                              {review.valueForMoney}/5
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Review Metadata */}
                    {review.createdAt && (
                      <div className="mt-3 text-xs text-gray-500">
                        Reviewed on{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    )}

                    {/* Helpful Button */}
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={() => handleMarkHelpful(review.id)}
                        className={cn(
                          "text-sm flex items-center gap-1 transition-colors",
                          isHelpful
                            ? "text-blue-600 font-semibold"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                        disabled={isReported}
                      >
                        <ThumbsUp
                          className={cn("w-4 h-4", isHelpful && "fill-current")}
                        />
                        <span>
                          Helpful{" "}
                          {(review.helpfulCount || 0) + (isHelpful ? 1 : 0) >
                            0 &&
                            `(${
                              (review.helpfulCount || 0) + (isHelpful ? 1 : 0)
                            })`}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Star className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-600 font-medium mb-2">
            {searchTerm || filterRating
              ? "No reviews match your criteria"
              : "No reviews yet"}
          </p>
          <p className="text-sm text-gray-500">
            {searchTerm || filterRating
              ? "Try adjusting your filters"
              : "Be the first to review this course!"}
          </p>
          {(searchTerm || filterRating) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setFilterRating(null);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Show More/Less Button */}
      {filteredAndSortedReviews.length > 3 && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setShowMore(!showMore)}>
            {showMore
              ? `Show Less`
              : `Show More Reviews (${
                  filteredAndSortedReviews.length - 3
                } more)`}
          </Button>
        </div>
      )}

      {/* Review Summary Stats */}
      {reviews.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Review Insights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Most Common Rating</div>
              <div className="font-semibold text-gray-900 flex items-center gap-1 mt-1">
                {renderStars(
                  ratingDistribution.reduce((a, b) =>
                    a.count > b.count ? a : b
                  ).stars,
                  "sm"
                )}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Average Rating</div>
              <div className="font-semibold text-gray-900 mt-1">
                {avgRating.toFixed(1)} out of 5
              </div>
            </div>
            <div>
              <div className="text-gray-600">Total Reviews</div>
              <div className="font-semibold text-gray-900 mt-1">
                {totalRatings.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Would Recommend</div>
              <div className="font-semibold text-gray-900 mt-1">
                {Math.round(
                  ((ratingDistribution[0].count + ratingDistribution[1].count) /
                    totalRatings) *
                    100
                )}
                %
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Review Form Modal */}
      {showReviewForm && (
        <StudentReviewForm
          courseId={course.id}
          isOpen={showReviewForm}
          onClose={() => {
            setShowReviewForm(false);
            setEditingReview(null);
          }}
          existingRating={editingReview ? userRating : null}
          onSuccess={handleReviewSuccess}
        />
      )}

      {/* Delete Review Confirmation Modal */}
      {deleteConfirm && (
        <DeleteReviewModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isSubmitting}
          reviewRating={deleteConfirm.rating}
          reviewComment={deleteConfirm.comment}
        />
      )}
    </div>
  );
}
