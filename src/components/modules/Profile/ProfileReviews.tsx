import { Star } from "lucide-react";

// Update props interface:
interface ProfileReviewsProps {
  reviews: {
    _id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user?: {
      name: string;
      profilePicture?: string;
    };
    listingTitle?: string;
  }[];
  stats: {
    averageRating: number;
    totalReviews: number;
  };
  isGuide: boolean;
  isOwnProfile: boolean;
}

export default function ProfileReviews({
  reviews,
  stats,
  isGuide,
  isOwnProfile,
}: ProfileReviewsProps) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Star className="w-6 h-6 text-yellow-500 fill-current" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isGuide ? "Reviews & Ratings" : "Reviews Written"}
            </h2>
            <div className="flex items-center gap-2">
              {stats.averageRating > 0 ? (
                <>
                  <span className="text-2xl font-bold text-gray-900">
                    {stats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-600">
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </>
              ) : (
                <span className="text-gray-600">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}{" "}
                  {isGuide ? "received" : "written"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {reviews.map((review) => {
            const reviewerName = review.user?.name || "Traveler";
            const reviewerInitial =
              reviewerName?.charAt(0)?.toUpperCase() || "T";

            return (
              <div key={review._id} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      isGuide
                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : "bg-gradient-to-r from-blue-400 to-purple-500"
                    }`}
                  >
                    {reviewerInitial}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {reviewerName}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {review.listingTitle && (
                            <>
                              For tour: <strong>{review.listingTitle}</strong>
                            </>
                          )}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
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
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-3">{review.comment}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6">
          <p className="text-gray-600">
            {isOwnProfile
              ? isGuide
                ? "You haven't received any reviews yet."
                : "You haven't written any reviews yet."
              : isGuide
              ? "This guide has not received any reviews yet."
              : "This user has not written any reviews yet."}
          </p>
        </div>
      )}
    </div>
  );
}
