'use server';

/**
 * @fileOverview Converts an image of text into digital text using OCR.
 *
 * - scanAndConvertText - A function that accepts an image data URI and returns the extracted text.
 * - ScanAndConvertTextInput - The input type for the scanAndConvertText function.
 * - ScanAndConvertTextOutput - The return type for the scanAndConvertText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanAndConvertTextInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the text to scan, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Ensure proper escaping of quotes within the string
    ),
});
export type ScanAndConvertTextInput = z.infer<typeof ScanAndConvertTextInputSchema>;

const ScanAndConvertTextOutputSchema = z.object({
  extractedText: z.string().describe('The extracted text from the image.'),
});
export type ScanAndConvertTextOutput = z.infer<typeof ScanAndConvertTextOutputSchema>;

export async function scanAndConvertText(input: ScanAndConvertTextInput): Promise<ScanAndConvertTextOutput> {
  return scanAndConvertTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanAndConvertTextPrompt',
  input: {schema: ScanAndConvertTextInputSchema},
  output: {schema: ScanAndConvertTextOutputSchema},
  prompt: `You are an OCR (Optical Character Recognition) system. Extract the text from the image provided.  Return only the text content, nothing else.

Image: {{media url=photoDataUri}}`,
});

const scanAndConvertTextFlow = ai.defineFlow(
  {
    name: 'scanAndConvertTextFlow',
    inputSchema: ScanAndConvertTextInputSchema,
    outputSchema: ScanAndConvertTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
