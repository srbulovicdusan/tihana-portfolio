import { expect, test } from '@playwright/test';

test.describe('portfolio navigation', () => {
  test('hero links reach About and the case study, and back/forward work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About ↗' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator('h1')).toContainText('about');

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);

    await page.getByRole('link', { name: /^Profitz Product Design/ }).click();
    await expect(page).toHaveURL(/\/work\/profitz$/);
    await expect(page.locator('h1')).toHaveText('Profitz');

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/work\/profitz$/);
  });

  test('cards with a case study open its page, and back returns to the portfolio', async ({ page }) => {
    const cases = [
      ['ArtProvenance', '/work/artprovenance', 'Art Provenance'],
      ['No Days Wasted', '/work/no-days-wasted', 'No Days Wasted'],
      ['Sekundarac', '/work/sekundarac', 'Sekundarac'],
    ] as const;
    await page.goto('/');
    for (const [card, path, h1] of cases) {
      await page.getByRole('link', { name: new RegExp(`^${card} `) }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.locator('h1')).toHaveText(h1);
      await page.goBack();
      await expect(page).toHaveURL(/\/$/);
    }
    await page.goForward();
    await expect(page).toHaveURL(/\/work\/sekundarac$/);
  });

  test('the card without a case study opens the placeholder route', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^Email Design / }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading')).toHaveText('Email Design');
    await expect(dialog).toContainText('Case study 05 / 05');
    await dialog.getByRole('link', { name: '← Back to work' }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/#work$/);
  });

  test('placeholder hashes of built case studies redirect to their pages', async ({ page }) => {
    for (const slug of ['artprovenance', 'no-days-wasted', 'sekundarac']) {
      await page.goto(`/#work/${slug}`);
      await expect(page).toHaveURL(new RegExp(`/work/${slug}$`));
    }
  });

  test('Escape closes the placeholder dialog', async ({ page }) => {
    await page.goto('/#work/email-design');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('the in-page links point at their sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Explore selected projects/ })).toHaveAttribute('href', '#work');
    await expect(page.getByRole('link', { name: /Start a project/ })).toHaveAttribute('href', '#contact');
    await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  });
});

test.describe('site navigation from inner pages', () => {
  test('About → Work lands on the Selected Work section', async ({ page }) => {
    await page.goto('/about');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work' }).click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator('#work')).toBeInViewport();
  });

  test('case study links: back to work, about, logo, next project', async ({ page }) => {
    await page.goto('/work/profitz');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');

    await page.getByRole('link', { name: /No Days Wasted/ }).click();
    await expect(page).toHaveURL(/\/work\/no-days-wasted$/);
    await expect(page.locator('h1')).toHaveText('No Days Wasted');

    await page.goto('/work/profitz');
    await page.getByRole('link', { name: /Back to work/ }).first().click();
    await expect(page).toHaveURL(/\/#work$/);

    await page.goto('/work/profitz');
    await nav.getByRole('link', { name: 'About ↗' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About ↗' })).toHaveAttribute('aria-current', 'page');

    await nav.getByRole('link', { name: /Tihana/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('next-project links chain through the case studies', async ({ page }) => {
    await page.goto('/work/artprovenance');
    const chain = [
      ['Profitz', '/work/profitz'],
      ['No Days Wasted', '/work/no-days-wasted'],
      ['Sekundarac', '/work/sekundarac'],
    ] as const;
    for (const [name, path] of chain) {
      await page.locator('#next').getByRole('link', { name: new RegExp(name) }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.locator('h1')).toHaveText(name);
    }
    // The email case study has no page yet: its placeholder route
    await page.locator('#next').getByRole('link', { name: /Email Design/ }).click();
    await expect(page).toHaveURL(/\/#work\/email-design$/);
    await expect(page.getByRole('dialog')).toContainText('Email Design');
  });

  for (const path of ['/work/artprovenance', '/work/no-days-wasted', '/work/sekundarac']) {
    test(`${path}: back to work and primary navigation`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
      await page.getByRole('link', { name: /Back to work/ }).first().click();
      await expect(page).toHaveURL(/\/#work$/);
      await expect(page.locator('#work')).toBeInViewport();
    });
  }

  test('back to top returns to the top without changing the URL', async ({ page }) => {
    await page.goto('/about');
    await page.getByRole('link', { name: 'Back to top ↑' }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page).toHaveURL(/\/about$/);
  });
});

test.describe('scroll behaviour', () => {
  test.skip(({ isMobile }) => isMobile, 'pointer-driven');

  test('fixed nav appears after scrolling past the hero', async ({ page }) => {
    await page.goto('/');
    const sticky = page.getByRole('navigation', { name: 'Sticky', includeHidden: true });
    await expect(sticky).toHaveAttribute('inert', '');
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await expect(sticky).toHaveAttribute('data-visible', '');
    await expect(sticky).not.toHaveAttribute('inert', '');
  });

  test('expertise rows show the hover preview', async ({ page }) => {
    await page.goto('/');
    const row = page.locator('#expertise a', { hasText: 'Brand Identity' });
    await row.scrollIntoViewIfNeeded();
    await row.hover();
    await expect(page.locator('#expertise').getByText('Logo Animation')).toBeVisible();
  });
});

test.describe('touch', () => {
  test.skip(({ isMobile }) => !isMobile, 'touch layout only');

  test('tapping an expertise row with a video opens it inline', async ({ page }) => {
    await page.goto('/');
    const row = page.locator('#expertise a', { hasText: 'Web Design' });
    await row.scrollIntoViewIfNeeded();
    await row.tap();
    await expect(page.locator('#expertise video')).toBeVisible();
    await row.tap();
    await expect(page.locator('#expertise video')).toHaveCount(0);
  });
});
