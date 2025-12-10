import CreateListingClient from "@/components/modules/Guide/Listing/CreateListingClient";
import { categories, languages } from "@/lib/createListingUtils";
import { cookies } from "next/headers";
// import CreateListingClient from "@/components/dashboard/guide/listings/create/CreateListingClient";
// import { categories, languages } from "@/utils/createListing";

// Server component fetches any initial data needed
export default async function CreateListingPage() {
  // Get cookies for authentication if needed
  const cookieStore = await cookies();

  // You could fetch any initial data here if needed
  // For example, fetch user's existing listings to show suggestions

  return <CreateListingClient categories={categories} languages={languages} />;
}
