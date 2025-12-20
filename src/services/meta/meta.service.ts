// services/meta/meta.service.ts
"use client"; // Add this for client-side usage

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

// CLIENT-SIDE function (like your booking service)
export const getAdminDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/meta/dashboard/admin`,
      {
        credentials: "include", // This sends cookies
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// CLIENT-SIDE function for chart data
export const getChartData = async (): Promise<ChartData> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/meta/charts`,
      {
        credentials: "include", // This sends cookies
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
};
