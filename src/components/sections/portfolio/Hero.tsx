import Link from 'next/link';
import { routes } from '@/lib/site';
import { HeroScene } from './HeroScene';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section id="intro" aria-label="Introduction" className={styles.intro}>
      <div className={styles.hero}>
        <HeroScene />

        <div className={`${styles.ui} ${styles.tl}`}>
          <div className={styles.logo}>
            Tihana<sup>©</sup>
          </div>
        </div>

        <div className={`${styles.ui} ${styles.tc}`}>
          <div className={styles.services}>
            Brand Identity<span className={styles.dv} aria-hidden="true">|</span>
            UI/UX Design<span className={styles.dv} aria-hidden="true">|</span>
            Web Design<span className={styles.dv} aria-hidden="true">|</span>
            Email Design
          </div>
        </div>

        <div className={`${styles.ui} ${styles.tr}`}>
          <nav className={styles.nav} aria-label="Primary">
            <a href="#work">Work</a>
            <Link href={routes.about}>About ↗</Link>
          </nav>
        </div>

        <h1 className={`${styles.ui} ${styles.ml}`}>
          <span className={styles.hi}>Hi, I&apos;m Tihana —</span>
          <span className={styles.ln}>I design brands and everything they touch.</span>
          <span className={styles.ln}>From the first logo to the last email.</span>
        </h1>

        <div className={`${styles.ui} ${styles.mr}`}>
          <a className={styles.cta} href="#contact">
            Start a project <span>→</span>
          </a>
        </div>

        <div className={`${styles.info} ${styles.ui}`}>
          <a className={styles.explore} href="#work">
            Explore selected projects <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className={styles.grain} />
      </div>
      <div className={styles.fade} aria-hidden="true" data-hero-fade="" />
    </section>
  );
}
