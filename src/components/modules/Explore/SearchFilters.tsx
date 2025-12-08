"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
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
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange);

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams(searchParams.toString());

    if (filters.search) {
      params.set("search", filters.search);
    } else {
      params.delete("search");
    }

    if (filters.selectedCategory) {
      params.set("category", filters.selectedCategory);
    } else {
      params.delete("category");
    }

    if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    if (filters.duration) {
      params.set("maxDuration", filters.duration.toString());
    } else {
      params.delete("maxDuration");
    }

    // Debounce the URL update
    const timeoutId = setTimeout(() => {
      router.push(`/explore?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, priceRange, router, searchParams, maxPrice]);

  const handleClearFilters = () => {
    setFilters({
      search: "",
      selectedCategory: null,
      priceRange: [0, maxPrice],
      duration: null,
    });
    setPriceRange([0, maxPrice]);
    router.push("/explore");
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 -mt-8 relative z-10">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search destinations, tours, or categories..."
            className="pl-12 text-gray-900 h-14 text-lg"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
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

      {showFilters && (
        <div className="mt-6 p-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
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

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <Slider
                min={0}
                max={maxPrice}
                step={10}
                value={priceRange}
                // onValueChange={setPriceRange}
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

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select
                defaultValue="relevance"
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
                  className={`cursor-pointer ${
                    filters.selectedCategory === category
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
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
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-blue-100"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, selectedCategory: null }))
                }
              >
                Clear
              </Badge>
            </div>
          </div>

          {/* Reset Filters */}
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={handleClearFilters}>
              Clear all filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
