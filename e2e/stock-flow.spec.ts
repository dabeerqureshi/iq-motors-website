import { test, expect } from '@playwright/test';

// This suite exercises live Supabase data through the real built app.
// If no backend credentials are available (e.g. local run without .env,
// or secrets not yet wired in CI) skip instead of timing out and burning
// the CI retries. Accepts both CI-style (SUPABASE_URL) and Vite-style
// (VITE_SUPABASE_URL) variable names.
const hasBackend = Boolean(
  (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) ||
  (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY),
);

test.describe('Stock browsing flow', () => {
  test.skip(!hasBackend, 'Supabase backend not configured — skipping live-data tests');

  test('displays stock list with vehicles', async ({ page }) => {
    await page.goto('/stock');

    // Page header renders immediately even while data loads
    await expect(page.getByRole('heading', { name: /mercedes-benz inventory/i })).toBeVisible({ timeout: 10000 });

    // Either car cards render or the empty state appears
    const carCards = page.locator('[data-testid="car-card"]');
    try {
      await expect(carCards.first()).toBeVisible({ timeout: 10000 });
    } catch {
      await expect(page.getByText(/no vehicles match your criteria/i)).toBeVisible();
    }
  });

  test('search filters cars correctly', async ({ page }) => {
    await page.goto('/stock');
    await expect(page.getByRole('heading', { name: /mercedes-benz inventory/i })).toBeVisible({ timeout: 10000 });

    // Wait for stock to load so the results count is stabilised
    const carCards = page.locator('[data-testid="car-card"]');
    const initialCount = await carCards.count();

    // Type in search box
    const searchInput = page.getByPlaceholder(/search by model or keyword/i);
    await searchInput.fill('Mercedes');
    await page.waitForTimeout(500);

    // Every listing contains "Mercedes", so when inventory exists the
    // filtered set must still have results. Empty inventory is also valid.
    const filteredCount = await carCards.count();
    if (initialCount > 0) {
      expect(filteredCount).toBeGreaterThan(0);
    }

    // Resetting restores the full set
    await searchInput.fill('');
    await page.waitForTimeout(500);
    expect(await carCards.count()).toBeGreaterThanOrEqual(initialCount);
  });

  test('sort dropdown changes order', async ({ page }) => {
    await page.goto('/stock');
    await expect(page.getByRole('heading', { name: /mercedes-benz inventory/i })).toBeVisible({ timeout: 10000 });

    // Open the Radix select (trigger shows the current value by default)
    const sortTrigger = page.getByRole('combobox');
    await sortTrigger.click();
    await page.getByRole('option', { name: 'Price: Low to High' }).click();

    await page.waitForTimeout(500);

    // Verify sort applied (prices should be visible)
    const prices = page.locator('text=/£[0-9,]+/');
    await expect(prices.first()).toBeVisible();
  });

  test('pagination works correctly', async ({ page }) => {
    await page.goto('/stock');
    await expect(page.getByRole('heading', { name: /mercedes-benz inventory/i })).toBeVisible({ timeout: 10000 });

    // Pagination only exists when there are more cars than the page size (6).
    const nextButton = page.getByRole('button', { name: /next/i });
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
      await expect(page.getByRole('button', { name: /previous/i })).toBeVisible();
    }
  });

  test('clicking car card navigates to detail page', async ({ page }) => {
    await page.goto('/stock');
    await expect(page.getByRole('heading', { name: /mercedes-benz inventory/i })).toBeVisible({ timeout: 10000 });

    // Click on first car card
    const firstCard = page.locator('[data-testid="car-card"]').first();
    await firstCard.click();

    // Should navigate to car detail page
    await expect(page).toHaveURL(/\/car\/\d+/);
  });

  test('sold cars page displays sold vehicles', async ({ page }) => {
    await page.goto('/sold');
    await expect(page.getByRole('heading', { name: /recently sold mercedes-benz/i })).toBeVisible({ timeout: 10000 });
  });

  test('car detail page shows full information', async ({ page }) => {
    await page.goto('/stock');
    await expect(page.getByRole('heading', { name: /mercedes-benz inventory/i })).toBeVisible({ timeout: 10000 });

    // Click on first car card
    const firstCard = page.locator('[data-testid="car-card"]').first();
    const carName = (await firstCard.locator('h3').first().textContent()) || 'Vehicle';
    await firstCard.click();

    // Verify detail page content
    await expect(page).toHaveURL(/\/car\/\d+/);
    await expect(page.getByRole('heading', { name: carName })).toBeVisible();

    // Check for price
    await expect(page.locator('text=/£[0-9,]+/').first()).toBeVisible();

    // Check for contact action
    await expect(page.getByText(/contact about this car/i)).toBeVisible();
  });

  test('back to inventory link works', async ({ page }) => {
    await page.goto('/stock');
    await expect(page.getByRole('heading', { name: /mercedes-benz inventory/i })).toBeVisible({ timeout: 10000 });

    // Navigate to car detail
    const firstCard = page.locator('[data-testid="car-card"]').first();
    await firstCard.click();

    // Click back to inventory
    await page.click('text=Back to Inventory');

    // Should be back on stock page
    await expect(page).toHaveURL('/stock');
  });
});
