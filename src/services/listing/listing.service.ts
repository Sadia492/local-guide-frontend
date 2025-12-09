import { cache } from "react";

export interface Listing {
  _id: string;
  title: string;
  guide: string | { _id: string; name: string; profilePic?: string };
  city: string;
  fee: number;
  rating?: number;
  duration: number;
  maxGroupSize: number;
  images: string[];
  category: string;
  isActive: boolean;
  description?: string;
  meetingPoint?: string;
  language: string;
  itinerary: string;
  createdAt: string;
  updatedAt: string;
}

// Cache for listings - automatically revalidates when tag is invalidated
export const getListings = cache(async (): Promise<Listing[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listing`,
      {
        credentials: "include",
        next: {
          tags: ["listings"], // Cache tag for revalidation
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
});

// Service functions for mutations
export const listingService = {
  // Update listing status
  async updateStatus(id: string, isActive: boolean): Promise<void> {
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

  // Revalidate cache
  async revalidateCache(): Promise<void> {
    try {
      await fetch("/api/revalidate?tag=listings", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to revalidate cache:", error);
    }
  },
};
