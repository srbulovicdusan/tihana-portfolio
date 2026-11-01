import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/lib/images';
import { reveal } from '@/lib/reveal';
import { routes } from '@/lib/site';
import styles from './profitz.module.css';

const FACTS = [
  { term: 'Role', value: 'UI/UX & Brand Designer', nowrap: true },
  { term: 'Type', value: 'Client work · Freelance', nowrap: true },
  { term: 'Platform', value: 'Web, mobile, landing page', nowrap: true },
  { term: 'Timeline', value: 'Dec 2025 – Sep 2026', tabular: true },
  { term: 'Scope', value: 'UX architecture, UI design, design system, prototyping, brand identity, landing page', wide: true },
];

export function ProfitzHero() {
  return (
    <section id="top" className={styles.top} aria-labelledby="profitz-title">
      <div className={styles.heroInner}>
        <Link href={routes.work} className={styles.back}>
          <span aria-hidden="true">←</span>Back to work
        </Link>
        <div className={`eyebrow ${styles.heroMeta}`}>
          <span className={styles.strong}>SaaS · UI/UX · Branding</span>
          <span>Case Study (02)</span>
        </div>
        <div {...reveal('rule')} className={styles.rule} />

        <div className={styles.heroGrid}>
          <h1 id="profitz-title" className={styles.h1}>
            <span className="hl hl-clip">
              <span {...reveal('line')} className="blk">Profitz</span>
            </span>
          </h1>
          <p {...reveal('fade', 120)} className={styles.tagline}>
            <span className="blk">Designing clarity into</span>
            <span className="blk nowrap">e-commerce profitability</span>
          </p>
        </div>

        <div className={styles.introGrid}>
          <p {...reveal('fade')} className={styles.intro}>
            A SaaS analytics platform that shows Shopify store owners what they actually earn, not just what they sell. I
            joined at the MVP stage and stayed as it grew into a full financial platform.
          </p>
          <dl className={styles.facts}>
            {FACTS.map((f, i) => (
              <div key={f.term} {...reveal('fade', i * 60)} className={f.wide ? `${styles.fact} ${styles.factWide}` : styles.fact}>
                <dt className="eyebrow">{f.term}</dt>
                <dd className={f.nowrap ? 'nowrap' : f.tabular ? styles.tabular : undefined}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <figure {...reveal('fade')} className={styles.heroFigure}>
        <Image
          {...img('/images/profitz-dashboard.webp')}
          alt="Profitz main dashboard in a browser window"
          sizes="(min-width: 1740px) 1600px, 92vw"
          preload
          className={styles.dashboard}
        />
        <figcaption className={`eyebrow ${styles.caption}`}>
          <span className={styles.captionStrong}>
            <span className={styles.liveDot} />
            Main dashboard
          </span>
          <span>Net profit at the centre</span>
        </figcaption>
      </figure>
    </section>
  );
}
