import React from "react";
import { getUsers } from "@/services/user/adminUser.service";
import { filterUsers, getRoleStats } from "@/lib/userUtils";
import UserManagementClient from "@/components/modules/Admin/User/UserManagementClient";
import { cookies } from "next/headers"; // IMPORTANT: Import cookies

function safeParam(value: any, fallback: string) {
  if (Array.isArray(value)) return value[0] || fallback;
  if (typeof value === "string") return value;
  return fallback;
}

export default async function UserManagementPage({ searchParams }: any) {
  // searchParams is a Promise → unwrap it
  const params = await searchParams;

  // Get cookies from the server request
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  // extract safely
  const searchTerm = safeParam(params?.search, "");
  const roleFilter = safeParam(params?.role, "all");
  const statusFilter = safeParam(params?.status, "all");
  const pageParam = safeParam(params?.page, "1");

  const currentPage = Math.max(1, parseInt(pageParam) || 1);

  // Pass cookies to the service
  const users = await getUsers(cookieHeader);

  // Apply filters on server
  const filteredUsers = filterUsers(users, {
    searchTerm,
    roleFilter,
    statusFilter,
  });

  // Get stats
  const stats = getRoleStats(users);

  return (
    <UserManagementClient
      users={users}
      filteredUsers={filteredUsers}
      totalUsers={stats.totalUsers}
      tourists={stats.tourists}
      guides={stats.guides}
      activeUsers={stats.activeUsers}
      initialSearchTerm={searchTerm}
      initialRoleFilter={roleFilter}
      initialStatusFilter={statusFilter}
      initialCurrentPage={currentPage}
    />
  );
}
