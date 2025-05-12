"use server";

import { documentFAQGenerator, type DocumentFAQGeneratorInput, type DocumentFAQGeneratorOutput } from "@/ai/flows/document-faq-generator";
import { z } from "zod";

const AIRequestSchema = z.object({
  documentDataUri: z.string().refine(val => val.startsWith('data:'), {
    message: "Document data URI must start with 'data:'."
  }),
  question: z.string().min(5, "Question must be at least 5 characters long."),
});

export async function getAIResponse(
  input: DocumentFAQGeneratorInput
): Promise<{ success: boolean; data?: DocumentFAQGeneratorOutput; error?: string; fieldErrors?: any }> {
  try {
    const validatedInput = AIRequestSchema.parse(input);
    
    const result = await documentFAQGenerator(validatedInput);
    return { success: true, data: result };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation failed.", fieldErrors: error.flatten().fieldErrors };
    }
    console.error("AI Assistant Error:", error);
    // Check if error is an object and has a message property
    const errorMessage = (typeof error === 'object' && error !== null && 'message' in error) 
                         ? String((error as { message: string }).message) 
                         : "An unexpected error occurred while processing your request.";
    return { success: false, error: errorMessage };
  }
}
