import type { CSSProperties } from 'react';
import styles from './ContactSection.module.css';

// [char, left (‰ of width), top (‰ of width), rotation°, size (cqw)] on a
// full-bleed 1000×150 box, cropped at the bottom.
const LETTERS: [string, number, number, number, number][] = [
  ['t', -8, 5, -8, 19.5], ['i', 57, -3, 7, 19.5], ['h', 99, 7, -4, 19.5], ['a', 167, -6, -34, 17.6],
  ['n', 229, 17, -78, 18.5], ['a', 303, 3, 0, 21.3], ['d', 452, 8, -3, 19.8], ['r', 548, 12, 4, 18.1],
  ['v', 593, 10, -2, 18.1], ['e', 668, 9, 0, 18.9], ['n', 750, 1, 90, 18.1], ['i', 835, -6, -3, 18.1],
  ['c', 857, 13, 32, 18.1], ['a', 930, 5, -6, 18.9],
];

/**
 * Knockout name: white letters blended with `difference` inside an isolated
 * black box give the XOR of glyph coverage (overlaps turn black); the box
 * filter then maps black→#090909 and white→#484848. Letters swing into place
 * when the signature scrolls into view (data-on, set by lib/runtime/reveal-runtime).
 */
export function NameSignature({ name }: { name: string }) {
  return (
    <div className={styles.sig} role="img" aria-label={name.toLowerCase()} data-name-sig="" suppressHydrationWarning>
      {LETTERS.map(([ch, x, y, rot, size], i) => {
        const k = i % 2 ? 1 : -1;
        const style = {
          '--x': `${x / 10}%`,
          '--y': `${y / 10}cqw`,
          '--s': `${size}cqw`,
          '--r': `${rot}deg`,
          '--r0': `${rot - k * 35}deg`,
          '--dx': `${k * 1.5}cqw`,
          '--d': `${i * 18}ms`,
        } as CSSProperties;
        return (
          <span key={i} aria-hidden="true" className={styles.letter} style={style}>
            {ch}
          </span>
        );
      })}
    </div>
  );
}
