import { Arrow } from './Arrow';
import styles from './ArrowSwap.module.css';

/**
 * Two stacked ↗ arrows; on hover of an ancestor `[data-arrow-host]` the first
 * slides out top-right while the second slides in from bottom-left.
 * Font size comes from the `className` passed in.
 */
export function ArrowSwap({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={className ? `${styles.box} ${className}` : styles.box}>
      <span className={styles.a}>
        <Arrow dir="up-right" />
      </span>
      <span className={styles.b}>
        <Arrow dir="up-right" />
      </span>
    </span>
  );
}
