import { z } from "zod";

export const ServiceRequestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(100, "Title must be less than 100 characters."),
  description: z.string().min(10, "Description must be at least 10 characters long.").max(1000, "Description must be less than 1000 characters."),
  category: z.enum(["maintenance", "security", "other"], {
    required_error: "Please select a category.",
  }),
  location: z.string().optional(),
});

export type ServiceRequestFormValues = z.infer<typeof ServiceRequestSchema>;
