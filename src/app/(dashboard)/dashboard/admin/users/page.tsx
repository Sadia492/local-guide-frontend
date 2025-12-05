// app/dashboard/admin/users/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  User,
  Shield,
  Globe,
  Briefcase,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  RefreshCw,
  Loader2,
  Crown,
  MapPin,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import Link from "next/link";
import { EditUserDialog } from "@/components/modules/Admin/User/EditUserDialogue";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "TOURIST" | "GUIDE" | "ADMIN";
  profilePicture: string;
  languages: string[];
  expertise: string[];
  dailyRate?: number;
  travelPreferences?: string[];
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserManagementPage = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/all`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users", {
        description:
          err instanceof Error ? err.message : "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get random color for avatar
  const getAvatarColor = (userId: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-indigo-500",
    ];
    const index = userId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string, userName: string) => {
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
            <p class="font-medium">${userName}</p>
            <p class="text-sm text-gray-600">User ID: ${userId}</p>
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        // Update local state
        setUsers(users.filter((user) => user._id !== userId));

        toast.success("User deleted successfully", {
          description: `${userName}'s account has been permanently deleted.`,
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user", {
          description: "Please try again later",
        });
      }
    }
  };

  // Handle toggle user status (active/inactive)
  const handleToggleStatus = async (
    userId: string,
    currentStatus: boolean,
    userName: string
  ) => {
    const action = currentStatus ? "deactivate" : "activate";
    const actionText = currentStatus ? "deactivated" : "activated";

    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-2">Are you sure you want to ${action} this user?</p>
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
            <p class="font-medium">${userName}</p>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              isActive: !currentStatus,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update user status");
        }

        // Update local state
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, isActive: !currentStatus } : user
          )
        );

        toast.success(`User ${actionText}`, {
          description: `${userName} has been ${actionText} successfully.`,
        });
      } catch (error) {
        console.error("Error updating user status:", error);
        toast.error("Failed to update user status");
      }
    }
  };

  // Handle change role
  const handleChangeRole = async (
    userId: string,
    currentRole: string,
    userName: string
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
            <p class="font-medium">${userName}</p>
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}/role`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              role: newRole,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update user role");
        }

        // Update local state
        setUsers(
          users.map((user) =>
            user._id === userId
              ? { ...user, role: newRole as "TOURIST" | "GUIDE" }
              : user
          )
        );

        toast.success("User role updated", {
          description: `${userName} is now a ${newRole}.`,
        });
      } catch (error) {
        console.error("Error updating user role:", error);
        toast.error("Failed to update user role");
      }
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get role badge
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

  // Get status badge
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
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
              <option value="ADMIN">Admin</option>
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
                          <EditUserDialog
                            userId={user._id}
                            onSuccess={fetchUsers} // Refresh user list after edit
                          />

                          {/* <Link
                            href={`/dashboard/admin/users/edit/${user._id}`}
                            className="flex-1 p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded text-center"
                            title="Edit User"
                          >
                            <Edit className="w-3 h-3 mx-auto" />
                            <span className="text-xs mt-0.5">Edit</span>
                          </Link> */}

                          <button
                            onClick={() =>
                              handleDeleteUser(user._id, user.name)
                            }
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
        {filteredUsers.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
                </span>{" "}
                of <span className="font-medium">{filteredUsers.length}</span>{" "}
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
            {users.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Tourists</div>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {users.filter((u) => u.role === "TOURIST").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Guides</div>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {users.filter((u) => u.role === "GUIDE").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Active Users</div>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {users.filter((u) => u.isActive).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
