"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  User,
  Plus,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { EditListingDialog } from "@/components/modules/Admin/Listing/EditListingDialogue";
import { useListingActions } from "@/actions/listingActions";
import { getGuideName } from "@/lib/listingUtils";
import { Listing } from "@/types/listing";
import debounce from "lodash/debounce"; // Install: npm install lodash

interface ListingManagementClientProps {
  // Server-provided data
  listings: Listing[];
  filteredListings: Listing[];
  categories: string[];
  guides: Array<{ id: string; name: string }>;

  // Server-calculated stats
  totalListings: number;
  activeListings: number;
  inactiveListings: number;
  totalGuides: number;
  totalRevenuePotential: number;
  averagePrice: number;
  totalImages: number;

  // Initial state
  initialSearchTerm: string;
  initialStatusFilter: string;
  initialCategoryFilter: string;
  initialGuideFilter: string;
  initialCurrentPage: number;
}

const ITEMS_PER_PAGE = 10;

export default function ListingManagementClient({
  listings,
  filteredListings: serverFilteredListings,
  categories,
  guides,
  totalListings,
  activeListings,
  inactiveListings,
  totalGuides,
  totalRevenuePotential,
  averagePrice,
  totalImages,
  initialSearchTerm,
  initialStatusFilter,
  initialCategoryFilter,
  initialGuideFilter,
  initialCurrentPage,
}: ListingManagementClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { deleteListing, toggleListingStatus } = useListingActions();

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [guideFilter, setGuideFilter] = useState(initialGuideFilter);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);

  // Debounced function to update URL
  const updateURL = useCallback(
    debounce(
      (filters: {
        search: string;
        status: string;
        category: string;
        guide: string;
      }) => {
        const params = new URLSearchParams();

        if (filters.search) params.set("search", filters.search);
        if (filters.status !== "all") params.set("status", filters.status);
        if (filters.category !== "all")
          params.set("category", filters.category);
        if (filters.guide !== "all") params.set("guide", filters.guide);

        router.push(`/dashboard/admin/listings?${params.toString()}`, {
          scroll: false,
        });
      },
      500
    ), // 500ms delay
    [router]
  );

  // Handle filter changes with instant URL update
  useEffect(() => {
    updateURL({
      search: searchTerm,
      status: statusFilter,
      category: categoryFilter,
      guide: guideFilter,
    });
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, categoryFilter, guideFilter, updateURL]);

  // Client-side filtering for instant feedback
  const locallyFilteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof listing.guide === "object" &&
          listing.guide.name.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && listing.isActive) ||
        (statusFilter === "inactive" && !listing.isActive);

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || listing.category === categoryFilter;

      // Guide filter
      const matchesGuide =
        guideFilter === "all" ||
        (typeof listing.guide === "object"
          ? listing.guide._id === guideFilter
          : listing.guide === guideFilter);

      return matchesSearch && matchesStatus && matchesCategory && matchesGuide;
    });
  }, [listings, searchTerm, statusFilter, categoryFilter, guideFilter]);

  // Use locally filtered listings for instant feedback
  const displayListings = locallyFilteredListings;

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedListings = displayListings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(displayListings.length / ITEMS_PER_PAGE);

  // Handlers for delete and toggle status (same as before)
  const handleDelete = async (id: string) => {
    const listingToDelete = listings.find((listing) => listing._id === id);
    const title = listingToDelete?.title;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const success = await deleteListing(id, title);
      if (success) {
        router.refresh();
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const listing = listings.find((listing) => listing._id === id);
    const title = listing?.title;

    const result = await Swal.fire({
      title: `${currentStatus ? "Deactivate" : "Activate"} Listing`,
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-2">Are you sure you want to ${
            currentStatus ? "deactivate" : "activate"
          } this listing?</p>
          <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">
                  ${
                    currentStatus
                      ? "Deactivated listings will not be visible to tourists."
                      : "Activated listings will be visible to tourists."
                  }
                </h3>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <p class="font-medium">${title}</p>
            <p class="text-sm text-gray-600">by ${getGuideName(
              listing?.guide || ""
            )}</p>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${
        currentStatus ? "deactivate" : "activate"
      } it!`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const success = await toggleListingStatus(id, currentStatus, title);
      if (success) {
        router.refresh();
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between align-middle">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Listing Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all tour listings on the platform
              </p>
            </div>
          </div>
          <div>
            <Link
              href="/dashboard/admin/listings/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Listing
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Total Listings
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalListings}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Active</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {activeListings}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 p-5 rounded-xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Inactive</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {inactiveListings}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">
                  Total Guides
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalGuides}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar - REMOVED Apply Filters Button */}
      <div className="bg-white rounded-xl shadow border p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, city, category, or guide..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={guideFilter}
              onChange={(e) => setGuideFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Guides</option>
              {guides.map((guide) => (
                <option key={guide.id} value={guide.id}>
                  {guide.name}
                </option>
              ))}
            </select>

            {/* Clear Filters Button (Optional) */}
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setGuideFilter("all");
                setCurrentPage(1);
              }}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Listing & Guide
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Location & Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Pricing & Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status & Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedListings.length > 0 ? (
                paginatedListings.map((listing) => (
                  <tr
                    key={listing._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Listing & Guide Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          {listing.images && listing.images.length > 0 ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-white/70" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {listing.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {getGuideName(listing.guide)}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              {listing.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location & Details Column */}
                    <td className="px-6 py-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-700">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="font-medium">{listing.city}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="font-medium mb-1">Meeting Point:</div>
                          <div className="line-clamp-2">
                            {listing.meetingPoint}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="font-medium mb-1">Group Size:</div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Max {listing.maxGroupSize}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Pricing & Duration Column */}
                    <td className="px-6 py-4">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-500">
                            Price per person
                          </div>
                          <div className="flex items-center text-lg font-bold text-gray-900">
                            <DollarSign className="w-5 h-5" />
                            {listing.fee}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Duration</div>
                          <div className="flex items-center text-gray-900">
                            <Clock className="w-4 h-4 mr-2" />
                            {listing.duration} hours
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Language</div>
                          <div className="text-gray-900">
                            {listing.language}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status & Actions Column */}
                    <td className="px-6 py-4">
                      <div className="space-y-4">
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                              listing.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {listing.isActive ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Inactive
                              </>
                            )}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={() =>
                              handleToggleStatus(listing._id, listing.isActive)
                            }
                            className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                              listing.isActive
                                ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                            }`}
                          >
                            {listing.isActive
                              ? "Deactivate Listing"
                              : "Activate Listing"}
                          </button>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Link
                            href={`/dashboard/admin/listings/${listing._id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-1 text-center"
                            title="View"
                          >
                            <Eye className="w-4 h-4 mx-auto" />
                            <span className="text-xs mt-1">View</span>
                          </Link>

                          <EditListingDialog
                            listingId={listing._id}
                            onSuccess={() => router.refresh()}
                          />

                          <button
                            onClick={() => handleDelete(listing._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-1 text-center"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                            <span className="text-xs mt-1">Delete</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No listings found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        categoryFilter !== "all" ||
                        guideFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "No listings have been created yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {displayListings.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(
                    startIndex + ITEMS_PER_PAGE,
                    displayListings.length
                  )}
                </span>{" "}
                of <span className="font-medium">{displayListings.length}</span>{" "}
                results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Total Revenue Potential</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            ${totalRevenuePotential}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Average Price</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            ${averagePrice}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Total Images</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {totalImages}
          </div>
        </div>
      </div>
    </div>
  );
}
