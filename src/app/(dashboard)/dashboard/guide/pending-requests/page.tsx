import PendingRequestsClient from "@/components/modules/Guide/Booking/PendingRequestsClient";
import { getPendingBookings } from "@/services/listing/pendingBooking.service";
import { cookies } from "next/headers";

export default async function PendingRequestsPage() {
  // Get cookies from the server request
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  // Fetch pending bookings on the server
  const pendingBookings = await getPendingBookings(cookieHeader);

  return <PendingRequestsClient initialBookings={pendingBookings} />;
}
