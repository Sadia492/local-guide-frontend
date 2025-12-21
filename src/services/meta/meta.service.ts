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
// Add to your existing interfaces
export interface HeroStats {
  happyTravelers: string; // "50K+"
  localGuides: string; // "2K+"
  cities: string; // "500+"
  fiveStarReviews: number; // 98
}
export interface TouristDashboardData {
  upcomingBookings: Array<{
    _id: string;
    listing: {
      _id: string;
      title: string;
      city: string;
      images: string[];
      guide: { name: string };
    };
    date: string;
    status: string;
    totalPrice: number;
    groupSize: number;
  }>;
  pastExperiences: Array<{
    _id: string;
    listing: { title: string; city: string };
    date: string;
  }>;
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
// Hero stats fetching function
export const getHeroStats = async (): Promise<HeroStats> => {
  try {
    // Try different endpoint variations - match your backend route
    const endpoints = [
      `${process.env.NEXT_PUBLIC_API_URL}/api/meta/hero-stats`, // New route
      `${process.env.NEXT_PUBLIC_API_URL}/api/hero-stats`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/stats/hero`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/stats`,
    ];

    let response;

    for (const endpoint of endpoints) {
      try {
        console.log("Trying hero stats endpoint:", endpoint);
        response = await fetch(endpoint, {
          credentials: "include", // Include cookies if needed
          headers: {
            "Content-Type": "application/json",
          },
          // Add cache if it's public data (optional)
          next: { revalidate: 3600 }, // Revalidate every hour for static generation
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Hero stats success with endpoint:", endpoint);

          // Handle different response structures
          if (data.data) {
            return data.data;
          } else if (data.happyTravelers || data.localGuides) {
            return data; // Direct data object
          } else {
            return data; // Fallback
          }
        }
      } catch (error) {
        console.log("Failed with hero stats endpoint:", endpoint);
        // Continue to next endpoint
      }
    }

    // If all endpoints fail, return mock/fallback data
    console.log("No hero stats endpoint found, returning fallback data");
    return {
      happyTravelers: "50K+",
      localGuides: "2K+",
      cities: "500+",
      fiveStarReviews: 98,
    };
  } catch (error) {
    console.error("Error fetching hero stats:", error);
    // Return fallback data
    return {
      happyTravelers: "50K+",
      localGuides: "2K+",
      cities: "500+",
      fiveStarReviews: 98,
    };
  }
};

// Optional: If you want a cached version
const heroStatsCache = {
  data: null as HeroStats | null,
  timestamp: 0,
  ttl: 3600000, // 1 hour in milliseconds
};

export const getCachedHeroStats = async (): Promise<HeroStats> => {
  const now = Date.now();

  // Return cached data if it's still valid
  if (
    heroStatsCache.data &&
    now - heroStatsCache.timestamp < heroStatsCache.ttl
  ) {
    return heroStatsCache.data;
  }

  // Fetch fresh data
  const data = await getHeroStats();

  // Update cache
  heroStatsCache.data = data;
  heroStatsCache.timestamp = now;

  return data;
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
export const fetchDashboard = async () => {
  try {
    // Try different endpoint variations for guide dashboard
    const endpoints = [
      `${process.env.NEXT_PUBLIC_API_URL}/api/guide/dashboard`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/guide`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/dashboard/guide`,
      `${process.env.NEXT_PUBLIC_API_URL}/api/meta/dashboard`,
    ];

    let response;
    for (const endpoint of endpoints) {
      try {
        response = await fetch(endpoint, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            return data.data; // Return the transformed data for guide
          }
        }
      } catch (error) {
        console.log("Failed with endpoint:", endpoint);
      }
    }
    throw new Error(
      "Failed to fetch guide dashboard: 404 - Endpoint not found"
    );
  } catch (error) {
    console.error("Error fetching guide dashboard:", error);
    throw error;
  }
};

export const fetchTouristDashboard =
  async (): Promise<TouristDashboardData> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/meta/dashboard`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const userData = result.data;
        return {
          upcomingBookings:
            userData.recentBookings?.filter(
              (b: any) => b.status === "PENDING" || b.status === "CONFIRMED"
            ) || [],
          pastExperiences:
            userData.recentBookings
              ?.filter((b: any) => b.status === "COMPLETED")
              .map((booking: any) => ({
                _id: booking._id,
                listing: booking.listing,
                date: booking.date,
              })) || [],
        };
      }

      return {
        upcomingBookings: [],
        pastExperiences: [],
      };
    } catch (error) {
      console.error("Error fetching tourist dashboard:", error);
      throw error;
    }
  };
