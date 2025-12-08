export interface UserProfile {
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

export interface Listing {
  _id: string;
  title: string;
  city: string;
  fee: number;
  duration: number;
  images: string[];
  description: string;
  meetingPoint: string;
  maxGroupSize: number;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
    profilePicture?: string;
  };
  guide?: {
    name: string;
    profilePicture?: string;
  };
  listingTitle?: string;
}

export interface ProfileData {
  user: UserProfile;
  listings?: Listing[];
  reviews: Review[];
  stats?: {
    toursGiven?: number;
    averageRating?: number;
    totalReviews?: number;
    totalBookings?: number;
    completedTours?: number;
  };
}
