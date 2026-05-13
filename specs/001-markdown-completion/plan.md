# Implementation Plan: Markdown Completion Provider

**Branch**: `001-markdown-completion` | **Date**: 2026-05-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-markdown-completion/spec.md`

## Summary

VS Code 拡張機能として Markdown 向け CompletionItemProvider を実装し、トリガー文字 `;` の入力時にタブストップ付きスニペットで Markdown 記法を挿入できるようにする。コードブロック・インラインコード・YAML front matter 内での補完抑制、およびコマンドパレットからの Quick Pick 挿入を提供する。外部通信は一切行わない。

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: `@types/vscode` (VS Code Extension API, ^1.85.0)。ランタイム依存は vscode API のみ。追加の npm パッケージは使用しない

**Storage**: N/A（状態やデータの永続化は不要）

**Testing**: VS Code Extension Test Runner (`@vscode/test-electron`) + Mocha。ユニットテストは直接実行可能な純関数テスト

**Target Platform**: VS Code 1.85+ (Windows / macOS / Linux)

**Project Type**: VS Code Extension

**Performance Goals**: 補完候補の返却は同期的（候補定義は静的配列）で体感遅延なし

**Constraints**: 完全オフライン動作。外部ネットワーク接続なし。ランタイム依存ライブラリなし

**Scale/Scope**: 補完候補 10〜15 種。単一ファイル拡張（小規模）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Extension Scope Gate**: ✅ PASS — CompletionItemProvider、コマンド登録、Quick Pick はすべて VS Code 拡張 API の直接利用であり、拡張の製品機能そのもの
- **Communication Gate**: ✅ PASS — 外部通信パスなし（SCON-001〜003）。ネットワーク接続を一切行わない
- **Security Gate**: ✅ PASS — ユーザー入力はカーソル位置テキストの読み取りのみ。ファイル書き込み・コマンド実行・外部プロセス起動なし。追加依存ライブラリなし
- **Testing Gate**: ✅ PASS — プライマリパステスト（候補返却）+ 境界条件テスト（コードブロック内抑制）を必須テストとして計画（SCON-004）
- **Simplicity Gate**: ✅ PASS — 静的スニペット配列 + 行テキスト走査による文脈判定。Markdown パーサや AST 解析は不使用

## Project Structure

### Documentation (this feature)

```text
specs/001-markdown-completion/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── extension.ts         # activate/deactivate, provider & command registration
├── completionProvider.ts # CompletionItemProvider implementation
├── snippets.ts          # Snippet definitions (localizable structure)
├── contextDetector.ts   # Code block / front matter / inline code detection
└── insertSyntaxCommand.ts # Quick Pick command implementation

test/
├── suite/
│   ├── completionProvider.test.ts  # Primary path + filtering tests
│   ├── contextDetector.test.ts     # Code block / front matter boundary tests
│   └── snippets.test.ts            # Snippet integrity tests
└── runTest.ts           # Test runner entry point
```

**Structure Decision**: VS Code Extension の標準的な単一プロジェクト構成を採用。`src/` 配下にソース、`test/` 配下にテストを配置。機能ごとにファイルを分離し、各ファイルが単一責務を持つ構成とする。

## Complexity Tracking

> No constitution violations detected. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
