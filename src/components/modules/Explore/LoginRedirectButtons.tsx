"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface LoginRedirectButtonsProps {
  tourId: string;
  isAuthenticated: boolean;
  userRole?: string;
}

export default function LoginRedirectButtons({
  tourId,
  isAuthenticated,
  userRole,
}: LoginRedirectButtonsProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    // if (!isAuthenticated) {
    //   const loginUrl = `/login?redirect=${encodeURIComponent(
    //     `/tours/${tourId}`
    //   )}`;
    //   router.push(loginUrl);
    // } else {
    router.push(`/tours/${tourId}`);
    // }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      const loginUrl = `/login?redirect=${encodeURIComponent(
        `/tours/${tourId}?booking=true`
      )}`;
      router.push(loginUrl);
    } else {
      router.push(`/tours/${tourId}?booking=true`);
    }
  };

  return (
    <div className="mt-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        <Button
          variant="primary"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          onClick={handleBookNow}
          disabled={userRole === "GUIDE"} // Guides can't book tours
        >
          {userRole === "GUIDE" ? "Not Available" : "Book Now"}
        </Button>
      </div>

      {!isAuthenticated && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Login required to book
        </p>
      )}
    </div>
  );
}
