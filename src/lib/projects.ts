import type { ImageSrc } from './images';
import { routes } from './site';

export type Project = {
  slug: string;
  name: string;
  category: string;
  /** img: mockup image · diptych: Sekundarac logo pair · placeholder: mockup not supplied yet */
  visual: 'img' | 'diptych' | 'placeholder';
  image?: ImageSrc;
  position: string;
  tone: string;
  /** Mockup export size, shown on placeholders */
  size: string;
  /** Case studies that exist as pages; others open the in-page placeholder (#work/<slug>). */
  href?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: 'artprovenance',
    name: 'ArtProvenance',
    category: 'UI/UX Design · Web Application',
    visual: 'img',
    image: '/images/artprovenance-landing.webp',
    position: '50% 52%',
    tone: '#d8d8d8',
    size: '2400 × 1200',
    href: routes.artprovenance,
  },
  {
    slug: 'profitz',
    name: 'Profitz',
    category: 'Product Design · SaaS Analytics',
    visual: 'img',
    image: '/images/profitz-mobile.webp',
    position: '50% 43%',
    tone: '#d6d6d6',
    size: '1600 × 1200',
    href: routes.profitz,
  },
  {
    slug: 'no-days-wasted',
    name: 'No Days Wasted',
    category: 'E-commerce · Website Redesign',
    visual: 'img',
    image: '/images/no-days-wasted-laptop.webp',
    position: '50% 32%',
    tone: '#dedede',
    size: '1600 × 1600',
    href: routes.noDaysWasted,
  },
  {
    slug: 'sekundarac',
    name: 'Sekundarac',
    category: 'Brand Identity',
    visual: 'diptych',
    position: '50% 50%',
    tone: '#146533',
    size: '1800 × 1440',
    href: routes.sekundarac,
  },
  {
    slug: 'email-design',
    name: 'Email Design',
    category: 'Email & Digital Design',
    visual: 'placeholder',
    position: '50% 50%',
    tone: '#dcdcdc',
    size: '1200 × 1440',
  },
];

export const pad2 = (n: number) => String(n).padStart(2, '0');
