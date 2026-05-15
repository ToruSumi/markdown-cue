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

## Security and Privacy

- No telemetry
- No external API calls
- No runtime network access required
