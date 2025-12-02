"use client";
import React, { useState } from "react";
import { MapPin, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            <a
              href="/explore"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Explore Tours
            </a>
            <a
              href="/become-guide"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Become a Guide
            </a>
            <a
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Login
            </a>
            <Link href={"/register"}>
              <Button variant="primary" size="sm" className="w-full">
                Sign Up
              </Button>
            </Link>
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
          <div className="md:hidden py-4 space-y-3">
            <a
              href="#explore"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              Explore Tours
            </a>
            <a
              href="#become-guide"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              Become a Guide
            </a>
            <a
              href="/login"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              Login
            </a>
            <Link href={"/register"}>
              <Button variant="primary" size="sm" className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
