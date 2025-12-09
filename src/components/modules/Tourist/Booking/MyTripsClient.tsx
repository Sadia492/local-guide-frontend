"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Search,
  Eye,
  ExternalLink,
  Loader2,
  RefreshCw,
  CreditCard,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ReviewDialog from "@/components/modules/Tourist/ReviewDialog";
import { Booking, Guide } from "@/services/booking/myTrips.service";
import {
  filterTrips,
  sortTripsByDate,
  getTripStats,
  formatDate,
  getGuideName,
  getGuideInitials,
  hasReview,
} from "@/lib/tripUtils";
import { createPaymentAction } from "@/actions/tripActions";

interface MyTripsClientProps {
  initialTrips: Booking[];
  initialStats: {
    total: number;
    upcoming: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    reviewed: number;
    totalSpent: number;
  };
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    PENDING: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <AlertCircle className="w-3 h-3" />,
      text: "Pending",
    },
    CONFIRMED: {
      color: "bg-blue-100 text-blue-800",
      icon: <CheckCircle className="w-3 h-3" />,
      text: "Confirmed",
    },
    COMPLETED: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="w-3 h-3" />,
      text: "Completed",
    },
    CANCELLED: {
      color: "bg-red-100 text-red-800",
      icon: <XCircle className="w-3 h-3" />,
      text: "Cancelled",
    },
  };

  const statusConfig = config[status as keyof typeof config] || {
    color: "bg-gray-100 text-gray-800",
    icon: <AlertCircle className="w-3 h-3" />,
    text: status,
  };

  const { color, icon, text } = statusConfig;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {icon}
      {text}
    </span>
  );
};

export default function MyTripsClient({
  initialTrips,
  initialStats,
}: MyTripsClientProps) {
  const [trips, setTrips] = useState<Booking[]>(initialTrips);
  const [guides, setGuides] = useState<Record<string, Guide>>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Review dialog state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] =
    useState<Booking | null>(null);

  const [processingPayment, setProcessingPayment] = useState<string | null>(
    null
  );

  // Stats
  const [stats, setStats] = useState(initialStats);

  // Extract unique guide IDs from trips and fetch their details
  useEffect(() => {
    const fetchGuideDetails = async () => {
      const guideIds = new Set<string>();
      trips.forEach((booking) => {
        const guideId =
          typeof booking.listing.guide === "string"
            ? booking.listing.guide
            : booking.listing.guide._id;
        guideIds.add(guideId);
      });

      const guidePromises = Array.from(guideIds).map(async (guideId) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile-details/${guideId}`,
            {
              credentials: "include",
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data?.user) {
              return { id: guideId, ...data.data.user };
            }
          }
        } catch (error) {
          console.error(`Error fetching guide ${guideId}:`, error);
        }
        return null;
      });

      const guideResults = await Promise.all(guidePromises);
      const guideMap: Record<string, Guide> = {};

      guideResults.forEach((guide) => {
        if (guide) {
          guideMap[guide.id] = guide;
        }
      });

      setGuides(guideMap);
    };

    if (trips.length > 0) {
      fetchGuideDetails();
    }
  }, [trips]);

  // Refresh data
  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/my-bookings`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch trips: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setTrips(data.data);
        const newStats = getTripStats(data.data);
        setStats(newStats);
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
      toast.error("Failed to load your trips");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    const filtered = filterTrips(trips, {
      searchTerm,
      statusFilter,
      guides,
    });
    return sortTripsByDate(filtered);
  }, [trips, searchTerm, statusFilter, guides]);

  // Handle Pay Now button click
  const handlePayNow = async (bookingId: string) => {
    try {
      setProcessingPayment(bookingId);

      const result = await createPaymentAction(bookingId);

      // Redirect to Stripe payment page
      window.location.href = result.paymentUrl;
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Failed to create payment session");
    } finally {
      setProcessingPayment(null);
    }
  };

  // Handle Review button click
  const handleReviewClick = (booking: Booking) => {
    setSelectedBookingForReview(booking);
    setReviewDialogOpen(true);
  };

  // Handle review submission success
  const handleReviewSubmitted = () => {
    refreshData();
    toast.success("Review submitted!", {
      description: "Thank you for sharing your experience.",
    });
  };

  return (
    <div className="p-6">
      {/* Review Dialog */}
      {selectedBookingForReview && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          bookingId={selectedBookingForReview._id}
          listingId={selectedBookingForReview.listing._id}
          listingTitle={selectedBookingForReview.listing.title}
          guideName={getGuideName(
            selectedBookingForReview.listing as any,
            guides
          )}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-1">
              View and manage all your tour bookings
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
        </div>

        {/* Stats Cards - Updated with REVIEWED */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.confirmed}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.completed}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Reviewed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.reviewed}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.cancelled}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-700 font-medium">
                  Total Spent
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${stats.totalSpent}
                </p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by tour, city, or guide name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Trips List */}
      {filteredTrips.length > 0 ? (
        <div className="space-y-4">
          {filteredTrips.map((booking) => {
            const bookingDate = new Date(booking.date);
            const today = new Date();
            const isUpcoming = bookingDate >= today;

            const guideId =
              typeof booking.listing.guide === "string"
                ? booking.listing.guide
                : booking.listing.guide._id;

            const guideName = getGuideName(booking.listing as any, guides);
            const guideInitials = getGuideInitials(guideName);
            const bookingHasReview = hasReview(booking);

            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Left Column - Trip Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">
                            {booking.listing.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {booking.listing.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(booking.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {booking.groupSize} person
                              {booking.groupSize !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={booking.status} />
                          {booking.status === "COMPLETED" &&
                            bookingHasReview && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                <Star className="w-3 h-3" />
                                Reviewed
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-blue-700 font-medium mb-1">
                            Total Amount
                          </div>
                          <div className="flex items-center text-lg font-bold text-gray-900">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {booking.totalPrice ||
                              booking.listing.fee * booking.groupSize}
                          </div>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-xs text-green-700 font-medium mb-1">
                            Duration
                          </div>
                          <div className="text-gray-900">
                            {booking.listing.duration} hours
                          </div>
                        </div>

                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="text-xs text-purple-700 font-medium mb-1">
                            Meeting Point
                          </div>
                          <div className="text-sm text-gray-700">
                            {booking.listing.meetingPoint}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Guide Info & Actions */}
                    <div className="lg:w-64 border-t lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0 pt-4">
                      {/* Guide Info */}
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-900 mb-3">
                          Your Guide
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {guideInitials}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {guideName}
                            </div>
                            <div className="text-xs text-gray-600">
                              Local Guide
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Link
                          href={`/dashboard/tourist/my-trips/${booking?.listing?._id}`}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Link>

                        {/* Pay Now button for CONFIRMED bookings */}
                        {booking.status === "CONFIRMED" && (
                          <button
                            onClick={() => handlePayNow(booking._id)}
                            disabled={processingPayment === booking._id}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingPayment === booking._id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4" />
                                Pay Now - $
                                {booking.totalPrice ||
                                  booking.listing.fee * booking.groupSize}
                              </>
                            )}
                          </button>
                        )}

                        {/* Review button for COMPLETED bookings without review */}
                        {booking.status === "COMPLETED" &&
                          !bookingHasReview && (
                            <button
                              onClick={() => handleReviewClick(booking)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Star className="w-4 h-4" />
                              Write a Review
                            </button>
                          )}

                        {/* Reviewed badge for COMPLETED bookings with review */}
                        {booking.status === "COMPLETED" && bookingHasReview && (
                          <div className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2">
                              <ThumbsUp className="w-4 h-4" />
                              <span className="font-medium">Reviewed</span>
                            </div>
                            {booking.review?.rating && (
                              <div className="flex items-center justify-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < booking.review!.rating
                                        ? "text-yellow-500 fill-current"
                                        : "text-purple-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Manage Booking button for PENDING bookings */}
                        {booking.status === "PENDING" && (
                          <button
                            onClick={() => {
                              toast.info(
                                "Your booking is pending guide's approval"
                              );
                            }}
                            className="w-full px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors text-sm"
                          >
                            Awaiting Guide Approval
                          </button>
                        )}

                        {guideId && booking.status !== "CANCELLED" && (
                          <Link
                            href={`/profile/${guideId}`}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            View Guide Profile
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No trips found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "You haven't booked any tours yet"}
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Explore Tours
          </Link>
        </div>
      )}

      {/* Info Box for Reviews */}
      {stats.completed > 0 && stats.reviewed < stats.completed && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-yellow-900 mb-2">
                Share Your Experience
              </h4>
              <p className="text-sm text-yellow-800 mb-3">
                You have {stats.completed - stats.reviewed} completed tour(s)
                waiting for your review. Your feedback helps guides improve and
                assists other travelers in making decisions.
              </p>
              <button
                onClick={() => {
                  const firstUnreviewed = filteredTrips.find(
                    (b) => b.status === "COMPLETED" && !hasReview(b)
                  );
                  if (firstUnreviewed) {
                    handleReviewClick(firstUnreviewed);
                  }
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium"
              >
                Write a Review Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
