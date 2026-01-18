'use server';

/**
 * @fileOverview Implements intelligent food search using LLM to match user queries with food items and their purine content.
 *
 * - intelligentFoodSearch - A function that searches for food items based on a user's natural language query, leveraging an LLM for intelligent matching.
 * - IntelligentFoodSearchInput - The input type for the intelligentFoodSearch function, which includes the user's search query.
 * - IntelligentFoodSearchOutput - The return type for the intelligentFoodSearch function, providing a list of relevant food items with their purine content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentFoodSearchInputSchema = z.object({
  query: z.string().describe('The user\u0027s search query for food items.'),
  foodList: z.string().describe('A list of food items with their purine content (name, purine_level).'),
});
export type IntelligentFoodSearchInput = z.infer<
  typeof IntelligentFoodSearchInputSchema
>;

const IntelligentFoodSearchOutputSchema = z.array(
  z.object({
    name: z.string().describe('The name of the food item.'),
    purine_level: z.string().describe('The purine level of the food item (low, medium, high).'),
  })
);
export type IntelligentFoodSearchOutput = z.infer<
  typeof IntelligentFoodSearchOutputSchema
>;

export async function intelligentFoodSearch(
  input: IntelligentFoodSearchInput
): Promise<IntelligentFoodSearchOutput> {
  return intelligentFoodSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentFoodSearchPrompt',
  input: {schema: IntelligentFoodSearchInputSchema},
  output: {schema: IntelligentFoodSearchOutputSchema},
  prompt: `You are an AI assistant designed to identify food items from a given list that best match a user's search query, even if the query contains typos or is expressed in natural language.

  The food list is a string that looks like this:
  '[{"name": "food1", "purine_level": "high"}, {"name": "food2", "purine_level": "low"}, ... ]'

  Given the following user query:
  {{query}}

  And the following food list:
  {{foodList}}

  Identify the food items from the list that are most relevant to the query.
  Return a JSON array of food items with their purine levels that best match the search query.
`,
});

const intelligentFoodSearchFlow = ai.defineFlow(
  {
    name: 'intelligentFoodSearchFlow',
    inputSchema: IntelligentFoodSearchInputSchema,
    outputSchema: IntelligentFoodSearchOutputSchema,
  },
  async input => {
    try {
      // Validate that foodList is a valid JSON string.
      JSON.parse(input.foodList);
      
      const {output} = await prompt(input);

      // If the model returns no output, return an empty array.
      return output || [];
    } catch (error) {
      console.error('Error in intelligentFoodSearchFlow:', error);
      // Re-throw the error to allow the caller to handle fallbacks.
      throw error;
    }
  }
);
