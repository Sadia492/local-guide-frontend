import { cache } from "react";

export interface Listing {
  _id: string;
  title: string;
  description: string;
  city: string;
  category: string;
  fee: number;
  duration: number;
  maxGroupSize: number;
  meetingPoint: string;
  language: string;
  itinerary: string;
  images: string[];
  isActive: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

// Cache for guide's listings - ACCEPT COOKIES PARAMETER
export const getMyListings = cache(
  async (cookieHeader?: string): Promise<Listing[]> => {
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      // ADD COOKIES TO HEADERS IF PROVIDED
      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listing/my-listings`,
        {
          headers,
          // Use 'omit' when manually setting cookies
          credentials: cookieHeader ? "omit" : "include",
          next: {
            tags: ["my-listings"],
          },
        }
      );

      if (!response.ok) {
        console.warn(`Listings fetch returned: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
  }
);

// Service functions for mutations
export const listingService = {
  // Delete listing
  async deleteListing(id: string): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listing/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to delete listing");
    }
  },

  // Update listing status
  async updateListingStatus(id: string, isActive: boolean): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listing/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isActive }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update listing status");
    }
  },

  // Revalidate cache
  async revalidateCache(): Promise<void> {
    try {
      await fetch("/api/revalidate?tag=my-listings", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to revalidate cache:", error);
    }
  },
};
