# Research: Markdown Completion Provider

**Feature**: 001-markdown-completion
**Date**: 2026-05-13

## Research Tasks

### 1. CompletionItemProvider: トリガー文字 + range 置換

**Decision**: `registerCompletionItemProvider` の第3引数にトリガー文字 `;` を登録し、`provideCompletionItems` 内でカーソル行のテキストから `;` の位置を特定して `CompletionItem.range` に設定する

**Rationale**:
- VS Code API ではトリガー文字は単一文字のみ指定可能（`;` が適合）
- `range` を明示指定すると、トリガー文字から始まる入力列（`;link` 等）全体が候補選択時に置換される
- `filterText` に `;link` 形式を設定することで VS Code 内蔵の fuzzy matching が絞り込みに使われる
- `insertText` に `SnippetString` を使うことでタブストップが自然に動作する

**Alternatives considered**:
- `CompletionItem.additionalTextEdits` でトリガーを消す方式 → `range` の方がシンプルで公式推奨
- 2文字トリガー（`;;` 等） → API が単一文字のみ受け付けるため不可。プレフィックスマッチで代替

### 2. コードブロック / front matter 判定手法

**Decision**: カーソル位置の行番号を基に、ドキュメント先頭から走査して以下をカウントする軽量アルゴリズムを採用する

1. **YAML front matter**: 先頭行が `---` かつ、それ以降に閉じ `---` がある場合、その範囲内ならば抑制
2. **フェンスドコードブロック**: ` ``` ` または `~~~` で始まる行をトグルカウントし、奇数回目のフェンス〜偶数回目のフェンスの間なら抑制
3. **インラインコード**: カーソル行の `` ` `` の出現回数をカーソル位置まで数え、奇数個なら抑制

**Rationale**:
- Markdown パーサ（markdown-it 等）を依存に追加しない（憲法 IV: 依存最小化）
- 行テキストの正規表現走査のみで完結し、パフォーマンス影響なし（候補数が少なく同期処理で十分）
- VS Code の tokenization API (`DocumentSemanticTokensProvider`) は Markdown では不安定なため回避

**Alternatives considered**:
- `vscode.commands.executeCommand('vscode.provideDocumentSemanticTokens')` → Markdown での token 分類が不安定
- markdown-it パーサで AST 構築 → 依存追加が不要な判定に対して過剰
- TextMate スコープの利用 (`document.getWordRangeAtPosition` + token scopes) → 内部 API に依存し安定性が低い

### 3. ローカライズ可能なスニペット定義パターン

**Decision**: スニペット定義を独立したデータ構造（配列 of オブジェクト）として `snippets.ts` に分離し、ラベル・説明文をキーベースで管理する。MVP では英語文字列を直接格納し、将来は VS Code の `l10n` API またはメッセージバンドルに差し替え可能とする

**Rationale**:
- VS Code の `vscode.l10n.t()` API（1.73+）が公式のローカライズ手段
- MVP ではラベルを `l10n.t()` で wrap するだけの準備をし、実際の翻訳ファイルは後から追加可能
- スニペット定義を別ファイルに分離することで、候補追加時に補完ロジックの変更が不要

**Alternatives considered**:
- `package.nls.json` ベースの従来方式 → `l10n` API が推奨される新しい標準
- i18next 等の外部ライブラリ → 依存追加が憲法 IV に反する
- ハードコード → 将来のローカライズが困難になる

## Summary

| Topic | Decision | Key Reason |
|-------|----------|------------|
| 補完トリガー + 置換 | `range` + `filterText` + `SnippetString` | 公式推奨、シンプル |
| 文脈判定 | 行走査アルゴリズム（パーサ不使用） | 依存なし、軽量 |
| ローカライズ構造 | `snippets.ts` 分離 + `l10n.t()` wrap 準備 | 将来拡張可能、依存なし |
