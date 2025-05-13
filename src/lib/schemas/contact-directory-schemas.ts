
import { z } from "zod";

export const SocialMediaLinkSchema = z.object({
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
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  socialMediaLinks: z.array(SocialMediaLinkSchema).optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters.").optional(),
});

export type DirectoryContactFormValues = z.infer<typeof DirectoryContactSchema>;
