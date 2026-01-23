'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Utensils } from 'lucide-react';
import UserAvatar from '@/components/auth/user-avatar';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/diary', label: 'Food Diary' },
  { href: '/gout-info', label: 'Gout Info' },
];

export default function AppHeader() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur sm:px-6">
      {isMobile && <SidebarTrigger />}
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Utensils className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-xl font-bold tracking-tighter text-foreground">
            Gouty
          </h1>
        </Link>
      </div>
      
      <div className="ml-auto flex items-center gap-6">
        <nav className="hidden items-center gap-6 md:flex">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname.startsWith(item.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <UserAvatar />
      </div>
    </header>
  );
}
