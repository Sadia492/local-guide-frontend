// components/shared/Sidebar.tsx
"use client";

import { useAuth } from "@/actions/useAuth";
import Link from "next/link";
import {
  Home,
  Compass,
  User,
  LogOut,
  Calendar,
  Briefcase,
  Shield,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Tourist navigation
  const touristNav = [
    {
      href: "/dashboard/tourist",
      icon: <Calendar className="w-5 h-5" />,
      label: "My Bookings",
    },
    {
      href: "/wishlist",
      icon: <Home className="w-5 h-5" />,
      label: "Wishlist",
    },
    {
      href: "/explore",
      icon: <Compass className="w-5 h-5" />,
      label: "Explore Tours",
    },
  ];

  // Guide navigation
  const guideNav = [
    {
      href: "/dashboard/guide",
      icon: <Briefcase className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/guide/listings",
      icon: <Home className="w-5 h-5" />,
      label: "My Listings",
    },
    {
      href: "/dashboard/guide/bookings",
      icon: <Calendar className="w-5 h-5" />,
      label: "Bookings",
    },
    {
      href: "/explore",
      icon: <Compass className="w-5 h-5" />,
      label: "Explore",
    },
  ];

  // Admin navigation
  const adminNav = [
    {
      href: "/dashboard/admin",
      icon: <Shield className="w-5 h-5" />,
      label: "Admin Dashboard",
    },
    {
      href: "/dashboard/admin/users",
      icon: <User className="w-5 h-5" />,
      label: "Manage Users",
    },
    {
      href: "/dashboard/admin/listings",
      icon: <Home className="w-5 h-5" />,
      label: "Manage Listings",
    },
  ];

  // Common navigation
  const commonNav = [
    {
      href: `/profile/${user?._id || "me"}`,
      icon: <User className="w-5 h-5" />,
      label: "Profile",
    },
    {
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
  ];

  // Get navigation based on user role
  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "TOURIST":
        return [...touristNav, ...commonNav];
      case "GUIDE":
        return [...guideNav, ...commonNav];
      case "ADMIN":
        return [...adminNav, ...commonNav];
      default:
        return commonNav;
    }
  };

  return (
    <div className="h-full w-64 bg-white border-r shadow-sm">
      <div className="p-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">LocalGuide</span>
        </Link>

        {/* User info */}
        {user && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg">
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600 capitalize">
              {user.role.toLowerCase()}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {getNavItems().map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors mt-6"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
