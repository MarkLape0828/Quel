
import { z } from "zod";

export const AddPersonalEventSchema = z.object({
  title: z.string().min(1, "Title is required.").max(100, "Title is too long."),
  date: z.date({
    required_error: "A date is required.",
  }),
  startTime: z.string().optional()
    .refine(val => !val || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), { // HH:MM format
      message: "Invalid start time format (HH:MM)."
    }),
  endTime: z.string().optional()
  .refine(val => !val || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), { // HH:MM format
    message: "Invalid end time format (HH:MM)."
  }),
  description: z.string().max(500, "Description is too long.").optional(),
  location: z.string().max(100, "Location is too long.").optional(),
  // For user-specific events, category is always 'personal'
  // category: z.literal('personal').default('personal'), 
});

export type AddPersonalEventFormValues = z.infer<typeof AddPersonalEventSchema>;
