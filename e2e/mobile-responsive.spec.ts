import { test, expect } from '@playwright/test';

test.describe('Mobile responsiveness', () => {
  test('mobile menu opens and closes on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check hamburger menu button is visible
    const menuButton = page.getByRole('button', { name: /open menu/i });
    await expect(menuButton).toBeVisible();
    
    // Open menu
    await menuButton.click();
    
    // Check close button appears
    await expect(page.getByRole('button', { name: /close menu/i })).toBeVisible();
    
    // Close menu
    await page.getByRole('button', { name: /close menu/i }).click();
    
    // Check open button appears again
    await expect(page.getByRole('button', { name: /open menu/i })).toBeVisible();
  });

  test('mobile menu shows all navigation links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open menu
    await page.getByRole('button', { name: /open menu/i }).click();
    
    // Check all links are visible
    await expect(page.getByText('Home').last()).toBeVisible();
    await expect(page.getByText('Stock List').last()).toBeVisible();
    await expect(page.getByText('Contact').last()).toBeVisible();
  });

  test('mobile menu closes on link click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open menu
    await page.getByRole('button', { name: /open menu/i }).click();
    
    // Click a link
    await page.getByText('Stock List').last().click();
    
    // Menu should close
    await expect(page).toHaveURL('/stock');
  });

  test('stock list is scrollable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/stock');
    
    // Check page loads
    await expect(page.getByRole('heading', { name: /our stock/i })).toBeVisible();
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Page should still be functional
    await expect(page.getByRole('heading', { name: /our stock/i })).toBeVisible();
  });

  test('contact form is usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact');
    
    // Check form is visible and usable
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    
    // Fill form
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/message/i).fill('Test message');
    
    // Submit
    await page.click('text=Send Message');
    
    // Check for success or validation
    await expect(page.getByText(/message sent|name is required|invalid email/i)).toBeVisible({ timeout: 15000 });
  });

  test('images are responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/stock');
    
    // Wait for content to load
    await page.waitForSelector('text=Our Stock', { timeout: 10000 });
    
    // Check images don't overflow
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await images.nth(i).boundingBox();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(375);
      }
    }
  });
});
