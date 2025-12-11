'use server';
/**
 * @fileOverview Summarizes text for quick review.
 *
 * - summarizeTextForReview - A function that handles the summarization process.
 * - SummarizeTextForReviewInput - The input type for the summarizeTextForReview function.
 * - SummarizeTextForReviewOutput - The return type for the summarizeTextForReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTextForReviewInputSchema = z.object({
  text: z.string().describe('The text to summarize.'),
});
export type SummarizeTextForReviewInput = z.infer<typeof SummarizeTextForReviewInputSchema>;

const SummarizeTextForReviewOutputSchema = z.object({
  summary: z.string().describe('A short summary of the text.'),
});
export type SummarizeTextForReviewOutput = z.infer<typeof SummarizeTextForReviewOutputSchema>;

export async function summarizeTextForReview(input: SummarizeTextForReviewInput): Promise<SummarizeTextForReviewOutput> {
  return summarizeTextForReviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTextForReviewPrompt',
  input: {schema: SummarizeTextForReviewInputSchema},
  output: {schema: SummarizeTextForReviewOutputSchema},
  prompt: `Summarize the following text in a few sentences:\n\n{{{text}}}`,
});

const summarizeTextForReviewFlow = ai.defineFlow(
  {
    name: 'summarizeTextForReviewFlow',
    inputSchema: SummarizeTextForReviewInputSchema,
    outputSchema: SummarizeTextForReviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
