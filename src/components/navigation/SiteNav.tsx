import Link from 'next/link';
import type { ReactNode } from 'react';
import { Arrow } from '@/components/ui/Arrow';
import styles from './SiteNav.module.css';

type Props = {
  homeHref: string;
  workHref: string;
  aboutHref: string;
  current?: 'work' | 'about';
  /** Portfolio: hidden over the hero, shown once scrolled (toggled by PortfolioEffects). */
  revealOnScroll?: boolean;
  label?: string;
};

function NavLink({ href, className, current, children }: { href: string; className?: string; current?: boolean; children: ReactNode }) {
  const props = { className, 'aria-current': current ? ('page' as const) : undefined };
  return href.startsWith('#') ? (
    <a href={href} {...props}>{children}</a>
  ) : (
    <Link href={href} {...props}>{children}</Link>
  );
}

export function SiteNav({ homeHref, workHref, aboutHref, current, revealOnScroll, label = 'Primary' }: Props) {
  return (
    <nav
      aria-label={label}
      className={revealOnScroll ? `${styles.nav} ${styles.revealing}` : styles.nav}
      data-scroll-nav={revealOnScroll ? '' : undefined}
      inert={revealOnScroll}
    >
      <NavLink href={homeHref} className={styles.logo}>
        Tihana<sup>®</sup>
      </NavLink>
      <div className={styles.links}>
        <NavLink href={workHref} className={styles.link} current={current === 'work'}>
          Work
        </NavLink>
        <NavLink href={aboutHref} className={styles.link} current={current === 'about'}>
          About <Arrow dir="up-right" />
        </NavLink>
      </div>
    </nav>
  );
}
