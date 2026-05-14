import type * as vscode from "vscode";
import { completionSnippets } from "./snippets";
import {
  isInFencedCodeBlock,
  isInFrontMatter,
  isInInlineCode
} from "./contextDetector";

export interface CompletionItemData {
  label: string;
  insertText: string;
  filterText: string;
  sortText: string;
  startCharacter: number;
  endCharacter: number;
  icon: string;
}

export function buildCompletionItemData(
  lineText: string,
  cursorCharacter: number
): CompletionItemData[] {
  const segment = lineText.slice(0, cursorCharacter);
  const semicolonIndex = segment.lastIndexOf(";");
  if (semicolonIndex < 0) {
    return [];
  }

  const triggerText = segment.slice(semicolonIndex);
  if (!/^;[a-z0-9-]*$/i.test(triggerText)) {
    return [];
  }

  const normalizedQuery = triggerText.slice(1).toLowerCase();
  const matched = completionSnippets.filter((snippet) => {
    if (normalizedQuery.length === 0) {
      return true;
    }
    return snippet.filterText.toLowerCase().includes(`;${normalizedQuery}`);
  });

  return matched.map((snippet) => ({
    label: snippet.label,
    insertText: snippet.snippet,
    filterText: snippet.filterText,
    sortText: snippet.sortOrder,
    startCharacter: semicolonIndex,
    endCharacter: cursorCharacter,
    icon: snippet.icon
  }));
}

export class MarkdownCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext
  ): vscode.CompletionItem[] | undefined {
    if (
      isInFencedCodeBlock(document, position)
      || isInInlineCode(document, position)
      || isInFrontMatter(document, position)
    ) {
      return undefined;
    }

    const vscodeApi = require("vscode") as typeof import("vscode");
    const lineText = document.lineAt(position.line).text;
    const items = buildCompletionItemData(lineText, position.character);
    if (items.length === 0) {
      return undefined;
    }

    return items.map((item) => {
      const completion = new vscodeApi.CompletionItem(
        `${item.icon} ${item.label}`,
        vscodeApi.CompletionItemKind.Text
      );
      completion.insertText = new vscodeApi.SnippetString(item.insertText);
      completion.filterText = item.filterText;
      completion.sortText = item.sortText;
      completion.range = new vscodeApi.Range(
        new vscodeApi.Position(position.line, item.startCharacter),
        new vscodeApi.Position(position.line, item.endCharacter)
      );
      return completion;
    });
  }
}
