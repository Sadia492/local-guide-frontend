"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  getUserBookings,
  createBooking,
  cancelBooking,
} from "@/services/booking/booking.service";
import { BookingData, UserBooking } from "@/types/booking";

export const useBooking = (listingId?: string) => {
  const [userBooking, setUserBooking] = useState<UserBooking | null>(null);
  const [checkingBooking, setCheckingBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const router = useRouter();

  const checkUserBooking = async () => {
    if (!listingId) return;

    try {
      setCheckingBooking(true);
      const bookings = await getUserBookings();

      const existingBooking = bookings.find(
        (booking) => booking.listing === listingId
      );

      setUserBooking(existingBooking || null);
    } catch (error) {
      console.error("Error checking user booking:", error);
      setUserBooking(null);
    } finally {
      setCheckingBooking(false);
    }
  };

  const handleBookNow = async (bookingData: BookingData) => {
    try {
      setBookingLoading(true);
      const result = await createBooking(bookingData);

      toast.success("Booking created successfully!", {
        description:
          "Your tour has been booked. Check your dashboard for details.",
        duration: 5000,
      });

      await checkUserBooking();

      setTimeout(() => {
        router.push("/dashboard/tourist/my-trips");
      }, 2000);

      return result;
    } catch (error) {
      toast.error("Failed to create booking", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
      throw error;
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);

      setUserBooking((prev) =>
        prev
          ? {
              ...prev,
              status: "CANCELLED",
            }
          : null
      );

      toast.success("Booking cancelled", {
        description: "Your booking request has been cancelled",
        action: {
          label: "View",
          onClick: () => router.push("/dashboard/tourist/my-trips"),
        },
      });

      setTimeout(() => {
        checkUserBooking();
      }, 500);
    } catch (error) {
      toast.error("Failed to cancel booking", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (listingId) {
      checkUserBooking();
    }
  }, [listingId]);

  const isBookingAllowed = () => {
    if (!userBooking) return true;
    return userBooking.status === "CANCELLED";
  };

  return {
    userBooking,
    checkingBooking,
    bookingLoading,
    handleBookNow,
    handleCancelBooking,
    checkUserBooking,
    isBookingAllowed,
  };
};
