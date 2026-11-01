'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { pad2, PROJECTS } from '@/lib/projects';
import styles from './WorkRouteDialog.module.css';

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

/**
 * `#work/<slug>` placeholder for case studies that have not been designed yet,
 * as specified by the portfolio design. Slugs with a real page redirect to it.
 */
export function WorkRouteDialog() {
  const router = useRouter();
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '');
  const slug = /^#work\/(.+)$/.exec(hash)?.[1];
  const index = slug ? PROJECTS.findIndex(p => p.slug === decodeURIComponent(slug)) : -1;
  const project = PROJECTS[index];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project?.href) router.replace(project.href);
  }, [project, router]);

  useEffect(() => {
    if (!project || project.href) return;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.location.hash = 'work';
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project]);

  if (!project || project.href) return null;

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="work-route-title" tabIndex={-1} className={styles.route}>
      <div className={`eyebrow ${styles.head}`}>
        <span>Case study {pad2(index + 1)} / 05</span>
        <a href="#work" className={styles.back}>
          ← Back to work
        </a>
      </div>
      <div className={styles.body}>
        <span className={`eyebrow ${styles.muted}`}>{project.category}</span>
        <h2 id="work-route-title" className={styles.title}>
          {project.name}
        </h2>
        <p className={styles.note}>
          Placeholder route — this case study page hasn&apos;t been designed yet. Route: /work/{project.slug}
        </p>
      </div>
    </div>
  );
}
