import { Booking } from "@/services/booking/upcomingBooking.service";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getDaysUntil = (dateString: string) => {
  const bookingDate = new Date(dateString);
  const today = new Date();
  const diffTime = bookingDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

export const filterBookings = (
  bookings: Booking[],
  filters: {
    searchTerm: string;
    statusFilter: string;
    typeFilter: string;
    userId?: string;
  }
) => {
  const { searchTerm, statusFilter, typeFilter, userId } = filters;

  return bookings.filter((booking) => {
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
        booking.status !== "REJECTED";
    } else if (statusFilter === "pending") {
      matchesStatus = booking.status === "PENDING";
    } else if (statusFilter === "past") {
      matchesStatus = isPast || booking.status === "COMPLETED";
    } else if (statusFilter === "cancelled") {
      matchesStatus =
        booking.status === "CANCELLED" || booking.status === "REJECTED";
    } else {
      matchesStatus = true;
    }

    // Type filter (for guide vs tourist)
    let matchesType = true;
    if (typeFilter === "asTourist" && userId) {
      matchesType = booking.user._id === userId;
    } else if (typeFilter === "asGuide" && userId) {
      matchesType = booking.listing.guide?._id === userId;
    }

    // Search filter
    const matchesSearch =
      !searchTerm ||
      booking.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });
};

export const sortBookingsByDate = (bookings: Booking[]) => {
  return [...bookings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const getBookingStats = (bookings: Booking[]) => {
  const upcomingCount = bookings.filter((b) => {
    const date = new Date(b.date);
    const today = new Date();
    return date >= today && b.status === "CONFIRMED";
  }).length;

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const completedCount = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;
  const totalSpent = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return {
    upcomingCount,
    pendingCount,
    completedCount,
    totalSpent,
  };
};
