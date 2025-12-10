"use client";

import { wishlistService } from "@/services/wishlist/wishlist2.service";

export const removeItemAction = async (listingId: string) => {
  return await wishlistService.removeItem(listingId);
};

export const clearAllAction = async () => {
  return await wishlistService.clearAll();
};
