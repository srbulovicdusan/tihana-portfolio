import { ScrollLink } from '@/components/behavior/ScrollLink';
import { Arrow } from '@/components/ui/Arrow';
import { reveal } from '@/lib/reveal';
import { site } from '@/lib/site';
import { NameSignature } from './NameSignature';
import styles from './ContactSection.module.css';

type Props = {
  /** Portfolio variant shows the "Contact · Available for projects" bar. */
  withHeader?: boolean;
  /** Anchor the "Back to top" link falls back to without JS. */
  topHref: `#${string}`;
  /** Hairline along the top edge (Email Design) */
  divider?: boolean;
};

export function ContactSection({ withHeader, topHref, divider }: Props) {
  return (
    <section id="contact" className={divider ? `${styles.contact} ${styles.divider}` : styles.contact} aria-labelledby="contact-title">
      {withHeader && (
        <>
          <div className={`eyebrow ${styles.head}`}>
            <span>Contact</span>
            <span className={styles.avail}>
              <span className={styles.dot} />
              Available for projects
            </span>
          </div>
          <div {...reveal('rule')} className={styles.rule} />
        </>
      )}

      <h2 id="contact-title" className={styles.title}>
        <span className="hl hl-clip">
          <span {...reveal('line')} className="blk">Let&apos;s make</span>
        </span>
        <span className={`hl hl-clip ${styles.indent}`}>
          <span {...reveal('line', 110)} className="blk it">
            <span className={styles.muted}>something</span> happen.
          </span>
        </span>
      </h2>

      <div {...reveal('fade', 160)} className={styles.emailWrap}>
        <a href={`mailto:${site.email}`} className={styles.email}>
          <span className={styles.emailText}>{site.email}</span>
          <Arrow dir="up-right" className={styles.emailArrow} />
          <span className={styles.emailBase} />
          <span className={styles.emailLine} />
        </a>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerBar}>
          <ScrollLink href={topHref} to="top" className={styles.top}>
            Back to top <Arrow dir="up" />
          </ScrollLink>
        </div>
        <NameSignature name={site.fullName} />
      </footer>
    </section>
  );
}
