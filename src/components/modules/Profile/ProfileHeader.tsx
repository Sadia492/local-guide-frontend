"use client";

import {
  User,
  MapPin,
  Globe,
  Calendar,
  Shield,
  Compass,
  Award,
  MessageSquare,
  Star,
} from "lucide-react";
import { EditUserDialog } from "@/components/modules/Admin/User/EditUserDialogue";
import { UserProfile } from "@/types/profile";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  user: UserProfile;
  stats: {
    toursGiven: number;
    averageRating: number;
    totalReviews: number;
    totalBookings: number;
    completedTours: number;
  };
  listingsCount: number;
  isOwnProfile: boolean;
  isGuide: boolean;
  isTourist: boolean;
}

export default function ProfileHeader({
  user,
  stats,
  listingsCount,
  isOwnProfile,
  isGuide,
  isTourist,
}: ProfileHeaderProps) {
  const router = useRouter();
  const memberSince = new Date(user.createdAt).getFullYear();

  const handleSuccess = () => {
    router.refresh();
  };

  return (
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
                <EditUserDialog userId={user._id} onSuccess={handleSuccess} />
              ) : (
                <>
                  {!isGuide && (
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
                    {listingsCount}
                  </div>
                  <div className="text-sm text-gray-600">Active Tours</div>
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
                    {stats.toursGiven}
                  </div>
                  <div className="text-sm text-gray-600">Tours Given</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ${user.dailyRate || 0}
                  </div>
                  <div className="text-sm text-gray-600">Daily Rate</div>
                </div>
              </>
            ) : user.role === "ADMIN" ? (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">Admin</div>
                  <div className="text-sm text-gray-600">Role</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {memberSince}
                  </div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">System</div>
                  <div className="text-sm text-gray-600">Access Level</div>
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
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalReviews}
                  </div>
                  <div className="text-sm text-gray-600">Reviews Written</div>
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
  );
}
