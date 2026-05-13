import * as vscode from "vscode";
import { completionSnippets } from "./snippets";

export async function insertSyntaxCommand(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const picked = await vscode.window.showQuickPick(
    completionSnippets.map((snippet) => ({
      label: snippet.label,
      description: snippet.detail,
      snippet: snippet.snippet
    })),
    { placeHolder: "Select Markdown syntax to insert" }
  );

  if (!picked) {
    return;
  }

  await editor.insertSnippet(new vscode.SnippetString(picked.snippet));
}
