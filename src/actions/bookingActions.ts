"use server";

import { bookingService } from "@/services/listing/pendingBooking.service";
import { cookies } from "next/headers";

export async function approveBookingAction(id: string): Promise<void> {
  try {
    // Get cookies from the server context
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    await bookingService.updateBookingStatus(id, "CONFIRMED", cookieHeader);
  } catch (error) {
    throw error;
  }
}

export async function rejectBookingAction(id: string): Promise<void> {
  try {
    // Get cookies from the server context
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    await bookingService.updateBookingStatus(id, "CANCELLED", cookieHeader);
  } catch (error) {
    throw error;
  }
}
