import { MapPin, Clock, Users, Globe, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Listing, UserData } from "@/types/explore";
import LoginRedirectButtons from "./LoginRedirectButtons";

interface TourCardProps {
  tour: Listing;
  isAuthenticated: boolean;
  currentUser: UserData | null;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Adventure: "bg-green-100 text-green-800 hover:bg-green-200",
    Food: "bg-red-100 text-red-800 hover:bg-red-200",
    History: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    Art: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    Nightlife: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    Shopping: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    Nature: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    Photography: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Cultural: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  };
  return colors[category] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

export default function TourCard({
  tour,
  isAuthenticated,
  currentUser,
}: TourCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {tour.images && tour.images.length > 0 ? (
          <img
            src={tour.images[0]}
            alt={tour.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <MapPin className="w-12 h-12 text-white/50" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge className={`${getCategoryColor(tour.category)}`}>
            {tour.category}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            ${tour.fee} / person
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1 p-6 flex flex-col">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2">
            {tour.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{tour.city}</span>
          </div>
          <p className="text-gray-600 line-clamp-2 text-sm">
            {tour.description}
          </p>
        </div>

        {/* Guide Info */}
        <div className="flex items-center mb-6">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              tour.guide.profilePicture
                ? ""
                : "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
            }`}
          >
            {tour.guide.profilePicture ? (
              <img
                src={tour.guide.profilePicture}
                alt={tour.guide.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{tour.guide.name}</p>
            <Link
              href={`/profile/${tour.guide._id}`}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              View Profile
            </Link>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{tour.duration} hours</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>Max {tour.maxGroupSize} people</span>
          </div>
          {tour.language && (
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              <span>{tour.language}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <LoginRedirectButtons
          tourId={tour._id}
          isAuthenticated={isAuthenticated}
          userRole={currentUser?.role}
        />
      </CardContent>
    </Card>
  );
}
