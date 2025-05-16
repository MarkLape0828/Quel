
import { z } from "zod";

export const VisitorPassRequestSchema = z.object({
  visitorName: z.string().min(2, "Visitor name must be at least 2 characters.").max(100),
  visitDate: z.date({
    required_error: "Visit date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  visitStartTime: z.string().optional() // e.g., "10:00 AM" or using a regex like /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ for HH:MM
    .refine(val => !val || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s(AM|PM)$/i.test(val), {
        message: "Invalid time format (e.g., 10:00 AM or 14:30).",
    }).optional(),
  durationHours: z.coerce.number().int().positive("Duration must be a positive whole number of hours.").min(1).max(24).optional(),
  vehiclePlate: z.string().max(15, "Vehicle plate must be less than 15 characters.").optional(),
});

export type VisitorPassFormValues = z.infer<typeof VisitorPassRequestSchema>;
