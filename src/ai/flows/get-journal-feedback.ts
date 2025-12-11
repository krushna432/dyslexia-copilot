'use server';
/**
 * @fileOverview Provides empathetic feedback on a user's journal entry.
 *
 * - getJournalFeedback - A function that analyzes a journal entry and offers support.
 * - GetJournalFeedbackInput - The input type for the function.
 * - GetJournalFeedbackOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetJournalFeedbackInputSchema = z.object({
  journalText: z.string().describe('The user\'s journal entry.'),
});
export type GetJournalFeedbackInput = z.infer<typeof GetJournalFeedbackInputSchema>;

const GetJournalFeedbackOutputSchema = z.object({
  feedback: z.string().describe('A short, supportive, and empathetic response to the journal entry, including gentle, actionable suggestions if the sentiment is negative.'),
  sentiment: z.enum(['positive', 'neutral', 'negative']).describe('The overall sentiment of the journal entry.'),
});
export type GetJournalFeedbackOutput = z.infer<typeof GetJournalFeedbackOutputSchema>;


export async function getJournalFeedback(input: GetJournalFeedbackInput): Promise<GetJournalFeedbackOutput> {
  return getJournalFeedbackFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getJournalFeedbackPrompt',
    input: { schema: GetJournalFeedbackInputSchema },
    output: { schema: GetJournalFeedbackOutputSchema },
    prompt: `You are an empathetic and supportive wellness coach for students. A user has shared a journal entry with you.
    
    Your task is to:
    1.  Analyze the sentiment of the text (positive, neutral, or negative).
    2.  Write a supportive and non-judgmental response that is 3-4 sentences long.
        - If the sentiment is positive, celebrate with them and encourage them to savor the feeling.
        - If the sentiment is neutral, be encouraging and perhaps ask a gentle reflective question.
        - If the sentiment is negative, first validate their feelings. Then, offer one or two small, simple, and actionable suggestions that might help them. Frame these as gentle ideas, not commands. For example, if they feel unmotivated to study, you could suggest breaking it down into a tiny 5-minute task or taking a short walk first.

    User's Journal Entry:
    "{{{journalText}}}"
    `,
});

const getJournalFeedbackFlow = ai.defineFlow(
  {
    name: 'getJournalFeedbackFlow',
    inputSchema: GetJournalFeedbackInputSchema,
    outputSchema: GetJournalFeedbackOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get journal feedback.');
    }
    return output;
  }
);
