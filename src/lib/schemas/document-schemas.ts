
import { z } from "zod";

// Schema for adding a new document (subset of DocumentItem)
export const AddDocumentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters.").max(100),
  type: z.enum(["guideline", "minutes", "form", "report", "user-specific"]),
  userId: z.string().min(1, "User ID is required (or 'hoa_general')."),
  // Mock URL and size for simplicity, in real app this would be from file upload
  url: z.string().url().optional().default("/documents/placeholder.pdf"), 
  size: z.string().optional().default("N/A"),
});
export type AddDocumentFormValues = z.infer<typeof AddDocumentSchema>;
