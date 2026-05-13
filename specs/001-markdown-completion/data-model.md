# Data Model: Markdown Completion Provider

**Feature**: 001-markdown-completion
**Date**: 2026-05-13

## Entities

### CompletionSnippet

1つの Markdown 記法候補を表すデータ構造。

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `key` | `string` | 候補の一意識別子 (e.g., `"heading1"`, `"link"`) | 必須、ユニーク |
| `label` | `string` | 補完一覧に表示されるラベル (e.g., `"Heading 1"`) | 必須、ローカライズ対象 |
| `detail` | `string` | 補完一覧の副次情報 (e.g., `"# text"`) | 任意 |
| `documentation` | `string` | 補完候補の説明文 / 記法例 | 任意 |
| `snippet` | `string` | `SnippetString` 用のスニペット文字列 (e.g., `"# ${1:text}"`) | 必須、タブストップ含む |
| `sortOrder` | `string` | `sortText` に使用する並び順キー (e.g., `"00"`, `"01"`) | 必須 |
| `filterText` | `string` | VS Code の絞り込みに使われる文字列 (e.g., `";heading1"`) | 必須、`;` prefix |

**備考**: `CompletionSnippet` は immutable な静的データ。ランタイムでの変更は不要。

### DocumentContext

補完要求時にカーソル位置の文脈を判定するための一時的な状態。

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `isInFencedCodeBlock` | `boolean` | カーソルがフェンスドコードブロック内か | 走査で判定 |
| `isInInlineCode` | `boolean` | カーソルがインラインコード内か | 行内走査で判定 |
| `isInFrontMatter` | `boolean` | カーソルが YAML front matter 内か | 先頭走査で判定 |
| `triggerRange` | `vscode.Range` | トリガー文字 `;` からカーソルまでの範囲 | 補完置換用 |

**備考**: `DocumentContext` はリクエストごとに生成される一時オブジェクト。永続化しない。

## Relationships

```text
CompletionSnippet (static data, N items)
        |
        v
CompletionItemProvider.provideCompletionItems()
        |
        +-- DocumentContext (per-request, transient)
        |       |
        |       +-- isInFencedCodeBlock? → suppress
        |       +-- isInInlineCode? → suppress
        |       +-- isInFrontMatter? → suppress
        |
        +-- returns CompletionItem[] mapped from CompletionSnippet[]
```

## State Transitions

本機能にステートフルな状態遷移はない。すべてのリクエストは独立しており、前回のリクエスト結果に依存しない。

## Validation Rules

| Rule | Applied To | Description |
|------|-----------|-------------|
| V-001 | `CompletionSnippet.key` | 全候補間でユニークであること |
| V-002 | `CompletionSnippet.snippet` | 有効な VS Code SnippetString 構文であること |
| V-003 | `CompletionSnippet.filterText` | `;` で始まること |
| V-004 | `DocumentContext` | いずれかの抑制フラグが `true` の場合、空の候補配列を返す |
