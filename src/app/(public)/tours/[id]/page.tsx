"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ListingHeader from "@/components/modules/Listing/ListingHeader";
import ListingGallery from "@/components/modules/Listing/ListingGallery";
import ListingReviews from "@/components/modules/Listing/ListingReviews";
import ListingActions from "@/components/modules/Listing/ListingActions";
import ListingGuideInfo from "@/components/modules/Listing/ListingGuideInfo";
import ListingBookingWidget from "@/components/modules/Listing/ListingBookingWidget";
import ListingItinerary from "@/components/modules/Listing/ListingItinerary";
import ListingMeetingPoint from "@/components/modules/Listing/ListingMeetingPoint";
import ListingDescription from "@/components/modules/Listing/ListingDescription";
import ListingHighlights from "@/components/modules/Listing/ListingHighlights";
import ListingLoading from "@/components/modules/Listing/ListingLoading";
import { Listing } from "@/types/listing";
import { ListingReview } from "@/types/review";

export default function ListingPage() {
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<ListingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch listing with credentials (works client-side)
        const listingResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/listing/${id}`,
          {
            credentials: "include",
          }
        );

        if (!listingResponse.ok) {
          if (listingResponse.status === 404) {
            throw new Error("Listing not found");
          }
          if (listingResponse.status === 401) {
            throw new Error("Please login to view this listing");
          }
          throw new Error(`Failed to fetch listing: ${listingResponse.status}`);
        }

        const listingData = await listingResponse.json();
        console.log("Listing data:", listingData);

        if (!listingData.data) {
          throw new Error("Invalid listing data");
        }

        // Transform guide if needed
        let listingDetails = listingData.data;
        if (listingDetails && typeof listingDetails.guide === "string") {
          try {
            const guideResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/user/${listingDetails.guide}`,
              { credentials: "include" }
            );
            if (guideResponse.ok) {
              const guideData = await guideResponse.json();
              listingDetails.guide = guideData.data?.user || {
                _id: listingDetails.guide,
                name: "Local Guide",
                profilePicture: "",
              };
            }
          } catch (guideError) {
            console.error("Error fetching guide details:", guideError);
            listingDetails.guide = {
              _id: listingDetails.guide,
              name: "Local Guide",
              profilePicture: "",
            };
          }
        }

        setListing(listingDetails);

        // Fetch reviews
        try {
          const reviewsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/review/listing/${id}`,
            {
              credentials: "include",
            }
          );

          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData.data || []);
          }
        } catch (reviewsError) {
          console.error("Error fetching reviews:", reviewsError);
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(err instanceof Error ? err.message : "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListingDetails();
    }
  }, [id]);

  if (loading) {
    return <ListingLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 text-red-600">⚠️</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error.includes("login")
              ? "Authentication Required"
              : "Listing Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <a
              href="/explore"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Tours
            </a>
            {error.includes("login") && (
              <a
                href={`/login?redirect=/tours/${id}`}
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Login to View
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <p>The listing you're looking for doesn't exist or is unavailable.</p>
        </div>
      </div>
    );
  }

  const guideName =
    typeof listing.guide === "object" ? listing.guide.name : "Local Guide";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ListingActions listingId={id} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ListingGallery images={listing.images} title={listing.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <ListingHeader
              title={listing.title}
              city={listing.city}
              guideName={guideName}
              category={listing.category}
              isActive={listing.isActive}
            />

            <ListingHighlights
              duration={listing.duration}
              maxGroupSize={listing.maxGroupSize}
              language={listing.language || "English"}
              category={listing.category}
            />

            <ListingDescription description={listing.description} />

            <ListingMeetingPoint meetingPoint={listing.meetingPoint} />

            <ListingItinerary
              itinerary={
                listing.itinerary ||
                "Detailed itinerary will be provided upon booking."
              }
            />

            <ListingReviews reviews={reviews} />
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <ListingBookingWidget listing={listing} listingId={id} />

            <ListingGuideInfo guide={listing.guide} />
          </div>
        </div>
      </div>
    </div>
  );
}
