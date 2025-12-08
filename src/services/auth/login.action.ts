"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LoginResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Invalid email or password",
      };
    }

    // Get the session cookie from response
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const cookieStore = await cookies();
      // Parse and set the cookie
      // This depends on your authentication setup
      // You might need to adjust this based on your cookie format
      const sessionCookie = setCookieHeader.split(";")[0];
      const [name, value] = sessionCookie.split("=");

      cookieStore.set({
        name: name.trim(),
        value: value.trim(),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
