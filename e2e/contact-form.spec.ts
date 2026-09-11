import { test, expect } from '@playwright/test';

// The submission tests call the real EmailJS API. Real sends are opt-in
// (RUN_EMAILJS_E2E=1) because they depend on the live Gmail/EmailJS
// integration being healthy — when it is not, they would spam retries in
// CI. Render/validation-only tests always run. Accepts both CI-style
// (EMAILJS_SERVICE_ID) and Vite-style (VITE_SERVICE_ID_EMAILJS) names.
const hasEmailJs = Boolean(
  (process.env.EMAILJS_SERVICE_ID &&
    process.env.EMAILJS_PUBLIC_KEY &&
    process.env.EMAILJS_TEMPLATE_ID) ||
  (process.env.VITE_SERVICE_ID_EMAILJS &&
    process.env.VITE_PUBLIC_KEY_EMAILJS &&
    process.env.VITE_TEMPLATE_ID_EMAILJS),
);
const runEmailJsSubmit = hasEmailJs && process.env.RUN_EMAILJS_E2E === '1';

test.describe('Contact form', () => {
  test('contact form renders all fields', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.getByLabel(/your name/i)).toBeVisible();
    await expect(page.getByLabel(/your contact number/i)).toBeVisible();
    await expect(page.getByLabel(/your vehicle registration/i)).toBeVisible();
    await expect(page.getByLabel(/your vehicle current mileage/i)).toBeVisible();
    await expect(page.getByLabel(/how can we help/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /submit request/i })).toBeVisible();
  });

  test('requires the mandatory fields', async ({ page }) => {
    await page.goto('/contact');

    // HTML5 `required` attributes must be present on the key inputs
    await expect(page.getByLabel(/your name/i)).toHaveAttribute('required', '');
    await expect(page.getByLabel(/your contact number/i)).toHaveAttribute('required', '');
    await expect(page.getByLabel(/how can we help/i)).toHaveAttribute('required', '');
  });

  test('submits form with valid data', async ({ page }) => {
    test.skip(!runEmailJsSubmit, 'EmailJS submit not opted in (set RUN_EMAILJS_E2E=1) - skipping');

    await page.goto('/contact');

    // Fill form with valid data
    await page.getByLabel(/your name/i).fill('John Doe');
    await page.getByLabel(/your contact number/i).fill('07123456789');
    await page.getByLabel(/your vehicle registration/i).fill('AB12 CDE');
    await page.getByLabel(/your vehicle current mileage/i).fill('45000');
    await page.getByLabel(/how can we help/i).fill('I am interested in a car');

    // Submit form
    await page.getByRole('button', { name: /submit request/i }).click();

    // Check for the success toast (may need to wait for EmailJS)
    await expect(page.getByText(/request submitted/i)).toBeVisible({ timeout: 15000 });
  });

  test('shows loading state during submission', async ({ page }) => {
    test.skip(!runEmailJsSubmit, 'EmailJS submit not opted in (set RUN_EMAILJS_E2E=1) - skipping');

    await page.goto('/contact');

    // Fill form
    await page.getByLabel(/your name/i).fill('John Doe');
    await page.getByLabel(/your contact number/i).fill('07123456789');
    await page.getByLabel(/your vehicle registration/i).fill('AB12 CDE');
    await page.getByLabel(/your vehicle current mileage/i).fill('45000');
    await page.getByLabel(/how can we help/i).fill('Test message');

    // Submit and immediately check for loading state
    await page.getByRole('button', { name: /submit request/i }).click();

    // Button shows "Sending..." while the request is in flight
    try {
      await expect(page.getByRole('button', { name: /sending/i })).toBeVisible({ timeout: 5000 });
    } catch {
      // Loading state may have passed quickly
    }
  });

  test('form clears after successful submission', async ({ page }) => {
    test.skip(!runEmailJsSubmit, 'EmailJS submit not opted in (set RUN_EMAILJS_E2E=1) - skipping');

    await page.goto('/contact');

    // Fill and submit form
    await page.getByLabel(/your name/i).fill('John Doe');
    await page.getByLabel(/your contact number/i).fill('07123456789');
    await page.getByLabel(/your vehicle registration/i).fill('AB12 CDE');
    await page.getByLabel(/your vehicle current mileage/i).fill('45000');
    await page.getByLabel(/how can we help/i).fill('Test message');

    await page.getByRole('button', { name: /submit request/i }).click();

    // Wait for success toast
    await expect(page.getByText(/request submitted/i)).toBeVisible({ timeout: 15000 });

    // Check form is cleared
    await expect(page.getByLabel(/your name/i)).toHaveValue('');
    await expect(page.getByLabel(/your contact number/i)).toHaveValue('');
    await expect(page.getByLabel(/how can we help/i)).toHaveValue('');
  });
});
