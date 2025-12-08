import { Calendar, Users, DollarSign, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import BookingActions from "./BookingActions";

import { AdminBooking } from "@/types/booking-admin";
import {
  formatBookingDate,
  formatBookingTime,
  formatCreatedDate,
} from "@/lib/booking.utils";

interface BookingsTableRowProps {
  booking: AdminBooking;
  onConfirm: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}

export default function BookingsTableRow({
  booking,
  onConfirm,
  onCancel,
}: BookingsTableRowProps) {
  return (
    <tr key={booking._id} className="hover:bg-gray-50">
      {/* Tour Details */}
      <td className="px-4 py-4">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
              {booking.listing?.images?.[0] ? (
                <img
                  src={booking.listing.images[0]}
                  alt={booking.listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">
                {booking.listing?.title || "Tour Deleted"}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                <MapPin className="w-3 h-3" />
                {booking.listing?.city || "N/A"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                User ID: {booking.user}
              </div>
            </div>
          </div>
          {booking.listing?.meetingPoint && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Meeting:</span>{" "}
              {booking.listing.meetingPoint}
            </div>
          )}
        </div>
      </td>

      {/* Date & Group */}
      <td className="px-4 py-4">
        <div className="space-y-2">
          <div>
            <div className="text-xs text-gray-500">Date</div>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="w-3 h-3 text-blue-500" />
              {formatBookingDate(booking.date)}
            </div>
            <div className="text-xs text-gray-600 ml-4">
              {formatBookingTime(booking.date)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Group Size</div>
            <div className="flex items-center gap-1 text-sm">
              <Users className="w-3 h-3 text-blue-500" />
              {booking.groupSize} people
            </div>
          </div>
          {booking.listing?.duration && (
            <div className="text-xs text-gray-500">
              Duration: {booking.listing.duration} hours
            </div>
          )}
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-4">
        <div className="space-y-1">
          <div className="flex items-center text-lg font-bold text-gray-900">
            <DollarSign className="w-4 h-4" />
            {booking.totalPrice}
          </div>
          {booking.listing?.fee && (
            <div className="text-xs text-gray-500">
              {booking.groupSize} × ${booking.listing.fee} per person
            </div>
          )}
          <div className="text-xs text-gray-500">
            Booked on {formatCreatedDate(booking.createdAt)}
          </div>
        </div>
      </td>

      {/* Status & Actions */}
      <td className="px-4 py-4">
        <div className="space-y-3">
          <div>
            <StatusBadge status={booking.status} />
          </div>

          <BookingActions
            bookingId={booking._id}
            status={booking.status}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        </div>
      </td>
    </tr>
  );
}
