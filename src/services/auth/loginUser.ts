"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/server-fetch";

export const loginUser = async (prevState: any, formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    const response = await serverFetch.post("/auth/login", {
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Login failed",
      };
    }

    // Store data in cookies
    const cookieStore = await cookies();

    if (result.data?.accessToken) {
      cookieStore.set("token", result.data.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }

    if (result.data?.user) {
      cookieStore.set(
        "user",
        JSON.stringify({
          id: result.data.user.id,
          name: result.data.user.name,
          email: result.data.user.email,
          role: result.data.user.role,
        }),
        {
          maxAge: 60 * 60 * 24,
          path: "/",
        }
      );
    }

    // Redirect based on role
    const role = result.data?.user?.role || "tourist";

    if (role === "GUIDE") {
      redirect("/dashboard/guide");
    } else if (role === "ADMIN") {
      redirect("/dashboard/admin");
    } else {
      redirect("/dashboard/tourist");
    }
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      message: error.message || "Login failed",
    };
  }
};
