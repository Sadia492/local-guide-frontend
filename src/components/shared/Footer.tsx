import React from "react";
import {
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Heart,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">LocalGuide</span>
            </div>
            <p className="text-gray-400 mb-6">
              Connecting travelers with local experts for authentic experiences
              worldwide.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors hover:scale-110 transform"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors hover:scale-110 transform"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors hover:scale-110 transform"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:hello@localguide.com"
                className="hover:text-blue-500 transition-colors hover:scale-110 transform"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-500 transition-colors inline-block hover:translate-x-1 transform"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="hover:text-blue-500 transition-colors inline-block hover:translate-x-1 transform"
                >
                  Explore Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/become-guide"
                  className="hover:text-blue-500 transition-colors inline-block hover:translate-x-1 transform"
                >
                  Become a Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-500 transition-colors inline-block hover:translate-x-1 transform"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-blue-500 transition-colors inline-block hover:translate-x-1 transform"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-500 transition-colors inline-block hover:translate-x-1 transform"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-500 transition-colors inline-block hover:translate-x-1 transform"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="mailto:support@localguide.com"
                  className="hover:text-blue-500 transition-colors"
                >
                  support@localguide.com
                </Link>
              </li>
              <li className="text-gray-400">+1 (555) 123-4567</li>
              <li className="text-gray-400">123 Travel Street</li>
              <li className="text-gray-400">City, Country 12345</li>
            </ul>
          </div>
        </div>

        {/* Copyright Message */}
        <div className="mt-4 text-center text-gray-500 text-xs">
          <p>
            LocalGuide is a platform connecting travelers with verified local
            guides worldwide.
          </p>
          <p className="mt-1">
            All experiences are curated and verified by our team.
          </p>
        </div>
      </div>
    </footer>
  );
}
