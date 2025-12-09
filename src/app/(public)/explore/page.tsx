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
  const category = params.category || null;
  const minPrice = params.minPrice ? parseInt(params.minPrice) : 0;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : 1000;
  const maxDuration = params.maxDuration ? parseInt(params.maxDuration) : null;

  const filters: FilterState = {
    search,
    selectedCategory: category,
    priceRange: [minPrice, maxPrice],
    duration: maxDuration,
  };

  // Fetch data in parallel - using server-side functions
  const [listings, currentUser] = await Promise.all([
    getListings(),
    getCurrentUser(), // Server-side auth check
  ]);

  const isAuth = !!currentUser;

  // Filter listings based on search params
  const filteredListings = listings.filter((tour) => {
    const matchesSearch =
      !search ||
      search === "" ||
      tour.title.toLowerCase().includes(search.toLowerCase()) ||
      tour.city.toLowerCase().includes(search.toLowerCase()) ||
      (tour.description as string)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      tour.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !category || tour.category === category;

    const matchesPrice = tour.fee >= minPrice && tour.fee <= maxPrice;

    const matchesDuration = !maxDuration || tour.duration <= maxDuration;

    return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
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
              <EmptyState
                hasSearch={!!search || !!category}
                onReset={() => {
                  /* Reset handled by client component */
                }}
              />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
