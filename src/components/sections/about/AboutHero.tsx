import Image from 'next/image';
import { ScrollLink } from '@/components/behavior/ScrollLink';
import { Arrow } from '@/components/ui/Arrow';
import { img } from '@/lib/images';
import { reveal } from '@/lib/reveal';
import styles from './AboutHero.module.css';

/**
 * Wide (> 760px): full-height portrait with the heading split into two
 * absolutely positioned groups. Compact (≤ 760px): portrait card above a
 * stacked heading. One DOM, re-laid-out per breakpoint in CSS.
 */
export function AboutHero() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={styles.hero}>
        <div className={styles.portraitBox}>
          <Image
            {...img('/images/tihana-portrait.png')}
            alt="Portrait of Tihana"
            sizes="(max-width: 760px) 222vw, 178vh"
            preload
            className={styles.portrait}
          />
        </div>

        <div className={styles.text}>
          <h1 id="about-title" className={styles.title}>
            <span className={styles.groupA}>
              <span className="hl">
                <span {...reveal('fade')} className="blk">A little</span>
              </span>
              <span className={`hl ${styles.lineMore}`}>
                <span {...reveal('fade', 120)} className="blk">
                  <span aria-hidden="true" className={`spacer ${styles.spacer}`}>A </span>
                  <span className="it-light">more</span>
                </span>
              </span>
            </span>
            <span className={styles.groupB}>
              <span className={`hl ${styles.lineAbout}`}>
                <span {...reveal('fade', 240)} className="blk">about</span>
              </span>
              <span className={`hl ${styles.lineMe}`}>
                <span {...reveal('fade', 360)} className="blk it">me.</span>
              </span>
            </span>
          </h1>

          <div {...reveal('fade', 480)} className={styles.intro}>
            <span className={`eyebrow ${styles.introLabel}`}>(01) About</span>
            <p className={styles.introText}>
              <span className={styles.ln}>Hi, I&apos;m Tihana, a multidisciplinary designer </span>
              <span className={styles.ln}>working across brand identity, UI/UX, </span>
              <span className={styles.ln}>web and email design.</span>
            </p>
          </div>

          <div className={styles.bar}>
            <span>Based in Serbia, working worldwide</span>
            <ScrollLink href="#experience" to="experience" className={styles.expLink}>
              Experience <Arrow dir="down" />
            </ScrollLink>
          </div>
        </div>
      </div>
    </section>
  );
}
