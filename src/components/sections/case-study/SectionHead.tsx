import { reveal } from '@/lib/reveal';
import styles from './case-study.module.css';

/** Section label row and its rule: "(02) Overview" ───────── */
export function SectionHead({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <>
      <div className={`eyebrow ${styles.metaRow}${dark ? ` ${styles.metaDark}` : ''}`}>
        <span className={dark ? styles.strongDark : styles.strong}>{label}</span>
      </div>
      <div {...reveal('rule')} className={dark ? styles.ruleDark : styles.rule} />
    </>
  );
}
