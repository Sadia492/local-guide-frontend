"use server";

import { wishlistService } from "@/services/wishlist/wishlist2.service";
import { revalidateTag } from "next/cache";

export async function removeItemAction(
  listingId: string
): Promise<{ success: boolean }> {
  try {
    const result = await wishlistService.removeItem(listingId);
    revalidateTag("wishlist", "default");
    return result;
  } catch (error) {
    throw error;
  }
}

export async function clearAllAction(): Promise<{ success: boolean }> {
  try {
    const result = await wishlistService.clearAll();
    revalidateTag("wishlist", "default");
    return result;
  } catch (error) {
    throw error;
  }
}
