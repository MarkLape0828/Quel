// This is an AI-powered agent that answers questions about HOA documents.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentFAQGeneratorInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document to use for generating FAQs, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question to ask about the document.'),
});
export type DocumentFAQGeneratorInput = z.infer<
  typeof DocumentFAQGeneratorInputSchema
>;

const DocumentFAQGeneratorOutputSchema = z.object({
  answer: z.string().describe('The summarized answer to the question.'),
});
export type DocumentFAQGeneratorOutput = z.infer<
  typeof DocumentFAQGeneratorOutputSchema
>;

export async function documentFAQGenerator(
  input: DocumentFAQGeneratorInput
): Promise<DocumentFAQGeneratorOutput> {
  return documentFAQGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentFAQGeneratorPrompt',
  input: {schema: DocumentFAQGeneratorInputSchema},
  output: {schema: DocumentFAQGeneratorOutputSchema},
  prompt: `You are an AI assistant that answers questions about documents.

  You will be given a document and a question. You will answer the question using the document.

  Document: {{media url=documentDataUri}}
  Question: {{{question}}}
  Answer: `,
});

const documentFAQGeneratorFlow = ai.defineFlow(
  {
    name: 'documentFAQGeneratorFlow',
    inputSchema: DocumentFAQGeneratorInputSchema,
    outputSchema: DocumentFAQGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
