import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import StructuredData from '@/components/structured-data';
import type { Organization, WebSite } from 'schema-dts';

export const metadata: Metadata = {
  title: 'Gouty',
  description: 'Manage your gout by understanding purine content in your food.',
};

const organizationSchema: Organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Gouty',
  url: 'https://gouty.app',
  logo: 'https://gouty.app/logo.png', // Assuming a logo exists at this URL
};

const webSiteSchema: WebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Gouty',
  url: 'https://gouty.app',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://gouty.app/dashboard?query={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData data={organizationSchema} />
        <StructuredData data={webSiteSchema} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>{children}</FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
