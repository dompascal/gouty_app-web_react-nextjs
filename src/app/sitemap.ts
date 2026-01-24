import { MetadataRoute } from 'next';
import { foodData } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://gouty.app';

  // Static routes
  const staticRoutes = [
    '/dashboard',
    '/diary',
    '/gout-info',
    '/account',
    '/contact',
    '/privacy',
    '/terms',
    '/login',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '/dashboard' ? 1.0 : 0.8,
  }));

  // Dynamic routes for food items
  const foodRoutes = foodData.map((food) => ({
    url: `${siteUrl}/food/${encodeURIComponent(food.name)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...foodRoutes];
}
