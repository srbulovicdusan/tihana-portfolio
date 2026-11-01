// Generates responsive WebP variants of every image in public/images and the
// manifest consumed by the next/image custom loader (src/lib/image-loader.ts).
//
// Variants are content-hashed (safe to cache immutably) and encoded with
// cwebp (libwebp, BSD-3-Clause). WebP originals at native width are copied
// byte-for-byte. Requires `cwebp` on PATH (macOS: `brew install webp`).
//
// Usage: node scripts/optimize-images.mjs
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srcDir = path.join(root, 'public/images');
const outDir = path.join(srcDir, 'w');
const manifestPath = path.join(root, 'src/lib/image-manifest.json');

// Keep in sync with images.deviceSizes / images.imageSizes in next.config.ts
export const WIDTHS = [384, 640, 828, 1080, 1280, 1600, 1920, 2560];

// Flat-colour logos stay lossless; UI screenshots keep text crisp at q90, and
// so do JPEG photos, which are already lossy (q85 would compound artefacts).
const UI_SCREENS = /^(profitz-|artprovenance-(search|chat|results|record)$|no-days-wasted-(pdp|products)$)/;
function encoderArgs(name, file) {
  if (/logo/.test(name)) return ['-lossless', '-exact', '-z', '9'];
  if (UI_SCREENS.test(name) || /\.jpe?g$/i.test(file)) return ['-q', '90', '-alpha_q', '100', '-sharp_yuv', '-m', '6'];
  return ['-q', '85', '-alpha_q', '100', '-sharp_yuv', '-m', '6'];
}

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
  const hash = createHash('sha256').update(buf).digest('hex').slice(0, 8);
  const base = `/images/w/${rel.replace(/\.\w+$/, '')}.${hash}`;
  const widths = [...new Set([...WIDTHS.filter(w => w < width), Math.min(width, WIDTHS.at(-1))])];
  manifest[`/images/${rel}`] = { width, height, base, widths };
  for (const w of widths) {
    const out = path.join(root, 'public', `${base}-${w}.webp`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    if (w === width && file.endsWith('.webp')) fs.copyFileSync(file, out);
    else jobs.push({ file, out, w, name });
  }
}

await pool(jobs, Math.max(2, os.cpus().length - 1), async ({ file, out, w, name }) => {
  await run('cwebp', ['-quiet', ...encoderArgs(name, file), '-resize', String(w), '0', file, '-o', out]);
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
  console.log(`${src} ${m.width}x${m.height} → ${sizes.join(' ')}`);
}
console.log(`\n${Object.keys(sorted).length} images, ${jobs.length} encoded variants, ${(total / 1048576).toFixed(1)} MiB total`);
