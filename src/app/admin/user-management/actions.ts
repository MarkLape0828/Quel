
"use server";

import { mockUsers, USER_ROLES } from "@/lib/mock-data";
import type { User, UserRole } from "@/lib/types";
import { z } from "zod";

export async function getUsers(): Promise<User[]> {
  // In a real app, fetch from a database
  // Return a copy to prevent direct modification of the mock array
  return Promise.resolve([...mockUsers].sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)));
}

const UpdateUserRoleSchema = z.object({
  userId: z.string().min(1),
  newRole: z.enum(USER_ROLES as [UserRole, ...UserRole[]]), // Ensure Zod gets a non-empty array of roles
});

export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const validation = UpdateUserRoleSchema.safeParse({ userId, newRole });
    if (!validation.success) {
      return { success: false, message: `Validation failed: ${validation.error.errors.map(e => e.message).join(', ')}` };
    }

    const userIndex = mockUsers.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    mockUsers[userIndex].role = newRole;
    
    console.log("User role updated:", mockUsers[userIndex]);
    return { success: true, message: "User role updated successfully.", user: { ...mockUsers[userIndex] } };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, message: "An unexpected error occurred while updating user role." };
  }
}