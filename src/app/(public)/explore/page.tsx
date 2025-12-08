"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  Star,
  Clock,
  User,
  Globe,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

interface Listing {
  _id: string;
  title: string;
  description: string;
  itinerary?: string;
  city: string;
  category: string;
  fee: number;
  duration: number;
  meetingPoint: string;
  maxGroupSize: number;
  images: string[];
  language?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  guide: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: "TOURIST" | "GUIDE" | "ADMIN";
  bio?: string;
  location?: string;
  languages?: string[];
  expertise?: string[];
  dailyRate?: number;
  travelPreferences?: string[];
  isVerified?: boolean;
  isActive?: boolean;
  createdAt: string;
}

const categories = [
  "Adventure",
  "Food",
  "History",
  "Art",
  "Nightlife",
  "Shopping",
  "Nature",
  "Photography",
  "Family",
  "Luxury",
  "Cultural",
  "Sports",
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [duration, setDuration] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    fetchListings();
    checkAuth();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listing`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        // Filter only active listings
        const activeListings = data.data.filter(
          (listing: Listing) => listing.isActive
        );
        setListings(activeListings);

        // Calculate max price for slider
        if (activeListings.length > 0) {
          const maxPrice = Math.max(
            ...activeListings.map((l: Listing) => l.fee)
          );
          setPriceRange([0, Math.ceil(maxPrice / 100) * 100]); // Round up to nearest 100
        }
      } else {
        setListings([]);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to load tours. Please try again later.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
        { credentials: "include" }
      );

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setCurrentUser(data.data);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthenticated(false);
    }
  };

  const filteredTours = listings.filter((tour) => {
    const matchesSearch =
      searchQuery === "" ||
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || tour.category === selectedCategory;
    const matchesPrice = tour.fee >= priceRange[0] && tour.fee <= priceRange[1];

    const matchesDuration = !duration || tour.duration <= duration;

    return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
  });

  const handleViewDetails = (listingId: string) => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const loginUrl = `/login?redirect=${encodeURIComponent(
        `/tours/${listingId}`
      )}`;
      window.location.href = loginUrl;
      return;
    }
    // If authenticated, navigate to tour details
    window.location.href = `/tours/${listingId}`;
  };

  const handleBookNow = (listingId: string) => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const loginUrl = `/login?redirect=${encodeURIComponent(
        `/tours/${listingId}?booking=true`
      )}`;
      window.location.href = loginUrl;
      return;
    }
    // If authenticated, navigate to tour details with booking intent
    window.location.href = `/tours/${listingId}?booking=true`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Adventure: "bg-green-100 text-green-800 hover:bg-green-200",
      Food: "bg-red-100 text-red-800 hover:bg-red-200",
      History: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      Art: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      Nightlife: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      Shopping: "bg-pink-100 text-pink-800 hover:bg-pink-200",
      Nature: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
      Photography: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      Cultural: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing Local Experiences
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Connect with local guides for authentic adventures
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search destinations, tours, or categories..."
                  className="pl-12 text-gray-900 h-14 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                size="lg"
                className="md:w-auto w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 p-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Select
                      value={selectedCategory || "all"}
                      onValueChange={(value) =>
                        setSelectedCategory(value === "all" ? null : value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <Slider
                      min={0}
                      max={priceRange[1] > 1000 ? priceRange[1] : 1000}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Duration (hours)
                    </label>
                    <Select
                      value={duration?.toString() || "any"}
                      onValueChange={(value) =>
                        setDuration(value === "any" ? null : parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any duration</SelectItem>
                        <SelectItem value="2">Up to 2 hours</SelectItem>
                        <SelectItem value="4">Up to 4 hours</SelectItem>
                        <SelectItem value="6">Up to 6 hours</SelectItem>
                        <SelectItem value="8">Up to 8 hours</SelectItem>
                        <SelectItem value="12">Up to 12 hours</SelectItem>
                        <SelectItem value="24">Up to 24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Group Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <Select defaultValue="relevance">
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Most Relevant</SelectItem>
                        <SelectItem value="price_low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price_high">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Quick Category Filters */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Popular Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 8).map((category) => (
                      <Badge
                        key={category}
                        variant={
                          selectedCategory === category ? "default" : "outline"
                        }
                        className={`cursor-pointer ${
                          selectedCategory === category
                            ? "bg-blue-600 hover:bg-blue-700"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category ? null : category
                          )
                        }
                      >
                        {category}
                      </Badge>
                    ))}
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-100"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Clear
                    </Badge>
                  </div>
                </div>

                {/* Reset Filters */}
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                      setPriceRange([0, Math.max(1000, priceRange[1])]);
                      setDuration(null);
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredTours.length}{" "}
              {filteredTours.length === 1 ? "Tour" : "Tours"} Found
            </h2>
            {searchQuery && (
              <p className="text-gray-600 mt-1">Results for "{searchQuery}"</p>
            )}
            {selectedCategory && (
              <p className="text-gray-600 text-sm mt-1">
                Category: {selectedCategory}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Select defaultValue="relevance">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="font-medium">Error:</span>
              <span className="ml-2">{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={fetchListings}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Tours Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <TourCard
                key={tour._id}
                tour={tour}
                isAuthenticated={isAuthenticated}
                onViewDetails={handleViewDetails}
                onBookNow={handleBookNow}
                getCategoryColor={getCategoryColor}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No tours found
            </h3>
            <p className="text-gray-600 mb-6">
              {error
                ? "Error loading tours. Please try again."
                : "Try adjusting your search or filters to find more results"}
            </p>
            {!error && (
              <Button
                variant="primary"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setPriceRange([0, Math.max(1000, priceRange[1])]);
                  setDuration(null);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Tour Card Component
function TourCard({
  tour,
  isAuthenticated,
  onViewDetails,
  onBookNow,
  getCategoryColor,
}: {
  tour: Listing;
  isAuthenticated: boolean;
  onViewDetails: (id: string) => void;
  onBookNow: (id: string) => void;
  getCategoryColor: (category: string) => string;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {tour.images && tour.images.length > 0 ? (
          <img
            src={tour.images[0]}
            alt={tour.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <MapPin className="w-12 h-12 text-white/50" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge className={`${getCategoryColor(tour.category)}`}>
            {tour.category}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            ${tour.fee} / person
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1 p-6 flex flex-col">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2">
            {tour.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{tour.city}</span>
          </div>
          <p className="text-gray-600 line-clamp-2 text-sm">
            {tour.description}
          </p>
        </div>

        {/* Guide Info */}
        <div className="flex items-center mb-6">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              tour.guide.profilePicture
                ? ""
                : "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
            }`}
          >
            {tour.guide.profilePicture ? (
              <img
                src={tour.guide.profilePicture}
                alt={tour.guide.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{tour.guide.name}</p>
            <Link
              href={`/profile/${tour.guide._id}`}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              View Profile
            </Link>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{tour.duration} hours</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>Max {tour.maxGroupSize} people</span>
          </div>
          {tour.language && (
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              <span>{tour.language}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(tour._id)}
          >
            View Details
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onBookNow(tour._id)}
          >
            Book Now
          </Button>
        </div>

        {!isAuthenticated && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Login required to book
          </p>
        )}
      </CardContent>
    </Card>
  );
}
