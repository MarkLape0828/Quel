
"use server";

import { z } from "zod";
import { mockDirectoryContacts } from "./mock-data";
import type { DirectoryContact, SocialMediaLink } from "./types";

// Use a mutable store for actions
let directoryContactsStore: DirectoryContact[] = [...mockDirectoryContacts];

// --- Schemas for Validation ---
const SocialMediaLinkSchema = z.object({
  platform: z.string().min(1, "Platform name is required."),
  url: z.string().url("Invalid URL format."),
  displayText: z.string().optional(),
});

export const DirectoryContactSchema = z.object({
  name: z.string().min(2, "Contact name must be at least 2 characters."),
  department: z.string().min(2, "Department name must be at least 2 characters."),
  phoneNumber: z.string().optional()
    .refine(val => !val || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val), {
      message: "Invalid phone number format."
    }),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')), // Allow empty string or valid email
  socialMediaLinks: z.array(SocialMediaLinkSchema).optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters.").optional(),
});

export type DirectoryContactFormValues = z.infer<typeof DirectoryContactSchema>;


// --- User-facing Actions ---
export async function getDirectoryContacts(): Promise<DirectoryContact[]> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve([...directoryContactsStore].sort((a,b) => a.department.localeCompare(b.department) || a.name.localeCompare(b.name)));
}


// --- Admin-facing Actions ---
export async function addDirectoryContact(
  values: DirectoryContactFormValues
): Promise<{ success: boolean; message: string; contact?: DirectoryContact; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = DirectoryContactSchema.parse(values);
    
    const newContact: DirectoryContact = {
      id: `contact-${Date.now()}`,
      ...validatedData,
    };

    directoryContactsStore.unshift(newContact); // Add to the beginning
    return { success: true, message: "Contact added successfully!", contact: newContact };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error adding contact:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function updateDirectoryContact(
  id: string,
  values: DirectoryContactFormValues
): Promise<{ success: boolean; message: string; contact?: DirectoryContact; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = DirectoryContactSchema.parse(values);
    const contactIndex = directoryContactsStore.findIndex(c => c.id === id);

    if (contactIndex === -1) {
      return { success: false, message: "Contact not found." };
    }

    directoryContactsStore[contactIndex] = {
      ...directoryContactsStore[contactIndex],
      ...validatedData,
    };
    
    return { success: true, message: "Contact updated successfully.", contact: directoryContactsStore[contactIndex] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error updating contact:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deleteDirectoryContact(
  id: string
): Promise<{ success: boolean; message: string }> {
  const initialLength = directoryContactsStore.length;
  directoryContactsStore = directoryContactsStore.filter(c => c.id !== id);

  if (directoryContactsStore.length < initialLength) {
    return { success: true, message: "Contact deleted successfully." };
  } else {
    return { success: false, message: "Contact not found." };
  }
}
