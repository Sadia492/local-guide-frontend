"use server";

export async function createPaymentAction(
  bookingId: string
): Promise<{ paymentUrl: string }> {
  console.log(`Payment requested for booking: ${bookingId}`);

  // Throw an error to force client-side handling
  throw new Error(
    "Payment must be processed client-side. Please use the payment service directly."
  );
}
