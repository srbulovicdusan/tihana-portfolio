'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Arrow } from '@/components/ui/Arrow';
import { pad2 } from '@/lib/projects';
import styles from './email-design.module.css';

export type LightboxEmail = { brand: string; desc: string; src: string; width: number; height: number };

/**
 * Full-email viewer for the gallery cards in its children (`[data-email]`
 * buttons holding the email's index). Previous/next wrap around (also ← →),
 * Escape or a click beside the email closes it. The page doesn't scroll while
 * it is open, Tab stays inside it, and focus returns to the card afterwards.
 */
export function EmailLightbox({ emails, children }: { emails: LightboxEmail[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const count = emails.length;

  const step = useCallback((d: number) => setIndex(i => (i === null ? null : (i + d + count) % count)), [count]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    // Focus the scrolling area so ↑ ↓ and Space scroll the email
    scroller.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndex(null);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') {
        // The buttons, then the scrolling area
        const stops = dialog.current?.querySelectorAll<HTMLElement>('button, [tabindex="0"]');
        const first = stops?.[0];
        const last = stops?.[stops.length - 1];
        if (!first || !last) return;
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialog.current?.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialog.current?.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      html.style.overflow = '';
      trigger.current?.focus();
    };
  }, [open, step]);

  // Each email starts at its top
  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
  }, [index]);

  const email = index === null ? null : emails[index];

  return (
    <>
      <div
        onClick={e => {
          const card = (e.target as Element).closest<HTMLElement>('[data-email]');
          if (!card || !e.currentTarget.contains(card)) return;
          trigger.current = card;
          setIndex(Number(card.dataset.email));
        }}
      >
        {children}
      </div>

      {index !== null &&
        email &&
        createPortal(
          <div ref={dialog} role="dialog" aria-modal="true" aria-label={`${email.brand} email`} className={styles.lightbox}>
            <div className={styles.bar}>
              <span className={`eyebrow ${styles.barLabel}`}>Selected Emails</span>
              <div className={styles.controls}>
                <span className={styles.count}>{`${pad2(index + 1)} / ${pad2(count)}`}</span>
                <button type="button" aria-label="Previous email" className={styles.step} onClick={() => step(-1)}>
                  <Arrow dir="left" />
                </button>
                <button type="button" aria-label="Next email" className={styles.step} onClick={() => step(1)}>
                  <Arrow dir="right" />
                </button>
                <button type="button" aria-label="Close" className={styles.close} onClick={() => setIndex(null)}>
                  <X aria-hidden="true" size="1em" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div
              ref={scroller}
              tabIndex={0}
              className={styles.scroller}
              onClick={e => {
                if (e.target === e.currentTarget) setIndex(null);
              }}
            >
              <div className={styles.head}>
                <span className={styles.headBrand}>{email.brand}</span>
                <p className={styles.desc}>{email.desc}</p>
              </div>
              <div className={styles.full}>
                <Image
                  key={email.src}
                  src={email.src}
                  width={email.width}
                  height={email.height}
                  alt={`Full ${email.brand} email`}
                  sizes="(max-width: 760px) 100vw, 600px"
                  className={styles.fullImg}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
