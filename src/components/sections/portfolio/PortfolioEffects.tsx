'use client';

import { useEffect } from 'react';

/**
 * Scroll-linked effects on the portfolio page:
 *  - hero light fades out and a gradient fades in over the first 75% of a screen
 *  - the fixed nav appears after 85% of a screen
 *  - Selected Work opens from a 3% side inset as it enters the viewport
 */
export function PortfolioEffects() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const glow = document.querySelector<HTMLElement>('[data-hero-glow]');
    const fade = document.querySelector<HTMLElement>('[data-hero-fade]');
    const nav = document.querySelector<HTMLElement>('[data-scroll-nav]');
    const work = document.getElementById('work');
    let navOn = false;
    let raf = 0;

    const apply = () => {
      const vh = window.innerHeight || 800;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 0.75)));
      if (glow) glow.style.opacity = String(1 - p);
      if (fade) fade.style.opacity = String(p);

      const on = window.scrollY > vh * 0.85;
      if (nav && on !== navOn) {
        navOn = on;
        nav.toggleAttribute('data-visible', on);
        nav.inert = !on;
      }

      if (work && !reduced) {
        const r = work.getBoundingClientRect();
        const q = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.6)));
        const inset = (1 - q) * 3;
        work.style.clipPath = inset > 0.01 ? `inset(0 ${inset.toFixed(2)}% 0 ${inset.toFixed(2)}%)` : 'none';
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return null;
}
