# Quickstart: GitHub Release VSIX 自動ビルド

**Feature**: [spec.md](spec.md) | **Date**: 2026-05-15

## スモークテスト手順

### 前提条件

- `.github/workflows/release.yml` が master ブランチにマージ済み
- `package.json` に `license` フィールドと `@vscode/vsce` devDependency が追加済み

### テスト 1: Release 公開で VSIX が自動ビルド・添付される

1. GitHub リポジトリの Release ページを開く
2. 「Draft a new release」をクリック
3. タグ名に `v{package.json の version}` を入力（例: `v0.0.3`）
4. Target は `master` を選択
5. リリースタイトルとノートを記入
6. 「Publish release」をクリック（※ Draft として保存ではなく公開する）
7. リポジトリの Actions タブを確認 → ワークフローが実行されていることを確認
8. ワークフロー完了後、Release ページに戻る
9. Assets セクションに `markdown-cue-{version}.vsix` が表示されていることを確認

**期待結果**: Release アセットに VSIX ファイルが添付されている

### テスト 2: ダウンロードした VSIX のインストール確認

1. Release ページから `markdown-cue-{version}.vsix` をダウンロード
2. ターミナルで以下を実行:
   ```bash
   code --install-extension markdown-cue-{version}.vsix
   ```
3. VS Code で Markdown ファイルを開く
4. `;` を入力して補完候補が表示されることを確認

**期待結果**: 拡張機能が正常にインストールされ、トリガー補完が動作する

### テスト 3: Draft → Publish フローの確認

1. GitHub リポジトリの Release ページで「Draft a new release」をクリック
2. タグ・タイトル・ノートを設定
3. 「Save draft」をクリック（Draft として保存）
4. Actions タブを確認 → ワークフローが実行されていないことを確認
5. Draft Release を開き「Publish release」をクリック
6. Actions タブを確認 → ワークフローが実行されることを確認

**期待結果**: Draft 保存時は CI 未実行、Publish 時に CI が実行される

### テスト 4: テスト失敗時のガード確認（任意）

1. テストが失敗するコードを意図的にコミット
2. Release を作成・公開
3. Actions タブでワークフローが失敗し、テストステップで止まることを確認
4. Release ページに VSIX が添付されていないことを確認

**期待結果**: テスト失敗時は VSIX が Release に添付されない
