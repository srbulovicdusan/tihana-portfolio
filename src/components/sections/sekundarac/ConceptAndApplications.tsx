import Image from 'next/image';
import { SectionHead } from '@/components/sections/case-study/SectionHead';
import { SplitHeading } from '@/components/sections/case-study/SplitHeading';
import cs from '@/components/sections/case-study/case-study.module.css';
import { img, type ImageSrc } from '@/lib/images';
import { reveal } from '@/lib/reveal';
import styles from './sekundarac.module.css';

type HeadProps = { id: string; first: string; indent: string; accent: string; text: string };

/** Display heading with its paragraph aligned to the heading's last line */
function Head({ id, text, ...heading }: HeadProps) {
  return (
    <div className={`${cs.aside} ${cs.asideSpaced}`}>
      <div className={cs.asideHead}>
        <SplitHeading id={id} className={`${cs.titleL} ${cs.asideTitle}`} {...heading} />
      </div>
      <p {...reveal('fade', 120)} className={cs.asideBody}>
        {text}
      </p>
    </div>
  );
}

function Tile({ src, alt, sizes, className, delay }: { src: ImageSrc; alt: string; sizes: string; className?: string; delay?: number }) {
  return (
    <div {...reveal('fade', delay)} className={className ? `${styles.tile} ${className}` : styles.tile}>
      <Image {...img(src)} alt={alt} sizes={sizes} className={styles.tileImg} />
    </div>
  );
}

export function Concept() {
  return (
    <section id="concept" className={`${cs.section} ${cs.openBottom}`} aria-labelledby="concept-title">
      <SectionHead label="(02) Concept" />
      <Head
        id="concept-title"
        first="One letter,"
        indent="One "
        accent="full circle."
        text="The letter S is formed from two recycling arrows, so the name and the mission become one sign. A bold condensed wordmark keeps it solid and industrial."
      />
      <div className={styles.pair}>
        <Tile src="/images/sekundarac-logo-on-white.png" alt="Sekundarac logo on white" sizes="(max-width: 760px) 92vw, 46vw" className={styles.onWhite} />
        <Tile
          src="/images/sekundarac-logo-on-green.png"
          alt="Sekundarac logo reversed on green"
          sizes="(max-width: 760px) 92vw, 46vw"
          className={styles.onGreen}
          delay={100}
        />
      </div>
    </section>
  );
}

export function Applications() {
  return (
    <section id="applications" className={`${cs.section} ${cs.openBottom}`} aria-labelledby="applications-title">
      <SectionHead label="(03) Applications" />
      <Head
        id="applications-title"
        first="From card"
        indent="From "
        accent="to keychain."
        text="The new identity carries across business cards and promotional materials, in white, green and black versions."
      />
      <div className={styles.stack}>
        <Tile src="/images/sekundarac-business-cards.jpg" alt="Sekundarac business cards, front and back" sizes="92vw" className={styles.wide} />
        <div className={styles.trio}>
          <Tile src="/images/sekundarac-keychains.jpg" alt="Sekundarac keychains in white, green and black" sizes="(max-width: 760px) 92vw, 31vw" />
          <Tile src="/images/sekundarac-pens.jpg" alt="Sekundarac pens in white and green" sizes="(max-width: 760px) 92vw, 31vw" />
          <Tile src="/images/sekundarac-lighters.jpg" alt="Sekundarac lighters in white and green" sizes="(max-width: 760px) 92vw, 31vw" />
        </div>
      </div>
    </section>
  );
}
