
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz-flow.ts';
import '@/ai/flows/simplify-text-for-dyslexia.ts';
import '@/ai/flows/scan-and-convert-text.ts';
import '@/ai/flows/summarize-text-for-review.ts';
import '@/ai/flows/generate-audio-narration.ts';
import '@/ai/flows/assist-writing.ts';
import '@/ai/flows/get-reading-feedback.ts';
import '@/ai/flows/get-journal-feedback.ts';
import '@/ai/flows/get-coping-suggestion.ts';
