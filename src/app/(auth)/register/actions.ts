
"use server";

import { z } from "zod";
import { RegisterSchema } from "./schema";

// Mock user store (in a real app, this would be a database)
const mockUsers: { email: string }[] = [
    { email: "admin@example.com" },
    { email: "user@example.com" },
];

export async function registerUser(
  values: z.infer<typeof RegisterSchema>
): Promise<{ success: boolean; message: string; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = RegisterSchema.parse(values);
    console.log("Attempting registration with:", validatedData);

    // Mock registration logic
    if (mockUsers.find(user => user.email === validatedData.email)) {
      return { success: false, message: "An account with this email already exists." , errors: { email: ["Email already in use."]}};
    }

    // Add to mock users (not really, just pretend)
    // mockUsers.push({ email: validatedData.email, ... }); 
    // In a real app, create user in DB, potentially send verification email.

    return { success: true, message: "Registration successful! Please log in." };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Registration error:", error);
    return { success: false, message: "An unexpected error occurred during registration." };
  }
}
