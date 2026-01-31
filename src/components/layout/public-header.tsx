'use client';

import Link from 'next/link';
import { Utensils } from 'lucide-react';

export default function PublicHeader() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <Utensils className="h-6 w-6 text-primary" />
                    <h1 className="font-headline text-xl font-bold tracking-tighter text-foreground">
                        Gouty
                    </h1>
                </Link>
            </div>
            <nav className="flex items-center gap-6">
                <Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Contact
                </Link>
                <Link href="/terms" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Terms
                </Link>
                <Link href="/privacy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Privacy
                </Link>
            </nav>
        </header>
    );
}
