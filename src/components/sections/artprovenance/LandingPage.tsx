import Image from 'next/image';
import { SectionHead } from '@/components/sections/case-study/SectionHead';
import { SplitHeading } from '@/components/sections/case-study/SplitHeading';
import cs from '@/components/sections/case-study/case-study.module.css';
import { img } from '@/lib/images';
import { reveal } from '@/lib/reveal';
import styles from './artprovenance.module.css';

export function LandingPage() {
  return (
    <section id="style" className={cs.section} aria-labelledby="landing-title">
      <SectionHead label="(04) Landing Page" />
      <div className={styles.landingRow}>
        <SplitHeading
          id="landing-title"
          className={`${cs.titleL} ${styles.landingTitle}`}
          first="Inspired by"
          indent="Inspired "
          accent="the catalogue."
          nowrapFirst
        />
        <p {...reveal('fade')} className={styles.landingBody}>
          I created the style guide and designed the landing page, with a paper-like, editorial feel inspired by printed
          auction catalogues.
        </p>
      </div>
      <figure {...reveal('fade')} className={styles.landingFigure}>
        <Image
          {...img('/images/artprovenance-landing-laptop.webp')}
          alt="Art Provenance landing page on a laptop: One artwork. A trail of records."
          sizes="92vw"
          className={cs.shot}
        />
      </figure>
    </section>
  );
}
