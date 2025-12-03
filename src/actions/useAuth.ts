"use client";

import { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  bio?: string;
  languages?: string[];
  expertise?: string[];
  travelPreferences?: string[];
  dailyRate?: number;
}

interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User; // User is directly under data
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in
  const checkAuth = async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      console.log("Checking auth...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
        {
          credentials: "include",
        }
      );

      console.log("Auth check response status:", response.status);

      if (response.ok) {
        const data: AuthResponse = await response.json();
        console.log("Auth response data:", data); // Debug

        if (data.success && data.data) {
          setUser(data.data); // Access data directly (not data.user.data)
          setIsAuthenticated(true);
          console.log("User set:", data.data);
          return data.data;
        } else {
          console.log("No user data in response");
          setUser(null);
          setIsAuthenticated(false);
          return null;
        }
      } else {
        console.log("Auth check failed with status:", response.status);
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  // In your useAuth hook
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Logging in with:", { email });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      console.log("Login response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Login result:", result);

        // IMPORTANT: Update user state
        if (result.data?.user) {
          setUser(result.data.user);
          setIsAuthenticated(true);
        }

        // Also call checkAuth to ensure consistency
        await checkAuth();
        return true;
      }

      console.log("Login failed");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      console.log("Logging out...");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      console.log("User state cleared, redirecting to home");
      // force refresh client state
      window.location.href = "/";
    }
  };

  // Check auth on mount
  useEffect(() => {
    console.log("useAuth useEffect running");
    checkAuth();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}
