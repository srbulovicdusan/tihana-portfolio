import { reveal } from '@/lib/reveal';
import styles from './Perspective.module.css';

export function Perspective() {
  return (
    <section id="perspective" className={styles.section} aria-labelledby="perspective-title">
      <div className={styles.grid}>
        <h2 id="perspective-title" className={styles.title}>
          <span className="hl">
            <span {...reveal('fade')} className="blk">Different</span>
          </span>
          <span className={`hl ${styles.i25}`}>
            <span {...reveal('fade', 120)} className="blk it-light">disciplines.</span>
          </span>
          <span className={`hl ${styles.indent}`}>
            <span {...reveal('fade', 240)} className="blk">One design</span>
          </span>
          <span className={`hl ${styles.indent} ${styles.nowrap}`}>
            <span {...reveal('fade', 360)} className="blk">
              <span aria-hidden="true" className="spacer">One </span>
              <span className="it">perspective.</span>
            </span>
          </span>
        </h2>

        <div {...reveal('fade', 480)} className={styles.para}>
          <span className={`eyebrow ${styles.label}`}>(02) Approach</span>
          <p className={styles.text}>
            I work across branding, UI/UX, web and email, which lets me keep every part of a brand consistent, from the
            first sketch to the final screen.
          </p>
        </div>
      </div>
    </section>
  );
}
