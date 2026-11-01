/**
 * Scroll reveals and the footer name signature.
 *
 * Runs as an inline <script> at the end of <body> (app/layout.tsx), so
 * above-the-fold reveals start as soon as the HTML is parsed instead of after
 * React hydrates. A MutationObserver picks up pages rendered by client-side
 * navigation. Hidden initial states live in globals.css.
 *
 * Must stay self-contained (no imports or outer references): it is serialised
 * with Function.prototype.toString.
 */
export function revealRuntime(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const live = !reduced && 'IntersectionObserver' in window;
  const pending = new Map<Element, Element>(); // observed target → element to reveal
  const observers: Record<string, IntersectionObserver> = {};

  function observerFor(threshold: string): IntersectionObserver {
    let io = observers[threshold];
    if (!io) {
      io = new IntersectionObserver(
        entries => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            pending.get(e.target)?.setAttribute('data-revealed', '');
            pending.delete(e.target);
            observers[threshold]!.unobserve(e.target);
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: Number(threshold) },
      );
      observers[threshold] = io;
    }
    return io;
  }

  const sigObserver = live
    ? new IntersectionObserver(
        entries => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.setAttribute('data-on', '');
            sigObserver!.unobserve(e.target);
          }
        },
        { threshold: 0.1 },
      )
    : null;

  function scan(): void {
    pending.forEach((_, target) => {
      if (!target.isConnected) pending.delete(target);
    });
    document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach(el => {
      if (!live) return el.setAttribute('data-revealed', '');
      // Line reveals slide inside a clipping parent; observe the parent.
      const target = el.getAttribute('data-reveal') === 'line' && el.parentElement ? el.parentElement : el;
      if (pending.has(target)) return;
      pending.set(target, el);
      const scope = el.closest('[data-reveal-threshold]');
      observerFor(scope?.getAttribute('data-reveal-threshold') || '0.15').observe(target);
    });
    document.querySelectorAll('[data-name-sig]:not([data-on])').forEach(el => {
      if (sigObserver) sigObserver.observe(el);
      else el.setAttribute('data-on', '');
    });
  }

  scan();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      scan();
    });
  }).observe(document.body, { childList: true, subtree: true });
}
