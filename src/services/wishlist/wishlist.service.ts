export const getWishlist = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
      {
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};

export const addToWishlist = async (listingId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ listingId }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add to wishlist");
  }

  return data;
};

export const removeFromWishlist = async (listingId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${listingId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove from wishlist");
  }

  return data;
};
