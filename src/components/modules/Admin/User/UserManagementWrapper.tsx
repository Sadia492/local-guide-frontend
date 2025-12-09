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

  const currentPage = Math.max(1, parseInt(pageParam) || 1);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update filtered users when search params or users change
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

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Add cache-busting parameter to avoid cached responses
      const timestamp = new Date().getTime();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/all`,
        {
          method: "GET",
          credentials: "include", // This ALWAYS works in client components
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Fetch response status:", response.status);

      if (response.status === 401 || response.status === 403) {
        // Token expired or not admin - redirect to login
        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.pathname
        )}`;
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(
          `HTTP ${response.status}: ${errorText.substring(0, 100)}`
        );
      }

      const data = await response.json();
      console.log("Users fetched:", data.data?.length || 0);

      if (!data.data) {
        console.error("Unexpected response format:", data);
        throw new Error("Invalid response format from server");
      }

      setUsers(data.data || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(
        err.message ||
          "Failed to load users. Make sure you're logged in as admin."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setError(null);
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
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
          <button
            onClick={() => (window.location.href = "/dashboard/admin")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Ensure stats exist before passing
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
    />
  );
}
