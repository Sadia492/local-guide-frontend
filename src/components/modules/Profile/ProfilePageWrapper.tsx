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
  const { user: mainUser, isLoading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 1. Check authentication FIRST
  useEffect(() => {
    if (authLoading) return; // Wait for auth check to complete

    if (!mainUser) {
      // Store intended URL for redirect after login
      sessionStorage.setItem("redirectUrl", window.location.pathname);
      router.push("/login");
      return;
    }
  }, [mainUser, authLoading, router]);

  // 2. Only fetch data if user is authenticated
  useEffect(() => {
    if (!mainUser || authLoading) return;

    fetchProfileData();
    fetchCurrentUser();
  }, [userId, mainUser, authLoading]);

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
          // Clear auth and redirect to login
          sessionStorage.setItem("redirectUrl", window.location.pathname);
          router.push("/login");
          return;
        }
        if (response.status === 403) {
          throw new Error("You don't have permission to view this profile");
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
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load profile";
      setError(errorMessage);
      setProfileData(null);

      // If it's an auth error, redirect to login
      if (
        errorMessage.includes("Authentication") ||
        errorMessage.includes("auth") ||
        errorMessage.includes("401") ||
        errorMessage.includes("403")
      ) {
        sessionStorage.setItem("redirectUrl", window.location.pathname);
        router.push("/login");
      }
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
      } else if (response.status === 401) {
        // Session expired, redirect to login
        sessionStorage.setItem("redirectUrl", window.location.pathname);
        router.push("/login");
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      // Don't redirect on network errors for current user fetch
    }
  };

  const refreshData = () => {
    if (mainUser) {
      fetchProfileData();
    }
  };

  // 1. Show auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // 2. Show not authenticated state
  if (!mainUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to view this profile
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                sessionStorage.setItem("redirectUrl", window.location.pathname);
                router.push("/login");
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login to Continue
            </button>
            <button
              onClick={() => router.push("/explore")}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Browse Tours First
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Show profile loading state
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
      error?.includes("401") ||
      error?.includes("403");

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12 max-w-md">
          <div className="w-16 h-16 mx-auto text-gray-400 mb-4">
            {isAuthError ? "🔒" : "⚠️"}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isAuthError ? "Access Restricted" : "Profile Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The profile you're looking for doesn't exist."}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/explore")}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Tours
            </button>
            {isAuthError && (
              <button
                onClick={() => {
                  sessionStorage.setItem(
                    "redirectUrl",
                    window.location.pathname
                  );
                  router.push("/login");
                }}
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Login to View
              </button>
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
