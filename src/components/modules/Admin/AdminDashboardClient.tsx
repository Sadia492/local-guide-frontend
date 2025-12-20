// app/dashboard/admin/AdminDashboardClient.tsx
"use client";

import {
  Users,
  MapPin,
  Calendar,
  Star,
  Package,
  Clock,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { DashboardStats } from "@/services/meta/meta.service";

// Dynamically import charts
const BarChart = dynamic(() => import("@/components/shared/Charts/BarChart"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />,
});

const PieChart = dynamic(() => import("@/components/shared/Charts/PieChart"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />,
});

interface AdminDashboardClientProps {
  stats: DashboardStats;
  bookingChartData: Array<{ month: string; count: number }>;
  categoryChartData: Array<{ name: string; value: number }>;
  userRoleData: Array<{ name: string; value: number }>;
  hasChartData: boolean;
}

export default function AdminDashboardClient({
  stats,
  bookingChartData,
  categoryChartData,
  userRoleData,
  hasChartData,
}: AdminDashboardClientProps) {
  // Prepare data for stat cards
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      secondaryValue: `${stats.totalGuides} guides, ${stats.totalTourists} tourists`,
      link: "/dashboard/admin/users",
      description: "Registered platform users",
    },
    {
      title: "Total Tours",
      value: stats.totalListings,
      icon: MapPin,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      secondaryValue: `${stats.activeListings} active`,
      link: "/dashboard/admin/listings",
      description: "Tour listings created",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      secondaryValue: `${stats.pendingBookings} pending`,
      link: "/dashboard/admin/bookings",
      description: "All reservations",
    },
    {
      title: "Completed Bookings",
      value: stats.totalBookings - stats.pendingBookings,
      icon: CheckCircle,
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
      secondaryValue: `${stats.pendingBookings} pending`,
      link: "/dashboard/admin/bookings?status=completed",
      description: "Fulfilled experiences",
    },
    {
      title: "Active Tours",
      value: stats.activeListings,
      icon: Package,
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      secondaryValue: `${stats.totalListings} total`,
      link: "/dashboard/admin/listings?status=active",
      description: "Currently available",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: "bg-gradient-to-br from-pink-500 to-rose-600",
      secondaryValue: `${stats.recentReviews.length} recent reviews`,
      link: "/dashboard/admin/reviews",
      description: "Platform satisfaction",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Clock,
      color: "bg-gradient-to-br from-rose-500 to-rose-600",
      secondaryValue: "Awaiting confirmation",
      link: "/dashboard/admin/bookings?status=pending",
      description: "Needs action",
    },
    {
      title: "Verified Guides",
      value: stats.totalGuides,
      icon: UserCheck,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      secondaryValue: `${stats.totalTourists} tourists`,
      link: "/dashboard/admin/guides",
      description: "Local experts",
    },
  ];

  const managementSections = [
    {
      title: "User Management",
      description: `Manage ${stats.totalUsers} user accounts`,
      icon: Users,
      link: "/dashboard/admin/users",
      linkText: "Manage Users",
      color: "bg-blue-50 border-blue-100",
    },
    {
      title: "Tour Management",
      description: `Manage ${stats.totalListings} tour listings`,
      icon: MapPin,
      link: "/dashboard/admin/listings",
      linkText: "Manage Tours",
      color: "bg-green-50 border-green-100",
    },
    {
      title: "Booking Management",
      description: `Manage ${stats.totalBookings} bookings`,
      icon: Calendar,
      link: "/dashboard/admin/bookings",
      linkText: "View Bookings",
      color: "bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time platform overview • Last updated:{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            href={card.link}
            key={card.title}
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100 block"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <p className="text-2xl font-bold mt-2 text-gray-900">
                  {card.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{card.description}</p>
              </div>
              <div className={`${card.color} p-3 rounded-xl`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <span className="text-sm font-medium text-gray-600">
                {card.secondaryValue}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      {hasChartData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Bookings Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Monthly Bookings
                </h3>
                <p className="text-sm text-gray-500">
                  {bookingChartData.length > 0
                    ? `Showing ${bookingChartData.length} months of data`
                    : "No booking data available"}
                </p>
              </div>
            </div>
            <div className="h-64">
              {bookingChartData.length > 0 ? (
                <BarChart
                  data={bookingChartData}
                  xKey="month"
                  bars={[{ key: "count", color: "#3b82f6", label: "Bookings" }]}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No booking data available yet
                </div>
              )}
            </div>
          </div>

          {/* Tour Categories Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Tour Categories
              </h3>
              <p className="text-sm text-gray-500">
                {categoryChartData.length > 0
                  ? `${categoryChartData.length} categories`
                  : "No category data"}
              </p>
            </div>
            <div className="h-64">
              {categoryChartData.length > 0 ? (
                <PieChart
                  data={categoryChartData}
                  colors={[
                    "#3b82f6",
                    "#10b981",
                    "#f59e0b",
                    "#8b5cf6",
                    "#ef4444",
                    "#ec4899",
                  ]}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No category data available
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {categoryChartData.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.value} tours
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity & Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Recent Bookings
              </h3>
              <p className="text-sm text-gray-500">
                {stats.recentBookings?.length > 0
                  ? `${stats.recentBookings.length} recent bookings`
                  : "No recent bookings"}
              </p>
            </div>
            <Link
              href="/dashboard/admin/bookings"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-4">
            {stats.recentBookings && stats.recentBookings.length > 0 ? (
              stats.recentBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {booking.listing?.title || "Unknown Tour"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {booking.user?.name || "Unknown User"} • $
                        {booking.totalPrice || 0}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {booking.status || "UNKNOWN"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {booking.date
                        ? new Date(booking.date).toLocaleDateString()
                        : "No date"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No recent bookings found
              </div>
            )}
          </div>
        </div>

        {/* Quick Management & Stats */}
        <div className="space-y-6">
          {/* Management Cards */}
          {managementSections.map((section) => (
            <Link
              href={section.link}
              key={section.title}
              className={`group p-6 rounded-xl border-2 ${section.color} hover:border-blue-300 transition-all duration-300 block`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-lg ${section.color
                    .replace("50", "100")
                    .replace("border-", "bg-")}`}
                >
                  <section.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{section.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {section.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-800">
                <span className="text-sm font-medium">{section.linkText}</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}

          {/* User Role Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4">User Distribution</h4>
            <div className="space-y-3">
              {userRoleData.map((role, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{role.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {role.value}
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          index === 0
                            ? "bg-blue-500"
                            : index === 1
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                        style={{
                          width:
                            stats.totalUsers > 0
                              ? `${(role.value / stats.totalUsers) * 100}%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
