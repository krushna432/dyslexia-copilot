'use server';
/**
 * @fileOverview AI-powered text simplification for users with dyslexia.
 *
 * - simplifyText - Simplifies complex text for easier understanding.
 * - SimplifyTextForDyslexiaInput - The input type for the simplifyText function.
 * - SimplifyTextForDyslexiaOutput - The return type for the simplifyText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimplifyTextForDyslexiaInputSchema = z.object({
  text: z.string().describe('The complex text to be simplified.'),
});
export type SimplifyTextForDyslexiaInput = z.infer<
  typeof SimplifyTextForDyslexiaInputSchema
>;

const SimplifyTextForDyslexiaOutputSchema = z.object({
  simplifiedText: z
    .string()
    .describe('The simplified version of the input text.'),
});
export type SimplifyTextForDyslexiaOutput = z.infer<
  typeof SimplifyTextForDyslexiaOutputSchema
>;

export async function simplifyText(input: SimplifyTextForDyslexiaInput):
  Promise<SimplifyTextForDyslexiaOutput> {
  return simplifyTextForDyslexiaFlow(input);
}

const simplifyTextForDyslexiaPrompt = ai.definePrompt({
  name: 'simplifyTextForDyslexiaPrompt',
  input: {schema: SimplifyTextForDyslexiaInputSchema},
  output: {schema: SimplifyTextForDyslexiaOutputSchema},
  prompt: `You are an AI assistant designed to simplify complex text for users with dyslexia.

  Please simplify the following text, using simpler words and shorter sentences where possible, while preserving the original meaning.

  Text: {{{text}}}`,
});

const simplifyTextForDyslexiaFlow = ai.defineFlow(
  {
    name: 'simplifyTextForDyslexiaFlow',
    inputSchema: SimplifyTextForDyslexiaInputSchema,
    outputSchema: SimplifyTextForDyslexiaOutputSchema,
  },
  async input => {
    const {output} = await simplifyTextForDyslexiaPrompt(input);
    return output!;
  }
);
