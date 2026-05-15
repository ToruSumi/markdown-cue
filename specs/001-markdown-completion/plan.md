# Implementation Plan: Markdown Completion Provider

**Branch**: `001-markdown-completion` | **Date**: 2026-05-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-markdown-completion/spec.md`

## Summary

VS Code 拡張として Markdown 向け CompletionItemProvider を提供し、トリガー文字 `;` で主要記法を SnippetString として挿入する。補完抑制（フェンスドコード、インラインコード、YAML front matter）と Quick Pick 挿入を同時に実現する。今回の仕様では既存候補に加え、取り消し線、チェックボックス、数式ブロック（複数行）を追加し、`sortText` は FR-010 の固定順に一致させる。

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: `@types/vscode` (^1.85.0), `typescript`, `mocha`, `@types/mocha`

**Storage**: N/A（永続化なし）

**Testing**: `npm run test:unit`（Mocha） + `npm run compile`

**Target Platform**: VS Code 1.85+（Windows/macOS/Linux）

**Project Type**: VS Code Extension

**Performance Goals**: 補完候補は静的配列走査で同期返却し、体感遅延を生じさせない

**Constraints**: 完全オフライン、外部通信なし、依存最小、複数行候補は実改行を維持

**Scale/Scope**: 候補数 15 前後の小規模拡張

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. VS Code Extension Scope First**: PASS。変更対象は補完・コマンド・スニペット定義とテストに限定。
- **II. Least-Communication by Default**: PASS。外部通信機能を導入しない。
- **III. Minimum Mandatory Testing**: PASS。プライマリパス（トリガー補完）と境界条件（抑制文脈、実改行）をテスト対象化。
- **IV. Secure Implementation Baseline**: PASS。外部プロセス実行・危険な入出力・高リスク依存追加なし。
- **V. Simplicity and Reviewability**: PASS。`src/snippets.ts` 中心の最小変更で反映。

## Project Structure

### Documentation (this feature)

```text
specs/001-markdown-completion/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── extension-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── extension.ts
├── completionProvider.ts
├── snippets.ts
├── contextDetector.ts
└── insertSyntaxCommand.ts

test/
├── runTest.ts
└── suite/
    ├── completionProvider.test.ts
    ├── contextDetector.test.ts
    ├── snippets.test.ts
    └── index.ts
```

**Structure Decision**: 既存単一プロジェクト構成を維持し、補完候補データを `src/snippets.ts` に集約して補完経路とコマンド経路で共用する。

## Phase 0: Research Plan and Outcomes

### Unknowns and Research Tasks

- トリガー入力列の安全置換方法
- コード文脈抑制の軽量判定戦略
- ローカライズ可能性を損なわない候補定義形式
- 新規3記法（取り消し線、チェックボックス、数式ブロック）の挿入形式
- FR-010 固定順を実装・テストに落とす方法

### Consolidated Decisions

- `CompletionItem.range` を用いて `;` からカーソルまでを置換する。
- 文脈判定はテキスト走査ベースで実装し、Markdown パーサ依存を追加しない。
- `CompletionSnippet` 配列に label/detail/documentation/snippet/sort/filter/icon を集約する。
- 追加候補は `~~${1:text}~~`, `- [ ] ${1:text}`, `$$\n${1:AA}\n$$` を採用する。
- 並び順は spec FR-010 の固定順と `sortOrder` を一致させる。

## Phase 1: Design and Contracts

- `research.md`: 上記決定を明文化し、代替案と却下理由を記録する（更新済み）。
- `data-model.md`: `CompletionSnippet.icon` 必須、複数行候補の実改行ルール、追加3記法フォーマットを保持する（更新済み）。
- `contracts/extension-contract.md`: activationEvents は `onLanguage:markdown` + `onCommand:markdown-cue.insertSyntax`、候補網羅を契約化する（更新済み）。
- `quickstart.md`: `;strike`, `;check`, `;math` とコマンド経路のスモークテスト手順を記載する（更新済み）。

### Agent Context Update

- `.github/copilot-instructions.md` の SPECKIT 参照先は `specs/001-markdown-completion/plan.md` を指しており、現状のままで整合している。
- リポジトリには自動更新用の `update-agent-context` スクリプトが存在しないため、参照先整合を手動確認で満たす。

### Post-Design Constitution Re-check

- **I** PASS: すべて拡張機能の直接価値に紐づく。
- **II** PASS: 通信機能追加なし。
- **III** PASS: 最小必須テスト（主要経路 + 境界条件）を計画済み。
- **IV** PASS: セキュア基準に反する要素なし。
- **V** PASS: データ追加中心で実装の単純性を維持。

## Phase 2 Handoff

- 実装主体は `src/snippets.ts` の候補追加と `sortOrder` 固定順整合。
- テスト主体は `test/suite/snippets.test.ts` と `test/suite/completionProvider.test.ts`。
- 受け入れ確認は補完経路とコマンド経路双方で行う。

## Complexity Tracking

> No constitution violations detected.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
