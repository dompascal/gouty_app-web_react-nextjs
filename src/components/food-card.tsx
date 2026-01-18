import Link from 'next/link';
import type { FoodItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUpRight, Beef, Carrot, Coffee, Fish, Leaf, Milk, Apple, Wheat,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const levelColors: { [key: string]: string } = {
  Low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700/40',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700/40',
  High: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700/40',
  'Very High': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700/40',
};

export default function FoodCard({ food }: { food: FoodItem }) {
  const Icon = categoryIcons[food.category] || Leaf;

  return (
    <Link href={`/food/${encodeURIComponent(food.name)}`} className="group">
      <Card className="h-full transform-gpu transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium pr-4">{food.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline" className={cn('font-mono', levelColors[food.purineLevel])}>
              {food.purineLevel}
            </Badge>
            <p className="text-muted-foreground">
              {food.purines !== null ? `${food.purines} mg/100g` : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
