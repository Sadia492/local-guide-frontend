import { cookies } from "next/headers";
import { getUpcomingBookings } from "@/services/booking/upcomingBooking.service";
import UpcomingBookingsClient from "@/components/modules/Guide/Booking/UpcomingBookingsClient";

export default async function UpcomingBookingsPage() {
  // Get cookies from the server request
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  // Fetch upcoming bookings on the server
  const bookings = await getUpcomingBookings(cookieHeader);

  return <UpcomingBookingsClient initialBookings={bookings} />;
}
