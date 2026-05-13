import * as vscode from "vscode";
import { MarkdownCompletionProvider } from "./completionProvider";
import { insertSyntaxCommand } from "./insertSyntaxCommand";

export function activate(context: vscode.ExtensionContext): void {
  const provider = new MarkdownCompletionProvider();
  const providerRegistration = vscode.languages.registerCompletionItemProvider(
    { language: "markdown", scheme: "file" },
    provider,
    ";"
  );
  const commandRegistration = vscode.commands.registerCommand(
    "markdown-cue.insertSyntax",
    insertSyntaxCommand
  );

  context.subscriptions.push(providerRegistration, commandRegistration);
}

export function deactivate(): void {
  // No-op by design.
}
