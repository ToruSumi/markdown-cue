# Data Model: GitHub Release VSIX 自動ビルド

**Feature**: [spec.md](spec.md) | **Date**: 2026-05-15

## Entities

### 1. CI Workflow (`release.yml`)

GitHub Actions ワークフロー定義。Release 公開イベントをトリガーとして VSIX ビルド・添付を自動実行する。

| 属性 | 型 | 説明 |
|------|------|------|
| name | string | ワークフロー表示名（`Build and Release Extension`） |
| trigger | event | `on: release: types: [published]` |
| permissions | map | `contents: write`（Release アセット添付に必要） |
| runner | string | `ubuntu-latest` |
| node_version | string | `20.x`（LTS） |

### 2. Workflow Job (`build-and-attach`)

単一ジョブ。すべてのステップを逐次実行する。

| ステップ | アクション | 説明 | 失敗時 |
|----------|-----------|------|--------|
| 1. Checkout | `actions/checkout@v4` | Release タグのコミットをチェックアウト | ジョブ中止 |
| 2. Setup Node.js | `actions/setup-node@v4` | Node.js 20.x をセットアップ | ジョブ中止 |
| 3. Install | `npm install` | 依存関係インストール | ジョブ中止 |
| 4. Test | `npm run test:unit` | ユニットテスト実行（品質ゲート） | ジョブ中止（VSIX 未ビルド） |
| 5. Package | `npx vsce package` | VSIX ファイル生成 | ジョブ中止 |
| 6. Attach | `softprops/action-gh-release@v2` | VSIX を Release アセットに添付 | ジョブ中止 |

### 3. VSIX File

`vsce package` により生成されるパッケージファイル。

| 属性 | 値 | 説明 |
|------|------|------|
| ファイル名 | `markdown-cue-{version}.vsix` | `name` + `version` から自動命名 |
| 含まれるもの | `out/`, `package.json`, `README.md`, `LICENSE` | `.vscodeignore` で制御 |
| 除外されるもの | `src/`, `test/`, `specs/`, `.specify/`, `*.ts`, `*.map` | `.vscodeignore` で定義済み |

### 4. package.json Changes

| フィールド | 現在値 | 変更後 | 理由 |
|-----------|--------|--------|------|
| `license` | （なし） | `"MIT"` | vsce 警告抑制（FR-010） |
| `devDependencies.@vscode/vsce` | （なし） | `^3.x` | CI バージョン固定（FR-006） |

## Entity Relationships

```
Release Event (published)
    │
    ▼
CI Workflow (release.yml)
    │
    ├── Step 1-3: Setup
    ├── Step 4: Test (品質ゲート) ──失敗──▶ 中止
    ├── Step 5: vsce package ──▶ VSIX File
    └── Step 6: Upload ──▶ Release Asset
```

## Validation Rules

- ステップ 4（テスト）が失敗した場合、以降のステップは実行されない（GitHub Actions のデフォルト動作）
- `vsce package` は `package.json` の `name` と `version` からファイル名を決定する
- `softprops/action-gh-release` は `*.vsix` グロブでファイルを検出し、トリガー元の Release に添付する

## State Transitions

```
Release Draft ──(Publish)──▶ Release Published ──(CI trigger)──▶ CI Running
    │                                                               │
    │                                                    ┌──────────┴──────────┐
    │                                                    ▼                     ▼
    │                                              Test Pass              Test Fail
    │                                                    │                     │
    │                                                    ▼                     ▼
    │                                             VSIX Built            Job Aborted
    │                                                    │              (No Asset)
    │                                                    ▼
    │                                             Asset Attached
    │                                                    │
    └────────────────────────────────────────────────────▼
                                                  Release with VSIX
```
