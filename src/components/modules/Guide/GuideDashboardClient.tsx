// components/modules/Guide/GuideDashboardClient.tsx
"use client";

import Link from "next/link";
import {
  Calendar,
  MapPin,
  Star,
  DollarSign,
  Users,
  Package,
  MessageCircle,
  CheckCircle,
  Clock,
  Award,
  Edit,
  Eye,
} from "lucide-react";

interface GuideDashboardClientProps {
  dashboardData: {
    activeListings?: Array<any>;
    upcomingBookings?: Array<any>;
    recentReviews?: Array<any>;
    stats?: {
      totalListings: number;
      activeListings: number;
      totalBookings: number;
      pendingBookings: number;
      completedBookings: number;
      totalEarnings: number;
      averageRating: number;
      totalReviews: number;
    };
  };
}

export default function GuideDashboardClient({
  dashboardData = {},
}: GuideDashboardClientProps) {
  // Safe data extraction with defaults
  const stats = dashboardData?.stats || {
    totalListings: 0,
    activeListings: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalReviews: 0,
  };

  const upcomingBookings = dashboardData?.upcomingBookings || [];
  const recentReviews = dashboardData?.recentReviews || [];
  const activeListings = dashboardData?.activeListings || [];

  const statCards = [
    {
      title: "Active Tours",
      value: stats.activeListings,
      icon: MapPin,
      color: "bg-gradient-to-br from-emerald-500 to-green-600",
      textColor: "text-emerald-600",
      link: "/dashboard/guide/my-listings",
      description: "Live experiences",
    },
    {
      title: "Upcoming Bookings",
      value: stats.pendingBookings,
      icon: Calendar,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      link: "/dashboard/guide/upcoming-bookings",
      description: "Needs confirmation",
    },
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings}`,
      icon: DollarSign,
      color: "bg-gradient-to-br from-amber-500 to-yellow-600",
      textColor: "text-amber-600",
      link: "/dashboard/guide",
      description: "Platform earnings",
    },
    {
      title: "Avg. Rating",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      link: "/dashboard/guide",
      description: `${stats.totalReviews} reviews`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-10">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Welcome back, Guide! 🗺️
              </h1>
              <p className="text-lg text-gray-600 mb-4 max-w-2xl">
                Manage your tours, bookings, and connect with travelers from
                around the world.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat) => (
            <Link
              href={stat.link}
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {stat.description}
                  </p>
                </div>
                <div
                  className={`${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Upcoming Bookings
                      </h2>
                      <p className="text-sm text-gray-500">
                        {upcomingBookings.length}{" "}
                        {upcomingBookings.length === 1 ? "booking" : "bookings"}{" "}
                        pending
                      </p>
                    </div>
                  </div>
                  {upcomingBookings.length > 0 && (
                    <Link
                      href="/dashboard/guide/upcoming-bookings"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Manage all
                    </Link>
                  )}
                </div>
              </div>

              <div className="p-6">
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking?._id || Math.random()}
                        className="group flex items-center p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-blue-50/30 hover:from-blue-100/50 hover:to-blue-100/30 transition-all duration-300 border border-blue-100 hover:border-blue-200"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate mb-1">
                            {booking?.listing?.title || "Unknown Tour"}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {booking?.user?.name || "Unknown User"}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {booking?.groupSize || 0} people
                            </span>
                            <span className="font-medium text-gray-900">
                              ${booking?.totalPrice || 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking?.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {booking?.status || "UNKNOWN"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {booking?.date
                              ? new Date(booking.date).toLocaleDateString()
                              : "No date"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No upcoming bookings
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      You don't have any upcoming bookings. Promote your tours
                      to get more visibility.
                    </p>
                    <Link
                      href="/dashboard/guide/my-listings"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Edit Your Tours
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Recent Reviews
                      </h2>
                      <p className="text-sm text-gray-500">
                        {recentReviews.length}{" "}
                        {recentReviews.length === 1 ? "review" : "reviews"}{" "}
                        received
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {recentReviews.length > 0 ? (
                  <div className="space-y-6">
                    {recentReviews.slice(0, 2).map((review) => (
                      <div
                        key={review?._id || Math.random()}
                        className="pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {review?.user?.name?.charAt(0) || "U"}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review?.user?.name || "Anonymous"}
                              </h4>
                              <div className="flex items-center mt-1">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < (review?.rating || 0)
                                          ? "text-amber-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">
                                  {review?.createdAt
                                    ? new Date(
                                        review.createdAt
                                      ).toLocaleDateString()
                                    : "No date"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 italic">
                          "{review?.comment || "No comment provided"}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Star className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Reviews will appear here after your first completed tours.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Guide Statistics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Your Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Total Listings
                      </p>
                      <p className="text-sm text-gray-500">
                        {stats.totalListings} tours created
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/guide/my-listings"
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Completed Bookings
                      </p>
                      <p className="text-sm text-gray-500">
                        {stats.completedBookings} experiences
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/guide/upcoming-bookings?status=completed"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Response Rate</p>
                      <p className="text-sm text-gray-500">
                        Respond quickly to inquiries
                      </p>
                    </div>
                  </div>
                  <span className="text-amber-600 font-medium">100%</span>
                </div>
              </div>
            </div>

            {/* Guide Level */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Guide Level</h4>
                  <p className="text-sm text-gray-600">Rising Star</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress to next level</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Complete 5 more tours to reach "Experienced Guide" level and
                unlock premium features.
              </p>
            </div>

            {/* Support CTA */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to help you succeed as a guide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
