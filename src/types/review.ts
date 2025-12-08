export interface ListingReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    profilePicture?: string;
  };
}
