"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  Users,
  DollarSign,
  MapPin,
  Eye,
  Mail,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { Booking } from "@/services/listing/pendingBooking.service";
import { pendingBookingService } from "@/services/listing/pendingBooking.service";
import { filterBookings, formatDate, getRequestAge } from "@/lib/bookingUtils";

interface PendingRequestsClientProps {
  initialBookings: Booking[];
}

export default function PendingRequestsClient({
  initialBookings,
}: PendingRequestsClientProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter bookings based on search
  const filteredBookings = useMemo(() => {
    return filterBookings(bookings, searchTerm);
  }, [bookings, searchTerm]);

  // Refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/pending`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch pending bookings: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data.data || []);

      toast.success("Pending requests refreshed successfully");
    } catch (err) {
      console.error("Error fetching pending bookings:", err);
      toast.error("Failed to load pending requests", {
        description:
          err instanceof Error ? err.message : "Please try again later",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle approve booking
  const handleApproveBooking = async (bookingId: string) => {
    const bookingToApprove = bookings.find((b) => b._id === bookingId);

    const result = await Swal.fire({
      title: "Approve Booking Request",
      text: "Are you sure you want to approve this booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await pendingBookingService.approveBooking(bookingId);

        // Remove from local state
        setBookings(bookings.filter((booking) => booking._id !== bookingId));

        toast.success("Booking approved", {
          description: "The booking request has been approved",
          action: {
            label: "View",
            onClick: () => {
              router.push("/dashboard/upcoming-bookings");
            },
          },
        });

        // Optionally refresh data
        await refreshData();
      } catch (error) {
        console.error("Error approving booking:", error);
        toast.error("Failed to approve booking");
      }
    }
  };

  // Handle reject booking
  const handleCancelBooking = async (bookingId: string) => {
    const result = await Swal.fire({
      title: "Reject Booking Request",
      text: "Are you sure you want to reject this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await pendingBookingService.rejectBooking(bookingId);

        // Remove from local state
        setBookings(bookings.filter((booking) => booking._id !== bookingId));

        toast.success("Booking rejected", {
          description: "The booking request has been rejected",
        });

        // Optionally refresh data
        await refreshData();
      } catch (error) {
        console.error("Error rejecting booking:", error);
        toast.error("Failed to reject booking");
      }
    }
  };

  // Update the refresh button state
  const isLoading = loading || isRefreshing;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pending Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Review and respond to booking requests from travelers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </button>
            <Link
              href="/dashboard/upcoming-bookings"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View All Bookings
            </Link>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 font-medium">
                Pending Requests Awaiting Your Response
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {bookings.length}
                  </p>
                  <p className="text-sm text-gray-600">Total requests</p>
                </div>
                <div className="h-10 w-px bg-yellow-300"></div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Respond within 24 hours
                  </p>
                  <p className="text-sm text-gray-600">
                    Quick responses increase booking confirmations
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search pending requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking: any) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl border border-yellow-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column - Booking Info */}
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
                      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span className="text-sm font-medium">PENDING</span>
                      </div>
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
                          <span className="text-sm font-normal text-gray-600 ml-2">
                            (${booking.listing.fee} × {booking.groupSize})
                          </span>
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
                          Requested
                        </div>
                        <div className="text-gray-900">
                          {getRequestAge(booking.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Meeting Point */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1">
                        Meeting Point
                      </div>
                      <div className="text-sm text-gray-700">
                        {booking.listing.meetingPoint}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Guest Info & Actions */}
                  <div className="lg:w-80 border-l lg:border-l-0 lg:border-t lg:pt-6 lg:pl-6">
                    {/* Guest Info */}
                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-900 mb-3">
                        Guest Information
                      </div>
                      <div className="flex items-center gap-3">
                        {booking.user.profilePicture ? (
                          <img
                            src={booking.user.profilePicture}
                            alt={booking.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {booking.user.name?.charAt(0) || "G"}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.user.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.user.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleApproveBooking(booking._id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve Request
                      </button>

                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject Request
                      </button>

                      <div className="flex gap-2 pt-2">
                        <Link
                          href={`/bookings/${booking._id}`}
                          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-center"
                        >
                          <Eye className="w-4 h-4 mx-auto mb-1" />
                          Details
                        </Link>
                        <button
                          onClick={() =>
                            window.open(`mailto:${booking.user.email}`)
                          }
                          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-center"
                        >
                          <Mail className="w-4 h-4 mx-auto mb-1" />
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border p-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Pending Requests
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "No pending requests match your search"
              : "You don't have any pending booking requests at the moment"}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Search
            </button>
          ) : (
            <Link
              href="/dashboard/upcoming-bookings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Bookings
            </Link>
          )}
        </div>
      )}

      {/* Quick Tips */}
      {bookings.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-medium text-blue-900 mb-2">💡 Quick Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Respond to booking requests within 24 hours for better guest
              experience
            </li>
            <li>
              • Review guest details and requested dates carefully before
              approving
            </li>
            <li>
              • Use the message feature to clarify any questions with guests
            </li>
            <li>• Double-check your availability before confirming bookings</li>
          </ul>
        </div>
      )}
    </div>
  );
}
