import { pad2 } from '@/lib/projects';
import { reveal } from '@/lib/reveal';
import { SectionHead } from './SectionHead';
import { SplitHeading } from './SplitHeading';
import styles from './case-study.module.css';

type Props = {
  heading: { first: string; indent: string; accent: string };
  challenge: string;
  approach: string;
  /** "Key questions", "Key goals" */
  listLabel: string;
  /** Four items sit in four columns (two on mobile), three in three (one on mobile) */
  items: string[];
};

export function Overview({ heading, challenge, approach, listLabel, items }: Props) {
  return (
    <section id="overview" className={styles.section} aria-labelledby="overview-title">
      <SectionHead label="(02) Overview" />
      <SplitHeading id="overview-title" className={`${styles.titleL} ${styles.overviewTitle}`} {...heading} />

      <div className={styles.cols2}>
        <div {...reveal('fade')} className={styles.stack}>
          <span className={`eyebrow ${styles.label}`}>Challenge</span>
          <p className={`${styles.body} ${styles.measure520}`}>{challenge}</p>
        </div>
        <div {...reveal('fade', 120)} className={styles.stack}>
          <span className={`eyebrow ${styles.label}`}>Approach</span>
          <p className={`${styles.body} ${styles.measure520}`}>{approach}</p>
        </div>
      </div>

      <div {...reveal('fade')} className={`${styles.stack} ${styles.questions}`}>
        <span className={`eyebrow ${styles.label}`}>{listLabel}</span>
        <ol className={items.length === 3 ? `${styles.qList} ${styles.qList3}` : styles.qList}>
          {items.map((q, i) => (
            <li key={q} className={styles.q}>
              <span className={styles.qNum}>{pad2(i + 1)}</span>
              <span className={styles.qText}>{q}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
