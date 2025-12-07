// app/(dashboard)/dashboard/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/shared/Sidebar";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.data);

            // Check if user has access to the current dashboard route
            const currentRole = data.data.role; // "TOURIST", "GUIDE", or "ADMIN"
            const currentPath = pathname; // e.g., "/dashboard/guide"

            console.log(
              `User role: ${currentRole}, Current path: ${currentPath}`
            );

            // Define which roles can access which dashboard sections
            if (
              currentPath.startsWith("/dashboard/tourist") &&
              currentRole !== "TOURIST"
            ) {
              console.log(
                `Tourist trying to access ${currentPath}, redirecting...`
              );
              // Redirect to appropriate dashboard
              if (currentRole === "GUIDE") router.push("/dashboard/guide");
              else if (currentRole === "ADMIN") router.push("/dashboard/admin");
              else router.push("/dashboard/tourist");
              return;
            }

            if (
              currentPath.startsWith("/dashboard/guide") &&
              currentRole !== "GUIDE"
            ) {
              console.log(
                `Guide trying to access ${currentPath}, redirecting...`
              );
              if (currentRole === "TOURIST") router.push("/dashboard/tourist");
              else if (currentRole === "ADMIN") router.push("/dashboard/admin");
              else router.push("/dashboard/guide");
              return;
            }

            if (
              currentPath.startsWith("/dashboard/admin") &&
              currentRole !== "ADMIN"
            ) {
              console.log(
                `Admin trying to access ${currentPath}, redirecting...`
              );
              if (currentRole === "TOURIST") router.push("/dashboard/tourist");
              else if (currentRole === "GUIDE") router.push("/dashboard/guide");
              else router.push("/");
              return;
            }
          } else {
            console.log("Auth failed, redirecting to login");
            router.push("/login");
          }
        } else {
          console.log("API call failed, redirecting to login");
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If no user (should have redirected by now), show nothing
  if (!user) {
    return null;
  }

  // User is authenticated and has correct role, show the dashboard
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed but responsive */}
      <div className="fixed inset-y-0 left-0 z-40">
        <Sidebar />
      </div>

      {/* Main Content - Responsive spacing */}
      <div className="flex-1 w-full lg:ml-64 lg:w-auto transition-all duration-300">
        <div className="min-h-screen overflow-auto p-6">
          {/* Welcome message */}
          {/* <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {user.role === "TOURIST" && "Manage your trips and bookings"}
              {user.role === "GUIDE" && "Manage your tours and bookings"}
              {user.role === "ADMIN" && "Manage platform users and content"}
            </p>
          </div> */}

          {/* Dashboard content */}
          {children}
        </div>
      </div>
    </div>
  );
}
