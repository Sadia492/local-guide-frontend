// app/dashboard/wishlist/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  MapPin,
  Clock,
  DollarSign,
  User,
  Calendar,
  ExternalLink,
  Loader2,
  Search,
  Filter,
  Trash2,
  AlertCircle,
  BookOpen,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/actions/useAuth";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface WishlistItem {
  _id: string;
  user: string;
  listing: {
    _id: string;
    title: string;
    city: string;
    fee: number;
    duration: number;
    meetingPoint: string;
    images: string[];
    guide: {
      _id: string;
      name: string;
      email: string;
      profilePicture?: string;
    };
  };
  addedAt: string;
}

const WishlistPage = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.status}`);
      }

      const data = await response.json();
      setWishlistItems(data.data || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      toast.error("Failed to load wishlist", {
        description:
          err instanceof Error ? err.message : "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "TOURIST") {
      fetchWishlist();
    }
  }, [user]);

  // Remove item from wishlist
  const removeFromWishlist = async (listingId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      // Update local state
      setWishlistItems((prev) =>
        prev.filter((item) => item.listing._id !== listingId)
      );
      // Remove from selected items if present
      setSelectedItems((prev) => prev.filter((id) => id !== listingId));

      toast.success("Removed from wishlist", {
        description: "Tour has been removed from your wishlist",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  // Remove multiple items
  const removeSelectedItems = async () => {
    if (selectedItems.length === 0) {
      toast.info("No items selected");
      return;
    }

    const result = await Swal.fire({
      title: "Remove Selected Tours",
      text: `Are you sure you want to remove ${selectedItems.length} tour(s) from your wishlist?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove them",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        // Remove each selected item
        const removePromises = selectedItems.map((listingId) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${listingId}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          )
        );

        await Promise.all(removePromises);

        // Update local state
        setWishlistItems((prev) =>
          prev.filter((item) => !selectedItems.includes(item.listing._id))
        );
        setSelectedItems([]);

        toast.success("Selected tours removed", {
          description: `${selectedItems.length} tour(s) have been removed from your wishlist`,
        });
      } catch (error) {
        console.error("Error removing selected items:", error);
        toast.error("Failed to remove selected tours");
      }
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    const result = await Swal.fire({
      title: "Clear Wishlist",
      text: "Are you sure you want to clear your entire wishlist? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, clear all",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to clear wishlist");
        }

        setWishlistItems([]);
        setSelectedItems([]);

        toast.success("Wishlist cleared", {
          description: "All tours have been removed from your wishlist",
        });
      } catch (error) {
        console.error("Error clearing wishlist:", error);
        toast.error("Failed to clear wishlist");
      }
    }
  };

  // Toggle item selection
  const toggleItemSelection = (listingId: string) => {
    setSelectedItems((prev) =>
      prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
    );
  };

  // Select all items
  const selectAllItems = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.listing._id));
    }
  };

  // Filter and sort items
  const filteredItems = wishlistItems
    .filter((item) => {
      return (
        searchTerm === "" ||
        item.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.listing.guide.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      } else if (sortBy === "price-low") {
        return a.listing.fee - b.listing.fee;
      } else if (sortBy === "price-high") {
        return b.listing.fee - a.listing.fee;
      } else if (sortBy === "duration") {
        return b.listing.duration - a.listing.duration;
      }
      return 0;
    });

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Calculate total price of selected items
  const totalSelectedPrice = filteredItems
    .filter((item) => selectedItems.includes(item.listing._id))
    .reduce((sum, item) => sum + item.listing.fee, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">
              Save tours you love and book them when you're ready
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchWishlist}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4" />
              Refresh
            </button>
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-5 rounded-xl border border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-700 font-medium">Saved Tours</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {wishlistItems.length}
                </p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  $
                  {wishlistItems.reduce(
                    (sum, item) => sum + item.listing.fee,
                    0
                  )}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">
                  Ready to Book
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {wishlistItems.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">
                  Newest Add
                </p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {wishlistItems.length > 0
                    ? formatDate(wishlistItems[0].addedAt)
                    : "None"}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your wishlist by tour, city, or guide..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="recent">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration: Longest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {wishlistItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  selectedItems.length > 0 &&
                  selectedItems.length === filteredItems.length
                }
                onChange={selectAllItems}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">
                {selectedItems.length > 0
                  ? `${selectedItems.length} tour(s) selected`
                  : "Select all tours"}
              </span>
              {selectedItems.length > 0 && (
                <span className="text-sm text-blue-700">
                  Total: ${totalSelectedPrice}
                </span>
              )}
            </div>

            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={removeSelectedItems}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Selected
                </button>
                <Link
                  href="/explore"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Book Selected
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isSelected = selectedItems.includes(item.listing._id);

            return (
              <div
                key={item._id}
                className={`bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition-all ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {/* Image with selection checkbox */}
                <div className="h-48 bg-gray-200 relative group">
                  {item.listing.images?.[0] ? (
                    <img
                      src={item.listing.images[0]}
                      alt={item.listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
                      <Heart className="w-12 h-12 text-white/50" />
                    </div>
                  )}

                  {/* Selection checkbox */}
                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItemSelection(item.listing._id)}
                      className="w-5 h-5 text-blue-600 rounded bg-white/90"
                    />
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromWishlist(item.listing._id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>

                  {/* Added date badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
                      Saved {formatDate(item.addedAt)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                    {item.listing.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {item.listing.city}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      {item.listing.duration} hours
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-3 h-3" />
                      {item.listing.guide.name}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-gray-900">
                      <DollarSign className="inline w-4 h-4 mr-1" />
                      {item.listing.fee}
                      <span className="text-sm font-normal text-gray-600 ml-1">
                        per person
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/tours/${item.listing._id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/tours/${item.listing._id}?book=true`}
                      className="flex-1 px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border p-12 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No matching tours found" : "Your wishlist is empty"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm
              ? "Try a different search term or clear your search to see all saved tours"
              : "Start building your dream travel list! Click the heart icon on any tour to save it here for later."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Explore Tours
            </Link>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tips Section */}
      {wishlistItems.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Wishlist Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Select multiple tours to compare or book together</li>
            <li>• Check tour availability before booking from your wishlist</li>
            <li>• Tours with limited availability are marked with a badge</li>
            <li>• Share your wishlist with friends for trip planning</li>
            <li>• Book directly from wishlist to get instant confirmation</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
