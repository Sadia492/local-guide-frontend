"use client";
import React, { useState, useEffect } from "react";
import { MapPin, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/actions/useAuth";
import Link from "next/link";

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Check redirect parameter
  const redirectTo = searchParams.get("redirect") || "/";

  // Handle auto-redirect more carefully
  useEffect(() => {
    if (user && !isLoading && !formLoading) {
      console.log("User is logged in, checking if we should redirect...");

      // Only redirect if we're on the login page (not during form submission)
      const timer = setTimeout(() => {
        console.log("Auto-redirecting logged in user from login page");

        // Redirect based on role or to the original redirect destination
        if (redirectTo !== "/") {
          router.push(redirectTo);
        } else {
          // Default redirect based on role
          const userRole = user.role;
          if (userRole === "GUIDE" || userRole === "guide") {
            router.push("/dashboard/guide");
          } else if (userRole === "ADMIN" || userRole === "admin") {
            router.push("/dashboard/admin");
          } else {
            router.push("/dashboard/tourist");
          }
        }
      }, 500); // Small delay to prevent immediate redirect during page load

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, formLoading, router, redirectTo]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Logging in with:", { email, password });

    try {
      // Use the login function from useAuth
      const loginSuccess = await login(email, password);

      if (loginSuccess) {
        console.log("Login successful!");

        // Get the redirect destination
        console.log("Redirecting to:", redirectTo);

        // Small delay to ensure state updates
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 100);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Show loading state only during initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // REMOVED the "if (user)" check here - let useEffect handle the redirect
  // This prevents the component from rendering something different during redirect

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href={"/"}
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <MapPin className="w-10 h-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">LocalGuide</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue your adventure</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
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

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 mt-3" />
              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="you@example.com"
                className="pl-12"
                required
                disabled={formLoading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 mt-3" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                placeholder="Enter your password"
                className="pl-12 pr-12"
                required
                disabled={formLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 mt-3"
                disabled={formLoading}
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
                  disabled={formLoading}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={formLoading}
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
      </div>
    </div>
  );
}

export default LoginPage;
