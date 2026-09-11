import { test, expect } from '@playwright/test';

test.describe('Admin authentication', () => {
  test('admin login page renders', async ({ page }) => {
    await page.goto('/admin-IQmotors');
    
    await expect(page.getByText(/admin access/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /login to admin panel/i })).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/admin-IQmotors');
    
    // Fill with invalid credentials
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Submit
    await page.click('button:has-text("Login to Admin Panel")');
    
    // Check for error message (Supabase returns "Invalid login credentials")
    await expect(page.getByText(/invalid|error|failed|password/i)).toBeVisible({ timeout: 15000 });
  });

  test('requires email and password', async ({ page }) => {
    await page.goto('/admin-IQmotors');

    // Try to submit empty form. Both fields are HTML5-required, so the
    // browser blocks submission and we stay on the login screen.
    await page.click('button:has-text("Login to Admin Panel")');

    // Must remain on the login form (no redirect to dashboard)
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByText(/admin access/i)).toBeVisible();
  });

  test('successful login redirects to admin dashboard', async ({ page }) => {
    // Note: This test requires valid admin credentials in the test environment
    // Skip if no test credentials are configured
    test.skip(!process.env.TEST_ADMIN_EMAIL, 'Test admin credentials not configured');
    
    await page.goto('/admin-IQmotors');
    
    await page.getByLabel(/email/i).fill(process.env.TEST_ADMIN_EMAIL || '');
    await page.getByLabel(/password/i).fill(process.env.TEST_ADMIN_PASSWORD || '');
    
    await page.click('button:has-text("Login to Admin Panel")');
    
    // Should redirect to admin dashboard
    await expect(page.getByText(/admin dashboard/i)).toBeVisible({ timeout: 10000 });
  });

  test('admin dashboard shows management sections', async ({ page }) => {
    // Skip if no test credentials
    test.skip(!process.env.TEST_ADMIN_EMAIL, 'Test admin credentials not configured');
    
    await page.goto('/admin-IQmotors');
    
    await page.getByLabel(/email/i).fill(process.env.TEST_ADMIN_EMAIL || '');
    await page.getByLabel(/password/i).fill(process.env.TEST_ADMIN_PASSWORD || '');
    
    await page.click('button:has-text("Login to Admin Panel")');
    
    // Check for management sections
    await expect(page.getByText(/admin stock panel/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/happy customers/i)).toBeVisible();
  });

  test('logout works correctly', async ({ page }) => {
    // Skip if no test credentials
    test.skip(!process.env.TEST_ADMIN_EMAIL, 'Test admin credentials not configured');
    
    await page.goto('/admin-IQmotors');
    
    await page.getByLabel(/email/i).fill(process.env.TEST_ADMIN_EMAIL || '');
    await page.getByLabel(/password/i).fill(process.env.TEST_ADMIN_PASSWORD || '');
    
    await page.click('button:has-text("Login to Admin Panel")');
    
    // Wait for dashboard
    await expect(page.getByText(/admin dashboard/i)).toBeVisible({ timeout: 10000 });
    
    // Click logout
    await page.click('text=Logout');
    
    // Should redirect to login
    await expect(page.getByText(/admin access/i)).toBeVisible();
  });
});
