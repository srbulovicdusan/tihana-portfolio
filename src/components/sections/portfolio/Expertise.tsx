import { reveal } from '@/lib/reveal';
import { ExpertiseList } from './ExpertiseList';
import styles from './Expertise.module.css';

export function Expertise() {
  return (
    <section id="expertise" className={styles.section} aria-labelledby="expertise-title">
      <div className={styles.head}>
        <div {...reveal('fade')} className={`eyebrow ${styles.label}`}>
          <span className={styles.labelStrong}>(04) Expertise</span>
          <span>Index of disciplines</span>
        </div>
        <h2 id="expertise-title" className={styles.title}>
          <span className="hl hl-clip">
            <span {...reveal('line')} className="blk">
              What I <span className={styles.titleIt}>do.</span>
            </span>
          </span>
        </h2>
      </div>
      <ExpertiseList />
    </section>
  );
}
