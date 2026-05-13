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

  test("detects inline code regions", () => {
    const doc = createMockDocument(["normal `inline` text"]);

    assert.equal(isInInlineCode(doc, { line: 0, character: 10 } as vscode.Position), true);
    assert.equal(isInInlineCode(doc, { line: 0, character: 3 } as vscode.Position), false);
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
});
