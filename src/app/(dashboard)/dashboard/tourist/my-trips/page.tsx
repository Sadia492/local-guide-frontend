// app/dashboard/my-trips/page.tsx
"use client";

import React, { useState, useEffect } from "react";
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
  Filter,
  Eye,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/actions/useAuth";
import { toast } from "sonner";

interface Booking {
  _id: string;
  listing: {
    _id: string;
    title: string;
    city: string;
    fee: number;
    duration: number;
    meetingPoint: string;
    images: string[];
    guide: {
      _id: string;
      name: string;
      email: string;
      profilePicture?: string;
    };
  };
  date: string;
  groupSize: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

const MyTripsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Fetch all bookings for the tourist
  const fetchMyTrips = async () => {
    try {
      setLoading(true);
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
      setBookings(data.data || []);
    } catch (err) {
      console.error("Error fetching trips:", err);
      toast.error("Failed to load your trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "TOURIST") {
      fetchMyTrips();
    }
  }, [user]);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const today = new Date();
    const bookingDate = new Date(booking.date);
    const isUpcoming = bookingDate >= today;
    const isPast = bookingDate < today;

    // Status filter
    let matchesStatus = true;
    if (statusFilter === "upcoming") {
      matchesStatus =
        isUpcoming &&
        booking.status !== "CANCELLED" &&
        booking.status !== "REJECTED" &&
        booking.status !== "COMPLETED";
    } else if (statusFilter === "past") {
      matchesStatus = isPast || booking.status === "COMPLETED";
    } else if (statusFilter === "confirmed") {
      matchesStatus = booking.status === "CONFIRMED";
    } else if (statusFilter === "pending") {
      matchesStatus = booking.status === "PENDING";
    } else if (statusFilter === "cancelled") {
      matchesStatus =
        booking.status === "CANCELLED" || booking.status === "REJECTED";
    }

    // Date filter
    let matchesDate = true;
    if (dateFilter === "thisMonth") {
      const thisMonth = new Date().getMonth();
      const bookingMonth = bookingDate.getMonth();
      matchesDate = bookingMonth === thisMonth;
    } else if (dateFilter === "nextMonth") {
      const nextMonth = new Date().getMonth() + 1;
      const bookingMonth = bookingDate.getMonth();
      matchesDate = bookingMonth === nextMonth;
    }

    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      booking.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.listing.guide.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesDate && matchesSearch;
  });

  // Sort by date (closest first)
  const sortedBookings = [...filteredBookings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate statistics
  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(
      (b) =>
        new Date(b.date) >= new Date() &&
        (b.status === "CONFIRMED" || b.status === "PENDING")
    ).length,
    past: bookings.filter(
      (b) => new Date(b.date) < new Date() || b.status === "COMPLETED"
    ).length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter(
      (b) => b.status === "CANCELLED" || b.status === "REJECTED"
    ).length,
    totalSpent: bookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const StatusBadge = ({
    status,
    date,
  }: {
    status: Booking["status"];
    date: string;
  }) => {
    const bookingDate = new Date(date);
    const today = new Date();
    const isUpcoming = bookingDate >= today;

    const config = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <AlertCircle className="w-3 h-3" />,
        text: "Pending Approval",
      },
      CONFIRMED: {
        color: "bg-blue-100 text-blue-800",
        icon: <CheckCircle className="w-3 h-3" />,
        text: isUpcoming ? "Confirmed - Upcoming" : "Confirmed - Past",
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
      REJECTED: {
        color: "bg-gray-100 text-gray-800",
        icon: <XCircle className="w-3 h-3" />,
        text: "Rejected by Guide",
      },
    };

    const { color, icon, text } = config[status];

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}
      >
        {icon}
        {text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
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
            onClick={fetchMyTrips}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.upcoming}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.completed}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">
                  Total Trips
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">
                  Total Spent
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${stats.totalSpent}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
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

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="pending">Pending Approval</option>
              <option value="confirmed">Confirmed</option>
              <option value="past">Past & Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="all">All Dates</option>
              <option value="thisMonth">This Month</option>
              <option value="nextMonth">Next Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trips List */}
      {sortedBookings.length > 0 ? (
        <div className="space-y-4">
          {sortedBookings.map((booking) => {
            const bookingDate = new Date(booking.date);
            const today = new Date();
            const isUpcoming = bookingDate >= today;

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
                          <div className="flex items-center gap-4 text-sm text-gray-600">
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
                              {booking.groupSize} people
                            </span>
                          </div>
                        </div>
                        <StatusBadge
                          status={booking.status}
                          date={booking.date}
                        />
                      </div>

                      {/* Price and Duration */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-blue-700 font-medium mb-1">
                            Total Amount
                          </div>
                          <div className="flex items-center text-lg font-bold text-gray-900">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {booking.totalPrice}
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
                    <div className="lg:w-64 border-l lg:border-l-0 lg:border-t lg:pt-6 lg:pl-6">
                      {/* Guide Info */}
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-900 mb-3">
                          Your Guide
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {booking.listing.guide.name?.charAt(0) || "G"}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {booking.listing.guide.name}
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
                          href={`/my-trips/${booking._id}`}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Link>

                        <Link
                          href={`/tours/${booking.listing._id}`}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Tour
                        </Link>

                        {isUpcoming && booking.status === "CONFIRMED" && (
                          <button
                            onClick={() => {
                              // Cancel booking logic
                              toast.info("Cancellation feature coming soon");
                            }}
                            className="w-full px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
                          >
                            Cancel Booking
                          </button>
                        )}

                        {booking.status === "COMPLETED" && (
                          <Link
                            href={`/reviews/new?booking=${booking._id}`}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Star className="w-4 h-4" />
                            Leave Review
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
            {searchTerm || statusFilter !== "all" || dateFilter !== "all"
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
    </div>
  );
};

export default MyTripsPage;
