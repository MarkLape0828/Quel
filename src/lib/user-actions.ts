
"use server";

import { z } from "zod";
import { mockUsers } from "./mock-data";
import type { User } from "./types";
// Assuming ProfileSchema exists in a shared location or defined here
// For now, let's use a specific schema for this action if it differs.

// This schema is for the data expected by the update function.
// It might be the same as the form schema or a subset.
const UpdateUserProfileDataSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  // Add other editable fields here if necessary
});
type UpdateUserProfileData = z.infer<typeof UpdateUserProfileDataSchema>;


export async function getCurrentUser(userId: string): Promise<User | null> {
  // In a real app, this would involve fetching from a database or auth service
  const user = mockUsers.find(u => u.id === userId);
  return user ? { ...user } : null; // Return a copy
}

export async function updateUserProfile(
  userId: string,
  values: UpdateUserProfileData
): Promise<{ success: boolean; message: string; user?: User; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = UpdateUserProfileDataSchema.parse(values);

    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    // Check if email is being changed to one that already exists (excluding the current user)
    if (validatedData.email !== mockUsers[userIndex].email && mockUsers.some(u => u.email === validatedData.email && u.id !== userId)) {
        return { success: false, message: "Email already in use by another account.", errors: { email: ["This email address is already associated with another account."]}};
    }
    
    // Update only allowed fields
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      // Do not update role, propertyId, propertyAddress here unless intended for this action
    };
    
    console.log("User profile updated:", mockUsers[userIndex]);
    return { success: true, message: "Profile updated successfully.", user: { ...mockUsers[userIndex] } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error updating user profile:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
