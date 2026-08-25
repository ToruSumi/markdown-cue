import type * as vscode from "vscode";
import { CompletionSnippet, completionSnippets } from "./snippets";
import { getActiveLocale, getLocalizedSnippets, getQuickPickPlaceholder } from "./i18n";

export interface SyntaxQuickPickItem {
  label: string;
  description?: string;
  snippet: string;
}

export function buildSyntaxQuickPickItems(
  snippets: ReadonlyArray<CompletionSnippet> = completionSnippets
): SyntaxQuickPickItem[] {
  return snippets.map((snippet) => ({
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

  const locale = getActiveLocale();
  const picked = await vscodeApi.window.showQuickPick(
    buildSyntaxQuickPickItems(getLocalizedSnippets(locale)),
    { placeHolder: getQuickPickPlaceholder(locale) }
  );

  if (!picked) {
    return;
  }

  await editor.insertSnippet(new vscodeApi.SnippetString(picked.snippet));
}
