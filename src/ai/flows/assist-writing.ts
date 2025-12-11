'use server';
/**
 * @fileOverview Provides writing assistance for users with dyslexia.
 *
 * - assistWriting - A function that corrects text for spelling and grammar.
 * - AssistWritingInput - The input type for the function.
 * - AssistWritingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CorrectionSchema = z.object({
  original: z.string().describe('The original incorrect word or phrase.'),
  corrected: z.string().describe('The suggested correction.'),
  explanation: z.string().describe('A simple, clear explanation for the correction, tailored for someone with dyslexia.'),
});

const AssistWritingInputSchema = z.object({
  text: z.string().describe('The text to be corrected.'),
});
export type AssistWritingInput = z.infer<typeof AssistWritingInputSchema>;

const AssistWritingOutputSchema = z.object({
  correctedText: z.string().describe('The full text with corrections applied.'),
  corrections: z.array(CorrectionSchema).describe('An array of corrections made.'),
});
export type AssistWritingOutput = z.infer<typeof AssistWritingOutputSchema>;


export async function assistWriting(input: AssistWritingInput): Promise<AssistWritingOutput> {
  return assistWritingFlow(input);
}

const prompt = ai.definePrompt({
    name: 'assistWritingPrompt',
    input: { schema: AssistWritingInputSchema },
    output: { schema: AssistWritingOutputSchema },
    prompt: `You are a writing assistant for users with dyslexia. Analyze the provided text for spelling mistakes, grammatical errors, and common dyslexic patterns (like b/d reversals, their/there confusion).

    Provide a corrected version of the full text.
    Also, provide a list of corrections, each with a simple, one-sentence explanation suitable for a user with dyslexia. Focus on clarity and encouragement.

    For example:
    - "They went to there house." -> "They went to their house." Explanation: "'Their' shows something belongs to people, but 'there' refers to a place."
    - "I saw a big dog, it was very friendly." -> "I saw a big dog. It was very friendly." Explanation: "Use a period to separate two complete thoughts into two sentences."

    Text to analyze:
    {{{text}}}
    `,
});


const assistWritingFlow = ai.defineFlow(
  {
    name: 'assistWritingFlow',
    inputSchema: AssistWritingInputSchema,
    outputSchema: AssistWritingOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get writing assistance.');
    }
    return output;
  }
);
