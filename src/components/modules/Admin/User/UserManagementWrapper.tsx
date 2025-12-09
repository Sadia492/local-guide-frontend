// app/dashboard/admin/users/UserManagementWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import UserManagementClient from "@/components/modules/Admin/User/UserManagementClient";
import { filterUsers, getRoleStats } from "@/lib/userUtils";

export default function UserManagementWrapper() {
  const searchParams = useSearchParams();

  // Extract search params
  const searchTerm = searchParams.get("search") || "";
  const roleFilter = searchParams.get("role") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const pageParam = searchParams.get("page") || "1";

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [refreshCount, setRefreshCount] = useState(0); // Add refresh counter

  const currentPage = Math.max(1, parseInt(pageParam) || 1);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/all`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const userList = data.data || [];
        setUsers(userList);
        setError(null);
      } else {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      console.log("Refresh event received, refreshing users...");
      fetchUsers();
    };

    // Listen for custom event
    window.addEventListener("refresh-users", handleRefresh);

    // Cleanup
    return () => {
      window.removeEventListener("refresh-users", handleRefresh);
    };
  }, []);

  // Update filtered users and stats when users or search params change
  useEffect(() => {
    if (users.length > 0) {
      const filtered = filterUsers(users, {
        searchTerm,
        roleFilter,
        statusFilter,
      });
      setFilteredUsers(filtered);

      const userStats = getRoleStats(users);
      setStats(userStats);
    }
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Manual refresh function to pass to child
  const handleManualRefresh = () => {
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold text-lg mb-2">
          Error Loading Users
        </h3>
        <p className="text-red-600">{error}</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const safeStats = stats || getRoleStats(users);
  const safeFilteredUsers =
    filteredUsers.length > 0
      ? filteredUsers
      : filterUsers(users, { searchTerm, roleFilter, statusFilter });

  return (
    <UserManagementClient
      users={users}
      filteredUsers={safeFilteredUsers}
      totalUsers={safeStats.totalUsers}
      tourists={safeStats.tourists}
      guides={safeStats.guides}
      activeUsers={safeStats.activeUsers}
      initialSearchTerm={searchTerm}
      initialRoleFilter={roleFilter}
      initialStatusFilter={statusFilter}
      initialCurrentPage={currentPage}
      //   onRefresh={handleManualRefresh} // Pass refresh function
    />
  );
}
