const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
    // Capture screenshot after every test (failure or success)
    screenshot: 'on',
    // Capture video for every test (optional, good for debugging)
    video: 'on',
    // Trace viewer (very powerful "time travel" debugging)
    trace: 'on',
  },

  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});