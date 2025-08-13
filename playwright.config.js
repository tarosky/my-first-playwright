// playwright.config.js
module.exports = {
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    // より人間らしいブラウザ設定
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...require('@playwright/test').devices['Desktop Chrome'],
      },
    },
    {
      name: 'wordpress-e2e',
      testMatch: /.*wordpress-way.*\.spec\.js/,
      use: {
        ...require('@playwright/test').devices['Desktop Chrome'],
        // WordPress環境用の設定
        baseURL: 'http://localhost:8080',
        // WordPress特有のヘッダー設定
        extraHTTPHeaders: {
          // WordPress環境での認証やセッション管理に必要に応じて追加
        },
      },
    },
  ],
};
