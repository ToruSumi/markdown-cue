# Workflow Contract: GitHub Release VSIX 自動ビルド

**Feature**: [spec.md](../spec.md) | **Date**: 2026-05-15

## 1. Trigger Contract

| 項目 | 値 |
|------|------|
| イベント | `release` |
| タイプ | `published` |
| 発火条件 | Release が公開された時（Draft → Publish、または非 Draft の直接作成） |
| 非発火条件 | Draft 保存のみ、Release 編集、Release 削除 |
| チェックアウト対象 | Release タグが指すコミット（GitHub Actions デフォルト） |

## 2. Input Contract

| 入力 | ソース | 説明 |
|------|--------|------|
| ソースコード | `actions/checkout@v4` | Release タグのコミットをチェックアウト |
| Node.js | `actions/setup-node@v4` | バージョン `20.x` |
| npm 依存関係 | `npm install` | `package.json` + `package-lock.json` に基づく |
| `GITHUB_TOKEN` | GitHub 自動提供 | Release アセット添付用（PAT 不要） |

## 3. Output Contract

### 成功時

| 出力 | 形式 | 説明 |
|------|------|------|
| VSIX ファイル | `markdown-cue-{version}.vsix` | Release アセットとして添付済み |
| ワークフローステータス | `success` | 全ステップ成功 |

### 失敗時

| 失敗ステップ | 出力 | VSIX | Release アセット |
|-------------|------|------|-----------------|
| Checkout | エラーログ | 未生成 | なし |
| npm install | エラーログ | 未生成 | なし |
| npm test | テスト失敗ログ | 未生成 | なし |
| vsce package | パッケージングエラー | 未生成 | なし |
| Asset upload | アップロードエラー | 生成済み | なし |

## 4. Permissions Contract

```yaml
permissions:
  contents: write
```

- `contents: write`: Release アセットのアップロードに必要
- 追加のシークレットや PAT は不要

## 5. Quality Gate Contract

| ゲート | ステップ | 条件 | 失敗時の動作 |
|--------|---------|------|-------------|
| テストゲート | `npm run test:unit` | 全テスト pass（exit code 0） | ジョブ中止、VSIX 未ビルド |

## 6. File Pattern Contract

| パターン | 用途 | 対象 |
|---------|------|------|
| `*.vsix` | `softprops/action-gh-release` の `files` パラメータ | ワークスペースルートの VSIX ファイル |

## 7. Version Naming Contract

| 要素 | ソース | 例 |
|------|--------|------|
| 拡張機能名 | `package.json` の `name` | `markdown-cue` |
| バージョン | `package.json` の `version` | `1.0.0` |
| VSIX ファイル名 | `{name}-{version}.vsix` | `markdown-cue-1.0.0.vsix` |
| Release タグ名 | 開発者が手動設定（推奨形式） | `v1.0.0` |
