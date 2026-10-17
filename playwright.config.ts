import { defineConfig, devices } from '@playwright/test';

const PORT = 5199;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Desktop Chrome'],
    // Fixed window and pixel ratio: the canvas area (window minus the 360 px
    // library panel) is 1280 × 720, so the grid is always 320 × 180 cells.
    viewport: { width: 1640, height: 876 },
    deviceScaleFactor: 1,
  },
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
  },
});
