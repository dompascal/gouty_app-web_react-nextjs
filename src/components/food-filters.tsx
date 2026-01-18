'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

export default function FoodFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const currentLevel = searchParams.get('level') ?? 'all';

  const handleFilterChange = (level: string) => {
    const params = new URLSearchParams(searchParams);
    if (level && level !== 'all') {
      params.set('level', level);
    } else {
      params.delete('level');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs value={currentLevel} onValueChange={handleFilterChange}>
      <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
        {filters.map((filter) => (
          <TabsTrigger key={filter.value} value={filter.value}>
            {filter.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
