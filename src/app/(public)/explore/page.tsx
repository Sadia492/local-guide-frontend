import EmptyState from "@/components/modules/Explore/EmptyState";
import ExploreHero from "@/components/modules/Explore/ExploreHero";
import SearchFilters from "@/components/modules/Explore/SearchFilters";
import TourList from "@/components/modules/Explore/TourList";
import { getListings } from "@/services/listing/listing.service";
import { getCurrentUser } from "@/services/auth/auth.service"; // Import server-side auth
import { categories, FilterState } from "@/types/explore";
import { Suspense } from "react";

export const metadata = {
  title: "Explore Tours | Discover Amazing Local Experiences",
  description:
    "Connect with local guides for authentic adventures. Find tours by category, price, and duration.",
};

interface ExplorePageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    maxDuration?: string;
    sort?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  // Process search params
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "";
  const minPrice = params.minPrice ? parseInt(params.minPrice) : 0;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : 1000;
  const maxDuration = params.maxDuration ? parseInt(params.maxDuration) : 0;
  const sort = params.sort || "relevance";

  const filters: FilterState = {
    search,
    selectedCategory: category || null,
    priceRange: [minPrice, maxPrice],
    duration: maxDuration || null,
  };

  // Fetch data
  const [listings, currentUser] = await Promise.all([
    getListings(),
    getCurrentUser(),
  ]);

  const isAuth = !!currentUser;

  // Apply filters
  let filteredListings = listings.filter((tour) => {
    const matchesSearch =
      !search ||
      tour.title.toLowerCase().includes(search.toLowerCase()) ||
      tour.city.toLowerCase().includes(search.toLowerCase()) ||
      (tour.description || "").toLowerCase().includes(search.toLowerCase()) ||
      tour.category.toLowerCase().includes(search.toLowerCase());

    // Handle category filter - check if category is empty string or null
    const matchesCategory = !category || tour.category === category;

    const matchesPrice = tour.fee >= minPrice && tour.fee <= maxPrice;

    const matchesDuration = !maxDuration || tour.duration <= maxDuration;

    return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
  });

  // Apply sorting
  filteredListings.sort((a, b) => {
    switch (sort) {
      case "price_low":
        return a.fee - b.fee;
      case "price_high":
        return b.fee - a.fee;
      case "duration":
        return a.duration - b.duration;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default: // relevance or default
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ExploreHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <SearchFilters
          initialFilters={filters}
          categories={categories}
          maxPrice={Math.max(...listings.map((l) => l.fee), 1000)}
        />

        {/* Results Section */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredListings.length}{" "}
                {filteredListings.length === 1 ? "Tour" : "Tours"} Found
              </h2>
              {search && (
                <p className="text-gray-600 mt-1">Results for "{search}"</p>
              )}
              {category && (
                <p className="text-gray-600 text-sm mt-1">
                  Category: {category}
                </p>
              )}
            </div>
          </div>

          <Suspense fallback={<div>Loading tours...</div>}>
            {filteredListings.length > 0 ? (
              <TourList
                listings={filteredListings as any}
                isAuthenticated={isAuth}
                currentUser={currentUser}
              />
            ) : (
              <EmptyState hasSearch={!!search || !!category} />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
