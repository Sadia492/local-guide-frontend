import { ListingReview } from "@/types/review";

export const getListingReviews = async (
  listingId: string
): Promise<ListingReview[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/review/listing/${listingId}`,
      {
        credentials: "include",
        next: {
          tags: [`reviews-${listingId}`],
          revalidate: 3600,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};
