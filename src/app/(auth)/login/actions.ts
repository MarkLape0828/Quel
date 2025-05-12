
"use server";

import { z } from "zod";
import { LoginSchema } from "./schema";
import { redirect } from "next/navigation"; // For future use

export async function loginUser(
  values: z.infer<typeof LoginSchema>
): Promise<{ success: boolean; message: string; role?: "user" | "admin"; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = LoginSchema.parse(values);
    console.log("Attempting login with:", validatedData);

    // Mock login logic
    if (validatedData.email === "admin@example.com" && validatedData.password === "adminpass") {
      // In a real app, you would set a session/cookie here and then redirect.
      // redirect("/admin/dashboard"); // Example redirect for admin
      return { success: true, message: "Admin login successful!", role: "admin" };
    }
    if (validatedData.email === "user@example.com" && validatedData.password === "userpass") {
      // redirect("/community-feed"); // Example redirect for user
      return { success: true, message: "User login successful!", role: "user" };
    }

    return { success: false, message: "Invalid email or password." };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Login error:", error);
    return { success: false, message: "An unexpected error occurred during login." };
  }
}
