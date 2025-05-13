
import { z } from "zod";

// Re-exporting from the new central schema definition file
export { DirectoryContactSchema } from "@/lib/schemas/contact-directory-schemas";
export type { DirectoryContactFormValues } from "@/lib/schemas/contact-directory-schemas";

// Example of an admin-specific schema if it were different:
// export const AdminDirectoryContactSchema = DirectoryContactSchema.extend({
//   internalAdminNotes: z.string().optional(), 
// });
// export type AdminDirectoryContactFormValues = z.infer<typeof AdminDirectoryContactSchema>;
