// services/user/adminUser.service.ts
"use client";

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

// Client-side fetch
export const getUsers = async (): Promise<UserData[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/all`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch users:", response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Service functions - SIMPLIFIED (no events needed)
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

  // Remove revalidateCache since we don't need it
};
