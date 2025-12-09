"use client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";
import LoginForm from "@/components/modules/Auth/LoginForm";
import { useAuth } from "@/actions/useAuth";

// export const metadata = {
//   title: "Login | LocalGuide",
//   description:
//     "Sign in to your LocalGuide account to book tours or manage your guide listings.",
// };

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect || "/";
  const { user } = useAuth();

  // Check if user is already logged in (server-side)
  const currentUser = user;
  console.log(currentUser, "fix fix fix");

  if (currentUser) {
    if (redirectTo !== "/") {
      redirect(redirectTo);
    } else {
      const userRole = currentUser.role;
      if (userRole === "GUIDE") {
        redirect("/dashboard/guide/my-listings");
      } else if (userRole === "ADMIN") {
        redirect("/dashboard/admin/users");
      } else {
        redirect("/dashboard/tourist/wishlist");
      }
    }
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

        {/* Login Form - Client Component */}
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
