import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/navigation/SiteNav';
import { Arrow } from '@/components/ui/Arrow';
import { routes } from '@/lib/site';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Page not found — Tihana',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteNav homeHref={routes.home} workHref={routes.work} aboutHref={routes.about} />
      <main className="page" data-theme="dark">
        <section className={styles.section} aria-labelledby="not-found-title">
          <span className={`eyebrow ${styles.label}`}>(404)</span>
          <h1 id="not-found-title" className={styles.title}>
            <span className="hl">Page not</span>
            <span className={`hl ${styles.indent}`}>
              <span className="it-light">found.</span>
            </span>
          </h1>
          <Link href={routes.work} className={styles.back}>
            <Arrow dir="left" /> Back to work
          </Link>
        </section>
      </main>
    </>
  );
}
