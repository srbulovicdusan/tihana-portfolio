'use client';

import Image from 'next/image';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { img } from '@/lib/images';
import { corridorRuntime } from '@/lib/runtime/corridor-runtime';
import styles from './Hero.module.css';

/* One cyclic image sequence. Each side loops its own six images (left =
   SEQ[0..5], right = SEQ[6..11]); a card at depth d at rest shows index
   (−d mod 6), so mirrored depths always show different projects. */
const SEQ = [
  img('/images/hero/jewelry-market-packaging.webp'),
  img('/images/hero/predator.webp'),
  img('/images/hero/no-days-wasted.webp'),
  img('/images/hero/winchester.webp'),
  img('/images/hero/profitz.webp'),
  img('/images/hero/artprovenance.webp'),
  img('/images/hero/mobile-analytics.webp'),
  img('/images/hero/miltop-invest.webp'),
  img('/images/hero/classic-car-register.webp'),
  img('/images/hero/sekundarac.webp'),
  img('/images/hero/jewelry-market-editorial.webp'),
  img('/images/hero/just-quit.webp'),
];

// Cards per side. The path's exit point always lies within 12 steps, and a
// multiple of the 6-image loop keeps every card on a fixed image.
const M = 12;

// Foreground cards reach ~1.3× the card width (25 / 28 / 46 % of the hero).
const CARD_SIZES = '(max-width: 760px) 61vw, (max-width: 1100px) 37vw, 33vw';

type Stage = HTMLDivElement & { __corridor?: { destroy(): void } };

// Starts the corridor as soon as the stage is parsed (the stage is the
// script's previous sibling), without waiting for hydration.
const START = `(${corridorRuntime.toString()})(document.currentScript.previousElementSibling)`;

const noop = () => () => {};

/**
 * Hero backdrop: studio lighting and the corridor of project cards, animated
 * by corridorRuntime. On a full page load an inline script starts it during
 * HTML parsing; after client-side navigation (where React never executes
 * inline scripts, so none is rendered) the effect below starts it.
 * Elements the runtime styles opt out of hydration warnings.
 */
export function HeroScene() {
  const stageRef = useRef<Stage>(null);
  // true in server HTML and while hydrating it; false for client-side mounts
  const serverRendered = useSyncExternalStore(noop, () => false, () => true);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!stage.__corridor) corridorRuntime(stage);
    return () => {
      stage.__corridor?.destroy();
      stage.__corridor = undefined;
    };
  }, []);

  return (
    <>
      <div className={styles.glow} aria-hidden="true" data-hero-glow="">
        <div className={styles.mv} data-hero-light="" suppressHydrationWarning>
          <div className={styles.lt}>
            <div className={styles.beam} />
            <div className={styles.src} />
            <div className={styles.pool} />
            <div className={styles.haze} />
          </div>
        </div>
        <div className={styles.vig} />
      </div>

      <div className={styles.stage} aria-hidden="true" ref={stageRef} data-hero-stage="" suppressHydrationWarning>
        {[0, 1].map(s =>
          Array.from({ length: M }, (_, i) => (
            <div key={`${s}-${i}`} className={styles.card} suppressHydrationWarning>
              <div className={styles.frame}>
                <div className={styles.ct}>
                  <Image {...SEQ[s * 6 + ((M - i) % 6)]!} alt="" sizes={CARD_SIZES} loading="eager" draggable={false} className={styles.cardImg} />
                </div>
                <div className={styles.shade} data-shade="" suppressHydrationWarning />
              </div>
            </div>
          )),
        )}
      </div>
      {serverRendered && <script dangerouslySetInnerHTML={{ __html: START }} suppressHydrationWarning />}
    </>
  );
}
