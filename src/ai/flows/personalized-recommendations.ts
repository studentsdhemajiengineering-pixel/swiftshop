'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized grocery recommendations.
 *
 * - getPersonalizedRecommendations - A function that takes user purchase history and current cart items
 *   as input and returns a list of recommended grocery items.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  purchaseHistory: z
    .array(z.string())
    .describe('A list of the user\'s past purchases (grocery item names).'),
  currentCart: z
    .array(z.string())
    .describe('A list of items currently in the user\'s cart (grocery item names).'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of recommended grocery items based on purchase history and current cart.'),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a grocery recommendation expert. Based on the user's purchase history and current cart,
  recommend grocery items that they might be interested in. Focus on suggesting complementary items and
  items that are frequently bought together with their past purchases. Consider items that the user buys frequently.

  Purchase History:
  {{#if purchaseHistory}}
    {{#each purchaseHistory}}
      - {{{this}}}
    {{/each}}
  {{else}}
    No past purchase history available.
  {{/if}}

  Current Cart:
  {{#if currentCart}}
    {{#each currentCart}}
      - {{{this}}}
    {{/each}}
  {{else}}
    Current cart is empty.
  {{/if}}

  Recommendations:
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

