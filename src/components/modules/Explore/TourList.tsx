import { Listing, UserData } from "@/types/explore";
import TourCard from "./TourCard";

interface TourListProps {
  listings: Listing[];
  isAuthenticated: boolean;
  currentUser: UserData | null;
}

export default function TourList({
  listings,
  isAuthenticated,
  currentUser,
}: TourListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {listings.map((tour) => (
        <TourCard
          key={tour._id}
          tour={tour}
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}
