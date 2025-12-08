import React from "react";
import { getListings } from "@/services/listing/listing.service";
import {
  filterListings,
  getUniqueCategories,
  getUniqueGuides,
} from "@/lib/listingUtils";
import ListingManagementClient from "@/components/modules/Admin/Listing/ListingManagementClient";

function safeParam(value: any, fallback: string) {
  if (Array.isArray(value)) return value[0] || fallback;
  if (typeof value === "string") return value;
  return fallback;
}

export default async function ListingManagementPage({ searchParams }: any) {
  // searchParams is a Promise → unwrap it
  const params = await searchParams;

  // DEBUG: Log search params
  console.log("🔍 Server Component - Search Params:", params);

  // extract safely
  const searchTerm = safeParam(params?.search, "");
  const statusFilter = safeParam(params?.status, "all");
  const categoryFilter = safeParam(params?.category, "all");
  const guideFilter = safeParam(params?.guide, "all");
  const pageParam = safeParam(params?.page, "1");

  const currentPage = Math.max(1, parseInt(pageParam) || 1);

  const listings = await getListings();

  // DEBUG: Log listings count
  console.log("📊 Total listings fetched:", listings.length);

  const filteredListings = filterListings(listings as any[], {
    searchTerm,
    statusFilter,
    categoryFilter,
    guideFilter,
  });

  // DEBUG: Log filter results
  console.log("🎯 Filtered listings count:", filteredListings.length);
  console.log("🔧 Filters applied:", {
    searchTerm,
    statusFilter,
    categoryFilter,
    guideFilter,
    currentPage,
  });

  const categories = getUniqueCategories(listings as any[]);
  const guides = getUniqueGuides(listings as any[]);

  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.isActive).length;
  const inactiveListings = listings.filter((l) => !l.isActive).length;
  const totalGuides = guides.length;
  const totalRevenuePotential = listings.reduce((sum, l) => sum + l.fee, 0);
  const averagePrice =
    listings.length > 0
      ? Math.round(totalRevenuePotential / listings.length)
      : 0;
  const totalImages = listings.reduce((sum, l) => sum + l.images.length, 0);

  return (
    <ListingManagementClient
      listings={listings as any[]}
      filteredListings={filteredListings as any[]}
      categories={categories}
      guides={guides}
      totalListings={totalListings}
      activeListings={activeListings}
      inactiveListings={inactiveListings}
      totalGuides={totalGuides}
      totalRevenuePotential={totalRevenuePotential}
      averagePrice={averagePrice}
      totalImages={totalImages}
      initialSearchTerm={searchTerm}
      initialStatusFilter={statusFilter}
      initialCategoryFilter={categoryFilter}
      initialGuideFilter={guideFilter}
      initialCurrentPage={currentPage}
    />
  );
}
