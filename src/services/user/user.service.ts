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

// Helper function to get API URL with better error handling
function getApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    throw new Error("API URL is not configured");
  }
  return apiUrl;
}

export async function getUserProfile(
  userId: string,
  requestCookies?: string
): Promise<ProfileData> {
  try {
    const apiUrl = getApiUrl();
    console.log(
      `Fetching user profile from: ${apiUrl}/api/user/profile-details/${userId}`
    );

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // If we have cookies from the request, pass them
    if (requestCookies) {
      headers.Cookie = requestCookies;
      console.log("Passing cookies to API request");
    }

    const response = await fetch(
      `${apiUrl}/api/user/profile-details/${userId}`,
      {
        // IMPORTANT: Don't use credentials: 'include' when passing cookies manually
        // credentials: 'include',
        headers,
        cache: "no-store",
      }
    );

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      console.error(
        `Failed to fetch user profile. Status: ${response.status}, StatusText: ${response.statusText}`
      );

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
    console.log("Profile data received successfully");

    if (!data.data) {
      throw new Error("Invalid response format from API");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);

    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching user profile");
  }
}
