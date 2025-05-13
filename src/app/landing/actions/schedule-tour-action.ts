
"use server";

import { z } from "zod";
import { ScheduleTourSchema } from "../schemas/schedule-tour-schema";

export async function submitScheduleTourRequest(
  values: z.infer<typeof ScheduleTourSchema>
): Promise<{ success: boolean; message: string; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    // The date comes as a Date object from react-day-picker, but when serialized for the server action,
    // it might be a string. Zod schema expects a Date object if not string-coerced.
    // For simplicity here, we'll assume it's handled correctly by the form or coerced.
    // If `values.preferredDate` is a string, you might need `ScheduleTourSchema.parse({ ...values, preferredDate: new Date(values.preferredDate) })`
    // Or adjust schema to use `z.coerce.date()`
    
    const validatedData = ScheduleTourSchema.parse(values);
    
    console.log("Schedule Tour Request Received:", validatedData);

    // Mock submission logic: In a real app, you would save this to a database,
    // send an email notification, etc.
    // For now, we'll just simulate success.

    return { 
        success: true, 
        message: "Your tour request has been submitted successfully! We will contact you shortly to confirm." 
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: "Validation failed. Please check your input.", 
        errors: error.flatten().fieldErrors 
      };
    }
    console.error("Schedule Tour Request Error:", error);
    return { 
        success: false, 
        message: "An unexpected error occurred. Please try again later." 
    };
  }
}
