# Contracts: Markdown Completion Provider

**Feature**: 001-markdown-completion
**Date**: 2026-05-14

## 1. VS Code Extension Manifest (`package.json`)

拡張機能が VS Code に公開するインターフェース。

### Activation Events

```json
{
  "activationEvents": [
    "onLanguage:markdown",
    "onCommand:markdown-cue.insertSyntax"
  ]
}
```

- `onLanguage:markdown`: Markdown ファイルを開いた時にのみアクティベート
- `onCommand:markdown-cue.insertSyntax`: コマンド実行時の遅延アクティベーションを保証する

### Commands

```json
{
  "contributes": {
    "commands": [
      {
        "command": "markdown-cue.insertSyntax",
        "title": "Markdown: Insert Syntax",
        "enablement": "editorLangId == markdown"
      }
    ]
  }
}
```

| Field | Value | Description |
|-------|-------|-------------|
| `command` | `markdown-cue.insertSyntax` | コマンド識別子 |
| `title` | `Markdown: Insert Syntax` | コマンドパレット表示名 |
| `enablement` | `editorLangId == markdown` | Markdown エディタでのみ有効 |

### Languages

補完プロバイダはプログラムで `markdown` 言語に登録するため、`contributes.languages` は不要。

## 2. CompletionItemProvider Contract

```typescript
interface MarkdownCompletionProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.CompletionItem[] | undefined;
}
```

**登録**:
```typescript
vscode.languages.registerCompletionItemProvider(
  { language: 'markdown', scheme: 'file' },
  provider,
  ';'  // trigger character
);
```

**戻り値の契約**:
- 候補抑制条件（コードブロック / インラインコード / front matter）に該当 → `undefined` を返す
- 通常時 → `CompletionSnippet[]` から変換した `CompletionItem[]` を返す
- 各 `CompletionItem` は以下を設定:
  - `kind`: `CompletionItemKind.Text`（ラベルに絵文字アイコンを付与して表示）
  - `insertText`: `new SnippetString(snippet)`
  - `range`: トリガー文字 `;` からカーソル位置まで
  - `filterText`: `;` + key
  - `sortText`: 並び順キー（FR-010 の固定順に一致）

### Snippet Coverage Contract

実装は最低限以下の記法候補を含む必要がある。

- 見出し（H1〜H3）
- 太字、斜体
- リンク、画像
- 表、コードブロック、引用、脚注、水平線
- 取り消し線、チェックボックス、数式ブロック（複数行）

## 3. Quick Pick Command Contract

```typescript
// Command: markdown-cue.insertSyntax
// Trigger: Command Palette → "Markdown: Insert Syntax"

// Flow:
// 1. Show QuickPick with all snippet labels
// 2. User selects a snippet
// 3. Insert SnippetString at active cursor position
```

**入力**: なし（アクティブエディタのカーソル位置を使用）
**出力**: 選択された記法のスニペットをエディタに挿入
**エラー**: アクティブエディタがない場合は何もしない
