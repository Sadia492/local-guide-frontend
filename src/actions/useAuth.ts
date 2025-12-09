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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data: AuthResponse = await response.json();

        if (data.success && data.data) {
          setUser(data.data); // Access data directly (not data.user.data)
          setIsAuthenticated(true);

          return data.data;
        } else {
          setUser(null);
          setIsAuthenticated(false);
          return null;
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }
    } catch (error) {
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

      if (response.ok) {
        const result = await response.json();

        // IMPORTANT: Update user state
        if (result.data?.user) {
          setUser(result.data.user);
          setIsAuthenticated(true);
        }

        // Also call checkAuth to ensure consistency
        await checkAuth();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // force refresh client state
      window.location.href = "/";
    }
  };

  // Check auth on mount
  useEffect(() => {
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
