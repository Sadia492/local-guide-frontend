import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/services/auth/auth.service";

interface AlreadyLoggedInProps {
  user: User;
  redirectTo: string;
}

export default function AlreadyLoggedIn({
  user,
  redirectTo,
}: AlreadyLoggedInProps) {
  const handleRedirect = () => {
    if (redirectTo !== "/") {
      redirect(redirectTo);
    } else {
      // Default redirect based on role
      const userRole = user.role;
      if (userRole === "GUIDE") {
        redirect("/dashboard/guide/my-listings");
      } else if (userRole === "ADMIN") {
        redirect("/dashboard/admin/users");
      } else {
        redirect("/dashboard/tourist/wishlist");
      }
    }
  };

  // Auto-redirect after 3 seconds
  setTimeout(() => {
    handleRedirect();
  }, 3000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          You're Already Logged In!
        </h1>

        <p className="text-gray-600 mb-6">
          Hi <span className="font-semibold">{user.name}</span>, you are already
          signed in. You will be redirected shortly...
        </p>

        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === "GUIDE"
                  ? "bg-green-100 text-green-800"
                  : user.role === "ADMIN"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>

        <Button onClick={handleRedirect} variant="primary" className="w-full">
          Continue to Dashboard
        </Button>

        <div className="mt-6">
          <p className="text-sm text-gray-500">Redirecting in 3 seconds...</p>
        </div>
      </div>
    </div>
  );
}
