import { Navigation } from "lucide-react";

interface ListingMeetingPointProps {
  meetingPoint: string;
}

export default function ListingMeetingPoint({
  meetingPoint,
}: ListingMeetingPointProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Navigation className="w-5 h-5 text-blue-600" />
        Meeting Point
      </h3>
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-gray-800 font-medium">{meetingPoint}</p>
        <p className="text-gray-600 text-sm mt-1">
          Your guide will meet you at this location at the scheduled time.
        </p>
      </div>
    </div>
  );
}
