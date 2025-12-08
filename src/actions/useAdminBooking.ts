"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  fetchAllBookings,
  updateBookingStatus,
} from "@/services/booking/booking-admin.service";
import { AdminBooking } from "@/types/booking-admin";
import { filterBookings, paginateBookings } from "@/lib/booking.utils";

export const useAdminBookings = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateFilter: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = filterBookings(bookings, filters);
  const paginatedBookings = paginateBookings(
    filteredBookings,
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: AdminBooking["status"]
  ) => {
    try {
      await updateBookingStatus(bookingId, newStatus);

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
      throw error;
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    await handleStatusUpdate(bookingId, "CONFIRMED");
  };

  const handleCancelBooking = async (bookingId: string) => {
    await handleStatusUpdate(bookingId, "CANCELLED");
  };

  return {
    bookings,
    loading,
    paginatedBookings,
    filteredBookings,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    handleConfirmBooking,
    handleCancelBooking,
    refreshBookings: loadBookings,
  };
};
