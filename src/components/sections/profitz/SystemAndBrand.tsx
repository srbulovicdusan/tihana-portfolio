import Image from 'next/image';
import { img } from '@/lib/images';
import { reveal } from '@/lib/reveal';
import { SplitHeading } from './SplitHeading';
import styles from './profitz.module.css';

export function SystemMobile() {
  return (
    <section id="system" className={`${styles.section} ${styles.openBottom}`} aria-labelledby="system-title">
      <div className={`eyebrow ${styles.metaRow}`}>
        <span className={styles.strong}>(04) System &amp; Mobile</span>
      </div>
      <div {...reveal('rule')} className={styles.rule} />
      <div className={styles.sysGrid}>
        <div>
          <SplitHeading id="system-title" className={`${styles.titleM} ${styles.sysTitle}`} first="Built to" indent="Built " accent="scale." />
          <p {...reveal('fade')} className={`${styles.body} ${styles.measure440}`}>
            One design system of reusable tables, charts, filters and status indicators kept the product coherent, and let
            dense desktop views adapt to mobile without losing clarity.
          </p>
        </div>
        <Image
          {...img('/images/profitz-mobile-screens.webp')}
          {...reveal('fade')}
          alt="Three Profitz mobile screens: top products, dashboard and profit trends"
          sizes="(max-width: 760px) 92vw, 66vw"
          className={styles.trio}
        />
      </div>
    </section>
  );
}

export function BrandLanding() {
  return (
    <section id="brand" className={`${styles.section} ${styles.openBottom}`} aria-labelledby="brand-title">
      <div className={`eyebrow ${styles.metaRow}`}>
        <span className={styles.strong}>(05) Brand &amp; Landing Page</span>
      </div>
      <div {...reveal('rule')} className={styles.rule} />
      <SplitHeading id="brand-title" className={`${styles.titleM} ${styles.brandTitle}`} first="Know your" indent="Know " accent="real profit." />
      <p {...reveal('fade')} className={`${styles.body} ${styles.brandBody}`}>
        I created the logo and core identity, and designed the marketing landing page for desktop and mobile.
      </p>
      <div className={styles.brandGrid}>
        <div {...reveal('fade')} className={styles.logoBox}>
          <Image {...img('/images/profitz-logo.png')} alt="Profitz logo" sizes="(max-width: 760px) 59vw, 20vw" className={styles.logo} />
        </div>
        <div {...reveal('fade', 100)} className={styles.laptopBox}>
          <Image
            {...img('/images/profitz-landing-laptop.png')}
            alt="Profitz landing page on a laptop"
            sizes="(max-width: 760px) 150vw, 76vw"
            className={styles.laptop}
          />
        </div>
      </div>
    </section>
  );
}

export function Outcome() {
  return (
    <section id="outcome" className={`${styles.section} ${styles.openBottom}`} aria-labelledby="outcome-title">
      <div className={`eyebrow ${styles.metaRow}`}>
        <span className={styles.strong}>(06) Outcome</span>
      </div>
      <div {...reveal('rule')} className={styles.rule} />
      <div className={styles.outcome}>
        <div className={styles.outcomeHead}>
          <SplitHeading id="outcome-title" className={`${styles.titleL} ${styles.outcomeTitle}`} first="From MVP to" indent="From MVP " accent="platform." />
        </div>
        <p {...reveal('fade', 120)} className={styles.outcomeBody}>
          Over ten months, Profitz grew from a profitability MVP into a platform for financial analytics, advertising,
          expenses, collaboration and competitor intelligence. The most valuable part was balancing new functionality
          against simplicity, with decisions built to hold up as it grew.
        </p>
      </div>
    </section>
  );
}
