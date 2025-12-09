"use client";

import { useState, useEffect } from "react";
import { Listing } from "@/types/listing";

export const useListing = (id: string) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listing/${id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch listing: ${response.status}`);
      }

      const data = await response.json();

      // Transform the guide data if it's just an ObjectId
      const listingData = data.data;
      if (listingData && typeof listingData.guide === "string") {
        // If guide is just an ID, fetch guide details
        try {
          const guideResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/${listingData.guide}`,
            { credentials: "include" }
          );
          if (guideResponse.ok) {
            const guideData = await guideResponse.json();
            listingData.guide = guideData.data?.user || {
              _id: listingData.guide,
              name: "Local Guide",
              languages: ["English"],
            };
          }
        } catch (guideError) {
          listingData.guide = {
            _id: listingData.guide,
            name: "Local Guide",
            languages: ["English"],
          };
        }
      }

      setListing(listingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch listing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  return { listing, loading, error, refetch: fetchListing };
};
