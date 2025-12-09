import { cache } from "react";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "TOURIST" | "GUIDE" | "ADMIN";
  profilePicture: string;
  languages: string[];
  expertise: string[];
  dailyRate?: number;
  travelPreferences?: string[];
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cache for users - ACCEPT COOKIES PARAMETER
export const getUsers = cache(
  async (cookieHeader?: string): Promise<UserData[]> => {
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      // ADD COOKIES TO HEADERS IF PROVIDED
      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/all`,
        {
          headers,
          // Use 'omit' when manually setting cookies
          credentials: cookieHeader ? "omit" : "include",
          next: {
            tags: ["users"],
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }
);

// Service functions for mutations - EXACT SAME PATTERN
export const userService = {
  // Update user status
  async updateStatus(id: string, isActive: boolean): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isActive }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update user status");
    }
  },

  // Update user role
  async updateRole(id: string, role: "TOURIST" | "GUIDE"): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update user role");
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to delete user");
    }
  },

  // Revalidate cache
  async revalidateCache(): Promise<void> {
    try {
      await fetch("/api/revalidate?tag=users", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to revalidate cache:", error);
    }
  },
};
