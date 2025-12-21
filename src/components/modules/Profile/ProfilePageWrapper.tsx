"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ProfileHeader from "@/components/modules/Profile/ProfileHeader";
import ProfileTabs from "@/components/modules/Profile/ProfileTabs";
import ProfileAbout from "@/components/modules/Profile/ProfileAbout";
import ProfileTours from "@/components/modules/Profile/ProfileTours";
import ProfileReviews from "@/components/modules/Profile/ProfileReviews";
import {
  UserProfile,
  Listing,
  Review,
  Stats,
} from "@/services/user/user.service";
import { useAuth } from "@/actions/useAuth";

interface ProfileData {
  user: UserProfile;
  listings: Listing[];
  reviews: Review[];
  stats: Stats;
}

export default function ProfilePageWrapper() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params.id as string;
  const activeTab = searchParams.get("tab") || "about";
  const { user: mainUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetchProfileData();
    fetchCurrentUser();
    if (!mainUser) {
      router.push("/login");
    }
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile-details/${userId}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        }
        if (response.status === 401) {
          throw new Error("Authentication required to view profile");
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data) {
        throw new Error("Invalid response format");
      }

      setProfileData(data.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setCurrentUser(data.data || null);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      // Don't set error here, just continue without current user
    }
  };

  const refreshData = () => {
    fetchProfileData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative">
          <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto md:mx-0"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-300 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-64"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-96 bg-white rounded-xl shadow p-8">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    const isAuthError =
      error?.includes("Authentication") ||
      error?.includes("auth") ||
      error?.includes("401");

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12 max-w-md">
          <div className="w-16 h-16 mx-auto text-gray-400 mb-4">
            {isAuthError ? "🔒" : "⚠️"}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isAuthError ? "Profile Access Restricted" : "Profile Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The profile you're looking for doesn't exist."}
          </p>
          <div className="space-x-4">
            <a
              href="/explore"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Tours
            </a>
            {isAuthError && (
              <a
                href="/login"
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Login to View
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  const { user, listings = [], reviews = [], stats } = profileData;
  const isGuide = user.role === "GUIDE";
  const isTourist = user.role === "TOURIST";
  const isOwnProfile = currentUser?._id === userId;
  console.log(currentUser?._id);

  const profileStats = {
    toursGiven: stats?.completedBookings || 0,
    averageRating: stats?.averageRating || 0,
    totalReviews: stats?.totalReviews || reviews.length,
    totalBookings: stats?.totalBookings || 0,
    completedTours: stats?.completedBookings || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Cover */}
        <div
          className={`h-64 ${
            isGuide
              ? "bg-gradient-to-r from-green-600 to-emerald-600"
              : user.role === "ADMIN"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600"
              : "bg-gradient-to-r from-blue-600 to-purple-600"
          }`}
        ></div>

        {/* Profile Header Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header Component */}
            <ProfileHeader
              user={user}
              stats={profileStats}
              listingsCount={listings.length}
              isOwnProfile={isOwnProfile}
              isGuide={isGuide}
              isTourist={isTourist}
              onRefresh={refreshData}
            />

            {/* Tabs Component - Now inside the same card */}
            <ProfileTabs
              activeTab={activeTab}
              isGuide={isGuide}
              isTourist={isTourist}
              listingsCount={listings.length}
              reviewsCount={reviews.length}
            />
          </div>
        </div>
      </div>

      {/* Tab Content - Separate container for the content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "about" && (
          <ProfileAbout user={user} isOwnProfile={isOwnProfile} />
        )}

        {activeTab === "tours" && isGuide && (
          <ProfileTours listings={listings} isOwnProfile={isOwnProfile} />
        )}

        {activeTab === "reviews" && (
          <ProfileReviews
            reviews={reviews}
            stats={profileStats}
            isGuide={isGuide}
            isOwnProfile={isOwnProfile}
          />
        )}
      </div>
    </div>
  );
}
