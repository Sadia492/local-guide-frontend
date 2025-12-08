import { Listing } from "@/types/explore";

export const getGuideName = (
  guide: string | { _id: string; name: string; profilePic?: string }
): string => {
  if (typeof guide === "object") {
    return guide.name;
  }
  return "Unknown Guide";
};

export const getGuideId = (
  guide: string | { _id: string; name: string; profilePic?: string }
): string => {
  if (typeof guide === "object") {
    return guide._id;
  }
  return guide;
};

export const filterListings = (
  listings: Listing[],
  filters: {
    searchTerm: string;
    statusFilter: string;
    categoryFilter: string;
    guideFilter: string;
  }
): Listing[] => {
  const { searchTerm, statusFilter, categoryFilter, guideFilter } = filters;
  const searchTermLower = searchTerm.toLowerCase();

  return listings.filter((listing) => {
    const matchesSearch =
      searchTerm === "" ||
      listing.title.toLowerCase().includes(searchTermLower) ||
      listing.city.toLowerCase().includes(searchTermLower) ||
      listing.category.toLowerCase().includes(searchTermLower) ||
      (typeof listing.guide === "object" &&
        listing.guide.name.toLowerCase().includes(searchTermLower));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && listing.isActive) ||
      (statusFilter === "inactive" && !listing.isActive);

    const matchesCategory =
      categoryFilter === "all" || listing.category === categoryFilter;

    const matchesGuide =
      guideFilter === "all" || getGuideId(listing.guide) === guideFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesGuide;
  });
};

export const getUniqueCategories = (listings: Listing[]): string[] => {
  return Array.from(new Set(listings.map((listing) => listing.category)));
};

export const getUniqueGuides = (
  listings: Listing[]
): Array<{ id: string; name: string }> => {
  const guideMap = new Map<string, { id: string; name: string }>();

  listings.forEach((listing) => {
    const guideId = getGuideId(listing.guide);
    const guideName = getGuideName(listing.guide);

    if (!guideMap.has(guideId)) {
      guideMap.set(guideId, { id: guideId, name: guideName });
    }
  });

  return Array.from(guideMap.values());
};
