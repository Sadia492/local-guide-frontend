export interface AdminBooking {
  _id: string;
  user: string;
  listing: {
    _id: string;
    guide: string;
    title: string;
    description: string;
    city: string;
    fee: number;
    duration: number;
    meetingPoint: string;
    maxGroupSize: number;
    images: string[];
    language: string;
    isActive: boolean;
  } | null;
  date: string;
  groupSize: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface BookingsFilters {
  search: string;
  status: string;
  dateFilter: string;
}
