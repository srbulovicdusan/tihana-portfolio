import manifest from './image-manifest.json';

export type ImageSrc = keyof typeof manifest;

/**
 * `src`, `width`, `height` for next/image, from the generated manifest. The
 * explicit aspect-ratio keeps auto-sized images at the original's exact
 * proportions; resized variants round their pixel size, which would otherwise
 * shift `height: auto` layouts by a pixel.
 */
export function img(src: ImageSrc) {
  const { width, height } = manifest[src];
  return { src, width, height, style: { aspectRatio: `${width} / ${height}` } };
}
