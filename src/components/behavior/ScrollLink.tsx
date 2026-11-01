'use client';

import type { ComponentPropsWithoutRef } from 'react';

type Props = ComponentPropsWithoutRef<'a'> & {
  href: `#${string}`;
  /** Element id to scroll to, or `top` for the top of the page. */
  to: string;
};

/** In-page anchor that scrolls without adding a hash to the URL (falls back to the anchor without JS). */
export function ScrollLink({ to, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={e => {
        onClick?.(e);
        const el = to === 'top' ? null : document.getElementById(to);
        if (to !== 'top' && !el) return;
        e.preventDefault();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
        window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
      }}
    />
  );
}
