"use client";

import { listingService } from "@/services/listing/listing.service";
import { toast } from "sonner";

export const useListingActions = () => {
  const deleteListing = async (id: string, title?: string) => {
    try {
      await listingService.deleteListing(id);
      await listingService.revalidateCache();

      toast.success("Listing deleted successfully", {
        description: `"${title || "Listing"}" has been permanently deleted.`,
      });
      return true;
    } catch (error) {
      toast.error("Failed to delete listing", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
      return false;
    }
  };

  const toggleListingStatus = async (
    id: string,
    currentStatus: boolean,
    title?: string
  ) => {
    try {
      await listingService.updateStatus(id, !currentStatus);
      await listingService.revalidateCache();

      const actionText = currentStatus ? "deactivated" : "activated";
      toast.success(`Listing ${actionText}`, {
        description: `"${
          title || "Listing"
        }" has been ${actionText} successfully.`,
      });
      return true;
    } catch (error) {
      const action = currentStatus ? "deactivate" : "activate";
      toast.error(`Failed to ${action} listing`, {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
      return false;
    }
  };

  return {
    deleteListing,
    toggleListingStatus,
  };
};
