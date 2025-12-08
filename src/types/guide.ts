export interface GuideStat {
  totalGuides: number;
  totalEarnings: string;
  averageRating: number;
  happyTravelers: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface FeaturedGuide {
  name: string;
  city: string;
  specialty: string;
  earnings: string;
  rating: number;
  image: string;
}

export interface FAQ {
  q: string;
  a: string;
}
