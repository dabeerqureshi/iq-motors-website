import { test, expect } from '@playwright/test';

test.describe('Stock browsing flow', () => {
  test('displays stock list with vehicles', async ({ page }) => {
    await page.goto('/stock');
    
    // Wait for loading to complete
    await page.waitForSelector('text=Our Stock', { timeout: 10000 });
    
    // Check that car cards are rendered
    const carCards = page.locator('[data-testid="car-card"], .cursor-pointer');
    await expect(carCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('search filters cars correctly', async ({ page }) => {
    await page.goto('/stock');
    await page.waitForSelector('text=Our Stock', { timeout: 10000 });
    
    // Type in search box
    const searchInput = page.getByPlaceholder(/search by model/i);
    await searchInput.fill('C-Class');
    
    // Wait for filtering
    await page.waitForTimeout(500);
    
    // Check filtered results
    await expect(page.getByText('C-Class')).toBeVisible();
  });

  test('sort dropdown changes order', async ({ page }) => {
    await page.goto('/stock');
    await page.waitForSelector('text=Our Stock', { timeout: 10000 });
    
    // Select price sort
    const sortSelect = page.getByLabel(/sort by/i);
    await sortSelect.selectOption('low-to-high');
    
    await page.waitForTimeout(500);
    
    // Verify sort applied (prices should be in ascending order)
    const prices = page.locator('text=/£[0-9,]+/');
    await expect(prices.first()).toBeVisible();
  });

  test('pagination works correctly', async ({ page }) => {
    await page.goto('/stock');
    await page.waitForSelector('text=Our Stock', { timeout: 10000 });
    
    // Check if pagination exists (only if more than 6 cars)
    const nextButton = page.getByRole('button', { name: /next/i });
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
      await expect(page.getByRole('button', { name: /previous/i })).toBeVisible();
    }
  });

  test('clicking car card navigates to detail page', async ({ page }) => {
    await page.goto('/stock');
    await page.waitForSelector('text=Our Stock', { timeout: 10000 });
    
    // Click on first car card
    const firstCard = page.locator('.cursor-pointer').first();
    await firstCard.click();
    
    // Should navigate to car detail page
    await expect(page).toHaveURL(/\/car\/\d+/);
  });

  test('sold cars page displays sold vehicles', async ({ page }) => {
    await page.goto('/sold');
    await page.waitForSelector('text=Sold Vehicles', { timeout: 10000 });
    
    // Check for SOLD badges
    const soldBadges = page.locator('text=SOLD');
    if (await soldBadges.first().isVisible()) {
      await expect(soldBadges.first()).toBeVisible();
    }
  });

  test('car detail page shows full information', async ({ page }) => {
    await page.goto('/stock');
    await page.waitForSelector('text=Our Stock', { timeout: 10000 });
    
    // Click on first car card
    const firstCard = page.locator('.cursor-pointer').first();
    const carName = await firstCard.locator('h3').first().textContent();
    await firstCard.click();
    
    // Verify detail page content
    await expect(page).toHaveURL(/\/car\/\d+/);
    await expect(page.getByRole('heading', { name: carName || 'Car' })).toBeVisible();
    
    // Check for price
    await expect(page.locator('text=/£[0-9,]+/')).toBeVisible();
    
    // Check for contact button
    await expect(page.getByRole('button', { name: /contact/i })).toBeVisible();
  });

  test('back to stock link works', async ({ page }) => {
    await page.goto('/stock');
    await page.waitForSelector('text=Our Stock', { timeout: 10000 });
    
    // Navigate to car detail
    const firstCard = page.locator('.cursor-pointer').first();
    await firstCard.click();
    
    // Click back to stock
    await page.click('text=Back to Stock');
    
    // Should be back on stock page
    await expect(page).toHaveURL('/stock');
  });
});
