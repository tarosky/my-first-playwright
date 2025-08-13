/**
 * WordPress-way E2E テスト学習用
 * Paragraphブロック基本操作
 */

// WordPress公式のE2Eユーティリティを使用
const { test, expect } = require('@wordpress/e2e-test-utils-playwright');

test.describe('WordPress-way学習: Paragraphブロック', () => {
  // 各テスト前に新規投稿を作成（WordPress標準のパターン）
  test.beforeEach(async ({ admin }) => {
    console.log('🚀 新規投稿を作成してエディタを準備中...');
    await admin.createNewPost();
  });

  test('基本的なParagraphブロックの挿入とテキスト入力', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: Paragraphブロック基本操作');
    
    // WordPress-wayのブロック挿入
    console.log('1. Paragraphブロックを挿入');
    await editor.insertBlock({ 
      name: 'core/paragraph' 
    });
    
    // テキスト入力
    console.log('2. テキストを入力');
    const testText = 'WordPress-wayのテスト学習です！';
    await page.keyboard.type(testText);
    
    // ブロック要素の確認（WordPress公式のアプローチ）
    console.log('3. ブロック要素の確認');
    const paragraphBlock = editor.canvas.locator('[data-type="core/paragraph"]');
    await expect(paragraphBlock).toBeVisible();
    await expect(paragraphBlock).toContainText(testText);
    
    // HTMLタグの確認（WordPress-wayの検証パターン）
    console.log('4. HTMLタグの確認');
    const blockTagName = await editor.canvas
      .locator('[data-block]')
      .first()
      .evaluate((el) => el.tagName);
    
    expect(blockTagName).toBe('P');
    
    console.log('✅ テスト完了: 基本的なParagraphブロック操作が成功しました');
  });

  test('Paragraphブロックの書式設定', async ({ 
    editor, 
    page,
    pageUtils 
  }) => {
    console.log('📝 テスト開始: Paragraph書式設定');
    
    // ブロック挿入とテキスト入力
    console.log('1. Paragraphブロックを挿入してテキストを入力');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('書式設定のテストです');
    
    // テキスト全選択（WordPress-wayのキーボード操作）
    console.log('2. テキストを全選択');
    await pageUtils.pressKeys('primary+a');
    
    // ツールバーの太字ボタンをクリック
    console.log('3. 太字書式を適用');
    const boldButton = page.locator('role=toolbar[name="Block tools"i] >> role=button[name="Bold"i]');
    await boldButton.click();
    
    // 太字が適用されたか確認
    console.log('4. 太字書式の確認');
    const boldText = editor.canvas.locator('p strong');
    await expect(boldText).toBeVisible();
    await expect(boldText).toContainText('書式設定のテストです');
    
    console.log('✅ テスト完了: 書式設定が正常に動作しました');
  });

  test('Paragraphブロックの変換機能', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: ブロック変換機能');
    
    // Paragraphブロック作成
    console.log('1. Paragraphブロックを作成');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('見出しに変換されます');
    
    // ブロック変換メニューを開く
    console.log('2. ブロック変換メニューを開く');
    await editor.showBlockToolbar();
    const transformButton = page.locator('role=toolbar[name="Block tools"i] >> role=button[name="Paragraph"]');
    await transformButton.click();
    
    // Headingブロックに変換
    console.log('3. Headingブロックに変換');
    const headingOption = page.locator('role=menuitem[name="Heading"]');
    await headingOption.click();
    
    // 変換結果を確認
    console.log('4. 変換結果の確認');
    const headingBlock = editor.canvas.locator('[data-type="core/heading"]');
    await expect(headingBlock).toBeVisible();
    await expect(headingBlock).toContainText('見出しに変換されます');
    
    // H2タグになっていることを確認
    const headingElement = editor.canvas.locator('h2');
    await expect(headingElement).toBeVisible();
    await expect(headingElement).toContainText('見出しに変換されます');
    
    console.log('✅ テスト完了: ブロック変換が正常に動作しました');
  });

  test('複数のParagraphブロック操作', async ({ 
    editor, 
    page,
    pageUtils 
  }) => {
    console.log('📝 テスト開始: 複数ブロック操作');
    
    // 複数のParagraphブロックを作成
    console.log('1. 最初のParagraphブロックを作成');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('最初の段落です');
    
    // Enterで新しいブロック作成
    console.log('2. Enterキーで新しいブロックを作成');
    await page.keyboard.press('Enter');
    await page.keyboard.type('二番目の段落です');
    
    // 3つ目のブロック
    console.log('3. さらに新しいブロックを作成');
    await page.keyboard.press('Enter');
    await page.keyboard.type('三番目の段落です');
    
    // すべてのブロックが存在することを確認
    console.log('4. 作成されたブロックの確認');
    const paragraphBlocks = editor.canvas.locator('[data-type="core/paragraph"]');
    await expect(paragraphBlocks).toHaveCount(3);
    
    // 各ブロックの内容確認
    await expect(paragraphBlocks.nth(0)).toContainText('最初の段落です');
    await expect(paragraphBlocks.nth(1)).toContainText('二番目の段落です');
    await expect(paragraphBlocks.nth(2)).toContainText('三番目の段落です');
    
    // 最初のブロックを選択して削除
    console.log('5. 最初のブロックを削除');
    await paragraphBlocks.nth(0).click();
    await pageUtils.pressKeys('Backspace');
    
    // ブロック数が減ったことを確認
    await expect(paragraphBlocks).toHaveCount(2);
    await expect(paragraphBlocks.nth(0)).toContainText('二番目の段落です');
    
    console.log('✅ テスト完了: 複数ブロック操作が正常に動作しました');
  });

  test('投稿の保存と公開（WordPress REST API活用）', async ({ 
    editor, 
    page,
    requestUtils 
  }) => {
    console.log('📝 テスト開始: 投稿保存と公開');
    
    // テスト用の投稿を作成
    console.log('1. テスト投稿を作成');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('WordPress-wayテストの投稿内容です');
    
    // 投稿タイトルを設定
    console.log('2. 投稿タイトルを設定');
    const titleField = page.locator('role=textbox[name="Add title"i]');
    await titleField.fill('WordPress-way学習テスト投稿');
    
    // 下書きとして保存
    console.log('3. 下書きとして保存');
    await editor.saveDraft();
    
    // 下書きが保存されたことを確認
    const saveIndicator = page.locator('.editor-post-saved-state');
    await expect(saveIndicator).toContainText('Saved');
    
    // 投稿を公開
    console.log('4. 投稿を公開');
    await editor.publishPost();
    
    // 公開が成功したことを確認
    const publishNotice = page.locator('.components-snackbar__content');
    await expect(publishNotice).toContainText('published');
    
    console.log('✅ テスト完了: 投稿の保存と公開が正常に動作しました');
  });
});
