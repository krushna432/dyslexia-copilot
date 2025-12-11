'use server';
/**
 * @fileOverview Generates quizzes from text content.
 *
 * - generateQuiz - A function that generates a quiz.
 * - GenerateQuizInput - The input type for the function.
 * - GenerateQuizOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  question: z.string().describe('The question text.'),
  // Making options and answerIndex optional for open-ended questions
  options: z.array(z.string()).optional().describe('An array of possible answers for multiple-choice questions.'),
  answerIndex: z.number().optional().describe('The index of the correct answer in the options array for multiple-choice questions.'),
});

const GenerateQuizInputSchema = z.object({
  text: z.string().describe('The text content to generate the quiz from.'),
  numQuestions: z.number().min(1).max(10).describe('The number of questions to generate.'),
  questionType: z.enum(['multiple-choice', 'open-ended']).describe('The type of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of generated quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert quiz creator for students. Based on the provided text, generate a quiz with the specified number and type of questions.

  Text to use:
  "{{{text}}}"

  Number of questions: {{{numQuestions}}}
  Question type: {{{questionType}}}

  For multiple-choice questions, provide 4 distinct options and identify the correct answer's index.
  For open-ended questions, just provide the question text.
  
  Ensure questions are directly answerable from the provided text.
  `,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error('Failed to generate quiz.');
    }
    return output;
  }
);
