import {
  MapPin,
  User,
  CheckCircle,
  Shield,
  Compass,
  Utensils,
  BookOpen,
  Mountain,
  Music,
  ShoppingBag,
  Palette,
  Building,
} from "lucide-react";

interface ListingHeaderProps {
  title: string;
  city: string;
  guideName: string;
  category: string;
  isActive: boolean;
}

export default function ListingHeader({
  title,
  city,
  guideName,
  category,
  isActive,
}: ListingHeaderProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "food":
        return <Utensils className="w-5 h-5" />;
      case "history":
        return <BookOpen className="w-5 h-5" />;
      case "adventure":
        return <Mountain className="w-5 h-5" />;
      case "nightlife":
        return <Music className="w-5 h-5" />;
      case "shopping":
        return <ShoppingBag className="w-5 h-5" />;
      case "art":
        return <Palette className="w-5 h-5" />;
      case "culture":
        return <Building className="w-5 h-5" />;
      default:
        return <Compass className="w-5 h-5" />;
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {getCategoryIcon(category)}
              {category}
            </span>
            {isActive ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                Unavailable
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="font-medium">{city}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-5 h-5 text-blue-500" />
              <span>by {guideName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
