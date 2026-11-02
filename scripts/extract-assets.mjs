// Extracts the assets embedded in the original HTML design exports.
//
// The exports are self-unpacking bundles: a JSON manifest of gzip+base64 assets
// keyed by UUID, plus an HTML template that references those UUIDs. The
// Portfolio hero is itself a nested bundle stored as a text/html asset.
//
// Images and videos are written byte-for-byte (no recompression) to public/,
// fonts used by the design to src/app/fonts/. Each unique asset (by SHA-256)
// is written once.
//
// Usage: node scripts/extract-assets.mjs
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const EXPORTS = [
  'Tihana Portfolio.html',
  'Tihana About.html',
  'Profitz Case Study.html',
  'Art Provenance.html',
  'No Days Wasted.html',
  'Sekundarac.html',
  'new-page/Email Design.html',
];

// Images supplied as files rather than inside an export, copied byte-for-byte.
const SUPPLIED = {
  'new-page/pocetna_email.webp': 'public/images/email-design-card.webp', // portfolio card
};

// SHA-256 prefix → output path. Names follow the asset's role in the design
// (ext_resources ids, alt text and source comments in the exports).
const NAMES = {
  // Portfolio — Selected Work & Expertise
  '4c68485dcca2': 'public/images/artprovenance-landing.webp',
  '82a0f048e696': 'public/images/profitz-mobile.webp',
  'bf1ef6888bbe': 'public/images/no-days-wasted-laptop.webp',
  '6279dfb84b9b': 'public/images/sekundarac-logo-green.png',
  '7caab48c3e33': 'public/images/sekundarac-logo-white.png',
  'ec6a629aaff8': 'public/videos/artprovenance-preview.mp4',
  'e8c4e616ce9c': 'public/videos/sekundarac-logo-animation.mp4',
  // Portfolio — hero corridor (g-<n><side> in the hero source)
  'dd8cf64c2edc': 'public/images/hero/jewelry-market-packaging.webp', // g6L
  '2a5857dc5ed8': 'public/images/hero/predator.webp', // g5L
  '751b96bfd98f': 'public/images/hero/no-days-wasted.webp', // g4L
  '0bd61c62d8ee': 'public/images/hero/winchester.webp', // g3L
  '1d237aec0c40': 'public/images/hero/profitz.webp', // g2L
  'faada810e0c8': 'public/images/hero/artprovenance.webp', // g1L
  '8502001b8590': 'public/images/hero/mobile-analytics.webp', // g6R
  '55b2eccd6697': 'public/images/hero/miltop-invest.webp', // g5R
  '02478ec97903': 'public/images/hero/classic-car-register.webp', // g4R
  'befc17361f66': 'public/images/hero/sekundarac.webp', // g3R
  '1d12c83f1c49': 'public/images/hero/jewelry-market-editorial.webp', // g2R
  'f34864793cfd': 'public/images/hero/just-quit.webp', // g1R
  // About
  'd4a910710340': 'public/images/tihana-portrait.png',
  // Profitz case study
  '8b9fa8c9f7a4': 'public/images/profitz-dashboard.webp',
  '013fa94bde9d': 'public/images/profitz-pnl.png',
  'c0aca5c3ae48': 'public/images/profitz-mapping.png',
  'c0c7078975ab': 'public/images/profitz-watchlist.png',
  '23613f083b3f': 'public/images/profitz-mobile-screens.webp',
  '8aefeb619f09': 'public/images/profitz-logo.png',
  '3da465c58c1e': 'public/images/profitz-landing-laptop.png',
  // Art Provenance case study (next project reuses profitz-mobile.webp)
  '12bb18df6303': 'public/images/artprovenance-hero-laptop.webp',
  '0073b3f77d6e': 'public/images/artprovenance-search.png', // apSearch
  '5d60214b0094': 'public/images/artprovenance-chat.png', // apChat
  'd4d75bf9dbb3': 'public/images/artprovenance-results.png', // apResults
  '88fe7baf6ab1': 'public/images/artprovenance-record.png', // apRecord
  '9c178f6cfa51': 'public/images/artprovenance-landing-laptop.webp',
  // No Days Wasted case study (next project reuses the Sekundarac logo pair)
  '009ffc789e7a': 'public/images/no-days-wasted-desktop.webp',
  '688f175327de': 'public/images/no-days-wasted-pdp.png', // ndwPdp
  'e2f622e3607f': 'public/images/no-days-wasted-products.png', // ndwProducts
  '9426769d74c8': 'public/videos/no-days-wasted-hero-loop.mp4', // ndwLoop
  // Sekundarac case study
  'd42d5e9fdfed': 'public/videos/sekundarac-logo-animation-wide.mp4',
  '7c0836b00e20': 'public/images/sekundarac-logo-on-white.png',
  'bcde6ac6432d': 'public/images/sekundarac-logo-on-green.png',
  'a98614e2e500': 'public/images/sekundarac-business-cards.jpg',
  '1e829e855cd7': 'public/images/sekundarac-keychains.jpg',
  '8c9a985cf876': 'public/images/sekundarac-pens.jpg',
  '46bafe294e4d': 'public/images/sekundarac-lighters.jpg',
  // Email Design case study (previous project reuses the wide Sekundarac logo animation)
  '5268e4fe0d2b': 'public/images/email-design-hero.webp', // also Sekundarac's next-project cover
  '0c0c918eb172': 'public/images/email-design/betterbone.webp', // em0
  '4643cac4ef6e': 'public/images/email-design/the-ace-vip.webp', // em1
  '82e8b5ebec80': 'public/images/email-design/pawse.webp', // em2
  '55d3eb3eeea3': 'public/images/email-design/highland-soap.webp', // em3
  '8dcd00dbe5e2': 'public/images/email-design/chowmore.webp', // em4
  '876c5e4c9282': 'public/images/email-design/alloura.webp', // em5
  '9654eab62b01': 'public/images/email-design/panda-drum.webp', // em6
  '99ef4cc81ad5': 'public/images/email-design/gantri.webp', // em7
  // Inter Tight (Google Fonts "latin" subset — the only subset the content uses)
  '83d548cd73ef': 'src/app/fonts/inter-tight-latin.woff2',
  '062ebe734093': 'src/app/fonts/inter-tight-latin-italic.woff2',
};

function island(src, kind) {
  const open = `<script type="__bundler/${kind}">`;
  const start = src.indexOf(open);
  if (start < 0) return null;
  const end = src.indexOf('</script>', start + open.length);
  return src.slice(start + open.length, end);
}

function* decodeBundle(html, origin) {
  const manifest = JSON.parse(island(html, 'manifest'));
  for (const [uuid, entry] of Object.entries(manifest)) {
    let bytes = Buffer.from(entry.data, 'base64');
    if (entry.compressed) bytes = gunzipSync(bytes);
    if (entry.mime === 'text/html' && bytes.includes('__bundler/manifest')) {
      yield* decodeBundle(bytes.toString('utf8'), `${origin} › nested ${uuid.slice(0, 8)}`);
      continue;
    }
    yield { uuid, mime: entry.mime, bytes, origin };
  }
}

const seen = new Map();
const skipped = [];
for (const file of EXPORTS) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  for (const asset of decodeBundle(html, file)) {
    const sha = createHash('sha256').update(asset.bytes).digest('hex');
    if (seen.has(sha)) continue;
    seen.set(sha, asset);
    const out = NAMES[sha.slice(0, 12)];
    if (!out) {
      skipped.push(`${asset.mime.padEnd(16)} ${String(asset.bytes.length).padStart(8)} ${sha.slice(0, 12)} (${asset.origin})`);
      continue;
    }
    fs.mkdirSync(path.join(root, path.dirname(out)), { recursive: true });
    fs.writeFileSync(path.join(root, out), asset.bytes);
    console.log(`${out}  ${asset.bytes.length} B  sha256:${sha.slice(0, 12)}`);
  }
}

for (const [from, out] of Object.entries(SUPPLIED)) {
  fs.copyFileSync(path.join(root, from), path.join(root, out));
  console.log(`${out}  copied from ${from}`);
}

const written = new Set([...seen.keys()].map(s => s.slice(0, 12)));
const missing = Object.entries(NAMES).filter(([k]) => !written.has(k));
if (missing.length) {
  console.error('Expected assets not found in exports:', missing.map(([, v]) => v));
  process.exitCode = 1;
}
console.log(`\n${seen.size} unique assets, ${seen.size - skipped.length} written.`);
console.log('Not extracted (runtime scripts and font subsets the content never uses):');
for (const s of skipped) console.log('  ' + s);
