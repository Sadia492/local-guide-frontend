import { Map } from "lucide-react";

interface ListingItineraryProps {
  itinerary: string;
}

export default function ListingItinerary({ itinerary }: ListingItineraryProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Map className="w-5 h-5 text-blue-600" />
        Tour Itinerary
      </h3>
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-line">
            {itinerary || "Detailed itinerary will be provided upon booking."}
          </p>
        </div>
      </div>
    </div>
  );
}
