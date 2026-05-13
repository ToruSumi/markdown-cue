# Quickstart: Markdown Completion Provider

## Prerequisites

- Node.js 18+
- VS Code 1.85+

## Setup

```bash
# Clone & install
git clone <repo-url> markdown-cue
cd markdown-cue
npm install

# Build
npm run compile
```

## Run (Development)

1. VS Code でプロジェクトを開く
2. `F5` を押して Extension Development Host を起動
3. `.md` ファイルを開く
4. `;` を入力 → 補完候補が表示される
5. 候補を選択 → Markdown 記法が挿入される

## Run Tests

```bash
npm test
```

## Key Files

| File | Purpose |
|------|---------|
| `src/extension.ts` | エントリポイント。プロバイダ・コマンド登録 |
| `src/completionProvider.ts` | CompletionItemProvider 実装 |
| `src/snippets.ts` | スニペット定義データ |
| `src/contextDetector.ts` | コードブロック / front matter 判定 |
| `src/insertSyntaxCommand.ts` | Quick Pick コマンド |
| `package.json` | 拡張マニフェスト（commands, activationEvents） |

## Commands

| Command | Description |
|---------|-------------|
| `Markdown: Insert Syntax` | コマンドパレットから記法を選択・挿入 |
