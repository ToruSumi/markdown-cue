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

### New Syntax Smoke Check

1. `;strike` を入力して「Strikethrough」を選択し、`~~text~~` 形式で挿入されることを確認
2. `;check` を入力して「Checkbox」を選択し、`- [ ] text` 形式で挿入されることを確認
3. `;math` を入力して「Math Block」を選択し、`$$` / 本文 / `$$` の複数行で挿入されることを確認
4. コマンドパレットから `Markdown: Insert Syntax` を実行し、同じ3候補が同形式で挿入されることを確認

## Run Tests

```bash
npm test
```

## Validation Record

- Date: 2026-05-14
- Commands:
	- `npm run compile`
	- `npm test`
- Result: PASS (`24 passing`)

## Security Review Snapshot

- Runtime network access: none
- Telemetry and external API calls: none
- Completion/command paths reviewed: `src/completionProvider.ts`, `src/extension.ts`, `src/insertSyntaxCommand.ts`

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
