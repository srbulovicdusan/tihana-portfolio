import Image from 'next/image';
import type { ReactNode } from 'react';
import { img, type ImageSrc } from '@/lib/images';
import { pad2 } from '@/lib/projects';
import { reveal } from '@/lib/reveal';
import { SectionHead } from './SectionHead';
import { SplitHeading } from './SplitHeading';
import styles from './case-study.module.css';

export type Feature = {
  title: string;
  text: string;
  /**
   * A screenshot, or a 16:9 video on a `tone` background. The page renders the
   * video (given its accessible name), so pages without one don't load the
   * video player's client code.
   */
  media: { image: ImageSrc } | { video: (label: string) => ReactNode; tone: string };
};

type Props = {
  /** Project name, used in the media's accessible name */
  project: string;
  heading: { first: string; indent: string; accent: string };
  features: Feature[];
};

export function KeyFeatures({ project, heading, features }: Props) {
  return (
    <section id="features" className={`${styles.section} ${styles.features}`} aria-labelledby="features-title">
      <SectionHead label="(03) Key Features" dark />
      <SplitHeading id="features-title" className={`${styles.titleL} ${styles.featuresTitle}`} {...heading} />

      <div className={styles.featList}>
        {features.map((f, i) => {
          const alt = `${project} ${f.title.replace('.', '')} screen`;
          return (
            <article key={f.title} className={i % 2 ? `${styles.feat} ${styles.featFlip}` : styles.feat}>
              <div {...reveal('fade')} className={styles.featMedia}>
                <div className={styles.featFrame}>
                  <div aria-hidden="true" className={styles.featGlow} />
                  <div className={styles.featShadow}>
                    {'image' in f.media ? (
                      <Image {...img(f.media.image)} alt={alt} sizes="(max-width: 760px) 92vw, 54vw" className={styles.featImg} />
                    ) : (
                      <div className={`${styles.videoFrame} ${styles.featVideo}`} style={{ background: f.media.tone }}>
                        {f.media.video(alt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div {...reveal('fade', 120)} className={styles.featText}>
                <span className={styles.featNum}>{pad2(i + 1)}</span>
                <h3 className={styles.featTitle}>{f.title}</h3>
                <p className={styles.featBody}>{f.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
