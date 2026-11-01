import { reveal } from '@/lib/reveal';
import styles from './about.module.css';

const DEGREES = [
  { level: "Bachelor's Degree", field: 'Graphic Engineering and Design', status: 'Completed', done: true },
  { level: "Master's Studies", field: 'Graphic Engineering and Design', status: "Master's thesis in progress", done: false },
];

export function Education() {
  return (
    <section id="education" className={`${styles.section} ${styles.sectionPadded}`} aria-labelledby="education-title">
      <div className={`eyebrow ${styles.metaRow}`}>
        <span className={styles.strong}>(04) Education</span>
        <span>Novi Sad</span>
      </div>
      <div {...reveal('rule')} className={styles.rule} />

      <h2 id="education-title" className={`${styles.title} ${styles.titleEducation}`}>
        <span className="hl hl-clip">
          <span {...reveal('line')} className="blk">Learning</span>
        </span>
        <span className={`hl hl-clip ${styles.i25}`}>
          <span {...reveal('line', 100)} className="blk">
            never <span className="it-light">stops.</span>
          </span>
        </span>
      </h2>

      <div className={styles.eduGrid}>
        <div {...reveal('fade', 150)} className={styles.uni}>
          <span className={styles.uniName}>University of Novi Sad</span>
          <span className={styles.uniFaculty}>Faculty of Technical Sciences</span>
        </div>
        <div className={styles.degrees}>
          {DEGREES.map((d, i) => (
            <div key={d.level} {...reveal('fade', i * 120)} className={styles.degree}>
              <h3 className={styles.level}>{d.level}</h3>
              <span className={styles.status}>
                <span className={d.done ? styles.dot : `${styles.dot} ${styles.dotOpen}`} />
                {d.status}
              </span>
              <span className={styles.field}>{d.field}</span>
            </div>
          ))}
          <div className={styles.rule} />
        </div>
      </div>
    </section>
  );
}
