import { getMyListings } from "@/services/listing/guideListing.service";
import { cookies } from "next/headers";
import { filterListings, getListingStats } from "@/lib/listingUtils2";
import { getUniqueCategories } from "@/lib/listingUtils";
import MyListingsClient from "@/components/modules/Guide/Listing/MyListingsClient";

function safeParam(value: any, fallback: string) {
  if (Array.isArray(value)) return value[0] || fallback;
  if (typeof value === "string") return value;
  return fallback;
}

export default async function MyListingsPage({ searchParams }: any) {
  // searchParams is a Promise → unwrap it
  const params = await searchParams;

  // Get cookies from the server request
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  // extract safely
  const searchTerm = safeParam(params?.search, "");
  const statusFilter = safeParam(params?.status, "all");
  const categoryFilter = safeParam(params?.category, "all");
  const pageParam = safeParam(params?.page, "1");

  const currentPage = Math.max(1, parseInt(pageParam) || 1);

  // Pass cookies to the service
  const listings = (await getMyListings(cookieHeader)) as any[];

  // Apply filters on server
  const filteredListings = filterListings(listings, {
    searchTerm,
    statusFilter,
    categoryFilter,
  });

  // Get stats
  const stats = getListingStats(listings);
  const categories = getUniqueCategories(listings);

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
