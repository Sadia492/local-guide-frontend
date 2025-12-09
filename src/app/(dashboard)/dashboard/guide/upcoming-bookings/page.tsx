// app/(dashboard)/dashboard/guide/bookings/upcoming/page.tsx

import UpcomingBookingsWrapper from "@/components/modules/Guide/Booking/UpcomingBookingsWrapper";

export default function UpcomingBookingsPage() {
  return <UpcomingBookingsWrapper />;
}

export const metadata = {
  title: "Upcoming Bookings | Travel Buddy",
  description: "Manage your upcoming tour bookings",
};
