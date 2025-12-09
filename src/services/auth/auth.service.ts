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

// services/auth/auth.service.ts
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get cookies from the request
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      console.log("No accessToken cookie found");
      return null;
    }

    console.log("Access token found, calling API...");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Use Bearer token
        },
        cache: "no-store",
      }
    );

    console.log("API response status:", response.status);

    if (!response.ok) {
      console.log("API response not OK:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log("API response data:", data);

    // Return user based on your API's response structure
    if (data.success && data.data) {
      return data.data;
    } else if (data.user) {
      return data.user;
    } else if (data._id) {
      return data;
    }

    return null;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}

// export async function getCurrentUser(): Promise<User | null> {
//   try {
//     // Get all cookies from the request
//     const cookieStore = await cookies();
//     const allCookies = cookieStore.getAll();

//     // Create the Cookie header string
//     const cookieHeader = allCookies
//       .map((cookie) => `${cookie.name}=${cookie.value}`)
//       .join("; ");

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: cookieHeader, // Pass ALL cookies
//         },
//         cache: "no-store",
//       }
//     );

//     if (response.ok) {
//       const data = await response.json();

//       // Handle different response structures
//       if (data.data) {
//         return data.data;
//       } else if (data.user) {
//         return data.user;
//       } else if (data._id) {
//         return data; // The response IS the user object
//       }

//       return null;
//     }

//     // Try alternative: Maybe it needs Authorization header instead
//     if (response.status === 401) {
//       // Check if there's a token in localStorage (if this were client-side)
//       // Since we're server-side, we can only use cookies

//       return null;
//     }

//     return null;
//   } catch (error) {
//     return null;
//   }
// }
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
