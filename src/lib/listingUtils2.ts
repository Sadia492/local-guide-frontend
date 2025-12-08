export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const filterListings = (
  listings: any[],
  filters: {
    searchTerm: string;
    statusFilter: string;
    categoryFilter: string;
  }
) => {
  const { searchTerm, statusFilter, categoryFilter } = filters;

  return listings.filter((listing) => {
    const matchesSearch =
      !searchTerm ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && listing.isActive) ||
      (statusFilter === "inactive" && !listing.isActive);

    const matchesCategory =
      categoryFilter === "all" || listing.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });
};

export const getListingStats = (listings: any[]) => {
  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.isActive).length;
  const inactiveListings = totalListings - activeListings;
  const totalRevenue = listings.reduce((sum, l) => sum + l.fee, 0);

  return {
    totalListings,
    activeListings,
    inactiveListings,
    totalRevenue,
  };
};

export const getUniqueCategories = (listings: any[]) => {
  return Array.from(new Set(listings.map((listing) => listing.category)));
};
