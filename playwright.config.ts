import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration for IQ Motors
 * Tests run against the production build served locally
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in test files */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only; single retry keeps runtimes short */
  retries: process.env.CI ? 1 : 0,
  /* Parallel workers: default on local, limited on CI to avoid killing runners */
  workers: process.env.CI ? 2 : undefined,
  /* Hard cap per-test so a hung spec can never spin for hours */
  timeout: 60_000,
  /* Reporter to use */
  reporter: process.env.CI ? 'github' : 'html',
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/') */
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:4173',
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },
  /* Configure projects. On CI we run Chromium-based browsers only
     (desktop + mobile), which cuts install/test time ~2-3x vs the
     full 5-browser matrix. Set FULL_E2E=1 to run all projects. */
  projects: (process.env.CI && !process.env.FULL_E2E
    ? [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'Mobile Chrome',
          use: { ...devices['Pixel 5'] },
        },
      ]
    : [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },
        /* Mobile viewports */
        {
          name: 'Mobile Chrome',
          use: { ...devices['Pixel 5'] },
        },
        {
          name: 'Mobile Safari',
          use: { ...devices['iPhone 12'] },
        },
      ]),
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
