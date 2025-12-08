"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/services/wishlist/wishlist.service";

export const useWishlist = (listingId?: string) => {
  const [wishlistData, setWishlistData] = useState<any[]>([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const router = useRouter();

  const checkWishlistStatus = async () => {
    if (!listingId) return;

    try {
      const data = await getWishlist();
      setWishlistData(data);

      const inWishlist = data.some(
        (item: any) => item.listing?._id === listingId
      );
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error("Error checking wishlist:", error);
      setIsInWishlist(false);
      setWishlistData([]);
    }
  };

  const toggleWishlist = async () => {
    if (wishlistLoading || !listingId) return;

    if (isInWishlist) {
      await removeFromWishlistHandler();
    } else {
      await addToWishlistHandler();
    }
  };

  const addToWishlistHandler = async () => {
    if (!listingId) return;

    try {
      setWishlistLoading(true);
      const result = await addToWishlist(listingId);

      if (result.success) {
        setIsInWishlist(true);
        toast.success("Added to wishlist", {
          description: "Tour saved to your wishlist",
        });
        await checkWishlistStatus();
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const removeFromWishlistHandler = async () => {
    if (!listingId) return;

    try {
      setWishlistLoading(true);
      const result = await removeFromWishlist(listingId);

      if (result.success) {
        setIsInWishlist(false);
        toast.success("Removed from wishlist", {
          description: "Tour removed from your wishlist",
        });
        await checkWishlistStatus();
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    if (listingId) {
      checkWishlistStatus();
    }
  }, [listingId]);

  return {
    wishlistData,
    isInWishlist,
    wishlistLoading,
    toggleWishlist,
    checkWishlistStatus,
  };
};
