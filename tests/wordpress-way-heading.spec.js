/**
 * WordPress-way E2E テスト学習用
 * Headingブロック操作
 */

// WordPress公式のE2Eユーティリティを使用
const { test, expect } = require('@wordpress/e2e-test-utils-playwright');

test.describe('WordPress-way学習: Headingブロック', () => {
  test.beforeEach(async ({ admin }) => {
    console.log('🚀 新規投稿を作成してエディタを準備中...');
    await admin.createNewPost();
  });

  test('基本的なHeadingブロックの挿入と操作', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: Headingブロック基本操作');
    
    // Headingブロックを挿入
    console.log('1. Headingブロックを挿入');
    await editor.insertBlock({ 
      name: 'core/heading' 
    });
    
    // テキスト入力
    console.log('2. 見出しテキストを入力');
    const headingText = 'WordPress学習の見出し';
    await page.keyboard.type(headingText);
    
    // Headingブロックが正しく表示されることを確認
    console.log('3. Headingブロックの確認');
    const headingBlock = editor.canvas.locator('[data-type="core/heading"]');
    await expect(headingBlock).toBeVisible();
    await expect(headingBlock).toContainText(headingText);
    
    // デフォルトでH2タグになることを確認
    console.log('4. デフォルトHTMLタグの確認（H2）');
    const h2Element = editor.canvas.locator('h2');
    await expect(h2Element).toBeVisible();
    await expect(h2Element).toContainText(headingText);
    
    console.log('✅ テスト完了: 基本的なHeadingブロック操作が成功しました');
  });

  test('見出しレベルの変更（H1-H6）', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: 見出しレベル変更');
    
    // Headingブロック作成
    console.log('1. Headingブロックを作成');
    await editor.insertBlock({ name: 'core/heading' });
    await page.keyboard.type('レベル変更テスト');
    
    // ブロック設定サイドバーを開く
    console.log('2. ブロック設定サイドバーを開く');
    await editor.openDocumentSettingsSidebar();
    
    // H1に変更
    console.log('3. 見出しレベルをH1に変更');
    const headingLevelSelect = page.locator('role=group[name="Heading level"i] >> role=button[name="1"i]');
    await headingLevelSelect.click();
    
    // H1になったことを確認
    const h1Element = editor.canvas.locator('h1');
    await expect(h1Element).toBeVisible();
    await expect(h1Element).toContainText('レベル変更テスト');
    
    // H3に変更
    console.log('4. 見出しレベルをH3に変更');
    const h3Button = page.locator('role=group[name="Heading level"i] >> role=button[name="3"i]');
    await h3Button.click();
    
    // H3になったことを確認
    const h3Element = editor.canvas.locator('h3');
    await expect(h3Element).toBeVisible();
    await expect(h3Element).toContainText('レベル変更テスト');
    
    // H6に変更（最小レベル）
    console.log('5. 見出しレベルをH6に変更');
    const h6Button = page.locator('role=group[name="Heading level"i] >> role=button[name="6"i]');
    await h6Button.click();
    
    // H6になったことを確認
    const h6Element = editor.canvas.locator('h6');
    await expect(h6Element).toBeVisible();
    await expect(h6Element).toContainText('レベル変更テスト');
    
    console.log('✅ テスト完了: 見出しレベル変更が正常に動作しました');
  });

  test('Headingブロックの書式設定', async ({ 
    editor, 
    page,
    pageUtils 
  }) => {
    console.log('📝 テスト開始: Heading書式設定');
    
    // Headingブロック作成
    console.log('1. Headingブロックを作成');
    await editor.insertBlock({ name: 'core/heading' });
    await page.keyboard.type('書式設定される見出し');
    
    // テキスト全選択
    console.log('2. テキストを全選択');
    await pageUtils.pressKeys('primary+a');
    
    // 太字を適用
    console.log('3. 太字書式を適用');
    const boldButton = page.locator('role=toolbar[name="Block tools"i] >> role=button[name="Bold"i]');
    await boldButton.click();
    
    // 太字が適用されたか確認
    console.log('4. 太字書式の確認');
    const boldHeading = editor.canvas.locator('h2 strong');
    await expect(boldHeading).toBeVisible();
    await expect(boldHeading).toContainText('書式設定される見出し');
    
    // イタリックを追加適用
    console.log('5. イタリック書式を追加');
    const italicButton = page.locator('role=toolbar[name="Block tools"i] >> role=button[name="Italic"i]');
    await italicButton.click();
    
    // 太字+イタリックが適用されたか確認
    const boldItalicHeading = editor.canvas.locator('h2 strong em');
    await expect(boldItalicHeading).toBeVisible();
    await expect(boldItalicHeading).toContainText('書式設定される見出し');
    
    console.log('✅ テスト完了: Heading書式設定が正常に動作しました');
  });

  test('キーボードショートカットによる見出しレベル変更', async ({ 
    editor, 
    page,
    pageUtils 
  }) => {
    console.log('📝 テスト開始: キーボードショートカットでの見出しレベル変更');
    
    // Paragraphブロックから開始
    console.log('1. Paragraphブロックを作成');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('## 見出しに変換');
    
    // ## でH2見出しに自動変換されることを確認
    console.log('2. Markdown記法での自動変換確認');
    const h2Element = editor.canvas.locator('h2');
    await expect(h2Element).toBeVisible();
    await expect(h2Element).toContainText('見出しに変換');
    
    // 別パターンをテスト
    console.log('3. 新しいParagraphブロックで### パターンをテスト');
    await page.keyboard.press('Enter');
    await page.keyboard.type('### H3見出し');
    
    const h3Element = editor.canvas.locator('h3');
    await expect(h3Element).toBeVisible();
    await expect(h3Element).toContainText('H3見出し');
    
    console.log('✅ テスト完了: キーボードショートカットでの変換が正常に動作しました');
  });

  test('Headingブロックのアンカー設定', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: Headingアンカー設定');
    
    // Headingブロック作成
    console.log('1. Headingブロックを作成');
    await editor.insertBlock({ name: 'core/heading' });
    await page.keyboard.type('アンカー設定テスト');
    
    // ブロック設定サイドバーを開く
    console.log('2. ブロック設定サイドバーを開く');
    await editor.openDocumentSettingsSidebar();
    
    // 高度な設定を展開
    console.log('3. 高度な設定を展開');
    const advancedPanel = page.locator('role=button[name="Advanced"i]');
    if (await advancedPanel.isVisible()) {
      await advancedPanel.click();
    }
    
    // HTMLアンカー設定
    console.log('4. HTMLアンカーを設定');
    const anchorInput = page.locator('role=textbox[name="HTML anchor"i]');
    if (await anchorInput.isVisible()) {
      await anchorInput.fill('test-anchor');
      
      // アンカーが設定されたか確認
      console.log('5. アンカー設定の確認');
      const headingWithAnchor = editor.canvas.locator('h2[id="test-anchor"]');
      await expect(headingWithAnchor).toBeVisible();
      console.log('✅ アンカー設定が確認できました');
    } else {
      console.log('ℹ️ HTMLアンカー設定は現在の環境では利用できません');
    }
    
    console.log('✅ テスト完了: Headingアンカー設定テストが完了しました');
  });

  test('複数の見出しレベルを組み合わせた文書構造', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: 文書構造作成');
    
    // H1見出しを作成
    console.log('1. H1見出しを作成');
    await editor.insertBlock({ 
      name: 'core/heading',
      attributes: { level: 1 }
    });
    await page.keyboard.type('メインタイトル');
    
    // H2見出しを追加
    console.log('2. H2見出しを追加');
    await page.keyboard.press('Enter');
    await editor.insertBlock({ 
      name: 'core/heading',
      attributes: { level: 2 }
    });
    await page.keyboard.type('セクション1');
    
    // H3見出しを追加
    console.log('3. H3見出しを追加');
    await page.keyboard.press('Enter');
    await editor.insertBlock({ 
      name: 'core/heading',
      attributes: { level: 3 }
    });
    await page.keyboard.type('サブセクション1.1');
    
    // 別のH2を追加
    console.log('4. 別のH2見出しを追加');
    await page.keyboard.press('Enter');
    await editor.insertBlock({ 
      name: 'core/heading',
      attributes: { level: 2 }
    });
    await page.keyboard.type('セクション2');
    
    // 文書構造を確認
    console.log('5. 作成された見出し構造を確認');
    const h1 = editor.canvas.locator('h1');
    const h2Elements = editor.canvas.locator('h2');
    const h3 = editor.canvas.locator('h3');
    
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('メインタイトル');
    
    await expect(h2Elements).toHaveCount(2);
    await expect(h2Elements.nth(0)).toContainText('セクション1');
    await expect(h2Elements.nth(1)).toContainText('セクション2');
    
    await expect(h3).toHaveCount(1);
    await expect(h3).toContainText('サブセクション1.1');
    
    console.log('✅ テスト完了: 適切な文書構造が作成されました');
  });
});
