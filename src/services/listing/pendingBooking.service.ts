// services/listing/pendingBooking.service.ts

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
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

// CLIENT-SIDE fetch function
export const fetchPendingBookingsClient = async (): Promise<Booking[]> => {
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
      console.error("Failed to fetch pending bookings:", response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    return [];
  }
};

// Service functions for mutations
export const pendingBookingService = {
  // Approve booking
  async approveBooking(
    id: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "CONFIRMED" }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to approve booking");
      }

      return { success: true };
    } catch (error) {
      console.error("Error approving booking:", error);
      throw error;
    }
  },

  // Reject booking - send "CANCELLED" status
  async rejectBooking(
    id: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "CANCELLED" }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to reject booking");
      }

      return { success: true };
    } catch (error) {
      console.error("Error rejecting booking:", error);
      throw error;
    }
  },

  // Refresh pending bookings data
  async refreshPendingBookings(): Promise<Booking[]> {
    return fetchPendingBookingsClient();
  },
};
