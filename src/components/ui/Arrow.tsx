import { MoveDown, MoveLeft, MoveRight, MoveUp, MoveUpRight } from 'lucide-react';
import styles from './Arrow.module.css';

// Long, thin "Move" arrows: closest to the design's typographic arrows
const ICONS = { up: MoveUp, down: MoveDown, left: MoveLeft, right: MoveRight, 'up-right': MoveUpRight };

/**
 * Decorative arrow icon, 1em square in the current text colour. Replaces the
 * ←/→/↑/↓/↗ glyphs: the text font has none, and iOS falls back to colour emoji.
 */
export function Arrow({ dir, className }: { dir: keyof typeof ICONS; className?: string }) {
  const Icon = ICONS[dir];
  return <Icon aria-hidden="true" size="1em" strokeWidth={1.5} className={className ? `${styles.arrow} ${className}` : styles.arrow} />;
}
