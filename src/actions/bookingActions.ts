// actions/bookingActions.ts
"use server";

import { pendingBookingService } from "@/services/listing/pendingBooking.service";

export async function approveBookingAction(id: string): Promise<void> {
  try {
    // This will be called from client components
    // The service already handles the authentication via credentials: "include"
    await pendingBookingService.approveBooking(id);
  } catch (error) {
    console.error("Error in approveBookingAction:", error);
    throw error;
  }
}

export async function rejectBookingAction(id: string): Promise<void> {
  try {
    await pendingBookingService.rejectBooking(id);
  } catch (error) {
    console.error("Error in rejectBookingAction:", error);
    throw error;
  }
}
