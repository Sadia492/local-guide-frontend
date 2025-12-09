"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  User,
  Shield,
  Globe,
  Briefcase,
  Mail,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EditUserDialog } from "@/components/modules/Admin/User/EditUserDialogue";
import { getInitials, getAvatarColor, formatDate } from "@/lib/userUtils";
import debounce from "lodash/debounce";
import { UserData, userService } from "@/services/user/adminUser.service";

interface UserManagementClientProps {
  users: UserData[];
  filteredUsers: UserData[];
  totalUsers: number;
  tourists: number;
  guides: number;
  activeUsers: number;
  initialSearchTerm: string;
  initialRoleFilter: string;
  initialStatusFilter: string;
  initialCurrentPage: number;
}

const ITEMS_PER_PAGE = 10;

// Role badge component
const RoleBadge = ({ role }: { role: string }) => {
  const roleConfig = {
    TOURIST: {
      color: "bg-blue-100 text-blue-800",
      icon: <User className="w-3 h-3" />,
    },
    GUIDE: {
      color: "bg-green-100 text-green-800",
      icon: <Briefcase className="w-3 h-3" />,
    },
    ADMIN: {
      color: "bg-purple-100 text-purple-800",
      icon: <Shield className="w-3 h-3" />,
    },
  };

  const config =
    roleConfig[role as keyof typeof roleConfig] || roleConfig.TOURIST;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {role}
    </span>
  );
};

// Status badge component
const StatusBadge = ({ isActive }: { isActive: boolean }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isActive ? (
        <>
          <CheckCircle className="w-3 h-3" />
          Active
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3" />
          Inactive
        </>
      )}
    </span>
  );
};

export default function UserManagementClient({
  users: initialUsers,
  filteredUsers: serverFilteredUsers,
  totalUsers,
  tourists,
  guides,
  activeUsers,
  initialSearchTerm,
  initialRoleFilter,
  initialStatusFilter,
  initialCurrentPage,
}: UserManagementClientProps) {
  const router = useRouter();

  // Local state for users - so we can update without reloading page
  const [users, setUsers] = useState<UserData[]>(initialUsers);

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [roleFilter, setRoleFilter] = useState(initialRoleFilter);
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [isLoading, setIsLoading] = useState(false);

  // Update users when initialUsers prop changes
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Debounced function to update URL
  const updateURL = useCallback(
    debounce((filters: { search: string; role: string; status: string }) => {
      const params = new URLSearchParams();

      if (filters.search) params.set("search", filters.search);
      if (filters.role !== "all") params.set("role", filters.role);
      if (filters.status !== "all") params.set("status", filters.status);

      router.push(`/dashboard/admin/users?${params.toString()}`, {
        scroll: false,
      });
    }, 500),
    [router]
  );

  // Handle filter changes with instant URL update
  useEffect(() => {
    updateURL({
      search: searchTerm,
      role: roleFilter,
      status: statusFilter,
    });
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, roleFilter, statusFilter, updateURL]);

  // Refresh users function
  const refreshUsers = async () => {
    try {
      setIsLoading(true);
      // Simulate a delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.refresh(); // This will trigger parent to refetch
    } catch (error) {
      console.error("Error refreshing users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side filtering for instant feedback
  const locallyFilteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Use locally filtered listings for instant feedback
  const displayUsers = locallyFilteredUsers;

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = displayUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(displayUsers.length / ITEMS_PER_PAGE);

  // Update user in state
  const updateUserInState = (userId: string, updates: Partial<UserData>) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, ...updates } : user
      )
    );
  };

  // Remove user from state
  const removeUserFromState = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  // Handlers
  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Delete User",
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-2">Are you sure you want to delete this user?</p>
          <div class="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
            <p class="text-sm text-red-700">
              <strong>Warning:</strong> This action cannot be undone. The user account will be permanently removed.
            </p>
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <p class="font-medium">${name}</p>
            <p class="text-sm text-gray-600">User ID: ${id}</p>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await userService.deleteUser(id);
        removeUserFromState(id);
        toast.success(`${name} has been deleted successfully`);
      } catch (error: any) {
        toast.error(error.message || "Failed to delete user");
      }
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: boolean,
    name: string
  ) => {
    const result = await Swal.fire({
      title: `${currentStatus ? "Deactivate" : "Activate"} User`,
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-2">Are you sure you want to ${
            currentStatus ? "deactivate" : "activate"
          } this user?</p>
          <div class="${
            currentStatus
              ? "bg-yellow-50 border-l-4 border-yellow-500"
              : "bg-green-50 border-l-4 border-green-500"
          } p-3 mb-4">
            <p class="text-sm ${
              currentStatus ? "text-yellow-700" : "text-green-700"
            }">
              <strong>Note:</strong> ${
                currentStatus
                  ? "Deactivated users cannot log in or access the platform."
                  : "Activated users will be able to log in and use the platform."
              }
            </p>
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <p class="font-medium">${name}</p>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${
        currentStatus ? "deactivate" : "activate"
      } it!`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await userService.updateStatus(id, !currentStatus);
        updateUserInState(id, { isActive: !currentStatus });
        toast.success(
          `${name} has been ${currentStatus ? "deactivated" : "activated"}`
        );
      } catch (error: any) {
        toast.error(error.message || "Failed to update user status");
      }
    }
  };

  const handleChangeRole = async (
    id: string,
    currentRole: string,
    name: string
  ) => {
    const newRole = currentRole === "TOURIST" ? "GUIDE" : "TOURIST";
    const actionText =
      currentRole === "TOURIST" ? "promote to Guide" : "demote to Tourist";

    const result = await Swal.fire({
      title: "Change User Role",
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-2">Are you sure you want to ${actionText}?</p>
          <div class="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
            <p class="text-sm text-blue-700">
              <strong>Note:</strong> ${
                currentRole === "TOURIST"
                  ? "Guides can create and manage tour listings."
                  : "Tourists can only book and review tours."
              }
            </p>
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <p class="font-medium">${name}</p>
            <p class="text-sm text-gray-600">Current role: ${currentRole}</p>
            <p class="text-sm text-gray-600">New role: ${newRole}</p>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await userService.updateRole(id, newRole as any);
        updateUserInState(id, { role: newRole as any });
        toast.success(`${name}'s role has been changed to ${newRole}`);
      } catch (error: any) {
        toast.error(error.message || "Failed to update user role");
      }
    }
  };

  // Handle successful user edit
  const handleUserEditSuccess = (updatedUser: UserData) => {
    updateUserInState(updatedUser._id, updatedUser);
    toast.success(`${updatedUser.name} has been updated successfully`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all user accounts on the platform
            </p>
          </div>
          <button
            onClick={refreshUsers}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Refreshing...
              </span>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="all">All Roles</option>
              <option value="TOURIST">Tourist</option>
              <option value="GUIDE">Guide</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Profile
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    {/* User Profile */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-full ${getAvatarColor(
                                user._id
                              )} flex items-center justify-center text-white font-bold`}
                            >
                              {getInitials(user.name)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Joined {formatDate(user.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        {/* Languages */}
                        {user.languages.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                              <Globe className="w-3 h-3" />
                              Languages
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {user.languages.slice(0, 3).map((lang, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                                >
                                  {lang}
                                </span>
                              ))}
                              {user.languages.length > 3 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                  +{user.languages.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Expertise (for guides) */}
                        {user.role === "GUIDE" && user.expertise.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                              <Briefcase className="w-3 h-3" />
                              Expertise
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {user.expertise.slice(0, 3).map((exp, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded"
                                >
                                  {exp}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Daily Rate (for guides) */}
                        {user.role === "GUIDE" && user.dailyRate && (
                          <div>
                            <div className="text-xs text-gray-500">
                              Daily Rate
                            </div>
                            <div className="font-medium">${user.dailyRate}</div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Role & Status */}
                    <td className="px-4 py-4">
                      <div className="space-y-3">
                        <div>
                          <RoleBadge role={user.role} />
                        </div>
                        <div>
                          <StatusBadge isActive={user.isActive} />
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="space-y-3">
                        {/* Change Role Button (only for TOURIST/GUIDE) */}
                        {user.role !== "ADMIN" && (
                          <button
                            onClick={() =>
                              handleChangeRole(user._id, user.role, user.name)
                            }
                            className={`w-full px-3 py-1.5 text-xs rounded transition-colors ${
                              user.role === "TOURIST"
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {user.role === "TOURIST" ? (
                              <span className="flex items-center justify-center gap-1">
                                <UserCheck className="w-3 h-3" />
                                Promote to Guide
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-1">
                                <UserX className="w-3 h-3" />
                                Demote to Tourist
                              </span>
                            )}
                          </button>
                        )}

                        {/* Toggle Status Button */}
                        <button
                          onClick={() =>
                            handleToggleStatus(
                              user._id,
                              user.isActive,
                              user.name
                            )
                          }
                          className={`w-full px-3 py-1.5 text-xs rounded transition-colors ${
                            user.isActive
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {user.isActive ? "Deactivate User" : "Activate User"}
                        </button>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2 border-t">
                          {/* Edit User Dialog */}
                          <EditUserDialog userId={user._id} />

                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            className="flex-1 p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded text-center"
                            title="Delete User"
                          >
                            <Trash2 className="w-3 h-3 mx-auto" />
                            <span className="text-xs mt-0.5">Delete</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        No users found
                      </h3>
                      <p className="text-xs text-gray-600">
                        {searchTerm ||
                        roleFilter !== "all" ||
                        statusFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "No users found in the system"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {displayUsers.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + ITEMS_PER_PAGE, displayUsers.length)}
                </span>{" "}
                of <span className="font-medium">{displayUsers.length}</span>{" "}
                users
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded text-xs font-medium ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {totalUsers}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Tourists</div>
          <div className="text-xl font-bold text-gray-900 mt-1">{tourists}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Guides</div>
          <div className="text-xl font-bold text-gray-900 mt-1">{guides}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Active Users</div>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {activeUsers}
          </div>
        </div>
      </div>
    </div>
  );
}
