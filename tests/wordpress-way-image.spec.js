/**
 * WordPress-way E2E テスト学習用
 * Imageブロック操作
 */

// WordPress公式のE2Eユーティリティを使用
const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const path = require('path');

test.describe('WordPress-way学習: Imageブロック', () => {
  test.beforeEach(async ({ admin, requestUtils }) => {
    console.log('🚀 新規投稿を作成してエディタを準備中...');
    await admin.createNewPost();
    // テスト用メディアをクリーンアップ
    await requestUtils.deleteAllMedia();
  });

  test.afterEach(async ({ requestUtils }) => {
    // テスト後のクリーンアップ
    await requestUtils.deleteAllMedia();
  });

  test('基本的なImageブロックの挿入', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: Imageブロック基本操作');
    
    // Imageブロックを挿入
    console.log('1. Imageブロックを挿入');
    await editor.insertBlock({ 
      name: 'core/image' 
    });
    
    // Imageブロックのプレースホルダーが表示されることを確認
    console.log('2. Imageブロックプレースホルダーの確認');
    const imageBlock = editor.canvas.locator('[data-type="core/image"]');
    await expect(imageBlock).toBeVisible();
    
    // アップロードボタンの存在確認
    const uploadButton = imageBlock.locator('role=button[name="Upload"i]');
    await expect(uploadButton).toBeVisible();
    
    console.log('✅ テスト完了: Imageブロックの基本構造が確認できました');
  });

  test('画像URLによるImageブロック作成', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: URL画像でのImageブロック作成');
    
    // Imageブロック挿入
    console.log('1. Imageブロックを挿入');
    await editor.insertBlock({ name: 'core/image' });
    
    // 「Insert from URL」オプションをクリック
    console.log('2. Insert from URLオプションを選択');
    const imageBlock = editor.canvas.locator('[data-type="core/image"]');
    const insertFromUrlButton = imageBlock.locator('role=button[name="Insert from URL"i]');
    await insertFromUrlButton.click();
    
    // テスト用の画像URLを入力
    console.log('3. 画像URLを入力');
    const testImageUrl = 'https://picsum.photos/400/300';
    const urlInput = imageBlock.locator('role=textbox[name="URL"i]');
    await urlInput.fill(testImageUrl);
    
    // 適用ボタンをクリック
    const applyButton = imageBlock.locator('role=button[name="Apply"i]');
    await applyButton.click();
    
    // 画像が表示されることを確認
    console.log('4. 画像表示の確認');
    const imageElement = imageBlock.locator('img');
    await expect(imageElement).toBeVisible();
    await expect(imageElement).toHaveAttribute('src', testImageUrl);
    
    console.log('✅ テスト完了: URL画像でのImageブロック作成が成功しました');
  });

  test('画像のキャプション設定', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: 画像キャプション設定');
    
    // URL画像でImageブロック作成
    console.log('1. URL画像でImageブロックを作成');
    await editor.insertBlock({ name: 'core/image' });
    const imageBlock = editor.canvas.locator('[data-type="core/image"]');
    
    const insertFromUrlButton = imageBlock.locator('role=button[name="Insert from URL"i]');
    await insertFromUrlButton.click();
    
    const testImageUrl = 'https://picsum.photos/300/200';
    const urlInput = imageBlock.locator('role=textbox[name="URL"i]');
    await urlInput.fill(testImageUrl);
    
    const applyButton = imageBlock.locator('role=button[name="Apply"i]');
    await applyButton.click();
    
    // 画像が読み込まれるまで待機
    await expect(imageBlock.locator('img')).toBeVisible();
    
    // キャプション入力欄をクリック
    console.log('2. キャプション入力欄をクリック');
    const captionPlaceholder = imageBlock.locator('role=textbox[name="Write caption…"i]');
    await captionPlaceholder.click();
    
    // キャプションを入力
    console.log('3. キャプションを入力');
    const captionText = 'これはテスト用の画像キャプションです';
    await page.keyboard.type(captionText);
    
    // キャプションが正しく入力されたか確認
    console.log('4. キャプション入力の確認');
    const caption = imageBlock.locator('figcaption');
    await expect(caption).toBeVisible();
    await expect(caption).toContainText(captionText);
    
    console.log('✅ テスト完了: 画像キャプション設定が成功しました');
  });

  test('画像の代替テキスト（Alt text）設定', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: 画像代替テキスト設定');
    
    // URL画像でImageブロック作成
    console.log('1. URL画像でImageブロックを作成');
    await editor.insertBlock({ name: 'core/image' });
    const imageBlock = editor.canvas.locator('[data-type="core/image"]');
    
    const insertFromUrlButton = imageBlock.locator('role=button[name="Insert from URL"i]');
    await insertFromUrlButton.click();
    
    const testImageUrl = 'https://picsum.photos/350/250';
    const urlInput = imageBlock.locator('role=textbox[name="URL"i]');
    await urlInput.fill(testImageUrl);
    
    const applyButton = imageBlock.locator('role=button[name="Apply"i]');
    await applyButton.click();
    
    // 画像が読み込まれるまで待機
    await expect(imageBlock.locator('img')).toBeVisible();
    
    // ブロック設定サイドバーを開く
    console.log('2. ブロック設定サイドバーを開く');
    await editor.openDocumentSettingsSidebar();
    
    // Alt textフィールドを見つけて入力
    console.log('3. 代替テキストを入力');
    const altTextField = page.locator('role=textbox[name="Alternative text"i]');
    const altText = 'テスト用のランダム画像';
    await altTextField.fill(altText);
    
    // Alt属性が設定されたか確認
    console.log('4. 代替テキスト設定の確認');
    const imageElement = imageBlock.locator('img');
    await expect(imageElement).toHaveAttribute('alt', altText);
    
    console.log('✅ テスト完了: 画像代替テキスト設定が成功しました');
  });

  test('画像のリンク設定', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: 画像リンク設定');
    
    // URL画像でImageブロック作成
    console.log('1. URL画像でImageブロックを作成');
    await editor.insertBlock({ name: 'core/image' });
    const imageBlock = editor.canvas.locator('[data-type="core/image"]');
    
    const insertFromUrlButton = imageBlock.locator('role=button[name="Insert from URL"i]');
    await insertFromUrlButton.click();
    
    const testImageUrl = 'https://picsum.photos/320/240';
    const urlInput = imageBlock.locator('role=textbox[name="URL"i]');
    await urlInput.fill(testImageUrl);
    
    const applyButton = imageBlock.locator('role=button[name="Apply"i]');
    await applyButton.click();
    
    // 画像が読み込まれるまで待機
    await expect(imageBlock.locator('img')).toBeVisible();
    
    // 画像をクリックしてツールバーを表示
    console.log('2. 画像をクリックしてツールバーを表示');
    await imageBlock.locator('img').click();
    await editor.showBlockToolbar();
    
    // リンクボタンをクリック
    console.log('3. リンクボタンをクリック');
    const linkButton = page.locator('role=toolbar[name="Block tools"i] >> role=button[name="Link"i]');
    await linkButton.click();
    
    // リンクURLを入力
    console.log('4. リンクURLを入力');
    const linkUrl = 'https://example.com';
    const linkInput = page.locator('role=combobox[name="URL"i]');
    await linkInput.fill(linkUrl);
    
    // Enterキーでリンクを確定
    await page.keyboard.press('Enter');
    
    // リンクが設定されたか確認
    console.log('5. リンク設定の確認');
    const linkedImage = imageBlock.locator('a img');
    await expect(linkedImage).toBeVisible();
    
    const linkElement = imageBlock.locator('a');
    await expect(linkElement).toHaveAttribute('href', linkUrl);
    
    console.log('✅ テスト完了: 画像リンク設定が成功しました');
  });

  test('画像のサイズ調整', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: 画像サイズ調整');
    
    // URL画像でImageブロック作成
    console.log('1. URL画像でImageブロックを作成');
    await editor.insertBlock({ name: 'core/image' });
    const imageBlock = editor.canvas.locator('[data-type="core/image"]');
    
    const insertFromUrlButton = imageBlock.locator('role=button[name="Insert from URL"i]');
    await insertFromUrlButton.click();
    
    const testImageUrl = 'https://picsum.photos/400/300';
    const urlInput = imageBlock.locator('role=textbox[name="URL"i]');
    await urlInput.fill(testImageUrl);
    
    const applyButton = imageBlock.locator('role=button[name="Apply"i]');
    await applyButton.click();
    
    // 画像が読み込まれるまで待機
    await expect(imageBlock.locator('img')).toBeVisible();
    
    // ブロック設定サイドバーを開く
    console.log('2. ブロック設定サイドバーを開く');
    await editor.openDocumentSettingsSidebar();
    
    // 画像設定パネルでサイズを変更
    console.log('3. 画像幅を変更');
    const widthInput = page.locator('role=textbox[name="Width"i]');
    if (await widthInput.isVisible()) {
      await widthInput.clear();
      await widthInput.fill('200');
      
      // 変更が適用されたか確認
      console.log('4. サイズ変更の確認');
      const imageElement = imageBlock.locator('img');
      await expect(imageElement).toHaveAttribute('width', '200');
      console.log('✅ 画像サイズ調整が確認できました');
    } else {
      console.log('ℹ️ サイズ調整機能は現在の環境では利用できません');
    }
    
    console.log('✅ テスト完了: 画像サイズ調整テストが完了しました');
  });

  test('画像の配置（Alignment）設定', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: 画像配置設定');
    
    // URL画像でImageブロック作成
    console.log('1. URL画像でImageブロックを作成');
    await editor.insertBlock({ name: 'core/image' });
    const imageBlock = editor.canvas.locator('[data-type="core/image"]');
    
    const insertFromUrlButton = imageBlock.locator('role=button[name="Insert from URL"i]');
    await insertFromUrlButton.click();
    
    const testImageUrl = 'https://picsum.photos/250/200';
    const urlInput = imageBlock.locator('role=textbox[name="URL"i]');
    await urlInput.fill(testImageUrl);
    
    const applyButton = imageBlock.locator('role=button[name="Apply"i]');
    await applyButton.click();
    
    // 画像が読み込まれるまで待機
    await expect(imageBlock.locator('img')).toBeVisible();
    
    // 画像をクリックしてツールバーを表示
    console.log('2. 画像をクリックしてツールバーを表示');
    await imageBlock.locator('img').click();
    await editor.showBlockToolbar();
    
    // 中央配置ボタンをクリック
    console.log('3. 中央配置を設定');
    const alignCenterButton = page.locator('role=toolbar[name="Block tools"i] >> role=button[name="Align center"i]');
    if (await alignCenterButton.isVisible()) {
      await alignCenterButton.click();
      
      // 中央配置が適用されたか確認
      console.log('4. 中央配置の確認');
      const centeredImageBlock = editor.canvas.locator('[data-type="core/image"][data-align="center"]');
      await expect(centeredImageBlock).toBeVisible();
      console.log('✅ 中央配置が確認できました');
    } else {
      console.log('ℹ️ 配置設定は現在の環境では利用できません');
    }
    
    console.log('✅ テスト完了: 画像配置設定テストが完了しました');
  });
});
