"use client";

import { useEffect, useState } from "react";
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
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only run checks after initial load and not during loading
    if (!isLoading && !hasChecked) {
      setHasChecked(true);

      // If not authenticated at all
      if (!isAuthenticated || !user) {
        console.log("Not authenticated, redirecting to login");
        router.push(`/login?redirect=${window.location.pathname}`);
        return;
      }

      // Check if user has required role
      if (!allowedRoles.includes(user.role)) {
        console.log(
          `User role ${user.role} not in allowed roles:`,
          allowedRoles
        );

        // Redirect based on role
        const redirectPath =
          {
            TOURIST: "/dashboard/tourist/wishlist",
            GUIDE: "/dashboard/guide/my-listings",
            ADMIN: "/dashboard/admin/users",
          }[user.role] || "/";

        router.push(redirectPath);
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, router, allowedRoles, hasChecked]);

  // Show loading only on initial load
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show nothing while checking (prevent flash)
  if (!hasChecked) {
    return null;
  }

  // If authenticated with correct role, show children
  if (isAuthenticated && user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Otherwise show nothing (will redirect)
  return null;
}
