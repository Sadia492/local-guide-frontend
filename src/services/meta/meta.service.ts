// services/meta/meta.service.ts
import { cache } from "react";

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalBookings: number;
  pendingBookings: number;
  totalUsers: number;
  totalGuides: number;
  totalTourists: number;
  totalRevenue: number;
  averageRating: number;
  recentBookings: any[];
  recentReviews: any[];
}

export interface ChartData {
  barChartData: Array<{
    _id: { year: number; month: number };
    count: number;
    revenue: number;
    month: string;
  }>;
  pieChartData: {
    bookingStatus: Array<{ _id: string; count: number }>;
    listingCategories: Array<{ _id: string; count: number }>;
    userRoles: Array<{ _id: string; count: number }>;
  };
}

// Cache for admin dashboard stats
export const getAdminDashboardStats = cache(
  async (): Promise<DashboardStats> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/meta/dashboard/admin`,
        {
          credentials: "include",
          next: {
            tags: ["dashboard-stats"], // Cache tag for revalidation
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
      }

      const data = await response.json();
      return data.data || null;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }
);

// Cache for chart data
export const getChartData = cache(async (): Promise<ChartData> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/meta/charts`,
      {
        credentials: "include",
        next: {
          tags: ["chart-data"], // Cache tag for revalidation
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
});

// Service functions for dashboard
export const metaService = {
  // Get all dashboard data
  async getDashboardData(): Promise<{
    stats: DashboardStats | null;
    chartData?: ChartData | null;
  }> {
    try {
      // Fetch both in parallel
      const [stats, chartData] = await Promise.allSettled([
        getAdminDashboardStats(),
        getChartData(),
      ]);

      return {
        stats: stats.status === "fulfilled" ? stats.value : null,
        chartData: chartData.status === "fulfilled" ? chartData.value : null,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  // Revalidate cache
  async revalidateCache(): Promise<void> {
    try {
      await fetch("/api/revalidate?tag=dashboard", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to revalidate cache:", error);
    }
  },
};
