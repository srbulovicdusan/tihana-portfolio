'use client';

import manifest from './image-manifest.json';

type Entry = { width: number; height: number; base: string; widths: number[] };

const images: Record<string, Entry> = manifest;

// Maps a requested width to the smallest pre-generated variant that covers it.
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const entry = images[src];
  if (!entry) return src;
  const w = entry.widths.find(v => v >= width) ?? entry.widths[entry.widths.length - 1];
  return `${entry.base}-${w}.webp`;
}
