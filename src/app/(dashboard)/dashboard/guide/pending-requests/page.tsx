// app/(dashboard)/dashboard/guide/bookings/pending/page.tsx

import PendingRequestsWrapper from "@/components/modules/Guide/Booking/PendingRequestsWrapper";

export default function PendingRequestsPage() {
  return <PendingRequestsWrapper />;
}

export const metadata = {
  title: "Pending Requests | Travel Buddy",
  description: "Review and respond to booking requests",
};
