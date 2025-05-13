
import { z } from "zod";

export const ScheduleTourSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }).max(15).optional(),
  preferredDate: z.date({
    required_error: "A preferred date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  preferredTime: z.string().min(1, {message: "Please select a preferred time."}),
  message: z.string().max(500, {message: "Message must be less than 500 characters."}).optional(),
});

export type ScheduleTourFormValues = z.infer<typeof ScheduleTourSchema>;
