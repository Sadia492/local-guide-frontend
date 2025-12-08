import { Listing } from "@/types/explore";
import { MapPin, DollarSign, Clock, BookOpen, Edit } from "lucide-react";
import Link from "next/link";

// Update props interface:
interface ProfileToursProps {
  listings: {
    _id: string;
    title: string;
    city: string;
    fee: number;
    duration: number;
    images: string[];
    description: string;
    meetingPoint: string;
    maxGroupSize: number;
  }[];
  isOwnProfile: boolean;
}

export default function ProfileTours({
  listings,
  isOwnProfile,
}: ProfileToursProps) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            Available Tours ({listings.length})
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

      {listings.length > 0 ? (
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
  );
}
