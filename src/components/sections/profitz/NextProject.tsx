import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/lib/images';
import { reveal } from '@/lib/reveal';
import { routes } from '@/lib/site';
import styles from './profitz.module.css';

export function NextProject() {
  return (
    <section id="next" className={styles.next} aria-label="Next project">
      <div className={`eyebrow ${styles.metaRow}`}>
        <span className={styles.strong}>Next project →</span>
        <Link href={routes.work} className={styles.backSmall}>
          ← Back to work
        </Link>
      </div>
      <div {...reveal('rule')} className={styles.rule} />
      {/* No Days Wasted has no case study page yet; this opens its placeholder on the portfolio. */}
      <Link href="/#work/no-days-wasted" className={styles.nextLink}>
        <div className={styles.nextMedia}>
          <Image
            {...img('/images/no-days-wasted-laptop.webp')}
            alt="No Days Wasted website on a laptop"
            sizes="(max-width: 760px) 92vw, 46vw"
            className={styles.nextImg}
          />
        </div>
        <div className={styles.nextText}>
          <span className={`eyebrow ${styles.label}`}>Case Study (03)</span>
          <h2 className={styles.nextTitle}>
            <span>No Days Wasted</span>
            <span aria-hidden="true" className={styles.nextArrow}>→</span>
            <span className={styles.nextBase} />
            <span className={styles.nextLine} />
          </h2>
          <span className={`eyebrow ${styles.label}`}>E-commerce · Website Redesign</span>
        </div>
      </Link>
    </section>
  );
}
