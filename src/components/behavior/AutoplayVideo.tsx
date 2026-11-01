'use client';

import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  className?: string;
  label?: string;
  /** Fetch with the page (above the fold) instead of once it nears the viewport */
  eager?: boolean;
  /** Second shown, paused, when the user prefers reduced motion */
  still?: number;
};

/**
 * Muted looping video that plays while on or near the screen and pauses once
 * scrolled away. With `prefers-reduced-motion` it never plays and shows the
 * `still` frame instead.
 */
export function AutoplayVideo({ src, className, label, eager, still = 0 }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showStill = () => {
      const seek = () => {
        el.currentTime = still;
      };
      if (el.readyState >= HTMLMediaElement.HAVE_METADATA) return seek();
      el.addEventListener('loadedmetadata', seek, { once: true });
      if (el.preload === 'none') {
        el.preload = 'auto';
        el.load();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return el.pause();
        if (!reduced) return void el.play().catch(() => {});
        io.disconnect();
        showStill();
      },
      { rootMargin: '50% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [still]);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      aria-label={label}
      muted
      loop
      playsInline
      disablePictureInPicture
      preload={eager ? 'auto' : 'none'}
    />
  );
}
