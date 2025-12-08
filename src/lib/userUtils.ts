import { UserData } from "@/services/user/adminUser.service";

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarColor = (userId: string): string => {
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

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const filterUsers = (
  users: UserData[],
  filters: {
    searchTerm: string;
    roleFilter: string;
    statusFilter: string;
  }
): UserData[] => {
  const { searchTerm, roleFilter, statusFilter } = filters;
  const searchTermLower = searchTerm.toLowerCase();

  return users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });
};

export const getRoleStats = (users: UserData[]) => {
  return {
    totalUsers: users.length,
    tourists: users.filter((u) => u.role === "TOURIST").length,
    guides: users.filter((u) => u.role === "GUIDE").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    activeUsers: users.filter((u) => u.isActive).length,
  };
};
