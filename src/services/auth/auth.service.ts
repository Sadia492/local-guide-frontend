import { cookies } from "next/headers";

// Complete User interface matching what your API returns
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "TOURIST" | "GUIDE" | "ADMIN";
  profilePicture?: string;
  bio?: string;
  location?: string;
  languages?: string[];
  expertise?: string[];
  dailyRate?: number;
  travelPreferences?: string[];
  isVerified?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get all cookies from the request
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Create the Cookie header string
    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    console.log(
      "Sending cookies to /api/user/me:",
      cookieHeader.substring(0, 100) + "..."
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader, // Pass ALL cookies
        },
        cache: "no-store",
      }
    );

    console.log("Current user API response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Current user data received:", data);

      // Handle different response structures
      if (data.data) {
        return data.data;
      } else if (data.user) {
        return data.user;
      } else if (data._id) {
        return data; // The response IS the user object
      }

      return null;
    }

    // Try alternative: Maybe it needs Authorization header instead
    if (response.status === 401) {
      console.log("Trying alternative authentication method...");

      // Check if there's a token in localStorage (if this were client-side)
      // Since we're server-side, we can only use cookies

      return null;
    }

    console.log("Failed to get current user");
    return null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}
import "server-only";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "TOURIST" | "GUIDE" | "ADMIN";
  bio?: string;
  languages?: string[];
  expertise?: string[];
  dailyRate?: number;
  city?: string;
  travelPreferences?: string[];
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export async function registerUser(
  data: RegisterData,
  profilePhoto?: File
): Promise<RegisterResponse> {
  try {
    const formData = new FormData();

    // Add text data
    formData.append("data", JSON.stringify(data));

    // Add profile photo if exists
    if (profilePhoto) {
      formData.append("file", profilePhoto);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }

    return result;
  } catch (error) {
    console.error("Registration service error:", error);
    throw error;
  }
}

// Validate email availability
export async function checkEmailAvailability(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/auth/check-email?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      return true; // Assume available if error
    }

    const data = await response.json();
    return !data.exists;
  } catch (error) {
    console.error("Email check error:", error);
    return true;
  }
}
