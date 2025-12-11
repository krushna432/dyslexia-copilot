'use server';
/**
 * @fileOverview Converts text to speech using a generative model.
 *
 * - generateAudioNarration - A function that converts text into an audio data URI.
 * - GenerateAudioNarrationInput - The input type for the function.
 * - GenerateAudioNarrationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';
import wav from 'wav';

const GenerateAudioNarrationInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type GenerateAudioNarrationInput = z.infer<typeof GenerateAudioNarrationInputSchema>;

const GenerateAudioNarrationOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI in WAV format."),
});
export type GenerateAudioNarrationOutput = z.infer<typeof GenerateAudioNarrationOutputSchema>;


export async function generateAudioNarration(input: GenerateAudioNarrationInput): Promise<GenerateAudioNarrationOutput> {
  return generateAudioNarrationFlow(input);
}

async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs = [] as any[];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
}

const generateAudioNarrationFlow = ai.defineFlow(
  {
    name: 'generateAudioNarrationFlow',
    inputSchema: GenerateAudioNarrationInputSchema,
    outputSchema: GenerateAudioNarrationOutputSchema,
  },
  async ({ text }) => {
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: text,
      });

      if (!media) {
        throw new Error('Audio generation failed.');
      }
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      const wavBase64 = await toWav(audioBuffer);

      return {
        audioDataUri: 'data:audio/wav;base64,' + wavBase64,
      };
  }
);
