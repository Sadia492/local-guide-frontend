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

// CLIENT-SIDE fetch function
export const fetchMyListingsClient = async (): Promise<Listing[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listing/my-listings`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch listings:", response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
};

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

  // Refresh listings data
  async refreshListings(): Promise<Listing[]> {
    return fetchMyListingsClient();
  },
};

// Utility functions
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const filterListings = (
  listings: Listing[],
  filters: {
    searchTerm: string;
    statusFilter: string;
    categoryFilter: string;
  }
) => {
  const { searchTerm, statusFilter, categoryFilter } = filters;

  return listings.filter((listing) => {
    const matchesSearch =
      !searchTerm ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && listing.isActive) ||
      (statusFilter === "inactive" && !listing.isActive);

    const matchesCategory =
      categoryFilter === "all" || listing.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });
};

export const getListingStats = (listings: Listing[]) => {
  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.isActive).length;
  const inactiveListings = totalListings - activeListings;
  const totalRevenue = listings.reduce((sum, l) => sum + l.fee, 0);

  return {
    totalListings,
    activeListings,
    inactiveListings,
    totalRevenue,
  };
};

export const getUniqueCategories = (listings: Listing[]) => {
  return Array.from(new Set(listings.map((listing) => listing.category)));
};
