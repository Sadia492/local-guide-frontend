import { BookingData, UserBooking } from "@/types/booking";

export const createBooking = async (bookingData: BookingData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/booking`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(bookingData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create booking");
  }

  return data;
};

export const getUserBookings = async (): Promise<UserBooking[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/my-bookings`,
      {
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
};

export const cancelBooking = async (bookingId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status: "CANCELLED" }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to cancel booking");
  }

  return await response.json();
};
