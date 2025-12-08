import { Calendar } from "lucide-react";

interface BookingsEmptyStateProps {
  title?: string;
  description?: string;
}

export default function BookingsEmptyState({
  title = "No bookings found",
  description = "Try adjusting your search or filters",
}: BookingsEmptyStateProps) {
  return (
    <div className="text-center">
      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}
