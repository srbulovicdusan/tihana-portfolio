import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowSwap } from '@/components/ui/ArrowSwap';
import { img } from '@/lib/images';
import { pad2, type Project } from '@/lib/projects';
import { reveal } from '@/lib/reveal';
import styles from './ProjectCard.module.css';

type Props = {
  project: Project;
  index: number;
  variant: 'featured' | 'grid';
  /** Right-hand grid column: its reveal starts 120ms later (desktop only). */
  secondColumn?: boolean;
};

// Cards are named by their visible title and category (WCAG 2.5.3, label in
// name); the thumbnail repeats the title, so its alt is empty, and decorative
// index numbers / arrows are hidden from assistive tech.
function Visual({ project: p, num, sizes }: { project: Project; num: string; sizes: string }) {
  if (p.visual === 'img' && p.image) {
    return (
      <Image
        {...img(p.image)}
        alt=""
        sizes={sizes}
        className={`${styles.zoom} ${styles.cover}`}
        style={{ objectPosition: p.position }}
      />
    );
  }
  if (p.visual === 'diptych') {
    const half = sizes.replace(/(\d+)vw/g, (_, n: string) => `${Math.ceil(Number(n) / 2)}vw`);
    return (
      <div className={`${styles.zoom} ${styles.diptych}`}>
        <div className={styles.dipGreen}>
          <Image {...img('/images/sekundarac-logo-green.png')} alt="" sizes={half} className={styles.cover} />
        </div>
        <div className={styles.dipWhite}>
          <Image {...img('/images/sekundarac-logo-white.png')} alt="" sizes={half} className={styles.coverBleed} />
        </div>
      </div>
    );
  }
  return (
    <div className={`${styles.zoom} ${styles.placeholder}`} aria-hidden="true">
      <div className={`eyebrow ${styles.phTop}`}>
        <span>{num} / Mockup</span>
        <span>{p.size}</span>
      </div>
      <span className={styles.phName}>{p.name}</span>
      <span className={`eyebrow ${styles.phNote}`}>
        <span className={styles.phDash} />
        Insert WebP mockup
      </span>
    </div>
  );
}

export function ProjectCard({ project: p, index, variant, secondColumn }: Props) {
  const num = pad2(index + 1);
  const featured = variant === 'featured';
  const sizes = featured ? '92vw' : '(max-width: 760px) 92vw, 45vw';

  const body: ReactNode = (
    <>
      <div className={`${styles.media} ${featured ? styles.featMedia : styles.gridMedia}`} style={{ background: p.tone }}>
        <Visual project={p} num={num} sizes={sizes} />
      </div>
      <div className={styles.track}>
        <div className={styles.fill} />
      </div>
      {featured ? (
        <div className={styles.fMeta}>
          <div className={`eyebrow ${styles.fNumBlock}`} aria-hidden="true">
            <span className={styles.fNum}>{num}</span>
            <span className={styles.fFeatured}>Featured</span>
          </div>
          <h3 className={styles.fName}>{p.name}</h3>
          <div className={styles.fSide}>
            <span className={`eyebrow ${styles.fCategory}`}>{p.category}</span>
            <span className={styles.fView}>
              <span className={styles.fViewLabel} aria-hidden="true">View case</span>
              <span className={styles.fArrowWrap}>
                <ArrowSwap className={styles.fArrow} />
              </span>
            </span>
          </div>
          <span className="visually-hidden">. View case study</span>
        </div>
      ) : (
        <div className={styles.gMeta}>
          <span className={styles.gNum} aria-hidden="true">{num}</span>
          <div className={styles.gMid}>
            <h3 className={styles.gName}>{p.name}</h3>
            <span className={`eyebrow ${styles.gCategory}`}>{p.category}</span>
          </div>
          <span className={styles.gArrowWrap}>
            <ArrowSwap className={styles.gArrow} />
          </span>
          <span className="visually-hidden">. View case study</span>
        </div>
      )}
    </>
  );

  const props = {
    ...reveal('fade'),
    className: [styles.card, !featured && styles.gridCard, secondColumn && styles.secondColumn].filter(Boolean).join(' '),
    'data-arrow-host': '',
  };

  return p.href ? (
    <Link href={p.href} {...props}>
      {body}
    </Link>
  ) : (
    <a href={`#work/${p.slug}`} {...props}>
      {body}
    </a>
  );
}
