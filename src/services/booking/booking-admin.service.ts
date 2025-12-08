import { AdminBooking } from "@/types/booking-admin";

export const fetchAllBookings = async (): Promise<AdminBooking[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/all-bookings`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: AdminBooking["status"]
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update booking status");
  }

  return data;
};
