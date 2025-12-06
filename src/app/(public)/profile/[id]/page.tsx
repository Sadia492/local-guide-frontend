// app/profile/[id]/page.tsx - Updated with correct API endpoint
"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Globe,
  Star,
  Calendar,
  Users,
  DollarSign,
  Award,
  Mail,
  Phone,
  MessageSquare,
  Edit,
  Shield,
  Clock,
  TrendingUp,
  Heart,
  BookOpen,
  CheckCircle,
  ExternalLink,
  Loader2,
  Briefcase,
  Map,
  Trophy,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: "TOURIST" | "GUIDE" | "ADMIN";
  bio?: string;
  location?: string;
  languages?: string[];
  expertise?: string[];
  dailyRate?: number;
  travelPreferences?: string[];
  isVerified?: boolean;
  isActive?: boolean;
  createdAt: string;
}

interface Listing {
  _id: string;
  title: string;
  city: string;
  fee: number;
  duration: number;
  images: string[];
  description: string;
  meetingPoint: string;
  maxGroupSize: number;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  // For guide reviews
  user?: {
    name: string;
    profilePicture?: string;
  };
  // For tourist reviews
  guide?: {
    name: string;
    profilePicture?: string;
  };
}

interface ProfileData {
  user: UserProfile;
  listings?: Listing[];
  reviews: Review[];
  stats?: {
    toursGiven?: number;
    averageRating?: number;
    totalReviews?: number;
    totalBookings?: number;
    completedTours?: number;
  };
}

const ProfilePage = () => {
  const params = useParams();
  const userId = params.id as string;
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // CORRECTED: Fetch from the right endpoint
        const response = await fetch(
          `http://localhost:5000/api/user/profile-details`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log(data);
        console.log("Profile data:", data);

        // Check if data structure matches your API response
        if (data.data) {
          setProfileData(data.data);
        } else {
          // Fallback if API returns different structure
          setProfileData(data);
        }

        // Check if this is the logged-in user's own profile
        try {
          const authResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
            { credentials: "include" }
          );

          if (authResponse.ok) {
            const authData = await authResponse.json();
            setIsOwnProfile(authData.data?._id === userId);
          }
        } catch (authError) {
          console.log("Could not fetch auth data, continuing...");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profileData?.user) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Profile Not Found
        </h2>
        <p className="text-gray-600">
          The user profile you're looking for doesn't exist.
        </p>
        <Link
          href="/explore"
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Explore Tours
        </Link>
      </div>
    );
  }

  const { user, listings = [], reviews = [] } = profileData;
  const isGuide = user.role === "GUIDE";
  const isTourist = user.role === "TOURIST";
  const memberSince = new Date(user.createdAt).getFullYear();

  // Calculate stats from the data we have
  const stats = {
    toursGiven: reviews.length, // For guides, this could be number of reviews
    averageRating:
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0,
    totalReviews: reviews.length,
    totalBookings: 0, // You'll need to fetch this from bookings endpoint
    completedTours: 0, // You'll need to fetch this from bookings endpoint
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Cover - Different colors for different roles */}
        <div
          className={`h-64 ${
            isGuide
              ? "bg-gradient-to-r from-green-600 to-emerald-600"
              : user.role === "ADMIN"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600"
              : "bg-gradient-to-r from-blue-600 to-purple-600"
          }`}
        ></div>

        {/* Profile Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Info */}
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${
                          isGuide
                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                            : user.role === "ADMIN"
                            ? "bg-gradient-to-r from-purple-400 to-indigo-500"
                            : "bg-gradient-to-r from-blue-400 to-purple-500"
                        }`}
                      >
                        <User className="w-20 h-20 text-white" />
                      </div>
                    )}
                  </div>
                  {user.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full">
                      <Shield className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {user.name}
                        </h1>
                        {isGuide ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            <Award className="inline w-4 h-4 mr-1" />
                            Local Guide
                          </span>
                        ) : user.role === "ADMIN" ? (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            <Shield className="inline w-4 h-4 mr-1" />
                            Administrator
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            <Compass className="inline w-4 h-4 mr-1" />
                            Traveler
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{user.email}</p>
                    </div>

                    <div className="flex gap-3">
                      {isOwnProfile ? (
                        <Link
                          href="/dashboard/profile/edit"
                          className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Profile
                        </Link>
                      ) : (
                        <>
                          {isGuide && (
                            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Book a Tour
                            </button>
                          )}
                          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Message
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stats - Role Specific */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {isGuide ? (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {listings?.length || 0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Active Tours
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className="text-2xl font-bold text-gray-900">
                              {stats.averageRating.toFixed(1)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {stats.totalReviews} Reviews
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {reviews.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            Tours Given
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            ${user.dailyRate || 0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Daily Rate
                          </div>
                        </div>
                      </>
                    ) : user.role === "ADMIN" ? (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            Admin
                          </div>
                          <div className="text-sm text-gray-600">Role</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {memberSince}
                          </div>
                          <div className="text-sm text-gray-600">
                            Member Since
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            System
                          </div>
                          <div className="text-sm text-gray-600">
                            Access Level
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {user.isVerified ? "Yes" : "No"}
                          </div>
                          <div className="text-sm text-gray-600">Verified</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {memberSince}
                          </div>
                          <div className="text-sm text-gray-600">
                            Member Since
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {reviews.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            Reviews Written
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            Traveler
                          </div>
                          <div className="text-sm text-gray-600">Status</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {user.isActive ? "Active" : "Inactive"}
                          </div>
                          <div className="text-sm text-gray-600">Account</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    {user.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {user.location}
                      </div>
                    )}
                    {user.languages && user.languages.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-4 h-4" />
                        Speaks: {user.languages.join(", ")}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Member since {memberSince}
                    </div>
                  </div>

                  {/* Role-specific sections */}
                  {isGuide && user.expertise && user.expertise.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Areas of Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.expertise.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {isTourist &&
                    user.travelPreferences &&
                    user.travelPreferences.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Travel Interests
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user.travelPreferences.map((interest) => (
                            <span
                              key={interest}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Tabs - Role Specific */}
            <div className="border-t border-gray-200">
              <nav className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "about"
                      ? isGuide
                        ? "border-green-600 text-green-600"
                        : user.role === "ADMIN"
                        ? "border-purple-600 text-purple-600"
                        : "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  About
                </button>

                {isGuide && (
                  <>
                    <button
                      onClick={() => setActiveTab("tours")}
                      className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === "tours"
                          ? "border-green-600 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Tours ({listings?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === "reviews"
                          ? "border-green-600 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Reviews ({reviews.length})
                    </button>
                  </>
                )}

                {isTourist && (
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === "reviews"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Reviews Written ({reviews.length})
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* About Tab - Same for both roles */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Bio */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700">
                    {user.bio ||
                      `No biography provided yet. ${
                        isGuide
                          ? "This guide loves sharing local knowledge and creating memorable experiences for travelers."
                          : user.role === "ADMIN"
                          ? "This administrator manages the platform and ensures smooth operations."
                          : "This traveler loves exploring new places and experiencing different cultures."
                      }`}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="text-gray-900">{user.email}</div>
                    </div>
                  </div>
                  {isOwnProfile && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="text-gray-900">+1 (555) 123-4567</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Role Specific */}
            <div>
              {/* Languages */}
              {user.languages && user.languages.length > 0 && (
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Languages Spoken
                  </h3>
                  <div className="space-y-2">
                    {user.languages.map((language) => (
                      <div
                        key={language}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-700">{language}</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Status */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verification Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email Verified</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  {isGuide && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Guide Verified</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              {isOwnProfile && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/dashboard/profile/edit"
                      className="block px-4 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      Edit Profile
                    </Link>
                    {isGuide && (
                      <Link
                        href="/dashboard/listings/create"
                        className="block px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                      >
                        Create New Tour
                      </Link>
                    )}
                    {isTourist && (
                      <Link
                        href="/explore"
                        className="block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        Explore Tours
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tours Tab - Only for Guides */}
        {activeTab === "tours" && isGuide && (
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Available Tours ({listings?.length || 0})
                </h2>
                {isOwnProfile && (
                  <Link
                    href="/dashboard/listings/create"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Create New Tour
                  </Link>
                )}
              </div>
            </div>

            {listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {listings.map((listing) => (
                  <div
                    key={listing._id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      {listing.images?.[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-500">
                          <BookOpen className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-3 h-3" />
                        {listing.city}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                          <span className="font-bold text-gray-900">
                            {listing.fee}
                          </span>
                          <span className="text-sm text-gray-600 ml-1">
                            per person
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">
                            {listing.duration}h
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/tours/${listing._id}`}
                        className="mt-4 block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors"
                      >
                        View Tour
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tours available yet
                </h3>
                <p className="text-gray-600 mb-6">
                  {isOwnProfile
                    ? "Start creating your first tour to showcase your expertise!"
                    : "This guide hasn't created any tours yet."}
                </p>
                {isOwnProfile && (
                  <Link
                    href="/dashboard/listings/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    Create Your First Tour
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab - Different for Guide vs Tourist */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {isGuide ? "Reviews & Ratings" : "Reviews Written"}
                  </h2>
                  <div className="flex items-center gap-2">
                    {isGuide && stats.averageRating ? (
                      <>
                        <span className="text-2xl font-bold text-gray-900">
                          {stats.averageRating.toFixed(1)}
                        </span>
                        <span className="text-gray-600">
                          ({reviews.length} reviews)
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-600">
                        {reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"} written
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {reviews.map((review) => (
                  <div key={review._id} className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          isGuide
                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                            : "bg-gradient-to-r from-blue-400 to-purple-500"
                        }`}
                      >
                        {isGuide
                          ? review.user?.name?.charAt(0) || "T"
                          : review.guide?.name?.charAt(0) || "G"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {isGuide
                                ? review.user?.name || "Traveler"
                                : review.guide?.name || "Guide"}
                            </h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-500 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isGuide ? "No reviews yet" : "No reviews written yet"}
                </h3>
                <p className="text-gray-600">
                  {isOwnProfile
                    ? isGuide
                      ? "Start giving tours to receive reviews!"
                      : "Book and complete tours to write reviews!"
                    : isGuide
                    ? "Be the first to review this guide!"
                    : "This traveler hasn't written any reviews yet."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
