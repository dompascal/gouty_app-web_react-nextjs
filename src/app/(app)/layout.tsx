import AppHeader from '@/components/layout/app-header';
import AppSidebar from '@/components/layout/app-sidebar';
import AppFooter from '@/components/layout/app-footer';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background min-h-svh flex flex-col">
        <AppHeader />
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
