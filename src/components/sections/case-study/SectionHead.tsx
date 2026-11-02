import { reveal } from '@/lib/reveal';
import styles from './case-study.module.css';

type Props = {
  label: string;
  dark?: boolean;
  /** For a section without a display heading: the label becomes its h2 */
  headingId?: string;
};

/** Section label row and its rule: "(02) Overview" ───────── */
export function SectionHead({ label, dark, headingId }: Props) {
  const className = dark ? styles.strongDark : styles.strong;
  return (
    <>
      <div className={`eyebrow ${styles.metaRow}${dark ? ` ${styles.metaDark}` : ''}`}>
        {headingId ? (
          <h2 id={headingId} className={`${className} ${styles.labelHeading}`}>
            {label}
          </h2>
        ) : (
          <span className={className}>{label}</span>
        )}
      </div>
      <div {...reveal('rule')} className={dark ? styles.ruleDark : styles.rule} />
    </>
  );
}
