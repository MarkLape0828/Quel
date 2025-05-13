"use server";

import { mockUsers, USER_ROLES } from "@/lib/mock-data";
import type { User, UserRole } from "@/lib/types";
import { z } from "zod";
import { AddUserSchema, EditUserSchema, type AddUserFormValues, type EditUserFormValues } from "./schemas";

export async function getUsers(): Promise<User[]> {
  // In a real app, fetch from a database
  // Return a copy to prevent direct modification of the mock array
  return Promise.resolve([...mockUsers].sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)));
}

const UpdateUserRoleSchema = z.object({
  userId: z.string().min(1),
  newRole: z.enum(USER_ROLES as [UserRole, ...UserRole[]]), 
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

export async function addUser(
  values: AddUserFormValues
): Promise<{ success: boolean; message: string; user?: User; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = AddUserSchema.parse(values);

    if (mockUsers.some(user => user.email === validatedData.email)) {
      return { success: false, message: "Email already in use.", errors: { email: ["This email address is already associated with an account."] } };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      ...validatedData,
      isArchived: false, 
      // In a real app, password would be hashed here
    };
    mockUsers.unshift(newUser); // Add to the beginning for visibility
    console.log("New user added:", newUser);
    return { success: true, message: "User added successfully!", user: newUser };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error adding user:", error);
    return { success: false, message: "An unexpected error occurred while adding user." };
  }
}

export async function updateUser(
  userId: string,
  values: EditUserFormValues
): Promise<{ success: boolean; message: string; user?: User; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = EditUserSchema.parse(values);
    const userIndex = mockUsers.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    // Check if email is being changed to one that already exists (excluding the current user)
    if (validatedData.email !== mockUsers[userIndex].email && mockUsers.some(u => u.email === validatedData.email && u.id !== userId)) {
        return { success: false, message: "Email already in use by another account.", errors: { email: ["This email address is already associated with another account."]}};
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...validatedData,
    };
    
    console.log("User updated:", mockUsers[userIndex]);
    return { success: true, message: "User updated successfully.", user: { ...mockUsers[userIndex] } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error updating user:", error);
    return { success: false, message: "An unexpected error occurred while updating user." };
  }
}

export async function toggleArchiveUser(
  userId: string
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    const currentStatus = mockUsers[userIndex].isArchived || false;
    mockUsers[userIndex].isArchived = !currentStatus;
    
    const action = !currentStatus ? "archived" : "unarchived";
    console.log(`User ${action}:`, mockUsers[userIndex]);
    return { success: true, message: `User ${action} successfully.`, user: { ...mockUsers[userIndex] } };
  } catch (error) {
    console.error(`Error ${mockUsers.find(u=>u.id===userId)?.isArchived ? 'unarchiving' : 'archiving'} user:`, error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function sendPasswordResetEmailAdmin(
  userId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const user = mockUsers.find(user => user.id === userId);
    if (!user) {
      return { success: false, message: "User not found." };
    }

    // Mock email sending
    console.log(`Simulating password reset email sent to: ${user.email} for user ID: ${userId}`);
    // In a real app, you'd generate a token, store it, and send an email with a reset link.
    
    return { success: true, message: `Password reset link sent to ${user.email}.` };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}