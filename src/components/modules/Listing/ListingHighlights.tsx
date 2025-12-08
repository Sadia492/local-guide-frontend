import { Clock, Users, Globe, Award } from "lucide-react";

interface ListingHighlightsProps {
  duration: number;
  maxGroupSize: number;
  language: string;
  category: string;
}

export default function ListingHighlights({
  duration,
  maxGroupSize,
  language,
  category,
}: ListingHighlightsProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Tour Highlights
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Duration</p>
          <p className="font-bold text-gray-900">{duration} hours</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Group Size</p>
          <p className="font-bold text-gray-900">Max {maxGroupSize}</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Language</p>
          <p className="font-bold text-gray-900">{language || "English"}</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Category</p>
          <p className="font-bold text-gray-900">{category}</p>
        </div>
      </div>
    </div>
  );
}
