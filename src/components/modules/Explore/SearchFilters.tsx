"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FilterState } from "@/types/explore";
import { debounce } from "lodash";

interface SearchFiltersProps {
  initialFilters: FilterState;
  categories: readonly string[];
  maxPrice: number;
}

export default function SearchFilters({
  initialFilters,
  categories,
  maxPrice,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters.priceRange
  );

  // Create URL parameters
  const createQueryString = useCallback(
    (filters: FilterState, priceRange: [number, number]) => {
      const params = new URLSearchParams(searchParams.toString());

      // Set search
      if (filters.search) {
        params.set("search", filters.search);
      } else {
        params.delete("search");
      }

      // Set category - handle null/empty string
      if (filters.selectedCategory) {
        params.set("category", filters.selectedCategory);
      } else {
        params.delete("category");
      }

      // Set price range - only if different from defaults
      if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
        params.set("minPrice", priceRange[0].toString());
        params.set("maxPrice", priceRange[1].toString());
      } else {
        params.delete("minPrice");
        params.delete("maxPrice");
      }

      // Set duration
      if (filters.duration) {
        params.set("maxDuration", filters.duration.toString());
      } else {
        params.delete("maxDuration");
      }

      return params.toString();
    },
    [searchParams, maxPrice]
  );

  // Debounced URL update
  const updateURL = useCallback(
    debounce((queryString: string) => {
      router.push(`/explore?${queryString}`, { scroll: false });
    }, 300),
    [router]
  );

  // Update URL when filters change
  useEffect(() => {
    const queryString = createQueryString(filters, priceRange);
    updateURL(queryString);

    // Cleanup debounce on unmount
    return () => {
      updateURL.cancel();
    };
  }, [filters, priceRange, createQueryString, updateURL]);

  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      selectedCategory: null,
      priceRange: [0, maxPrice],
      duration: null,
    });
    setPriceRange([0, maxPrice]);
    // No need to call router.push here - useEffect will handle it
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.selectedCategory ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    filters.duration;

  // Get active filter count
  const activeFilterCount = [
    filters.search ? 1 : 0,
    filters.selectedCategory ? 1 : 0,
    priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0,
    filters.duration ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 -mt-8 relative z-10">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search destinations, tours, or categories..."
            className="pl-12 text-gray-900 h-14 text-lg"
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <Button
          variant="primary"
          size="lg"
          className="md:w-auto w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white relative"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-5 h-5 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{filters.search}"
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.selectedCategory}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, selectedCategory: null }))
                }
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: ${priceRange[0]} - ${priceRange[1]}
              <button
                onClick={() => {
                  setPriceRange([0, maxPrice]);
                }}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.duration && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Duration: ≤ {filters.duration}h
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, duration: null }))
                }
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="primary"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
            onClick={handleClearFilters}
          >
            Clear all
          </Button>
        </div>
      )}

      {showFilters && (
        <div className="mt-6 p-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter - FIXED */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={filters.selectedCategory || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    selectedCategory: value === "all" ? null : value,
                  }))
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

            {/* Price Range - FIXED */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <Slider
                min={0}
                max={maxPrice}
                step={10}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {/* Duration Filter - FIXED */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Duration (hours)
              </label>
              <Select
                value={filters.duration?.toString() || "any"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    duration: value === "any" ? null : parseInt(value),
                  }))
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

            {/* Sort By - FIXED */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select
                value={searchParams.get("sort") || "relevance"}
                onValueChange={(value) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("sort", value);
                  router.push(`/explore?${params.toString()}`);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
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
                    filters.selectedCategory === category
                      ? "default"
                      : "outline"
                  }
                  className={`cursor-pointer transition-all ${
                    filters.selectedCategory === category
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "hover:bg-blue-100 hover:text-blue-700"
                  }`}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      selectedCategory:
                        filters.selectedCategory === category ? null : category,
                    }))
                  }
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
