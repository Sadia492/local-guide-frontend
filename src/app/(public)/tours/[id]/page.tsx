// app/tours/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "@/actions/useAuth";

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

interface BookingData {
  listing: string;
  date: string;
  groupSize: number;
}

interface UserBooking {
  _id: string;
  listing: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  date: string;
  groupSize: number;
  totalPrice: number;
  createdAt: string;
}

const ListingDetails = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { user, isLoading } = useAuth();
  const [bookingStep, setBookingStep] = useState(1);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [userBooking, setUserBooking] = useState<UserBooking | null>(null);
  const [checkingBooking, setCheckingBooking] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistData, setWishlistData] = useState<any[]>([]);

  // Check if tour is in user's wishlist
  const checkWishlistStatus = async () => {
    if (!user || !listing) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setWishlistData(data.data);

          // Check if current listing is in wishlist
          const inWishlist = data.data.some(
            (item: any) => item.listing?._id === listing._id
          );
          setIsInWishlist(inWishlist);
        } else {
          setIsInWishlist(false);
          setWishlistData([]);
        }
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
      setIsInWishlist(false);
      setWishlistData([]);
    }
  };

  // Add to wishlist function
  const addToWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist", {
        description: "You need to be logged in to save tours",
        action: {
          label: "Login",
          onClick: () => router.push(`/login?redirect=/tours/${id}`),
        },
      });
      return;
    }

    if (!listing) return;

    try {
      setWishlistLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            listingId: listing._id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to wishlist");
      }

      if (data.success) {
        setIsInWishlist(true);
        toast.success("Added to wishlist", {
          description: "Tour saved to your wishlist",
        });

        // Refresh wishlist data
        await checkWishlistStatus();
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  // Remove from wishlist function
  const removeFromWishlist = async () => {
    if (!user || !listing) return;

    try {
      setWishlistLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${listing._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove from wishlist");
      }

      if (data.success) {
        setIsInWishlist(false);
        toast.success("Removed from wishlist", {
          description: "Tour removed from your wishlist",
        });

        // Refresh wishlist data
        await checkWishlistStatus();
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  // Toggle wishlist function
  const toggleWishlist = async () => {
    if (wishlistLoading || !listing) return;

    if (isInWishlist) {
      await removeFromWishlist();
    } else {
      await addToWishlist();
    }
  };

  // Call checkWishlistStatus when user or listing changes
  useEffect(() => {
    if (user && listing) {
      checkWishlistStatus();
    } else {
      setIsInWishlist(false);
      setWishlistData([]);
    }
  }, [user, listing]);
  // Check if booking intent from URL
  useEffect(() => {
    const bookingIntent = searchParams.get("booking");
    if (bookingIntent === "true") {
      setBookingStep(1);
    }
  }, [searchParams]);

  // Generate available dates (next 30 days)
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    setSelectedDate(tomorrow);
  }, []);

  // Check if user has already booked this tour
  const checkUserBooking = async () => {
    if (!user || !listing) return;

    try {
      setCheckingBooking(true);
      // Fetch user's bookings
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/my-bookings`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Check if user has booked this specific listing
          const existingBooking = data.data.find(
            (booking: any) => booking.listing._id === listing._id
          );

          if (existingBooking) {
            setUserBooking({
              _id: existingBooking._id,
              listing: existingBooking.listing._id,
              status: existingBooking.status,
              date: existingBooking.date,
              groupSize: existingBooking.groupSize,
              totalPrice: existingBooking.totalPrice,
              createdAt: existingBooking.createdAt,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking user booking:", error);
    } finally {
      setCheckingBooking(false);
    }
  };

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
            console.error("Error fetching guide details:", guideError);
            listingData.guide = {
              _id: listingData.guide,
              name: "Local Guide",
              languages: ["English"],
            };
          }
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

  // Check for user booking after listing is loaded
  useEffect(() => {
    if (listing && user) {
      checkUserBooking();
    }
  }, [listing, user]);

  const handleBookNow = async () => {
    // Check authentication first
    if (!user) {
      toast.error("Please login to book this tour", {
        description: "You need to be logged in to make a booking",
        action: {
          label: "Login",
          onClick: () => router.push(`/login?redirect=/tours/${id}`),
        },
      });
      return;
    }

    // Check if user already has a booking for this tour
    if (userBooking && userBooking.status !== "CANCELLED") {
      toast.error("You already have a booking for this tour", {
        description: "You can manage your booking in your trips dashboard",
        action: {
          label: "View Booking",
          onClick: () => router.push(`/dashboard/tourist/my-trips`),
        },
      });
      return;
    }

    // Validate inputs
    if (!selectedDate) {
      toast.error("Please select a date", {
        description: "Choose a date for your tour",
      });
      return;
    }

    if (!listing) {
      toast.error("Tour information not available");
      return;
    }

    if (guests < 1 || guests > listing.maxGroupSize) {
      toast.error("Invalid group size", {
        description: `Group size must be between 1 and ${listing.maxGroupSize}`,
      });
      return;
    }

    try {
      setBookingLoading(true);

      // Prepare booking data
      const bookingData: BookingData = {
        listing: listing._id,
        date: selectedDate.toISOString(),
        groupSize: guests,
      };

      console.log("Booking data:", bookingData);

      // Send booking request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      if (data.success) {
        toast.success("Booking created successfully!", {
          description:
            "Your tour has been booked. Check your dashboard for details.",
          duration: 5000,
        });

        // Refresh booking status
        await checkUserBooking();

        // Redirect to bookings page or dashboard after delay
        setTimeout(() => {
          router.push("/dashboard/tourist/my-trips");
        }, 2000);
      } else {
        throw new Error(data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setBookingLoading(false);
    }
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
  // Change the formatDate function to handle both Date objects and strings:

  const formatDate = (dateInput: Date | string) => {
    try {
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get booking status badge
  const BookingStatusBadge = ({ status }: { status: string }) => {
    // Change type to string
    const config = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <AlertCircle className="w-3 h-3" />,
        text: "Pending",
      },
      CONFIRMED: {
        color: "bg-blue-100 text-blue-800",
        icon: <CheckCircle className="w-3 h-3" />,
        text: "Confirmed",
      },
      COMPLETED: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-3 h-3" />,
        text: "Completed",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="w-3 h-3" />,
        text: "Cancelled",
      },
    };

    // Get config or use default for unknown status
    const statusConfig = config[status as keyof typeof config] || {
      color: "bg-gray-100 text-gray-800",
      icon: <AlertCircle className="w-3 h-3" />,
      text: status,
    };

    const { color, icon, text } = statusConfig;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${color}`}
      >
        {icon}
        {text}
      </span>
    );
  };

  const isBookingAllowed = () => {
    if (!user) return false;
    if (!userBooking) return true;
    return userBooking.status === "CANCELLED";
  };

  if (loading || isLoading) {
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

  const totalPrice = listing.fee * guests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Back Navigation */}
      {/* Back Navigation - Update the wishlist button */}
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
                onClick={toggleWishlist}
                disabled={wishlistLoading || !user || !listing}
                className={`p-2 rounded-lg transition-all relative ${
                  isInWishlist
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {wishlistLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Heart
                      className={`w-5 h-5 ${
                        isInWishlist ? "fill-current" : ""
                      }`}
                    />
                    {!user && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    )}
                  </>
                )}
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
          {/* Add this in the right column, after guide info or before booking widget */}
          {user && (
            <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Save this tour</h4>
                  <p className="text-sm text-gray-600">
                    Add to your wishlist for later
                  </p>
                </div>
                <button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading || !listing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isInWishlist
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {wishlistLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Heart
                        className={`w-4 h-4 ${
                          isInWishlist ? "fill-current" : ""
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                      </span>
                    </>
                  )}
                </button>
              </div>
              {wishlistData.length > 0 && (
                <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                  You have {wishlistData.length} tour
                  {wishlistData.length !== 1 ? "s" : ""} in your wishlist
                  {isInWishlist && (
                    <button
                      onClick={() => router.push("/dashboard/tourist/wishlist")}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
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

            {/* User Booking Status */}
            {user && checkingBooking && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking your booking status...</span>
                </div>
              </div>
            )}

            {user &&
              userBooking &&
              BookingStatusBadge({ status: userBooking.status })}

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
              <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
                {/* Price Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl font-bold">${listing.fee}</div>
                    <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      per person
                    </div>
                  </div>
                  <p className="text-blue-100">All fees and taxes included</p>
                </div>

                <div className="p-6">
                  {user && userBooking && userBooking.status !== "CANCELLED" ? (
                    // User already has an active booking
                    <div className="text-center py-4">
                      <div className="mb-4">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <h3 className="font-bold text-gray-900 text-lg mb-2">
                          You have a booking for this tour
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {userBooking.status === "PENDING"
                            ? "Awaiting guide's confirmation"
                            : "Your tour is confirmed"}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span
                              className={`font-medium ${
                                userBooking.status === "CONFIRMED"
                                  ? "text-green-600"
                                  : userBooking.status === "PENDING"
                                  ? "text-yellow-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {userBooking.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">
                              {formatDate(userBooking.date)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Guests:</span>
                            <span className="font-medium">
                              {userBooking.groupSize}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-bold">
                              ${userBooking.totalPrice}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/dashboard/tourist/my-trips`}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors block text-center mb-3"
                      >
                        Manage Booking
                      </Link>

                      {userBooking.status === "PENDING" && (
                        <button
                          onClick={() => {
                            toast.info("Cancellation feature coming soon");
                          }}
                          className="w-full py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  ) : (
                    // Booking form (for new booking or cancelled booking)
                    <>
                      {/* Date Selection */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Select Date & Time
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date: any) => setSelectedDate(date)}
                            minDate={new Date()}
                            maxDate={
                              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            }
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={60}
                            timeCaption="Time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            placeholderText="Select date and time"
                            popperPlacement="bottom-start"
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {selectedDate
                            ? `Selected: ${formatDate(selectedDate)}`
                            : "Please select a date and time"}
                        </p>
                      </div>

                      {/* Guests Selection */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          <Users className="w-4 h-4 inline mr-2" />
                          Number of Guests
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={guests <= 1}
                          >
                            <span className="text-xl">-</span>
                          </button>
                          <div className="flex-1 text-center">
                            <span className="text-2xl font-bold text-gray-900">
                              {guests}
                            </span>
                            <span className="text-gray-600 ml-2">
                              guest{guests !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setGuests(
                                Math.min(listing.maxGroupSize, guests + 1)
                              )
                            }
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={guests >= listing.maxGroupSize}
                          >
                            <span className="text-xl">+</span>
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Maximum group size: {listing.maxGroupSize} guests
                        </p>
                      </div>

                      {/* Price Breakdown */}
                      <div className="mb-6 pt-4 border-t">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              ${listing.fee} × {guests} guest
                              {guests !== 1 ? "s" : ""}
                            </span>
                            <span className="font-medium">
                              ${listing.fee * guests}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Service fee</span>
                            <span className="text-gray-500">$0</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Taxes</span>
                            <span className="text-gray-500">Included</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <span className="text-lg font-bold text-gray-900">
                            Total
                          </span>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              ${totalPrice}
                            </div>
                            <div className="text-sm text-gray-500">USD</div>
                          </div>
                        </div>
                      </div>

                      {/* Book Button */}
                      {!user ? (
                        <div className="space-y-3">
                          <Link
                            href={`/login?redirect=/tours/${id}`}
                            className="block w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-center"
                          >
                            <Calendar className="w-5 h-5 inline mr-2" />
                            Login to Book
                          </Link>
                          <p className="text-center text-sm text-gray-600">
                            You need to be logged in to book this tour
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={handleBookNow}
                          disabled={
                            !selectedDate ||
                            !listing.isActive ||
                            guests < 1 ||
                            bookingLoading ||
                            !isBookingAllowed()
                          }
                          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
                        >
                          {bookingLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin mr-2" />
                              Processing...
                            </>
                          ) : listing.isActive ? (
                            <>
                              <Calendar className="w-5 h-5 inline mr-2" />
                              {userBooking?.status === "CANCELLED"
                                ? "Book Again"
                                : "Book Now"}{" "}
                              - ${totalPrice}
                            </>
                          ) : (
                            "Currently Unavailable"
                          )}
                        </button>
                      )}

                      {/* Secure Booking */}
                      <div className="mt-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span>Secure booking · Free cancellation</span>
                        </div>
                      </div>

                      {/* Booking Summary */}
                      {selectedDate && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Booking Summary
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Tour:</span>{" "}
                              {listing.title}
                            </p>
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {formatDate(selectedDate)}
                            </p>
                            <p>
                              <span className="font-medium">Guests:</span>{" "}
                              {guests} person{guests !== 1 ? "s" : ""}
                            </p>
                            <p>
                              <span className="font-medium">Total:</span> $
                              {totalPrice}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

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
            {!user ? (
              <Link
                href={`/login?redirect=/tours/${id}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all"
              >
                <Calendar className="w-5 h-5" />
                Login to Book Your Tour
              </Link>
            ) : user && userBooking && userBooking.status !== "CANCELLED" ? (
              <Link
                href={`/dashboard/tourist/my-trips`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all"
              >
                <Calendar className="w-5 h-5" />
                View Your Booking
              </Link>
            ) : (
              <button
                onClick={handleBookNow}
                disabled={
                  !listing.isActive || bookingLoading || !isBookingAllowed()
                }
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    {userBooking?.status === "CANCELLED"
                      ? "Book Again - $" + totalPrice
                      : listing.isActive
                      ? "Book Your Tour Now - $" + totalPrice
                      : "Tour Currently Unavailable"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
