import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Colour contrast is excluded from the gate: the failing pairs (#777 on #E8E8E8,
// #92938F accents, #76736E on #F0EEE9) are part of the supplied visual design.
// They are logged below and listed in README.md for a design decision.
const DESIGN_EXCEPTIONS = ['color-contrast'];

for (const path of ['/', '/about', '/work/profitz', '/#work/artprovenance']) {
  test(`axe: ${path}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    const blocking = results.violations.filter(v => !DESIGN_EXCEPTIONS.includes(v.id));
    const contrast = results.violations.find(v => v.id === 'color-contrast');
    if (contrast) testInfo.annotations.push({ type: 'design-contrast', description: `${contrast.nodes.length} nodes` });
    expect(blocking.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}

test('keyboard focus is visible and reaches the primary navigation', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard only');
  await page.goto('/about');
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toHaveText(/Tihana/);
  const outline = await focused.evaluate(el => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe('none');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveText('Work');
});

test('hidden sticky nav is not keyboard-reachable on the hero', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard only');
  await page.goto('/');
  await page.keyboard.press('Tab');
  // First stop is the hero's own navigation, not the invisible fixed nav
  await expect(page.locator(':focus')).toHaveText('Work');
  await expect(page.locator(':focus')).toHaveAttribute('href', '#work');
  expect(await page.locator(':focus').evaluate(el => !!el.closest('[inert]'))).toBe(false);
});

test('reduced motion shows all content without animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/profitz');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const hidden = await page.locator('[data-reveal]').evaluateAll(els => els.filter(e => getComputedStyle(e).opacity === '0').length);
  expect(hidden).toBe(0);
});
