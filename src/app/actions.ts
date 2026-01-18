'use server';

import { foodData } from '@/lib/data';
import type { FoodItem } from '@/lib/types';

export async function searchFoodsAction(query: string): Promise<FoodItem[]> {
  if (!query) {
    return [];
  }

  return foodData.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
}
