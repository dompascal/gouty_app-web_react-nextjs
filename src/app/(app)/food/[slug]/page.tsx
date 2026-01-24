import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { foodData } from '@/lib/data';
import type { FoodItem, PurineLevel } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Beef, Carrot, Coffee, Fish, Leaf, Milk, Apple, Wheat } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import AddToDiaryButton from '@/components/diary/add-to-diary-button';
import StructuredData from '@/components/structured-data';
import type { Article } from 'schema-dts';

function getFoodBySlug(slug: string): FoodItem | undefined {
  const name = decodeURIComponent(slug);
  return foodData.find((f) => f.name === name);
}

const categoryIcons: { [key: string]: LucideIcon } = {
  Seafood: Fish,
  Grains: Wheat,
  Vegetables: Carrot,
  Meat: Beef,
  Fruits: Apple,
  Dairy: Milk,
  Beverages: Coffee,
  Legumes: Leaf,
  Nuts: Leaf,
  Other: Leaf,
};

const levelInfo: { [key in PurineLevel]: { max: number, className: string, description: string } } = {
  'Low': { max: 100, className: 'bg-green-500', description: 'Generally safe to eat regularly.' },
  'Medium': { max: 200, className: 'bg-yellow-500', description: 'Eat in moderation.' },
  'High': { max: 400, className: 'bg-orange-500', description: 'Limit intake, especially during a flare-up.' },
  'Very High': { max: 1000, className: 'bg-red-500', description: 'Best to avoid.' },
};

const levelColors: { [key: string]: string } = {
  Low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700/40',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700/40',
  High: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700/40',
  'Very High': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700/40',
};

const heroImage = PlaceHolderImages.find(p => p.id === 'food-detail-hero');
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
  Other: 'other'
}

export default function FoodDetailPage({ params }: { params: { slug: string } }) {
  const food = getFoodBySlug(params.slug);

  if (!food) {
    notFound();
  }

  const Icon = categoryIcons[food.category] || Leaf;
  const currentLevelInfo = levelInfo[food.purineLevel];
  const progressValue = food.purines !== null ? (food.purines / 400) * 100 : 0;
  
  const imageId = categoryImageMap[food.category] || 'other';
  const foodImage = PlaceHolderImages.find(p => p.id === imageId);
  
  const articleSchema: Article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gouty.app/food/${params.slug}`,
    },
    headline: `${food.name} - Purine Content and Gout Information`,
    description: `Learn about the purine content of ${food.name} (${food.purines} mg per 100g), its purine level (${food.purineLevel}), and whether it's suitable for a gout-friendly diet.`,
    image: foodImage?.imageUrl || '',
    author: {
      '@type': 'Organization',
      name: 'Gouty',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gouty',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gouty.app/logo.png', // placeholder
      },
    },
    datePublished: '2024-07-25T12:00:00Z',
    dateModified: '2024-07-25T12:00:00Z',
  };


  return (
    <div className="space-y-8">
      <StructuredData data={articleSchema} />
      <div className="flex justify-between items-center">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">
            <ArrowLeft />
            Back to Directory
          </Link>
        </Button>
        <AddToDiaryButton food={food} />
      </div>

      <header className="relative -mx-4 sm:-mx-6 lg:-mx-8 aspect-[5/2] max-h-[400px] overflow-hidden rounded-lg">
        {foodImage && (
          <Image
            src={foodImage.imageUrl}
            alt={food.name}
            fill
            className="object-cover"
            data-ai-hint={foodImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            {food.name}
          </h1>
          <div className="mt-2 flex items-center gap-4">
            <Badge variant="secondary" className="gap-2">
              <Icon className="h-4 w-4" />
              {food.category}
            </Badge>
            <Badge className={cn(levelColors[food.purineLevel])}>
              {food.purineLevel} Purine
            </Badge>
          </div>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Purine Content</CardTitle>
            <CardDescription>Amount per 100g serving</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">
              {food.purines !== null ? `${food.purines} mg` : 'N/A'}
            </div>
            {food.purines !== null && (
              <div className="space-y-2">
                <Progress value={progressValue} className={currentLevelInfo.className} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            )}
            <p className="text-muted-foreground">{currentLevelInfo.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nutritional Information</CardTitle>
            <CardDescription>General serving size and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="font-medium text-foreground">Serving Size:</span> 100g</li>
              <li><span className="font-medium text-foreground">Calories:</span> Varies (data not available)</li>
              <li><span className="font-medium text-foreground">Dietary Note:</span> Always consult with a healthcare provider or a registered dietitian for personalized dietary advice, especially when managing a condition like gout.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return foodData.map((food) => ({
    slug: encodeURIComponent(food.name),
  }));
}
