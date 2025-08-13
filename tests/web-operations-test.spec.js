const { test, expect } = require('@playwright/test');

test.describe('Web操作学習テスト', () => {
  test('Playwright公式サイト - ナビゲーションとクリック操作', async ({ page }) => {
    // 学習ポイント1: ページナビゲーション
    console.log('1. Playwright公式サイトにアクセス');
    await page.goto('https://playwright.dev/');
    
    // 学習ポイント2: ページタイトルの確認
    console.log('2. ページタイトルを確認');
    await expect(page).toHaveTitle(/Playwright/);
    
    // 学習ポイント3: 要素のクリック操作
    console.log('3. Docsリンクをクリック');
    await page.click('text=Docs');
    
    // 学習ポイント4: URLの変更確認
    console.log('4. URLが変更されたことを確認');
    await expect(page).toHaveURL(/.*docs.*/);
    
    // 学習ポイント5: 特定の要素の存在確認（複数マッチする場合の対処）
    console.log('5. Getting Startedリンクが表示されることを確認');
    const gettingStartedLink = page.locator('text=Getting started').first();
    await expect(gettingStartedLink).toBeVisible();
    
    console.log('✅ テスト完了: ページナビゲーションとクリック操作を学習できました');
  });

  test('要素の操作 - セレクターとテキスト抽出の学習', async ({ page }) => {
    console.log('1. Playwright公式サイトにアクセス');
    await page.goto('https://playwright.dev/');
    
    // 学習ポイント1: 複数のセレクター方法
    console.log('2. 様々なセレクターでヘッダー要素を取得');
    const headerByTag = page.locator('header');
    const navByRole = page.locator('role=navigation');
    await expect(headerByTag).toBeVisible();
    
    // 学習ポイント2: テキストベースでの要素選択（複数マッチする場合の対処）
    console.log('3. テキスト内容で要素を特定');
    const playwrightTitle = page.locator('text=Playwright').first();
    await expect(playwrightTitle).toBeVisible();
    
    // 学習ポイント3: CSS セレクターを使った要素の特定
    console.log('4. CSSセレクターで要素を特定');
    const titleElement = page.locator('h1');
    const titleText = await titleElement.textContent();
    console.log(`メインタイトル: ${titleText}`);
    expect(titleText).toContain('Playwright');
    
    // 学習ポイント4: 属性による要素の特定
    console.log('5. リンク要素の確認');
    const docLinks = page.locator('a[href*="docs"]');
    const linkCount = await docLinks.count();
    console.log(`ドキュメントリンクの数: ${linkCount}`);
    expect(linkCount).toBeGreaterThan(0);
    
    // 学習ポイント5: 要素の属性値取得
    console.log('6. 最初のリンクのhref属性を取得');
    const firstDocLink = docLinks.first();
    const href = await firstDocLink.getAttribute('href');
    console.log(`最初のリンクURL: ${href}`);
    expect(href).toContain('docs');
    
    console.log('✅ テスト完了: 要素の選択とテキスト抽出を学習できました');
  });

  test('フォーム操作 - より複雑なDOM操作の学習', async ({ page }) => {
    console.log('1. Playwright公式サイトにアクセス');
    await page.goto('https://playwright.dev/');
    
    // 学習ポイント1: 複数の要素の存在確認
    console.log('2. ヘッダー要素の確認');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // 学習ポイント2: メニューナビゲーション
    console.log('3. API リンクをクリック');
    await page.click('text=API');
    await expect(page).toHaveURL(/.*api.*/);
    
    // 学習ポイント3: ページ内の特定要素を探す
    console.log('4. ページ内にTestクラスの説明があることを確認');
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Test');
    
    // 学習ポイント4: 複数の要素から特定の要素を選択
    console.log('5. ナビゲーションリンクの確認');
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    console.log(`ナビゲーションリンクの数: ${linkCount}`);
    expect(linkCount).toBeGreaterThan(0);
    
    console.log('✅ テスト完了: 複雑なDOM操作を学習できました');
  });

});
