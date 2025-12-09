// services/user/user.service.ts

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
  updatedAt: string;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  city: string;
  fee: number;
  duration: number;
  meetingPoint: string;
  maxGroupSize: number;
  images: string[];
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
  listingTitle?: string;
}

export interface Stats {
  totalReviews: number;
  averageRating: number;
  totalBookings: number;
  completedBookings: number;
  activeTours: number;
}

export interface ProfileData {
  user: UserProfile;
  listings: Listing[];
  reviews: Review[];
  stats: Stats;
}

// CLIENT-SIDE function
export const fetchUserProfileClient = async (
  userId: string
): Promise<ProfileData> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API URL is not configured");
    }

    const response = await fetch(
      `${apiUrl}/api/user/profile-details/${userId}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      }

      if (response.status === 401) {
        // Try to get more specific error from response
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Authentication required to view profile"
          );
        } catch (e) {
          throw new Error("Authentication required to view this profile");
        }
      }

      let errorMessage = "Failed to fetch user profile";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore if response is not JSON
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.data) {
      throw new Error("Invalid response format from API");
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching user profile");
  }
};

// Keep the server function for backward compatibility (with warning)
export async function getUserProfile(
  userId: string,
  requestCookies?: string
): Promise<ProfileData> {
  console.warn(
    "getUserProfile with cookies is deprecated. Use fetchUserProfileClient instead."
  );

  // If cookies are provided, we can't use them reliably in production
  // Just call the client function which uses credentials: "include"
  return fetchUserProfileClient(userId);
}
