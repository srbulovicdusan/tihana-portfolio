import Image from 'next/image';
import { img, type ImageSrc } from '@/lib/images';
import { pad2 } from '@/lib/projects';
import { reveal } from '@/lib/reveal';
import { SplitHeading } from './SplitHeading';
import styles from './profitz.module.css';

const FEATURES: { title: string; text: string; image: ImageSrc }[] = [
  {
    title: 'Profit comes first.',
    text: 'Net profit sits at the centre, and every module follows the same logic.',
    image: '/images/profitz-pnl.png',
  },
  {
    title: 'Design for the real case.',
    text: "Automatic ad-to-product matching isn't always reliable, so users can correct connections themselves.",
    image: '/images/profitz-mapping.png',
  },
  {
    title: 'Show the change, not the total.',
    text: 'The competitor watchlist highlights shifts in active ads, because a spike says more than a number.',
    image: '/images/profitz-watchlist.png',
  },
];

export function KeyFeatures() {
  return (
    <section id="features" className={`${styles.section} ${styles.features}`} aria-labelledby="features-title">
      <div className={`eyebrow ${styles.metaRow} ${styles.metaDark}`}>
        <span className={styles.strongDark}>(03) Key Features</span>
      </div>
      <div {...reveal('rule')} className={styles.ruleDark} />
      <SplitHeading
        id="features-title"
        className={`${styles.titleL} ${styles.featuresTitle}`}
        first="Designing for"
        indent="Designing "
        accent="real limits."
      />

      <div className={styles.featList}>
        {FEATURES.map((f, i) => (
          <article key={f.title} className={i % 2 ? `${styles.feat} ${styles.featFlip}` : styles.feat}>
            <div {...reveal('fade')} className={styles.featMedia}>
              <div className={styles.featFrame}>
                <div aria-hidden="true" className={styles.featGlow} />
                <div className={styles.featShadow}>
                  <Image
                    {...img(f.image)}
                    alt={`Profitz ${f.title.replace('.', '')} screen`}
                    sizes="(max-width: 760px) 92vw, 54vw"
                    className={styles.featImg}
                  />
                </div>
              </div>
            </div>
            <div {...reveal('fade', 120)} className={styles.featText}>
              <span className={styles.featNum}>{pad2(i + 1)}</span>
              <h3 className={styles.featTitle}>{f.title}</h3>
              <p className={styles.featBody}>{f.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
