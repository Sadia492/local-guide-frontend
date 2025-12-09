import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth/auth.service";
import RegisterClient from "@/components/modules/Auth/RegisterForm";

export const metadata = {
  title: "Register | LocalGuide - Create Your Account",
  description:
    "Join LocalGuide as a tourist or guide. Start your journey with local experts and authentic experiences.",
};

interface RegisterPageProps {
  searchParams: Promise<{
    role?: string;
  }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const initialRole = params.role || "tourist";

  // Check if user is already logged in (server-side)
  const currentUser = await getCurrentUser();

  if (currentUser) {
    // Redirect based on role
    const userRole = currentUser.role;
    if (userRole === "GUIDE") {
      redirect("/dashboard/guide/my-listings");
    } else if (userRole === "ADMIN") {
      redirect("/dashboard/admin/users");
    } else {
      redirect("/dashboard/tourist/wishlist");
    }
  }

  // Pass initial role to the client component
  return <RegisterClient initialRole={initialRole} />;
}
