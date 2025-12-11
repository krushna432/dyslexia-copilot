'use server';
/**
 * @fileOverview Generates encouraging feedback for a user practicing their reading.
 *
 * - getReadingFeedback - A function that compares original text to user-spoken text and provides feedback.
 * - GetReadingFeedbackInput - The input type for the function.
 * - GetReadingFeedbackOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetReadingFeedbackInputSchema = z.object({
  originalText: z.string().describe('The text the user was supposed to read.'),
  userText: z.string().describe('The text the user actually spoke, captured by speech-to-text.'),
});
export type GetReadingFeedbackInput = z.infer<typeof GetReadingFeedbackInputSchema>;

const GetReadingFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Encouraging and emotionally supportive feedback for the user.'),
});
export type GetReadingFeedbackOutput = z.infer<typeof GetReadingFeedbackOutputSchema>;


export async function getReadingFeedback(input: GetReadingFeedbackInput): Promise<GetReadingFeedbackOutput> {
  return getReadingFeedbackFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getReadingFeedbackPrompt',
    input: { schema: GetReadingFeedbackInputSchema },
    output: { schema: GetReadingFeedbackOutputSchema },
    prompt: `You are an empathetic and encouraging reading coach for a user with dyslexia. Your goal is to provide positive reinforcement and gentle correction.

    The user was asked to read the "Original Text". Their attempt was captured as the "User's Spoken Text".

    Analyze the differences.
    - If the texts are identical or very close, praise the user enthusiastically.
    - If there are minor mistakes, praise their effort and gently point out one or two words they can practice. Frame it as a small challenge, not a failure.
    - If the texts are very different, be extra gentle. Acknowledge that some days are tougher than others and encourage them to try again when they're ready. Avoid making them feel overwhelmed.

    Always use a supportive and friendly tone. Start with a positive comment. Keep the feedback concise (2-3 sentences).

    Original Text:
    "{{{originalText}}}"

    User's Spoken Text:
    "{{{userText}}}"
    `,
});

const getReadingFeedbackFlow = ai.defineFlow(
  {
    name: 'getReadingFeedbackFlow',
    inputSchema: GetReadingFeedbackInputSchema,
    outputSchema: GetReadingFeedbackOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get reading feedback.');
    }
    return output;
  }
);
