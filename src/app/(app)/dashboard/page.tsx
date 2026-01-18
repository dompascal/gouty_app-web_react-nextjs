import { Suspense } from 'react';
import { foodData } from '@/lib/data';
import type { FoodItem } from '@/lib/types';
import { searchFoodsAction } from '@/app/actions';
import FoodSearch from '@/components/food-search';
import FoodFilters from '@/components/food-filters';
import FoodList from '@/components/food-list';
import { Skeleton } from '@/components/ui/skeleton';

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

function FoodListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    level?: string;
  };
}) {
  const query = searchParams?.query || '';
  const level = searchParams?.level || 'all';

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Food Purine Directory
        </h1>
        <p className="text-lg text-muted-foreground">
          Search for foods and learn about their purine content.
        </p>
      </header>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <FoodSearch placeholder="Search for foods like 'chicken' or 'salmon'..." />
        </div>
        <FoodFilters />
      </div>

      <Suspense key={query + level} fallback={<FoodListSkeleton />}>
        <FoodList query={query} level={level} />
      </Suspense>
    </div>
  );
}
