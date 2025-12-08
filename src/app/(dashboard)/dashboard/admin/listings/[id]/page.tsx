// app/tours/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  Calendar,
  Globe,
  CheckCircle,
  Heart,
  Share2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Navigation,
  User,
  Compass,
  Music,
  Utensils,
  Building,
  Mountain,
  Palette,
  ShoppingBag,
  Zap,
  BookOpen,
  Map,
} from "lucide-react";
import { toast } from "sonner";

interface Listing {
  _id: string;
  title: string;
  guide: {
    _id: string;
    name: string;
    profilePic?: string;
    bio?: string;
    languages?: string[];
    rating?: number;
    totalTours?: number;
    yearsExperience?: number;
  };
  city: string;
  fee: number;
  rating?: number;
  totalReviews?: number;
  duration: number;
  maxGroupSize: number;
  images: string[];
  category: string;
  isActive: boolean;
  description: string;
  meetingPoint: string;
  language: string;
  itinerary: string;
  createdAt: string;
  updatedAt: string;
}

const ListingDetails = () => {
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [guests, setGuests] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch listing details
  useEffect(() => {
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
          // If guide is just an ID, you might need to fetch guide details separately
          // For now, we'll create a minimal guide object
          listingData.guide = {
            _id: listingData.guide,
            name: "Local Guide",
            languages: ["English"],
          };
        }

        setListing(listingData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch listing"
        );
        console.error("Error fetching listing:", err);
        toast.error("Failed to load listing", {
          description: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleBookNow = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    toast.success("Booking initiated", {
      description: `Booking ${listing?.title} for ${selectedDate} with ${guests} guest(s)`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: `Check out this amazing tour: ${listing?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleWishlistToggle = () => {
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const nextImage = () => {
    if (listing?.images) {
      setSelectedImageIndex((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listing?.images) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "food":
        return <Utensils className="w-5 h-5" />;
      case "history":
        return <BookOpen className="w-5 h-5" />;
      case "adventure":
        return <Mountain className="w-5 h-5" />;
      case "nightlife":
        return <Music className="w-5 h-5" />;
      case "shopping":
        return <ShoppingBag className="w-5 h-5" />;
      case "art":
        return <Palette className="w-5 h-5" />;
      case "culture":
        return <Building className="w-5 h-5" />;
      default:
        return <Compass className="w-5 h-5" />;
    }
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tour Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The tour you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Compass className="w-5 h-5" />
            Explore Other Tours
          </Link>
        </div>
      </div>
    );
  }

  const dateOptions = getNextWeekDates();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              href="/explore"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Tours
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-lg transition-colors ${
                  wishlisted
                    ? "bg-red-50 text-red-600"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
            {listing.images && listing.images.length > 0 ? (
              <img
                src={listing.images[selectedImageIndex]}
                alt={listing.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <Compass className="w-20 h-20 text-white/50" />
              </div>
            )}

            {listing.images && listing.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-blue-600" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-blue-600" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {listing.images && listing.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {listing.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-transparent hover:border-blue-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {getCategoryIcon(listing.category)}
                      {listing.category}
                    </span>
                    {listing.isActive ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        <Shield className="w-4 h-4" />
                        Unavailable
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{listing.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-5 h-5 text-blue-500" />
                      <span>by {listing.guide?.name || "Local Guide"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Tour Highlights
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-bold text-gray-900">
                    {listing.duration} hours
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Group Size</p>
                  <p className="font-bold text-gray-900">
                    Max {listing.maxGroupSize}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Language</p>
                  <p className="font-bold text-gray-900">
                    {listing.language || "English"}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-bold text-gray-900">{listing.category}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                About This Tour
              </h3>
              <div className="prose prose-blue max-w-none">
                <p
                  className={`text-gray-700 ${
                    !showFullDescription && "line-clamp-4"
                  }`}
                >
                  {listing.description}
                </p>
                {listing.description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            </div>

            {/* Meeting Point */}
            <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                Meeting Point
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-800 font-medium">
                  {listing.meetingPoint}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Your guide will meet you at this location at the scheduled
                  time.
                </p>
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-600" />
                Tour Itinerary
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {listing.itinerary ||
                      "Detailed itinerary will be provided upon booking."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Guide Info */}
              <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  About Your Guide
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {listing.guide?.name || "Local Guide"}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Passionate local expert with in-depth knowledge of{" "}
                      {listing.city}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {listing.guide?.languages?.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/profile/${listing.guide?._id}`}
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View full profile →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready for an unforgettable experience?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Book your spot now and explore {listing.city} like never before
              with a passionate local guide.
            </p>
            <button
              onClick={handleBookNow}
              disabled={!listing.isActive}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all disabled:opacity-50"
            >
              <Calendar className="w-5 h-5" />
              {listing.isActive
                ? "Book Your Tour Now"
                : "Tour Currently Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
