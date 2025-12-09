// app/(dashboard)/dashboard/guide/my-listings/MyListingsWrapper.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MyListingsClient from "@/components/modules/Guide/Listing/MyListingsClient";
import {
  filterListings,
  getListingStats,
  getUniqueCategories,
} from "@/lib/listingUtils2";
import { Listing } from "@/services/listing/guideListing.service";

// Helper function for safe parameter extraction
function safeParam(
  value: string | string[] | null | undefined,
  fallback: string
): string {
  if (Array.isArray(value)) return value[0] || fallback;
  if (typeof value === "string") return value;
  return fallback;
}

export default function MyListingsWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get filters from URL
  const searchTerm = safeParam(searchParams.get("search"), "");
  const statusFilter = safeParam(searchParams.get("status"), "all");
  const categoryFilter = safeParam(searchParams.get("category"), "all");
  const currentPage = Math.max(
    1,
    parseInt(safeParam(searchParams.get("page"), "1"))
  );

  // Fetch listings on component mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listing/my-listings`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setListings(data.data);
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load your listings. Please try again.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate stats and filtered listings
  const stats = getListingStats(listings);
  const categories = getUniqueCategories(listings);
  const filteredListings = filterListings(listings, {
    searchTerm,
    statusFilter,
    categoryFilter,
  });

  // Handle refresh
  const handleRefresh = () => {
    fetchListings();
    router.refresh();
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Tour Listings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all your tour listings and bookings
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your listings...</p>
          </div>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Tour Listings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all your tour listings and bookings
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow border p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to Load Listings
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchListings}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <MyListingsClient
      listings={listings}
      filteredListings={filteredListings}
      stats={stats}
      categories={categories}
      initialSearchTerm={searchTerm}
      initialStatusFilter={statusFilter}
      initialCategoryFilter={categoryFilter}
      initialCurrentPage={currentPage}
    />
  );
}
