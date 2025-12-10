"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, DollarSign, Shield, Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";
import { useAuth } from "@/actions/useAuth";

import { Listing } from "@/types/listing";
import Link from "next/link";
import { useBooking } from "@/actions/useBooking";
import { useWishlist } from "@/actions/useWishlist";
import BookingStatusBadge from "./BookingStatusBadge";

interface ListingBookingWidgetProps {
  listing: Listing;
  listingId: string;
}

export default function ListingBookingWidget({
  listing,
  listingId,
}: ListingBookingWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const { user } = useAuth();
  const router = useRouter();
  const {
    userBooking,
    bookingLoading,
    handleBookNow,
    handleCancelBooking,
    isBookingAllowed,
  } = useBooking(listingId);
  const { isInWishlist, wishlistLoading, toggleWishlist } =
    useWishlist(listingId);

  // Generate initial date (tomorrow)
  useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    setSelectedDate(tomorrow);
  });

  const totalPrice = listing.fee * guests;

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    if (guests < 1 || guests > listing.maxGroupSize) {
      toast.error(`Group size must be between 1 and ${listing.maxGroupSize}`);
      return;
    }

    try {
      await handleBookNow({
        listing: listingId,
        date: selectedDate.toISOString(),
        groupSize: guests,
      });
    } catch (error) {
      // Error already handled in hook
    }
  };

  return (
    <div className="">
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        {/* Price Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl font-bold">${listing.fee}</div>
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
              per person
            </div>
          </div>
          <p className="text-blue-100">All fees and taxes included</p>
        </div>

        <div className="p-6">
          {user && userBooking && userBooking.status !== "CANCELLED" ? (
            // User already has an active booking
            <div className="text-center py-4">
              <div className="mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  You have a booking for this tour
                </h3>
                <p className="text-gray-600 mb-4">
                  {userBooking.status === "PENDING"
                    ? "Awaiting guide's confirmation"
                    : "Your tour is confirmed"}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <BookingStatusBadge status={userBooking.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {formatDate(userBooking.date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium">{userBooking.groupSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold">${userBooking.totalPrice}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/dashboard/tourist/my-trips`}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors block text-center mb-3"
              >
                Manage Booking
              </Link>

              {userBooking.status === "PENDING" && (
                <button
                  onClick={() => handleCancelBooking(userBooking._id)}
                  className="w-full py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel Request
                </button>
              )}
            </div>
          ) : (
            // Booking form (for new booking or cancelled booking)
            <>
              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Select Date & Time
                </label>
                <div className="relative">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    minDate={new Date()}
                    maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={60}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholderText="Select date and time"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedDate
                    ? `Selected: ${formatDate(selectedDate)}`
                    : "Please select a date and time"}
                </p>
              </div>

              {/* Guests Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Number of Guests
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    disabled={guests <= 1}
                  >
                    <span className="text-xl">-</span>
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {guests}
                    </span>
                    <span className="text-gray-600 ml-2">
                      guest{guests !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setGuests(Math.min(listing.maxGroupSize, guests + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    disabled={guests >= listing.maxGroupSize}
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Maximum group size: {listing.maxGroupSize} guests
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="mb-6 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ${listing.fee} × {guests} guest
                      {guests !== 1 ? "s" : ""}
                    </span>
                    <span className="font-medium">${listing.fee * guests}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service fee</span>
                    <span className="text-gray-500">$0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taxes</span>
                    <span className="text-gray-500">Included</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${totalPrice}
                    </div>
                    <div className="text-sm text-gray-500">USD</div>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              {!user ? (
                <div className="space-y-3">
                  <Link
                    href={`/login?redirect=/tours/${listingId}`}
                    className="block w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-center"
                  >
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Login to Book
                  </Link>
                  <p className="text-center text-sm text-gray-600">
                    You need to be logged in to book this tour
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={
                    !selectedDate ||
                    !listing.isActive ||
                    guests < 1 ||
                    bookingLoading ||
                    !isBookingAllowed()
                  }
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : listing.isActive ? (
                    <>
                      <Calendar className="w-5 h-5 inline mr-2" />
                      {userBooking?.status === "CANCELLED"
                        ? "Book Again"
                        : "Book Now"}{" "}
                      - ${totalPrice}
                    </>
                  ) : (
                    "Currently Unavailable"
                  )}
                </button>
              )}

              {/* Secure Booking */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure booking · Free cancellation</span>
                </div>
              </div>

              {/* Booking Summary */}
              {selectedDate && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Booking Summary
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Tour:</span> {listing.title}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(selectedDate)}
                    </p>
                    <p>
                      <span className="font-medium">Guests:</span> {guests}{" "}
                      person{guests !== 1 ? "s" : ""}
                    </p>
                    <p>
                      <span className="font-medium">Total:</span> ${totalPrice}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
