// Generates responsive WebP variants of every image in public/images and the
// manifest consumed by the next/image custom loader (src/lib/image-loader.ts).
//
// Variants are content-hashed (safe to cache immutably) and encoded with
// cwebp (libwebp, BSD-3-Clause). WebP originals at native width are copied
// byte-for-byte. Requires `cwebp` on PATH (macOS: `brew install webp`).
//
// cwebp drops colour profiles by default. Sources tagged with a non-sRGB
// profile (display screenshots, Adobe RGB) keep it, so browsers colour-manage
// the variants exactly as they do the original.
//
// Usage: node scripts/optimize-images.mjs
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { inflateSync } from 'node:zlib';

const run = promisify(execFile);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srcDir = path.join(root, 'public/images');
const outDir = path.join(srcDir, 'w');
const manifestPath = path.join(root, 'src/lib/image-manifest.json');

// Keep in sync with images.deviceSizes / images.imageSizes in next.config.ts
export const WIDTHS = [384, 640, 828, 1080, 1280, 1600, 1920, 2560];

// Flat-colour logos stay lossless; UI screenshots and emails keep text crisp at
// q90, and so do JPEG photos, which are already lossy (q85 would compound artefacts).
const UI_SCREENS = /^(profitz-|artprovenance-(search|chat|results|record)$|no-days-wasted-(pdp|products)$)/;
function encoderArgs(name, file) {
  if (/logo/.test(name)) return ['-lossless', '-exact', '-z', '9'];
  if (UI_SCREENS.test(name) || /\/email-design\//.test(file) || /\.jpe?g$/i.test(file)) return ['-q', '90', '-alpha_q', '100', '-sharp_yuv', '-m', '6'];
  return ['-q', '85', '-alpha_q', '100', '-sharp_yuv', '-m', '6'];
}

// Tall images shown from the top in a fixed-aspect box (object-fit: cover;
// object-position: 50% 0) also get variants of just that top part, so a
// thumbnail doesn't download the whole image. Folder → box aspect (width /
// height); the crop's manifest key is `<name>.top.webp`.
const TOP_CROPS = { 'email-design/': 3 / 4 };

// Size from the first JPEG start-of-frame marker (SOF0–SOF15, except DHT/JPG/DAC).
function jpegDimensions(buf) {
  for (let i = 2; i < buf.length - 9; ) {
    const marker = buf[i + 1];
    if (buf[i] !== 0xff || marker === 0xff) { i++; continue; } // not a marker, or a fill byte
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error('JPEG without SOF marker');
}

function dimensions(buf) {
  if (buf.subarray(1, 4).toString() === 'PNG') return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  if (buf[0] === 0xff && buf[1] === 0xd8) return jpegDimensions(buf);
  if (buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') {
    const chunk = buf.subarray(12, 16).toString();
    if (chunk === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
    if (chunk === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return [1 + (b & 0x3fff), 1 + ((b >> 14) & 0x3fff)];
    }
    if (chunk === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  }
  throw new Error('Unsupported image format');
}

// Embedded ICC profile, if any: PNG iCCP, WebP ICCP or JPEG APP2 chunks.
function iccProfile(buf) {
  if (buf.subarray(1, 4).toString() === 'PNG') {
    for (let i = 8; i < buf.length; ) {
      const len = buf.readUInt32BE(i);
      const type = buf.toString('latin1', i + 4, i + 8);
      if (type === 'IDAT') break;
      if (type === 'iCCP') {
        const data = buf.subarray(i + 8, i + 8 + len);
        return inflateSync(data.subarray(data.indexOf(0) + 2)); // name\0, compression method
      }
      i += 12 + len;
    }
  } else if (buf.toString('latin1', 0, 4) === 'RIFF') {
    for (let i = 12; i < buf.length; ) {
      const len = buf.readUInt32LE(i + 4);
      if (buf.toString('latin1', i, i + 4) === 'ICCP') return buf.subarray(i + 8, i + 8 + len);
      i += 8 + len + (len & 1);
    }
  } else if (buf[0] === 0xff && buf[1] === 0xd8) {
    const parts = [];
    for (let i = 2; i < buf.length - 4 && buf[i] === 0xff && buf[i + 1] !== 0xda; ) {
      const len = buf.readUInt16BE(i + 2);
      if (buf[i + 1] === 0xe2 && buf.toString('latin1', i + 4, i + 15) === 'ICC_PROFILE') parts.push(buf.subarray(i + 18, i + 2 + len));
      i += 2 + len;
    }
    if (parts.length) return Buffer.concat(parts);
  }
  return null;
}

// The profile's 'desc' tag: ICC v2 text, or the first record of a v4 'mluc'.
function iccDescription(icc) {
  for (let t = 0, n = icc.readUInt32BE(128); t < n; t++) {
    const entry = 132 + t * 12;
    if (icc.toString('latin1', entry, entry + 4) !== 'desc') continue;
    const at = icc.readUInt32BE(entry + 4);
    const type = icc.toString('latin1', at, at + 4);
    if (type === 'desc') return icc.toString('latin1', at + 12, at + 11 + icc.readUInt32BE(at + 8));
    if (type === 'mluc') {
      const len = icc.readUInt32BE(at + 20);
      const off = icc.readUInt32BE(at + 24);
      return Buffer.from(icc.subarray(at + off, at + off + len)).swap16().toString('utf16le');
    }
  }
  return '';
}

function keepsProfile(buf) {
  const icc = iccProfile(buf);
  return !!icc && !/sRGB/i.test(iccDescription(icc));
}

function listImages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return p === outDir ? [] : listImages(p);
    return /\.(png|webp|jpe?g)$/i.test(e.name) ? [p] : [];
  });
}

async function pool(items, size, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: size }, async () => {
    while (queue.length) await fn(queue.shift());
  }));
}

fs.rmSync(outDir, { recursive: true, force: true });
const manifest = {};
const jobs = [];
for (const file of listImages(srcDir)) {
  const buf = fs.readFileSync(file);
  const [width, height] = dimensions(buf);
  const rel = path.relative(srcDir, file);
  const name = path.basename(rel).replace(/\.\w+$/, '');
  const icc = keepsProfile(buf);
  const stem = rel.replace(/\.\w+$/, '');
  const entries = [{ key: `/images/${rel}`, stem, height, crop: null }];
  const aspect = Object.entries(TOP_CROPS).find(([dir]) => rel.startsWith(dir))?.[1];
  if (aspect && height > width / aspect) {
    const h = Math.round(width / aspect);
    entries.push({ key: `/images/${stem}.top.webp`, stem: `${stem}.top`, height: h, crop: ['-crop', '0', '0', String(width), String(h)] });
  }
  for (const e of entries) {
    // Variants with a kept profile differ from earlier profile-less ones, so the name must too.
    const hash = createHash('sha256').update(buf).update(icc ? 'icc' : '').update(e.crop ? e.crop.join(' ') : '').digest('hex').slice(0, 8);
    const base = `/images/w/${e.stem}.${hash}`;
    const widths = [...new Set([...WIDTHS.filter(w => w < width), Math.min(width, WIDTHS.at(-1))])];
    manifest[e.key] = { width, height: e.height, base, widths };
    for (const w of widths) {
      const out = path.join(root, 'public', `${base}-${w}.webp`);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      if (w === width && !e.crop && file.endsWith('.webp')) fs.copyFileSync(file, out);
      else jobs.push({ file, out, w, name, icc, crop: e.crop });
    }
  }
}

await pool(jobs, Math.max(2, os.cpus().length - 1), async ({ file, out, w, name, icc, crop }) => {
  const metadata = icc ? ['-metadata', 'icc'] : [];
  // cwebp crops before it resizes
  await run('cwebp', ['-quiet', ...encoderArgs(name, file), ...metadata, ...(crop || []), '-resize', String(w), '0', file, '-o', out]);
});

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + '\n');

let total = 0;
for (const [src, m] of Object.entries(sorted)) {
  const sizes = m.widths.map(w => {
    const bytes = fs.statSync(path.join(root, 'public', `${m.base}-${w}.webp`)).size;
    total += bytes;
    return `${w}:${Math.round(bytes / 1024)}K`;
  });
  const icc = jobs.some(j => j.icc && j.out.includes(m.base)) ? ' [colour profile kept]' : '';
  console.log(`${src} ${m.width}x${m.height} → ${sizes.join(' ')}${icc}`);
}
console.log(`\n${Object.keys(sorted).length} images, ${jobs.length} encoded variants, ${(total / 1048576).toFixed(1)} MiB total`);
