'use server';

import { intelligentFoodSearch } from '@/ai/flows/intelligent-food-search';
import { foodData } from '@/lib/data';
import type { FoodItem } from '@/lib/types';

export async function searchFoodsAction(query: string): Promise<FoodItem[]> {
  if (!query) {
    return [];
  }

  try {
    const foodListForAi = foodData.map(({ name, purineLevel }) => ({
      name,
      purine_level: purineLevel,
    }));

    const searchResults = await intelligentFoodSearch({
      query,
      foodList: JSON.stringify(foodListForAi),
    });

    const resultNames = new Set(searchResults.map((item) => item.name));
    const detailedResults = foodData.filter((item) => resultNames.has(item.name));

    return detailedResults;
  } catch (error) {
    console.error('Error in intelligent food search:', error);
    // Fallback to simple search
    return foodData.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
