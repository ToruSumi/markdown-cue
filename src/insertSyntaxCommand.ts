import type * as vscode from "vscode";
import { completionSnippets } from "./snippets";

export interface SyntaxQuickPickItem {
  label: string;
  description?: string;
  snippet: string;
}

export function buildSyntaxQuickPickItems(): SyntaxQuickPickItem[] {
  return completionSnippets.map((snippet) => ({
    label: snippet.label,
    description: snippet.detail,
    snippet: snippet.snippet
  }));
}

export async function insertSyntaxCommand(): Promise<void> {
  const vscodeApi = require("vscode") as typeof import("vscode");
  const editor = vscodeApi.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const picked = await vscodeApi.window.showQuickPick(
    buildSyntaxQuickPickItems(),
    { placeHolder: "Select Markdown syntax to insert" }
  );

  if (!picked) {
    return;
  }

  await editor.insertSnippet(new vscodeApi.SnippetString(picked.snippet));
}
