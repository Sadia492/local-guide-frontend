export interface BookingData {
  listing: string;
  date: string;
  groupSize: number;
}

export interface UserBooking {
  _id: string;
  listing: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  date: string;
  groupSize: number;
  totalPrice: number;
  createdAt: string;
}
