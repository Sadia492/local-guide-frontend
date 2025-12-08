"use server";

import { cookies } from "next/headers";
import { RegisterData, registerUser } from "./auth.service";

export async function register(
  data: RegisterData,
  profilePhoto?: File
): Promise<{ success: boolean; error?: string; user?: any }> {
  try {
    const result = await registerUser(data, profilePhoto);

    if (result.success) {
      // Set session cookie if needed
      const cookieStore = await cookies();
      // You can set authentication cookies here if your API returns them

      return {
        success: true,
        user: result.data?.user,
      };
    }

    return {
      success: false,
      error: result.message || "Registration failed",
    };
  } catch (error: any) {
    console.error("Registration action error:", error);
    return {
      success: false,
      error: error.message || "Something went wrong. Please try again.",
    };
  }
}
