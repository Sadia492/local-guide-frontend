// If you want to fetch data from an API
export async function getGuideStats() {
  // This can be an API call or database query
  return {
    totalGuides: 2450,
    totalEarnings: "$8.2M+",
    averageRating: 4.8,
    happyTravelers: "98K+",
  };
}

export async function getFeaturedGuides() {
  // This can be an API call or database query
  return [
    {
      name: "Maria Rodriguez",
      city: "Barcelona",
      specialty: "Food & Wine",
      earnings: "$42,580",
      rating: 4.9,
      image: "https://i.pravatar.cc/150?img=8",
    },
    // ... more guides
  ];
}
