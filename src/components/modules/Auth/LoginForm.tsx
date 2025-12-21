"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Users, User, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/actions/useAuth";

interface LoginFormProps {
  redirectTo: string;
}

// Credential presets for demo purposes
const demoCredentials = {
  guide: {
    email: "guide@example.com",
    password: "password123",
    label: "Guide Demo",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  tourist: {
    email: "tourist4@example.com",
    password: "password123",
    label: "Tourist Demo",
    icon: User,
    color: "from-green-500 to-green-600",
  },
  admin: {
    email: "admin@admin.com",
    password: "admin123",
    label: "Admin Demo",
    icon: Shield,
    color: "from-purple-500 to-purple-600",
  },
};

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle redirect for logged-in users
  useEffect(() => {
    if (user && !isLoading && !formLoading) {
      console.log("User detected, redirecting...", user.role);

      const timer = setTimeout(() => {
        let targetRoute = "";

        if (redirectTo && redirectTo !== "/") {
          targetRoute = redirectTo;
        } else {
          const userRole = (user.role || "").toUpperCase();

          if (userRole === "GUIDE") {
            targetRoute = "/dashboard/guide";
          } else if (userRole === "ADMIN") {
            targetRoute = "/dashboard/admin";
          } else {
            targetRoute = "/dashboard/tourist";
          }
        }

        console.log("Redirecting to:", targetRoute);
        window.location.href = targetRoute;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, formLoading, router, redirectTo]);

  // Function to fill credentials
  const fillCredentials = (role: keyof typeof demoCredentials) => {
    const creds = demoCredentials[role];
    setFormData({
      email: creds.email,
      password: creds.password,
    });
    setError(""); // Clear any previous errors
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);
    setJustLoggedIn(true);

    try {
      // Use the current formData state
      const loginSuccess = await login(formData.email, formData.password);

      if (loginSuccess) {
        console.log("Login successful, user should be:", user);
      } else {
        setError("Invalid email or password. Please try again.");
        setJustLoggedIn(false);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setJustLoggedIn(false);
    } finally {
      setFormLoading(false);
    }
  };

  // Show loading state
  if (isLoading || (justLoggedIn && formLoading)) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {justLoggedIn ? "Logging in..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Demo Credentials Buttons - ADD THIS SECTION */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 text-center mb-3">
          Try demo credentials:
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Object.entries(demoCredentials).map(([key, cred]) => {
            const Icon = cred.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() =>
                  fillCredentials(key as keyof typeof demoCredentials)
                }
                className={`flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br ${cred.color} text-white hover:opacity-90 transition-opacity`}
                disabled={formLoading || isLoading}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{cred.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 text-center">
          Click any button to auto-fill credentials
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Debug info - remove in production */}
        {user && (
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-sm">
            You are already logged in as {user.name}. Redirecting...
          </div>
        )}

        {/* Email Input - UPDATED to use controlled input */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 mt-3" />
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="you@example.com"
            className="pl-12"
            required
            disabled={formLoading || isLoading}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* Password Input - UPDATED to use controlled input */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 mt-3" />
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            label="Password"
            placeholder="Enter your password"
            className="pl-12 pr-12"
            required
            disabled={formLoading || isLoading}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 mt-3"
            disabled={formLoading || isLoading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="remember"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={formLoading || isLoading}
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={formLoading || isLoading}
        >
          {formLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Sign Up Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
