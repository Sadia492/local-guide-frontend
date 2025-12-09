"use client"; // ADD THIS!

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

// Client-side ONLY function - works in browser with cookies
export const getUsers = cache(async (): Promise<UserData[]> => {
  try {
    console.log("🔄 Client-side getUsers called");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/all`,
      {
        credentials: "include", // Browser sends cookies automatically
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      console.error("❌ Failed to fetch users:", response.status);
      return [];
    }

    const data = await response.json();
    console.log("✅ Users fetched:", data.data?.length || 0);
    return data.data || [];
  } catch (error) {
    console.error("💥 Error in getUsers:", error);
    return [];
  }
});

// Keep other functions as they are (they already use credentials: "include")
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
