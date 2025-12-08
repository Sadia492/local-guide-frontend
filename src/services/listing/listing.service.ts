// import { cache } from "react";

// export interface Listing {
//   _id: string;
//   title: string;
//   description: string;
//   itinerary?: string;
//   city: string;
//   category: string;
//   fee: number;
//   duration: number;
//   meetingPoint: string;
//   maxGroupSize: number;
//   images: string[];
//   language?: string;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
//   guide: {
//     _id: string;
//     name: string;
//     profilePicture?: string;
//   };
// }

// // Cache for 60 seconds for performance
// export const getListings = cache(async (): Promise<Listing[]> => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/listing`,
//       {
//         credentials: "include",
//         next: {
//           tags: ["listings"],
//           revalidate: 3600, // 1 hour - optional fallback
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to fetch listings: ${response.status}`);
//     }

//     const data = await response.json();

//     if (data.success && data.data) {
//       // Filter only active listings
//       return data.data.filter((listing: Listing) => listing.isActive);
//     }

//     return [];
//   } catch (error) {
//     console.error("Error fetching listings:", error);
//     return [];
//   }
// });

// export async function getListingsByFilters(filters: {
//   search?: string;
//   category?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   maxDuration?: number;
// }): Promise<Listing[]> {
//   const allListings = await getListings();

//   return allListings.filter((tour) => {
//     const matchesSearch =
//       !filters.search ||
//       filters.search === "" ||
//       tour.title.toLowerCase().includes(filters.search.toLowerCase()) ||
//       tour.city.toLowerCase().includes(filters.search.toLowerCase()) ||
//       tour.description.toLowerCase().includes(filters.search.toLowerCase()) ||
//       tour.category.toLowerCase().includes(filters.search.toLowerCase());

//     const matchesCategory =
//       !filters.category || tour.category === filters.category;

//     const matchesPrice =
//       (!filters.minPrice || tour.fee >= filters.minPrice) &&
//       (!filters.maxPrice || tour.fee <= filters.maxPrice);

//     const matchesDuration =
//       !filters.maxDuration || tour.duration <= filters.maxDuration;

//     return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
//   });
// }
// function getApiUrl() {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//   if (!apiUrl) {
//     console.error("NEXT_PUBLIC_API_URL is not defined");
//     throw new Error("API URL is not configured");
//   }
//   return apiUrl;
// }
// export const getListingDetails = cache(
//   async (id: string, requestCookies?: string): Promise<Listing | null> => {
//     try {
//       const apiUrl = getApiUrl();
//       console.log(`Fetching listing: ${apiUrl}/api/listing/${id}`);

//       // Prepare headers
//       const headers: Record<string, string> = {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       };

//       // If we have cookies from the request, pass them
//       if (requestCookies) {
//         headers.Cookie = requestCookies;
//         console.log("Passing cookies to listing request");
//       }

//       const response = await fetch(`${apiUrl}/api/listing/${id}`, {
//         headers,
//         cache: "no-store",
//         // Add timeout
//         signal: AbortSignal.timeout(10000),
//       });

//       console.log(`Listing response status: ${response.status}`);
//       console.log(`Listing response ok: ${response.ok}`);

//       if (!response.ok) {
//         // Try to get error message
//         let errorMessage = `Status: ${response.status}`;
//         try {
//           const errorData = await response.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch (e) {
//           // Ignore JSON parse error
//         }

//         console.error(`Failed to fetch listing: ${errorMessage}`);

//         if (response.status === 404) {
//           console.log("Listing not found");
//           return null;
//         }

//         if (response.status === 401) {
//           console.log("Listing requires authentication");
//           // Try without cookies
//           console.log("Trying without cookies...");
//           const retryResponse = await fetch(`${apiUrl}/api/listing/${id}`, {
//             headers: {
//               "Content-Type": "application/json",
//               Accept: "application/json",
//             },
//             cache: "no-store",
//           });

//           if (retryResponse.ok) {
//             const retryData = await retryResponse.json();
//             console.log("Success without cookies!");
//             return retryData.data || null;
//           }

//           console.log(`Retry also failed: ${retryResponse.status}`);
//           return null;
//         }

//         return null;
//       }

//       const data = await response.json();
//       console.log("Listing data received:", data);

//       if (!data.data) {
//         console.error("Invalid response format - no data field");
//         return null;
//       }

//       // If guide is just an ID, create basic guide object
//       let listingData = data.data;
//       if (listingData && typeof listingData.guide === "string") {
//         listingData.guide = {
//           _id: listingData.guide,
//           name: "Local Guide",
//           profilePicture: "",
//         };
//       }

//       return listingData;
//     } catch (error) {
//       console.error("Error fetching listing details:", error);
//       return null;
//     }
//   }
// );
import { cache } from "react";

export interface Listing {
  _id: string;
  title: string;
  guide: string | { _id: string; name: string; profilePic?: string };
  city: string;
  fee: number;
  rating?: number;
  duration: number;
  maxGroupSize: number;
  images: string[];
  category: string;
  isActive: boolean;
  description?: string;
  meetingPoint?: string;
  language: string;
  itinerary: string;
  createdAt: string;
  updatedAt: string;
}

// Cache for listings - automatically revalidates when tag is invalidated
export const getListings = cache(async (): Promise<Listing[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listing`,
      {
        credentials: "include",
        next: {
          tags: ["listings"], // Cache tag for revalidation
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
});

// Service functions for mutations
export const listingService = {
  // Update listing status
  async updateStatus(id: string, isActive: boolean): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listing/${id}`,
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
      throw new Error(error.message || "Failed to update listing status");
    }
  },

  // Delete listing
  async deleteListing(id: string): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listing/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to delete listing");
    }
  },

  // Revalidate cache
  async revalidateCache(): Promise<void> {
    try {
      await fetch("/api/revalidate?tag=listings", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to revalidate cache:", error);
    }
  },
};
