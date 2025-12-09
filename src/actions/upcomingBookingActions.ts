"use server";

export async function cancelBookingAction(id: string): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${id}`,
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
      throw new Error("Failed to cancel booking");
    }
  } catch (error) {
    console.error("Error in cancelBookingAction:", error);
    throw error;
  }
}

export async function confirmBookingAction(id: string): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "CONFIRMED" }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to confirm booking");
    }
  } catch (error) {
    console.error("Error in confirmBookingAction:", error);
    throw error;
  }
}

export async function completeBookingAction(id: string): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "COMPLETED" }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to complete booking");
    }
  } catch (error) {
    console.error("Error in completeBookingAction:", error);
    throw error;
  }
}
