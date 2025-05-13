
"use server";

import { z } from "zod";
import { ProfileSchema } from "./schema";
import { updateUserProfile as updateUserProfileGeneral, getCurrentUser as getCurrentUserGeneral } from "@/lib/user-actions";
import type { User } from "@/lib/types";

export async function getCurrentUserData(userId: string): Promise<User | null> {
    // This is a mock. In a real app, you'd get the logged-in user's ID from session/auth.
    return getCurrentUserGeneral(userId);
}

export async function updateUserProfile(
  userId: string, // User ID should be obtained securely, e.g., from session
  values: z.infer<typeof ProfileSchema>
): ReturnType<typeof updateUserProfileGeneral> {
  // Delegate to the general user action
  return updateUserProfileGeneral(userId, values);
}
