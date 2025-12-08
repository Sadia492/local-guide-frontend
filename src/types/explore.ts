export interface Listing {
  _id: string;
  title: string;
  description: string;
  itinerary?: string;
  city: string;
  category: string;
  fee: number;
  duration: number;
  meetingPoint: string;
  maxGroupSize: number;
  images: string[];
  language?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  guide: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: "TOURIST" | "GUIDE" | "ADMIN";
  bio?: string;
  location?: string;
  languages?: string[];
  expertise?: string[];
  dailyRate?: number;
  travelPreferences?: string[];
  isVerified?: boolean;
  isActive?: boolean;
  createdAt: string;
}

export interface FilterState {
  search: string;
  selectedCategory: string | null;
  priceRange: [number, number];
  duration: number | null;
}

export const categories = [
  "Adventure",
  "Food",
  "History",
  "Art",
  "Nightlife",
  "Shopping",
  "Nature",
  "Photography",
  "Family",
  "Luxury",
  "Cultural",
  "Sports",
] as const;
