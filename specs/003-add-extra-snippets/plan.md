# Implementation Plan: Additional Markdown Snippets

**Branch**: `003-add-extra-snippets` | **Date**: 2026-05-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-add-extra-snippets/spec.md`

## Summary

既存の Markdown 補完機能に、下線と折りたたみの 2 つの snippet を追加する。実装は既存の共有 snippet カタログを拡張し、補完候補一覧とコマンド Quick Pick の両方へ同時反映する。複数行の折りたたみテンプレートは実改行のまま扱い、既存候補の順序と挙動を変えない回帰防止テストを追加する。

## Technical Context

**Language/Version**: TypeScript 5.8.x, VS Code API 1.85+

**Primary Dependencies**: VS Code Extension API, Mocha, TypeScript, 既存の共有 snippet 定義

**Storage**: N/A

**Testing**: `npm test` (`pretest` で TypeScript compile 後、Mocha unit tests 実行)

**Target Platform**: VS Code desktop extension on Markdown files, offline-capable local runtime

**Project Type**: VS Code extension

**Performance Goals**: 既存の静的候補一覧生成と同等の即時応答を維持し、補完表示に体感遅延を追加しない

**Constraints**: 外部通信なし、新規依存なし、既存候補の sort order と挿入内容を維持、折りたたみ snippet は実改行を保持

**Scale/Scope**: 2 件の snippet 追加、関連する共有一覧ロジックの更新、単体テスト拡張、3〜5 ファイル程度の小規模変更

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. VS Code Extension Scope First**: PASS。変更対象は Markdown 用の補完候補と挿入コマンドのみで、拡張機能のユーザー可視機能に直接対応する。
- **II. Least-Communication by Default**: PASS。snippet 追加はローカルデータ定義のみで完結し、新たな通信経路は発生しない。
- **III. Minimum Mandatory Testing**: PASS。主要経路として新規候補の挿入内容を、境界条件として複数行 snippet の実改行保持を自動テストで担保する。
- **IV. Secure Implementation Baseline**: PASS。静的文字列定義の追加のみで、入力処理・ファイル操作・コマンド実行の権限や依存関係を増やさない。
- **V. Simplicity and Reviewability**: PASS。既存の `completionSnippets` 一元管理を拡張するだけで、追加抽象化は不要。

## Project Structure

### Documentation (this feature)

```text
specs/003-add-extra-snippets/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── snippet-catalog-contract.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── completionProvider.ts    # 共有 snippet から補完候補を生成
├── insertSyntaxCommand.ts   # 共有 snippet から Quick Pick 項目を生成
└── snippets.ts              # 変更対象: snippet カタログ定義

test/
└── suite/
    ├── completionProvider.test.ts   # 変更対象: 補完候補への反映確認
    └── snippets.test.ts             # 変更対象: snippet 内容と順序の回帰確認
```

**Structure Decision**: 既存の単一拡張構成を維持し、共有 snippet カタログを唯一の変更起点とする。補完とコマンドの両導線は既存の共有データ参照を再利用するため、新規モジュールは追加しない。

## Phase 0: Research Plan and Outcomes

### Design Questions

- 新規 2 項目をどこに追加すると既存 sort order を壊さず自然な一覧順を保てるか
- 複数行の折りたたみ snippet を `SnippetString` で扱う際、実改行をどう保持するか
- 補完候補一覧と Quick Pick の両方へ反映する最小変更点はどこか
- 回帰防止に必要な最小テストセットは何か

### Consolidated Decisions

See [research.md](research.md) for full details.

## Phase 1: Design and Contracts

- `data-model.md`: 共有 snippet エントリと挿入導線の関係、順序制約、検証ルールを定義
- `contracts/snippet-catalog-contract.md`: ユーザーが観測する候補一覧と Quick Pick 一覧の契約を定義
- `quickstart.md`: ローカルでの手動スモークテスト手順を定義
- `.github/copilot-instructions.md`: 現在の plan 参照を `specs/003-add-extra-snippets/plan.md` に更新

## Post-Design Constitution Check

- **I. VS Code Extension Scope First**: PASS。設計成果物は snippet 追加の extension surface に限定されている。
- **II. Least-Communication by Default**: PASS。contract と quickstart を含めても通信経路は追加されない。
- **III. Minimum Mandatory Testing**: PASS。設計段階で snippets と completion provider の 2 系統テスト追加対象を明示した。
- **IV. Secure Implementation Baseline**: PASS。新規依存や権限変更を伴わない実装方針を維持している。
- **V. Simplicity and Reviewability**: PASS。共有カタログ更新と既存ユニットテスト補強に責務を限定している。
