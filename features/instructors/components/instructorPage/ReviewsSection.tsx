"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

// Helper function to safely create dates
const safeCreateDate = (dateString: string | undefined): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Helper function to safely format date distance
const safeFormatDistanceToNow = (dateString: string | undefined): string => {
  const date = safeCreateDate(dateString);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : "Unknown date";
};
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Filter,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Review } from "@/types/instructorTypes";
import {
  useInstructorRatingManagement,
  useCreateInstructorRating,
  useUpdateInstructorRating,
  useDeleteInstructorRating,
} from "../../hooks/useInstructorRating";
import { useAuth } from "@/hooks/useAuth";
import { InstructorRating } from "@/types/instructorRatingTypes";
import { FloatRatingInput } from "@/components/shared/FloatRatingInput";
import { DeleteConfirmationModal } from "@/components/shared/DeleteConfirmationModal";

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  instructorName: string;
  instructorId: string;
}

export function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
  instructorName,
  instructorId,
}: ReviewsSectionProps) {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    text: "",
    course: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ratingToDelete, setRatingToDelete] = useState<string | null>(null);

  // Use the new rating system hooks
  const ratingManagement = useInstructorRatingManagement(instructorId);
  const createRating = useCreateInstructorRating();
  const updateRating = useUpdateInstructorRating();
  const deleteRating = useDeleteInstructorRating(instructorId);

  // Check if user is eligible to rate
  const isEligible = ratingManagement.eligibility.data?.isEligible ?? false;

  // Check if user has a valid existing rating (not empty or default)
  const hasExistingRating = !!(
    ratingManagement.studentRating.data &&
    ratingManagement.studentRating.data.rating > 0 &&
    ratingManagement.studentRating.data.id
  );

  // Debug: Log the rating data to understand what's being returned
  console.log("Rating Debug:", {
    studentRatingData: ratingManagement.studentRating.data,
    hasExistingRating,
    isEligible,
    user: user?.id,
    ratingId: ratingManagement.studentRating.data?.id,
    ratingValue: ratingManagement.studentRating.data?.rating,
  });

  // Get the reviews data from the rating management system
  const reviewsData = ratingManagement.ratings.data?.ratings || [];
  const totalReviewsCount =
    ratingManagement.stats.data?.totalRatings || totalReviews;

  // Calculate rating distribution from the new rating system
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count =
      ratingManagement.stats.data?.ratingDistribution?.[
        rating as keyof typeof ratingManagement.stats.data.ratingDistribution
      ] || 0;
    const percentage =
      totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
    return { rating, count, percentage };
  });

  // Filter and sort reviews using the new rating system data
  const filteredAndSortedReviews = reviewsData
    .filter(
      (rating) =>
        filterRating === "all" || Math.round(rating.rating) === filterRating
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          const dateB = safeCreateDate(b.createdAt);
          const dateA = safeCreateDate(a.createdAt);
          if (!dateB || !dateA) return 0;
          return dateB.getTime() - dateA.getTime();
        case "oldest":
          const dateAOld = safeCreateDate(a.createdAt);
          const dateBOld = safeCreateDate(b.createdAt);
          if (!dateAOld || !dateBOld) return 0;
          return dateAOld.getTime() - dateBOld.getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  const handleWriteReview = async () => {
    if (newReview.rating === 0) {
      return;
    }

    try {
      // Always check if user has existing rating and update it
      if (hasExistingRating && ratingManagement.studentRating.data) {
        await updateRating.mutateAsync({
          ratingId: ratingManagement.studentRating.data.id,
          ratingData: {
            rating: newReview.rating,
            comment: newReview.text,
            isPublic: isPublic,
          },
        });
      } else {
        // Only create new rating if user doesn't have one
        await createRating.mutateAsync({
          instructorId,
          rating: newReview.rating,
          comment: newReview.text,
          isPublic: isPublic,
        });
      }

      setShowWriteReview(false);
      setNewReview({ rating: 0, text: "", course: "" });
      setIsPublic(true);
    } catch (error) {
      console.error("Error handling rating:", error);
    }
  };

  const handleDeleteRating = (ratingId: string) => {
    setRatingToDelete(ratingId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (ratingToDelete) {
      await deleteRating.mutateAsync(ratingToDelete);
      setShowDeleteModal(false);
      setRatingToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRatingToDelete(null);
  };

  const initializeFormWithExistingRating = () => {
    if (ratingManagement.studentRating.data) {
      setNewReview({
        rating: ratingManagement.studentRating.data.rating,
        text: ratingManagement.studentRating.data.comment || "",
        course: "",
      });
      setIsPublic(ratingManagement.studentRating.data.isPublic);
    } else {
      setNewReview({ rating: 0, text: "", course: "" });
      setIsPublic(true);
    }
  };

  const openWriteReview = () => {
    initializeFormWithExistingRating();
    setShowWriteReview(true);
  };

  const getRatingText = (rating: number) => {
    if (rating === 0) return "Select a rating";
    if (rating <= 1) return "Poor";
    if (rating <= 2) return "Fair";
    if (rating <= 3) return "Good";
    if (rating <= 4) return "Very Good";
    return "Excellent";
  };

  const getRatingColor = (rating: number) => {
    if (rating === 0) return "text-gray-400";
    if (rating <= 2) return "text-red-500";
    if (rating <= 3) return "text-yellow-500";
    if (rating <= 4) return "text-blue-500";
    return "text-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Reviews Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Student Reviews</span>
            <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
              <DialogTrigger asChild>
                <Button disabled={!isEligible} onClick={openWriteReview}>
                  {hasExistingRating ? "Edit Review" : "Write a Review"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {ratingManagement.studentRating.data
                      ? `Edit Your Review for ${instructorName}`
                      : `Write a Review for ${instructorName}`}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Form submit event triggered");
                    handleWriteReview();
                  }}
                  className="space-y-6"
                >
                  {/* Rating Stars */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Your Rating
                    </Label>
                    <FloatRatingInput
                      value={newReview.rating}
                      onChange={(rating) =>
                        setNewReview((prev) => ({
                          ...prev,
                          rating,
                        }))
                      }
                      disabled={
                        createRating.isPending || updateRating.isPending
                      }
                      size="lg"
                      showValue={true}
                    />
                  </div>

                  {/* Comment Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        Your Review
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPreview(!showPreview)}
                          className="gap-2"
                        >
                          {showPreview ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          {showPreview ? "Hide Preview" : "Preview"}
                        </Button>
                      </div>
                    </div>

                    {!showPreview ? (
                      <Textarea
                        placeholder="Share your experience with this instructor. What did you like? What could be improved?"
                        value={newReview.text}
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            text: e.target.value,
                          }))
                        }
                        disabled={createRating.isPending}
                        className="min-h-[120px] resize-none"
                        maxLength={1000}
                      />
                    ) : (
                      <div className="min-h-[120px] p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="prose prose-sm max-w-none">
                          {newReview.text ? (
                            <p className="text-gray-700 whitespace-pre-wrap">
                              {newReview.text}
                            </p>
                          ) : (
                            <p className="text-gray-400 italic">
                              No comment provided
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{newReview.text.length}/1000 characters</span>
                      <span className="text-gray-400">
                        Optional but recommended
                      </span>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Privacy Settings
                    </Label>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            Make this review public
                          </span>
                          {isPublic ? (
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-700"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Public
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-gray-300 text-gray-600"
                            >
                              <EyeOff className="h-3 w-3 mr-1" />
                              Private
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {isPublic
                            ? "Your review will be visible to everyone"
                            : "Your review will only be visible to the instructor"}
                        </p>
                      </div>
                      <Switch
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                        disabled={createRating.isPending}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowWriteReview(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        handleWriteReview();
                      }}
                      className="flex-1"
                      disabled={
                        newReview.rating === 0 ||
                        createRating.isPending ||
                        updateRating.isPending
                      }
                    >
                      {createRating.isPending || updateRating.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {hasExistingRating ? "Updating..." : "Submitting..."}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {hasExistingRating
                            ? "Update Review"
                            : "Submit Review"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {(
                  ratingManagement.stats.data?.averageRating ??
                  averageRating ??
                  0
                ).toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i <
                      Math.floor(
                        ratingManagement.stats.data?.averageRating ??
                          averageRating ??
                          0
                      )
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted stroke-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Based on{" "}
                {ratingManagement.stats.data?.totalRatings ?? totalReviews}{" "}
                review
                {(ratingManagement.stats.data?.totalRatings ?? totalReviews) !==
                1
                  ? "s"
                  : ""}
              </div>
            </div>

            <div className="space-y-2">
              {ratingManagement.stats.data?.ratingDistribution
                ? [5, 4, 3, 2, 1].map((rating) => {
                    const count =
                      ratingManagement.stats.data?.ratingDistribution?.[
                        rating as keyof typeof ratingManagement.stats.data.ratingDistribution
                      ] ?? 0;
                    const percentage =
                      (ratingManagement.stats.data?.totalRatings ?? 0) > 0
                        ? (count /
                            (ratingManagement.stats.data?.totalRatings ?? 1)) *
                          100
                        : 0;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm">{rating}</span>
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        </div>
                        <Progress value={percentage} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })
                : ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm">{rating}</span>
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      </div>
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Eligibility Alert */}
          {ratingManagement.eligibility.data &&
            !ratingManagement.eligibility.data.isEligible && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Not Eligible to Rate:</strong>{" "}
                  {ratingManagement.eligibility.data.reason}
                </AlertDescription>
              </Alert>
            )}

          {/* Student's Own Rating - Only show if there's a valid rating */}
          {hasExistingRating &&
            ratingManagement.studentRating.data &&
            ratingManagement.studentRating.data.rating > 0 && (
              <Card className="border-2 border-blue-200 bg-blue-50/50 rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    Your Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <=
                              (ratingManagement.studentRating.data?.rating || 0)
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-lg">
                        {ratingManagement.studentRating.data?.rating?.toFixed(
                          1
                        ) || "0.0"}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                      {ratingManagement.studentRating.data &&
                        !ratingManagement.studentRating.data.isPublic && (
                          <Badge
                            variant="outline"
                            className="text-xs border-amber-200 text-amber-700"
                          >
                            <EyeOff className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        )}
                    </div>

                    {ratingManagement.studentRating.data?.comment && (
                      <p className="text-gray-700 leading-relaxed">
                        {ratingManagement.studentRating.data?.comment}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <span>
                          {safeFormatDistanceToNow(
                            ratingManagement.studentRating.data?.createdAt
                          )}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openWriteReview}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const ratingId =
                              ratingManagement.studentRating.data?.id;
                            if (ratingId) {
                              handleDeleteRating(ratingId);
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by rating:</span>
              <Select
                value={filterRating.toString()}
                onValueChange={(value) =>
                  setFilterRating(
                    value === "all" ? "all" : Number.parseInt(value)
                  )
                }
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
              <Select
                value={sortBy}
                onValueChange={(value: any) => setSortBy(value)}
              >
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
        {ratingManagement.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading reviews...</span>
          </div>
        ) : filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((rating) => (
            <div key={rating.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rating.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">
                    {rating.student?.firstName} {rating.student?.lastName}
                  </span>
                  {!rating.isPublic && (
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-200 text-amber-700"
                    >
                      <EyeOff className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {safeFormatDistanceToNow(rating.createdAt)}
                </span>
              </div>

              {rating.comment && (
                <p className="text-gray-700 leading-relaxed">
                  {rating.comment}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <span>{rating.helpfulVotes} helpful</span>
                </div>
                {user?.id === rating.studentId && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openWriteReview}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rating.id && handleDeleteRating(rating.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : filteredAndSortedReviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                {ratingManagement.eligibility.data?.isEligible
                  ? "Be the first to review this instructor!"
                  : "This instructor hasn't received any reviews yet."}
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* Load More Button */}
      {ratingManagement.ratings.data &&
        ratingManagement.ratings.data.totalPages > 1 && (
          <div className="text-center">
            <Button variant="outline">
              Load More Reviews
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Review"
        description="Are you sure you want to delete your review? This action cannot be undone."
        isLoading={deleteRating.isPending}
      />
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [showFullText, setShowFullText] = useState(false);

  const { reviewer, session, overallRating, comment, createdAt } = review;
  const timeAgo = safeFormatDistanceToNow(createdAt);

  const isLongText = comment.length > 200;
  const displayText =
    showFullText || !isLongText ? comment : `${comment.slice(0, 200)}...`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={reviewer.profileImage || "/placeholder.svg"}
                alt={`${reviewer.firstName} ${reviewer.lastName}`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium">
                {reviewer.firstName} {reviewer.lastName}
              </div>
              <div className="text-sm text-muted-foreground">{timeAgo}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < overallRating
                    ? "text-amber-500 fill-amber-500"
                    : "text-muted stroke-muted-foreground"
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
              <span className="text-xs text-muted-foreground">
                Was this helpful?
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${
                  isHelpful === true ? "text-green-600" : ""
                }`}
                onClick={() => setIsHelpful(isHelpful === true ? null : true)}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                <span className="text-xs">Yes</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${
                  isHelpful === false ? "text-red-600" : ""
                }`}
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
  );
}
