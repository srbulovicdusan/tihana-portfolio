import type { CSSProperties } from 'react';

type Kind = 'fade' | 'line' | 'rule';

/**
 * Props for a scroll-revealed element (see lib/runtime/reveal-runtime.ts).
 * The runtime may mark it revealed before hydration, hence the opt-out.
 */
export function reveal(kind: Kind, delayMs = 0) {
  const props = { 'data-reveal': kind, suppressHydrationWarning: true };
  return delayMs ? { ...props, style: { '--reveal-delay': `${delayMs}ms` } as CSSProperties } : props;
}
