// import { cookies } from "next/headers";
// import {
//   getWishlistItems,
//   getWishlistStats,
// } from "@/services/wishlist/wishlist2.service";
// import WishlistClient from "@/components/modules/Tourist/Wishlist/WishlistClient";

import WishlistWrapper from "@/components/modules/Tourist/Wishlist/WishlistWrapper";

// export default async function WishlistPage() {
//   // Get cookies from the server request
//   const cookieStore = await cookies();
//   const cookieHeader = cookieStore
//     .getAll()
//     .map((cookie) => `${cookie.name}=${cookie.value}`)
//     .join("; ");

//   // Fetch wishlist on the server
//   const items = await getWishlistItems(cookieHeader);
//   const stats = getWishlistStats(items);

//   return <WishlistClient initialItems={items} initialStats={stats} />;
// }

// app/(dashboard)/dashboard/tourist/wishlist/page.tsx

export default function WishlistPage() {
  return <WishlistWrapper />;
}
