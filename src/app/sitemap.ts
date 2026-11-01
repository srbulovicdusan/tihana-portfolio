import type { MetadataRoute } from 'next';
import { routes, siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${siteUrl}${routes.home}`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}${routes.about}`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}${routes.artprovenance}`, lastModified, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${siteUrl}${routes.profitz}`, lastModified, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${siteUrl}${routes.noDaysWasted}`, lastModified, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${siteUrl}${routes.sekundarac}`, lastModified, changeFrequency: 'yearly', priority: 0.8 },
  ];
}
