import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function AppFooter() {
  return (
    <footer className="mt-auto border-t border-gray-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Gouty. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/contact" className="text-gray-400 hover:text-white">
              Contact
            </Link>
            <Separator orientation="vertical" className="h-4 bg-gray-700" />
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Separator orientation="vertical" className="h-4 bg-gray-700" />
            <Link href="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
