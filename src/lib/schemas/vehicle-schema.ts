
import { z } from "zod";

export const VehicleRegistrationSchema = z.object({
  make: z.string().min(2, "Vehicle make is required.").max(50),
  model: z.string().min(1, "Vehicle model is required.").max(50),
  year: z.string()
    .regex(/^\d{4}$/, "Year must be a 4-digit number.")
    .refine(val => parseInt(val) >= 1900 && parseInt(val) <= new Date().getFullYear() + 1, {
        message: `Year must be between 1900 and ${new Date().getFullYear() + 1}.`
    }),
  color: z.string().min(2, "Vehicle color is required.").max(30),
  licensePlate: z.string().min(2, "License plate is required.").max(15, "License plate too long."),
});

export type VehicleRegistrationFormValues = z.infer<typeof VehicleRegistrationSchema>;
