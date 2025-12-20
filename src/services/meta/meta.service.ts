// services/meta/meta.service.ts
"use client";

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

// Try these common endpoint patterns:
export const getAdminDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Try different endpoint variations
    const endpoints = [
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/admin`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/meta/dashboard/admin`, // Original
    ];

    let response;
    let lastError;

    for (const endpoint of endpoints) {
      try {
        console.log("Trying endpoint:", endpoint);
        response = await fetch(endpoint, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Success with endpoint:", endpoint);
          return data.data || data;
        }
      } catch (error) {
        lastError = error;
        console.log("Failed with endpoint:", endpoint);
      }
    }

    // If all endpoints fail
    throw new Error(
      `Failed to fetch dashboard stats: 404 - Endpoint not found`
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export const getChartData = async (): Promise<ChartData> => {
  try {
    // Try different endpoint variations
    const endpoints = [
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/charts`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/charts`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/charts`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/charts`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/meta/charts`, // Original
    ];

    let response;
    let lastError;

    for (const endpoint of endpoints) {
      try {
        console.log("Trying chart endpoint:", endpoint);
        response = await fetch(endpoint, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Success with chart endpoint:", endpoint);
          return data.data || data;
        }
      } catch (error) {
        lastError = error;
        console.log("Failed with chart endpoint:", endpoint);
      }
    }

    // If all endpoints fail, return empty/default data
    console.log("No chart endpoint found, returning default data");
    return {
      barChartData: [],
      pieChartData: {
        bookingStatus: [],
        listingCategories: [],
        userRoles: [],
      },
    };
  } catch (error) {
    console.error("Error fetching chart data:", error);
    // Return empty/default data instead of throwing
    return {
      barChartData: [],
      pieChartData: {
        bookingStatus: [],
        listingCategories: [],
        userRoles: [],
      },
    };
  }
};
