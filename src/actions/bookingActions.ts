"use server";

import { pendingBookingService } from "@/services/listing/pendingBooking.service";

export async function approveBookingAction(id: string): Promise<void> {
  try {
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
