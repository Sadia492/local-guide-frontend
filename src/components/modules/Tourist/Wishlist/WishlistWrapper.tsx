// app/(dashboard)/dashboard/tourist/wishlist/WishlistWrapper.tsx
"use client";

import { useState, useEffect } from "react";
import WishlistClient from "@/components/modules/Tourist/Wishlist/WishlistClient";
import {
  getWishlist,
  getWishlistStats,
} from "@/services/wishlist/wishlist2.service";

export default function WishlistWrapper() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = getWishlistStats(items);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const wishlistItems = await getWishlist();
      setItems(wishlistItems);
      setError(null);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError("Failed to load wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchWishlist();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Wishlist
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchWishlist}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <WishlistClient initialItems={items} initialStats={stats} />;
}
