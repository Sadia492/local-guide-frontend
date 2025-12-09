import { cache } from "react";

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

// Cache for tourist's bookings
export const getMyTrips = cache(
  async (cookieHeader?: string): Promise<Booking[]> => {
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/my-bookings`,
        {
          headers,
          credentials: cookieHeader ? "omit" : "include",
          next: {
            tags: ["my-trips"],
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching trips:", error);
      return [];
    }
  }
);

// Get guide details
export const getGuideDetails = async (
  guideId: string
): Promise<Guide | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile-details/${guideId}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data?.user || null;
  } catch (error) {
    console.error(`Error fetching guide ${guideId}:`, error);
    return null;
  }
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

  // Revalidate cache
  async revalidateCache(): Promise<void> {
    try {
      await fetch("/api/revalidate?tag=my-trips", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to revalidate cache:", error);
    }
  },
};
