"use client";

import { AdminBooking } from "@/types/booking-admin";
import BookingsTableRow from "./BookingsTableRow";
import BookingsEmptyState from "./BookingsEmptyState";

interface BookingsTableProps {
  bookings: AdminBooking[];
  onConfirm: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}

export default function BookingsTable({
  bookings,
  onConfirm,
  onCancel,
}: BookingsTableProps) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tour Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Group
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status & Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingsTableRow
                  key={booking._id}
                  booking={booking}
                  onConfirm={onConfirm}
                  onCancel={onCancel}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8">
                  <BookingsEmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
