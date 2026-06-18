# Research: Additional Markdown Snippets

**Feature**: [spec.md](spec.md) | **Date**: 2026-05-21

## 1. snippet 定義の追加位置

### Decision: 既存の `completionSnippets` 配列に 2 項目を追加し、既存配列を単一のソースとし続ける

### Rationale

- 補完候補一覧は [src/completionProvider.ts](../../src/completionProvider.ts) で `completionSnippets` を直接参照している。
- コマンド Quick Pick は [src/insertSyntaxCommand.ts](../../src/insertSyntaxCommand.ts) の `buildSyntaxQuickPickItems` で同じ配列から派生している。
- 共有配列を拡張すれば 2 つの挿入導線へ同時反映でき、二重定義を避けられる。

### Alternatives Considered

| 代替案 | 却下理由 |
|--------|---------|
| 補完用と Quick Pick 用に別配列を持つ | 表示差分と回帰の温床になり、単純な追加変更に対して不必要に複雑 |
| 新規 snippet 専用ファイルを作る | 2 件の追加では責務分割の価値が薄く、一覧のレビュー性が下がる |

## 2. 並び順の扱い

### Decision: 既存候補の順序を維持したまま、新規項目を末尾に追加する

### Rationale

- 現在の順序は [src/snippets.ts](../../src/snippets.ts) の `sortOrder` と [test/suite/snippets.test.ts](../../test/suite/snippets.test.ts) で固定化されている。
- spec の FR-008 は既存候補の表示順を変えないことを要求している。
- 末尾追加であれば既存キーの sort order を変更せずに要件を満たせる。

### Alternatives Considered

| 代替案 | 却下理由 |
|--------|---------|
| HTML 系 snippet を既存候補の途中へ再配置する | 既存順序の変更になり、不要な UI 回帰を招く |
| アルファベット順へ全面変更する | 既存仕様とテストを壊し、今回の scope を超える |

## 3. 折りたたみ snippet の改行表現

### Decision: 折りたたみ snippet は文字列リテラル中に実改行を含めて定義する

### Rationale

- repository memory で、複数行 snippet は `\\n` ではなく実改行が必要と確認済み。
- 既存の table、footnote、mathblock も [src/snippets.ts](../../src/snippets.ts) で実改行を使っており、一貫性がある。
- [src/insertSyntaxCommand.ts](../../src/insertSyntaxCommand.ts) は `SnippetString` に文字列をそのまま渡すだけなので、定義側で改行を正しく持つ必要がある。

### Alternatives Considered

| 代替案 | 却下理由 |
|--------|---------|
| `\\n` を含む 1 行文字列で定義する | VS Code へ文字列 `\\n` がそのまま挿入される回帰を再発させる |
| 実行時に `replace(/\\\\n/g, '\n')` で変換する | 単純な静的データに不要なロジックを足し、レビュー性が下がる |

## 4. 最小テスト範囲

### Decision: `snippets.test.ts` と `completionProvider.test.ts` を拡張し、Quick Pick は既存 snippets テストで共有確認する

### Rationale

- [test/suite/snippets.test.ts](../../test/suite/snippets.test.ts) には snippet 内容、改行、固定順、Quick Pick 反映の既存テストパターンがある。
- [test/suite/completionProvider.test.ts](../../test/suite/completionProvider.test.ts) では trigger 文字列から候補へ到達できるかを検証しており、新規候補追加の主要経路をここで担保できる。
- offline 環境では pure Mocha unit tests を優先する既存方針とも一致する。

### Alternatives Considered

| 代替案 | 却下理由 |
|--------|---------|
| VS Code integration test を増やす | 今回は静的データ追加が中心で、offline 環境ではコストが高い |
| snippets テストだけで済ませる | 補完導線の到達性を直接検証できず、FR-006 のカバーが弱い |