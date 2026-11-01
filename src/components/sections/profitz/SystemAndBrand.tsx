import Image from 'next/image';
import { SectionHead } from '@/components/sections/case-study/SectionHead';
import { SplitHeading } from '@/components/sections/case-study/SplitHeading';
import cs from '@/components/sections/case-study/case-study.module.css';
import { img } from '@/lib/images';
import { reveal } from '@/lib/reveal';
import styles from './profitz.module.css';

export function SystemMobile() {
  return (
    <section id="system" className={`${cs.section} ${cs.openBottom}`} aria-labelledby="system-title">
      <SectionHead label="(04) System & Mobile" />
      <div className={styles.sysGrid}>
        <div>
          <SplitHeading id="system-title" className={`${cs.titleM} ${styles.sysTitle}`} first="Built to" indent="Built " accent="scale." />
          <p {...reveal('fade')} className={`${cs.body} ${styles.measure440}`}>
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
    <section id="brand" className={`${cs.section} ${cs.openBottom}`} aria-labelledby="brand-title">
      <SectionHead label="(05) Brand & Landing Page" />
      <SplitHeading id="brand-title" className={styles.brandTitle} first="Know your" indent="Know " accent="real profit." />
      <p {...reveal('fade')} className={styles.brandBody}>
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
    <section id="outcome" className={`${cs.section} ${cs.openBottom}`} aria-labelledby="outcome-title">
      <SectionHead label="(06) Outcome" />
      <div className={cs.aside}>
        <div className={cs.asideHead}>
          <SplitHeading id="outcome-title" className={`${cs.titleL} ${cs.asideTitle}`} first="From MVP to" indent="From MVP " accent="platform." />
        </div>
        <p {...reveal('fade', 120)} className={cs.asideBody}>
          Over ten months, Profitz grew from a profitability MVP into a platform for financial analytics, advertising,
          expenses, collaboration and competitor intelligence. The most valuable part was balancing new functionality
          against simplicity, with decisions built to hold up as it grew.
        </p>
      </div>
    </section>
  );
}
