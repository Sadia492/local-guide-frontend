// services/booking/myTrips.service.ts
export interface Guide {
  _id: string;
  name: string;
  email?: string;
  profilePicture?: string;
}

export interface Listing {
  _id: string;
  guide: string | Guide;
  title: string;
  city: string;
  fee: number;
  duration: number;
  meetingPoint: string;
  images: string[];
}

export interface BookingReview {
  _id: string;
  rating: number;
  comment: string;
}

export interface Booking {
  _id: string;
  listing: Listing;
  date: string;
  groupSize: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  hasReview?: boolean;
  review?: BookingReview;
}

// CLIENT-SIDE function (no cookies needed)
export const getMyTrips = async (): Promise<Booking[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/my-bookings`,
      {
        credentials: "include", // This will automatically send cookies
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch trips:", response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching trips:", error);
    return [];
  }
};

// Get trip stats
export const getTripStats = (trips: Booking[]) => {
  const totalTrips = trips.length;
  const totalSpent = trips.reduce((sum, trip) => sum + trip.totalPrice, 0);
  const upcomingTrips = trips.filter((trip) =>
    ["PENDING", "CONFIRMED"].includes(trip.status)
  ).length;
  const completedTrips = trips.filter(
    (trip) => trip.status === "COMPLETED"
  ).length;
  const cancelledTrips = trips.filter(
    (trip) => trip.status === "CANCELLED"
  ).length;

  return {
    totalTrips,
    totalSpent,
    upcomingTrips,
    completedTrips,
    cancelledTrips,
  };
};

// Service functions for mutations
export const tripService = {
  // Create payment session
  async createPayment(bookingId: string): Promise<{ paymentUrl: string }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}/create-payment`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create payment session");
    }

    const data = await response.json();
    return data.data;
  },

  // Cancel booking
  async cancelBooking(bookingId: string): Promise<{ success: boolean }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}/cancel`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to cancel booking");
    }

    return { success: true };
  },

  // Request reschedule
  async rescheduleBooking(
    bookingId: string,
    newDate: string,
    newTime: string
  ): Promise<{ success: boolean }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}/reschedule`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ date: newDate, time: newTime }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to reschedule booking");
    }

    return { success: true };
  },
};
