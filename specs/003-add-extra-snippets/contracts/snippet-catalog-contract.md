# Snippet Catalog Contract: Additional Markdown Snippets

**Feature**: [spec.md](../spec.md) | **Date**: 2026-05-21

## 1. Scope Contract

| 項目 | 契約 |
|------|------|
| 対象導線 | Markdown 補完候補一覧、`Markdown: Insert Syntax` コマンドの Quick Pick |
| 追加項目数 | 2 件（下線、折りたたみ） |
| 非対象 | Markdown 以外の文書、レンダラ固有の表示保証 |

## 2. Catalog Entry Contract

### Underline

| 項目 | 値 |
|------|------|
| 表示名 | 英語ラベル 1 件 |
| detail | `<u>text</u>` |
| insert snippet | `<u>${1:text}</u>` |
| 編集順 | `text` |
| filter path | `;` から始まる既存規則に従う |

### Details

| 項目 | 値 |
|------|------|
| 表示名 | 英語ラベル 1 件 |
| detail | `<details>` ベースの折りたたみテンプレート |
| insert snippet | `<details>`、`<summary>${1:summary}</summary>`、`${2:body}`、`</details>` を含む複数行テンプレート |
| 編集順 | `summary` → `body` |
| filter path | `;` から始まる既存規則に従う |

## 3. Completion Contract

| 項目 | 契約 |
|------|------|
| 表示条件 | Markdown 文書内で trigger 文字 `;` から始まる入力列があること |
| 非表示条件 | Markdown 以外、または既存 context detector により抑制される場所 |
| 表示粒度 | 既存候補と同様にアイコン付きラベルで表示 |
| 並び順 | 既存候補順を維持し、新規項目は安定した `sortOrder` を持つ |

## 4. Quick Pick Contract

| 項目 | 契約 |
|------|------|
| データソース | 共有 snippet カタログと同一 |
| 項目数 | 共有 snippet 数と一致 |
| description | 各候補の `detail` を表示 |
| 選択結果 | 補完経路と同一の snippet が挿入される |

## 5. Multiline Contract

| 項目 | 契約 |
|------|------|
| 対象 | Details snippet |
| 改行形式 | 実改行 |
| 禁止事項 | 文字列 `\\n` を本文として挿入しない |
| 検証 | unit test で insert text と shared snippet の双方を確認 |

## 6. Regression Contract

| 項目 | 契約 |
|------|------|
| 既存候補 | ラベル、挿入内容、順序を変更しない |
| 新規依存 | 追加しない |
| 通信 | 追加しない |
| テスト | snippets と completion provider の既存 unit test 群を拡張して回帰を検知する |