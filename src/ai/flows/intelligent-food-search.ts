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
  query: z.string().describe("The user's search query for food items."),
  foodList: z
    .string()
    .describe(
      'A list of food items with their purine content (name, purine_level).'
    ),
});
export type IntelligentFoodSearchInput = z.infer<
  typeof IntelligentFoodSearchInputSchema
>;

const IntelligentFoodSearchOutputSchema = z.array(
  z.object({
    name: z.string().describe('The name of the food item.'),
    purine_level: z
      .enum(['Low', 'Medium', 'High', 'Very High'])
      .describe(
        'The purine level of the food item. Must be one of: "Low", "Medium", "High", "Very High".'
      ),
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
  prompt: `You are an AI assistant designed to identify food items from a given list that best match a user's search query. Your matching should be intelligent, capable of handling natural language queries and minor typos.

  The food list is provided as a JSON string:
  {{foodList}}

  The user's search query is:
  "{{query}}"

  Your task is to identify all food items from the list that are relevant to the user's query.

  Please return ONLY a valid JSON array of the matching food items, including their name and purine_level. The 'purine_level' value is case-sensitive and MUST be one of the following exact string values: "Low", "Medium", "High", "Very High".

  If no relevant food items are found, return an empty JSON array [].
  Your entire response must be a single, valid JSON array without any surrounding text or explanation.
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
      if (error instanceof z.ZodError) {
        console.error('Zod validation error in intelligentFoodSearchFlow:', JSON.stringify(error.issues, null, 2));
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error in intelligentFoodSearchFlow:', errorMessage);
      }
      // Re-throw the error to allow the caller to handle fallbacks.
      throw error;
    }
  }
);
