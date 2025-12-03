"use client";
import React, { useState, useTransition } from "react";
import { MapPin, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/actions/useAuth";
import Link from "next/link";

function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { login, user, isLoading, checkAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

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

        // Re-fetch user data from backend to get updated user info
        const updatedUser = await checkAuth();

        if (updatedUser) {
          console.log("Updated user:", updatedUser);
          const userRole = updatedUser.role;
          console.log("Redirecting with role:", userRole);

          // Use startTransition for navigation
          startTransition(() => {
            // Redirect based on role
            if (userRole === "GUIDE" || userRole === "guide") {
              router.push("/dashboard/guide");
            } else if (userRole === "ADMIN" || userRole === "admin") {
              router.push("/dashboard/admin");
            } else {
              router.push("/");
            }

            // Force a refresh to update auth state globally
            router.refresh();
          });
        } else {
          setError(
            "Login successful but couldn't fetch user data. Please refresh."
          );
        }
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

  // Handle redirect if user is already logged in using useEffect
  React.useEffect(() => {
    if (user && !isLoading) {
      console.log("User already logged in, redirecting...", user);
      const userRole = user.role;

      startTransition(() => {
        if (userRole === "GUIDE" || userRole === "guide") {
          router.push("/dashboard/guide");
        } else if (userRole === "ADMIN" || userRole === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/");
        }
      });
    }
  }, [user, isLoading, router, startTransition]);

  if (isLoading || isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user exists, show loading screen while redirecting
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

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

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 mt-3" />
              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="you@example.com"
                className="pl-12"
                required
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 mt-3"
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
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
