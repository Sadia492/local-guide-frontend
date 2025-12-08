import { cache } from "react";

export interface Listing {
  _id: string;
  title: string;
  description: string;
  itinerary?: string;
  city: string;
  category: string;
  fee: number;
  duration: number;
  meetingPoint: string;
  maxGroupSize: number;
  images: string[];
  language?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  guide: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
}

// Cache for 60 seconds for performance
export const getListings = cache(async (): Promise<Listing[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listing`,
      {
        credentials: "include",
        next: {
          tags: ["listings"],
          revalidate: 3600, // 1 hour - optional fallback
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      // Filter only active listings
      return data.data.filter((listing: Listing) => listing.isActive);
    }

    return [];
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
});

export async function getListingsByFilters(filters: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  maxDuration?: number;
}): Promise<Listing[]> {
  const allListings = await getListings();

  return allListings.filter((tour) => {
    const matchesSearch =
      !filters.search ||
      filters.search === "" ||
      tour.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      tour.city.toLowerCase().includes(filters.search.toLowerCase()) ||
      tour.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      tour.category.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory =
      !filters.category || tour.category === filters.category;

    const matchesPrice =
      (!filters.minPrice || tour.fee >= filters.minPrice) &&
      (!filters.maxPrice || tour.fee <= filters.maxPrice);

    const matchesDuration =
      !filters.maxDuration || tour.duration <= filters.maxDuration;

    return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
  });
}
