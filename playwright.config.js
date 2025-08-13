// playwright.config.js
module.exports = {
  testDir: './tests',
  // CI環境では再実行を有効化
  retries: process.env.CI ? 2 : 0,
  // CI環境ではタイムアウトを延長
  timeout: process.env.CI ? 60000 : 30000,
  expect: {
    timeout: process.env.CI ? 10000 : 5000
  },
  use: {
    // より人間らしいブラウザ設定
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // CI環境では軽量設定
    screenshot: process.env.CI ? 'only-on-failure' : 'on',
    video: process.env.CI ? 'retain-on-failure' : 'on',
    // CI環境では明示的にheadlessモードを設定
    headless: process.env.CI ? true : false,
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
