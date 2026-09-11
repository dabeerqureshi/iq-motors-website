import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /mercedes-benz specialists/i })).toBeVisible();
  });

  test('navigates to Stock List page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Stock List');
    await expect(page.getByRole('heading', { name: /our stock/i })).toBeVisible();
  });

  test('navigates to Sold Cars page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Sold Cars');
    await expect(page.getByRole('heading', { name: /sold vehicles/i })).toBeVisible();
  });

  test('navigates to Happy Customers page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Happy Customers');
    await expect(page.getByRole('heading', { name: /happy customers/i })).toBeVisible();
  });

  test('navigates to Finance page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Finance');
    await expect(page.getByRole('heading', { name: /finance options/i })).toBeVisible();
  });

  test('navigates to Servicing page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Servicing');
    await expect(page.getByRole('heading', { name: /servicing/i })).toBeVisible();
  });

  test('navigates to About page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=About');
    await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
  });

  test('navigates to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Contact');
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
  });

  test('logo navigates to homepage', async ({ page }) => {
    await page.goto('/stock');
    await page.click('img[alt="iQ Motors Logo"]');
    await expect(page.getByRole('heading', { name: /mercedes-benz specialists/i })).toBeVisible();
  });

  test('shows 404 page for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();
  });
});
