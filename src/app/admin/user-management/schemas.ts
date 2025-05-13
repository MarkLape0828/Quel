"use server";

import { z } from "zod";
import { USER_ROLES } from "@/lib/mock-data";
import type { UserRole } from "@/lib/types";

export const AddUserSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(USER_ROLES as [UserRole, ...UserRole[]], {
    required_error: "User role is required.",
  }),
});
export type AddUserFormValues = z.infer<typeof AddUserSchema>;

export const EditUserSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  role: z.enum(USER_ROLES as [UserRole, ...UserRole[]], {
    required_error: "User role is required.",
  }),
});
export type EditUserFormValues = z.infer<typeof EditUserSchema>;