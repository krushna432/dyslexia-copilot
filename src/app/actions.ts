
"use server";

import { generateQuiz } from "@/ai/flows/generate-quiz-flow";
import { simplifyText } from "@/ai/flows/simplify-text-for-dyslexia";
import { scanAndConvertText } from "@/ai/flows/scan-and-convert-text";
import { summarizeTextForReview } from "@/ai/flows/summarize-text-for-review";
import { generateAudioNarration } from "@/ai/flows/generate-audio-narration";
import { assistWriting } from "@/ai/flows/assist-writing";
import { getReadingFeedback } from "@/ai/flows/get-reading-feedback";
import { getJournalFeedback } from "@/ai/flows/get-journal-feedback";
import { getCopingSuggestion } from "@/ai/flows/get-coping-suggestion";

export async function simplify(text: string) {
  if (!text) return { error: "Text is required." };
  try {
    const result = await simplifyText({ text });
    return { simplifiedText: result.simplifiedText };
  } catch (e) {
    return { error: "Failed to simplify text." };
  }
}

export async function summarize(text: string) {
  if (!text) return { error: "Text is required." };
  try {
    const result = await summarizeTextForReview({ text });
    return { summary: result.summary };
  } catch (e) {
    return { error: "Failed to generate summary." };
  }
}

export async function generateQuestions(text: string, numQuestions: number, questionType: 'multiple-choice' | 'open-ended') {
  if (!text) return { error: "Text is required." };
  try {
    const result = await generateQuiz({ text, numQuestions, questionType });
    return { questions: result.questions };
  } catch (e) {
    return { error: "Failed to generate questions." };
  }
}

export async function scanImage(photoDataUri: string) {
  if (!photoDataUri) return { error: "Image data is required." };
  try {
    const result = await scanAndConvertText({ photoDataUri });
    return { extractedText: result.extractedText };
  } catch (e) {
    return { error: "Failed to scan image." };
  }
}

export async function narrate(text: string) {
  if (!text) return { error: "Text is required." };
  try {
    const result = await generateAudioNarration({ text });
    return { audioDataUri: result.audioDataUri };
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate audio." };
  }
}

export async function checkWriting(text: string) {
  if (!text) return { error: "Text is required." };
  try {
    const result = await assistWriting({ text });
    return { correctedText: result.correctedText, corrections: result.corrections };
  } catch (e) {
    return { error: "Failed to get writing assistance." };
  }
}

export async function getFeedback(originalText: string, userText: string) {
    if (!originalText || !userText) return { error: "Original text and user text are required." };
    try {
        const result = await getReadingFeedback({ originalText, userText });
        return { feedback: result.feedback };
    } catch (e) {
        return { error: "Failed to get feedback." };
    }
}

export async function getJournalAnalysis(journalText: string) {
    if (!journalText) return { error: "Journal text is required." };
    try {
        const result = await getJournalFeedback({ journalText });
        return { feedback: result.feedback, sentiment: result.sentiment };
    } catch (e) {
        return { error: "Failed to analyze journal entry." };
    }
}

export async function getSuggestionForMood(mood: string) {
    if (!mood) return { error: "Mood is required." };
    try {
        const result = await getCopingSuggestion({ mood });
        return { suggestion: result.suggestion };
    } catch (e) {
        return { error: "Failed to get suggestion." };
    }
}
