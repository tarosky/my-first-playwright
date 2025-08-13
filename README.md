


# Playwright 基本テスト手順

## 1. 前提条件（Node.js の確認）
Playwright を利用するには Node.js が必要です。以下のコマンドでインストール済みか確認してください。
```bash
node --version
npm --version
```
インストールされていない場合は [Node.js 公式サイト](https://nodejs.org/ja/) からインストールしてください。

## 2. プロジェクト作成とインストール
新しいディレクトリを作成し、Playwright をインストールします。
```bash
mkdir my-first-playwright
cd my-first-playwright
npm init -y
npx playwright install
```
Playwright のテストランナーを追加する場合は以下を実行します:
```bash
npx playwright install
npm install -D @playwright/test
```

## 3. ブラウザのインストール
Playwright でサポートされているブラウザ（Chromium, Firefox, WebKit）をインストールします。
```bash
npx playwright install
```

## 4. サンプルテスト作成
`tests` フォルダを作成し、`example.spec.js` というファイルを作成します。
```javascript
// tests/example.spec.js
const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

## 5. テスト実行
以下のコマンドでテストを実行します。
```bash
npx playwright test
```

## 6. UIモードでの実行方法
テスト結果やテストの進行をGUIで確認したい場合は、UIモードを利用できます:
```bash
npx playwright test --ui
```

## 7. 学習用テストケース

### Web操作学習テスト（web-operations-test.spec.js）
Playwright公式サイトを使用して、実際のWebサイト操作を学習できるテストです。Bot検出を回避し、安定したテスト環境で学習できます。

#### 学習内容：

**基本的なブラウザ操作**
- `page.goto()`: ページナビゲーション
- `page.click()`: 要素のクリック操作
- `expect(page).toHaveTitle()`: ページタイトルの検証
- `expect(page).toHaveURL()`: URLの変更確認

**要素の選択と操作**
- `page.locator()`: 要素の特定
- CSS セレクター、テキストベース、属性ベースでの要素選択
- `locator.first()`: 複数マッチする要素から最初の要素を選択
- `locator.count()`: 要素の個数取得
- `locator.getAttribute()`: 要素の属性値取得

**DOM解析とテキスト抽出**
- `page.textContent()`: ページ内容の取得
- `locator.textContent()`: 特定要素のテキスト取得
- `expect().toContain()`: テキストの検証
- `expect().toBeVisible()`: 要素の表示確認
- `expect().toBeGreaterThan()`: 数値の比較

**Strict Mode Violationの対処**
- 複数の要素がマッチする場合の適切な対処方法
- `.first()`、`.last()`、`.nth()`の使い方

#### テストケース：
1. **ナビゲーションとクリック操作**: ページ遷移、リンククリック、URL確認
2. **セレクターとテキスト抽出**: 様々なセレクター方法、属性取得、要素カウント
3. **複雑なDOM操作**: ナビゲーション要素の確認、ページ内容の検証

#### 実行方法：
```bash
# 特定のテストファイルのみ実行
npx playwright test web-operations-test.spec.js

# ブラウザを表示しながら実行（デバッグ用）
npx playwright test web-operations-test.spec.js --headed

# UIモードで実行
npx playwright test web-operations-test.spec.js --ui

# 詳細出力で実行
npx playwright test web-operations-test.spec.js --reporter=line
```

#### 学習のポイント：
- **実際のWebサイト**: Playwright公式サイトを使用するため、現実的なテスト環境
- **Bot検出対策**: Google検索などのBot検出を回避した安定したテスト
- **段階的学習**: 基本操作から複雑なDOM操作まで段階的に学習
- **エラー対処**: Strict Mode Violationなど実際に遭遇する問題の解決方法

## 8. WordPress E2Eテスト環境

### WordPress環境のセットアップ
このリポジトリでは、`@wordpress/env`を使用してローカルWordPress環境でのE2Eテストが可能です。

#### 必要な条件
- Docker Desktop がインストールされている
- Node.js と npm が利用可能

#### WordPress環境の管理
```bash
# WordPress環境を起動
npm run wp-env:start

# WordPress環境を停止
npm run wp-env:stop

# WordPress環境をクリーンアップ
npm run wp-env:clean

# WordPress環境をリセット（クリーン＋起動）
npm run wp-env:reset
```

#### アクセス情報
- **フロントエンド**: http://localhost:8080
- **管理画面**: http://localhost:8080/wp-admin
- **テスト環境**: http://localhost:8081
- **ログイン情報**: 
  - ユーザー名: `admin`
  - パスワード: `password`

#### WordPressテストの実行
```bash
# WordPress E2Eテストを実行
npm run test:wordpress

# 特定のWordPressテストを実行
npx playwright test tests/wordpress.spec.js --grep "基本アクセステスト"
```

#### WordPress テストケース
- **基本アクセステスト**: サイトの表示、WordPressバージョン確認
- **管理画面アクセス**: ログインページの表示確認
- **管理画面ログイン**: 管理者としてのログイン機能
- **新規投稿作成**: 投稿エディタへのアクセスと基本操作
- **フロントエンド表示**: テーマとナビゲーション要素の確認

## 9. WordPress-way E2E テスト学習

### WordPress公式E2Eテスト手法の学習
このリポジトリでは、WordPress Gutenbergプロジェクトで使用されている公式のE2Eテスト手法を学習できます。`@wordpress/e2e-test-utils-playwright`パッケージを使用して、WordPressコミュニティ標準のテスト技法を習得できます。

#### 学習用テストファイル

**`tests/wordpress-way-paragraph.spec.js`** - Paragraphブロック学習
- ブロック挿入の基本操作
- テキスト入力とHTML要素確認
- 書式設定（太字、イタリック）
- ブロック変換機能
- 複数ブロック操作
- 投稿保存・公開フロー

**`tests/wordpress-way-heading.spec.js`** - Headingブロック学習
- 見出しレベル変更（H1-H6）
- デフォルトレベル確認
- 書式設定（太字+イタリック）
- Markdown記法での自動変換
- HTMLアンカー設定
- 文書構造の作成

**`tests/wordpress-way-image.spec.js`** - Imageブロック学習
- 基本的な画像ブロック挿入
- URL画像での作成
- キャプション設定
- 代替テキスト（Alt text）設定
- リンク設定
- サイズ調整
- 配置（Alignment）設定

**`tests/wordpress-way-blocks-integration.spec.js`** - 統合テスト学習
- 複数ブロックを組み合わせたブログ記事作成
- ブロックの移動と再配置
- ブロックのコピー・ペースト・削除
- ブロック変換チェーン
- 複数ブロック選択と一括操作
- 投稿全体の保存・公開フロー

#### WordPress E2Eユーティリティの活用

**主要フィクスチャ:**
- `admin`: WordPress管理画面操作（`admin.createNewPost()`など）
- `editor`: ブロックエディタ操作（`editor.insertBlock()`, `editor.canvas`など）
- `pageUtils`: キーボード操作（`pageUtils.pressKeys()`など）
- `requestUtils`: REST API操作（`requestUtils.deleteAllMedia()`など）

**WordPress特有のテストパターン:**
```javascript
// WordPress-way標準パターン
const { test, expect } = require('@wordpress/e2e-test-utils-playwright');

test.describe('Block Name', () => {
  test.beforeEach(async ({ admin }) => {
    await admin.createNewPost(); // 新規投稿作成
  });

  test('テスト名', async ({ editor, page }) => {
    await editor.insertBlock({ name: 'core/paragraph' });
    // editor.canvas でiframe内の操作
    const block = editor.canvas.locator('[data-type="core/paragraph"]');
    await expect(block).toBeVisible();
  });
});
```

#### 実行方法

**WordPress環境の準備:**
```bash
# WordPress環境を起動（初回のみ）
npm run wp-env:start

# WordPress-way学習用テストを実行
npx playwright test --config=playwright.config.js --project=wordpress-e2e

# 特定の学習テストを実行
npx playwright test wordpress-way-paragraph.spec.js
npx playwright test wordpress-way-heading.spec.js
npx playwright test wordpress-way-image.spec.js
npx playwright test wordpress-way-blocks-integration.spec.js

# ブラウザを表示しながら実行（学習に最適）
npx playwright test wordpress-way-paragraph.spec.js --headed

# UIモードで実行（インタラクティブ学習）
npx playwright test wordpress-way-paragraph.spec.js --ui
```

#### 学習のポイント

**1. WordPress公式手法の習得**
- Gutenberg開発チームと同じテスト手法
- WordPressコミュニティ標準のベストプラクティス
- 実際のWordPressプロジェクトで使用される実用的なテスト技法

**2. ブロックエディタ特化操作**
- `editor.canvas`によるiframe内操作
- ブロック挿入・変換・削除の標準パターン
- WordPress REST APIとの連携

**3. 段階的学習構成**
- 基本ブロック → 応用ブロック → 統合操作の順序
- 各テストで詳細なコンソール出力による学習支援
- 実用的なブログ記事作成フローの習得

**4. 現実的なテストシナリオ**
- 実際のWordPress利用シーンに基づくテストケース
- エラー処理やエッジケースの対処法
- パフォーマンスを考慮したテスト設計

## 10. 参考リンク
- [Playwright 公式ドキュメント](https://playwright.dev/)
- [Playwright Getting Started（英語）](https://playwright.dev/docs/intro)
- [WordPress Environment (@wordpress/env)](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/)
- [WordPress E2E Test Utils Playwright](https://www.npmjs.com/package/@wordpress/e2e-test-utils-playwright)
- [WordPress Gutenberg E2E Tests](https://github.com/WordPress/gutenberg/tree/trunk/test/e2e)
