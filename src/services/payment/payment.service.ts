export interface PaymentResponse {
  paymentUrl: string;
  success: boolean;
  message?: string;
}

export const paymentService = {
  // Create payment session - CLIENT SIDE
  async createPayment(bookingId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}/create-payment`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create payment session");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to create payment");
      }

      return {
        paymentUrl: data.data.paymentUrl,
        success: true,
      };
    } catch (error) {
      console.error("Error creating payment:", error);
      return {
        paymentUrl: "",
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },

  // Check payment status
  async checkPaymentStatus(
    sessionId: string
  ): Promise<{ status: string; message?: string }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/status/${sessionId}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const data = await response.json();
      return { status: data.status, message: data.message };
    } catch (error) {
      console.error("Error checking payment status:", error);
      return { status: "error", message: "Failed to check payment status" };
    }
  },
};
