export const formatBookingDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatBookingTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCreatedDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const filterBookings = (
  bookings: any[],
  filters: { search: string; status: string; dateFilter: string }
) => {
  return bookings.filter((booking) => {
    const matchesSearch =
      filters.search === "" ||
      (booking.listing?.title?.toLowerCase() || "").includes(
        filters.search.toLowerCase()
      ) ||
      (booking.listing?.city?.toLowerCase() || "").includes(
        filters.search.toLowerCase()
      );

    const matchesStatus =
      filters.status === "all" || booking.status === filters.status;

    const matchesDate = () => {
      if (filters.dateFilter === "all") return true;
      const bookingDate = new Date(booking.date);
      const today = new Date();

      if (filters.dateFilter === "today") {
        return bookingDate.toDateString() === today.toDateString();
      }
      if (filters.dateFilter === "upcoming") {
        return bookingDate >= today;
      }
      if (filters.dateFilter === "past") {
        return bookingDate < today;
      }
      return true;
    };

    return matchesSearch && matchesStatus && matchesDate();
  });
};

export const paginateBookings = (
  bookings: any[],
  currentPage: number,
  itemsPerPage: number
) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return bookings.slice(startIndex, startIndex + itemsPerPage);
};
