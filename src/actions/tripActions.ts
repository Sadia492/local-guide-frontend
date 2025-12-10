// actions/tripActions.ts
"use server";

// This is a wrapper that can be called from client components
// It will redirect the actual API call to the client
export async function createPaymentAction(
  bookingId: string
): Promise<{ paymentUrl: string }> {
  // This is just a placeholder since we'll handle it client-side
  // You can keep this for backward compatibility or logging
  console.log(`Payment requested for booking: ${bookingId}`);

  // Throw an error to force client-side handling
  throw new Error(
    "Payment must be processed client-side. Please use the payment service directly."
  );
}
