import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Arrow } from '@/components/ui/Arrow';
import { img, type ImageSrc } from '@/lib/images';
import { reveal } from '@/lib/reveal';
import { routes } from '@/lib/site';
import styles from './case-study.module.css';

type Half = { image: ImageSrc; alt: string; tone: string; bleed?: boolean };

type Media =
  | { image: ImageSrc; alt: string; position?: string }
  | { diptych: [Half, Half] }
  /** Rendered by the page (given the class that fills and zooms it), on a `tone` background */
  | { video: (className: string) => ReactNode; tone: string };

type Props = {
  href: string;
  caseNumber: string;
  name: string;
  category: string;
  /** A cover image, two logo halves side by side, or a video */
  media: Media;
  /** The last case study links back to the one before it */
  direction?: 'next' | 'previous';
};

function Cover({ media }: { media: Media }) {
  if ('image' in media) {
    const { style, ...rest } = img(media.image);
    return (
      <Image
        {...rest}
        style={{ ...style, objectPosition: media.position }}
        alt={media.alt}
        sizes="(max-width: 760px) 92vw, 46vw"
        className={`${styles.nextZoom} ${styles.nextImg}`}
      />
    );
  }
  if ('diptych' in media) {
    return (
      <div className={`${styles.nextZoom} ${styles.nextDiptych}`}>
        {media.diptych.map(h => (
          <div key={h.image} className={styles.nextHalf} style={{ background: h.tone }}>
            <Image {...img(h.image)} alt={h.alt} sizes="(max-width: 760px) 46vw, 23vw" className={h.bleed ? styles.nextBleed : undefined} />
          </div>
        ))}
      </div>
    );
  }
  return media.video(`${styles.nextZoom} ${styles.nextImg}`);
}

export function NextProject({ href, caseNumber, name, category, media, direction = 'next' }: Props) {
  const previous = direction === 'previous';
  return (
    <section id={previous ? 'prev' : 'next'} className={styles.next} aria-label={previous ? 'Previous project' : 'Next project'}>
      <div className={`eyebrow ${styles.metaRow}`}>
        <Link href={routes.work} className={styles.backSmall}>
          <Arrow dir="left" /> Back to work
        </Link>
        <span className={styles.strong}>
          {previous ? (
            <>
              <Arrow dir="left" /> Previous project
            </>
          ) : (
            <>
              Next project <Arrow dir="right" />
            </>
          )}
        </span>
      </div>
      <div {...reveal('rule')} className={styles.rule} />
      <Link href={href} className={styles.nextLink}>
        <div className={styles.nextMedia} style={'tone' in media ? { background: media.tone } : undefined}>
          <Cover media={media} />
        </div>
        <div className={styles.nextText}>
          <span className={`eyebrow ${styles.label}`}>{`Case Study (${caseNumber})`}</span>
          <h2 className={styles.nextTitle}>
            {previous && <Arrow dir="left" className={`${styles.nextArrow} ${styles.prevArrow}`} />}
            <span>{name}</span>
            {!previous && <Arrow dir="right" className={styles.nextArrow} />}
            <span className={styles.nextBase} />
            <span className={styles.nextLine} />
          </h2>
          <span className={`eyebrow ${styles.label}`}>{category}</span>
        </div>
      </Link>
    </section>
  );
}
