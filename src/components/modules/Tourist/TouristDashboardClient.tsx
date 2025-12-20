// components/modules/Tourist/TouristDashboardClient.tsx
"use client";

import Link from "next/link";
import {
  Calendar,
  MapPin,
  Star,
  Clock,
  Heart,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Compass,
  Globe,
  Award,
  History,
  PlusCircle,
  Search,
  ThumbsUp,
} from "lucide-react";

interface TouristDashboardClientProps {
  dashboardData: {
    upcomingBookings?: Array<any>;
    pastExperiences?: Array<any>;
  };
}

export default function TouristDashboardClient({
  dashboardData = {},
}: TouristDashboardClientProps) {
  // Safe data extraction with defaults
  const upcomingBookings = dashboardData?.upcomingBookings || [];
  const pastExperiences = dashboardData?.pastExperiences || [];

  const upcomingCount = upcomingBookings.length;
  const pastCount = pastExperiences.length;
  const visitedCities = new Set(
    pastExperiences.map((e) => e?.listing?.city).filter(Boolean)
  ).size;

  const stats = [
    {
      title: "Upcoming Trips",
      value: upcomingCount,
      icon: Calendar,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      link: "/dashboard/tourist/my-trips",
    },
    {
      title: "Cities Visited",
      value: visitedCities,
      icon: Globe,
      color: "bg-gradient-to-br from-emerald-500 to-green-600",
      textColor: "text-emerald-600",
      link: "/dashboard/tourist/my-trips",
    },
    {
      title: "Past Experiences",
      value: pastCount,
      icon: CheckCircle,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      link: "/dashboard/tourist/my-trips?status=completed",
    },
    {
      title: "Ready to Explore",
      value: "New",
      icon: Compass,
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      textColor: "text-amber-600",
      link: "/explore",
      isCTA: true,
    },
  ];

  const quickActions = [
    {
      title: "Find Food Tours",
      icon: Heart,
      color: "bg-gradient-to-br from-rose-500 to-pink-600",
      link: "/explore?category=food",
    },
    {
      title: "Book New Experience",
      icon: PlusCircle,
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
      link: "/explore",
    },
    {
      title: "Write a Review",
      icon: ThumbsUp,
      color: "bg-gradient-to-br from-amber-500 to-yellow-600",
      link: "/my-reviews",
    },
    {
      title: "Search Guides",
      icon: Search,
      color: "bg-gradient-to-br from-indigo-500 to-purple-600",
      link: "/guides",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-10">
        <div className="mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Welcome back! 👋
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            Ready for your next adventure? Here's what's happening with your
            travels.
          </p>
        </div>
      </div>

      <div className="mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <Link
              href={stat.link}
              key={stat.title}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                stat.isCTA
                  ? "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-300"
                  : "bg-white border border-gray-100 hover:border-gray-200"
              } hover:shadow-lg hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {stat.title}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      stat.isCTA ? "text-blue-700" : "text-gray-900"
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              {stat.isCTA && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <span className="text-sm font-medium text-blue-700">
                    Browse tours →
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Trips */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Upcoming Trips
                      </h2>
                      <p className="text-sm text-gray-500">
                        {upcomingCount} {upcomingCount === 1 ? "trip" : "trips"}{" "}
                        scheduled
                      </p>
                    </div>
                  </div>
                  {upcomingCount > 0 && (
                    <Link
                      href="/my-bookings"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View all
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
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate mb-1">
                            {booking?.listing?.title || "Unknown Tour"}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {booking?.listing?.city || "Unknown City"}
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
                      No upcoming trips
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      You don't have any trips scheduled. Browse available tours
                      and start your next adventure.
                    </p>
                    <Link
                      href="/explore"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Compass className="w-5 h-5 mr-2" />
                      Explore Tours
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Discover More */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Discover Hidden Gems
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Explore unique local experiences curated just for you. From
                    food tours to cultural walks, find your next adventure.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1.5 bg-white text-indigo-700 rounded-full text-sm font-medium border border-indigo-200">
                      Food Tours
                    </span>
                    <span className="px-3 py-1.5 bg-white text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
                      Cultural Walks
                    </span>
                    <span className="px-3 py-1.5 bg-white text-amber-700 rounded-full text-sm font-medium border border-amber-200">
                      Photography
                    </span>
                    <span className="px-3 py-1.5 bg-white text-rose-700 rounded-full text-sm font-medium border border-rose-200">
                      Adventure
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link href="/explore">
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg">
                      <Compass className="w-5 h-5 mr-2" />
                      Start Exploring
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    href={action.link}
                    className="group flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300"
                  >
                    <div
                      className={`${action.color} p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-700">
                      {action.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Past Experiences */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Past Experiences
                    </h3>
                    <p className="text-sm text-gray-500">
                      {pastCount} completed
                    </p>
                  </div>
                </div>
              </div>

              {pastExperiences.length > 0 ? (
                <div className="space-y-3">
                  {pastExperiences.slice(0, 4).map((exp) => (
                    <div
                      key={exp?._id || Math.random()}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">
                          {exp?.listing?.title || "Unknown Experience"}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{exp?.listing?.city || "Unknown City"}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {exp?.date
                          ? new Date(exp.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "No date"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    No past experiences yet
                  </p>
                </div>
              )}
            </div>

            {/* Travel Tip */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Pro Travel Tip
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Book tours at least 3 days in advance for better
                    availability and group rates.
                  </p>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Updated daily
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">
                Ready to explore?
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Find your next adventure with local experts
              </p>
              <Link href="/explore">
                <div className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg">
                  Browse All Tours
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
