// components/auth/ProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/actions/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated at all
      if (!isAuthenticated || !user) {
        router.push(`/login?redirect=${window.location.pathname}`);
        return;
      }

      // Check if user has required role
      if (!allowedRoles.includes(user.role)) {
        // Redirect based on role
        if (user.role === "TOURIST") {
          router.push("/dashboard/tourist/wishlist");
        } else if (user.role === "GUIDE") {
          router.push("/dashboard/guide/my-listings");
        } else if (user.role === "ADMIN") {
          router.push("/dashboard/admin/users");
        } else {
          router.push("/");
        }
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, router, allowedRoles]);

  // Show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated or wrong role, show nothing (will redirect)
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
