// app/dashboard/listings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  User,
} from "lucide-react";
import { useAuth } from "@/actions/useAuth";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { EditListingDialog } from "@/components/modules/Admin/Listing/EditListingDialogue";

interface Listing {
  _id: string;
  title: string;
  guide: string | { _id: string; name: string; profilePic?: string };
  city: string;
  fee: number;
  rating?: number;
  duration: number;
  maxGroupSize: number;
  images: string[];
  category: string;
  isActive: boolean;
  description?: string;
  meetingPoint?: string;
  language: string;
  itinerary: string;
  createdAt: string;
  updatedAt: string;
}

const ListingManagement = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [guideFilter, setGuideFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch listings
  // Replace the fetchListings useEffect with a reusable function
  const fetchListings = async () => {
    try {
      setLoading(true);
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
      setListings(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch listings");
      console.error("Error fetching listings:", err);
      toast.error("Failed to load listings", {
        description:
          err instanceof Error ? err.message : "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  // Then use it in useEffect
  useEffect(() => {
    fetchListings();
  }, []);

  // Filter and search logic
  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      searchTerm === "" ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof listing.guide === "object" &&
        listing.guide.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && listing.isActive) ||
      (statusFilter === "inactive" && !listing.isActive);

    const matchesCategory =
      categoryFilter === "all" || listing.category === categoryFilter;

    const matchesGuide =
      guideFilter === "all" ||
      (typeof listing.guide === "object" && listing.guide._id === guideFilter);

    return matchesSearch && matchesStatus && matchesCategory && matchesGuide;
  });

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedListings = filteredListings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Action handlers
  const handleDeleteListing = async (id: string) => {
    const listingToDelete = listings.find((listing) => listing._id === id);

    // Use SweetAlert for confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${listingToDelete?.title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/listing/${id}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Failed to delete listing");
          }

          return response;
        } catch (error) {
          Swal.showValidationMessage(
            `Error: ${
              error instanceof Error
                ? error.message
                : "Failed to delete listing"
            }`
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      // Update state after successful deletion
      setListings(listings.filter((listing) => listing._id !== id));

      // Show success toast
      toast.success("Listing deleted successfully", {
        description: `"${listingToDelete?.title}" has been permanently deleted.`,
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const listing = listings.find((listing) => listing._id === id);
    const action = currentStatus ? "deactivate" : "activate";
    const actionText = currentStatus ? "deactivated" : "activated";

    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Listing`,
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-2">Are you sure you want to ${action} this listing?</p>
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
            <p class="font-medium">${listing?.title}</p>
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
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/listing/${id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                isActive: !currentStatus,
              }),
            }
          );

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Failed to update listing status");
          }

          return response;
        } catch (error) {
          Swal.showValidationMessage(
            `Error: ${
              error instanceof Error
                ? error.message
                : "Failed to update listing status"
            }`
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      setListings(
        listings.map((listing) =>
          listing._id === id
            ? { ...listing, isActive: !currentStatus }
            : listing
        )
      );

      // Show success toast
      toast.success(`Listing ${actionText}`, {
        description: `"${listing?.title}" has been ${actionText} successfully.`,
      });
    }
  };

  const getGuideName = (
    guide: string | { _id: string; name: string; profilePic?: string }
  ) => {
    if (typeof guide === "object") {
      return guide.name;
    }
    return "Unknown Guide";
  };

  const getGuideId = (
    guide: string | { _id: string; name: string; profilePic?: string }
  ) => {
    if (typeof guide === "object") {
      return guide._id;
    }
    return guide;
  };

  // Get unique categories for filter
  const categories = Array.from(
    new Set(listings.map((listing) => listing.category))
  );

  // Get unique guides for filter
  const guides = Array.from(
    new Set(
      listings
        .map((listing) => {
          if (typeof listing.guide === "object") {
            return { id: listing.guide._id, name: listing.guide.name };
          }
          return { id: listing.guide, name: "Unknown Guide" };
        })
        .filter(
          (guide, index, self) =>
            index === self.findIndex((g) => g.id === guide.id)
        )
    )
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Listings
        </h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => {
            toast.promise(fetchListings(), {
              loading: "Reloading listings...",
              success: "Listings reloaded successfully",
              error: "Failed to reload listings",
            });
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Total Listings
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {listings.length}
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
                  {listings.filter((l) => l.isActive).length}
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
                  {listings.filter((l) => !l.isActive).length}
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
                  {guides.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
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
                        {listing.rating && (
                          <div>
                            <div className="text-sm text-gray-500">Rating</div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-gray-900">
                                {listing.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        )}
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

                          {/* Edit Button - Fixed */}
                          {/* Edit Button */}
                          <EditListingDialog
                            listingId={listing._id}
                            onSuccess={fetchListings}
                          />

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
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
        {filteredListings.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredListings.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredListings.length}</span>{" "}
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
            ${listings.reduce((sum, l) => sum + l.fee, 0)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Average Price</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            $
            {listings.length > 0
              ? Math.round(
                  listings.reduce((sum, l) => sum + l.fee, 0) / listings.length
                )
              : 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Total Images</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {listings.reduce((sum, l) => sum + l.images.length, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingManagement;
