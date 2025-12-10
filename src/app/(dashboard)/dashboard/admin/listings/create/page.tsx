import CreateListingClient from "@/components/modules/Guide/Listing/CreateListingClient";
import { categories, languages } from "@/lib/createListingUtils";
import { cookies } from "next/headers";

// Server component fetches any initial data needed
export default async function CreateListingPage() {
  // Get cookies for authentication if needed
  const cookieStore = await cookies();

  return <CreateListingClient categories={categories} languages={languages} />;
}
