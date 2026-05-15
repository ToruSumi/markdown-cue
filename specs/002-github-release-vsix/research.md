# Research: GitHub Release VSIX 自動ビルド

**Feature**: [spec.md](spec.md) | **Date**: 2026-05-15

## 1. GitHub Actions `release` イベントのトリガータイプ

### Decision: `published` を採用

### Rationale

- **`created`** は Draft リリースでは発火しない（GitHub 公式ドキュメントで明記）。当初 `created` を採用予定だったが、Draft でのテストを容易にするために再検討。
- **`published`** は以下の両方で発火する:
  - 非 Draft リリースを直接作成した場合
  - Draft リリースを公開（Publish）した場合
- Draft → Publish のワークフローを使えば、リリースノートを事前に下書きしてから公開でき、公開時に CI が走る。

### Alternatives Considered

| タイプ | 動作 | 却下理由 |
|--------|------|---------|
| `created` | Draft では発火しない | ユーザー要件（Draft テスト）を満たさない |
| `released` | Draft では発火しない | `published` とほぼ同等だが prerelease を除外する |
| `push: tags: ['v*']` | タグ push で発火 | Release アセット添付に追加ロジックが必要 |

## 2. `softprops/action-gh-release@v2` の動作

### Decision: `softprops/action-gh-release@v2` を使用してアセット添付

### Rationale

- `files` パラメータでグロブパターン指定可能（`*.vsix`）
- `GITHUB_TOKEN` はデフォルトで自動使用される（明示的な `env` 設定不要）
- `permissions: contents: write` のみで動作
- `overwrite_files: true` がデフォルトで有効（再実行時にアセット上書き可能）
- Release イベントでトリガーされた場合、対応する Release に自動的にアセットを添付

### Alternatives Considered

| 方法 | 却下理由 |
|------|---------|
| GitHub CLI (`gh release upload`) | Action の方がシンプルで宣言的 |
| `actions/upload-release-asset` | 公式だが deprecated 傾向、単一ファイルのみ |

## 3. `@vscode/vsce package` の CI 環境での動作

### Decision: `npx vsce package` をそのまま使用（追加フラグ不要）

### Rationale

- `package.json` に `repository` フィールドが既に存在するため `--allow-missing-repository` は不要
- `icon` フィールド未設定でも警告のみで VSIX は正常生成される
- `license` フィールドを追加することで警告を抑制（FR-010 対応）
- `vsce package` は publish と異なり PAT 不要（パッケージングのみ）
- CI 環境では対話的プロンプトは発生しない（`package` コマンドは非対話型）

### Alternatives Considered

| 方法 | 却下理由 |
|------|---------|
| `vsce package --allow-missing-repository` | `repository` フィールド存在のため不要 |
| `vsce package --skip-license` | `license` フィールドを追加する方が根本解決 |

## 4. GitHub Actions `permissions` 設定

### Decision: `permissions: contents: write` を設定

### Rationale

- Release アセットのアップロードには `contents: write` 権限が必要十分
- `discussions: write` は不要（Discussion 連携を使用しないため）
- ジョブレベルではなくワークフローレベルで設定し、最小権限の原則に従う

## 5. `@vscode/vsce` のバージョン固定

### Decision: `devDependencies` に `@vscode/vsce` を追加

### Rationale

- 現在の `build_extension.sh` では `npx @vscode/vsce package` で毎回最新をダウンロードしている
- CI の再現性を確保するため、`devDependencies` でバージョンを固定する
- `npx vsce package` は `devDependencies` にインストール済みの場合そこから使用する

## 6. `license` フィールド追加

### Decision: `package.json` に `"license": "MIT"` を追加し、`LICENSE` ファイルも配置

### Rationale

- `vsce package` 実行時に `license` フィールド未設定の警告を抑制
- MIT ライセンスは OSS 拡張機能で最も一般的
- `LICENSE` ファイルはリポジトリルートに配置（GitHub が自動認識）
