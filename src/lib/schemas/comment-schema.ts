
import { z } from "zod";

export const AddCommentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty.").max(1000, "Comment is too long. Please keep it under 1000 characters."),
  // Note: File objects cannot be directly validated by Zod in server actions in the same way.
  // File data (e.g., Data URI) will be handled in the action itself.
  // Client-side validation for file type/size can be done separately if needed.
});

export type AddCommentFormValues = z.infer<typeof AddCommentSchema>;
