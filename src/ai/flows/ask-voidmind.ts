// src/ai/flows/ask-voidmind.ts
'use server';

/**
 * @fileOverview A flow for answering ethical hacking and CTF-related questions.
 *
 * - askVoidMind - A function that handles the question answering process.
 * - AskVoidMindInput - The input type for the askVoidMind function.
 * - AskVoidMindOutput - The return type for the askVoidMind function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskVoidMindInputSchema = z.object({
  query: z.string().describe('The question to ask the AI assistant.'),
});
export type AskVoidMindInput = z.infer<typeof AskVoidMindInputSchema>;

const AskVoidMindOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s response to the question.'),
});
export type AskVoidMindOutput = z.infer<typeof AskVoidMindOutputSchema>;

export async function askVoidMind(input: AskVoidMindInput): Promise<AskVoidMindOutput> {
  return askVoidMindFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askVoidMindPrompt',
  input: {schema: AskVoidMindInputSchema},
  output: {schema: AskVoidMindOutputSchema},
  prompt: `You are a helpful AI assistant that specializes in answering questions about ethical hacking and Capture The Flag (CTF) challenges.

  Question: {{{query}}}
  `,
});

const askVoidMindFlow = ai.defineFlow(
  {
    name: 'askVoidMindFlow',
    inputSchema: AskVoidMindInputSchema,
    outputSchema: AskVoidMindOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
