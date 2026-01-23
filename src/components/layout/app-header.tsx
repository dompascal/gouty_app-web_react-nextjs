'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Utensils } from 'lucide-react';

export default function AppHeader() {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur sm:px-6">
      {isMobile && <SidebarTrigger />}
      <div className="flex items-center gap-2">
        <Utensils className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-xl font-bold tracking-tighter text-foreground">
          Gouty
        </h1>
      </div>
    </header>
  );
}
