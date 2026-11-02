/**
 * Hero corridor engine: positions and animates the project cards rendered in
 * the hero stage, plus the pointer parallax of the studio light.
 *
 * On a full page load it runs as an inline <script> right after the stage
 * markup (components/sections/portfolio/Hero.tsx), so the corridor appears
 * before React hydrates — like the original design export. After client-side
 * navigation HeroScene starts it instead. The handle is stored on the stage.
 *
 * Geometry is one continuous path per side, in card-steps (t = 0: innermost
 * resting card):
 *   scale  s(t) = S_IN·G^t, with G chosen so the card FG steps out is the
 *          foreground (s = 1); for −1 < t < 0 a card emerges from behind the
 *          innermost one.
 *   inner edge e(t) = GAP + W·∫ q(τ)·s(τ)·cosθ dτ, where the spacing density q
 *          eases from Q_IN at the centre to Q_OUT at the foreground, so overlap
 *          depends on position along the path rather than a constant.
 *
 * Must stay self-contained (no imports or outer references): it is serialised
 * with Function.prototype.toString.
 */
export function corridorRuntime(stage: HTMLElement): { destroy(): void } {
  type Card = { c: HTMLElement; sh: HTMLElement; side: number; on: boolean; z: number; shv: number };
  type Geometry = { vw: number; W: number; GAP: number; tExit: number; persp: string; sc: (t: number) => number; Et: (t: number) => number; tilt: (t: number) => number };

  const L0 = {
    AR: 5 / 6, // shared 5:6 portrait card
    TILT: 20, // inward turn (deg) of the side cards
    TILT_IN: 8, // the two centre cards turn less, so they read first
    SPEED: 0.5, // corridor flow in card-steps per second
    S_IN: 0.62, // centre card height relative to the foreground card
    Q_IN: 1.0, // spacing density at the centre: neighbours clear each other
    Q_OUT: 0.5, // spacing density at the foreground: layered edges
    GAP: 0.004, // hairline gap between the two centre cards (fraction of width)
    OVERLAP_FROM: 0.3, // fraction of the path before overlap starts to build
    EMERGE: 0.55, // the next card grows from this fraction of the centre card, hidden behind it
    MAX_H: 0.5, // foreground card height cap, fraction of hero height
    MOB_ZOOM: 1.4, // phones: larger cards, the outer ones run past the screen edges
    ENTRY_DUR: 2400,
    ENTRY_DELAY: 300,
    START_TILT: 1.7,
  };
  const DT = 0.01;
  const T1 = 10;

  const hero = stage.parentElement!;
  const M = stage.children.length / 2; // cards per side
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rad = (d: number) => (d * Math.PI) / 180;
  const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
  const smooth = (a: number, b: number, x: number) => {
    const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return k * k * (3 - 2 * k);
  };
  // cubic-bezier(.22, 1, .36, 1)
  const ease = (x: number) => {
    const cx = 0.66, bx = 3 * (0.36 - 0.22) - cx, ax = 1 - cx - bx;
    const cy = 3, by = 3 * (1 - 1) - cy, ay = 1 - cy - by;
    let t = x;
    for (let j = 0; j < 8; j++) {
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t -= (((ax * t + bx) * t + cx) * t - x) / d;
    }
    t = Math.min(1, Math.max(0, t));
    return ((ay * t + by) * t + cy) * t;
  };

  const els = Array.from(stage.children) as HTMLElement[];
  const sides: Card[][] = [-1, 1].map((side, s) =>
    els.slice(s * M, s * M + M).map(c => ({ c, sh: c.querySelector<HTMLElement>('[data-shade]')!, side, on: true, z: -1, shv: -1 })),
  );

  let g: Geometry;
  function measure() {
    const vw = hero.clientWidth, vh = hero.clientHeight;
    const mob = vw <= 760, tab = !mob && vw <= 1100;
    const FG = mob ? 2 : tab ? 2.5 : 3; // steps from innermost to foreground card
    const G = Math.pow(1 / L0.S_IN, 1 / FG);
    const cosT = Math.cos(rad(L0.TILT));
    const tilt = (t: number) => L0.TILT_IN + (L0.TILT - L0.TILT_IN) * smooth(0, 1.6, t);
    const q = (t: number) => L0.Q_IN + (L0.Q_OUT - L0.Q_IN) * smooth(FG * L0.OVERLAP_FROM, FG + 0.4, t);
    const sc = (t: number) => (t < 0 ? L0.S_IN * (1 - (1 - L0.EMERGE) * t * t) : L0.S_IN * Math.pow(G, t));
    const table: number[] = [];
    let E = 0;
    for (let t = 0; t <= T1 + 1e-9; t += DT) {
      table.push(E);
      const m = t + DT / 2;
      E += q(m) * sc(m) * Math.cos(rad(tilt(m))) * DT;
    }
    const Et = (t: number) => {
      if (t <= 0) return 0;
      const f = Math.min(T1, t) / DT, i = Math.floor(f), k = f - i;
      const a = table[i] ?? 0;
      return a + ((table[i + 1] ?? a) - a) * k;
    };
    // Foreground size is locked to the reference layout (S_IN .5, Q_IN .82) so the sides keep their
    // scale; card WIDTH drives the horizontal geometry, the 5:6 shape only makes cards taller. If the
    // hero is too short, the whole corridor scales down uniformly.
    const G0 = Math.pow(2, 1 / FG);
    let E0 = 0;
    for (let t = -1; t < FG + 0.75; t += DT) {
      const m = t + DT / 2;
      const s0 = m < 0 ? 0.5 * Math.pow(G0, m) * (1 - m * m) : 0.5 * Math.pow(G0, m);
      const q0 = m < 0 ? 0.82 * (0.55 + 0.45 * smooth(-1, 0, m)) : 0.82 + (0.46 - 0.82) * smooth(0, FG, m);
      E0 += q0 * s0 * cosT * DT;
    }
    let W = ((vw / 2 - vw * (mob ? 0.035 : 0.045)) / E0) * (mob ? L0.MOB_ZOOM : 1);
    let H = W / L0.AR;
    if (H > vh * L0.MAX_H) {
      H = vh * L0.MAX_H;
      W = H * L0.AR;
    }
    const GAP = vw * L0.GAP;
    let tExit = 0;
    while (tExit < T1 && GAP + W * Et(tExit) < vw / 2 + 8) tExit += 0.05;
    g = { vw, W, GAP, tExit, sc, Et, tilt, persp: (W * 3.2).toFixed(0) };
    for (const arr of sides) {
      for (const cd of arr) {
        const st = cd.c.style;
        st.width = `${W}px`;
        st.height = `${H}px`;
        st.marginLeft = `${-W / 2}px`;
        st.marginTop = `${-H / 2}px`;
      }
    }
  }

  let phase = 0.35;
  let P = reduced ? 1 : 0;
  function render() {
    const fold = L0.S_IN * 0.9;
    for (let i = 0; i < M; i++) {
      const t = -1 + ((phase + i) % M); // stable identity, modular position along the path
      const on = t < g.tExit + 0.6;
      const z = 10 + Math.floor(t + 1);
      for (const arr of sides) {
        const cd = arr[i]!;
        if (cd.on !== on) {
          cd.on = on;
          cd.c.style.display = on ? '' : 'none';
        }
        if (!on) continue;
        const s = Math.max(1e-4, g.sc(t)), tl = g.tilt(t);
        const pw = g.W * s * Math.cos(rad(tl));
        const x = cd.side * (g.GAP + g.W * g.Et(t) + pw / 2);
        const rot = -cd.side * tl;
        const X = lerp(0, x, P), RT = lerp(rot * L0.START_TILT, rot, P), S = lerp(Math.min(s, fold), s, P);
        cd.c.style.transform = `translate3d(${X.toFixed(2)}px,0,0) scale(${S.toFixed(5)}) perspective(${g.persp}px) rotateY(${RT.toFixed(2)}deg)`;
        if (cd.z !== z) {
          cd.z = z;
          cd.c.style.zIndex = String(z);
        }
        const sv = t < 0 ? 0.12 : 0;
        if (cd.shv !== sv) {
          cd.shv = sv;
          cd.sh.style.opacity = String(sv);
        }
      }
    }
  }

  let raf = 0, last = 0, t0 = 0, visible = true, started = false, disposed = false;
  function tick(now: number) {
    raf = 0;
    if (!t0) t0 = now;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    P = ease(Math.min(1, Math.max(0, (now - t0 - L0.ENTRY_DELAY) / L0.ENTRY_DUR)));
    phase += dt * L0.SPEED * P; // flow ramps in with the entrance, so there is no hand-off jump
    if (phase > M * 1000) phase %= M;
    render();
    if (visible) raf = requestAnimationFrame(tick);
  }
  const play = () => {
    if (!raf && !reduced && started && !disposed) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const io = new IntersectionObserver(es => {
    visible = !!es[0]?.isIntersecting;
    if (visible) play();
    else stop();
  });
  io.observe(hero);
  const onVisibility = () => (document.hidden ? stop() : visible && play());
  const onResize = () => {
    measure();
    render();
  };
  const ro = new ResizeObserver(() => {
    if (hero.clientWidth && hero.clientWidth !== g.vw) onResize();
  });
  ro.observe(hero);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', onResize);
  window.addEventListener('pagehide', stop);

  measure();
  render();
  stage.setAttribute('data-ready', '');

  // Start once the card images are in (or after 1.5s, whichever is first)
  const loads = Array.from(stage.querySelectorAll('img'), im =>
    im.complete
      ? Promise.resolve()
      : new Promise<void>(r => {
          im.addEventListener('load', () => r(), { once: true });
          im.addEventListener('error', () => r(), { once: true });
        }),
  );
  Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 1500))]).then(() => {
    if (disposed) return;
    started = true;
    if (reduced) {
      P = 1;
      render();
    } else play();
  });

  // Studio light follows the pointer, gently (fine pointers only)
  const mv = hero.querySelector<HTMLElement>('[data-hero-light]');
  let lraf = 0;
  const MAX = 28, K = 0.045;
  let tx = 0, ty = 0, lx = 0, ly = 0;
  const ltick = () => {
    lx += (tx - lx) * K;
    ly += (ty - ly) * K;
    mv!.style.transform = `translate3d(${lx.toFixed(2)}px,${ly.toFixed(2)}px,0)`;
    lraf = Math.abs(tx - lx) > 0.05 || Math.abs(ty - ly) > 0.05 ? requestAnimationFrame(ltick) : 0;
  };
  const go = () => {
    if (!lraf) lraf = requestAnimationFrame(ltick);
  };
  const onMove = (e: PointerEvent) => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2 * MAX;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2 * MAX * 0.6;
    go();
  };
  const onLeave = () => {
    tx = 0;
    ty = 0;
    go();
  };
  const parallax = !!mv && !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (parallax) {
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
  }

  const handle = {
    destroy() {
      disposed = true;
      stop();
      cancelAnimationFrame(lraf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pagehide', stop);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
    },
  };
  (stage as HTMLElement & { __corridor?: typeof handle }).__corridor = handle;
  return handle;
}
