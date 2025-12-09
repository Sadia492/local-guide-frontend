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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(
          "Checking auth at:",
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
          {
            method: "GET",
            credentials: "include", // Important for cookies
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Auth response status:", response.status);
        console.log(
          "Auth response headers:",
          Object.fromEntries(response.headers.entries())
        );

        const data = await response.json();
        console.log("Auth response data:", data);

        if (response.ok && data.success) {
          setUser(data.data);

          // Check role-based routing
          const currentRole = data.data.role;
          const currentPath = pathname;

          // Redirect based on role
          if (
            currentRole === "TOURIST" &&
            !currentPath.startsWith("/dashboard/tourist")
          ) {
            router.replace("/dashboard/tourist/wishlist");
          } else if (
            currentRole === "GUIDE" &&
            !currentPath.startsWith("/dashboard/guide")
          ) {
            router.replace("/dashboard/guide/my-listings");
          } else if (
            currentRole === "ADMIN" &&
            !currentPath.startsWith("/dashboard/admin")
          ) {
            router.replace("/dashboard/admin/users");
          }
        } else {
          console.log("Auth failed, redirecting to login");
          window.location.href = `/login?redirect=${encodeURIComponent(
            pathname
          )}`;
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        window.location.href = `/login?redirect=${encodeURIComponent(
          pathname
        )}`;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 z-40">
        <Sidebar />
      </div>
      <div className="flex-1 w-full lg:ml-64 lg:w-auto transition-all duration-300">
        <div className="min-h-screen overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}
