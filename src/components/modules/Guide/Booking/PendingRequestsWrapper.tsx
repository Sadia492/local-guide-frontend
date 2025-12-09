// app/(dashboard)/dashboard/guide/bookings/pending/PendingRequestsWrapper.tsx
"use client";

import { useState, useEffect } from "react";
import PendingRequestsClient from "@/components/modules/Guide/Booking/PendingRequestsClient";
import { Booking } from "@/services/listing/pendingBooking.service";

export default function PendingRequestsWrapper() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/pending`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch pending bookings: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setBookings(data.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching pending bookings:", err);
      setError("Failed to load pending requests. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchBookings();
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="p-6">
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
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pending requests...</p>
          </div>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="p-6">
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
          </div>
        </div>
        <div className="bg-white rounded-xl shadow border p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to Load Pending Requests
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchBookings}
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <PendingRequestsClient initialBookings={bookings} />;
}
