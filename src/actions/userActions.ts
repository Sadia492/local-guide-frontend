// actions/userActions.ts
"use client";

import { userService } from "@/services/user/adminUser.service";
import { toast } from "sonner";

export const useUserActions = () => {
  const deleteUser = async (id: string, name?: string) => {
    try {
      await userService.deleteUser(id);
      // REMOVED: await userService.revalidateCache();

      toast.success("User deleted successfully", {
        description: `${
          name || "User"
        }'s account has been permanently deleted.`,
      });
      return true;
    } catch (error) {
      toast.error("Failed to delete user", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
      return false;
    }
  };

  const toggleUserStatus = async (
    id: string,
    currentStatus: boolean,
    name?: string
  ) => {
    try {
      await userService.updateStatus(id, !currentStatus);
      // REMOVED: await userService.revalidateCache();

      const actionText = currentStatus ? "deactivated" : "activated";
      toast.success(`User ${actionText}`, {
        description: `${name || "User"} has been ${actionText} successfully.`,
      });
      return true;
    } catch (error) {
      const action = currentStatus ? "deactivate" : "activate";
      toast.error(`Failed to ${action} user`, {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
      return false;
    }
  };

  const changeUserRole = async (
    id: string,
    currentRole: string,
    name?: string
  ) => {
    try {
      const newRole = currentRole === "TOURIST" ? "GUIDE" : "TOURIST";
      await userService.updateRole(id, newRole);
      // REMOVED: await userService.revalidateCache();

      const actionText =
        currentRole === "TOURIST" ? "promoted to Guide" : "demoted to Tourist";
      toast.success("User role updated", {
        description: `${name || "User"} has been ${actionText}.`,
      });
      return true;
    } catch (error) {
      toast.error("Failed to update user role", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
      return false;
    }
  };

  return {
    deleteUser,
    toggleUserStatus,
    changeUserRole,
  };
};
