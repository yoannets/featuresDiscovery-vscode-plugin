import * as vscode from "vscode";
import path from "path";
import fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  // Command to show the webview
  let disposable = vscode.commands.registerCommand(
    "extension.featureDiscovery",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "graph",
        "Graph View",
        vscode.ViewColumn.One,
        {}
      );

      const htmlPath = path.join(context.extensionPath, "index.html");
      panel.webview.html = fs.readFileSync(htmlPath, "utf-8");
    }
  );

  context.subscriptions.push(disposable);
}
