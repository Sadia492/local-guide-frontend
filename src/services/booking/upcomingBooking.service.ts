export interface BookingUser {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface BookingGuide {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface BookingListing {
  _id: string;
  title: string;
  city: string;
  fee: number;
  duration: number;
  meetingPoint: string;
  images: string[];
  guide?: BookingGuide;
}

export interface Booking {
  _id: string;
  listing: BookingListing;
  user: BookingUser;
  date: string;
  groupSize: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

// CLIENT-SIDE fetch function
export const fetchUpcomingBookingsClient = async (): Promise<Booking[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/upcoming`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch bookings:", response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

// Service functions for mutations
export const bookingService = {
  // Update booking status
  async updateBookingStatus(
    id: string,
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED"
  ): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update booking status");
    }
  },

  // Cancel booking
  async cancelBooking(id: string): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${id}/cancel`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to cancel booking");
    }
  },

  // Confirm booking
  async confirmBooking(id: string): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${id}/confirm`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to confirm booking");
    }
  },

  // Complete booking
  async completeBooking(id: string): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${id}/complete`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to complete booking");
    }
  },

  // Refresh bookings data
  async refreshBookings(): Promise<Booking[]> {
    return fetchUpcomingBookingsClient();
  },
};
