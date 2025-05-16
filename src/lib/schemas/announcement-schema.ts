
import { z } from "zod";

export const AnnouncementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100, "Title must be less than 100 characters."),
  content: z.string().min(10, "Content must be at least 10 characters.").max(2000, "Content must be less than 2000 characters."),
  type: z.enum(["announcement", "event"], {
    required_error: "Please select a type for this item.",
  }),
  author: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid URL for the image.").optional().or(z.literal('')),
  aiHint: z.string().max(50, "AI hint too long").optional(),
});

export type AnnouncementFormValues = z.infer<typeof AnnouncementSchema>;
