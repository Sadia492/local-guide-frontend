"use client";

import { useAuth } from "@/actions/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  User,
  LogOut,
  Calendar,
  Briefcase,
  Shield,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Tourist navigation
  const touristNav = [
    {
      href: "/dashboard/tourist",
      icon: <Calendar className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/tourist/wishlist",
      icon: <Home className="w-5 h-5" />,
      label: "Wishlist",
    },
    {
      href: "/dashboard/tourist/my-trips",
      icon: <Compass className="w-5 h-5" />,
      label: "My Trips",
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
      href: "/dashboard/guide/my-listings",
      icon: <Home className="w-5 h-5" />,
      label: "My Listings",
    },
    {
      href: "/dashboard/guide/upcoming-bookings",
      icon: <Calendar className="w-5 h-5" />,
      label: "Upcoming Bookings",
    },
    {
      href: "/dashboard/guide/pending-requests",
      icon: <Compass className="w-5 h-5" />,
      label: "Pending Requests",
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
    {
      href: "/dashboard/admin/bookings",
      icon: <Home className="w-5 h-5" />,
      label: "Manage Bookings",
    },
  ];

  // Common navigation
  // const commonNav = [
  //   {
  //     href: "/settings",
  //     icon: <Settings className="w-5 h-5" />,
  //     label: "Settings",
  //   },
  // ];

  // Get navigation based on user role
  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "TOURIST":
        return [...touristNav];
      case "GUIDE":
        return [...guideNav];
      case "ADMIN":
        return [...adminNav];
      default:
        return [...touristNav];
    }
  };

  // Check if link is active
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const navItems = getNavItems();

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center space-x-2 mb-8"
        onClick={() => setIsMobileOpen(false)}
      >
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
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                active
                  ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center space-x-3 p-3 mt-auto bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-8 right-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          flex w-64 flex-col border-r bg-white shadow-sm
          h-screen lg:h-full
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          lg:translate-x-0
        `}
      >
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
