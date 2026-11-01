'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { pad2 } from '@/lib/projects';
import { reveal } from '@/lib/reveal';
import { useMediaQuery } from '@/lib/use-media-query';
import styles from './Expertise.module.css';

const ROWS = ['UI/UX Design', 'Web Design', 'Brand Identity', 'Email Design'];

// Hover previews, one per row. Rows without a video show an empty frame.
const PREVIEWS: { name: string; video?: string; tag?: string }[] = [
  { name: 'Art Provenance' },
  { name: 'ArtProvenance', video: '/videos/artprovenance-preview.mp4', tag: 'Website preview' },
  { name: 'Sekundarac', video: '/videos/sekundarac-logo-animation.mp4', tag: 'Logo Animation' },
  { name: 'Email & Digital Campaigns' },
];

// "mobile" in the original design: narrow viewports or touch-only devices
const MOBILE = '(max-width: 760px), (hover: none)';

function autoplay(el: HTMLVideoElement | null) {
  if (!el) return;
  el.muted = true;
  el.defaultMuted = true;
  el.play()?.catch(() => {});
}

function Video({ src, className }: { src: string; className?: string }) {
  return <video ref={autoplay} src={src} className={className} autoPlay loop muted playsInline preload="auto" disablePictureInPicture />;
}

export function ExpertiseList() {
  const mobile = useMediaQuery(MOBILE);
  const [row, setRow] = useState(-1); // hovered / focused row
  const [open, setOpen] = useState(-1); // mobile: row whose inline video is open
  const [videosNear, setVideosNear] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const active = mobile && open >= 0 ? open : row;
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Mount the (desktop) preview videos once the section approaches the viewport.
  useEffect(() => {
    const section = listRef.current?.parentElement;
    if (!section || videosNear) return;
    const io = new IntersectionObserver(es => es.some(e => e.isIntersecting) && setVideosNear(true), { rootMargin: '50% 0px' });
    io.observe(section);
    return () => io.disconnect();
  }, [videosNear]);

  // The preview card trails the cursor anywhere inside the section.
  useEffect(() => {
    const section = listRef.current?.parentElement;
    if (!section || mobile) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let px: number | null = null, py = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      const pv = previewRef.current;
      if (!pv || px === null) {
        raf = 0;
        return;
      }
      const k = reduced ? 1 : 0.14;
      px += (tx - px) * k;
      py += (ty - py) * k;
      pv.style.transform = `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0)`;
      raf = Math.abs(tx - px) + Math.abs(ty - py) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: MouseEvent) => {
      const pv = previewRef.current;
      if (!pv) return;
      const r = section.getBoundingClientRect();
      const w = pv.offsetWidth || 200, h = pv.offsetHeight || 280;
      const x = e.clientX - r.left, y = e.clientY - r.top;
      tx = x + 32;
      if (tx + w > r.width - 12) tx = x - 32 - w;
      ty = Math.max(0, Math.min(r.height - h, y - h / 2));
      if (px === null || activeRef.current < 0) {
        px = tx;
        py = ty;
      }
      if (!raf) loop();
    };
    section.addEventListener('mousemove', onMove);
    return () => {
      section.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [mobile]);

  const preview = active >= 0 ? PREVIEWS[active] : undefined;

  return (
    <>
      <div
        ref={listRef}
        className={styles.list}
        onMouseLeave={() => setRow(-1)}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget)) setRow(-1);
        }}
      >
        {ROWS.map((label, i) => {
          const on = active === i;
          const alt = i % 2 === 1;
          const video = PREVIEWS[i]?.video;
          return (
            <Fragment key={label}>
              <a
                href="#work"
                className={alt ? `${styles.row} ${styles.alt}` : styles.row}
                data-on={on || undefined}
                data-dim={(active >= 0 && !on) || undefined}
                onPointerEnter={e => e.pointerType !== 'touch' && setRow(i)}
                onFocus={() => setRow(i)}
                onClick={e => {
                  if (!mobile || !video) return;
                  e.preventDefault();
                  setOpen(open === i ? -1 : i);
                }}
              >
                <span className={styles.rowLine} />
                <span className={styles.rowNum}>({pad2(i + 1)})</span>
                <span className={styles.rowLabel}>
                  {label}
                  <span aria-hidden="true" className={styles.rowArrow}>→</span>
                </span>
              </a>
              {mobile && open === i && video && (
                <div className={alt ? styles.inline : `${styles.inline} ${styles.inlineIndent}`}>
                  <Video src={video} className={styles.inlineVideo} />
                </div>
              )}
            </Fragment>
          );
        })}
        <div {...reveal('rule')} className={styles.listRule} />
      </div>

      <div ref={previewRef} aria-hidden="true" className={styles.preview}>
        <div className={styles.pvInner} data-on={active >= 0 || undefined}>
          <div className={styles.pvMedia}>
            {PREVIEWS.map((v, i) => (
              <div key={v.name} className={styles.pvLayer} style={{ opacity: i === active ? 1 : 0 }}>
                {v.video ? videosNear && !mobile && <Video src={v.video} className={styles.pvVideo} /> : <div className={styles.pvBlank} />}
              </div>
            ))}
          </div>
          <div className={styles.pvCaption}>
            <span>{preview?.name ?? ''}</span>
            <span>{preview?.video ? preview.tag : 'Placeholder'}</span>
          </div>
        </div>
      </div>
    </>
  );
}
