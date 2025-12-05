// app/dashboard/bookings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  MapPin,
  User,
  Mail,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "sonner";

interface Booking {
  _id: string;
  user: string;
  listing: {
    _id: string;
    guide: string;
    title: string;
    description: string;
    city: string;
    fee: number;
    duration: number;
    meetingPoint: string;
    maxGroupSize: number;
    images: string[];
    language: string;
    isActive: boolean;
  } | null;
  date: string;
  groupSize: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch bookings from the API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/all-bookings`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to load bookings", {
        description:
          err instanceof Error ? err.message : "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      (booking.listing?.title?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (booking.listing?.city?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    const matchesDate = () => {
      if (dateFilter === "all") return true;
      const bookingDate = new Date(booking.date);
      const today = new Date();

      if (dateFilter === "today") {
        return bookingDate.toDateString() === today.toDateString();
      }
      if (dateFilter === "upcoming") {
        return bookingDate >= today;
      }
      if (dateFilter === "past") {
        return bookingDate < today;
      }
      return true;
    };

    return matchesSearch && matchesStatus && matchesDate();
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Status update handlers
  // const handleUpdateStatus = async (
  //   bookingId: string,
  //   newStatus: Booking["status"]
  // ) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //         body: JSON.stringify({ status: newStatus }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to update booking status");
  //     }

  //     // Update local state
  //     setBookings(
  //       bookings.map((booking) =>
  //         booking._id === bookingId
  //           ? { ...booking, status: newStatus }
  //           : booking
  //       )
  //     );

  //     toast.success(`Booking ${newStatus.toLowerCase()}`, {
  //       description: `Booking has been ${newStatus.toLowerCase()} successfully`,
  //     });
  //   } catch (error) {
  //     console.error("Error updating booking:", error);
  //     toast.error("Failed to update booking");
  //   }
  // };
  // Status update handlers with try-catch
  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: Booking["status"]
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking status");
      }

      // Update local state
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : booking
        )
      );

      toast.success(`Booking ${newStatus.toLowerCase()}`, {
        description: `Booking has been ${newStatus.toLowerCase()} successfully`,
      });
    } catch (error: any) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking", {
        description: error.message || "Please try again",
      });
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      const result = await Swal.fire({
        title: "Confirm Booking",
        text: "Are you sure you want to confirm this booking?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, confirm",
        cancelButtonText: "Cancel",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            return await handleUpdateStatus(bookingId, "CONFIRMED");
          } catch (error) {
            Swal.showValidationMessage(
              `Error: ${
                error instanceof Error
                  ? error.message
                  : "Failed to confirm booking"
              }`
            );
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });

      if (result.isConfirmed) {
        // Success is handled in handleUpdateStatus
      }
    } catch (error) {
      console.error("Error in confirm booking:", error);
      toast.error("Failed to process confirmation");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const result = await Swal.fire({
        title: "Cancel Booking",
        text: "Are you sure you want to cancel this booking?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, confirm",
        cancelButtonText: "Cancel",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            return await handleUpdateStatus(bookingId, "CANCELLED");
          } catch (error) {
            Swal.showValidationMessage(
              `Error: ${
                error instanceof Error
                  ? error.message
                  : "Failed to cancel booking"
              }`
            );
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });

      if (result.isConfirmed) {
        toast.success("Booking cancelled", {
          description: "The booking has been cancelled successfully",
        });
        // Success is handled in handleUpdateStatus
      }
    } catch (error) {
      console.error("Error in cancel booking:", error);
      toast.error("Failed to process cancellation");
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: Booking["status"] }) => {
    const statusConfig = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-3 h-3" />,
      },
      CONFIRMED: {
        color: "bg-blue-100 text-blue-800",
        icon: <CheckCircle className="w-3 h-3" />,
      },

      CANCELLED: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="w-3 h-3" />,
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
        <p className="text-gray-600 mt-1">View and manage all tour bookings</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by tour title or city..."
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
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            <button
              onClick={fetchBookings}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tour Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Group
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    {/* Tour Details */}
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                            {booking.listing?.images?.[0] ? (
                              <img
                                src={booking.listing.images[0]}
                                alt={booking.listing.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">
                              {booking.listing?.title || "Tour Deleted"}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                              <MapPin className="w-3 h-3" />
                              {booking.listing?.city || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              User ID: {booking.user}
                            </div>
                          </div>
                        </div>
                        {booking.listing?.meetingPoint && (
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Meeting:</span>{" "}
                            {booking.listing.meetingPoint}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Date & Group */}
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs text-gray-500">Date</div>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3 text-blue-500" />
                            {formatDate(booking.date)}
                          </div>
                          <div className="text-xs text-gray-600 ml-4">
                            {formatTime(booking.date)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">
                            Group Size
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="w-3 h-3 text-blue-500" />
                            {booking.groupSize} people
                          </div>
                        </div>
                        {booking.listing?.duration && (
                          <div className="text-xs text-gray-500">
                            Duration: {booking.listing.duration} hours
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-lg font-bold text-gray-900">
                          <DollarSign className="w-4 h-4" />
                          {booking.totalPrice}
                        </div>
                        {booking.listing?.fee && (
                          <div className="text-xs text-gray-500">
                            {booking.groupSize} × ${booking.listing.fee} per
                            person
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Booked on {formatDate(booking.createdAt)}
                        </div>
                      </div>
                    </td>

                    {/* Status & Actions */}
                    <td className="px-4 py-4">
                      <div className="space-y-3">
                        <div>
                          <StatusBadge status={booking.status} />
                        </div>

                        <div className="space-y-1">
                          {booking.status === "PENDING" && (
                            <>
                              <button
                                onClick={() =>
                                  handleConfirmBooking(booking._id)
                                }
                                className="w-full px-2 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="w-full px-2 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {(booking.status === "CONFIRMED" ||
                            booking.status === "CANCELLED") && (
                            <div className="text-xs text-gray-500 italic">
                              No actions available
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        No bookings found
                      </h3>
                      <p className="text-xs text-gray-600">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        dateFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "No bookings have been made yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredBookings.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredBookings.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredBookings.length}</span>{" "}
                bookings
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded text-xs font-medium ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookingsPage;
