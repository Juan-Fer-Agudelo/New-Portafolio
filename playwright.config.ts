import { defineConfig, devices } from '@playwright/test';

// Pruebas de humo de las demos "Ver proyecto" contra el sitio compilado (igual que en producción).
// En local usa el Chrome instalado; en CI usa el Chromium que descarga Playwright.
const browser = process.env.CI ? {} : { channel: 'chrome' as const };

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], ...browser, viewport: { width: 1440, height: 900 } } },
    { name: 'celular', use: { ...devices['Pixel 7'], ...browser } },
  ],
  webServer: {
    command: 'npx vite build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
