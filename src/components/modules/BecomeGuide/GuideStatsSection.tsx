import { Star } from "lucide-react";

const guideStats = {
  totalGuides: 2450,
  totalEarnings: "$8.2M+",
  averageRating: 4.8,
  happyTravelers: "98K+",
};

export default function GuideStatsSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold mb-2">
          {guideStats.totalGuides.toLocaleString()}
        </div>
        <p className="text-blue-200">Active Guides</p>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold mb-2">
          {guideStats.totalEarnings}
        </div>
        <p className="text-blue-200">Total Earned</p>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center text-3xl md:text-4xl font-bold mb-2">
          <Star className="w-6 h-6 mr-2 fill-current text-yellow-400" />
          {guideStats.averageRating}
        </div>
        <p className="text-blue-200">Average Rating</p>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold mb-2">
          {guideStats.happyTravelers}
        </div>
        <p className="text-blue-200">Happy Travelers</p>
      </div>
    </div>
  );
}
