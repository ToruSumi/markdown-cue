import type * as vscode from "vscode";

function isFenceLine(text: string): boolean {
  const trimmed = text.trimStart();
  return trimmed.startsWith("```") || trimmed.startsWith("~~~");
}

export function isInFencedCodeBlock(document: vscode.TextDocument, position: vscode.Position): boolean {
  let isOpen = false;

  for (let line = 0; line <= position.line; line += 1) {
    const text = document.lineAt(line).text;
    if (isFenceLine(text)) {
      isOpen = !isOpen;
    }
  }

  return isOpen;
}

export function isInInlineCode(document: vscode.TextDocument, position: vscode.Position): boolean {
  const lineText = document.lineAt(position.line).text.slice(0, position.character);
  let tickCount = 0;

  for (let i = 0; i < lineText.length; i += 1) {
    if (lineText[i] === "`" && lineText[i - 1] !== "\\") {
      tickCount += 1;
    }
  }

  return tickCount % 2 === 1;
}

export function isInFrontMatter(document: vscode.TextDocument, position: vscode.Position): boolean {
  if (document.lineCount < 2) {
    return false;
  }

  if (document.lineAt(0).text.trim() !== "---") {
    return false;
  }

  let endLine = -1;
  for (let line = 1; line < document.lineCount; line += 1) {
    if (document.lineAt(line).text.trim() === "---") {
      endLine = line;
      break;
    }
  }

  if (endLine === -1) {
    return false;
  }

  return position.line <= endLine;
}
