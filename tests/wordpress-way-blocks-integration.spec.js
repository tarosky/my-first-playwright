/**
 * WordPress-way E2E テスト学習用
 * ブロック間操作と統合テスト
 */

// WordPress公式のE2Eユーティリティを使用
const { test, expect } = require('@wordpress/e2e-test-utils-playwright');

test.describe('WordPress-way学習: ブロック間操作・統合テスト', () => {
  test.beforeEach(async ({ admin }) => {
    console.log('🚀 新規投稿を作成してエディタを準備中...');
    await admin.createNewPost();
  });

  test('複数ブロックを組み合わせたブログ記事作成', async ({ 
    editor, 
    page,
    pageUtils 
  }) => {
    console.log('📝 テスト開始: ブログ記事作成フロー');
    
    // 記事タイトル設定
    console.log('1. 記事タイトルを設定');
    const titleField = page.locator('role=textbox[name="Add title"i]');
    await titleField.fill('WordPress-way学習：完全ガイド');
    
    // H1見出しブロック作成
    console.log('2. メイン見出しを作成');
    await editor.insertBlock({ 
      name: 'core/heading',
      attributes: { level: 1 }
    });
    await page.keyboard.type('WordPress Gutenbergエディタの基本');
    
    // 導入段落を追加
    console.log('3. 導入段落を追加');
    await page.keyboard.press('Enter');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('このガイドでは、WordPress Gutenbergエディタの基本的な使い方を学習します。');
    
    // H2見出しを追加
    console.log('4. セクション見出しを追加');
    await page.keyboard.press('Enter');
    await editor.insertBlock({ 
      name: 'core/heading',
      attributes: { level: 2 }
    });
    await page.keyboard.type('基本的なブロック操作');
    
    // 説明段落を追加
    console.log('5. 説明段落を追加');
    await page.keyboard.press('Enter');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('Gutenbergエディタでは、コンテンツをブロック単位で管理します。');
    
    // 画像ブロックを追加
    console.log('6. 画像ブロックを追加');
    await page.keyboard.press('Enter');
    await editor.insertBlock({ name: 'core/image' });
    
    const imageBlock = editor.canvas.locator('[data-type="core/image"]');
    const insertFromUrlButton = imageBlock.locator('role=button[name="Insert from URL"i]');
    await insertFromUrlButton.click();
    
    const urlInput = imageBlock.locator('role=textbox[name="URL"i]');
    await urlInput.fill('https://picsum.photos/600/400');
    
    const applyButton = imageBlock.locator('role=button[name="Apply"i]');
    await applyButton.click();
    
    // 画像にキャプションを追加
    await expect(imageBlock.locator('img')).toBeVisible();
    const captionPlaceholder = imageBlock.locator('role=textbox[name="Write caption…"i]');
    await captionPlaceholder.click();
    await page.keyboard.type('Gutenbergエディタの画面例');
    
    // H3見出しを追加
    console.log('7. サブセクション見出しを追加');
    await page.keyboard.press('Enter');
    await editor.insertBlock({ 
      name: 'core/heading',
      attributes: { level: 3 }
    });
    await page.keyboard.type('実践的なテクニック');
    
    // 最終段落を追加
    console.log('8. まとめ段落を追加');
    await page.keyboard.press('Enter');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('これらの基本操作をマスターすることで、効率的にコンテンツを作成できるようになります。');
    
    // 全体構造の確認
    console.log('9. 作成されたブログ記事構造を確認');
    const h1Elements = editor.canvas.locator('h1');
    const h2Elements = editor.canvas.locator('h2');
    const h3Elements = editor.canvas.locator('h3');
    const paragraphElements = editor.canvas.locator('[data-type="core/paragraph"]');
    const imageElements = editor.canvas.locator('[data-type="core/image"]');
    
    await expect(h1Elements).toHaveCount(1);
    await expect(h2Elements).toHaveCount(1);
    await expect(h3Elements).toHaveCount(1);
    await expect(paragraphElements).toHaveCount(3);
    await expect(imageElements).toHaveCount(1);
    
    console.log('✅ テスト完了: 完全なブログ記事が作成されました');
  });

  test('ブロックの移動と再配置', async ({ 
    editor, 
    page,
    pageUtils 
  }) => {
    console.log('📝 テスト開始: ブロック移動操作');
    
    // 複数のブロックを作成
    console.log('1. テスト用ブロック群を作成');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('最初の段落');
    
    await page.keyboard.press('Enter');
    await editor.insertBlock({ name: 'core/heading', attributes: { level: 2 } });
    await page.keyboard.type('見出し');
    
    await page.keyboard.press('Enter');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('最後の段落');
    
    // 最初のブロックを選択
    console.log('2. 最初の段落ブロックを選択');
    const firstParagraph = editor.canvas.locator('[data-type="core/paragraph"]').first();
    await firstParagraph.click();
    
    // ブロックツールバーを表示して移動ボタンをクリック
    console.log('3. ブロックを下に移動');
    await editor.showBlockToolbar();
    const moveDownButton = page.locator('role=toolbar[name="Block tools"i] >> role=button[name="Move down"i]');
    await moveDownButton.click();
    
    // 移動後の順序を確認
    console.log('4. ブロック順序の確認');
    const blocks = editor.canvas.locator('[data-block]');
    const secondBlock = blocks.nth(1);
    await expect(secondBlock).toContainText('最初の段落');
    
    console.log('✅ テスト完了: ブロック移動が正常に動作しました');
  });

  test('ブロックのコピー・ペースト・削除', async ({ 
    editor, 
    page,
    pageUtils 
  }) => {
    console.log('📝 テスト開始: ブロックコピー・ペースト・削除');
    
    // テスト用ブロックを作成
    console.log('1. テスト用段落ブロックを作成');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('コピー対象の段落です');
    
    // ブロックを選択してコピー
    console.log('2. ブロックをコピー');
    const paragraphBlock = editor.canvas.locator('[data-type="core/paragraph"]');
    await paragraphBlock.click();
    await pageUtils.pressKeys('primary+c');
    
    // 新しい位置でペースト
    console.log('3. ブロックをペースト');
    await page.keyboard.press('Enter');
    await pageUtils.pressKeys('primary+v');
    
    // コピーされたブロックの存在確認
    console.log('4. コピーされたブロックの確認');
    const paragraphBlocks = editor.canvas.locator('[data-type="core/paragraph"]');
    await expect(paragraphBlocks).toHaveCount(2);
    await expect(paragraphBlocks.nth(0)).toContainText('コピー対象の段落です');
    await expect(paragraphBlocks.nth(1)).toContainText('コピー対象の段落です');
    
    // 1つのブロックを削除
    console.log('5. ブロックを削除');
    await paragraphBlocks.nth(1).click();
    await pageUtils.pressKeys('Delete');
    
    // 削除後の確認
    await expect(paragraphBlocks).toHaveCount(1);
    
    console.log('✅ テスト完了: コピー・ペースト・削除が正常に動作しました');
  });

  test('ブロックの変換チェーン', async ({ 
    editor, 
    page 
  }) => {
    console.log('📝 テスト開始: ブロック変換チェーン');
    
    // Paragraphから開始
    console.log('1. Paragraphブロックを作成');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('変換されるテキスト');
    
    // Paragraphから見出しに変換
    console.log('2. ParagraphをHeadingに変換');
    await editor.showBlockToolbar();
    const transformButton = page.locator('role=toolbar[name="Block tools"i] >> role=button[name="Paragraph"]');
    await transformButton.click();
    
    const headingOption = page.locator('role=menuitem[name="Heading"]');
    await headingOption.click();
    
    // H2になったことを確認
    let currentBlock = editor.canvas.locator('[data-type="core/heading"]');
    await expect(currentBlock).toBeVisible();
    await expect(editor.canvas.locator('h2')).toContainText('変換されるテキスト');
    
    // HeadingからParagraphに戻す
    console.log('3. HeadingをParagraphに変換');
    await editor.showBlockToolbar();
    const headingTransformButton = page.locator('role=toolbar[name="Block tools"i] >> role=button[name="Heading"]');
    await headingTransformButton.click();
    
    const paragraphOption = page.locator('role=menuitem[name="Paragraph"]');
    await paragraphOption.click();
    
    // Paragraphに戻ったことを確認
    currentBlock = editor.canvas.locator('[data-type="core/paragraph"]');
    await expect(currentBlock).toBeVisible();
    await expect(currentBlock).toContainText('変換されるテキスト');
    
    console.log('✅ テスト完了: ブロック変換チェーンが正常に動作しました');
  });

  test('複数ブロック選択と一括操作', async ({ 
    editor, 
    page,
    pageUtils 
  }) => {
    console.log('📝 テスト開始: 複数ブロック選択と一括操作');
    
    // 複数ブロックを作成
    console.log('1. 複数のテストブロックを作成');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('最初の段落');
    
    await page.keyboard.press('Enter');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('二番目の段落');
    
    await page.keyboard.press('Enter');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('三番目の段落');
    
    // 最初のブロックをクリック
    console.log('2. 最初のブロックを選択');
    const firstBlock = editor.canvas.locator('[data-type="core/paragraph"]').first();
    await firstBlock.click();
    
    // Shiftキーを押しながら3番目のブロックをクリックして範囲選択
    console.log('3. Shift+クリックで複数ブロックを選択');
    const thirdBlock = editor.canvas.locator('[data-type="core/paragraph"]').nth(2);
    await page.keyboard.down('Shift');
    await thirdBlock.click();
    await page.keyboard.up('Shift');
    
    // 選択されたブロック数を確認（実際の実装では選択状態の確認方法が異なる場合があります）
    console.log('4. 複数ブロック選択状態の確認');
    // 注：実際のテストでは、選択状態の視覚的な確認やDOM属性の確認が必要
    
    // 複数選択状態でのDelete操作
    console.log('5. 選択された複数ブロックを削除');
    await pageUtils.pressKeys('Delete');
    
    // すべてのブロックが削除されたことを確認
    const remainingParagraphs = editor.canvas.locator('[data-type="core/paragraph"]');
    await expect(remainingParagraphs).toHaveCount(0);
    
    console.log('✅ テスト完了: 複数ブロック操作が正常に動作しました');
  });

  test('投稿全体の保存と公開フロー', async ({ 
    editor, 
    page,
    requestUtils 
  }) => {
    console.log('📝 テスト開始: 投稿保存・公開フロー');
    
    // 完全な記事を作成
    console.log('1. 完全な記事構造を作成');
    
    // タイトル設定
    const titleField = page.locator('role=textbox[name="Add title"i]');
    await titleField.fill('E2Eテスト投稿記事');
    
    // 本文コンテンツ作成
    await editor.insertBlock({ name: 'core/heading', attributes: { level: 1 } });
    await page.keyboard.type('テスト記事のメインタイトル');
    
    await page.keyboard.press('Enter');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('これはE2Eテストで作成された記事です。Gutenbergエディタの機能を確認しています。');
    
    await page.keyboard.press('Enter');
    await editor.insertBlock({ name: 'core/heading', attributes: { level: 2 } });
    await page.keyboard.type('テストの目的');
    
    await page.keyboard.press('Enter');
    await editor.insertBlock({ name: 'core/paragraph' });
    await page.keyboard.type('この記事は、WordPress-wayのE2Eテスト学習用に作成されました。');
    
    // 下書き保存
    console.log('2. 下書きとして保存');
    await editor.saveDraft();
    
    // 保存状態の確認
    const savedIndicator = page.locator('.editor-post-saved-state');
    await expect(savedIndicator).toContainText('Saved', { timeout: 10000 });
    
    // プレビュー確認（新しいタブが開くのでハンドリングに注意）
    console.log('3. プレビューを確認');
    const previewButton = page.locator('role=button[name="Preview"i]').first();
    if (await previewButton.isVisible()) {
      console.log('ℹ️ プレビュー機能が利用可能です');
    }
    
    // 投稿公開
    console.log('4. 投稿を公開');
    await editor.publishPost();
    
    // 公開成功の確認
    const publishedNotice = page.locator('.components-snackbar__content');
    await expect(publishedNotice).toContainText('published', { timeout: 15000 });
    
    // 投稿一覧で確認するために投稿リストに移動
    console.log('5. 投稿が正常に作成されたか投稿一覧で確認');
    await page.goto('/wp-admin/edit.php');
    
    // 作成した投稿がリストに表示されることを確認
    const postTitle = page.locator('a[aria-label="E2Eテスト投稿記事"]');
    await expect(postTitle).toBeVisible();
    
    console.log('✅ テスト完了: 投稿の作成・保存・公開が正常に完了しました');
  });
});
