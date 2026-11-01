import { pad2 } from '@/lib/projects';
import { reveal } from '@/lib/reveal';
import { SplitHeading } from './SplitHeading';
import styles from './profitz.module.css';

const QUESTIONS = ['How much am I actually making?', 'Which products are profitable?', 'Is my advertising paying off?', 'Where am I losing money?'];

export function Overview() {
  return (
    <section id="overview" className={styles.section} aria-labelledby="overview-title">
      <div className={`eyebrow ${styles.metaRow}`}>
        <span className={styles.strong}>(02) Overview</span>
      </div>
      <div {...reveal('rule')} className={styles.rule} />
      <SplitHeading
        id="overview-title"
        className={`${styles.titleL} ${styles.overviewTitle}`}
        first="High revenue can hide"
        indent="High revenue can "
        accent="thin margins."
      />

      <div className={styles.cols2}>
        <div {...reveal('fade')} className={styles.stack}>
          <span className={`eyebrow ${styles.label}`}>Challenge</span>
          <p className={`${styles.body} ${styles.measure520}`}>
            Shopify shows revenue, Meta Ads shows spend, and everything else lives in spreadsheets. Store owners
            couldn&apos;t see what they actually earn.
          </p>
        </div>
        <div {...reveal('fade', 120)} className={styles.stack}>
          <span className={`eyebrow ${styles.label}`}>Approach</span>
          <p className={`${styles.body} ${styles.measure520}`}>
            One interface built around net profit. Revenue, costs, ad spend and ROAS are arranged around it, from a global
            overview down to products, campaigns and daily metrics.
          </p>
        </div>
      </div>

      <div {...reveal('fade')} className={`${styles.stack} ${styles.questions}`}>
        <span className={`eyebrow ${styles.label}`}>Key questions</span>
        <ol className={styles.qList}>
          {QUESTIONS.map((q, i) => (
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
