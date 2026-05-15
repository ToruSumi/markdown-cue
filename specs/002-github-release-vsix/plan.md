# Implementation Plan: GitHub Release VSIX 自動ビルド

**Branch**: `002-github-release-vsix` | **Date**: 2026-05-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-github-release-vsix/spec.md`

## Summary

GitHub UI から Release を作成した際に GitHub Actions が自動トリガーされ、テスト実行→ VSIX パッケージング→ Release アセット添付を行う CI ワークフローを構築する。配布は GitHub Release 経由のみ（Marketplace 公開なし）。バージョンは手動管理、認証は `GITHUB_TOKEN` のみで PAT 不要。

## Technical Context

**Language/Version**: YAML (GitHub Actions workflow), TypeScript 5.x (既存拡張)

**Primary Dependencies**: `@vscode/vsce` (VSIX パッケージング), `softprops/action-gh-release@v2` (Release アセット添付), `actions/checkout@v4`, `actions/setup-node@v4`

**Storage**: N/A

**Testing**: `npm run test:unit`（Mocha ユニットテスト、CI 上で品質ゲートとして実行）

**Target Platform**: GitHub Actions `ubuntu-latest` ランナー

**Project Type**: VS Code Extension（CI/CD パイプライン追加）

**Performance Goals**: Release 作成から VSIX アセット添付完了まで 5 分以内

**Constraints**: PAT 不要（`GITHUB_TOKEN` のみ）、Marketplace 公開なし、完全自動（手動介入不要）

**Scale/Scope**: 単一ワークフロー YAML、package.json 微修正、README 追記

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. VS Code Extension Scope First**: PASS。CI ワークフローは拡張機能のパッケージング・配布を直接支援する拡張開発者ワークフローに該当する。
- **II. Least-Communication by Default**: PASS。CI の外部通信は npm レジストリ（依存インストール）と GitHub API（アセット添付）のみ。いずれも CI 環境で必須かつ最小限。Marketplace 公開は行わない。
- **III. Minimum Mandatory Testing**: PASS。CI 内でユニットテストを品質ゲートとして実行する。テスト失敗時は VSIX ビルド・添付を中止。
- **IV. Secure Implementation Baseline**: PASS。認証は GitHub 自動提供の `GITHUB_TOKEN` のみ。PAT やシークレットのハードコーディングなし。permissions は `contents: write` に最小限設定。
- **V. Simplicity and Reviewability**: PASS。単一の YAML ファイルで完結。既存の `build_extension.sh` の手順を踏襲したシンプルな構成。

## Project Structure

### Documentation (this feature)

```text
specs/002-github-release-vsix/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── workflow-contract.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
.github/
└── workflows/
    └── release.yml      # 新規: Release トリガー CI ワークフロー

package.json             # 変更: license 追加, @vscode/vsce を devDependencies に追加
README.md                # 変更: インストール手順・リリース手順を追記
build_extension.sh       # 変更なし（参考用）
.vscodeignore            # 変更なし
```

**Structure Decision**: 既存の単一プロジェクト構成を維持。`.github/workflows/` に CI ワークフロー YAML を1ファイル追加するのみ。

## Phase 0: Research Plan and Outcomes

### Unknowns and Research Tasks

- GitHub Actions `release` イベントの `created` タイプの詳細動作（Draft 含む挙動）
- `softprops/action-gh-release` のファイルグロブ・権限・既存アセット処理
- `@vscode/vsce package` の CI 環境での動作とフラグ要否
- `vsce package` 時の `license` / `icon` 未設定警告の抑制方法
- GitHub Actions の `permissions` 設定と `GITHUB_TOKEN` のスコープ

### Consolidated Decisions

See [research.md](research.md) for full details.

## Phase 1: Design and Contracts

- `data-model.md`: CI ワークフローの構成要素（ジョブ、ステップ、トリガー、権限）を構造化
- `contracts/workflow-contract.md`: ワークフローのトリガー条件、入出力、成功・失敗条件の契約
- `quickstart.md`: ワークフロー動作確認のスモークテスト手順
