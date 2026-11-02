import Image from 'next/image';
import Link from 'next/link';
import { Arrow } from '@/components/ui/Arrow';
import { img, type ImageSrc } from '@/lib/images';
import { reveal } from '@/lib/reveal';
import { routes } from '@/lib/site';
import styles from './case-study.module.css';

type Half = { image: ImageSrc; alt: string; tone: string; bleed?: boolean };

type Props = {
  href: string;
  caseNumber: string;
  name: string;
  category: string;
  /** A cover image, two logo halves side by side, or the design's placeholder cover */
  media: { image: ImageSrc; alt: string; position?: string } | { diptych: [Half, Half] } | { placeholder: string };
};

function Media({ media }: Pick<Props, 'media'>) {
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
  // Design placeholder, like the portfolio's mockup placeholders: not announced
  return (
    <div aria-hidden="true" className={`eyebrow ${styles.nextZoom} ${styles.nextPlaceholder}`}>
      {media.placeholder}
    </div>
  );
}

export function NextProject({ href, caseNumber, name, category, media }: Props) {
  return (
    <section id="next" className={styles.next} aria-label="Next project">
      <div className={`eyebrow ${styles.metaRow}`}>
        <Link href={routes.work} className={styles.backSmall}>
          <Arrow dir="left" /> Back to work
        </Link>
        <span className={styles.strong}>
          Next project <Arrow dir="right" />
        </span>
      </div>
      <div {...reveal('rule')} className={styles.rule} />
      <Link href={href} className={styles.nextLink}>
        <div className={styles.nextMedia}>
          <Media media={media} />
        </div>
        <div className={styles.nextText}>
          <span className={`eyebrow ${styles.label}`}>{`Case Study (${caseNumber})`}</span>
          <h2 className={styles.nextTitle}>
            <span>{name}</span>
            <Arrow dir="right" className={styles.nextArrow} />
            <span className={styles.nextBase} />
            <span className={styles.nextLine} />
          </h2>
          <span className={`eyebrow ${styles.label}`}>{category}</span>
        </div>
      </Link>
    </section>
  );
}
