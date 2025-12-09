import { cookies } from "next/headers";
import { getMyTrips } from "@/services/booking/myTrips.service";
import { getTripStats } from "@/lib/tripUtils";
import MyTripsClient from "@/components/modules/Tourist/Booking/MyTripsClient";

export default async function MyTripsPage() {
  // Get cookies from the server request
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  // Fetch trips on the server
  const trips = await getMyTrips(cookieHeader);
  const stats = getTripStats(trips);

  return <MyTripsClient initialTrips={trips} initialStats={stats} />;
}
