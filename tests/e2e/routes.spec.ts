import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', title: 'Tihana — Portfolio', h1: /I design brands and everything they touch/ },
  { path: '/about', title: 'About — Tihana', h1: /A little\s*A?\s*more\s*about\s*me\./ },
  { path: '/work/artprovenance', title: 'Art Provenance — Case study — Tihana', h1: /^Art Provenance$/ },
  { path: '/work/profitz', title: 'Profitz — Case study — Tihana', h1: /^Profitz$/ },
  { path: '/work/no-days-wasted', title: 'No Days Wasted — Case study — Tihana', h1: /^No Days Wasted$/ },
  { path: '/work/sekundarac', title: 'Sekundarac — Case study — Tihana', h1: /^Sekundarac$/ },
];

for (const p of PAGES) {
  test(`${p.path} renders with metadata and structured data`, async ({ page }) => {
    const res = await page.goto(p.path);
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle(p.title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(p.h1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    const head = page.locator('head');
    await expect(head.locator('meta[name="description"]')).toHaveAttribute('content', /.{60,}/);
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${p.path === '/' ? '/?' : p.path}$`));
    await expect(head.locator('meta[property="og:title"]')).toHaveAttribute('content', /Tihana|Profitz/);
    await expect(head.locator('meta[property="og:image"]')).toHaveAttribute('content', /opengraph-image/);
    await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');

    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    expect(() => JSON.parse(ld ?? '')).not.toThrow();
  });
}

test('unknown routes return 404', async ({ page }) => {
  const res = await page.goto('/does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText(/Page not\s*found\./);
});

test('preferred alias URLs redirect to the case studies', async ({ request }) => {
  const aliases = [
    ['/projects/profits', '/work/profitz'],
    ['/projects/profitz', '/work/profitz'],
    ['/projects/art-provenance', '/work/artprovenance'],
    ['/projects/artprovenance', '/work/artprovenance'],
    ['/work/art-provenance', '/work/artprovenance'],
    ['/projects/no-days-wasted', '/work/no-days-wasted'],
    ['/projects/sekundarac', '/work/sekundarac'],
  ] as const;
  for (const [alias, target] of aliases) {
    const res = await request.get(alias, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers().location).toBe(target);
  }
});

test('sitemap and robots list the pages', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const p of PAGES) expect(sitemap).toContain(`${p.path}</loc>`);
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toMatch(/Allow: \//);
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
});

test('pages are served prerendered', async ({ request }) => {
  for (const p of PAGES) {
    const res = await request.get(p.path);
    expect(res.headers()['x-nextjs-prerender']).toBeTruthy();
    expect(res.headers()['cache-control']).toMatch(/s-maxage=/);
  }
});
