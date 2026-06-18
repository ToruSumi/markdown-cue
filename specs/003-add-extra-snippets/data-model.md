# Data Model: Additional Markdown Snippets

**Feature**: [spec.md](spec.md) | **Date**: 2026-05-21

## Entities

### 1. Snippet Catalog Entry

共有 snippet カタログ中の 1 エントリ。補完候補一覧と Quick Pick 一覧の両方の元データになる。

| 属性 | 型 | 説明 |
|------|------|------|
| `key` | string | 一意識別子。テストや順序検証の基準 |
| `label` | string | ユーザーに表示する候補名 |
| `detail` | string | 候補一覧・Quick Pick で見せる簡易フォーマット |
| `documentation` | string | 候補の短い説明 |
| `snippet` | string | `SnippetString` に渡す挿入テンプレート |
| `sortOrder` | string | 補完一覧の安定順序を表す文字列 |
| `filterText` | string | `;` から始まる絞り込み用文字列 |
| `icon` | string | 補完表示ラベルの先頭に付く視認用アイコン |

### 2. Completion Item Data

[src/completionProvider.ts](../../src/completionProvider.ts) で生成される補完候補データ。共有カタログを表示用に変換したもの。

| 属性 | 型 | 説明 |
|------|------|------|
| `label` | string | 表示名 |
| `insertText` | string | 挿入される snippet 本文 |
| `filterText` | string | 入力絞り込みに使う文字列 |
| `sortText` | string | 補完表示順 |
| `startCharacter` | number | 置換開始位置 |
| `endCharacter` | number | 置換終了位置 |
| `icon` | string | 表示プレフィックス用アイコン |

### 3. Syntax Quick Pick Item

[src/insertSyntaxCommand.ts](../../src/insertSyntaxCommand.ts) で生成されるコマンド選択項目。

| 属性 | 型 | 説明 |
|------|------|------|
| `label` | string | Quick Pick の表示名 |
| `description` | string | 記法の簡易プレビュー |
| `snippet` | string | 選択時に挿入するテンプレート |

## Entity Relationships

```text
Snippet Catalog Entry (src/snippets.ts)
    │
    ├── mapped by buildCompletionItemData()
    │       └── Completion Item Data
    │               └── Completion popup in Markdown editor
    │
    └── mapped by buildSyntaxQuickPickItems()
            └── Syntax Quick Pick Item
                    └── Command palette insertion flow
```

## Validation Rules

- `key` は全エントリで一意でなければならない。
- `filterText` は `;` で始まり、新規候補も既存の検索規則に従わなければならない。
- 複数行 snippet は文字列 `\\n` を含まず、実改行を含まなければならない。
- 新規候補追加後も既存候補の `sortOrder` を変更してはならない。
- Quick Pick 項目数は共有 snippet 数と一致しなければならない。

## State Transitions

```text
User types ';query' in Markdown
    │
    ▼
buildCompletionItemData filters catalog
    │
    ▼
Completion item selected
    │
    ▼
Snippet inserted into editor

User runs "Markdown: Insert Syntax"
    │
    ▼
buildSyntaxQuickPickItems maps catalog
    │
    ▼
Quick Pick item selected
    │
    ▼
Same snippet inserted into editor
```