
import { z } from "zod";

// Re-exporting from lib/contact-directory-actions.ts to keep admin-specific schemas here if needed in future
// or if they diverge. For now, they are the same.
export { DirectoryContactSchema } from "@/lib/contact-directory-actions";
export type { DirectoryContactFormValues } from "@/lib/contact-directory-actions";

// Example of an admin-specific schema if it were different:
// export const AdminDirectoryContactSchema = DirectoryContactSchema.extend({
//   internalAdminNotes: z.string().optional(), 
// });
// export type AdminDirectoryContactFormValues = z.infer<typeof AdminDirectoryContactSchema>;
