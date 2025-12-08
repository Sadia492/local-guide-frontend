"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  Search,
  Image as ImageIcon,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  Calendar,
  Plus,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { EditListingDialog } from "@/components/modules/Admin/Listing/EditListingDialogue";
import { listingService } from "@/services/listing/guideListing.service";
import { Listing } from "@/services/listing/guideListing.service";
import debounce from "lodash/debounce";
import { formatDate } from "@/lib/listingUtils2";

interface MyListingsClientProps {
  listings: Listing[];
  filteredListings: Listing[];
  stats: {
    totalListings: number;
    activeListings: number;
    inactiveListings: number;
    totalRevenue: number;
  };
  categories: string[];
  initialSearchTerm: string;
  initialStatusFilter: string;
  initialCategoryFilter: string;
  initialCurrentPage: number;
}

const ITEMS_PER_PAGE = 8;

// Helper function for safe parameter extraction
function safeParam(value: any, fallback: string) {
  if (Array.isArray(value)) return value[0] || fallback;
  if (typeof value === "string") return value;
  return fallback;
}

export default function MyListingsClient({
  listings: serverListings,
  filteredListings: serverFilteredListings,
  stats,
  categories,
  initialSearchTerm,
  initialStatusFilter,
  initialCategoryFilter,
  initialCurrentPage,
}: MyListingsClientProps) {
  const router = useRouter();
  const [listings, setListings] = useState(serverListings);

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);

  // Debounced function to update URL
  const updateURL = useCallback(
    debounce(
      (filters: { search: string; status: string; category: string }) => {
        const params = new URLSearchParams();

        if (filters.search) params.set("search", filters.search);
        if (filters.status !== "all") params.set("status", filters.status);
        if (filters.category !== "all")
          params.set("category", filters.category);
        if (currentPage > 1) params.set("page", currentPage.toString());

        router.push(`/dashboard/guide/my-listings?${params.toString()}`, {
          scroll: false,
        });
      },
      500
    ),
    [router, currentPage]
  );

  // Handle filter changes with instant URL update
  useEffect(() => {
    updateURL({
      search: searchTerm,
      status: statusFilter,
      category: categoryFilter,
    });
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, categoryFilter, updateURL]);

  // Client-side filtering for instant feedback
  const locallyFilteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesSearch =
        !searchTerm ||
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && listing.isActive) ||
        (statusFilter === "inactive" && !listing.isActive);

      const matchesCategory =
        categoryFilter === "all" || listing.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [listings, searchTerm, statusFilter, categoryFilter]);

  // Use locally filtered listings for instant feedback
  const displayListings = locallyFilteredListings;

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedListings = displayListings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(displayListings.length / ITEMS_PER_PAGE);

  // Handlers
  const handleDeleteListing = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Delete Listing",
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-2">Are you sure you want to delete this listing?</p>
          <div class="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
            <p class="text-sm text-red-700">
              <strong>Warning:</strong> This action cannot be undone. All associated data will be permanently removed.
            </p>
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <p class="font-medium">${title}</p>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await listingService.deleteListing(id);

        // Update local state
        setListings((prev) => prev.filter((listing) => listing._id !== id));

        toast.success("Listing deleted successfully", {
          description: `"${title}" has been permanently deleted.`,
        });

        // Refresh server data
        router.refresh();
      } catch (error) {
        console.error("Error deleting listing:", error);
        toast.error("Failed to delete listing");
      }
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: boolean,
    title: string
  ) => {
    const action = currentStatus ? "deactivate" : "activate";

    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Listing`,
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-2">Are you sure you want to ${action} this listing?</p>
          <div class="${
            currentStatus
              ? "bg-yellow-50 border-l-4 border-yellow-500"
              : "bg-green-50 border-l-4 border-green-500"
          } p-3 mb-4">
            <p class="text-sm ${
              currentStatus ? "text-yellow-700" : "text-green-700"
            }">
              <strong>Note:</strong> ${
                currentStatus
                  ? "Deactivated listings will not be visible to tourists."
                  : "Activated listings will be visible to tourists."
              }
            </p>
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <p class="font-medium">${title}</p>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await listingService.updateListingStatus(id, !currentStatus);

        // Update local state
        setListings((prev) =>
          prev.map((listing) =>
            listing._id === id
              ? { ...listing, isActive: !currentStatus }
              : listing
          )
        );

        toast.success(`Listing ${action}d`, {
          description: `"${title}" has been ${action}d successfully.`,
        });

        // Refresh server data
        router.refresh();
      } catch (error) {
        console.error("Error updating listing status:", error);
        toast.error("Failed to update listing status");
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Tour Listings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all your tour listings and bookings
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.refresh()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4" />
              Refresh
            </button>
            <Link
              href="/dashboard/guide/my-listings/create"
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
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalListings}
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
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.activeListings}
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
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.inactiveListings}
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
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${stats.totalRevenue}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-xl shadow border p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your listings..."
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
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {paginatedListings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Listing Image */}
                <div className="relative h-48">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-white/70" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        listing.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {listing.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Listing Content */}
                <div className="p-5">
                  {/* Title and Category */}
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">
                      {listing.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {listing.category}
                      </span>
                      {listing.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">
                            {listing.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.city}</span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className="text-sm font-medium">
                          {listing.duration} hours
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-gray-500">Group Size</div>
                        <div className="text-sm font-medium">
                          Max {listing.maxGroupSize}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-gray-500">Price</div>
                        <div className="text-sm font-medium">
                          ${listing.fee}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-gray-500">Created</div>
                        <div className="text-sm font-medium">
                          {formatDate(listing.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {listing.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleToggleStatus(
                            listing._id,
                            listing.isActive,
                            listing.title
                          )
                        }
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                          listing.isActive
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {listing.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <Link
                        href={`/tours/${listing._id}`}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors text-center"
                      >
                        View
                      </Link>
                    </div>

                    <div className="flex gap-2 border-t pt-3">
                      <EditListingDialog
                        listingId={listing._id}
                        onSuccess={() => router.refresh()}
                      />

                      <button
                        onClick={() =>
                          handleDeleteListing(listing._id, listing.title)
                        }
                        className="flex-1 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-center"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                        <span className="text-xs mt-1">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {displayListings.length > ITEMS_PER_PAGE && (
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
                listings
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
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow border p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No listings found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your search or filters"
              : "You haven't created any tour listings yet"}
          </p>
          <Link
            href="/dashboard/guide/my-listings/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Listing
          </Link>
        </div>
      )}
    </div>
  );
}
