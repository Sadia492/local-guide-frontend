"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";
import LoginForm from "@/components/modules/Auth/LoginForm";
import { useAuth } from "@/actions/useAuth";

// Create a separate component that uses useSearchParams
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const { user, isLoading } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // If user is authenticated, redirect them
    if (!isLoading && user) {
      console.log("User is logged in, redirecting...", user);

      if (redirectTo !== "/") {
        router.push(redirectTo);
      } else {
        const userRole = user.role;
        if (userRole === "GUIDE") {
          router.push("/dashboard/guide/my-listings");
        } else if (userRole === "ADMIN") {
          router.push("/dashboard/admin/users");
        } else {
          router.push("/dashboard/tourist/wishlist");
        }
      }
    } else if (!isLoading) {
      setIsCheckingAuth(false);
    }
  }, [user, isLoading, router, redirectTo]);

  // Show loading while checking auth
  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
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
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}

// Main component with Suspense
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
