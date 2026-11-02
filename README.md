# Tihana — Portfolio

Next.js rebuild of seven design exports (kept in the repo root, Email Design in `new-page/`, as the visual source of truth):

| Export | Route | Aliases (308) |
| --- | --- | --- |
| `Tihana Portfolio.html` | `/` | |
| `Tihana About.html` | `/about` | |
| `Art Provenance.html` | `/work/artprovenance` | `/projects/art-provenance`, `/projects/artprovenance`, `/work/art-provenance` |
| `Profitz Case Study.html` | `/work/profitz` | `/projects/profits`, `/projects/profitz` |
| `No Days Wasted.html` | `/work/no-days-wasted` | `/projects/no-days-wasted` |
| `Sekundarac.html` | `/work/sekundarac` | `/projects/sekundarac` |
| `new-page/Email Design.html` | `/work/email-design` | `/projects/email-design` |

Case-study URLs follow the export's own scheme, `/work/<slug>` with the portfolio card's slug. All five cards have a page; the exports' in-page placeholder hashes (`#work/<slug>`) redirect to it. Each case study's "Next project" link leads to the next one: Art Provenance → Profitz → No Days Wasted → Sekundarac → Email Design, whose "Previous project" link goes back to Sekundarac.

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
| `npm run assets:extract` | Re-extract images, videos and fonts from the HTML exports (deduplicated by SHA-256) |
| `npm run assets:optimize` | Regenerate responsive WebP variants + `src/lib/image-manifest.json` (needs `cwebp`) |

`NEXT_PUBLIC_SITE_URL` feeds canonical URLs, Open Graph, `sitemap.xml` and `robots.txt`. Without it the build warns and falls back to `http://localhost:3000`.

## How it is put together

```
src/app/                     routes, metadata, sitemap/robots, 404, OG images, fonts
src/components/navigation/   SiteNav (fixed, mix-blend-mode: difference)
src/components/layout/       ContactSection + NameSignature (shared footer)
src/components/sections/     case-study/ (template shared by the five case studies) and per-page sections
                             (portfolio/, about/, artprovenance/, profitz/, sekundarac/, email-design/)
src/components/behavior/     small client helpers: ScrollLink, HoverGroup, AutoplayVideo
src/lib/runtime/             inline-script runtimes (reveals, hero corridor)
scripts/                     asset extraction and image optimisation
tests/e2e/                   routing, navigation, metadata, accessibility
visual-comparison/           screenshots and diffs against the exports (git-ignored, see its README)
```

- **Server Components by default.** Client code is limited to the hero scene, the Expertise list (hover preview, mobile tap-to-play), the `#work/<slug>` route handler (redirects to the case study; its placeholder dialog only shows for a card without a page), the portfolio scroll effects, two small link/hover helpers, the case-study video player (`AutoplayVideo`, under 1 KB, loaded only by No Days Wasted, Sekundarac and Email Design) and the Email Design viewer (`EmailLightbox`, about 3 KB gzipped, loaded only there). The app's own client JS is about 6 KB gzipped on the homepage; the rest is the React/Next runtime.
- **Case-study template.** The five case studies share one section system (`case-study/`: hero, overview, dark key features, heading-with-aside, next/previous project) and one stylesheet; each page passes its content as props and adds only its own sections (Profitz's system/brand/outcome, Art Provenance's landing page, Sekundarac's concept and applications, Email Design's selected-emails gallery and viewer). No shared class is overridden from another module, so CSS order across modules never matters.
- **Inline runtimes.** Scroll reveals (`reveal-runtime.ts`) and the hero corridor (`corridor-runtime.ts`) run as inline scripts serialised with `Function.prototype.toString`, so above-the-fold motion starts during HTML parsing instead of after hydration (this is what keeps mobile LCP under 2.5 s). They must stay self-contained: no imports and no outer references.
- **Layout logic in CSS.** The exports switched layouts with `matchMedia` → React state; here those are media queries, so the server HTML is already correct at every width. Breakpoints: `760px` (mobile, or `hover: none` where the export did so), `1099/1100px`, `1199px`.
- **Hero.** The export embedded the hero as an iframe. It is inlined as a CSS size container, with `vw/vh` → `cqw/cqh` and media → container queries, so its geometry still follows the hero box.
- **Fonts.** Inter Tight is self-hosted from the exports (latin subset, variable weight) via `next/font/local`. It keeps the original `unicode-range` and has no metric-adjusted fallback, because ←, → and ↗ must fall back to the same system fonts as in the exports.
- **Images.** Originals are extracted byte-for-byte to `public/images/` (not referenced at runtime). `scripts/optimize-images.mjs` writes content-hashed WebP variants (from PNG, WebP or JPEG) to `public/images/w/`, served through a custom `next/image` loader (`src/lib/image-loader.ts`) with long-lived immutable caching. There is no runtime image optimiser. Sources tagged with a non-sRGB colour profile (display-profile screenshots, Adobe RGB) keep it in their variants, so they are colour-managed like the originals; cwebp would otherwise drop it and shift the colours (the Sekundarac green rendered `#0D5A30` instead of `#146533`). Tall images shown from the top in a fixed-aspect box (the Email Design gallery) also get variants of just that top crop (`<name>.top.webp` in the manifest, `topCrop()` in `src/lib/images.ts`), so a thumbnail doesn't download a whole 10 000 px email. The Email Design portfolio card (`new-page/pocetna_email.webp`) was supplied as a file and is copied as is.
- **Videos.** Self-hosted MP4s, byte-for-byte from the exports, played muted and looped by `AutoplayVideo`.

## Deliberate differences from the exports

1. **About hero, portrait tablets:** the export's intro width `calc(46vw - 36vh)` goes negative around 768×1024, so the paragraph collapses to one word per line over the bottom bar. A 180px floor is applied only where that formula drops below 180px.
2. **Accessibility without visual change:** a single `<h1>` per page; the hidden fixed nav is `inert`; the placeholder dialog gets `aria-modal`, focus and Escape handling. Project cards are named by their visible title and category (WCAG 2.5.3), and decorative numbers and arrows are hidden from assistive tech.
3. **Expertise preview videos** load when the section approaches the viewport rather than at page load.
4. **Case-study videos** (No Days Wasted's animated hero, Sekundarac's logo animation) play while on or near the screen and pause once scrolled away; the No Days Wasted one is only fetched when it approaches the viewport. With `prefers-reduced-motion` they don't play: Sekundarac shows the completed logo (8.4 s), No Days Wasted its first frame.
5. **Case-study next-project names** are `<h2>` headings (a `<span>` with the same styling in the exports), for a usable heading outline.
6. **Email Design viewer:** the export's scroll lock never takes effect (its design-tool runtime throws in `componentDidUpdate`); here the page doesn't scroll behind the open viewer, as the code intends. It also gets the modal basics the export lacks: focus moves into it (onto the email, so the keyboard scrolls it), Tab stays inside, and focus returns to the card on close. Section 03's label is its `<h2>` and the brand names are `<h3>`s; gallery thumbnails come from the top crops above, which show exactly the area `object-position: top` shows.
7. **Sekundarac's next project** follows the supplied mockup (`new-page/sekundarac-next-project.png`): its cover is the Email Design hero (the mockup's cover, full resolution), titled "Email Design", "Email Design · E-commerce · Lifecycle". The label row keeps the site-wide order, "Back to work" left.
8. **Minifier-proof calc:** the aside paragraph's `calc(clamp(40px, 6.4vw, 104px) * .15 - 5px)` margin is written pre-multiplied (`clamp(6px, .96vw, 15.6px) - 5px`). The CSS minifier rewrote `* .15` as `/ 6.66667`, which came out 1/64 px short and shifted later rules by a device pixel.

## Known design-level issues (not changed)

- **Colour contrast below WCAG AA** in the supplied palette. These need a design decision; the axe tests exclude only `color-contrast`. Smallest passing adjustments (computed):

  | Pair | Ratio | Needed | Minimal fix |
  | --- | --- | --- | --- |
  | `#777777` labels on `#E8E8E8` | 3.65:1 | 4.5:1 | `#686868` (4.55:1) |
  | `#92938F` large italic accents on `#E8E8E8` | 2.52:1 | 3:1 | `#848581` (3.03:1) |
  | `#92938F` large italic accents on `#F0EEE9` | 2.67:1 | 3:1 | `#888985` (3.04:1) |
  | `#92938F` case-study taglines on `#F0EEE9` (22px on mobile, below "large") | 2.67:1 | 4.5:1 | `#6B6C69` (4.56:1) |
  | `#92938F` case-study taglines on `#E8E8E8` (No Days Wasted, Sekundarac) | 2.52:1 | 4.5:1 | `#686966` (4.51:1) |
  | `#76736E` labels on `#F0EEE9` | 4.07:1 | 4.5:1 | `#6F6C68` (4.50:1) |
  | `#76736E` labels on `#E8E8E8` (No Days Wasted, Sekundarac) | 3.85:1 | 4.5:1 | `#6B6864` (4.52:1) |

  `#92938F` on the dark sections passes (6.1–6.4:1). axe also flags the fixed nav on light pages; that is a false positive, since it cannot evaluate the nav's `mix-blend-mode: difference`, which renders it near-black there.
- **Placeholder content** from the design is reproduced as specified: the empty "UI/UX Design" / "Email Design" Expertise previews. These should be replaced before launch.
- **Autoplaying looped video without a pause control** (No Days Wasted feature, Sekundarac hero, Email Design's previous-project cover), as designed. WCAG 2.2.2 asks for a pause mechanism for motion over 5 s; adding one is a visible change, so it is left to a design decision. Reduced-motion users get a still frame.
- **Mobile Lighthouse LCP (~3.0–3.3 s simulated)** on all five case studies: the LCP element is the hero intro paragraph, and Chrome records it only once its 1.1 s reveal fade has finished. Measured with real throttling (4× CPU, 150 ms RTT, 1.6 Mbps) LCP is ~0.7 s. Starting the fade at a non-zero opacity would remove the delay without a visible change, but it changes the global reveal CSS on every page, so it is left as a decision.

## Dependencies and licences

All runtime and dev dependencies are MIT, Apache-2.0 or ISC, except `axe-core` / `@axe-core/playwright` (MPL-2.0, dev-only, tests).

`next` installs `sharp` (Apache-2.0) as an optional dependency, and sharp bundles **libvips under LGPL-3.0-or-later**. This project does not use it at runtime (custom image loader), but the package is present in `node_modules` and the lockfile. Image variants are produced with `cwebp` (libwebp, BSD-3-Clause), a local tool that is not shipped.

ESLint stays on 9.x: `eslint-plugin-react`, `-import` and `-jsx-a11y` (pulled in by `eslint-config-next`) do not yet support ESLint 10.

## Security headers

`next.config.ts` sets CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` in production. The CSP needs `'unsafe-inline'` for scripts (Next's bootstrap and the inline runtimes). A nonce-based CSP would force dynamic rendering, so it was not used.
