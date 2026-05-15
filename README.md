# Markdown Cue

Markdown Cue is a VS Code extension that provides Markdown snippet completions triggered by `;`.

## Features

- Trigger-based completion for Markdown syntax in Markdown files
- Snippet insertion with tabstops
- Context-aware suppression inside:
  - fenced code blocks
  - inline code
  - YAML front matter
- Command palette entry: `Markdown: Insert Syntax`

## Usage

1. Open a Markdown file.
2. Type `;`, `;link`, `;strike`, `;check`, or `;math` to trigger completion suggestions.
3. Pick a suggestion to insert the snippet.
4. Optional: run `Markdown: Insert Syntax` from the command palette.

## Development

```bash
npm install
npm run compile
npm test
```

## Supported VS Code

- VS Code 1.85+

## Installation from VSIX

You can install this extension directly from the VSIX file attached to each [GitHub Release](https://github.com/ToruSumi/markdown-cue/releases).

### Using the CLI

```bash
code --install-extension markdown-cue-<version>.vsix
```

### Using VS Code UI

1. Open VS Code
2. Open the Extensions view (`Ctrl+Shift+X`)
3. Click the `...` menu at the top of the Extensions view
4. Select **Install from VSIX...**
5. Choose the downloaded `.vsix` file

## Release Procedure

1. Update the `version` field in `package.json`
2. Commit the change and merge to `master`
3. Create a new Release on GitHub (via the GitHub UI)
4. When the Release is **published**, CI automatically builds the VSIX and attaches it to the Release

## Security and Privacy

- No telemetry
- No external API calls
- No runtime network access required
