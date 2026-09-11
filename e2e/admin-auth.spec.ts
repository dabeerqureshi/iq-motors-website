import { test, expect } from '@playwright/test';

test.describe('Admin authentication', () => {
  test('admin login page renders', async ({ page }) => {
    await page.goto('/admin-IQmotors');
    
    await expect(page.getByRole('heading', { name: /admin login/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/admin-IQmotors');
    
    // Fill with invalid credentials
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Submit
    await page.click('text=Sign In');
    
    // Check for error message
    await expect(page.getByText(/invalid|error|failed/i)).toBeVisible({ timeout: 10000 });
  });

  test('requires email and password', async ({ page }) => {
    await page.goto('/admin-IQmotors');
    
    // Try to submit empty form
    await page.click('text=Sign In');
    
    // Should show validation error
    await expect(page.getByText(/required|invalid/i)).toBeVisible({ timeout:5000 });
  });

  test('successful login redirects to admin dashboard', async ({ page }) => {
    // Note: This test requires valid admin credentials in the test environment
    // Skip if no test credentials are configured
    test.skip(!process.env.TEST_ADMIN_EMAIL, 'Test admin credentials not configured');
    
    await page.goto('/admin-IQmotors');
    
    await page.getByLabel(/email/i).fill(process.env.TEST_ADMIN_EMAIL || '');
    await page.getByLabel(/password/i).fill(process.env.TEST_ADMIN_PASSWORD || '');
    
    await page.click('text=Sign In');
    
    // Should redirect to admin dashboard
    await expect(page.getByRole('heading', { name: /admin dashboard/i })).toBeVisible({ timeout: 10000 });
  });

  test('admin dashboard shows management sections', async ({ page }) => {
    // Skip if no test credentials
    test.skip(!process.env.TEST_ADMIN_EMAIL, 'Test admin credentials not configured');
    
    await page.goto('/admin-IQmotors');
    
    await page.getByLabel(/email/i).fill(process.env.TEST_ADMIN_EMAIL || '');
    await page.getByLabel(/password/i).fill(process.env.TEST_ADMIN_PASSWORD || '');
    
    await page.click('text=Sign In');
    
    // Check for management sections
    await expect(page.getByText(/stock management/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/happy customers/i)).toBeVisible();
  });

  test('logout works correctly', async ({ page }) => {
    // Skip if no test credentials
    test.skip(!process.env.TEST_ADMIN_EMAIL, 'Test admin credentials not configured');
    
    await page.goto('/admin-IQmotors');
    
    await page.getByLabel(/email/i).fill(process.env.TEST_ADMIN_EMAIL || '');
    await page.getByLabel(/password/i).fill(process.env.TEST_ADMIN_PASSWORD || '');
    
    await page.click('text=Sign In');
    
    // Wait for dashboard
    await expect(page.getByRole('heading', { name: /admin dashboard/i })).toBeVisible({ timeout: 10000 });
    
    // Click logout
    await page.click('text=Logout');
    
    // Should redirect to login
    await expect(page.getByRole('heading', { name: /admin login/i })).toBeVisible();
  });
});
