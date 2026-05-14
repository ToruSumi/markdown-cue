import { strict as assert } from "assert";
import type * as vscode from "vscode";
import {
  isInFencedCodeBlock,
  isInFrontMatter,
  isInInlineCode
} from "../../src/contextDetector";

function createMockDocument(lines: string[]): vscode.TextDocument {
  return {
    lineCount: lines.length,
    lineAt: (line: number) => ({ text: lines[line] })
  } as unknown as vscode.TextDocument;
}

suite("contextDetector", () => {
  test("detects fenced code block regions", () => {
    const doc = createMockDocument([
      "before",
      "```ts",
      "const x = 1;",
      "```",
      "after"
    ]);

    assert.equal(isInFencedCodeBlock(doc, { line: 2, character: 3 } as vscode.Position), true);
    assert.equal(isInFencedCodeBlock(doc, { line: 4, character: 2 } as vscode.Position), false);
  });

  test("handles fence transitions with tilde fences", () => {
    const doc = createMockDocument([
      "before",
      "~~~js",
      "const x = ';';",
      "~~~",
      "after"
    ]);

    assert.equal(isInFencedCodeBlock(doc, { line: 2, character: 5 } as vscode.Position), true);
    assert.equal(isInFencedCodeBlock(doc, { line: 4, character: 1 } as vscode.Position), false);
  });

  test("detects inline code regions", () => {
    const doc = createMockDocument(["normal `inline` text"]);

    assert.equal(isInInlineCode(doc, { line: 0, character: 10 } as vscode.Position), true);
    assert.equal(isInInlineCode(doc, { line: 0, character: 3 } as vscode.Position), false);
  });

  test("ignores escaped inline backticks", () => {
    const doc = createMockDocument(["escaped \\`tick\\` and `real`"]);
    assert.equal(isInInlineCode(doc, { line: 0, character: 10 } as vscode.Position), false);
    assert.equal(isInInlineCode(doc, { line: 0, character: 24 } as vscode.Position), true);
  });

  test("detects YAML front matter regions", () => {
    const doc = createMockDocument([
      "---",
      "title: demo",
      "tags: [a, b]",
      "---",
      "# body"
    ]);

    assert.equal(isInFrontMatter(doc, { line: 1, character: 2 } as vscode.Position), true);
    assert.equal(isInFrontMatter(doc, { line: 4, character: 1 } as vscode.Position), false);
  });

  test("returns false when closing front matter marker is missing", () => {
    const doc = createMockDocument([
      "---",
      "title: demo"
    ]);

    assert.equal(isInFrontMatter(doc, { line: 1, character: 1 } as vscode.Position), false);
  });
});
