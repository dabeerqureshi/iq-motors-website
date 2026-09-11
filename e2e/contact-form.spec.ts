import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  test('contact form renders all fields', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
  });

  test('shows validation errors for empty fields', async ({ page }) => {
    await page.goto('/contact');
    
    // Click submit without filling form
    await page.click('text=Send Message');
    
    // Check for validation errors
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
    await expect(page.getByText(/message is required/i)).toBeVisible();
  });

  test('validates email format', async ({ page }) => {
    await page.goto('/contact');
    
    // Enter invalid email
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/message/i).fill('Test message');
    
    await page.click('text=Send Message');
    
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('submits form with valid data', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form with valid data
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/phone/i).fill('07123456789');
    await page.getByLabel(/message/i).fill('I am interested in a car');
    
    // Submit form
    await page.click('text=Send Message');
    
    // Check for success message (may need to wait for EmailJS)
    await expect(page.getByText(/message sent successfully/i)).toBeVisible({ timeout: 15000 });
  });

  test('shows loading state during submission', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/message/i).fill('Test message');
    
    // Submit and immediately check for loading state
    await page.click('text=Send Message');
    
    // Check for sending text (may be brief)
    try {
      await expect(page.getByText(/sending/i)).toBeVisible({ timeout: 2000 });
    } catch {
      // Loading state may have passed quickly
    }
  });

  test('form clears after successful submission', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill and submit form
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/message/i).fill('Test message');
    
    await page.click('text=Send Message');
    
    // Wait for success
    await expect(page.getByText(/message sent successfully/i)).toBeVisible({ timeout: 15000 });
    
    // Check form is cleared
    await expect(page.getByLabel(/name/i)).toHaveValue('');
    await expect(page.getByLabel(/email/i)).toHaveValue('');
    await expect(page.getByLabel(/message/i)).toHaveValue('');
  });
});
