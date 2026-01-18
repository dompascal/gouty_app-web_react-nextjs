import { searchFoodsAction } from '@/app/actions';
import { foodData } from '@/lib/data';
import type { FoodItem } from '@/lib/types';
import FoodCard from './food-card';

async function getFoods({
  query,
  level,
}: {
  query?: string;
  level?: string;
}): Promise<FoodItem[]> {
  let foods: FoodItem[];

  if (query) {
    foods = await searchFoodsAction(query);
  } else {
    foods = foodData;
  }

  if (level && level !== 'all') {
    const lowerCaseLevel = level.toLowerCase();
    return foods.filter((food) => {
      const foodLevel = food.purineLevel.toLowerCase();
      if (lowerCaseLevel === 'high') {
        return foodLevel === 'high' || foodLevel === 'very high';
      }
      return foodLevel === lowerCaseLevel;
    });
  }

  return foods;
}

export default async function FoodList({ query, level }: { query: string; level: string }) {
  const foods = await getFoods({ query, level });

  if (foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
        <h3 className="text-xl font-semibold tracking-tight">No foods found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {foods.map((food) => (
        <FoodCard key={food.name} food={food} />
      ))}
    </div>
  );
}
