'use server';
/**
 * @fileOverview Provides a coping suggestion based on a user's mood.
 *
 * - getCopingSuggestion - A function that returns a supportive suggestion.
 * - GetCopingSuggestionInput - The input type for the function.
 * - GetCopingSuggestionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCopingSuggestionInputSchema = z.object({
  mood: z.string().describe("The user's selected mood (e.g., 'Happy', 'Stressed', 'Sad')."),
});
export type GetCopingSuggestionInput = z.infer<typeof GetCopingSuggestionInputSchema>;

const GetCopingSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('A short, actionable, and supportive coping suggestion.'),
});
export type GetCopingSuggestionOutput = z.infer<typeof GetCopingSuggestionOutputSchema>;


export async function getCopingSuggestion(input: GetCopingSuggestionInput): Promise<GetCopingSuggestionOutput> {
  return getCopingSuggestionFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getCopingSuggestionPrompt',
    input: { schema: GetCopingSuggestionInputSchema },
    output: { schema: GetCopingSuggestionOutputSchema },
    prompt: `You are an empathetic wellness coach for a student with dyslexia. A user has selected their current mood. 
    
    Your task is to provide a single, short (1-2 sentences), actionable, and supportive coping suggestion appropriate for their mood.
    
    - If the mood is 'Happy', suggest something to savor the moment.
    - If the mood is 'Okay' or 'Meh', suggest a gentle activity to boost their spirits.
    - If the mood is 'Stressed' or 'Sad', suggest a simple, calming action. Avoid complex advice.

    User's Mood: "{{{mood}}}"
    `,
});

const getCopingSuggestionFlow = ai.defineFlow(
  {
    name: 'getCopingSuggestionFlow',
    inputSchema: GetCopingSuggestionInputSchema,
    outputSchema: GetCopingSuggestionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get coping suggestion.');
    }
    return output;
  }
);
