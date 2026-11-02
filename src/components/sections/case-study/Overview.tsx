import { pad2 } from '@/lib/projects';
import { reveal } from '@/lib/reveal';
import { SectionHead } from './SectionHead';
import { SplitHeading } from './SplitHeading';
import styles from './case-study.module.css';

type Props = {
  heading: { first: string; indent: string; accent: string };
  challenge: string;
  approach: string;
  /** "Key questions", "Key goals", "Key principles" */
  listLabel: string;
  /**
   * Four items sit in four columns, three in three; one column on mobile.
   * Items with a description also drop to two columns on tablets.
   */
  items: string[] | { title: string; text: string }[];
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
        <ol className={[styles.qList, items.length === 3 && styles.qList3, typeof items[0] === 'object' && styles.qListNotes].filter(Boolean).join(' ')}>
          {items.map((q, i) => {
            const { title, text } = typeof q === 'string' ? { title: q, text: '' } : q;
            return (
              <li key={title} className={styles.q}>
                <span className={styles.qNum}>{pad2(i + 1)}</span>
                <span className={styles.qText}>{title}</span>
                {text && <span className={styles.qNote}>{text}</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
