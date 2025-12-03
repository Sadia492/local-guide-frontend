"use client";
import React, { useState } from "react";
import { MapPin, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/actions/useAuth";

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log(user);
  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={"/"} className="flex items-center space-x-2">
              <MapPin className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                LocalGuide
              </span>
            </Link>
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={"/"} className="flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">LocalGuide</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Always show these links */}
            <Link
              href="/explore"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Explore Tours
            </Link>

            {/* Show different links based on authentication and role */}
            {user ? (
              // User is logged in
              <>
                {/* Show role-specific links */}
                {user.role === "GUIDE" && (
                  <>
                    <Link
                      href="/dashboard/guide"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/guide/listings"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      My Listings
                    </Link>
                  </>
                )}

                {user.role === "ADMIN" && (
                  <>
                    <Link
                      href="/dashboard/admin"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  </>
                )}

                {user.role === "TOURIST" && (
                  <>
                    <Link
                      href="/dashboard/tourist"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      My Bookings
                    </Link>
                  </>
                )}

                {/* Show Become a Guide for tourists only */}
                {user.role === "TOURIST" && (
                  <Link
                    href="/become-a-guide"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Become a Guide
                  </Link>
                )}

                {/* Common for all logged in users */}
                <Link
                  href={`/profile/${user._id || "me"}`}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Profile
                </Link>

                {/* Logout button */}
                <Button
                  onClick={handleLogout}
                  variant="primary"
                  size="sm"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Logout
                </Button>
              </>
            ) : (
              // User is not logged in
              <>
                <Link
                  href="/become-a-guide"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Become a Guide
                </Link>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link href={"/register"}>
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-100">
            {/* Always show these links */}
            <Link
              href="/explore"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Tours
            </Link>

            {/* Show different links based on authentication and role */}
            {user ? (
              // User is logged in (mobile)
              <>
                {/* Show role-specific links */}
                {user.role === "GUIDE" && (
                  <>
                    <Link
                      href="/dashboard/guide"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/guide/listings"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Listings
                    </Link>
                  </>
                )}

                {user.role === "ADMIN" && (
                  <>
                    <Link
                      href="/dashboard/admin"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  </>
                )}

                {user.role === "TOURIST" && (
                  <>
                    <Link
                      href="/dashboard/tourist"
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                  </>
                )}

                {/* Show Become a Guide for tourists only */}
                {user.role === "TOURIST" && (
                  <Link
                    href="/become-a-guide"
                    className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Become a Guide
                  </Link>
                )}

                {/* Common for all logged in users */}
                <Link
                  href={`/profile/${user._id || "me"}`}
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>

                {/* Logout button */}
                <Button
                  onClick={handleLogout}
                  variant="primary"
                  size="sm"
                  className="w-full text-gray-700 hover:text-blue-600"
                >
                  Logout
                </Button>
              </>
            ) : (
              // User is not logged in (mobile)
              <>
                <Link
                  href="/become-a-guide"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Become a Guide
                </Link>
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link href={"/register"}>
                  <Button variant="primary" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
