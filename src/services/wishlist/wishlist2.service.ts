import { cache } from "react";

export interface Guide {
  _id: string;
  name: string;
  email?: string;
  profilePicture?: string;
}

export interface Listing {
  _id: string;
  title: string;
  city: string;
  fee: number;
  duration: number;
  meetingPoint: string;
  images: string[];
  guide: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
}

export interface WishlistItem {
  _id: string;
  user: string;
  listing: Listing;
  addedAt: string;
}

// Cache for wishlist items
export const getWishlistItems = cache(
  async (cookieHeader?: string): Promise<WishlistItem[]> => {
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
        {
          headers,
          credentials: cookieHeader ? "omit" : "include",
          next: {
            tags: ["wishlist"],
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return [];
    }
  }
);

// Get wishlist stats
export const getWishlistStats = (items: WishlistItem[]) => {
  const total = items.length;

  const totalValue = items.reduce((sum, item) => sum + item.listing.fee, 0);

  const cities = new Set(items.map((item) => item.listing.city));
  const uniqueCities = cities.size;

  const newestAdd = items.length > 0 ? new Date(items[0].addedAt) : null;

  const averagePrice = total > 0 ? totalValue / total : 0;

  return {
    total,
    totalValue,
    uniqueCities,
    newestAdd,
    averagePrice,
  };
};

// Service functions for mutations
export const wishlistService = {
  // Remove item from wishlist
  async removeItem(listingId: string): Promise<{ success: boolean }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${listingId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to remove item");
    }

    return { success: true };
  },

  // Clear entire wishlist
  async clearAll(): Promise<{ success: boolean }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to clear wishlist");
    }

    return { success: true };
  },

  // Revalidate cache
  async revalidateCache(): Promise<void> {
    try {
      await fetch("/api/revalidate?tag=wishlist", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to revalidate cache:", error);
    }
  },
};
