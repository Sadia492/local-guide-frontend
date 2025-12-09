import { cache } from "react";

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

// Cache for pending bookings
export const getPendingBookings = cache(
  async (cookieHeader?: string): Promise<Booking[]> => {
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/pending`,
        {
          headers,
          credentials: cookieHeader ? "omit" : "include",
          next: {
            tags: ["pending-bookings"],
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
      return [];
    }
  }
);

// Service functions for mutations
export const bookingService = {
  // Update booking status
  // Update booking status - ACCEPT COOKIES PARAMETER
  async updateBookingStatus(
    id: string,
    status: "CONFIRMED" | "CANCELLED",
    cookies?: string // Add cookies parameter
  ): Promise<void> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // ADD COOKIES TO HEADERS IF PROVIDED
    if (cookies) {
      headers["Cookie"] = cookies;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${id}/status`,
      {
        method: "PATCH",
        headers,
        // Use 'omit' when manually setting cookies
        credentials: cookies ? "omit" : "include",
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update booking status");
    }
  },

  // Revalidate cache
  async revalidateCache(): Promise<void> {
    try {
      await fetch("/api/revalidate?tag=pending-bookings", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to revalidate cache:", error);
    }
  },
};
