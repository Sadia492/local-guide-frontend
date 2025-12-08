export interface Guide {
  _id: string;
  name: string;
  profilePic?: string;
  bio?: string;
  languages?: string[];
  rating?: number;
  totalTours?: number;
  yearsExperience?: number;
}

export interface Listing {
  _id: string;
  title: string;
  guide: Guide | string; // Can be object or just ID string
  city: string;
  fee: number;
  rating?: number;
  totalReviews?: number;
  duration: number;
  maxGroupSize: number;
  images: string[];
  category: string;
  isActive: boolean;
  description: string;
  meetingPoint: string;
  language: string;
  itinerary: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  searchTerm: string;
  statusFilter: "all" | "active" | "inactive";
  categoryFilter: string;
  guideFilter: string;
}

export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
}
