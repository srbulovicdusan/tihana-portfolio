import type { Metadata } from 'next';
import { site } from './site';

type PageMeta = {
  /** Full document title (no template is applied) */
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'profile' | 'article';
};

/**
 * Complete per-page metadata. Next.js merges metadata shallowly, so a page's
 * `openGraph` / `twitter` objects replace the layout's; build them whole here.
 * Images come from each route's opengraph-image.jpg.
 */
export function pageMetadata({ title, description, path, type = 'website' }: PageMeta): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, title, description, siteName: site.name, locale: 'en_US' },
    twitter: { card: 'summary_large_image', title, description },
  };
}
