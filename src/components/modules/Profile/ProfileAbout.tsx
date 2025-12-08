import { UserProfile } from "@/types/profile";
import { Mail, Phone, Globe, Shield, CheckCircle } from "lucide-react";

interface ProfileAboutProps {
  user: UserProfile;
  isOwnProfile: boolean;
}

export default function ProfileAbout({
  user,
  isOwnProfile,
}: ProfileAboutProps) {
  const isGuide = user.role === "GUIDE";

  return (
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

      {/* Right Column */}
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
      </div>
    </div>
  );
}
