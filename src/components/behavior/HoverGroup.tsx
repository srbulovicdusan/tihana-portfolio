'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Marks the last hovered `[data-hover-item]` child with `data-active` and keeps
 * it active until the pointer leaves the whole group (not just the item), so
 * gaps between items don't flicker. Styling is done in CSS.
 */
export function HoverGroup({ className, children }: { className?: string; children: ReactNode }) {
  const active = useRef<HTMLElement | null>(null);

  const set = (el: HTMLElement | null) => {
    if (el === active.current) return;
    active.current?.removeAttribute('data-active');
    el?.setAttribute('data-active', '');
    active.current = el;
  };

  return (
    <div
      className={className}
      onMouseOver={e => {
        const item = (e.target as Element).closest<HTMLElement>('[data-hover-item]');
        if (item && e.currentTarget.contains(item)) set(item);
      }}
      onMouseLeave={() => set(null)}
    >
      {children}
    </div>
  );
}
