"use server";

export async function createPaymentAction(
  bookingId: string
): Promise<{ paymentUrl: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}/create-payment`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create payment session");
    }

    if (!data.success) {
      throw new Error(data.message || "Failed to create payment");
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}
