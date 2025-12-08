"use client";

import { ChevronLeft, Heart, Share2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/actions/useAuth";
import { useWishlist } from "@/actions/useWishlist";

interface ListingActionsProps {
  listingId: string;
}

export default function ListingActions({ listingId }: ListingActionsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { isInWishlist, wishlistLoading, toggleWishlist } =
    useWishlist(listingId);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: "Check out this amazing tour",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleWishlistClick = () => {
    if (!user) {
      toast.error("Please login to add to wishlist", {
        description: "You need to be logged in to save tours",
        action: {
          label: "Login",
          onClick: () => router.push(`/login?redirect=/tours/${listingId}`),
        },
      });
      return;
    }
    toggleWishlist();
  };

  return (
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
              onClick={handleWishlistClick}
              disabled={wishlistLoading}
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
                    className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`}
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
  );
}
