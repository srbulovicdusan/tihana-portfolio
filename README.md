# Tihana — Portfolio

Next.js rebuild of three design exports (kept in the repo root as the visual source of truth):

| Export | Route |
| --- | --- |
| `Tihana Portfolio.html` | `/` |
| `Tihana About.html` | `/about` |
| `Profitz Case Study.html` | `/work/profitz` (`/projects/profits` and `/projects/profitz` redirect here, 308) |

The case-study URL follows the export's own scheme: cards without a page open an in-page placeholder at `#work/<slug>` whose copy reads "Route: /work/<slug>".

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · CSS Modules · ESLint 9 · Playwright + axe-core.
No UI, animation or CSS-in-JS libraries.

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL to the production origin
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run build` / `npm start` | Production build (all routes statically prerendered) / serve it |
| `npm run lint` · `npm run typecheck` | ESLint · `tsc --noEmit` |
| `npm run test:e2e` | Playwright tests against the production build (run `npm run build` first) |
| `npm run assets:extract` | Re-extract images, videos and fonts from the HTML exports |
| `npm run assets:optimize` | Regenerate responsive WebP variants + `src/lib/image-manifest.json` (needs `cwebp`) |

`NEXT_PUBLIC_SITE_URL` feeds canonical URLs, Open Graph, `sitemap.xml` and `robots.txt`. Without it the build warns and falls back to `http://localhost:3000`.

## How it is put together

```
src/app/                     routes, metadata, sitemap/robots, 404, OG images, fonts
src/components/navigation/   SiteNav (fixed, mix-blend-mode: difference)
src/components/layout/       ContactSection + NameSignature (shared footer)
src/components/sections/     per-page sections (portfolio/, about/, profitz/)
src/components/behavior/     small client helpers: ScrollLink, HoverGroup
src/lib/runtime/             inline-script runtimes (reveals, hero corridor)
scripts/                     asset extraction and image optimisation
tests/e2e/                   routing, navigation, metadata, accessibility
```

- **Server Components by default.** Client code is limited to the hero scene, the Expertise list (hover preview, mobile tap-to-play), the `#work/<slug>` placeholder dialog, the portfolio scroll effects, and two small link/hover helpers. The app's own client JS is about 6 KB gzipped on the homepage; the rest is the React/Next runtime.
- **Inline runtimes.** Scroll reveals (`reveal-runtime.ts`) and the hero corridor (`corridor-runtime.ts`) run as inline scripts serialised with `Function.prototype.toString`, so above-the-fold motion starts during HTML parsing instead of after hydration (this is what keeps mobile LCP under 2.5 s). They must stay self-contained: no imports and no outer references.
- **Layout logic in CSS.** The exports switched layouts with `matchMedia` → React state; here those are media queries, so the server HTML is already correct at every width. Breakpoints: `760px` (mobile, or `hover: none` where the export did so), `1099/1100px`, `1199px`.
- **Hero.** The export embedded the hero as an iframe. It is inlined as a CSS size container, with `vw/vh` → `cqw/cqh` and media → container queries, so its geometry still follows the hero box.
- **Fonts.** Inter Tight is self-hosted from the exports (latin subset, variable weight) via `next/font/local`. It keeps the original `unicode-range` and has no metric-adjusted fallback, because ←, → and ↗ must fall back to the same system fonts as in the exports.
- **Images.** Originals are extracted byte-for-byte to `public/images/` (not referenced at runtime). `scripts/optimize-images.mjs` writes content-hashed WebP variants to `public/images/w/`, served through a custom `next/image` loader (`src/lib/image-loader.ts`) with long-lived immutable caching. There is no runtime image optimiser.

## Deliberate differences from the exports

1. **About hero, portrait tablets:** the export's intro width `calc(46vw - 36vh)` goes negative around 768×1024, so the paragraph collapses to one word per line over the bottom bar. A 180px floor is applied only where that formula drops below 180px.
2. **Accessibility without visual change:** a single `<h1>` per page; the hidden fixed nav is `inert`; the placeholder dialog gets `aria-modal`, focus and Escape handling. Project cards are named by their visible title and category (WCAG 2.5.3), and decorative numbers and arrows are hidden from assistive tech.
3. **Expertise preview videos** load when the section approaches the viewport rather than at page load.

## Known design-level issues (not changed)

- **Colour contrast below WCAG AA** in the supplied palette. These need a design decision; the axe tests exclude only `color-contrast`. Smallest passing adjustments (computed):

  | Pair | Ratio | Needed | Minimal fix |
  | --- | --- | --- | --- |
  | `#777777` labels on `#E8E8E8` | 3.65:1 | 4.5:1 | `#686868` (4.55:1) |
  | `#92938F` large italic accents on `#E8E8E8` | 2.52:1 | 3:1 | `#848581` (3.03:1) |
  | `#92938F` large italic accents on `#F0EEE9` | 2.67:1 | 3:1 | `#888985` (3.04:1) |
  | `#92938F` Profitz tagline (22px on mobile, below "large") | 2.67:1 | 4.5:1 | `#6B6C69` (4.56:1) |
  | `#76736E` labels on `#F0EEE9` | 4.07:1 | 4.5:1 | `#6F6C68` (4.50:1) |

  `#92938F` on the dark sections passes (6.1–6.4:1).
- **Placeholder content** from the design is reproduced as specified: the "Email Design" card ("Insert WebP mockup"), the empty "UI/UX Design" / "Email Design" Expertise previews, and the `#work/<slug>` "Placeholder route" dialog for unbuilt case studies. These should be replaced before launch.

## Dependencies and licences

All runtime and dev dependencies are MIT, Apache-2.0 or ISC, except `axe-core` / `@axe-core/playwright` (MPL-2.0, dev-only, tests).

`next` installs `sharp` (Apache-2.0) as an optional dependency, and sharp bundles **libvips under LGPL-3.0-or-later**. This project does not use it at runtime (custom image loader), but the package is present in `node_modules` and the lockfile. Image variants are produced with `cwebp` (libwebp, BSD-3-Clause), a local tool that is not shipped.

ESLint stays on 9.x: `eslint-plugin-react`, `-import` and `-jsx-a11y` (pulled in by `eslint-config-next`) do not yet support ESLint 10.

## Security headers

`next.config.ts` sets CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` in production. The CSP needs `'unsafe-inline'` for scripts (Next's bootstrap and the inline runtimes). A nonce-based CSP would force dynamic rendering, so it was not used.
