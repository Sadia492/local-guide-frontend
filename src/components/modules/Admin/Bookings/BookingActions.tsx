"use client";

interface BookingActionsProps {
  bookingId: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  onConfirm: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}

export default function BookingActions({
  bookingId,
  status,
  onConfirm,
  onCancel,
}: BookingActionsProps) {
  if (status === "PENDING") {
    return (
      <div className="space-y-1">
        <button
          onClick={() => onConfirm(bookingId)}
          className="w-full px-2 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700"
        >
          Confirm
        </button>
        <button
          onClick={() => onCancel(bookingId)}
          className="w-full px-2 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="text-xs text-gray-500 italic">No actions available</div>
  );
}
