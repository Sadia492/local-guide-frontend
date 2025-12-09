import { WishlistItem } from "@/services/wishlist/wishlist2.service";

export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid date";
  }
};

export const filterWishlist = (
  items: WishlistItem[],
  filters: {
    searchTerm: string;
    sortBy: string;
  }
) => {
  const { searchTerm, sortBy } = filters;

  let filtered = items.filter((item) => {
    return (
      searchTerm === "" ||
      item.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.listing.guide.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case "price-low":
        return a.listing.fee - b.listing.fee;
      case "price-high":
        return b.listing.fee - a.listing.fee;
      case "duration":
        return b.listing.duration - a.listing.duration;
      case "title-asc":
        return a.listing.title.localeCompare(b.listing.title);
      case "title-desc":
        return b.listing.title.localeCompare(a.listing.title);
      default:
        return 0;
    }
  });

  return filtered;
};

export const calculateStats = (
  items: WishlistItem[],
  selectedIds: string[]
) => {
  const total = items.length;

  const selected = items.filter((item) =>
    selectedIds.includes(item.listing._id)
  );
  const selectedCount = selected.length;

  const totalValue = items.reduce((sum, item) => sum + item.listing.fee, 0);
  const selectedValue = selected.reduce(
    (sum, item) => sum + item.listing.fee,
    0
  );

  const cities = new Set(items.map((item) => item.listing.city));
  const uniqueCities = cities.size;

  const averagePrice = total > 0 ? totalValue / total : 0;
  const averageDuration =
    total > 0
      ? items.reduce((sum, item) => sum + item.listing.duration, 0) / total
      : 0;

  return {
    total,
    selectedCount,
    totalValue,
    selectedValue,
    uniqueCities,
    averagePrice,
    averageDuration,
  };
};

export const getGuideInitials = (name: string): string => {
  return name?.charAt(0)?.toUpperCase() || "G";
};

export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};
