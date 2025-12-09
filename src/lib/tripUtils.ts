import { Booking, Guide } from "@/services/booking/myTrips.service";
import { Listing } from "@/types/listing";

export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Invalid date";
  }
};

export const filterTrips = (
  trips: Booking[],
  filters: {
    searchTerm: string;
    statusFilter: string;
    guides?: Record<string, Guide>;
  }
) => {
  const { searchTerm, statusFilter, guides = {} } = filters;

  return trips.filter((booking) => {
    const today = new Date();
    const bookingDate = new Date(booking.date);
    const isUpcoming = bookingDate >= today;

    // Status filter
    let matchesStatus = true;
    if (statusFilter === "upcoming") {
      matchesStatus = isUpcoming && booking.status !== "CANCELLED";
    } else if (statusFilter === "pending") {
      matchesStatus = booking.status === "PENDING";
    } else if (statusFilter === "confirmed") {
      matchesStatus = booking.status === "CONFIRMED";
    } else if (statusFilter === "completed") {
      matchesStatus = booking.status === "COMPLETED";
    } else if (statusFilter === "cancelled") {
      matchesStatus = booking.status === "CANCELLED";
    }

    // Search filter
    const guideId =
      typeof booking.listing.guide === "string"
        ? booking.listing.guide
        : booking.listing.guide._id;

    const guideName = guides[guideId]?.name || "Local Guide";

    const matchesSearch =
      !searchTerm ||
      booking.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guideName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });
};

export const sortTripsByDate = (trips: Booking[]) => {
  return [...trips].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const getTripStats = (trips: Booking[]) => {
  const total = trips.length;

  const upcoming = trips.filter((b) => {
    const today = new Date();
    const bookingDate = new Date(b.date);
    return bookingDate >= today && b.status !== "CANCELLED";
  }).length;

  const pending = trips.filter((b) => b.status === "PENDING").length;
  const confirmed = trips.filter((b) => b.status === "CONFIRMED").length;
  const completed = trips.filter((b) => b.status === "COMPLETED").length;
  const cancelled = trips.filter((b) => b.status === "CANCELLED").length;

  const reviewed = trips.filter(
    (b) => b.status === "COMPLETED" && (b.hasReview || b.review?._id)
  ).length;

  const totalSpent = trips
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + (b.totalPrice || b.listing.fee * b.groupSize), 0);

  return {
    total,
    upcoming,
    pending,
    confirmed,
    completed,
    cancelled,
    reviewed,
    totalSpent,
  };
};

export const getGuideName = (
  listing: Listing,
  guides: Record<string, Guide>
): string => {
  if (typeof listing.guide === "object" && listing.guide !== null) {
    return listing.guide.name || "Local Guide";
  } else if (typeof listing.guide === "string") {
    const guide = guides[listing.guide];
    return guide?.name || "Local Guide";
  }
  return "Local Guide";
};

export const getGuideInitials = (name: string): string => {
  return name?.charAt(0) || "G";
};

export const hasReview = (booking: Booking): boolean => {
  return booking.hasReview || !!booking.review?._id;
};
