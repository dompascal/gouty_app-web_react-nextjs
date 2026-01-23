import { Suspense } from 'react';
import FoodSearch from '@/components/food-search';
import FoodFilters from '@/components/food-filters';
import FoodList from '@/components/food-list';
import { Skeleton } from '@/components/ui/skeleton';
import { foodData } from '@/lib/data';
import type { FoodItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

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

const categoryImageMap: Record<string, string> = {
  Seafood: 'seafood',
  Grains: 'grains',
  Nuts: 'nuts',
  Fruits: 'fruits',
  Vegetables: 'vegetables',
  Meat: 'meat',
  Beverages: 'beverages',
  Legumes: 'legumes',
  Dairy: 'dairy',
  Other: 'other',
};

function HeroSlideshow() {
  const lowPurineFoods = foodData
    .filter((f) => f.purineLevel === 'Low')
    .slice(0, 5);

  const slides = lowPurineFoods
    .map((food) => {
      const imageId = categoryImageMap[food.category] || 'other';
      const image = PlaceHolderImages.find((p) => p.id === imageId);
      return { food, image };
    })
    .filter(
      (s): s is { food: FoodItem; image: NonNullable<typeof s['image']> } =>
        !!s.image
    );

  return (
    <Carousel
      className="w-full -mx-4 sm:-mx-6 lg:-mx-8 rounded-lg overflow-hidden"
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {slides.map(({ food, image }) => (
          <CarouselItem key={food.name}>
            <div className="relative h-[50vh]">
              <Image
                src={image.imageUrl}
                alt={food.name}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute flex h-full w-full flex-col justify-center p-4 text-white sm:p-6 md:w-3/4 lg:w-1/2 lg:p-8">
                <Badge variant="secondary">Low Purine Spotlight</Badge>
                <h2 className="mt-2 font-headline text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  {food.name}
                </h2>
                <p className="mt-2 max-w-lg text-base text-white/90 md:text-lg">
                  A delicious and safe choice for a gout-friendly diet.
                </p>
                <Button asChild className="mt-4 w-fit">
                  <Link href={`/food/${encodeURIComponent(food.name)}`}>
                    Learn More <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 hidden sm:inline-flex sm:left-6 lg:left-8" />
      <CarouselNext className="right-4 hidden sm:inline-flex sm:right-6 lg:right-8" />
    </Carousel>
  );
}


export default async function DashboardPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
    level?: string;
  };
}) {
  const query = searchParams.query || '';
  const level = searchParams.level || 'all';

  return (
    <div className="space-y-8">
      <HeroSlideshow />

      <header className="space-y-2 text-center">
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
