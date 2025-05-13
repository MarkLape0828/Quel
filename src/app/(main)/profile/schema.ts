
import { z } from "zod";

export const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  contactNumber: z.string().optional()
    .refine(val => !val || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val), {
      message: "Invalid phone number format."
    }),
  // Password change could be a separate field/schema if needed
  // currentPassword: z.string().optional(),
  // newPassword: z.string().min(8, "New password must be at least 8 characters.").optional(),
  // confirmNewPassword: z.string().optional(),
});
// .refine(data => {
//   if (data.newPassword && !data.currentPassword) {
//     return false; // Require current password if new password is set
//   }
//   return true;
// }, { message: "Current password is required to set a new password.", path: ["currentPassword"]})
// .refine(data => data.newPassword === data.confirmNewPassword, {
//   message: "New passwords do not match.",
//   path: ["confirmNewPassword"],
// });


export type ProfileFormValues = z.infer<typeof ProfileSchema>;
