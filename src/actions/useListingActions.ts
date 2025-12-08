"use server";

import { revalidatePath, unstable_cache } from "next/cache";
import { listingService } from "@/services/listing/guideListing.service";

// Option 1: Use revalidatePath instead of revalidateTag
export async function deleteListingAction(id: string): Promise<void> {
  try {
    await listingService.deleteListing(id);
    // Revalidate the specific page
    revalidatePath("/dashboard/guide/my-listings");
  } catch (error) {
    console.error("Error in deleteListingAction:", error);
    throw error;
  }
}

export async function updateListingStatusAction(
  id: string,
  isActive: boolean
): Promise<void> {
  try {
    await listingService.updateListingStatus(id, isActive);
    // Revalidate the specific page
    revalidatePath("/dashboard/guide/my-listings");
  } catch (error) {
    console.error("Error in updateListingStatusAction:", error);
    throw error;
  }
}

// Option 2: Create a cache-aware version of your fetch
export const getCachedListings = unstable_cache(
  async (cookieHeader?: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listing/my-listings`,
      {
        headers: cookieHeader ? { Cookie: cookieHeader } : {},
        credentials: cookieHeader ? "omit" : "include",
      }
    );

    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
  },
  ["my-listings"],
  {
    tags: ["my-listings"],
    revalidate: 60, // Revalidate every 60 seconds
  }
);
