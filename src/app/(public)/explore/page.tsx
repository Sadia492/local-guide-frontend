"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  Star,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data - replace with actual API calls
const mockTours = [
  {
    id: 1,
    title: "Hidden Jazz Bars of New Orleans",
    description: "Explore the secret jazz scene with a local musician",
    price: 89,
    duration: 4,
    category: "Nightlife",
    rating: 4.9,
    reviewCount: 127,
    city: "New Orleans",
    guide: {
      name: "Louis Armstrong",
      avatar: "https://i.pravatar.cc/150?img=1",
      languages: ["English", "French"],
    },
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    maxGroupSize: 6,
  },
  {
    id: 2,
    title: "Tokyo Street Food Adventure",
    description: "Taste authentic street food in Shibuya and Shinjuku",
    price: 65,
    duration: 3.5,
    category: "Food",
    rating: 4.8,
    reviewCount: 89,
    city: "Tokyo",
    guide: {
      name: "Yuki Tanaka",
      avatar: "https://i.pravatar.cc/150?img=2",
      languages: ["Japanese", "English"],
    },
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w-800&q=80",
    maxGroupSize: 8,
  },
  {
    id: 3,
    title: "Ancient Rome History Walk",
    description: "Step back in time with a history professor",
    price: 75,
    duration: 5,
    category: "History",
    rating: 4.7,
    reviewCount: 203,
    city: "Rome",
    guide: {
      name: "Marco Rossi",
      avatar: "https://i.pravatar.cc/150?img=3",
      languages: ["Italian", "English", "Spanish"],
    },
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w-800&q=80",
    maxGroupSize: 10,
  },
  {
    id: 4,
    title: "Parisian Art & Architecture",
    description: "Discover Montmartre's artistic heritage",
    price: 95,
    duration: 4,
    category: "Art",
    rating: 4.9,
    reviewCount: 156,
    city: "Paris",
    guide: {
      name: "Sophie Martin",
      avatar: "https://i.pravatar.cc/150?img=4",
      languages: ["French", "English"],
    },
    image:
      "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80",
    maxGroupSize: 6,
  },
  {
    id: 5,
    title: "Istanbul Bazaar Experience",
    description: "Navigate the Grand Bazaar like a local",
    price: 55,
    duration: 3,
    category: "Shopping",
    rating: 4.6,
    reviewCount: 94,
    city: "Istanbul",
    guide: {
      name: "Mehmet Yılmaz",
      avatar: "https://i.pravatar.cc/150?img=5",
      languages: ["Turkish", "English", "Arabic"],
    },
    image:
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80",
    maxGroupSize: 12,
  },
  {
    id: 6,
    title: "Bali Waterfall Trekking",
    description: "Private guided trek to hidden waterfalls",
    price: 120,
    duration: 7,
    category: "Adventure",
    rating: 4.8,
    reviewCount: 67,
    city: "Bali",
    guide: {
      name: "Kadek Wijaya",
      avatar: "https://i.pravatar.cc/150?img=6",
      languages: ["Indonesian", "English"],
    },
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
    maxGroupSize: 4,
  },
];

const categories = [
  "Food",
  "History",
  "Art",
  "Nightlife",
  "Adventure",
  "Shopping",
  "Nature",
  "Photography",
  "Family",
  "Luxury",
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [duration, setDuration] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTours = mockTours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || tour.category === selectedCategory;
    const matchesPrice =
      tour.price >= priceRange[0] && tour.price <= priceRange[1];

    const matchesDuration = !duration || tour.duration <= duration;

    return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing Experiences
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Find the perfect local guide for your next adventure
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search destinations, tours, or guides..."
                  className="pl-12 text-gray-900 h-14 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                size="lg"
                className="md:w-auto w-full h-14 text-lg"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
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
                    <Select onValueChange={setSelectedCategory}>
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
                      defaultValue={[0, 200]}
                      max={200}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Duration (hours)
                    </label>
                    <Select
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
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Group Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Size
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any size</SelectItem>
                        <SelectItem value="small">Small (1-4)</SelectItem>
                        <SelectItem value="medium">Medium (5-8)</SelectItem>
                        <SelectItem value="large">Large (9+)</SelectItem>
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
                    {categories.slice(0, 6).map((category) => (
                      <Badge
                        key={category}
                        variant={
                          selectedCategory === category ? "default" : "outline"
                        }
                        className="cursor-pointer hover:bg-blue-100"
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredTours.length} Tours Found
            </h2>
            {searchQuery && (
              <p className="text-gray-600 mt-1">Results for "{searchQuery}"</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Select defaultValue="relevance">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTours.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No tours found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find more results
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setPriceRange([0, 200]);
                setDuration(null);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Tour Card Component
function TourCard({ tour }: { tour: (typeof mockTours)[0] }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-gray-800 hover:bg-white">
            {tour.category}
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1 p-6 flex flex-col">
        {/* Title and Rating */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
              {tour.title}
            </h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 font-semibold">{tour.rating}</span>
              <span className="text-gray-500 text-sm ml-1">
                ({tour.reviewCount})
              </span>
            </div>
          </div>
          <p className="text-gray-600 line-clamp-2 mb-3">{tour.description}</p>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{tour.city}</span>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{tour.duration} hours</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>Max {tour.maxGroupSize} people</span>
          </div>
        </div>

        {/* Guide Info */}
        <div className="flex items-center mb-6">
          <img
            src={tour.guide.avatar}
            alt={tour.guide.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold text-gray-900">{tour.guide.name}</p>
            <p className="text-sm text-gray-600">
              Speaks {tour.guide.languages.join(", ")}
            </p>
          </div>
        </div>

        {/* Price and Action */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              ${tour.price}
              <span className="text-sm font-normal text-gray-600">
                {" "}
                / person
              </span>
            </p>
          </div>
          <Button variant="primary">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}
