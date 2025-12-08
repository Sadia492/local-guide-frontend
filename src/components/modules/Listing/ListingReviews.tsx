"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { ListingReview } from "@/types/review";

interface ListingReviewsProps {
  reviews: ListingReview[];
  loading?: boolean;
}

export default function ListingReviews({
  reviews,
  loading,
}: ListingReviewsProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border mt-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border mt-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        Traveler Reviews
        {reviews.length > 0 && (
          <span className="ml-2 text-gray-600">
            ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
          </span>
        )}
      </h3>

      {reviews.length > 0 ? (
        <div>
          {/* Average Rating Summary */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex-1">
                {/* Rating Distribution */}
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const percentage = (count / reviews.length) * 100;

                  return (
                    <div key={star} className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm text-gray-600">{star}</span>
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-10 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
              <div
                key={review._id}
                className="border-b pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {review.user.name?.charAt(0) || "T"}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {review.user.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {reviews.length > 3 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {showAllReviews
                  ? "Show Less Reviews"
                  : `Show All ${reviews.length} Reviews`}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No Reviews Yet
          </h4>
          <p className="text-gray-600 max-w-md mx-auto">
            Be the first to review this tour after your experience!
          </p>
        </div>
      )}
    </div>
  );
}
